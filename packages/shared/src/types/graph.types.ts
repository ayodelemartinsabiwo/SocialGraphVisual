/**
 * Graph-related type definitions
 * @module @vsg/shared/types/graph
 */

// ============ ENUMS ============

export const Platform = {
  TWITTER: 'TWITTER',
  INSTAGRAM: 'INSTAGRAM',
  LINKEDIN: 'LINKEDIN',
  FACEBOOK: 'FACEBOOK',
  TIKTOK: 'TIKTOK',
} as const;

export type Platform = (typeof Platform)[keyof typeof Platform];

export const GraphStatus = {
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  ERROR: 'ERROR',
} as const;

export type GraphStatus = (typeof GraphStatus)[keyof typeof GraphStatus];

export const UploadStatus = {
  PENDING: 'PENDING',
  UPLOADING: 'UPLOADING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const;

export type UploadStatus = (typeof UploadStatus)[keyof typeof UploadStatus];

export const EdgeType = {
  FOLLOWS: 'FOLLOWS',
  FOLLOWED_BY: 'FOLLOWED_BY',
  MUTUAL: 'MUTUAL',
  ENGAGES_WITH: 'ENGAGES_WITH',
} as const;

export type EdgeType = (typeof EdgeType)[keyof typeof EdgeType];

export const NodeType = {
  SELF: 'SELF',
  USER: 'USER',
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

// ============ GRAPH NODES ============

export interface GraphNode {
  id: string; // pseudonymized identifier
  type: NodeType;
  displayName: string; // pseudonymized or revealed
  username: string; // pseudonymized

  // Social metrics (from source data)
  followerCount?: number;
  followingCount?: number;

  // Computed metrics (from analysis)
  degree?: number;
  inDegree?: number;
  outDegree?: number;
  pageRank?: number;
  betweenness?: number;
  communityId?: number;

  // Engagement data
  engagementScore?: number;
  lastInteraction?: Date;
  interactionCount?: number;

  // Position (for visualization persistence)
  x?: number;
  y?: number;
  fx?: number | null; // fixed x (when pinned)
  fy?: number | null; // fixed y (when pinned)
}

// ============ GRAPH EDGES ============

export interface GraphEdge {
  id: string;
  source: string; // node id
  target: string; // node id
  type: EdgeType;
  weight: number; // 0-1 (engagement strength)

  // Interaction details
  interactions?: {
    likes?: number;
    comments?: number;
    shares?: number;
    messages?: number;
    mentions?: number;
  };

  createdAt?: Date;
}

// ============ GRAPH METADATA ============

export interface GraphMetadata {
  uploadId: string;
  parseVersion: string; // e.g., "twitter_v2.1"
  parsingErrors: ParsingError[];

  statistics: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    averageDegree: number;
  };

  timePeriod?: {
    start: Date;
    end: Date;
  };

  sourceFileInfo: {
    fileName: string;
    fileSize: number;
    checksum: string;
  };
}

export interface ParsingError {
  code: string;
  message: string;
  file?: string;
  line?: number;
  recoverable: boolean;
}

// ============ COMPUTED STATISTICS ============

export interface GraphStatistics {
  // Basic structure
  nodeCount: number;
  edgeCount: number;
  density: number;
  avgDegree: number;
  avgPathLength?: number;
  diameter?: number;
  clusteringCoefficient?: number;

  // Community analysis
  communities: {
    count: number;
    modularity: number;
    sizes: number[];
    distribution: {
      largest: number;
      top3: number;
      top5: number;
    };
  };

  // Centrality metrics
  centrality: {
    pageRank: {
      top10: Array<{ nodeId: string; score: number }>;
      selfRank?: number;
      selfPercentile?: number;
    };
    betweenness: {
      top10: Array<{ nodeId: string; score: number }>;
      bridgeNodes: string[];
      bridgePercentage: number;
    };
    degree: {
      max: number;
      min: number;
      median: number;
      distribution: {
        p25: number;
        p50: number;
        p75: number;
        p90: number;
        p99: number;
      };
    };
  };

  // Engagement analysis
  engagement: {
    avgWeight: number;
    activeConnections: number;
    passiveConnections: number;
    activePercentage: number;
    reciprocal: number;
    oneWay: number;
    reciprocityScore: number;
  };

  // Pattern detection
  patterns: {
    homophily: {
      intraCommunityEdges: number;
      interCommunityEdges: number;
      homophilyIndex: number;
    };
  };

  computedAt: Date;
  computationTime: number; // ms
}

// ============ GRAPH (FULL MODEL) ============

export interface Graph {
  id: string;
  userId: string;
  platform: Platform;
  version: number;
  isLatest: boolean;
  status: GraphStatus;

  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
  statistics: GraphStatistics | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface GraphSummary {
  id: string;
  platform: Platform;
  version: number;
  isLatest: boolean;
  status: GraphStatus;
  nodeCount: number;
  edgeCount: number;
  communityCount: number;
  createdAt: Date;
}

// ============ UPLOAD ============

export interface Upload {
  id: string;
  userId: string;
  platform: Platform;
  fileName: string;
  fileSize: number;
  checksum: string | null;
  uploadUrl: string | null;
  status: UploadStatus;
  errorMsg: string | null;
  expiresAt: Date;
  createdAt: Date;
  completedAt: Date | null;
}

// ============ PLATFORM CONFIG ============

export interface PlatformConfig {
  id: Platform;
  name: string;
  color: string;
  bgColor: string;
  supportedFiles: string[];
  exportUrl: string;
  instructions: string[];
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  TWITTER: {
    id: Platform.TWITTER,
    name: 'Twitter/X',
    color: '#000000',
    bgColor: '#000000',
    supportedFiles: ['following.js', 'follower.js', 'like.js', 'tweet.js'],
    exportUrl: 'https://twitter.com/settings/download_your_data',
    instructions: [
      'Go to Settings > Your Account > Download an archive of your data',
      'Request your archive and wait for the email',
      'Download the ZIP file when ready',
      'Upload the complete ZIP file here',
    ],
  },
  INSTAGRAM: {
    id: Platform.INSTAGRAM,
    name: 'Instagram',
    color: '#E4405F',
    bgColor: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    supportedFiles: ['followers_and_following/followers.json', 'following.json'],
    exportUrl: 'https://www.instagram.com/download/request/',
    instructions: [
      'Go to Settings > Privacy and Security > Download Data',
      'Request download in JSON format',
      'Wait for email with download link',
      'Upload the complete ZIP file here',
    ],
  },
  LINKEDIN: {
    id: Platform.LINKEDIN,
    name: 'LinkedIn',
    color: '#0077B5',
    bgColor: '#0077B5',
    supportedFiles: ['Connections.csv', 'messages.csv'],
    exportUrl: 'https://www.linkedin.com/mypreferences/d/download-my-data',
    instructions: [
      'Go to Settings > Data Privacy > Get a copy of your data',
      'Select the data you want to download',
      'Request archive and wait for email',
      'Upload the complete ZIP file here',
    ],
  },
  FACEBOOK: {
    id: Platform.FACEBOOK,
    name: 'Facebook',
    color: '#1877F2',
    bgColor: '#1877F2',
    supportedFiles: ['friends/friends.json', 'comments/comments.json'],
    exportUrl: 'https://www.facebook.com/dyi/',
    instructions: [
      'Go to Settings > Your Facebook Information > Download Your Information',
      'Select JSON format for your data',
      'Create file and wait for download',
      'Upload the complete ZIP file here',
    ],
  },
  TIKTOK: {
    id: Platform.TIKTOK,
    name: 'TikTok',
    color: '#000000',
    bgColor: '#000000',
    supportedFiles: ['Following.txt', 'Follower.txt'],
    exportUrl: 'https://www.tiktok.com/setting/download-your-data',
    instructions: [
      'Go to Profile > Menu > Settings and Privacy > Privacy',
      'Tap Download your data > Request data',
      'Select JSON file format',
      'Upload the complete ZIP file here',
    ],
  },
};
