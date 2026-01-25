/**
 * Authentication routes
 * @module routes/auth
 */

import { Router, type Request, type Response, type NextFunction, type IRouter } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { AuthService } from '../services/auth/AuthService.js';

const router: IRouter = Router();

// ============================================================
// SCHEMAS
// ============================================================

const magicLinkRequestSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

const magicLinkVerifySchema = z.object({
  token: z.string().min(1),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

const googleCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
});

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /auth/magic-link/request
 * Request a magic link for passwordless login
 */
router.post(
  '/magic-link/request',
  authRateLimiter,
  validateBody(magicLinkRequestSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await AuthService.requestMagicLink(email);

      res.status(200).json({
        success: true,
        data: {
          message: 'Magic link sent to your email',
          expiresIn: result.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/magic-link/verify
 * Verify magic link token and return JWT
 */
router.post(
  '/magic-link/verify',
  authRateLimiter,
  validateBody(magicLinkVerifySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyMagicLink(token);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/google/callback
 * Handle Google OAuth callback
 */
router.post(
  '/google/callback',
  authRateLimiter,
  validateBody(googleCallbackSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.body;
      const result = await AuthService.handleGoogleCallback(code, state);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
          user: result.user,
          isNewUser: result.isNewUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try body first, then cookie
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_TOKEN',
            message: 'Refresh token is required',
          },
        });
      }

      const result = await AuthService.refreshTokens(refreshToken);

      // Update cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /auth/logout
 * Logout and invalidate refresh token
 */
router.post(
  '/logout',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Clear cookie
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
