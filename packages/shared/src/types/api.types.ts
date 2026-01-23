/**
 * API request/response type definitions
 * @module @vsg/shared/types/api
 */

import type { UserTier } from './user.types.js';
import type { Platform, GraphStatus } from './graph.types.js';
import type { InsightCategory, InsightType, Confidence } from './insight.types.js';
import type { ExportType, ExportFormat, ExportStatus } from './export.types.js';

// ============ GENERIC API TYPES ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string; // Only in development
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============ AUTH API ============

export interface MagicLinkRequestBody {
  email: string;
}

export interface MagicLinkRequestResponse {
  message: string;
  expiresIn: number;
}

export interface MagicLinkVerifyBody {
  token: string;
}

export interface MagicLinkVerifyResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string | null;
    tier: UserTier;
  };
}

export interface GoogleCallbackBody {
  code: string;
  state?: string;
}

export interface GoogleCallbackResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string | null;
    tier: UserTier;
  };
  isNewUser: boolean;
}

export interface RefreshTokenBody {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============ USER API ============

export interface GetUserResponse {
  id: string;
  email: string;
  name: string | null;
  tier: UserTier;
  createdAt: string;
  updatedAt: string;
  graphCount: number;
  storageUsed: number;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export interface UpdateUserBody {
  name?: string;
}

export interface UpdateUserResponse {
  id: string;
  email: string;
  name: string | null;
  tier: UserTier;
  updatedAt: string;
}

// ============ GRAPH API ============

export interface InitiateUploadBody {
  platform: Platform;
  fileName: string;
  fileSize: number;
}

export interface InitiateUploadResponse {
  uploadId: string;
  uploadUrl: string;
  expiresAt: string;
}

export interface CreateGraphBody {
  uploadId: string;
  platform: Platform;
  nodes: Array<{
    id: string;
    type: 'SELF' | 'USER';
    displayName: string;
    username: string;
    followerCount?: number;
    followingCount?: number;
    engagementScore?: number;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: 'FOLLOWS' | 'FOLLOWED_BY' | 'MUTUAL' | 'ENGAGES_WITH';
    weight: number;
    interactions?: {
      likes?: number;
      comments?: number;
      shares?: number;
      messages?: number;
      mentions?: number;
    };
  }>;
  metadata: {
    parseVersion: string;
    parsingErrors: Array<{
      code: string;
      message: string;
      recoverable: boolean;
    }>;
    timePeriod?: {
      start: string;
      end: string;
    };
    sourceFileInfo: {
      fileName: string;
      fileSize: number;
      checksum: string;
    };
  };
}

export interface CreateGraphResponse {
  id: string;
  platform: Platform;
  version: number;
  status: GraphStatus;
  nodeCount: number;
  edgeCount: number;
  createdAt: string;
}

export interface ListGraphsParams extends PaginationParams {
  platform?: Platform;
  status?: GraphStatus;
}

export interface ListGraphsResponse {
  graphs: Array<{
    id: string;
    platform: Platform;
    version: number;
    isLatest: boolean;
    status: GraphStatus;
    nodeCount: number;
    edgeCount: number;
    communityCount: number | null;
    createdAt: string;
  }>;
  total: number;
  page: number;
  pageSize: number;
}

export interface GetGraphResponse {
  id: string;
  userId: string;
  platform: Platform;
  version: number;
  isLatest: boolean;
  status: GraphStatus;
  nodes: Array<{
    id: string;
    type: string;
    displayName: string;
    username: string;
    followerCount?: number;
    followingCount?: number;
    degree?: number;
    pageRank?: number;
    betweenness?: number;
    communityId?: number;
    engagementScore?: number;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
    weight: number;
  }>;
  metadata: {
    parseVersion: string;
    statistics: {
      nodeCount: number;
      edgeCount: number;
      density: number;
      averageDegree: number;
    };
  };
  statistics: {
    communities: {
      count: number;
      modularity: number;
    };
    centrality: {
      pageRank: {
        top10: Array<{ nodeId: string; score: number }>;
      };
      betweenness: {
        bridgeCount: number;
        bridgePercentage: number;
      };
    };
    engagement: {
      activePercentage: number;
      reciprocityScore: number;
    };
  } | null;
  createdAt: string;
  updatedAt: string;
}

// ============ INSIGHTS API ============

export interface ListInsightsParams extends PaginationParams {
  graphId: string;
  category?: InsightCategory;
  type?: InsightType;
}

export interface ListInsightsResponse {
  insights: Array<{
    id: string;
    category: InsightCategory;
    type: InsightType;
    title: string;
    description: string;
    confidence: Confidence;
    priority: number;
    isHighlighted: boolean;
    createdAt: string;
  }>;
  total: number;
}

export interface GetInsightResponse {
  id: string;
  graphId: string;
  category: InsightCategory;
  type: InsightType;
  title: string;
  description: string;
  data: Record<string, unknown>;
  confidence: Confidence;
  actions: Array<{
    title: string;
    description: string;
    effort: string;
    impact: string;
  }>;
  visualAnnotations: {
    highlightNodes?: string[];
    highlightEdges?: string[];
    highlightCommunities?: number[];
    colorBy?: string;
  };
  priority: number;
  isHighlighted: boolean;
  createdAt: string;
}

export interface GenerateInsightsBody {
  graphId: string;
  categories?: InsightCategory[];
  types?: InsightType[];
  regenerate?: boolean;
}

export interface GenerateInsightsResponse {
  insights: Array<{
    id: string;
    category: InsightCategory;
    type: InsightType;
    title: string;
    confidence: Confidence;
  }>;
  processingTime: number;
  warnings?: string[];
}

// ============ EXPORTS API ============

export interface CreateExportBody {
  graphId: string;
  type: ExportType;
  options: Record<string, unknown>;
}

export interface CreateExportResponse {
  id: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;
  estimatedTime: number;
  createdAt: string;
}

export interface GetExportResponse {
  id: string;
  type: ExportType;
  format: ExportFormat;
  status: ExportStatus;
  fileUrl: string | null;
  fileSize: number | null;
  fileName: string | null;
  expiresAt: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface ListExportsParams extends PaginationParams {
  graphId?: string;
  type?: ExportType;
  status?: ExportStatus;
}

export interface ListExportsResponse {
  exports: Array<{
    id: string;
    graphId: string;
    type: ExportType;
    format: ExportFormat;
    status: ExportStatus;
    fileName: string | null;
    fileSize: number | null;
    createdAt: string;
    completedAt: string | null;
  }>;
  total: number;
}

// ============ ERROR CODES ============

export const ErrorCode = {
  // Auth errors
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  PARSE_FAILED: 'PARSE_FAILED',

  // Processing errors
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  TIMEOUT: 'TIMEOUT',

  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
