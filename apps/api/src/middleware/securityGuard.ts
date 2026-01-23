/**
 * Security Guard Middleware
 * @module middleware/securityGuard
 * @created 2026-01-21
 *
 * Main threat detection orchestrator implementing the 5-layer
 * protection system from the plan:
 *
 * Layer 1: Request Validation (inputSanitizer)
 * Layer 2: Rate Limiting (rateLimit)
 * Layer 3: Pattern Detection (patternDetector)
 * Layer 4: Behavioral Analysis
 * Layer 5: Automatic Response
 *
 * Score Thresholds (from plan):
 * - Score < 30: Allow (monitor)
 * - Score 30-69: Warn (CAPTCHA, slow down)
 * - Score 70-89: Temp block (5-60 min)
 * - Score >= 90: Permanent block (require manual review)
 */

import { type Request, type Response, type NextFunction } from 'express';
import {
  getThreatProfile,
  addThreatSignal,
  determineAction,
  setTemporaryBlock,
  setPermanentBlock,
  isBlocked,
  getBlockDuration,
  THRESHOLDS,
  SIGNAL_SCORES,
  type ThreatAction,
  type ThreatSignalType,
  type ThreatSeverity,
} from '../services/security/threatScoring.js';
import { isIPBlocked, blockIP, type BlockReason } from '../services/security/blockList.js';
import { alertThreatDetected, alertBlockTriggered, alertAttackPattern } from '../services/security/alerting.js';
import type { DetectionResult } from './patternDetector.js';
import { logger } from './logger.js';
import { isDevelopment } from '../config/index.js';

// ============================================================
// TYPES
// ============================================================

interface SecurityContext {
  identifier: string;
  ip: string;
  userId: string | undefined;
  userAgent: string | undefined;
  path: string;
  method: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      patternDetection?: DetectionResult;
      securityContext?: SecurityContext;
    }
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get client identifier (IP + optional user ID)
 */
function getIdentifier(req: Request): string {
  const ip = getClientIP(req);
  const userId = (req as Request & { user?: { id: string } }).user?.id;

  if (userId) {
    return `user:${userId}`;
  }

  return `ip:${ip}`;
}

/**
 * Get client IP address
 */
function getClientIP(req: Request): string {
  // Check for proxy headers
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    if (forwardedValue) {
      const ips = forwardedValue.split(',');
      const firstIp = ips[0];
      if (firstIp) {
        return firstIp.trim() || req.ip || '0.0.0.0';
      }
    }
  }

  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return Array.isArray(realIP) ? (realIP[0] ?? '0.0.0.0') : realIP;
  }

  return req.ip || req.socket.remoteAddress || '0.0.0.0';
}

/**
 * Map pattern detection type to threat signal type
 */
function mapPatternToSignalType(
  patternType: string
): { type: ThreatSignalType; score: number } {
  const DEFAULT_SCORE = 25;

  switch (patternType) {
    case 'sql_injection':
      return { type: 'pattern_anomaly', score: SIGNAL_SCORES.SQL_INJECTION?.score ?? 50 };
    case 'xss':
      return { type: 'pattern_anomaly', score: SIGNAL_SCORES.XSS_ATTACK?.score ?? 40 };
    case 'command_injection':
      return { type: 'pattern_anomaly', score: SIGNAL_SCORES.COMMAND_INJECTION?.score ?? 50 };
    case 'path_traversal':
      return { type: 'pattern_anomaly', score: SIGNAL_SCORES.PATH_TRAVERSAL?.score ?? 45 };
    case 'nosql_injection':
      return { type: 'pattern_anomaly', score: SIGNAL_SCORES.NOSQL_INJECTION?.score ?? 45 };
    default:
      return { type: 'pattern_anomaly', score: DEFAULT_SCORE };
  }
}

/**
 * Map pattern severity to threat severity
 */
function mapSeverity(severity: string): ThreatSeverity {
  switch (severity) {
    case 'critical': return 'critical';
    case 'high': return 'high';
    case 'medium': return 'medium';
    default: return 'low';
  }
}

/**
 * Send blocked response
 */
function sendBlockedResponse(
  res: Response,
  reason: string,
  retryAfter?: number
): void {
  if (retryAfter) {
    res.setHeader('Retry-After', retryAfter.toString());
  }

  res.status(403).json({
    success: false,
    error: {
      code: 'ACCESS_DENIED',
      message: 'Your request has been blocked due to suspicious activity.',
      reason,
    },
  });
}

/**
 * Send warning response (add headers, slow down)
 */
function addWarningHeaders(res: Response, score: number): void {
  res.setHeader('X-Security-Warning', 'elevated-threat-score');
  res.setHeader('X-Threat-Score', score.toString());
}

// ============================================================
// LAYER 4: BEHAVIORAL ANALYSIS
// ============================================================

// In-memory request tracking (should be Redis in production)
const requestTracker = new Map<string, { count: number; firstSeen: number }>();

/**
 * Check for behavioral anomalies
 */
async function checkBehavioralAnomalies(
  ctx: SecurityContext
): Promise<{ score: number; signals: Array<{ type: ThreatSignalType; severity: ThreatSeverity; score: number; details: Record<string, unknown> | undefined }> }> {
  const signals: Array<{ type: ThreatSignalType; severity: ThreatSeverity; score: number; details: Record<string, unknown> | undefined }> = [];
  let totalScore = 0;

  // Check request frequency
  const now = Date.now();
  const tracker = requestTracker.get(ctx.identifier) || { count: 0, firstSeen: now };

  tracker.count++;

  // Check for high request rate (>10 requests/second over 5 seconds)
  const elapsed = (now - tracker.firstSeen) / 1000;
  const highRateScore = SIGNAL_SCORES.HIGH_REQUEST_RATE?.score ?? 20;
  if (elapsed > 0 && tracker.count / elapsed > 10) {
    signals.push({
      type: 'rate_limit',
      severity: 'medium',
      score: highRateScore,
      details: { requestCount: tracker.count, elapsed, rate: tracker.count / elapsed },
    });
    totalScore += highRateScore;
  }

  // Check for excessive API calls (>100 in 1 minute)
  const excessiveApiScore = SIGNAL_SCORES.EXCESSIVE_API_CALLS?.score ?? 25;
  if (elapsed <= 60 && tracker.count > 100) {
    signals.push({
      type: 'rate_limit',
      severity: 'high',
      score: excessiveApiScore,
      details: { requestCount: tracker.count, elapsed },
    });
    totalScore += excessiveApiScore;
  }

  // Update tracker
  requestTracker.set(ctx.identifier, tracker);

  // Clean up old trackers periodically
  if (Math.random() < 0.01) {
    const oneMinuteAgo = now - 60000;
    for (const [key, value] of requestTracker.entries()) {
      if (value.firstSeen < oneMinuteAgo) {
        requestTracker.delete(key);
      }
    }
  }

  // Check for bot signatures in user agent
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python-requests/i,
  ];

  const botScore = SIGNAL_SCORES.BOT_SIGNATURE?.score ?? 35;
  if (ctx.userAgent && botPatterns.some(p => p.test(ctx.userAgent!))) {
    // Only flag if it's acting suspiciously (high request rate)
    if (tracker.count > 20 && elapsed < 10) {
      signals.push({
        type: 'bot_signature',
        severity: 'medium',
        score: botScore,
        details: { userAgent: ctx.userAgent, requestCount: tracker.count },
      });
      totalScore += botScore;
    }
  }

  return { score: totalScore, signals };
}

// ============================================================
// LAYER 5: AUTOMATIC RESPONSE
// ============================================================

/**
 * Execute automatic response based on threat level
 */
async function executeAutomaticResponse(
  action: ThreatAction,
  ctx: SecurityContext,
  score: number
): Promise<void> {
  switch (action) {
    case 'block': {
      const duration = getBlockDuration(score);
      await setTemporaryBlock(ctx.identifier, duration);
      await blockIP(ctx.ip, 'threat_score' as BlockReason, duration * 60);
      await alertBlockTriggered({
        identifier: ctx.identifier,
        type: 'temporary',
        reason: 'threat_score',
        blockedAt: Date.now(),
        expiresAt: Date.now() + duration * 60 * 1000,
        details: `Threat score: ${score}`,
        blockedBy: undefined,
      });
      break;
    }

    case 'ban': {
      await setPermanentBlock(ctx.identifier);
      await alertBlockTriggered({
        identifier: ctx.identifier,
        type: 'permanent',
        reason: 'threat_score',
        blockedAt: Date.now(),
        expiresAt: undefined,
        details: `Threat score: ${score}`,
        blockedBy: undefined,
      });
      break;
    }

    case 'warn':
      // Warning is handled by adding headers
      break;

    case 'challenge':
      // TODO: Implement CAPTCHA challenge
      break;
  }
}

// ============================================================
// MAIN MIDDLEWARE
// ============================================================

/**
 * Security Guard middleware
 * Orchestrates all protection layers and enforces security policies
 */
export async function securityGuard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Skip in development if disabled
  if (isDevelopment && process.env.DISABLE_SECURITY === 'true') {
    return next();
  }

  const ip = getClientIP(req);
  const identifier = getIdentifier(req);

  // Build security context
  const ctx: SecurityContext = {
    identifier,
    ip,
    userId: (req as Request & { user?: { id: string } }).user?.id,
    userAgent: req.headers['user-agent'],
    path: req.path,
    method: req.method,
  };

  // Attach context to request
  req.securityContext = ctx;

  try {
    // --------------------------------------------------------
    // Check existing blocks first (fast path)
    // --------------------------------------------------------
    const [ipBlocked, identifierBlocked] = await Promise.all([
      isIPBlocked(ip),
      isBlocked(identifier),
    ]);

    if (ipBlocked || identifierBlocked) {
      logger.warn('Blocked request from blocked entity', {
        ip,
        identifier,
        path: req.path,
      });
      sendBlockedResponse(res, 'You have been blocked due to previous suspicious activity.');
      return;
    }

    // --------------------------------------------------------
    // Get current threat profile
    // --------------------------------------------------------
    let profile = await getThreatProfile(identifier);
    let additionalScore = 0;

    // --------------------------------------------------------
    // Process pattern detection results (from patternDetector middleware)
    // --------------------------------------------------------
    const patternDetection = req.patternDetection;
    if (patternDetection && patternDetection.detected) {
      // Add signals for each detected pattern
      for (const match of patternDetection.matches) {
        const signal = mapPatternToSignalType(match.type);
        profile = await addThreatSignal(identifier, {
          type: signal.type,
          severity: mapSeverity(match.severity),
          score: signal.score,
          details: {
            patternType: match.type,
            location: match.location,
          },
        });
      }

      // Alert on critical patterns
      const criticalMatch = patternDetection.matches.find(
        m => m.severity === 'critical'
      );
      if (criticalMatch) {
        await alertAttackPattern(identifier, criticalMatch.type, {
          path: req.path,
          method: req.method,
          matches: patternDetection.matches.length,
        });
      }

      additionalScore += patternDetection.totalScore;
    }

    // --------------------------------------------------------
    // Layer 4: Behavioral Analysis
    // --------------------------------------------------------
    const behavioral = await checkBehavioralAnomalies(ctx);
    if (behavioral.score > 0) {
      for (const signal of behavioral.signals) {
        profile = await addThreatSignal(identifier, signal);
      }
      additionalScore += behavioral.score;
    }

    // --------------------------------------------------------
    // Layer 5: Determine and Execute Response
    // --------------------------------------------------------
    const action = determineAction(profile);

    // Log elevated threat levels
    if (profile.score >= THRESHOLDS.WARN) {
      logger.warn('Elevated threat score', {
        identifier,
        score: profile.score,
        action,
        path: req.path,
      });
    }

    // Execute response based on action
    switch (action) {
      case 'ban':
      case 'block':
        await executeAutomaticResponse(action, ctx, profile.score);
        sendBlockedResponse(
          res,
          action === 'ban'
            ? 'Your access has been permanently blocked.'
            : 'Your access has been temporarily blocked.',
          action === 'block' ? getBlockDuration(profile.score) * 60 : undefined
        );
        return;

      case 'warn':
        addWarningHeaders(res, profile.score);
        // Alert on first warning threshold crossing
        if (profile.score >= THRESHOLDS.WARN && profile.score < THRESHOLDS.WARN + 10) {
          await alertThreatDetected(profile);
        }
        break;

      case 'challenge':
        // TODO: Implement CAPTCHA challenge
        // For now, treat as warning
        addWarningHeaders(res, profile.score);
        break;

      case 'allow':
      default:
        // Nothing to do, request proceeds
        break;
    }

    next();
  } catch (error) {
    // Log error but don't block the request
    logger.error('Security guard error', {
      identifier,
      error: (error as Error).message,
      path: req.path,
    });

    // Fail open in case of errors to avoid DoS
    next();
  }
}

/**
 * Light version of security guard for high-traffic endpoints
 * Only checks blocks, no scoring
 */
export async function securityGuardLight(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const ip = getClientIP(req);

  try {
    const blocked = await isIPBlocked(ip);
    if (blocked) {
      sendBlockedResponse(res, 'Access denied');
      return;
    }
    next();
  } catch {
    next();
  }
}

export default securityGuard;
