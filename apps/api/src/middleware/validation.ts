/**
 * Request validation middleware
 * @module middleware/validation
 */

import type { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema, ZodError } from 'zod';
import { ValidationError } from './errorHandler.js';

// ============================================================
// TYPES
// ============================================================

/**
 * Validation targets
 */
type ValidationTarget = 'body' | 'query' | 'params';

// ============================================================
// MIDDLEWARE FACTORY
// ============================================================

/**
 * Create validation middleware for a specific target
 */
export function validate<T extends ZodSchema>(
  schema: T,
  target: ValidationTarget = 'body'
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[target];
      const validated = await schema.parseAsync(data);

      // Replace target data with validated data
      // This ensures type coercion and default values are applied
      (req as unknown as Record<string, unknown>)[target] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.flatten();
        next(new ValidationError('Validation failed', {
          target,
          fieldErrors: details.fieldErrors,
          formErrors: details.formErrors,
        }));
      } else {
        next(error);
      }
    }
  };
}

/**
 * Validate request body
 */
export function validateBody<T extends ZodSchema>(schema: T) {
  return validate(schema, 'body');
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends ZodSchema>(schema: T) {
  return validate(schema, 'query');
}

/**
 * Validate URL parameters
 */
export function validateParams<T extends ZodSchema>(schema: T) {
  return validate(schema, 'params');
}

// ============================================================
// COMMON SCHEMAS
// ============================================================

/**
 * Pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

/**
 * ID parameter
 */
export const idParamSchema = z.object({
  id: z.string().cuid(),
});

export type IdParam = z.infer<typeof idParamSchema>;

/**
 * Graph ID parameter
 */
export const graphIdParamSchema = z.object({
  graphId: z.string().cuid(),
});

export type GraphIdParam = z.infer<typeof graphIdParamSchema>;

/**
 * Email validation
 */
export const emailSchema = z.string().email().toLowerCase().trim();

/**
 * Platform enum
 */
export const platformSchema = z.enum(['TWITTER', 'INSTAGRAM', 'LINKEDIN', 'FACEBOOK', 'TIKTOK']);

/**
 * User tier enum
 */
export const userTierSchema = z.enum(['FREE', 'PRO', 'CREATOR']);

/**
 * Insight category enum
 */
export const insightCategorySchema = z.enum(['NETWORK', 'COMMUNITY', 'ENGAGEMENT', 'GROWTH']);

/**
 * Export type enum
 */
export const exportTypeSchema = z.enum(['PDF_REPORT', 'SOCIAL_CARD', 'DATA_CSV', 'DATA_JSON']);

/**
 * Confidence enum
 */
export const confidenceSchema = z.enum(['HIGH', 'MEDIUM', 'LOW']);
