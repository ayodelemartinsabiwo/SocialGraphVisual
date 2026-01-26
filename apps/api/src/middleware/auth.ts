/**
 * Authentication middleware
 * @module middleware/auth
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';
import type { UserTier } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

/**
 * JWT payload structure
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  tier: UserTier;
  iat: number;
  exp: number;
}

/**
 * Authenticated user attached to request
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  tier: UserTier;
}

/**
 * Extend Express Request type
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// ============================================================
// TOKEN UTILITIES
// ============================================================

/**
 * Extract token from request
 * Checks Authorization header (Bearer token) and cookies
 */
function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check cookie
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Verify JWT token
 */
function verifyToken(token: string): JwtPayload {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired', 'TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token', 'INVALID_TOKEN');
    }
    throw error;
  }
}

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Require authentication
 * Verifies JWT and attaches user to request
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('Authentication required', 'UNAUTHORIZED');
    }

    const payload = verifyToken(token);

    // Attach user to request
    req.user = {
      id: payload.sub,
      email: payload.email,
      tier: payload.tier,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication
 * Attaches user to request if valid token present, but doesn't require it
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractToken(req);

    if (token) {
      try {
        const payload = verifyToken(token);
        req.user = {
          id: payload.sub,
          email: payload.email,
          tier: payload.tier,
        };
      } catch {
        // Invalid token in optional auth is okay, just don't attach user
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Require specific user tier(s)
 * Must be used after requireAuth
 */
export function requireTier(...allowedTiers: UserTier[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required', 'UNAUTHORIZED'));
    }

    if (!allowedTiers.includes(req.user.tier)) {
      return next(new ForbiddenError(
        `This feature requires ${allowedTiers.join(' or ')} tier`,
        'TIER_REQUIRED'
      ));
    }

    next();
  };
}

/**
 * Require PRO or CREATOR tier
 */
export const requirePro = requireTier('PRO', 'CREATOR');

/**
 * Require CREATOR tier
 */
export const requireCreator = requireTier('CREATOR');

/**
 * Development-only auth middleware
 * In production: requires authentication
 * In development: uses auth if provided, otherwise uses a demo user
 */
export function devAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractToken(req);

    if (token) {
      try {
        const payload = verifyToken(token);
        req.user = {
          id: payload.sub,
          email: payload.email,
          tier: payload.tier,
        };
        return next();
      } catch {
        // In development, continue with demo user
        // In production, throw the error
        if (env.NODE_ENV === 'production') {
          throw new UnauthorizedError('Invalid token', 'INVALID_TOKEN');
        }
      }
    }

    // In production, require authentication
    if (env.NODE_ENV === 'production') {
      throw new UnauthorizedError('Authentication required', 'UNAUTHORIZED');
    }

    // In development, use a demo user
    req.user = {
      id: 'demo-user-dev',
      email: 'demo@vsg.local',
      tier: 'FREE' as UserTier,
    };

    next();
  } catch (error) {
    next(error);
  }
}
