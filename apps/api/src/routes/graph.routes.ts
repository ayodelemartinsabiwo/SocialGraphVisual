/**
 * Graph routes
 * @module routes/graph
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import { z } from 'zod';
import { requireAuth, devAuth } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams, platformSchema, paginationSchema, idParamSchema } from '../middleware/validation.js';
import { uploadRateLimiter } from '../middleware/rateLimit.js';
import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler.js';

const router: IRouter = Router();

// ============================================================
// SCHEMAS
// ============================================================

const initiateUploadSchema = z.object({
  platform: platformSchema,
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive(),
});

const createGraphSchema = z.object({
  uploadId: z.string().cuid(),
  platform: platformSchema,
  nodes: z.array(z.object({
    id: z.string(),
    type: z.enum(['SELF', 'USER']),
    displayName: z.string(),
    username: z.string(),
    followerCount: z.number().optional(),
    followingCount: z.number().optional(),
    engagementScore: z.number().optional(),
  })),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    type: z.enum(['FOLLOWS', 'FOLLOWED_BY', 'MUTUAL', 'ENGAGES_WITH']),
    weight: z.number().min(0).max(1),
    interactions: z.object({
      likes: z.number().optional(),
      comments: z.number().optional(),
      shares: z.number().optional(),
      messages: z.number().optional(),
      mentions: z.number().optional(),
    }).optional(),
  })),
  metadata: z.object({
    parseVersion: z.string(),
    parsingErrors: z.array(z.object({
      code: z.string(),
      message: z.string(),
      recoverable: z.boolean(),
    })),
    timePeriod: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    }).optional(),
    sourceFileInfo: z.object({
      fileName: z.string(),
      fileSize: z.number(),
      checksum: z.string(),
    }),
  }),
});

const listGraphsSchema = paginationSchema.extend({
  platform: platformSchema.optional(),
  status: z.enum(['PROCESSING', 'READY', 'ERROR']).optional(),
});

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /graphs/upload/initiate
 * Initiate a file upload
 */
router.post(
  '/upload/initiate',
  devAuth,
  uploadRateLimiter,
  validateBody(initiateUploadSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { platform, fileName, fileSize } = req.body;

      // Create upload record
      const upload = await prisma.upload.create({
        data: {
          userId,
          platform,
          fileName,
          fileSize,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // TODO: Generate Tus upload URL
      const uploadUrl = `/api/v1/graphs/upload/${upload.id}`;

      res.status(201).json({
        success: true,
        data: {
          uploadId: upload.id,
          uploadUrl,
          expiresAt: upload.expiresAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /graphs
 * Create a new graph from parsed data
 */
router.post(
  '/',
  devAuth,
  validateBody(createGraphSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { uploadId, platform, nodes, edges, metadata } = req.body;

      // Get the next version for this user/platform
      const existingGraphs = await prisma.graph.count({
        where: { userId, platform },
      });
      const version = existingGraphs + 1;

      // Mark previous graphs as not latest
      await prisma.graph.updateMany({
        where: { userId, platform, isLatest: true },
        data: { isLatest: false },
      });

      // Create the graph (serialize JSON for SQLite)
      // Calculate basic statistics during creation
      const nodeCount = nodes.length;
      const edgeCount = edges.length;
      const density = nodeCount > 1 ? edgeCount / (nodeCount * (nodeCount - 1)) : 0;
      const averageDegree = nodeCount > 0 ? (2 * edgeCount) / nodeCount : 0;
      
      // Count mutual connections (estimate)
      const mutualEdges = edges.filter((e: { type?: string }) => e.type === 'MUTUAL').length;
      const mutualPercentage = edgeCount > 0 ? (mutualEdges / edgeCount) * 100 : 0;

      const graph = await prisma.graph.create({
        data: {
          userId,
          platform,
          version,
          isLatest: true,
          status: 'READY', // Set to READY immediately for MVP
          nodesData: JSON.stringify(nodes),
          edgesData: JSON.stringify(edges),
          metadata: JSON.stringify({
            uploadId,
            ...metadata,
            statistics: {
              nodeCount,
              edgeCount,
              density,
              averageDegree,
            },
          }),
          // Basic statistics for insights display
          statistics: JSON.stringify({
            communities: {
              count: Math.max(1, Math.floor(nodeCount / 50)), // Estimate: ~50 nodes per community
              sizes: [],
              modularity: 0,
            },
            centrality: {
              pageRank: {
                selfScore: 1.0,
                selfPercentile: Math.min(99, 50 + Math.log10(nodeCount) * 15), // Estimate based on network size
                maxScore: 1.0,
                topNodes: [],
              },
            },
            engagement: {
              activePercentage: mutualPercentage > 0 ? mutualPercentage : 5.0, // Estimate
              avgInteractions: 0,
              topEngagers: [],
            },
          }),
        },
      });

      // TODO: Queue graph processing job (Louvain, PageRank, etc.) for more accurate statistics

      res.status(201).json({
        success: true,
        data: {
          id: graph.id,
          platform: graph.platform,
          version: graph.version,
          status: graph.status,
          nodeCount: nodes.length,
          edgeCount: edges.length,
          createdAt: graph.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /graphs
 * List user's graphs
 */
router.get(
  '/',
  devAuth,
  validateQuery(listGraphsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { page, pageSize, sortBy, sortOrder, platform, status } = req.query as unknown as z.infer<typeof listGraphsSchema>;

      const where = {
        userId,
        ...(platform && { platform }),
        ...(status && { status }),
      };

      const [graphs, total] = await Promise.all([
        prisma.graph.findMany({
          where,
          orderBy: { [sortBy || 'createdAt']: sortOrder },
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            platform: true,
            version: true,
            isLatest: true,
            status: true,
            metadata: true,
            statistics: true,
            createdAt: true,
          },
        }),
        prisma.graph.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          graphs: graphs.map(g => {
            // Parse JSON strings from SQLite
            const metadata = typeof g.metadata === 'string' ? JSON.parse(g.metadata) : g.metadata;
            const statistics = g.statistics ? (typeof g.statistics === 'string' ? JSON.parse(g.statistics) : g.statistics) : null;
            return {
              id: g.id,
              platform: g.platform,
              version: g.version,
              isLatest: g.isLatest,
              status: g.status,
              nodeCount: metadata?.statistics?.nodeCount || 0,
              edgeCount: metadata?.statistics?.edgeCount || 0,
              communityCount: statistics?.communities?.count || null,
              createdAt: g.createdAt.toISOString(),
            };
          }),
          total,
          page,
          pageSize,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /graphs/:id
 * Get a specific graph
 */
router.get(
  '/:id',
  devAuth,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      const graph = await prisma.graph.findUnique({
        where: { id },
      });

      if (!graph) {
        throw new NotFoundError('Graph not found');
      }

      if (graph.userId !== userId) {
        throw new ForbiddenError('You do not have access to this graph');
      }

      // Parse JSON strings from SQLite
      const nodes = typeof graph.nodesData === 'string' ? JSON.parse(graph.nodesData) : graph.nodesData;
      const edges = typeof graph.edgesData === 'string' ? JSON.parse(graph.edgesData) : graph.edgesData;
      const metadata = typeof graph.metadata === 'string' ? JSON.parse(graph.metadata) : graph.metadata;
      const statistics = graph.statistics ? (typeof graph.statistics === 'string' ? JSON.parse(graph.statistics) : graph.statistics) : null;

      res.status(200).json({
        success: true,
        data: {
          id: graph.id,
          userId: graph.userId,
          platform: graph.platform,
          version: graph.version,
          isLatest: graph.isLatest,
          status: graph.status,
          nodes,
          edges,
          metadata,
          statistics,
          createdAt: graph.createdAt.toISOString(),
          updatedAt: graph.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /graphs/:id
 * Delete a graph
 */
router.delete(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      const graph = await prisma.graph.findUnique({
        where: { id },
      });

      if (!graph) {
        throw new NotFoundError('Graph not found');
      }

      if (graph.userId !== userId) {
        throw new ForbiddenError('You do not have access to this graph');
      }

      await prisma.graph.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        data: {
          message: 'Graph deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
