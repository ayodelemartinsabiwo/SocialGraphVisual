/**
 * PageRank Algorithm
 * @module lib/graph/pagerank
 *
 * Implementation of the PageRank algorithm for node importance scoring.
 * Uses graphology-metrics pageRank under the hood.
 */

import Graph from 'graphology';
import pagerank from 'graphology-metrics/centrality/pagerank';
import type {
  PageRankResult,
  PageRankOptions,
  ProgressCallback,
  GraphData,
  GraphNode,
} from './types';
import { toGraphology } from './builder';

// ============================================================
// DEFAULT OPTIONS
// ============================================================

const DEFAULT_OPTIONS: Required<PageRankOptions> = {
  damping: 0.85,
  maxIterations: 100,
  tolerance: 1e-6,
};

// ============================================================
// PAGERANK ALGORITHM
// ============================================================

/**
 * Calculate PageRank scores for all nodes
 */
export function calculatePageRank(
  data: GraphData | Graph,
  options?: PageRankOptions,
  onProgress?: ProgressCallback
): PageRankResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  onProgress?.({
    phase: 'pagerank',
    current: 0,
    total: 3,
    percentage: 0,
    message: 'Initializing PageRank...',
  });

  // Convert to graphology if needed
  const graph = data instanceof Graph ? data : toGraphology(data);

  // Handle empty graphs
  if (graph.order === 0) {
    return {
      scores: new Map(),
      iterations: 0,
      converged: true,
    };
  }

  // Handle single node
  if (graph.order === 1) {
    const scores = new Map<string, number>();
    graph.forEachNode((nodeId) => {
      scores.set(nodeId, 1.0);
    });
    return {
      scores,
      iterations: 1,
      converged: true,
    };
  }

  onProgress?.({
    phase: 'pagerank',
    current: 1,
    total: 3,
    percentage: 33,
    message: 'Computing PageRank scores...',
  });

  // Run PageRank algorithm
  const result = pagerank(graph, {
    alpha: opts.damping,
    maxIterations: opts.maxIterations,
    tolerance: opts.tolerance,
    getEdgeWeight: (_, attrs) => (attrs as { weight?: number }).weight || 1,
  });

  onProgress?.({
    phase: 'pagerank',
    current: 2,
    total: 3,
    percentage: 66,
    message: 'Processing results...',
  });

  // Convert result to Map
  const scores = new Map<string, number>();
  for (const [nodeId, score] of Object.entries(result)) {
    scores.set(nodeId, score as number);
  }

  // Normalize scores to [0, 1]
  const maxScore = Math.max(...scores.values());
  if (maxScore > 0) {
    for (const [nodeId, score] of scores) {
      scores.set(nodeId, score / maxScore);
    }
  }

  onProgress?.({
    phase: 'pagerank',
    current: 3,
    total: 3,
    percentage: 100,
    message: 'PageRank calculation complete',
  });

  return {
    scores,
    iterations: opts.maxIterations,
    converged: true,
  };
}

/**
 * Get top N nodes by PageRank
 */
export function getTopPageRankNodes(
  result: PageRankResult,
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
 * Apply PageRank scores to node metrics
 */
export function applyPageRankToGraph(
  data: GraphData,
  result: PageRankResult
): GraphData {
  const updatedNodes = data.nodes.map((node) => {
    const pageRank = result.scores.get(node.id) || 0;

    return {
      ...node,
      metrics: {
        ...node.metrics,
        pageRank,
      },
    } as GraphNode;
  });

  return {
    ...data,
    nodes: updatedNodes,
  };
}

/**
 * Calculate personalized PageRank from a seed node
 */
export function calculatePersonalizedPageRank(
  data: GraphData | Graph,
  seedNodeId: string,
  options?: PageRankOptions,
  onProgress?: ProgressCallback
): PageRankResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const graph = data instanceof Graph ? data.copy() : toGraphology(data);

  // Check if seed node exists
  if (!graph.hasNode(seedNodeId)) {
    return {
      scores: new Map(),
      iterations: 0,
      converged: false,
    };
  }

  onProgress?.({
    phase: 'personalized-pagerank',
    current: 0,
    total: 3,
    percentage: 0,
    message: `Computing personalized PageRank from ${seedNodeId}...`,
  });

  // Create personalization vector (teleport only to seed node)
  const personalization: Record<string, number> = {};
  graph.forEachNode((nodeId) => {
    personalization[nodeId] = nodeId === seedNodeId ? 1.0 : 0.0;
  });

  onProgress?.({
    phase: 'personalized-pagerank',
    current: 1,
    total: 3,
    percentage: 33,
    message: 'Running personalized PageRank...',
  });

  // Run PageRank with personalization
  // Note: graphology-metrics doesn't support personalization directly
  // So we implement a simple version
  const scores = runPersonalizedPageRank(graph, seedNodeId, opts);

  onProgress?.({
    phase: 'personalized-pagerank',
    current: 3,
    total: 3,
    percentage: 100,
    message: 'Personalized PageRank complete',
  });

  return {
    scores,
    iterations: opts.maxIterations,
    converged: true,
  };
}

/**
 * Simple personalized PageRank implementation
 */
function runPersonalizedPageRank(
  graph: Graph,
  seedNodeId: string,
  opts: Required<PageRankOptions>
): Map<string, number> {
  const n = graph.order;
  const d = opts.damping;

  // Initialize scores
  let scores = new Map<string, number>();
  graph.forEachNode((nodeId) => {
    scores.set(nodeId, 1 / n);
  });

  // Iterate
  for (let iter = 0; iter < opts.maxIterations; iter++) {
    const newScores = new Map<string, number>();
    let diff = 0;

    graph.forEachNode((nodeId) => {
      // Sum of incoming scores
      let incomingSum = 0;

      graph.forEachInEdge(nodeId, (edge, attrs, source) => {
        const sourceOutDegree = graph.outDegree(source);
        if (sourceOutDegree > 0) {
          const weight = (attrs as { weight?: number }).weight || 1;
          incomingSum += (scores.get(source) || 0) * weight / sourceOutDegree;
        }
      });

      // Personalization: teleport to seed node
      const teleport = nodeId === seedNodeId ? 1.0 : 0.0;

      // New score
      const newScore = (1 - d) * teleport + d * incomingSum;
      newScores.set(nodeId, newScore);

      diff += Math.abs(newScore - (scores.get(nodeId) || 0));
    });

    scores = newScores;

    // Check convergence
    if (diff < opts.tolerance) {
      break;
    }
  }

  // Normalize
  const maxScore = Math.max(...scores.values());
  if (maxScore > 0) {
    for (const [nodeId, score] of scores) {
      scores.set(nodeId, score / maxScore);
    }
  }

  return scores;
}

/**
 * Calculate PageRank percentile for a node
 */
export function getPageRankPercentile(
  result: PageRankResult,
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

export default calculatePageRank;
