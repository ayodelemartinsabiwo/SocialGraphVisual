/**
 * Instagram Parser
 * @module workers/parsers/InstagramParser
 *
 * Parses Instagram data export files.
 * Handles followers.json and following.json files.
 */

import { Platform, NodeType, EdgeType } from '@vsg/shared';
import { BaseParser } from './BaseParser';
import type {
  ParsedResult,
  ParsingProgress,
  InstagramFollower,
  InstagramFollowing,
} from './types';

// ============================================================
// INSTAGRAM PARSER
// ============================================================

export class InstagramParser extends BaseParser {
  platform = Platform.INSTAGRAM;
  version = 'instagram_v1.0';
  supportedFiles = [
    'followers_and_following/followers.json',
    'followers_and_following/following.json',
    'followers_1.json',
    'following.json',
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

    // Check for followers file
    const hasFollowers = this.findFile(files, 'followers') !== null;
    // Check for following file
    const hasFollowing = this.findFile(files, 'following') !== null;

    if (!hasFollowers && !hasFollowing) {
      errors.push('Missing required files: followers.json or following.json');
    }

    if (!hasFollowers) {
      warnings.push('followers.json not found - follower data will be limited');
    }

    if (!hasFollowing) {
      warnings.push('following.json not found - following data will be limited');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Parse Instagram data
   */
  async parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult> {
    this.reset();

    const fileName = 'instagram_export.zip';
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

    const followersFile = this.findFile(files, 'followers');
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
   * Parse following file
   */
  private async parseFollowing(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseJson<InstagramFollowing[] | { relationships_following: InstagramFollowing[] }>(buffer);
    if (!data) return;

    // Handle different Instagram export formats
    const followingList = Array.isArray(data)
      ? data
      : data.relationships_following || [];

    for (const item of followingList) {
      // Try to get username from different possible locations:
      // 1. string_list_data[0].value (older format)
      // 2. title field (newer format)
      const stringData = item.string_list_data;
      let username = stringData?.[0]?.value;

      // Fall back to title if value not present
      if (!username && item.title) {
        username = item.title;
      }

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
   * Parse followers file
   */
  private async parseFollowers(buffer: ArrayBuffer): Promise<void> {
    const data = this.parseJson<InstagramFollower[] | { relationships_followers: InstagramFollower[] }>(buffer);
    if (!data) return;

    // Handle different Instagram export formats
    const followersList = Array.isArray(data)
      ? data
      : data.relationships_followers || [];

    for (const item of followersList) {
      // Try to get username from different possible locations:
      // 1. string_list_data[0].value (older format)
      // 2. title field (newer format)
      const stringData = item.string_list_data;
      let username = stringData?.[0]?.value;

      // Fall back to title if value not present
      if (!username && item.title) {
        username = item.title;
      }

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
    return `ig_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Find a file in the map (case-insensitive, supports paths)
   * Prioritizes files in followers_and_following directory over threads directory
   */
  private findFile(files: Map<string, ArrayBuffer>, targetName: string): string | null {
    console.log(`[InstagramParser] Searching for file containing: "${targetName}"`);
    console.log(`[InstagramParser] Available files:`, Array.from(files.keys()));

    const candidates: string[] = [];

    for (const fileName of files.keys()) {
      const normalizedFileName = fileName.toLowerCase();
      const normalizedTarget = targetName.toLowerCase();

      if (normalizedFileName.includes(normalizedTarget)) {
        candidates.push(fileName);
      }
    }

    console.log(`[InstagramParser] Found ${candidates.length} candidates:`, candidates);

    if (candidates.length === 0) {
      console.log(`[InstagramParser] No file found containing: "${targetName}"`);
      return null;
    }

    // Priority 1: files in followers_and_following directory (the main Instagram data)
    const followersAndFollowingMatch = candidates.find(f =>
      f.toLowerCase().includes('followers_and_following') ||
      f.toLowerCase().includes('connections/followers_and_following')
    );
    if (followersAndFollowingMatch) {
      console.log(`[InstagramParser] Found primary match (followers_and_following): "${followersAndFollowingMatch}"`);
      return followersAndFollowingMatch;
    }

    // Priority 2: files directly named followers_1.json or following.json (numbered format)
    const numberedMatch = candidates.find(f => {
      const baseName = f.split('/').pop()?.toLowerCase() || '';
      return baseName.match(/^followers_\d+\.json$/) || baseName.match(/^following\.json$/);
    });
    if (numberedMatch) {
      console.log(`[InstagramParser] Found numbered match: "${numberedMatch}"`);
      return numberedMatch;
    }

    // Priority 3: AVOID threads directory (that's Threads app data, not Instagram)
    const nonThreadsMatch = candidates.find(f => !f.toLowerCase().includes('/threads/'));
    if (nonThreadsMatch) {
      console.log(`[InstagramParser] Found non-threads match: "${nonThreadsMatch}"`);
      return nonThreadsMatch;
    }

    // Last resort: use any match, but warn about it
    console.warn(`[InstagramParser] Only found Threads data, which may not contain Instagram followers/following`);
    console.log(`[InstagramParser] Using fallback match: "${candidates[0]}"`);
    return candidates[0];
  }
}

export default InstagramParser;
