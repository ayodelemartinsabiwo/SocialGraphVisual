/**
 * User routes
 * @module routes/user
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errorHandler.js';

const router: IRouter = Router();

// ============================================================
// SCHEMAS
// ============================================================

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});

// ============================================================
// ROUTES
// ============================================================

/**
 * GET /users/me
 * Get current user profile
 */
router.get(
  '/me',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          subscription: true,
          _count: {
            select: { graphs: true },
          },
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Calculate storage used (sum of all graph data sizes)
      const graphs = await prisma.graph.findMany({
        where: { userId },
        select: { nodesData: true, edgesData: true },
      });

      const storageUsed = graphs.reduce((total, graph) => {
        const nodesSize = JSON.stringify(graph.nodesData).length;
        const edgesSize = JSON.stringify(graph.edgesData).length;
        return total + nodesSize + edgesSize;
      }, 0);

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          graphCount: user._count.graphs,
          storageUsed,
          subscription: user.subscription ? {
            status: user.subscription.status,
            currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() || null,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
          } : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /users/me
 * Update current user profile
 */
router.patch(
  '/me',
  requireAuth,
  validateBody(updateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { name } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { name },
      });

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          updatedAt: user.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /users/me
 * Delete current user account (GDPR compliance)
 */
router.delete(
  '/me',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;

      // Soft delete - mark as deleted but keep record
      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          // Anonymize personal data
          email: `deleted_${userId}@deleted.local`,
          name: null,
          googleId: null,
        },
      });

      // Revoke all refresh tokens
      await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revokedAt: new Date() },
      });

      // Clear cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        data: {
          message: 'Account deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
