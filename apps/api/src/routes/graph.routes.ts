/**
 * Graph routes
 * @module routes/graph
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
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
  requireAuth,
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
  requireAuth,
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

      // Create the graph
      const graph = await prisma.graph.create({
        data: {
          userId,
          platform,
          version,
          isLatest: true,
          status: 'PROCESSING',
          nodesData: nodes,
          edgesData: edges,
          metadata: {
            uploadId,
            ...metadata,
            statistics: {
              nodeCount: nodes.length,
              edgeCount: edges.length,
              density: edges.length / (nodes.length * (nodes.length - 1)) || 0,
              averageDegree: (2 * edges.length) / nodes.length || 0,
            },
          },
        },
      });

      // TODO: Queue graph processing job (Louvain, PageRank, etc.)

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
  requireAuth,
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
          graphs: graphs.map(g => ({
            id: g.id,
            platform: g.platform,
            version: g.version,
            isLatest: g.isLatest,
            status: g.status,
            nodeCount: (g.metadata as any)?.statistics?.nodeCount || 0,
            edgeCount: (g.metadata as any)?.statistics?.edgeCount || 0,
            communityCount: (g.statistics as any)?.communities?.count || null,
            createdAt: g.createdAt.toISOString(),
          })),
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

      res.status(200).json({
        success: true,
        data: {
          id: graph.id,
          userId: graph.userId,
          platform: graph.platform,
          version: graph.version,
          isLatest: graph.isLatest,
          status: graph.status,
          nodes: graph.nodesData,
          edges: graph.edgesData,
          metadata: graph.metadata,
          statistics: graph.statistics,
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
