/**
 * Parser Types
 * @module workers/parsers/types
 *
 * Common types and interfaces for all platform parsers.
 */

import type { Platform, GraphNode, GraphEdge, ParsingError, NodeType, EdgeType } from '@vsg/shared';

// ============================================================
// PARSING TYPES
// ============================================================

export type ParsingPhase =
  | 'extracting'
  | 'validating'
  | 'parsing-followers'
  | 'parsing-following'
  | 'parsing-interactions'
  | 'building-graph'
  | 'pseudonymizing'
  | 'calculating-weights'
  | 'finalizing';

export interface ParsingProgress {
  phase: ParsingPhase;
  current: number;
  total: number;
  percentage: number;
  message: string;
}

export interface ParsedResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    parseVersion: string;
    parsingErrors: ParsingError[];
    timePeriod?: {
      start: Date;
      end: Date;
    };
    sourceFileInfo: {
      fileName: string;
      fileSize: number;
      checksum: string;
    };
  };
}

// ============================================================
// RAW DATA TYPES (Platform-specific)
// ============================================================

// Twitter
export interface TwitterFollowing {
  following: {
    accountId: string;
    userLink: string;
  };
}

export interface TwitterFollower {
  follower: {
    accountId: string;
    userLink: string;
  };
}

export interface TwitterTweet {
  tweet: {
    id_str: string;
    full_text: string;
    created_at: string;
    entities?: {
      user_mentions?: Array<{
        id_str: string;
        screen_name: string;
      }>;
    };
    in_reply_to_user_id_str?: string;
    in_reply_to_screen_name?: string;
  };
}

export interface TwitterLike {
  like: {
    tweetId: string;
    fullText?: string;
  };
}

// Instagram
export interface InstagramFollower {
  string_list_data: Array<{
    value: string;
    timestamp: number;
  }>;
}

export interface InstagramFollowing {
  string_list_data: Array<{
    value: string;
    timestamp: number;
  }>;
}

// LinkedIn
export interface LinkedInConnection {
  'First Name': string;
  'Last Name': string;
  'Email Address': string;
  'Company': string;
  'Position': string;
  'Connected On': string;
}

// Facebook
export interface FacebookFriend {
  name: string;
  timestamp: number;
}

// TikTok
export interface TikTokFollower {
  UserName: string;
  Date: string;
}

export interface TikTokFollowing {
  UserName: string;
  Date: string;
}

// ============================================================
// PARSER INTERFACE
// ============================================================

export interface PlatformParser {
  platform: Platform;
  version: string;
  supportedFiles: string[];

  /**
   * Validate that required files exist in the ZIP
   */
  validateFiles(files: Map<string, ArrayBuffer>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };

  /**
   * Parse the data and return graph nodes/edges
   */
  parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult>;
}

// ============================================================
// HELPER TYPES
// ============================================================

export interface UserMap {
  id: string;
  username: string;
  displayName: string;
  type: NodeType;
  followerCount?: number;
  followingCount?: number;
}

export interface InteractionCount {
  likes: number;
  comments: number;
  shares: number;
  messages: number;
  mentions: number;
}

// ============================================================
// WORKER MESSAGE TYPES
// ============================================================

export type WorkerMessageType =
  | 'WORKER_READY'
  | 'PARSE_START'
  | 'PARSE_PROGRESS'
  | 'PARSE_COMPLETE'
  | 'PARSE_ERROR'
  | 'CANCEL';

export interface WorkerMessage {
  type: WorkerMessageType;
  payload?: unknown;
}

export interface ParseStartPayload {
  platform: Platform;
  fileData: ArrayBuffer;
  fileName: string;
}

export interface ParseProgressPayload {
  progress: ParsingProgress;
}

export interface ParseCompletePayload {
  result: ParsedResult;
}

export interface ParseErrorPayload {
  error: string;
  details?: unknown;
}
