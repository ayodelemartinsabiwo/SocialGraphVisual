/**
 * Threat Scoring Service
 * @module services/security/threatScoring
 * @created 2026-01-21
 *
 * Real-time threat scoring per IP/user based on the plan's
 * threat detection algorithm specification.
 *
 * Score Thresholds:
 * - WARN_THRESHOLD (30): CAPTCHA, slow down
 * - BLOCK_THRESHOLD (70): Temp block 5-60 min
 * - BAN_THRESHOLD (90): Permanent block (manual review)
 */

import { redis } from '../../config/redis.js';
import { logger } from '../../middleware/logger.js';

// ============================================================
// TYPES
// ============================================================

export type ThreatSignalType =
  | 'rate_limit'
  | 'pattern_anomaly'
  | 'auth_failure'
  | 'payload_suspicious'
  | 'geo_anomaly'
  | 'bot_signature'
  | 'jwt_manipulation';

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ThreatSignal {
  type: ThreatSignalType;
  severity: ThreatSeverity;
  score: number;
  timestamp: number;
  details: Record<string, unknown> | undefined;
}

export interface ThreatProfile {
  identifier: string;
  score: number;
  signals: ThreatSignal[];
  blockedUntil: number | undefined;
  permanentBlock: boolean | undefined;
  createdAt: number;
  updatedAt: number;
}

export type ThreatAction = 'allow' | 'warn' | 'challenge' | 'block' | 'ban';

// ============================================================
// CONSTANTS
// ============================================================

export const THRESHOLDS = {
  WARN: 30,
  BLOCK: 70,
  BAN: 90,
} as const;

// Score decay rate (points per minute)
const SCORE_DECAY_RATE = 2;

// Signal scores as defined in the plan
export const SIGNAL_SCORES: Record<string, { score: number; description: string }> = {
  // Rate limiting
  HIGH_REQUEST_RATE: { score: 20, description: '>10 requests/second from same IP' },
  EXCESSIVE_API_CALLS: { score: 25, description: '>100 API calls in 1 minute' },

  // Authentication
  AUTH_FAILURE_BURST: { score: 30, description: '>5 failed auth attempts in 1 minute' },
  JWT_MANIPULATION: { score: 60, description: 'Invalid JWT manipulation attempt' },

  // Injection attacks
  SQL_INJECTION: { score: 50, description: 'SQL injection pattern detected' },
  XSS_ATTACK: { score: 40, description: 'XSS pattern in payload' },
  COMMAND_INJECTION: { score: 50, description: 'Command injection pattern detected' },
  PATH_TRAVERSAL: { score: 45, description: 'Path traversal attempt' },
  NOSQL_INJECTION: { score: 45, description: 'NoSQL injection pattern detected' },

  // Behavioral
  GEO_ANOMALY: { score: 15, description: 'Unusual geo-location change' },
  BOT_SIGNATURE: { score: 35, description: 'Automated bot signature' },
  SUSPICIOUS_PAYLOAD: { score: 25, description: 'Suspicious payload structure' },
};

// TTL for threat profiles in Redis (24 hours)
const PROFILE_TTL = 24 * 60 * 60;

// Max signals to keep per profile
const MAX_SIGNALS = 100;

// ============================================================
// REDIS KEYS
// ============================================================

const getProfileKey = (identifier: string): string => `threat:profile:${identifier}`;
const getBlockKey = (identifier: string): string => `threat:blocked:${identifier}`;

// ============================================================
// THREAT SCORING SERVICE
// ============================================================

/**
 * Get or create a threat profile for an identifier (IP or user ID)
 */
export async function getThreatProfile(identifier: string): Promise<ThreatProfile> {
  if (!redis) {
    // Return default profile if Redis unavailable
    return createDefaultProfile(identifier);
  }

  try {
    const key = getProfileKey(identifier);
    const data = await redis.get(key);

    if (data) {
      const profile = JSON.parse(data) as ThreatProfile;
      // Apply score decay
      return applyScoreDecay(profile);
    }

    return createDefaultProfile(identifier);
  } catch (error) {
    logger.error('Failed to get threat profile', {
      identifier,
      error: (error as Error).message,
    });
    return createDefaultProfile(identifier);
  }
}

/**
 * Create a default threat profile
 */
function createDefaultProfile(identifier: string): ThreatProfile {
  const now = Date.now();
  return {
    identifier,
    score: 0,
    signals: [],
    blockedUntil: undefined,
    permanentBlock: undefined,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Apply score decay based on time elapsed
 */
function applyScoreDecay(profile: ThreatProfile): ThreatProfile {
  const now = Date.now();
  const minutesElapsed = (now - profile.updatedAt) / (60 * 1000);
  const decay = Math.floor(minutesElapsed * SCORE_DECAY_RATE);

  // Decay the score but don't go below 0
  const decayedScore = Math.max(0, profile.score - decay);

  // Remove old signals (older than 1 hour)
  const oneHourAgo = now - 60 * 60 * 1000;
  const recentSignals = profile.signals.filter(s => s.timestamp > oneHourAgo);

  return {
    ...profile,
    score: decayedScore,
    signals: recentSignals,
    updatedAt: now,
  };
}

/**
 * Add a threat signal and update the profile
 */
export async function addThreatSignal(
  identifier: string,
  signal: Omit<ThreatSignal, 'timestamp'>
): Promise<ThreatProfile> {
  const profile = await getThreatProfile(identifier);
  const now = Date.now();

  // Add timestamp to signal
  const fullSignal: ThreatSignal = {
    ...signal,
    timestamp: now,
  };

  // Update profile
  const updatedProfile: ThreatProfile = {
    ...profile,
    score: Math.min(100, profile.score + signal.score),
    signals: [...profile.signals.slice(-(MAX_SIGNALS - 1)), fullSignal],
    updatedAt: now,
  };

  // Save to Redis
  await saveThreatProfile(updatedProfile);

  // Log significant score increases
  if (updatedProfile.score >= THRESHOLDS.WARN) {
    logger.warn('Elevated threat score', {
      identifier,
      score: updatedProfile.score,
      signal: signal.type,
      signalScore: signal.score,
    });
  }

  return updatedProfile;
}

/**
 * Save threat profile to Redis
 */
async function saveThreatProfile(profile: ThreatProfile): Promise<void> {
  if (!redis) return;

  try {
    const key = getProfileKey(profile.identifier);
    await redis.setex(key, PROFILE_TTL, JSON.stringify(profile));
  } catch (error) {
    logger.error('Failed to save threat profile', {
      identifier: profile.identifier,
      error: (error as Error).message,
    });
  }
}

/**
 * Determine the appropriate action based on threat score
 */
export function determineAction(profile: ThreatProfile): ThreatAction {
  // Check for permanent block
  if (profile.permanentBlock) {
    return 'ban';
  }

  // Check for temporary block
  if (profile.blockedUntil && profile.blockedUntil > Date.now()) {
    return 'block';
  }

  // Determine action based on score
  if (profile.score >= THRESHOLDS.BAN) {
    return 'ban';
  }

  if (profile.score >= THRESHOLDS.BLOCK) {
    return 'block';
  }

  if (profile.score >= THRESHOLDS.WARN) {
    return 'warn';
  }

  return 'allow';
}

/**
 * Set a temporary block on an identifier
 */
export async function setTemporaryBlock(
  identifier: string,
  durationMinutes: number
): Promise<void> {
  const profile = await getThreatProfile(identifier);
  const blockUntil = Date.now() + durationMinutes * 60 * 1000;

  const updatedProfile: ThreatProfile = {
    ...profile,
    blockedUntil: blockUntil,
    updatedAt: Date.now(),
  };

  await saveThreatProfile(updatedProfile);

  // Also set a separate block key for quick lookups
  if (redis) {
    const key = getBlockKey(identifier);
    await redis.setex(key, durationMinutes * 60, 'blocked');
  }

  logger.warn('Temporary block set', {
    identifier,
    durationMinutes,
    blockUntil: new Date(blockUntil).toISOString(),
  });
}

/**
 * Set a permanent block on an identifier
 */
export async function setPermanentBlock(identifier: string): Promise<void> {
  const profile = await getThreatProfile(identifier);

  const updatedProfile: ThreatProfile = {
    ...profile,
    permanentBlock: true,
    updatedAt: Date.now(),
  };

  await saveThreatProfile(updatedProfile);

  // Set permanent block key (30 day TTL, can be extended)
  if (redis) {
    const key = getBlockKey(identifier);
    await redis.setex(key, 30 * 24 * 60 * 60, 'permanent');
  }

  logger.error('Permanent block set', {
    identifier,
    totalScore: profile.score,
    signalCount: profile.signals.length,
  });
}

/**
 * Check if an identifier is currently blocked
 */
export async function isBlocked(identifier: string): Promise<boolean> {
  if (!redis) return false;

  try {
    const key = getBlockKey(identifier);
    const blocked = await redis.get(key);
    return blocked !== null;
  } catch {
    return false;
  }
}

/**
 * Remove a block (for manual unblocking)
 */
export async function removeBlock(identifier: string): Promise<void> {
  const profile = await getThreatProfile(identifier);

  const updatedProfile: ThreatProfile = {
    ...profile,
    blockedUntil: undefined,
    permanentBlock: false,
    score: 0,
    signals: [],
    updatedAt: Date.now(),
  };

  await saveThreatProfile(updatedProfile);

  if (redis) {
    const key = getBlockKey(identifier);
    await redis.del(key);
  }

  logger.info('Block removed', { identifier });
}

/**
 * Get the block duration based on score
 */
export function getBlockDuration(score: number): number {
  // Higher scores = longer blocks
  if (score >= 90) return 60; // 1 hour
  if (score >= 80) return 30; // 30 minutes
  if (score >= 70) return 15; // 15 minutes
  return 5; // 5 minutes
}

export default {
  getThreatProfile,
  addThreatSignal,
  determineAction,
  setTemporaryBlock,
  setPermanentBlock,
  isBlocked,
  removeBlock,
  getBlockDuration,
  THRESHOLDS,
  SIGNAL_SCORES,
};
