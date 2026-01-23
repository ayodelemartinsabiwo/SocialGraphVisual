/**
 * Betweenness Centrality
 * @module lib/graph/betweenness
 *
 * Implementation of betweenness centrality for identifying bridge nodes.
 */

import Graph from 'graphology';
import betweennessCentrality from 'graphology-metrics/centrality/betweenness';
import type {
  BetweennessResult,
  BetweennessOptions,
  ProgressCallback,
  GraphData,
  GraphNode,
} from './types';
import { toGraphology } from './builder';

// ============================================================
// DEFAULT OPTIONS
// ============================================================

const DEFAULT_OPTIONS: Required<BetweennessOptions> = {
  normalized: true,
  weighted: true,
  sampleSize: 0, // 0 means all nodes
};

// ============================================================
// BETWEENNESS CENTRALITY
// ============================================================

/**
 * Calculate betweenness centrality for all nodes
 */
export function calculateBetweenness(
  data: GraphData | Graph,
  options?: BetweennessOptions,
  onProgress?: ProgressCallback
): BetweennessResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  onProgress?.({
    phase: 'betweenness',
    current: 0,
    total: 3,
    percentage: 0,
    message: 'Initializing betweenness centrality...',
  });

  // Convert to graphology if needed
  const graph = data instanceof Graph ? data : toGraphology(data);

  // Handle empty or very small graphs
  if (graph.order < 3) {
    const scores = new Map<string, number>();
    graph.forEachNode((nodeId) => {
      scores.set(nodeId, 0);
    });
    return {
      scores,
      normalized: opts.normalized,
    };
  }

  onProgress?.({
    phase: 'betweenness',
    current: 1,
    total: 3,
    percentage: 33,
    message: 'Computing betweenness scores...',
  });

  // Run betweenness centrality
  const result = betweennessCentrality(graph, {
    normalized: opts.normalized,
    getEdgeWeight: opts.weighted
      ? (_, attrs) => (attrs as { weight?: number }).weight || 1
      : undefined,
  });

  onProgress?.({
    phase: 'betweenness',
    current: 2,
    total: 3,
    percentage: 66,
    message: 'Processing results...',
  });

  // Convert to Map
  const scores = new Map<string, number>();
  for (const [nodeId, score] of Object.entries(result)) {
    scores.set(nodeId, score as number);
  }

  onProgress?.({
    phase: 'betweenness',
    current: 3,
    total: 3,
    percentage: 100,
    message: 'Betweenness calculation complete',
  });

  return {
    scores,
    normalized: opts.normalized,
  };
}

/**
 * Get top N bridge nodes by betweenness centrality
 */
export function getBridgeNodes(
  result: BetweennessResult,
  n: number = 10
): Array<{ nodeId: string; score: number; rank: number }> {
  const sorted = Array.from(result.scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

  return sorted.map(([nodeId, score], index) => ({
    nodeId,
    score,
    rank: index + 1,
  }));
}

/**
 * Identify bridge nodes that connect communities
 */
export function identifyCommunityBridges(
  data: GraphData | Graph,
  communityAssignments: Map<string, string>,
  minBetweenness: number = 0.01
): Array<{
  nodeId: string;
  betweenness: number;
  communitiesConnected: string[];
}> {
  const graph = data instanceof Graph ? data : toGraphology(data);
  const betweennessResult = calculateBetweenness(graph);
  const bridges: Array<{
    nodeId: string;
    betweenness: number;
    communitiesConnected: string[];
  }> = [];

  graph.forEachNode((nodeId) => {
    const betweenness = betweennessResult.scores.get(nodeId) || 0;

    if (betweenness < minBetweenness) {
      return;
    }

    // Find communities this node connects to
    const connectedCommunities = new Set<string>();
    const nodeCommunity = communityAssignments.get(nodeId);

    graph.forEachNeighbor(nodeId, (neighborId) => {
      const neighborCommunity = communityAssignments.get(neighborId);
      if (neighborCommunity && neighborCommunity !== nodeCommunity) {
        connectedCommunities.add(neighborCommunity);
      }
    });

    // If node connects 2+ communities, it's a bridge
    if (connectedCommunities.size >= 1) {
      bridges.push({
        nodeId,
        betweenness,
        communitiesConnected: [nodeCommunity!, ...connectedCommunities],
      });
    }
  });

  // Sort by betweenness (highest first)
  return bridges.sort((a, b) => b.betweenness - a.betweenness);
}

/**
 * Apply betweenness scores to node metrics
 */
export function applyBetweennessToGraph(
  data: GraphData,
  result: BetweennessResult
): GraphData {
  const updatedNodes = data.nodes.map((node) => {
    const betweenness = result.scores.get(node.id) || 0;

    return {
      ...node,
      metrics: {
        ...node.metrics,
        betweenness,
      },
    } as GraphNode;
  });

  return {
    ...data,
    nodes: updatedNodes,
  };
}

/**
 * Calculate betweenness percentile for a node
 */
export function getBetweennessPercentile(
  result: BetweennessResult,
  nodeId: string
): number {
  const score = result.scores.get(nodeId);
  if (score === undefined) {
    return 0;
  }

  const allScores = Array.from(result.scores.values()).sort((a, b) => a - b);
  const position = allScores.findIndex((s) => s >= score);

  return ((position + 1) / allScores.length) * 100;
}

/**
 * Find articulation points (nodes whose removal disconnects the graph)
 * Approximated using high betweenness centrality
 */
export function findArticulationPoints(
  data: GraphData | Graph,
  threshold: number = 0.1
): string[] {
  const result = calculateBetweenness(data);

  return Array.from(result.scores.entries())
    .filter(([_, score]) => score >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([nodeId]) => nodeId);
}

export default calculateBetweenness;
