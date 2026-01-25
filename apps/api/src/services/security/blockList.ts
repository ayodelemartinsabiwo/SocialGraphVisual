/**
 * Block List Service
 * @module services/security/blockList
 * @created 2026-01-21
 *
 * IP/User block management service with Redis-backed storage.
 * Supports both automatic (threat-based) and manual blocking.
 */

import { redis } from '../../config/redis.js';
import { logger } from '../../middleware/logger.js';

// ============================================================
// TYPES
// ============================================================

export type BlockReason =
  | 'threat_score'
  | 'manual'
  | 'rate_limit'
  | 'attack_pattern'
  | 'abuse'
  | 'spam'
  | 'fraud';

export type BlockType = 'temporary' | 'permanent';

export interface BlockEntry {
  identifier: string;
  type: BlockType;
  reason: BlockReason;
  details: string | undefined;
  blockedAt: number;
  expiresAt: number | undefined;
  blockedBy: string | undefined;
}

export interface BlockListStats {
  totalBlocked: number;
  temporaryBlocks: number;
  permanentBlocks: number;
  recentBlocks: BlockEntry[];
}

// ============================================================
// CONSTANTS
// ============================================================

// Redis key prefixes
const BLOCK_KEY_PREFIX = 'blocklist:';
const BLOCK_SET_KEY = 'blocklist:all';
const BLOCK_TEMP_SET_KEY = 'blocklist:temp';
const BLOCK_PERM_SET_KEY = 'blocklist:perm';

// Default block durations (in seconds)
export const BLOCK_DURATIONS = {
  SHORT: 5 * 60,        // 5 minutes
  MEDIUM: 30 * 60,      // 30 minutes
  LONG: 60 * 60,        // 1 hour
  EXTENDED: 24 * 60 * 60, // 24 hours
} as const;

// In-memory fallback for when Redis is unavailable
const inMemoryBlockList = new Map<string, BlockEntry>();

// ============================================================
// CORE FUNCTIONS
// ============================================================

/**
 * Add an identifier to the block list
 */
export async function addToBlockList(entry: BlockEntry): Promise<void> {
  const key = `${BLOCK_KEY_PREFIX}${entry.identifier}`;

  if (!redis) {
    // Fallback to in-memory storage
    inMemoryBlockList.set(entry.identifier, entry);
    logger.warn('Using in-memory block list (Redis unavailable)', {
      identifier: entry.identifier,
    });
    return;
  }

  try {
    // Calculate TTL for temporary blocks
    const ttl = entry.type === 'temporary' && entry.expiresAt
      ? Math.ceil((entry.expiresAt - Date.now()) / 1000)
      : null;

    // Store the block entry
    if (ttl && ttl > 0) {
      await redis.setex(key, ttl, JSON.stringify(entry));
    } else if (entry.type === 'permanent') {
      // Permanent blocks get 30 day TTL but are auto-renewed
      await redis.setex(key, 30 * 24 * 60 * 60, JSON.stringify(entry));
    }

    // Add to appropriate sets
    await redis.sadd(BLOCK_SET_KEY, entry.identifier);

    if (entry.type === 'temporary') {
      await redis.sadd(BLOCK_TEMP_SET_KEY, entry.identifier);
    } else {
      await redis.sadd(BLOCK_PERM_SET_KEY, entry.identifier);
    }

    logger.info('Added to block list', {
      identifier: entry.identifier,
      type: entry.type,
      reason: entry.reason,
      expiresAt: entry.expiresAt ? new Date(entry.expiresAt).toISOString() : 'never',
    });
  } catch (error) {
    logger.error('Failed to add to block list', {
      identifier: entry.identifier,
      error: (error as Error).message,
    });
    // Fallback to in-memory
    inMemoryBlockList.set(entry.identifier, entry);
  }
}

/**
 * Remove an identifier from the block list
 */
export async function removeFromBlockList(identifier: string): Promise<boolean> {
  const key = `${BLOCK_KEY_PREFIX}${identifier}`;

  // Remove from in-memory fallback
  inMemoryBlockList.delete(identifier);

  if (!redis) {
    return true;
  }

  try {
    await redis.del(key);
    await redis.srem(BLOCK_SET_KEY, identifier);
    await redis.srem(BLOCK_TEMP_SET_KEY, identifier);
    await redis.srem(BLOCK_PERM_SET_KEY, identifier);

    logger.info('Removed from block list', { identifier });
    return true;
  } catch (error) {
    logger.error('Failed to remove from block list', {
      identifier,
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Check if an identifier is blocked
 */
export async function isBlockedInList(identifier: string): Promise<boolean> {
  // Check in-memory first
  const inMemoryEntry = inMemoryBlockList.get(identifier);
  if (inMemoryEntry) {
    // Check if temporary block has expired
    if (inMemoryEntry.type === 'temporary' && inMemoryEntry.expiresAt) {
      if (Date.now() > inMemoryEntry.expiresAt) {
        inMemoryBlockList.delete(identifier);
        return false;
      }
    }
    return true;
  }

  if (!redis) {
    return false;
  }

  try {
    const key = `${BLOCK_KEY_PREFIX}${identifier}`;
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Failed to check block list', {
      identifier,
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Get block entry details
 */
export async function getBlockEntry(identifier: string): Promise<BlockEntry | null> {
  // Check in-memory first
  const inMemoryEntry = inMemoryBlockList.get(identifier);
  if (inMemoryEntry) {
    return inMemoryEntry;
  }

  if (!redis) {
    return null;
  }

  try {
    const key = `${BLOCK_KEY_PREFIX}${identifier}`;
    const data = await redis.get(key);

    if (data) {
      return JSON.parse(data) as BlockEntry;
    }

    return null;
  } catch (error) {
    logger.error('Failed to get block entry', {
      identifier,
      error: (error as Error).message,
    });
    return null;
  }
}

// ============================================================
// CONVENIENCE FUNCTIONS
// ============================================================

/**
 * Block an IP address temporarily
 */
export async function blockIP(
  ip: string,
  reason: BlockReason,
  durationSeconds: number = BLOCK_DURATIONS.MEDIUM,
  details?: string
): Promise<void> {
  const entry: BlockEntry = {
    identifier: `ip:${ip}`,
    type: 'temporary',
    reason,
    details,
    blockedAt: Date.now(),
    expiresAt: Date.now() + durationSeconds * 1000,
    blockedBy: undefined,
  };

  await addToBlockList(entry);
}

/**
 * Block a user permanently
 */
export async function blockUser(
  userId: string,
  reason: BlockReason,
  details?: string,
  blockedBy?: string
): Promise<void> {
  const entry: BlockEntry = {
    identifier: `user:${userId}`,
    type: 'permanent',
    reason,
    details,
    blockedAt: Date.now(),
    expiresAt: undefined,
    blockedBy,
  };

  await addToBlockList(entry);
}

/**
 * Unblock an IP address
 */
export async function unblockIP(ip: string): Promise<boolean> {
  return removeFromBlockList(`ip:${ip}`);
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: string): Promise<boolean> {
  return removeFromBlockList(`user:${userId}`);
}

/**
 * Check if IP is blocked
 */
export async function isIPBlocked(ip: string): Promise<boolean> {
  return isBlockedInList(`ip:${ip}`);
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  return isBlockedInList(`user:${userId}`);
}

// ============================================================
// ADMIN FUNCTIONS
// ============================================================

/**
 * Get block list statistics
 */
export async function getBlockListStats(): Promise<BlockListStats> {
  if (!redis) {
    const entries = Array.from(inMemoryBlockList.values());
    return {
      totalBlocked: entries.length,
      temporaryBlocks: entries.filter(e => e.type === 'temporary').length,
      permanentBlocks: entries.filter(e => e.type === 'permanent').length,
      recentBlocks: entries.slice(-10),
    };
  }

  try {
    const [totalBlocked, temporaryBlocks, permanentBlocks] = await Promise.all([
      redis.scard(BLOCK_SET_KEY),
      redis.scard(BLOCK_TEMP_SET_KEY),
      redis.scard(BLOCK_PERM_SET_KEY),
    ]);

    // Get recent blocks (last 10 from the all set)
    const recentIdentifiers = await redis.smembers(BLOCK_SET_KEY);
    const recentBlocks: BlockEntry[] = [];

    for (const identifier of recentIdentifiers.slice(-10)) {
      const entry = await getBlockEntry(identifier);
      if (entry) {
        recentBlocks.push(entry);
      }
    }

    // Sort by blockedAt descending
    recentBlocks.sort((a, b) => b.blockedAt - a.blockedAt);

    return {
      totalBlocked,
      temporaryBlocks,
      permanentBlocks,
      recentBlocks,
    };
  } catch (error) {
    logger.error('Failed to get block list stats', {
      error: (error as Error).message,
    });
    return {
      totalBlocked: 0,
      temporaryBlocks: 0,
      permanentBlocks: 0,
      recentBlocks: [],
    };
  }
}

/**
 * Clean up expired temporary blocks
 */
export async function cleanupExpiredBlocks(): Promise<number> {
  if (!redis) {
    let cleaned = 0;
    const now = Date.now();

    for (const [identifier, entry] of inMemoryBlockList.entries()) {
      if (entry.type === 'temporary' && entry.expiresAt && entry.expiresAt < now) {
        inMemoryBlockList.delete(identifier);
        cleaned++;
      }
    }

    return cleaned;
  }

  try {
    // Get all temporary blocks
    const tempBlocks = await redis.smembers(BLOCK_TEMP_SET_KEY);
    let cleaned = 0;

    for (const identifier of tempBlocks) {
      const key = `${BLOCK_KEY_PREFIX}${identifier}`;
      const exists = await redis.exists(key);

      if (!exists) {
        // Key expired, remove from sets
        await redis.srem(BLOCK_SET_KEY, identifier);
        await redis.srem(BLOCK_TEMP_SET_KEY, identifier);
        cleaned++;
      }
    }

    logger.info('Cleaned up expired blocks', { count: cleaned });
    return cleaned;
  } catch (error) {
    logger.error('Failed to cleanup expired blocks', {
      error: (error as Error).message,
    });
    return 0;
  }
}

export default {
  addToBlockList,
  removeFromBlockList,
  isBlockedInList,
  getBlockEntry,
  blockIP,
  blockUser,
  unblockIP,
  unblockUser,
  isIPBlocked,
  isUserBlocked,
  getBlockListStats,
  cleanupExpiredBlocks,
  BLOCK_DURATIONS,
};
