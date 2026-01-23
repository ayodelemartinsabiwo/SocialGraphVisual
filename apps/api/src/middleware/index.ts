/**
 * Middleware exports
 * @module middleware
 * @updated 2026-01-21
 */

// Error handling
export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitError,
  InternalError,
  errorHandler,
  notFoundHandler,
} from './errorHandler.js';

// Authentication
export {
  requireAuth,
  optionalAuth,
  requireTier,
  requirePro,
  requireCreator,
  type JwtPayload,
  type AuthenticatedUser,
} from './auth.js';

// Rate limiting
export {
  rateLimiter,
  authRateLimiter,
  uploadRateLimiter,
  exportRateLimiter,
} from './rateLimit.js';

// Logging
export {
  logger,
  requestLogger,
} from './logger.js';

// Validation
export {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  paginationSchema,
  idParamSchema,
  graphIdParamSchema,
  emailSchema,
  platformSchema,
  userTierSchema,
  insightCategorySchema,
  exportTypeSchema,
  confidenceSchema,
  type PaginationQuery,
  type IdParam,
  type GraphIdParam,
} from './validation.js';

// CORS
export {
  corsMiddleware,
  strictCorsMiddleware,
} from './cors.js';

// CSRF Protection
export {
  csrfProtection,
  setCsrfToken,
  clearCsrfToken,
  ensureCsrfToken,
  getCsrfTokenHandler,
  generateCsrfToken,
} from './csrf.js';

// Input Sanitization (Layer 1)
export {
  inputSanitizer,
  sanitizers,
  validators,
} from './inputSanitizer.js';

// Pattern Detection (Layer 3)
export {
  patternDetector,
  scanRequest,
  type PatternMatch,
  type DetectionResult,
} from './patternDetector.js';

// Security Guard (Main Orchestrator)
export {
  securityGuard,
  securityGuardLight,
} from './securityGuard.js';
