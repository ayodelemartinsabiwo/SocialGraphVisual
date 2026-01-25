/**
 * CSRF Protection Middleware
 * @module middleware/csrf
 * @created 2026-01-21
 *
 * Implements Double Submit Cookie pattern for CSRF protection.
 * Works alongside httpOnly JWT cookies.
 */

import { type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import { env, isDevelopment } from '../config/index.js';
import { logger } from './logger.js';

// ============================================================
// CONSTANTS
// ============================================================

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Methods that modify state and require CSRF protection
const PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// Paths that are exempt from CSRF protection
const EXEMPT_PATHS = [
  '/api/v1/webhooks/stripe', // Stripe uses its own signature verification
  '/api/v1/auth/magic-link/verify', // Magic link has its own token
  '/api/v1/auth/google/callback', // OAuth callback
];

// ============================================================
// TOKEN GENERATION
// ============================================================

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Hash a token for comparison (timing-safe)
 */
function hashToken(token: string): string {
  return crypto.createHmac('sha256', env.JWT_SECRET).update(token).digest('hex');
}

/**
 * Timing-safe token comparison
 */
function tokensMatch(a: string, b: string): boolean {
  try {
    const hashA = hashToken(a);
    const hashB = hashToken(b);
    return crypto.timingSafeEqual(Buffer.from(hashA), Buffer.from(hashB));
  } catch {
    return false;
  }
}

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Set CSRF token cookie
 * Call this on login/session creation
 */
export function setCsrfToken(_req: Request, res: Response): string {
  const token = generateCsrfToken();

  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript for header submission
    secure: !isDevelopment,
    sameSite: 'strict',
    maxAge: CSRF_COOKIE_MAX_AGE,
    path: '/',
  });

  return token;
}

/**
 * Clear CSRF token cookie
 * Call this on logout
 */
export function clearCsrfToken(res: Response): void {
  res.clearCookie(CSRF_COOKIE_NAME, {
    httpOnly: false,
    secure: !isDevelopment,
    sameSite: 'strict',
    path: '/',
  });
}

/**
 * CSRF protection middleware
 * Validates the Double Submit Cookie pattern
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  // Skip non-protected methods
  if (!PROTECTED_METHODS.includes(req.method)) {
    return next();
  }

  // Skip exempt paths
  if (EXEMPT_PATHS.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Skip in development if configured
  if (isDevelopment && process.env.DISABLE_CSRF === 'true') {
    return next();
  }

  // Get tokens from cookie and header
  const cookieToken = req.cookies[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;

  // Validate both tokens exist
  if (!cookieToken || !headerToken) {
    logger.warn('CSRF token missing', {
      path: req.path,
      method: req.method,
      hasCookie: !!cookieToken,
      hasHeader: !!headerToken,
      ip: req.ip,
    });

    res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_MISSING',
        message: 'CSRF token is required for this request',
      },
    });
    return;
  }

  // Validate tokens match using timing-safe comparison
  if (!tokensMatch(cookieToken, headerToken)) {
    logger.warn('CSRF token mismatch', {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    res.status(403).json({
      success: false,
      error: {
        code: 'CSRF_TOKEN_INVALID',
        message: 'CSRF token validation failed',
      },
    });
    return;
  }

  next();
}

/**
 * Middleware to ensure CSRF token exists
 * Sets one if not present (useful for initial page load)
 */
export function ensureCsrfToken(req: Request, res: Response, next: NextFunction): void {
  if (!req.cookies[CSRF_COOKIE_NAME]) {
    setCsrfToken(req, res);
  }
  next();
}

/**
 * Get CSRF token endpoint handler
 * Frontend calls this to get a fresh token
 */
export function getCsrfTokenHandler(req: Request, res: Response): void {
  const token = setCsrfToken(req, res);

  res.json({
    success: true,
    data: {
      token,
    },
  });
}

export default csrfProtection;
