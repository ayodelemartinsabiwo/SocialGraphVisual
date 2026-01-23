/**
 * Twitter Parser
 * @module workers/parsers/TwitterParser
 *
 * Parses Twitter/X data export files.
 * Handles following.js, follower.js, tweet.js, and like.js files.
 */

import { Platform, NodeType, EdgeType } from '@vsg/shared';
import { BaseParser } from './BaseParser';
import type {
  ParsedResult,
  ParsingProgress,
  TwitterFollowing,
  TwitterFollower,
  TwitterTweet,
  TwitterLike,
} from './types';

// ============================================================
// TWITTER PARSER
// ============================================================

export class TwitterParser extends BaseParser {
  platform = Platform.TWITTER;
  version = 'twitter_v2.0';
  supportedFiles = ['following.js', 'follower.js', 'tweet.js', 'like.js'];

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

    // Check for required files (at least following OR follower)
    const hasFollowing = this.findFile(files, 'following.js');
    const hasFollower = this.findFile(files, 'follower.js');

    if (!hasFollowing && !hasFollower) {
      errors.push('Missing required files: following.js or follower.js');
    }

    // Check for optional files
    if (!this.findFile(files, 'tweet.js')) {
      warnings.push('tweet.js not found - interaction data will be limited');
    }

    if (!this.findFile(files, 'like.js')) {
      warnings.push('like.js not found - like data will not be included');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Parse Twitter data
   */
  async parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult> {
    this.reset();

    const fileName = 'twitter_export.zip';
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

    // Create self node (the user who exported)
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
      percentage: 15,
      message: 'Parsing following list...',
    });

    const followingFile = this.findFile(files, 'following.js');
    if (followingFile) {
      await this.parseFollowing(files.get(followingFile)!);
    }

    // Phase 3: Parse followers
    onProgress({
      phase: 'parsing-followers',
      current: 30,
      total: 100,
      percentage: 35,
      message: 'Parsing followers list...',
    });

    const followerFile = this.findFile(files, 'follower.js');
    if (followerFile) {
      await this.parseFollowers(files.get(followerFile)!);
    }

    // Phase 4: Parse interactions (tweets)
    onProgress({
      phase: 'parsing-interactions',
      current: 50,
      total: 100,
      percentage: 55,
      message: 'Parsing tweet interactions...',
    });

    const tweetFile = this.findFile(files, 'tweet.js');
    if (tweetFile) {
      await this.parseTweets(files.get(tweetFile)!);
    }

    // Phase 5: Parse likes
    onProgress({
      phase: 'parsing-interactions',
      current: 60,
      total: 100,
      percentage: 65,
      message: 'Parsing likes...',
    });

    const likeFile = this.findFile(files, 'like.js');
    if (likeFile) {
      await this.parseLikes(files.get(likeFile)!);
    }

    // Phase 6: Build graph
    onProgress({
      phase: 'building-graph',
      current: 70,
      total: 100,
      percentage: 75,
      message: 'Building relationship graph...',
    });

    // Detect mutual relationships
    this.detectMutualRelationships();

    // Phase 7: Calculate weights
    onProgress({
      phase: 'calculating-weights',
      current: 80,
      total: 100,
      percentage: 85,
      message: 'Calculating edge weights...',
    });

    this.calculateEdgeWeights();
    this.calculateDegrees();

    // Update self node follower/following counts
    const self = this.nodeMap.get('self');
    if (self) {
      self.followingCount = self.outDegree;
      self.followerCount = self.inDegree;
    }

    // Phase 8: Finalize
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
   * Parse following.js file
   */
  private async parseFollowing(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseTwitterJs<TwitterFollowing>(buffer);
    if (!data) return;

    for (const item of data) {
      const accountId = item.following?.accountId;
      if (!accountId) continue;

      // Create node for followed user if not exists
      if (!this.nodeMap.has(accountId)) {
        const node = this.createNode({
          id: accountId,
          username: accountId,
          displayName: accountId,
          type: 'USER' as NodeType,
        });
        this.nodeMap.set(accountId, node);
      }

      // Create edge: self follows this user
      this.createOrUpdateEdge('self', accountId, 'FOLLOWS' as EdgeType);
    }
  }

  /**
   * Parse follower.js file
   */
  private async parseFollowers(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseTwitterJs<TwitterFollower>(buffer);
    if (!data) return;

    for (const item of data) {
      const accountId = item.follower?.accountId;
      if (!accountId) continue;

      // Create node for follower if not exists
      if (!this.nodeMap.has(accountId)) {
        const node = this.createNode({
          id: accountId,
          username: accountId,
          displayName: accountId,
          type: 'USER' as NodeType,
        });
        this.nodeMap.set(accountId, node);
      }

      // Create edge: this user follows self
      this.createOrUpdateEdge(accountId, 'self', 'FOLLOWED_BY' as EdgeType);
    }
  }

  /**
   * Parse tweet.js file for interactions
   */
  private async parseTweets(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseTwitterJs<TwitterTweet>(buffer);
    if (!data) return;

    for (const item of data) {
      const tweet = item.tweet;
      if (!tweet) continue;

      // Check for replies
      if (tweet.in_reply_to_user_id_str) {
        const targetId = tweet.in_reply_to_user_id_str;

        // Add interaction if user exists in our graph
        if (this.nodeMap.has(targetId)) {
          this.createOrUpdateEdge('self', targetId, 'ENGAGES_WITH' as EdgeType, {
            comments: 1,
          });
        }
      }

      // Check for mentions
      if (tweet.entities?.user_mentions) {
        for (const mention of tweet.entities.user_mentions) {
          const targetId = mention.id_str;

          // Add interaction if user exists in our graph
          if (this.nodeMap.has(targetId)) {
            this.createOrUpdateEdge('self', targetId, 'ENGAGES_WITH' as EdgeType, {
              mentions: 1,
            });
          }
        }
      }
    }
  }

  /**
   * Parse like.js file
   */
  private async parseLikes(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseTwitterJs<TwitterLike>(buffer);
    if (!data) return;

    // Likes don't include user IDs directly in the standard export
    // We can only track total like count
    // This would need enhanced parsing with API data
    if (data.length > 0) {
      this.addWarning(`Found ${data.length} likes, but user attribution is limited in export format`);
    }
  }

  /**
   * Find a file in the map (case-insensitive, supports paths)
   */
  private findFile(files: Map<string, ArrayBuffer>, targetName: string): string | null {
    for (const fileName of files.keys()) {
      const normalizedFileName = fileName.toLowerCase();
      const normalizedTarget = targetName.toLowerCase();

      if (
        normalizedFileName === normalizedTarget ||
        normalizedFileName.endsWith('/' + normalizedTarget) ||
        normalizedFileName.endsWith('\\' + normalizedTarget)
      ) {
        return fileName;
      }
    }
    return null;
  }
}

export default TwitterParser;
