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
    // Newer Meta export format (2024+)
    'connections/followers_and_following/followers_1.json',
    'connections/followers_and_following/following.json',
    // Older Instagram export format
    'followers_and_following/followers.json',
    'followers_and_following/following.json',
    'followers_and_following/followers_1.json',
    // Direct files (some exports)
    'followers_1.json',
    'following.json',
    'followers.json',
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

    // Log all available files for debugging
    const allFiles = Array.from(files.keys());
    console.log(`[InstagramParser] Validating ${allFiles.length} files`);

    // Check for connections folder (newer Meta export)
    const hasConnectionsFolder = allFiles.some(f =>
      f.toLowerCase().includes('connections/')
    );
    console.log(`[InstagramParser] Has connections folder: ${hasConnectionsFolder}`);

    // Check for followers_and_following folder
    const hasFollowersAndFollowingFolder = allFiles.some(f =>
      f.toLowerCase().includes('followers_and_following')
    );
    console.log(`[InstagramParser] Has followers_and_following folder: ${hasFollowersAndFollowingFolder}`);

    // Check for followers file (excluding threads)
    const followersFile = this.findFile(files, 'followers');
    const hasFollowers = followersFile !== null && !followersFile.toLowerCase().includes('/threads/');

    // Check for following file (excluding threads)
    const followingFile = this.findFile(files, 'following');
    const hasFollowing = followingFile !== null && !followingFile.toLowerCase().includes('/threads/');

    console.log(`[InstagramParser] Has followers (non-threads): ${hasFollowers}, file: ${followersFile}`);
    console.log(`[InstagramParser] Has following (non-threads): ${hasFollowing}, file: ${followingFile}`);

    if (!hasFollowers && !hasFollowing) {
      // Check if we only have Threads data
      const hasThreadsData = allFiles.some(f => f.toLowerCase().includes('/threads/'));
      if (hasThreadsData) {
        errors.push('This export only contains Threads data, not Instagram followers/following. Please request a new export that includes "Connections" or "Followers and Following" data.');
      } else {
        errors.push('Missing required files: Could not find followers.json or following.json in connections/followers_and_following folder');
      }
    }

    if (!hasFollowers) {
      warnings.push('followers.json not found in Instagram data - follower data will be limited');
    }

    if (!hasFollowing) {
      warnings.push('following.json not found in Instagram data - following data will be limited');
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
   * Matches based on FILENAME, not directory path
   *
   * For "followers": matches followers.json, followers_1.json, followers_2.json, etc.
   * For "following": matches following.json
   */
  private findFile(files: Map<string, ArrayBuffer>, targetName: string): string | null {
    const allFiles = Array.from(files.keys());
    const normalizedTarget = targetName.toLowerCase();

    console.log(`[InstagramParser] Searching for file type: "${targetName}"`);
    console.log(`[InstagramParser] Total files to search: ${allFiles.length}`);

    // Define filename patterns based on target
    // IMPORTANT: Match on FILENAME only, not directory names
    const getFilenamePattern = (target: string): RegExp => {
      if (target === 'followers') {
        // Match: followers.json, followers_1.json, followers_2.json, etc.
        return /^followers(_\d+)?\.json$/i;
      } else if (target === 'following') {
        // Match: following.json only
        return /^following\.json$/i;
      }
      // Generic fallback
      return new RegExp(`^${target}.*\\.json$`, 'i');
    };

    const pattern = getFilenamePattern(normalizedTarget);
    console.log(`[InstagramParser] Using filename pattern: ${pattern}`);

    // Collect candidates where the FILENAME (not path) matches the pattern
    const candidates: string[] = [];
    for (const filePath of allFiles) {
      // Extract just the filename from the path
      const fileName = filePath.split('/').pop() || filePath;
      if (pattern.test(fileName)) {
        candidates.push(filePath);
      }
    }

    console.log(`[InstagramParser] Found ${candidates.length} filename matches for "${targetName}":`);
    candidates.forEach((c, i) => console.log(`  [${i}] ${c}`));

    if (candidates.length === 0) {
      console.log(`[InstagramParser] No file found matching pattern for: "${targetName}"`);
      return null;
    }

    // Priority 1: files in connections/followers_and_following directory (newer Meta export format)
    // EXCLUDE Threads directory
    let match = candidates.find(f =>
      f.toLowerCase().includes('connections/followers_and_following') &&
      !f.toLowerCase().includes('/threads/')
    );
    if (match) {
      console.log(`[InstagramParser] Found PRIMARY match (connections/followers_and_following): "${match}"`);
      return match;
    }

    // Priority 2: files in followers_and_following directory (older format)
    match = candidates.find(f =>
      f.toLowerCase().includes('followers_and_following') &&
      !f.toLowerCase().includes('/threads/')
    );
    if (match) {
      console.log(`[InstagramParser] Found match (followers_and_following): "${match}"`);
      return match;
    }

    // Priority 3: any file NOT in threads directory
    match = candidates.find(f => !f.toLowerCase().includes('/threads/'));
    if (match) {
      console.log(`[InstagramParser] Found non-threads match: "${match}"`);
      return match;
    }

    // Last resort: use any match, but warn about it (likely Threads data)
    console.warn(`[InstagramParser] WARNING: Only found Threads data for "${targetName}". This may not contain Instagram followers/following.`);
    console.log(`[InstagramParser] Using fallback match: "${candidates[0]}"`);
    return candidates[0];
  }
}

export default InstagramParser;
