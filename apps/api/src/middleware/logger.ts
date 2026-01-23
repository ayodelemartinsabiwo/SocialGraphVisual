/**
 * Request logging middleware
 * @module middleware/logger
 */

import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { env, isDevelopment } from '../config/index.js';

// ============================================================
// REQUEST ID
// ============================================================

/**
 * Extend Express Request type with request ID
 */
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

// ============================================================
// LOGGING UTILITIES
// ============================================================

/**
 * Log levels
 */
const LOG_LEVELS = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

/**
 * Current log level from env
 */
const currentLogLevel = LOG_LEVELS[env.LOG_LEVEL as LogLevel] ?? LOG_LEVELS.info;

/**
 * Check if log level is enabled
 */
function isLevelEnabled(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= currentLogLevel;
}

/**
 * Format log message
 */
function formatLog(
  level: LogLevel,
  message: string,
  data?: Record<string, unknown>
): string {
  const timestamp = new Date().toISOString();

  if (isDevelopment) {
    // Pretty print in development
    const levelColors: Record<LogLevel, string> = {
      fatal: '\x1b[31m', // red
      error: '\x1b[31m', // red
      warn: '\x1b[33m',  // yellow
      info: '\x1b[36m',  // cyan
      debug: '\x1b[35m', // magenta
      trace: '\x1b[90m', // gray
    };
    const reset = '\x1b[0m';
    const color = levelColors[level];

    let output = `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}`;
    if (data) {
      output += ` ${JSON.stringify(data, null, 2)}`;
    }
    return output;
  }

  // JSON format in production
  return JSON.stringify({
    level,
    timestamp,
    message,
    ...data,
  });
}

/**
 * Logger object
 */
export const logger = {
  fatal: (message: string, data?: Record<string, unknown>) => {
    if (isLevelEnabled('fatal')) console.error(formatLog('fatal', message, data));
  },
  error: (message: string, data?: Record<string, unknown>) => {
    if (isLevelEnabled('error')) console.error(formatLog('error', message, data));
  },
  warn: (message: string, data?: Record<string, unknown>) => {
    if (isLevelEnabled('warn')) console.warn(formatLog('warn', message, data));
  },
  info: (message: string, data?: Record<string, unknown>) => {
    if (isLevelEnabled('info')) console.log(formatLog('info', message, data));
  },
  debug: (message: string, data?: Record<string, unknown>) => {
    if (isLevelEnabled('debug')) console.log(formatLog('debug', message, data));
  },
  trace: (message: string, data?: Record<string, unknown>) => {
    if (isLevelEnabled('trace')) console.log(formatLog('trace', message, data));
  },
};

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Request logger middleware
 * Logs request start, response, and timing
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Generate unique request ID
  const requestId = req.headers['x-request-id']?.toString() || randomUUID();
  req.requestId = requestId;

  // Set request ID in response header
  res.setHeader('X-Request-ID', requestId);

  // Record start time
  const startTime = Date.now();

  // Log request
  logger.info('Request received', {
    requestId,
    method: req.method,
    path: req.path,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level: LogLevel = res.statusCode >= 500 ? 'error' :
                            res.statusCode >= 400 ? 'warn' : 'info';

    logger[level]('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
    });
  });

  // Log errors
  res.on('error', (error) => {
    const duration = Date.now() - startTime;
    logger.error('Request error', {
      requestId,
      method: req.method,
      path: req.path,
      duration: `${duration}ms`,
      error: error.message,
    });
  });

  next();
}
