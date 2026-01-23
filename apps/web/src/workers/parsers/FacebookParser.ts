/**
 * Facebook Parser
 * @module workers/parsers/FacebookParser
 *
 * Parses Facebook data export files.
 * Handles friends.json file.
 */

import { Platform, NodeType, EdgeType } from '@vsg/shared';
import { BaseParser } from './BaseParser';
import type { ParsedResult, ParsingProgress, FacebookFriend } from './types';

// ============================================================
// FACEBOOK PARSER
// ============================================================

export class FacebookParser extends BaseParser {
  platform = Platform.FACEBOOK;
  version = 'facebook_v1.0';
  supportedFiles = ['friends/friends.json', 'friends.json'];

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

    const hasFriends = this.findFile(files, 'friends.json') !== null;

    if (!hasFriends) {
      errors.push('Missing required file: friends.json');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Parse Facebook data
   */
  async parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult> {
    this.reset();

    const fileName = 'facebook_export.zip';
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

    // Phase 2: Parse friends
    onProgress({
      phase: 'parsing-following',
      current: 20,
      total: 100,
      percentage: 30,
      message: 'Parsing friends list...',
    });

    const friendsFile = this.findFile(files, 'friends.json');
    if (friendsFile) {
      await this.parseFriends(files.get(friendsFile)!);
    }

    // Phase 3: Build graph (Facebook friends are always mutual)
    onProgress({
      phase: 'building-graph',
      current: 70,
      total: 100,
      percentage: 75,
      message: 'Building relationship graph...',
    });

    // Phase 4: Calculate weights
    onProgress({
      phase: 'calculating-weights',
      current: 85,
      total: 100,
      percentage: 90,
      message: 'Calculating edge weights...',
    });

    this.calculateEdgeWeights();
    this.calculateDegrees();

    // Update self node counts (friends are mutual on Facebook)
    const self = this.nodeMap.get('self');
    if (self) {
      self.followingCount = self.degree;
      self.followerCount = self.degree;
    }

    // Phase 5: Finalize
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
   * Parse friends.json file
   */
  private async parseFriends(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseJson<{
      friends_v2?: FacebookFriend[];
      friends?: FacebookFriend[];
    } | FacebookFriend[]>(buffer);

    if (!data) return;

    // Handle different Facebook export formats
    let friendsList: FacebookFriend[] = [];

    if (Array.isArray(data)) {
      friendsList = data;
    } else if (data.friends_v2) {
      friendsList = data.friends_v2;
    } else if (data.friends) {
      friendsList = data.friends;
    }

    for (const friend of friendsList) {
      const name = friend.name;
      if (!name) continue;

      const userId = this.generateUserId(name);

      // Create node for friend
      if (!this.nodeMap.has(userId)) {
        const node = this.createNode({
          id: userId,
          username: name.toLowerCase().replace(/\s+/g, '_'),
          displayName: name,
          type: 'USER' as NodeType,
        });
        this.nodeMap.set(userId, node);
      }

      // Facebook friends are always mutual
      this.createOrUpdateEdge('self', userId, 'MUTUAL' as EdgeType);
    }
  }

  /**
   * Generate a consistent user ID from name
   */
  private generateUserId(name: string): string {
    const normalized = name.toLowerCase();
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `fb_${Math.abs(hash).toString(16)}`;
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

export default FacebookParser;
