/**
 * Attack Pattern Detection Middleware
 * @module middleware/patternDetector
 * @created 2026-01-21
 *
 * Layer 3 Protection: Pattern Detection
 * - SQL injection regex patterns
 * - XSS attack vectors
 * - Path traversal attempts
 * - Command injection patterns
 */

import { type Request, type Response, type NextFunction } from 'express';
import { logger } from './logger.js';

// ============================================================
// TYPES
// ============================================================

export interface PatternMatch {
  type: 'sql_injection' | 'xss' | 'path_traversal' | 'command_injection' | 'ldap_injection' | 'nosql_injection';
  pattern: string;
  value: string;
  location: 'body' | 'query' | 'params' | 'headers' | 'path';
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
}

export interface DetectionResult {
  detected: boolean;
  matches: PatternMatch[];
  totalScore: number;
}

// ============================================================
// ATTACK PATTERNS
// ============================================================

/**
 * SQL Injection patterns
 */
const SQL_INJECTION_PATTERNS = [
  // Basic SQL keywords
  { pattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b)/gi, severity: 'high' as const, score: 40 },
  // Union-based injection
  { pattern: /(UNION\s+(ALL\s+)?SELECT)/gi, severity: 'critical' as const, score: 60 },
  // Comment-based injection
  { pattern: /(--|\/\*|\*\/|#)/g, severity: 'medium' as const, score: 25 },
  // String concatenation
  { pattern: /('|")\s*(OR|AND)\s*('|")?\s*[=<>]/gi, severity: 'high' as const, score: 45 },
  // Tautology
  { pattern: /('\s*OR\s*'[^']*'\s*=\s*'[^']*')/gi, severity: 'high' as const, score: 50 },
  // Sleep-based detection
  { pattern: /(SLEEP\s*\(|WAITFOR\s+DELAY|BENCHMARK\s*\()/gi, severity: 'critical' as const, score: 60 },
  // System commands
  { pattern: /(xp_cmdshell|LOAD_FILE|INTO\s+OUTFILE)/gi, severity: 'critical' as const, score: 70 },
];

/**
 * XSS Attack patterns
 */
const XSS_PATTERNS = [
  // Script tags
  { pattern: /<script[^>]*>[\s\S]*?<\/script>/gi, severity: 'critical' as const, score: 50 },
  { pattern: /<script[^>]*>/gi, severity: 'high' as const, score: 40 },
  // Event handlers
  { pattern: /\bon\w+\s*=\s*(['"]?)[^'"]*\1/gi, severity: 'high' as const, score: 35 },
  // JavaScript URLs
  { pattern: /javascript\s*:/gi, severity: 'high' as const, score: 40 },
  // Data URLs with base64
  { pattern: /data\s*:[^;]*;base64/gi, severity: 'medium' as const, score: 25 },
  // SVG with scripts
  { pattern: /<svg[^>]*>[\s\S]*?<\/svg>/gi, severity: 'medium' as const, score: 30 },
  // IFrame injection
  { pattern: /<iframe[^>]*>/gi, severity: 'high' as const, score: 40 },
  // Object/embed tags
  { pattern: /<(object|embed|applet)[^>]*>/gi, severity: 'high' as const, score: 35 },
  // Expression CSS (IE)
  { pattern: /expression\s*\([^)]*\)/gi, severity: 'medium' as const, score: 25 },
  // VBScript
  { pattern: /vbscript\s*:/gi, severity: 'high' as const, score: 40 },
];

/**
 * Path Traversal patterns
 */
const PATH_TRAVERSAL_PATTERNS = [
  // Directory traversal
  { pattern: /\.\.[\/\\]/g, severity: 'high' as const, score: 40 },
  // Encoded traversal
  { pattern: /(%2e%2e|%252e%252e)[\/\\%]/gi, severity: 'high' as const, score: 45 },
  // Null byte injection
  { pattern: /%00/g, severity: 'critical' as const, score: 50 },
  // Root paths
  { pattern: /^[\/\\]etc[\/\\]|^[\/\\]var[\/\\]|^[\/\\]usr[\/\\]/gi, severity: 'critical' as const, score: 55 },
  // Windows paths
  { pattern: /^[a-z]:[\/\\]/gi, severity: 'high' as const, score: 40 },
];

/**
 * Command Injection patterns
 */
const COMMAND_INJECTION_PATTERNS = [
  // Shell operators
  { pattern: /[;&|`$]|\$\(/g, severity: 'high' as const, score: 45 },
  // Common commands
  { pattern: /\b(cat|ls|dir|pwd|whoami|id|uname|wget|curl|nc|netcat|bash|sh|cmd|powershell)\b/gi, severity: 'high' as const, score: 40 },
  // Reverse shell patterns
  { pattern: /(\/dev\/tcp|mkfifo|\/bin\/bash\s+-i)/gi, severity: 'critical' as const, score: 70 },
  // Encoded newlines
  { pattern: /(%0a|%0d|\r|\n)/g, severity: 'medium' as const, score: 20 },
];

/**
 * NoSQL Injection patterns
 */
const NOSQL_INJECTION_PATTERNS = [
  // MongoDB operators
  { pattern: /\$where|\$gt|\$lt|\$ne|\$regex|\$or|\$and/gi, severity: 'high' as const, score: 45 },
  // JSON injection
  { pattern: /\{\s*"\$\w+":/g, severity: 'high' as const, score: 40 },
];

/**
 * LDAP Injection patterns
 */
const LDAP_INJECTION_PATTERNS = [
  { pattern: /[()\\*|&]/g, severity: 'medium' as const, score: 25 },
  { pattern: /(objectClass|objectCategory|userPassword|unicodePwd)/gi, severity: 'high' as const, score: 40 },
];

// ============================================================
// DETECTION FUNCTIONS
// ============================================================

/**
 * Check a value against a set of patterns
 */
function checkPatterns(
  value: string,
  patterns: Array<{ pattern: RegExp; severity: 'low' | 'medium' | 'high' | 'critical'; score: number }>,
  type: PatternMatch['type'],
  location: PatternMatch['location']
): PatternMatch[] {
  const matches: PatternMatch[] = [];

  for (const { pattern, severity, score } of patterns) {
    // Reset regex lastIndex
    pattern.lastIndex = 0;

    if (pattern.test(value)) {
      matches.push({
        type,
        pattern: pattern.source,
        value: value.slice(0, 100), // Limit logged value
        location,
        severity,
        score,
      });
    }
  }

  return matches;
}

/**
 * Recursively extract all string values from an object
 */
function extractStrings(obj: unknown, strings: string[] = [], depth = 0): string[] {
  if (depth > 10) return strings;

  if (typeof obj === 'string') {
    strings.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) {
      extractStrings(item, strings, depth + 1);
    }
  } else if (obj && typeof obj === 'object') {
    for (const value of Object.values(obj)) {
      extractStrings(value, strings, depth + 1);
    }
  }

  return strings;
}

/**
 * Detect all attack patterns in a value
 */
function detectPatterns(value: string, location: PatternMatch['location']): PatternMatch[] {
  const matches: PatternMatch[] = [];

  matches.push(...checkPatterns(value, SQL_INJECTION_PATTERNS, 'sql_injection', location));
  matches.push(...checkPatterns(value, XSS_PATTERNS, 'xss', location));
  matches.push(...checkPatterns(value, PATH_TRAVERSAL_PATTERNS, 'path_traversal', location));
  matches.push(...checkPatterns(value, COMMAND_INJECTION_PATTERNS, 'command_injection', location));
  matches.push(...checkPatterns(value, NOSQL_INJECTION_PATTERNS, 'nosql_injection', location));
  matches.push(...checkPatterns(value, LDAP_INJECTION_PATTERNS, 'ldap_injection', location));

  return matches;
}

/**
 * Scan request for attack patterns
 */
export function scanRequest(req: Request): DetectionResult {
  const allMatches: PatternMatch[] = [];

  // Scan path
  allMatches.push(...detectPatterns(req.path, 'path'));

  // Scan query parameters
  const queryStrings = extractStrings(req.query);
  for (const str of queryStrings) {
    allMatches.push(...detectPatterns(str, 'query'));
  }

  // Scan body
  if (req.body) {
    const bodyStrings = extractStrings(req.body);
    for (const str of bodyStrings) {
      allMatches.push(...detectPatterns(str, 'body'));
    }
  }

  // Scan params
  const paramStrings = extractStrings(req.params);
  for (const str of paramStrings) {
    allMatches.push(...detectPatterns(str, 'params'));
  }

  // Scan selected headers
  const sensitiveHeaders = ['user-agent', 'referer', 'x-forwarded-for', 'cookie'];
  for (const header of sensitiveHeaders) {
    const value = req.headers[header];
    if (typeof value === 'string') {
      allMatches.push(...detectPatterns(value, 'headers'));
    }
  }

  // Calculate total score
  const totalScore = allMatches.reduce((sum, match) => sum + match.score, 0);

  return {
    detected: allMatches.length > 0,
    matches: allMatches,
    totalScore,
  };
}

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Pattern detection middleware
 * Scans requests for attack patterns but doesn't block
 * (Blocking is handled by securityGuard based on total threat score)
 */
export function patternDetector(req: Request, _res: Response, next: NextFunction): void {
  try {
    const result = scanRequest(req);

    if (result.detected) {
      // Attach detection result to request for securityGuard
      (req as Request & { patternDetection?: DetectionResult }).patternDetection = result;

      // Log critical and high severity matches
      const criticalMatches = result.matches.filter(m => m.severity === 'critical' || m.severity === 'high');

      if (criticalMatches.length > 0) {
        logger.warn('Attack pattern detected', {
          path: req.path,
          method: req.method,
          ip: req.ip,
          totalScore: result.totalScore,
          matchCount: result.matches.length,
          criticalMatches: criticalMatches.map(m => ({
            type: m.type,
            severity: m.severity,
            location: m.location,
          })),
        });
      }
    }

    next();
  } catch (error) {
    logger.error('Pattern detection error', {
      error: (error as Error).message,
      path: req.path,
    });
    next();
  }
}

export default patternDetector;
