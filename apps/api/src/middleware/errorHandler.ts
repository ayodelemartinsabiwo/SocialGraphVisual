/**
 * Error handling middleware
 * @module middleware/errorHandler
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { isDevelopment } from '../config/index.js';

// ============================================================
// CUSTOM ERROR CLASSES
// ============================================================

/**
 * Base application error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details: Record<string, unknown> | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', code: string = 'BAD_REQUEST', details?: Record<string, unknown>) {
    super(message, 400, code, details);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(message, 401, code);
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    super(message, 403, code);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists', code: string = 'CONFLICT') {
    super(message, 409, code);
  }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: Record<string, unknown>) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

/**
 * 429 Rate Limited
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message, 429, 'RATE_LIMITED', retryAfter ? { retryAfter } : undefined);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'INTERNAL_ERROR');
  }
}

// ============================================================
// ERROR RESPONSE FORMATTER
// ============================================================

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
}

/**
 * Format error response
 */
function formatErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>,
  stack?: string
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    response.error.details = details;
  }

  if (isDevelopment && stack) {
    response.error.stack = stack;
  }

  return response;
}

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error
  console.error('[ERROR]', {
    name: err.name,
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details = err.flatten();
    res.status(422).json(
      formatErrorResponse(
        'VALIDATION_ERROR',
        'Validation failed',
        { fieldErrors: details.fieldErrors, formErrors: details.formErrors }
      )
    );
    return;
  }

  // Handle known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      formatErrorResponse(
        err.code,
        err.message,
        err.details,
        err.stack
      )
    );
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as Error & { code?: string };

    if (prismaError.code === 'P2002') {
      res.status(409).json(
        formatErrorResponse('CONFLICT', 'Resource already exists')
      );
      return;
    }

    if (prismaError.code === 'P2025') {
      res.status(404).json(
        formatErrorResponse('NOT_FOUND', 'Resource not found')
      );
      return;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(
      formatErrorResponse('INVALID_TOKEN', 'Invalid token')
    );
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(
      formatErrorResponse('TOKEN_EXPIRED', 'Token has expired')
    );
    return;
  }

  // Handle unknown errors
  res.status(500).json(
    formatErrorResponse(
      'INTERNAL_ERROR',
      isDevelopment ? err.message : 'An unexpected error occurred',
      undefined,
      err.stack
    )
  );
}
