/**
 * TikTok Parser
 * @module workers/parsers/TikTokParser
 *
 * Parses TikTok data export files.
 * Handles Follower.json and Following.json files.
 */

import { Platform, NodeType, EdgeType } from '@vsg/shared';
import { BaseParser } from './BaseParser';
import type {
  ParsedResult,
  ParsingProgress,
  TikTokFollower,
  TikTokFollowing,
} from './types';

// ============================================================
// TIKTOK PARSER
// ============================================================

export class TikTokParser extends BaseParser {
  platform = Platform.TIKTOK;
  version = 'tiktok_v1.0';
  supportedFiles = [
    'Follower.json',
    'Following.json',
    'Follower List.json',
    'Following List.json',
  ];

  /**
   * Validate that required files exist
   */
  validateFiles(files: Map<string, ArrayBuffer>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const hasFollowers = this.findFile(files, 'follower') !== null;
    const hasFollowing = this.findFile(files, 'following') !== null;

    if (!hasFollowers && !hasFollowing) {
      errors.push('Missing required files: Follower.json or Following.json');
    }

    if (!hasFollowers) {
      warnings.push('Follower.json not found - follower data will be limited');
    }

    if (!hasFollowing) {
      warnings.push('Following.json not found - following data will be limited');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Parse TikTok data
   */
  async parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult> {
    this.reset();

    const fileName = 'tiktok_export.zip';
    let totalFileSize = 0;
    for (const buffer of files.values()) {
      totalFileSize += buffer.byteLength;
    }

    // Phase 1: Validate
    onProgress({
      phase: 'validating',
      current: 0,
      total: 100,
      percentage: 5,
      message: 'Validating file structure...',
    });

    // Create self node
    const selfNode = this.createNode({
      id: 'self',
      username: 'me',
      displayName: 'You',
      type: 'SELF' as NodeType,
    });
    selfNode.displayName = 'You';
    selfNode.username = '@you';
    this.nodeMap.set('self', selfNode);

    // Phase 2: Parse following
    onProgress({
      phase: 'parsing-following',
      current: 10,
      total: 100,
      percentage: 25,
      message: 'Parsing following list...',
    });

    const followingFile = this.findFile(files, 'following');
    if (followingFile) {
      await this.parseFollowing(files.get(followingFile)!);
    }

    // Phase 3: Parse followers
    onProgress({
      phase: 'parsing-followers',
      current: 40,
      total: 100,
      percentage: 50,
      message: 'Parsing followers list...',
    });

    const followersFile = this.findFile(files, 'follower');
    if (followersFile) {
      await this.parseFollowers(files.get(followersFile)!);
    }

    // Phase 4: Build graph
    onProgress({
      phase: 'building-graph',
      current: 70,
      total: 100,
      percentage: 75,
      message: 'Building relationship graph...',
    });

    // Detect mutual relationships
    this.detectMutualRelationships();

    // Phase 5: Calculate weights
    onProgress({
      phase: 'calculating-weights',
      current: 85,
      total: 100,
      percentage: 90,
      message: 'Calculating edge weights...',
    });

    this.calculateEdgeWeights();
    this.calculateDegrees();

    // Update self node counts
    const self = this.nodeMap.get('self');
    if (self) {
      self.followingCount = self.outDegree;
      self.followerCount = self.inDegree;
    }

    // Phase 6: Finalize
    onProgress({
      phase: 'finalizing',
      current: 95,
      total: 100,
      percentage: 98,
      message: 'Finalizing graph data...',
    });

    const result: ParsedResult = {
      nodes: Array.from(this.nodeMap.values()),
      edges: Array.from(this.edgeMap.values()),
      metadata: {
        parseVersion: this.version,
        parsingErrors: this.errors,
        sourceFileInfo: {
          fileName,
          fileSize: totalFileSize,
          checksum: this.calculateChecksum(
            files.values().next().value || new ArrayBuffer(0)
          ),
        },
      },
    };

    onProgress({
      phase: 'finalizing',
      current: 100,
      total: 100,
      percentage: 100,
      message: `Parsed ${result.nodes.length} nodes and ${result.edges.length} edges`,
    });

    return result;
  }

  // ============================================================
  // PRIVATE PARSING METHODS
  // ============================================================

  /**
   * Parse Following.json file
   */
  private async parseFollowing(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseJson<{
      Following?: TikTokFollowing[];
      FollowingList?: TikTokFollowing[];
    } | TikTokFollowing[]>(buffer);

    if (!data) return;

    // Handle different TikTok export formats
    let followingList: TikTokFollowing[] = [];

    if (Array.isArray(data)) {
      followingList = data;
    } else if (data.Following) {
      followingList = data.Following;
    } else if (data.FollowingList) {
      followingList = data.FollowingList;
    }

    for (const item of followingList) {
      const username = item.UserName;
      if (!username) continue;

      const userId = this.generateUserId(username);

      // Create node for followed user if not exists
      if (!this.nodeMap.has(userId)) {
        const node = this.createNode({
          id: userId,
          username: username,
          displayName: username,
          type: 'USER' as NodeType,
        });
        this.nodeMap.set(userId, node);
      }

      // Create edge: self follows this user
      this.createOrUpdateEdge('self', userId, 'FOLLOWS' as EdgeType);
    }
  }

  /**
   * Parse Follower.json file
   */
  private async parseFollowers(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseJson<{
      Follower?: TikTokFollower[];
      FollowerList?: TikTokFollower[];
      FansList?: TikTokFollower[];
    } | TikTokFollower[]>(buffer);

    if (!data) return;

    // Handle different TikTok export formats
    let followerList: TikTokFollower[] = [];

    if (Array.isArray(data)) {
      followerList = data;
    } else if (data.Follower) {
      followerList = data.Follower;
    } else if (data.FollowerList) {
      followerList = data.FollowerList;
    } else if (data.FansList) {
      followerList = data.FansList;
    }

    for (const item of followerList) {
      const username = item.UserName;
      if (!username) continue;

      const userId = this.generateUserId(username);

      // Create node for follower if not exists
      if (!this.nodeMap.has(userId)) {
        const node = this.createNode({
          id: userId,
          username: username,
          displayName: username,
          type: 'USER' as NodeType,
        });
        this.nodeMap.set(userId, node);
      }

      // Create edge: this user follows self
      this.createOrUpdateEdge(userId, 'self', 'FOLLOWED_BY' as EdgeType);
    }
  }

  /**
   * Generate a consistent user ID from username
   */
  private generateUserId(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `tt_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Find a file in the map (case-insensitive, supports paths)
   */
  private findFile(files: Map<string, ArrayBuffer>, targetName: string): string | null {
    for (const fileName of files.keys()) {
      const normalizedFileName = fileName.toLowerCase();
      const normalizedTarget = targetName.toLowerCase();

      if (normalizedFileName.includes(normalizedTarget)) {
        return fileName;
      }
    }
    return null;
  }
}

export default TikTokParser;
