/**
 * Insight-related type definitions
 * @module @vsg/shared/types/insight
 */

// ============ ENUMS ============

export const InsightCategory = {
  NETWORK: 'NETWORK',
  COMMUNITY: 'COMMUNITY',
  ENGAGEMENT: 'ENGAGEMENT',
  GROWTH: 'GROWTH',
} as const;

export type InsightCategory = (typeof InsightCategory)[keyof typeof InsightCategory];

export const Confidence = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;

export type Confidence = (typeof Confidence)[keyof typeof Confidence];

export const InsightType = {
  // Community insights
  COMMUNITY_OVERVIEW: 'community_overview',
  COMMUNITY_DETAIL: 'community_detail',
  ECHO_CHAMBER: 'echo_chamber',

  // Engagement insights
  ENGAGEMENT_SUMMARY: 'engagement_summary',
  ENGAGEMENT_CIRCLES: 'engagement_circles',
  SUPER_FANS: 'super_fans',
  DORMANT_CONNECTIONS: 'dormant_connections',

  // Network insights
  KEY_CONNECTORS: 'key_connectors',
  BRIDGE_POSITION: 'bridge_position',
  INFLUENCE_SCORE: 'influence_score',
  NETWORK_REACH: 'network_reach',

  // Growth insights
  GROWTH_OPPORTUNITIES: 'growth_opportunities',
  AUDIENCE_GAPS: 'audience_gaps',
  CONTENT_RECOMMENDATIONS: 'content_recommendations',
} as const;

export type InsightType = (typeof InsightType)[keyof typeof InsightType];

// ============ INSIGHT ACTIONS ============

export const ActionEffort = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type ActionEffort = (typeof ActionEffort)[keyof typeof ActionEffort];

export const ActionImpact = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type ActionImpact = (typeof ActionImpact)[keyof typeof ActionImpact];

export interface InsightAction {
  title: string;
  description: string;
  effort: ActionEffort;
  impact: ActionImpact;
  targetNodes?: string[]; // node IDs to act upon
}

// ============ VISUAL ANNOTATIONS ============

export interface VisualAnnotations {
  highlightNodes?: string[];
  highlightEdges?: string[];
  highlightCommunities?: number[];
  colorBy?: 'engagement' | 'centrality' | 'community' | 'recency';
  focusNode?: string;
  zoomLevel?: number;
}

// ============ INSIGHT DATA TYPES ============

export interface CommunityOverviewData {
  communityCount: number;
  modularity: number;
  largestCommunity: {
    id: number;
    size: number;
    percentage: number;
    topMembers: string[];
  };
  communityDistribution: Array<{
    id: number;
    size: number;
    percentage: number;
    label?: string;
  }>;
}

export interface EngagementCirclesData {
  superFans: {
    count: number;
    percentage: number;
    nodeIds: string[];
  };
  regularEngagers: {
    count: number;
    percentage: number;
    nodeIds: string[];
  };
  occasionalEngagers: {
    count: number;
    percentage: number;
    nodeIds: string[];
  };
  ghostFollowers: {
    count: number;
    percentage: number;
    nodeIds: string[];
  };
}

export interface KeyConnectorsData {
  bridges: Array<{
    nodeId: string;
    betweenness: number;
    communitiesConnected: number[];
    reachExtension: number;
  }>;
  bridgeCount: number;
  bridgePercentage: number;
}

export interface EchoChamberData {
  homophilyIndex: number; // 0-1
  intraCommunityPercentage: number;
  interCommunityPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  diverseConnections: string[];
  recommendations: string[];
}

export interface GrowthOpportunitiesData {
  underservedCommunities: Array<{
    id: number;
    currentConnections: number;
    potentialReach: number;
    engagementPotential: number;
  }>;
  suggestedConnections: Array<{
    nodeId: string;
    reason: string;
    potentialValue: number;
  }>;
}

export type InsightData =
  | CommunityOverviewData
  | EngagementCirclesData
  | KeyConnectorsData
  | EchoChamberData
  | GrowthOpportunitiesData
  | Record<string, unknown>; // Generic fallback

// ============ INSIGHT (FULL MODEL) ============

export interface Insight {
  id: string;
  graphId: string;
  category: InsightCategory;
  type: InsightType;
  title: string;
  description: string;

  data: InsightData;
  confidence: Confidence;

  actions: InsightAction[];
  visualAnnotations: VisualAnnotations;

  priority: number;
  isHighlighted: boolean;

  templateId?: string;
  templateVersion?: string;

  createdAt: Date;
}

export interface InsightSummary {
  id: string;
  category: InsightCategory;
  type: InsightType;
  title: string;
  confidence: Confidence;
  priority: number;
  isHighlighted: boolean;
}

// ============ INSIGHT TEMPLATE ============

export interface InsightTemplate {
  id: string;
  type: InsightType;
  category: InsightCategory;
  version: string;

  // Conditions for when this template applies
  conditions: {
    minNodes?: number;
    maxNodes?: number;
    minCommunities?: number;
    requiredMetrics?: string[];
  };

  // Template strings with placeholders
  titleTemplate: string;
  descriptionTemplate: string;
  actionTemplates: Array<{
    titleTemplate: string;
    descriptionTemplate: string;
    effort: ActionEffort;
    impact: ActionImpact;
  }>;

  // Confidence calculation
  confidenceFactors: {
    minNodesForHigh: number;
    minDataDaysForHigh: number;
  };
}

// ============ INSIGHT GENERATION REQUEST ============

export interface GenerateInsightsRequest {
  graphId: string;
  categories?: InsightCategory[];
  types?: InsightType[];
  regenerate?: boolean;
}

export interface GenerateInsightsResponse {
  insights: Insight[];
  processingTime: number;
  warnings?: string[];
}
