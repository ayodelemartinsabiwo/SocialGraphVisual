/**
 * Input Sanitizer Middleware
 * @module middleware/inputSanitizer
 * @created 2026-01-21
 *
 * Layer 1 Protection: Request Validation
 * - Sanitizes all inputs
 * - Validates Content-Type headers
 * - Checks request size limits
 */

import { type Request, type Response, type NextFunction } from 'express';
import { logger } from './logger.js';

// ============================================================
// CONSTANTS
// ============================================================

const MAX_STRING_LENGTH = 10000;
const MAX_ARRAY_LENGTH = 50000; // Support large social graphs (up to 50K nodes/edges)
const MAX_OBJECT_DEPTH = 10;
const MAX_JSON_BODY_SIZE = 50 * 1024 * 1024; // 50MB for large graph payloads

// Valid content types for JSON APIs
const VALID_JSON_CONTENT_TYPES = [
  'application/json',
  'application/json; charset=utf-8',
  'application/json;charset=utf-8',
];

// Valid content types for uploads
const VALID_UPLOAD_CONTENT_TYPES = [
  'multipart/form-data',
  'application/octet-stream',
];

// Paths that accept non-JSON content
const NON_JSON_PATHS = [
  '/api/v1/graphs/upload',
  '/api/v1/webhooks',
];

// ============================================================
// SANITIZATION FUNCTIONS
// ============================================================

/**
 * Sanitize a string value
 * - Trims whitespace
 * - Removes null bytes
 * - Limits length
 */
function sanitizeString(value: string): string {
  if (typeof value !== 'string') return value;

  // Remove null bytes
  let sanitized = value.replace(/\0/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > MAX_STRING_LENGTH) {
    sanitized = sanitized.slice(0, MAX_STRING_LENGTH);
  }

  return sanitized;
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: unknown, depth = 0): unknown {
  // Prevent infinite recursion
  if (depth > MAX_OBJECT_DEPTH) {
    return null;
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Limit array length
    const limited = obj.slice(0, MAX_ARRAY_LENGTH);
    return limited.map(item => sanitizeObject(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      // Sanitize the key as well
      const sanitizedKey = sanitizeString(key);

      // Skip prototype pollution attempts
      if (sanitizedKey === '__proto__' || sanitizedKey === 'constructor' || sanitizedKey === 'prototype') {
        logger.warn('Prototype pollution attempt blocked', { key: sanitizedKey });
        continue;
      }

      sanitized[sanitizedKey] = sanitizeObject(value, depth + 1);
    }

    return sanitized;
  }

  // Unknown type, return null
  return null;
}

/**
 * Sanitize headers
 */
function sanitizeHeaders(headers: Record<string, string | string[] | undefined>): Record<string, string | string[] | undefined> {
  const sanitized: Record<string, string | string[] | undefined> = {};

  for (const [key, value] of Object.entries(headers)) {
    const sanitizedKey = key.toLowerCase();

    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map(v => sanitizeString(v));
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized;
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Validate Content-Type header
 */
function validateContentType(req: Request): { valid: boolean; error?: string } {
  const contentType = req.headers['content-type']?.toLowerCase() || '';

  // GET, DELETE, HEAD, OPTIONS don't require content-type
  if (['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return { valid: true };
  }

  // Check if path accepts non-JSON content
  const isNonJsonPath = NON_JSON_PATHS.some(path => req.path.startsWith(path));

  if (isNonJsonPath) {
    // Allow multipart and octet-stream for uploads
    if (
      VALID_UPLOAD_CONTENT_TYPES.some(type => contentType.includes(type)) ||
      VALID_JSON_CONTENT_TYPES.some(type => contentType.includes(type))
    ) {
      return { valid: true };
    }
  }

  // For POST, PUT, PATCH with body, require valid content-type
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    // Empty body is OK
    if (Object.keys(req.body).length === 0 && !contentType) {
      return { valid: true };
    }

    if (!contentType) {
      return { valid: false, error: 'Content-Type header is required' };
    }

    if (!VALID_JSON_CONTENT_TYPES.some(type => contentType.includes(type)) && !isNonJsonPath) {
      return { valid: false, error: `Invalid Content-Type: ${contentType}` };
    }
  }

  return { valid: true };
}

/**
 * Validate request size
 */
function validateRequestSize(req: Request): { valid: boolean; error?: string } {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);

  if (contentLength > MAX_JSON_BODY_SIZE) {
    return {
      valid: false,
      error: `Request body too large: ${contentLength} bytes (max: ${MAX_JSON_BODY_SIZE})`,
    };
  }

  return { valid: true };
}

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Input sanitization middleware
 * Sanitizes request body, query params, and validates headers
 */
export function inputSanitizer(req: Request, res: Response, next: NextFunction): void {
  try {
    // Validate Content-Type
    const contentTypeValidation = validateContentType(req);
    if (!contentTypeValidation.valid) {
      res.status(415).json({
        success: false,
        error: {
          code: 'INVALID_CONTENT_TYPE',
          message: contentTypeValidation.error,
        },
      });
      return;
    }

    // Validate request size
    const sizeValidation = validateRequestSize(req);
    if (!sizeValidation.valid) {
      res.status(413).json({
        success: false,
        error: {
          code: 'REQUEST_TOO_LARGE',
          message: sizeValidation.error,
        },
      });
      return;
    }

    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query) as typeof req.query;
    }

    // Sanitize params
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params) as typeof req.params;
    }

    next();
  } catch (error) {
    logger.error('Input sanitization error', {
      error: (error as Error).message,
      path: req.path,
    });

    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Request contains invalid data',
      },
    });
  }
}

/**
 * Export individual functions for testing
 */
export const sanitizers = {
  sanitizeString,
  sanitizeObject,
  sanitizeHeaders,
};

export const validators = {
  validateContentType,
  validateRequestSize,
};

export default inputSanitizer;
