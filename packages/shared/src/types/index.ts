/**
 * Type exports aggregator
 * @module @vsg/shared/types
 */

// User types
export {
  UserTier,
  SubscriptionStatus,
  type User,
  type UserProfile,
  type AuthTokens,
  type JwtPayload,
  type MagicLinkRequest,
  type MagicLinkVerify,
  type GoogleAuthCallback,
  type Subscription,
  type TierLimits,
  TIER_LIMITS,
} from './user.types.js';

// Graph types
export {
  Platform,
  GraphStatus,
  UploadStatus,
  EdgeType,
  NodeType,
  type GraphNode,
  type GraphEdge,
  type GraphMetadata,
  type ParsingError,
  type GraphStatistics,
  type Graph,
  type GraphSummary,
  type Upload,
  type PlatformConfig,
  PLATFORM_CONFIGS,
} from './graph.types.js';

// Insight types
export {
  InsightCategory,
  Confidence,
  InsightType,
  ActionEffort,
  ActionImpact,
  type InsightAction,
  type VisualAnnotations,
  type CommunityOverviewData,
  type EngagementCirclesData,
  type KeyConnectorsData,
  type EchoChamberData,
  type GrowthOpportunitiesData,
  type InsightData,
  type Insight,
  type InsightSummary,
  type InsightTemplate,
  type GenerateInsightsRequest,
  type GenerateInsightsResponse,
} from './insight.types.js';

// Export types
export {
  ExportType,
  ExportFormat,
  ExportStatus,
  type SocialCardOptions,
  type PdfReportOptions,
  type DataExportOptions,
  type ExportOptions,
  type Export,
  type ExportSummary,
  type CreateExportRequest,
  type CreateExportResponse,
  type SocialCardTemplate,
  SOCIAL_CARD_TEMPLATES,
} from './export.types.js';

// API types
export {
  type ApiResponse,
  type ApiError,
  type PaginationParams,
  type MagicLinkRequestBody,
  type MagicLinkRequestResponse,
  type MagicLinkVerifyBody,
  type MagicLinkVerifyResponse,
  type GoogleCallbackBody,
  type GoogleCallbackResponse,
  type RefreshTokenBody,
  type RefreshTokenResponse,
  type GetUserResponse,
  type UpdateUserBody,
  type UpdateUserResponse,
  type InitiateUploadBody,
  type InitiateUploadResponse,
  type CreateGraphBody,
  type CreateGraphResponse,
  type ListGraphsParams,
  type ListGraphsResponse,
  type GetGraphResponse,
  type ListInsightsParams,
  type ListInsightsResponse,
  type GetInsightResponse,
  type GenerateInsightsBody,
  type CreateExportBody,
  type CreateExportResponse as CreateExportApiResponse,
  type GetExportResponse,
  type ListExportsParams,
  type ListExportsResponse,
  ErrorCode,
} from './api.types.js';
