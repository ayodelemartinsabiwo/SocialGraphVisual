/**
 * Rate limiting middleware
 * @module middleware/rateLimit
 */

import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { env, redis, RedisKeys } from '../config/index.js';
import { RateLimitError } from './errorHandler.js';
import { TIER_LIMITS, type UserTier } from '@vsg/shared';

// ============================================================
// REDIS STORE (if available)
// ============================================================

/**
 * Custom Redis store for rate limiting
 * Falls back to memory if Redis not available
 */
class RedisStore {
  windowMs: number;

  constructor(windowMs: number) {
    this.windowMs = windowMs;
  }

  async increment(key: string): Promise<{ totalHits: number; resetTime: Date }> {
    if (!redis) {
      // Return a high number to effectively disable rate limiting when Redis is unavailable
      return { totalHits: 0, resetTime: new Date(Date.now() + this.windowMs) };
    }

    const redisKey = RedisKeys.rateLimit(key);

    try {
      const multi = redis.multi();
      multi.incr(redisKey);
      multi.pttl(redisKey);
      const results = await multi.exec();

      if (!results) {
        return { totalHits: 0, resetTime: new Date(Date.now() + this.windowMs) };
      }

      const [[, hits], [, ttl]] = results as [[null, number], [null, number]];

      // Set expiry if this is the first request
      if (ttl === -1) {
        await redis.pexpire(redisKey, this.windowMs);
      }

      const resetTime = ttl > 0
        ? new Date(Date.now() + ttl)
        : new Date(Date.now() + this.windowMs);

      return { totalHits: hits, resetTime };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      return { totalHits: 0, resetTime: new Date(Date.now() + this.windowMs) };
    }
  }

  async decrement(key: string): Promise<void> {
    if (!redis) return;

    try {
      const redisKey = RedisKeys.rateLimit(key);
      await redis.decr(redisKey);
    } catch (error) {
      console.error('Redis decrement error:', error);
    }
  }

  async resetKey(key: string): Promise<void> {
    if (!redis) return;

    try {
      const redisKey = RedisKeys.rateLimit(key);
      await redis.del(redisKey);
    } catch (error) {
      console.error('Redis reset error:', error);
    }
  }
}

// ============================================================
// KEY GENERATORS
// ============================================================

/**
 * Generate rate limit key from request
 * Uses user ID if authenticated, otherwise IP
 */
function generateKey(req: Request): string {
  // Use user ID for authenticated requests
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }

  // Use IP for unauthenticated requests
  const ip = req.ip ||
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown';

  return `ip:${ip}`;
}

// ============================================================
// RATE LIMITERS
// ============================================================

/**
 * Get rate limit based on user tier
 */
function getTierLimit(tier?: UserTier): number {
  if (!tier) {
    return env.RATE_LIMIT_MAX_REQUESTS; // Default for unauthenticated
  }
  return TIER_LIMITS[tier].rateLimit;
}

/**
 * Default rate limiter
 * Tier-aware: adjusts limits based on user tier
 */
const rateLimiterOptions = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: (req: Request) => getTierLimit(req.user?.tier as UserTier | undefined),
  keyGenerator: generateKey,
  standardHeaders: true as const,
  legacyHeaders: false as const,
  handler: (_req: Request, _res: unknown, next: (err?: Error) => void, options: { windowMs: number }) => {
    next(new RateLimitError(
      `Too many requests. Please try again in ${Math.ceil(options.windowMs / 1000)} seconds.`,
      Math.ceil(options.windowMs / 1000)
    ));
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
};

export const rateLimiter = rateLimit(
  redis
    ? { ...rateLimiterOptions, store: new RedisStore(env.RATE_LIMIT_WINDOW_MS) }
    : rateLimiterOptions
);

/**
 * Strict rate limiter for sensitive endpoints (auth)
 * Lower limits to prevent brute force
 */
const authRateLimiterOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  keyGenerator: generateKey,
  standardHeaders: true as const,
  legacyHeaders: false as const,
  handler: (_req: Request, _res: unknown, next: (err?: Error) => void) => {
    next(new RateLimitError(
      'Too many authentication attempts. Please try again later.',
      15 * 60 // 15 minutes
    ));
  },
};

export const authRateLimiter = rateLimit(
  redis
    ? { ...authRateLimiterOptions, store: new RedisStore(15 * 60 * 1000) }
    : authRateLimiterOptions
);

/**
 * Upload rate limiter
 * Limit uploads per user
 */
const uploadRateLimiterOptions = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req: Request) => {
    // Allow more uploads for higher tiers
    const tier = req.user?.tier;
    if (tier === 'CREATOR') return 20;
    if (tier === 'PRO') return 10;
    return 3; // FREE tier
  },
  keyGenerator: (req: Request) => `upload:${req.user?.id || req.ip}`,
  standardHeaders: true as const,
  legacyHeaders: false as const,
  handler: (_req: Request, _res: unknown, next: (err?: Error) => void) => {
    next(new RateLimitError(
      'Upload limit reached. Please try again later.',
      60 * 60 // 1 hour
    ));
  },
  skip: () => {
    // Skip rate limiting in development mode for easier testing
    return env.NODE_ENV === 'development';
  },
};

export const uploadRateLimiter = rateLimit(
  redis
    ? { ...uploadRateLimiterOptions, store: new RedisStore(60 * 60 * 1000) }
    : uploadRateLimiterOptions
);

/**
 * Export rate limiter
 * Limit exports per user
 */
const exportRateLimiterOptions = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req: Request) => {
    const tier = req.user?.tier;
    if (tier === 'CREATOR') return 50;
    if (tier === 'PRO') return 20;
    return 5; // FREE tier
  },
  keyGenerator: (req: Request) => `export:${req.user?.id || req.ip}`,
  standardHeaders: true as const,
  legacyHeaders: false as const,
  handler: (_req: Request, _res: unknown, next: (err?: Error) => void) => {
    next(new RateLimitError(
      'Export limit reached. Please try again later.',
      60 * 60 // 1 hour
    ));
  },
};

export const exportRateLimiter = rateLimit(
  redis
    ? { ...exportRateLimiterOptions, store: new RedisStore(60 * 60 * 1000) }
    : exportRateLimiterOptions
);
