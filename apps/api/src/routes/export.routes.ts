/**
 * Export routes
 * @module routes/export
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams, exportTypeSchema, paginationSchema, idParamSchema } from '../middleware/validation.js';
import { exportRateLimiter } from '../middleware/rateLimit.js';
import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler.js';

const router: IRouter = Router();

// ============================================================
// SCHEMAS
// ============================================================

const createExportSchema = z.object({
  graphId: z.string().cuid(),
  type: exportTypeSchema,
  options: z.record(z.unknown()).optional(),
});

const listExportsSchema = paginationSchema.extend({
  graphId: z.string().cuid().optional(),
  type: exportTypeSchema.optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
});

// ============================================================
// HELPERS
// ============================================================

function getExportFormat(type: string): string {
  switch (type) {
    case 'PDF_REPORT':
      return 'PDF';
    case 'SOCIAL_CARD':
      return 'PNG';
    case 'DATA_CSV':
      return 'CSV';
    case 'DATA_JSON':
      return 'JSON';
    default:
      return 'PNG';
  }
}

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /exports
 * Create a new export
 */
router.post(
  '/',
  requireAuth,
  exportRateLimiter,
  validateBody(createExportSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { graphId, type, options } = req.body;

      // Verify user owns the graph
      const graph = await prisma.graph.findUnique({
        where: { id: graphId },
        select: { userId: true, status: true },
      });

      if (!graph) {
        throw new NotFoundError('Graph not found');
      }

      if (graph.userId !== userId) {
        throw new ForbiddenError('You do not have access to this graph');
      }

      if (graph.status !== 'READY') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'GRAPH_NOT_READY',
            message: 'Graph is still processing. Please wait.',
          },
        });
      }

      // Create export record (serialize JSON for SQLite)
      const exportRecord = await prisma.export.create({
        data: {
          userId,
          graphId,
          type: type as any,
          format: getExportFormat(type) as any,
          status: 'PENDING',
          options: options ? JSON.stringify(options) : null,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // TODO: Queue export job

      res.status(201).json({
        success: true,
        data: {
          id: exportRecord.id,
          type: exportRecord.type,
          format: exportRecord.format,
          status: exportRecord.status,
          estimatedTime: 30, // seconds
          createdAt: exportRecord.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /exports
 * List user's exports
 */
router.get(
  '/',
  requireAuth,
  validateQuery(listExportsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { graphId, type, status, page, pageSize, sortOrder } = req.query as unknown as z.infer<typeof listExportsSchema>;

      const where = {
        userId,
        ...(graphId && { graphId }),
        ...(type && { type }),
        ...(status && { status }),
      };

      const [exports, total] = await Promise.all([
        prisma.export.findMany({
          where,
          orderBy: { createdAt: sortOrder },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.export.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          exports: exports.map(e => ({
            id: e.id,
            graphId: e.graphId,
            type: e.type,
            format: e.format,
            status: e.status,
            fileName: e.fileName,
            fileSize: e.fileSize,
            createdAt: e.createdAt.toISOString(),
            completedAt: e.completedAt?.toISOString() || null,
          })),
          total,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /exports/:id
 * Get a specific export
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      const exportRecord = await prisma.export.findUnique({
        where: { id },
      });

      if (!exportRecord) {
        throw new NotFoundError('Export not found');
      }

      if (exportRecord.userId !== userId) {
        throw new ForbiddenError('You do not have access to this export');
      }

      res.status(200).json({
        success: true,
        data: {
          id: exportRecord.id,
          type: exportRecord.type,
          format: exportRecord.format,
          status: exportRecord.status,
          fileUrl: exportRecord.fileUrl,
          fileSize: exportRecord.fileSize,
          fileName: exportRecord.fileName,
          expiresAt: exportRecord.expiresAt?.toISOString() || null,
          createdAt: exportRecord.createdAt.toISOString(),
          completedAt: exportRecord.completedAt?.toISOString() || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
