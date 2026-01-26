/**
 * Base Parser
 * @module workers/parsers/BaseParser
 *
 * Abstract base class for all platform parsers.
 * Provides common functionality for parsing, pseudonymization, and edge weight calculation.
 */

import type { Platform, GraphNode, GraphEdge, ParsingError, NodeType, EdgeType } from '@vsg/shared';
import type {
  PlatformParser,
  ParsedResult,
  ParsingProgress,
  UserMap,
  InteractionCount,
} from './types';

// ============================================================
// ABSTRACT BASE PARSER
// ============================================================

export abstract class BaseParser implements PlatformParser {
  abstract platform: Platform;
  abstract version: string;
  abstract supportedFiles: string[];

  protected errors: ParsingError[] = [];
  protected warnings: string[] = [];
  protected nodeMap: Map<string, GraphNode> = new Map();
  protected edgeMap: Map<string, GraphEdge> = new Map();
  protected interactionMap: Map<string, InteractionCount> = new Map();

  /**
   * Validate that required files exist
   */
  abstract validateFiles(files: Map<string, ArrayBuffer>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };

  /**
   * Parse platform-specific data
   */
  abstract parse(
    files: Map<string, ArrayBuffer>,
    onProgress: (progress: ParsingProgress) => void
  ): Promise<ParsedResult>;

  // ============================================================
  // PROTECTED HELPER METHODS
  // ============================================================

  /**
   * Generate a deterministic pseudonym from a username
   */
  protected pseudonymize(username: string): string {
    // Simple hash-based pseudonymization
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const adjectives = ['Happy', 'Swift', 'Clever', 'Brave', 'Calm', 'Wise', 'Kind', 'Bold'];
    const nouns = ['Fox', 'Bear', 'Eagle', 'Wolf', 'Owl', 'Lion', 'Hawk', 'Deer'];

    const adjIndex = Math.abs(hash) % adjectives.length;
    const nounIndex = Math.abs(hash >> 8) % nouns.length;
    const num = Math.abs(hash >> 16) % 1000;

    return `${adjectives[adjIndex]}${nouns[nounIndex]}${num}`;
  }

  /**
   * Create a unique edge ID
   */
  protected createEdgeId(source: string, target: string, type: EdgeType): string {
    return `${source}-${type}-${target}`;
  }

  /**
   * Create a node from user data
   */
  protected createNode(user: UserMap): GraphNode {
    const pseudonym = this.pseudonymize(user.username);

    return {
      id: user.id,
      type: user.type,
      displayName: pseudonym,
      username: `@${pseudonym.toLowerCase()}`,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      degree: 0,
      inDegree: 0,
      outDegree: 0,
    };
  }

  /**
   * Create or update an edge between nodes
   */
  protected createOrUpdateEdge(
    source: string,
    target: string,
    type: EdgeType,
    interactions?: Partial<InteractionCount>
  ): void {
    const edgeId = this.createEdgeId(source, target, type);

    if (this.edgeMap.has(edgeId)) {
      // Update existing edge interactions
      const edge = this.edgeMap.get(edgeId)!;
      if (edge.interactions && interactions) {
        edge.interactions.likes = (edge.interactions.likes || 0) + (interactions.likes || 0);
        edge.interactions.comments = (edge.interactions.comments || 0) + (interactions.comments || 0);
        edge.interactions.shares = (edge.interactions.shares || 0) + (interactions.shares || 0);
        edge.interactions.messages = (edge.interactions.messages || 0) + (interactions.messages || 0);
        edge.interactions.mentions = (edge.interactions.mentions || 0) + (interactions.mentions || 0);
      }
    } else {
      // Create new edge
      const edge: GraphEdge = {
        id: edgeId,
        source,
        target,
        type,
        weight: 0, // Will be calculated later
        interactions: {
          likes: interactions?.likes || 0,
          comments: interactions?.comments || 0,
          shares: interactions?.shares || 0,
          messages: interactions?.messages || 0,
          mentions: interactions?.mentions || 0,
        },
      };
      this.edgeMap.set(edgeId, edge);
    }
  }

  /**
   * Calculate edge weights based on interactions
   */
  protected calculateEdgeWeights(): void {
    // Find max interactions for normalization
    let maxInteractions = 1;

    for (const edge of this.edgeMap.values()) {
      const totalInteractions = this.getTotalInteractions(edge);
      if (totalInteractions > maxInteractions) {
        maxInteractions = totalInteractions;
      }
    }

    // Calculate normalized weights
    for (const edge of this.edgeMap.values()) {
      const totalInteractions = this.getTotalInteractions(edge);

      // Base weight from relationship type
      let baseWeight = 0.3; // Default for follows
      if (edge.type === 'MUTUAL') {
        baseWeight = 0.5;
      } else if (edge.type === 'ENGAGES_WITH') {
        baseWeight = 0.4;
      }

      // Add interaction-based weight (up to 0.5 additional)
      const interactionWeight = (totalInteractions / maxInteractions) * 0.5;

      edge.weight = Math.min(1, baseWeight + interactionWeight);
    }
  }

  /**
   * Get total interaction count for an edge
   */
  protected getTotalInteractions(edge: GraphEdge): number {
    if (!edge.interactions) return 0;

    return (
      (edge.interactions.likes || 0) * 1 +
      (edge.interactions.comments || 0) * 3 +
      (edge.interactions.shares || 0) * 5 +
      (edge.interactions.messages || 0) * 4 +
      (edge.interactions.mentions || 0) * 2
    );
  }

  /**
   * Calculate node degrees
   */
  protected calculateDegrees(): void {
    // Reset degrees
    for (const node of this.nodeMap.values()) {
      node.degree = 0;
      node.inDegree = 0;
      node.outDegree = 0;
    }

    // Count edges
    for (const edge of this.edgeMap.values()) {
      const sourceNode = this.nodeMap.get(edge.source);
      const targetNode = this.nodeMap.get(edge.target);

      if (sourceNode) {
        sourceNode.outDegree = (sourceNode.outDegree || 0) + 1;
        sourceNode.degree = (sourceNode.degree || 0) + 1;
      }

      if (targetNode) {
        targetNode.inDegree = (targetNode.inDegree || 0) + 1;
        targetNode.degree = (targetNode.degree || 0) + 1;
      }
    }
  }

  /**
   * Detect and mark mutual relationships
   */
  protected detectMutualRelationships(): void {
    const edgePairs = new Map<string, string[]>();

    // Group edges by node pairs (regardless of direction)
    for (const edge of this.edgeMap.values()) {
      const pairKey = [edge.source, edge.target].sort().join('|');

      if (!edgePairs.has(pairKey)) {
        edgePairs.set(pairKey, []);
      }
      edgePairs.get(pairKey)!.push(edge.id);
    }

    // Find mutual relationships
    for (const [pairKey, edgeIds] of edgePairs.entries()) {
      if (edgeIds.length >= 2) {
        // Mutual relationship detected
        const [nodeA, nodeB] = pairKey.split('|');

        // Create a mutual edge (or update existing)
        const mutualEdgeId = this.createEdgeId(nodeA, nodeB, 'MUTUAL');

        // Combine interactions from both directions
        let totalInteractions = {
          likes: 0,
          comments: 0,
          shares: 0,
          messages: 0,
          mentions: 0,
        };

        for (const edgeId of edgeIds) {
          const edge = this.edgeMap.get(edgeId);
          if (edge?.interactions) {
            totalInteractions.likes += edge.interactions.likes || 0;
            totalInteractions.comments += edge.interactions.comments || 0;
            totalInteractions.shares += edge.interactions.shares || 0;
            totalInteractions.messages += edge.interactions.messages || 0;
            totalInteractions.mentions += edge.interactions.mentions || 0;
          }
          // Remove the one-way edges
          this.edgeMap.delete(edgeId);
        }

        // Create mutual edge
        this.edgeMap.set(mutualEdgeId, {
          id: mutualEdgeId,
          source: nodeA,
          target: nodeB,
          type: 'MUTUAL',
          weight: 0,
          interactions: totalInteractions,
        });
      }
    }
  }

  /**
   * Add a parsing error
   */
  protected addError(code: string, message: string, recoverable: boolean = true): void {
    this.errors.push({
      code,
      message,
      recoverable,
    });
  }

  /**
   * Add a warning
   */
  protected addWarning(message: string): void {
    this.warnings.push(message);
  }

  /**
   * Read file as text
   */
  protected readAsText(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(buffer);
  }

  /**
   * Parse JSON from buffer
   */
  protected parseJson<T>(buffer: ArrayBuffer): T | null {
    try {
      const text = this.readAsText(buffer);
      return JSON.parse(text) as T;
    } catch (error) {
      this.addError('JSON_PARSE_ERROR', `Failed to parse JSON: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Parse Twitter's JS format (window.YTD.xxx = [...])
   */
  protected parseTwitterJs<T>(buffer: ArrayBuffer): T[] | null {
    try {
      const text = this.readAsText(buffer);
      // Twitter exports data as: window.YTD.xxx.part0 = [...]
      const match = text.match(/=\s*(\[[\s\S]*\])\s*;?\s*$/);
      if (match && match[1]) {
        return JSON.parse(match[1]) as T[];
      }
      this.addError('TWITTER_JS_PARSE_ERROR', 'Could not find data array in Twitter JS file');
      return null;
    } catch (error) {
      this.addError('TWITTER_JS_PARSE_ERROR', `Failed to parse Twitter JS: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Calculate file checksum (simple hash)
   */
  protected calculateChecksum(buffer: ArrayBuffer): string {
    const view = new Uint8Array(buffer);
    let hash = 0;

    for (let i = 0; i < view.length; i++) {
      hash = ((hash << 5) - hash) + view[i];
      hash = hash & hash;
    }

    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Validate and filter edges to only include those with existing nodes
   * This prevents D3.js "node not found" errors
   */
  protected validateEdges(): { valid: number; invalid: number } {
    const invalidEdges: string[] = [];
    
    for (const [edgeId, edge] of this.edgeMap.entries()) {
      const sourceExists = this.nodeMap.has(edge.source);
      const targetExists = this.nodeMap.has(edge.target);
      
      if (!sourceExists || !targetExists) {
        invalidEdges.push(edgeId);
        if (!sourceExists) {
          this.addWarning(`Edge ${edgeId} references non-existent source node: ${edge.source}`);
        }
        if (!targetExists) {
          this.addWarning(`Edge ${edgeId} references non-existent target node: ${edge.target}`);
        }
      }
    }
    
    // Remove invalid edges
    for (const edgeId of invalidEdges) {
      this.edgeMap.delete(edgeId);
    }
    
    return {
      valid: this.edgeMap.size,
      invalid: invalidEdges.length,
    };
  }

  /**
   * Reset parser state
   */
  protected reset(): void {
    this.errors = [];
    this.warnings = [];
    this.nodeMap.clear();
    this.edgeMap.clear();
    this.interactionMap.clear();
  }
}
