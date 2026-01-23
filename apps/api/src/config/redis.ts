/**
 * Redis client configuration
 * @module config/redis
 */

import { Redis } from 'ioredis';
import { env, isDevelopment } from './env.js';

/**
 * Global redis instance to prevent multiple connections during development
 */
declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

/**
 * Create Redis client
 */
function createRedisClient(): Redis | null {
  if (!env.REDIS_URL) {
    console.warn('⚠️ REDIS_URL not configured. Redis features will be disabled.');
    return null;
  }

  const client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  client.on('connect', () => {
    console.log('✅ Redis connected');
  });

  client.on('error', (error: Error) => {
    console.error('❌ Redis error:', error.message);
  });

  client.on('close', () => {
    if (!isDevelopment) {
      console.log('Redis connection closed');
    }
  });

  return client;
}

/**
 * Singleton Redis client instance
 */
export const redis = globalThis.redis ?? createRedisClient();

if (isDevelopment && redis) {
  globalThis.redis = redis;
}

/**
 * Connect to Redis
 */
export async function connectRedis(): Promise<void> {
  if (!redis) {
    console.log('⏭️ Redis connection skipped (not configured)');
    return;
  }

  try {
    await redis.connect();
  } catch (error) {
    // If already connected, this is fine
    if ((error as Error).message?.includes('already')) {
      return;
    }
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

/**
 * Disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    console.log('Redis disconnected');
  }
}

/**
 * Health check for Redis connection
 */
export async function checkRedisHealth(): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}

// ============================================================
// REDIS KEY HELPERS
// ============================================================

/**
 * Key prefixes for different data types
 */
export const RedisKeys = {
  // Rate limiting
  rateLimit: (ip: string) => `rate_limit:${ip}`,
  rateLimitUser: (userId: string) => `rate_limit:user:${userId}`,

  // Session management
  refreshToken: (token: string) => `refresh_token:${token}`,
  userSessions: (userId: string) => `user_sessions:${userId}`,

  // Magic links
  magicLink: (token: string) => `magic_link:${token}`,

  // Graph processing jobs
  graphJob: (graphId: string) => `graph_job:${graphId}`,

  // Caching
  graphCache: (graphId: string) => `cache:graph:${graphId}`,
  insightsCache: (graphId: string) => `cache:insights:${graphId}`,
  userProfile: (userId: string) => `cache:user:${userId}`,
} as const;

/**
 * Default TTLs in seconds
 */
export const RedisTTL = {
  rateLimit: 60, // 1 minute
  refreshToken: 30 * 24 * 60 * 60, // 30 days
  magicLink: 15 * 60, // 15 minutes
  graphCache: 60 * 60, // 1 hour
  insightsCache: 24 * 60 * 60, // 24 hours
  userProfile: 5 * 60, // 5 minutes
} as const;
