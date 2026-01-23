/**
 * Shared Constants
 * @module utils/constants
 * @created 2026-01-21
 *
 * Constants used across the application.
 */

// ============================================================
// TIER LIMITS
// ============================================================

// TIER_LIMITS is exported from types/user.types.ts - use that instead

// ============================================================
// PLATFORMS
// ============================================================

// Platform config is exported from types/graph.types.ts as PLATFORM_CONFIGS
// Platform type is exported from types/graph.types.ts

// ============================================================
// INSIGHT CATEGORIES
// ============================================================

// InsightCategory is exported from types/insight.types.ts

// ============================================================
// CONFIDENCE LEVELS
// ============================================================

export const CONFIDENCE_LEVELS = {
  HIGH: {
    label: 'High',
    minScore: 0.8,
    color: '#22c55e',
  },
  MEDIUM: {
    label: 'Medium',
    minScore: 0.5,
    color: '#eab308',
  },
  LOW: {
    label: 'Low',
    minScore: 0,
    color: '#ef4444',
  },
} as const;

// ============================================================
// FILE SIZE LIMITS
// ============================================================

export const FILE_SIZE_LIMITS = {
  MAX_UPLOAD_MB: 500,
  MAX_EXPORT_MB: 100,
  WARN_UPLOAD_MB: 200,
} as const;

// ============================================================
// RATE LIMITS
// ============================================================

export const RATE_LIMITS = {
  DEFAULT: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
  },
  AUTH: {
    windowMs: 60000,
    maxRequests: 10,
  },
  UPLOAD: {
    windowMs: 3600000, // 1 hour
    maxRequests: 10,
  },
  EXPORT: {
    windowMs: 3600000,
    maxRequests: 20,
  },
} as const;

// ============================================================
// API VERSIONS
// ============================================================

export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// ============================================================
// GRAPH CONSTANTS
// ============================================================

export const GRAPH_CONSTANTS = {
  MIN_NODE_SIZE: 5,
  MAX_NODE_SIZE: 50,
  MIN_EDGE_WIDTH: 0.5,
  MAX_EDGE_WIDTH: 5,
  DEFAULT_COMMUNITY_COLORS: [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
  ],
} as const;

// ============================================================
// ERROR CODES
// ============================================================

export const ERROR_CODES = {
  // Authentication
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_TIER: 'INSUFFICIENT_TIER',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

  // Security
  CSRF_TOKEN_MISSING: 'CSRF_TOKEN_MISSING',
  CSRF_TOKEN_INVALID: 'CSRF_TOKEN_INVALID',
  ACCESS_DENIED: 'ACCESS_DENIED',
} as const;
