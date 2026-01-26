/**
 * Insight routes
 * @module routes/insight
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validateBody, validateQuery, validateParams, insightCategorySchema, paginationSchema, idParamSchema } from '../middleware/validation.js';
import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler.js';

const router: IRouter = Router();

// ============================================================
// SCHEMAS
// ============================================================

const listInsightsSchema = paginationSchema.extend({
  graphId: z.string().cuid(),
  category: insightCategorySchema.optional(),
  type: z.string().optional(),
});

const generateInsightsSchema = z.object({
  graphId: z.string().cuid(),
  categories: z.array(insightCategorySchema).optional(),
  types: z.array(z.string()).optional(),
  regenerate: z.boolean().optional().default(false),
});

// ============================================================
// ROUTES
// ============================================================

/**
 * GET /insights
 * List insights for a graph
 */
router.get(
  '/',
  requireAuth,
  validateQuery(listInsightsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { graphId, category, type, page, pageSize, sortOrder } = req.query as unknown as z.infer<typeof listInsightsSchema>;

      // Verify user owns the graph
      const graph = await prisma.graph.findUnique({
        where: { id: graphId },
        select: { userId: true },
      });

      if (!graph) {
        throw new NotFoundError('Graph not found');
      }

      if (graph.userId !== userId) {
        throw new ForbiddenError('You do not have access to this graph');
      }

      const where = {
        graphId,
        ...(category && { category }),
        ...(type && { type }),
      };

      const [insights, total] = await Promise.all([
        prisma.insight.findMany({
          where,
          orderBy: [
            { priority: 'desc' },
            { createdAt: sortOrder },
          ],
          skip: (page - 1) * pageSize,
          take: pageSize,
          select: {
            id: true,
            category: true,
            type: true,
            title: true,
            description: true,
            confidence: true,
            priority: true,
            isHighlighted: true,
            createdAt: true,
          },
        }),
        prisma.insight.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          insights: insights.map(i => ({
            id: i.id,
            category: i.category,
            type: i.type,
            title: i.title,
            description: i.description,
            confidence: i.confidence,
            priority: i.priority,
            isHighlighted: i.isHighlighted,
            createdAt: i.createdAt.toISOString(),
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
 * GET /insights/:id
 * Get a specific insight
 */
router.get(
  '/:id',
  requireAuth,
  validateParams(idParamSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const id = req.params.id as string;

      const insight = await prisma.insight.findUnique({
        where: { id },
      });

      if (!insight) {
        throw new NotFoundError('Insight not found');
      }

      // Verify user owns the graph
      const graph = await prisma.graph.findUnique({
        where: { id: insight.graphId },
        select: { userId: true },
      });

      if (!graph || graph.userId !== userId) {
        throw new ForbiddenError('You do not have access to this insight');
      }

      // Parse JSON strings from SQLite
      const data = typeof insight.data === 'string' ? JSON.parse(insight.data) : insight.data;
      const actions = insight.actions ? (typeof insight.actions === 'string' ? JSON.parse(insight.actions) : insight.actions) : null;
      const visualAnnotations = insight.visualAnnotations ? (typeof insight.visualAnnotations === 'string' ? JSON.parse(insight.visualAnnotations) : insight.visualAnnotations) : null;

      res.status(200).json({
        success: true,
        data: {
          id: insight.id,
          graphId: insight.graphId,
          category: insight.category,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          data,
          confidence: insight.confidence,
          actions,
          visualAnnotations,
          priority: insight.priority,
          isHighlighted: insight.isHighlighted,
          createdAt: insight.createdAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /insights/generate
 * Generate insights for a graph
 */
router.post(
  '/generate',
  requireAuth,
  validateBody(generateInsightsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { graphId, categories, types, regenerate } = req.body;

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

      // Delete existing insights if regenerating
      if (regenerate) {
        const deleteWhere = {
          graphId,
          ...(categories && { category: { in: categories } }),
          ...(types && { type: { in: types } }),
        };
        await prisma.insight.deleteMany({ where: deleteWhere });
      }

      // TODO: Actually generate insights using InsightEngine
      // For now, return a placeholder response
      const processingTime = 0;

      res.status(200).json({
        success: true,
        data: {
          insights: [],
          processingTime,
          warnings: ['Insight generation not yet implemented'],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
