/**
 * User-related type definitions
 * @module @vsg/shared/types/user
 */

// ============ ENUMS ============

export const UserTier = {
  FREE: 'FREE',
  PRO: 'PRO',
  CREATOR: 'CREATOR',
} as const;

export type UserTier = (typeof UserTier)[keyof typeof UserTier];

export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  TRIALING: 'TRIALING',
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

// ============ USER ============

export interface User {
  id: string;
  email: string;
  name: string | null;
  googleId: string | null;
  tier: UserTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  subscription: Subscription | null;
  graphCount: number;
  storageUsed: number; // bytes
}

// ============ AUTH ============

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  tier: UserTier;
  iat: number;
  exp: number;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkVerify {
  token: string;
}

export interface GoogleAuthCallback {
  code: string;
  state?: string;
}

// ============ SUBSCRIPTION ============

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============ TIER LIMITS ============

export interface TierLimits {
  maxGraphs: number;
  maxStorageBytes: number;
  maxFileSizeBytes: number;
  maxNodesPerGraph: number;
  insightTypes: string[];
  exportFormats: string[];
  rateLimit: number; // requests per minute
}

export const TIER_LIMITS: Record<UserTier, TierLimits> = {
  FREE: {
    maxGraphs: 1,
    maxStorageBytes: 100 * 1024 * 1024, // 100MB
    maxFileSizeBytes: 50 * 1024 * 1024, // 50MB
    maxNodesPerGraph: 1000,
    insightTypes: ['community_overview', 'engagement_summary'],
    exportFormats: ['social_card'],
    rateLimit: 30,
  },
  PRO: {
    maxGraphs: 5,
    maxStorageBytes: 1024 * 1024 * 1024, // 1GB
    maxFileSizeBytes: 200 * 1024 * 1024, // 200MB
    maxNodesPerGraph: 5000,
    insightTypes: ['community_overview', 'engagement_summary', 'key_connectors', 'echo_chamber', 'growth_opportunities'],
    exportFormats: ['social_card', 'pdf_report', 'csv', 'json'],
    rateLimit: 120,
  },
  CREATOR: {
    maxGraphs: 5,
    maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5GB
    maxFileSizeBytes: 500 * 1024 * 1024, // 500MB
    maxNodesPerGraph: -1, // unlimited
    insightTypes: ['community_overview', 'engagement_summary', 'key_connectors', 'echo_chamber', 'growth_opportunities', 'audience_analysis', 'content_performance'],
    exportFormats: ['social_card', 'pdf_report', 'csv', 'json', 'white_label'],
    rateLimit: 300,
  },
};
