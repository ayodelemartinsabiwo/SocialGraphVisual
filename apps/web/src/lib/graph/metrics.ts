/**
 * Graph Metrics
 * @module lib/graph/metrics
 *
 * Comprehensive graph metrics calculation.
 */

import Graph from 'graphology';
import { density } from 'graphology-metrics/graph';
import { diameter } from 'graphology-metrics/graph';
import { connectedComponents } from 'graphology-components';
import type {
  MetricsResult,
  ProgressCallback,
  GraphData,
  GraphNode,
} from './types';
import { toGraphology } from './builder';

// ============================================================
// GRAPH METRICS
// ============================================================

/**
 * Calculate comprehensive graph metrics
 */
export function calculateMetrics(
  data: GraphData | Graph,
  onProgress?: ProgressCallback
): MetricsResult {
  onProgress?.({
    phase: 'metrics',
    current: 0,
    total: 6,
    percentage: 0,
    message: 'Calculating graph metrics...',
  });

  const graph = data instanceof Graph ? data : toGraphology(data);

  // Handle empty graphs
  if (graph.order === 0) {
    return {
      density: 0,
      averageDegree: 0,
      averageClusteringCoefficient: 0,
      diameter: 0,
      connectedComponents: 0,
      reciprocity: 0,
    };
  }

  onProgress?.({
    phase: 'metrics',
    current: 1,
    total: 6,
    percentage: 16,
    message: 'Calculating density...',
  });

  // Density
  const graphDensity = density(graph);

  onProgress?.({
    phase: 'metrics',
    current: 2,
    total: 6,
    percentage: 33,
    message: 'Calculating average degree...',
  });

  // Average degree
  let totalDegree = 0;
  graph.forEachNode((nodeId) => {
    totalDegree += graph.degree(nodeId);
  });
  const averageDegree = totalDegree / graph.order;

  onProgress?.({
    phase: 'metrics',
    current: 3,
    total: 6,
    percentage: 50,
    message: 'Calculating clustering coefficient...',
  });

  // Average clustering coefficient
  const averageClusteringCoefficient = calculateAverageClusteringCoefficient(graph);

  onProgress?.({
    phase: 'metrics',
    current: 4,
    total: 6,
    percentage: 66,
    message: 'Calculating diameter...',
  });

  // Diameter (only for small graphs due to cost)
  let graphDiameter = 0;
  if (graph.order <= 1000) {
    try {
      // Get undirected version for diameter calculation
      const undirected = toUndirected(graph);
      graphDiameter = diameter(undirected) || 0;
    } catch {
      graphDiameter = 0;
    }
  }

  onProgress?.({
    phase: 'metrics',
    current: 5,
    total: 6,
    percentage: 83,
    message: 'Calculating connected components...',
  });

  // Connected components
  const numConnectedComponents = connectedComponents(graph).length;

  // Reciprocity
  const reciprocity = calculateReciprocity(graph);

  onProgress?.({
    phase: 'metrics',
    current: 6,
    total: 6,
    percentage: 100,
    message: 'Metrics calculation complete',
  });

  return {
    density: graphDensity,
    averageDegree,
    averageClusteringCoefficient,
    diameter: graphDiameter,
    connectedComponents: numConnectedComponents,
    reciprocity,
  };
}

/**
 * Convert directed graph to undirected
 */
function toUndirected(graph: Graph): Graph {
  const undirected = new Graph({ multi: false, type: 'undirected', allowSelfLoops: false });

  graph.forEachNode((nodeId, attrs) => {
    undirected.addNode(nodeId, attrs);
  });

  graph.forEachEdge((edge, attrs, source, target) => {
    if (!undirected.hasEdge(source, target)) {
      undirected.addEdge(source, target, attrs);
    }
  });

  return undirected;
}

/**
 * Calculate average clustering coefficient
 */
function calculateAverageClusteringCoefficient(graph: Graph): number {
  let totalCoefficient = 0;
  let count = 0;

  graph.forEachNode((nodeId) => {
    const coefficient = calculateLocalClusteringCoefficient(graph, nodeId);
    if (!isNaN(coefficient)) {
      totalCoefficient += coefficient;
      count++;
    }
  });

  return count > 0 ? totalCoefficient / count : 0;
}

/**
 * Calculate local clustering coefficient for a node
 */
function calculateLocalClusteringCoefficient(graph: Graph, nodeId: string): number {
  const neighbors = graph.neighbors(nodeId);
  const k = neighbors.length;

  if (k < 2) {
    return 0;
  }

  // Count edges between neighbors
  let edgesBetweenNeighbors = 0;

  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      if (graph.hasEdge(neighbors[i], neighbors[j]) ||
          graph.hasEdge(neighbors[j], neighbors[i])) {
        edgesBetweenNeighbors++;
      }
    }
  }

  // Maximum possible edges between neighbors
  const maxEdges = (k * (k - 1)) / 2;

  return maxEdges > 0 ? edgesBetweenNeighbors / maxEdges : 0;
}

/**
 * Calculate reciprocity (fraction of mutual edges)
 */
function calculateReciprocity(graph: Graph): number {
  if (graph.size === 0) {
    return 0;
  }

  let mutualEdges = 0;

  graph.forEachEdge((edge, attrs, source, target) => {
    if (graph.hasEdge(target, source)) {
      mutualEdges++;
    }
  });

  // Each mutual pair is counted twice, so divide by 2
  return mutualEdges / graph.size;
}

// ============================================================
// NODE-LEVEL METRICS
// ============================================================

/**
 * Calculate all metrics for a single node
 */
export function calculateNodeMetrics(
  graph: Graph,
  nodeId: string
): {
  degree: number;
  inDegree: number;
  outDegree: number;
  clusteringCoefficient: number;
  neighborCount: number;
} {
  const degree = graph.degree(nodeId);
  const inDegree = graph.type === 'directed' ? graph.inDegree(nodeId) : degree / 2;
  const outDegree = graph.type === 'directed' ? graph.outDegree(nodeId) : degree / 2;
  const clusteringCoefficient = calculateLocalClusteringCoefficient(graph, nodeId);
  const neighborCount = graph.neighbors(nodeId).length;

  return {
    degree,
    inDegree,
    outDegree,
    clusteringCoefficient,
    neighborCount,
  };
}

/**
 * Get degree distribution
 */
export function getDegreeDistribution(
  data: GraphData | Graph
): Map<number, number> {
  const graph = data instanceof Graph ? data : toGraphology(data);
  const distribution = new Map<number, number>();

  graph.forEachNode((nodeId) => {
    const degree = graph.degree(nodeId);
    distribution.set(degree, (distribution.get(degree) || 0) + 1);
  });

  return distribution;
}

/**
 * Get in-degree distribution
 */
export function getInDegreeDistribution(
  data: GraphData | Graph
): Map<number, number> {
  const graph = data instanceof Graph ? data : toGraphology(data);
  const distribution = new Map<number, number>();

  graph.forEachNode((nodeId) => {
    const inDegree = graph.inDegree(nodeId);
    distribution.set(inDegree, (distribution.get(inDegree) || 0) + 1);
  });

  return distribution;
}

/**
 * Get out-degree distribution
 */
export function getOutDegreeDistribution(
  data: GraphData | Graph
): Map<number, number> {
  const graph = data instanceof Graph ? data : toGraphology(data);
  const distribution = new Map<number, number>();

  graph.forEachNode((nodeId) => {
    const outDegree = graph.outDegree(nodeId);
    distribution.set(outDegree, (distribution.get(outDegree) || 0) + 1);
  });

  return distribution;
}

// ============================================================
// ENGAGEMENT METRICS
// ============================================================

/**
 * Calculate engagement score for nodes based on weighted edges
 */
export function calculateEngagementScores(
  data: GraphData | Graph
): Map<string, number> {
  const graph = data instanceof Graph ? data : toGraphology(data);
  const scores = new Map<string, number>();

  graph.forEachNode((nodeId) => {
    let incomingWeight = 0;
    let outgoingWeight = 0;

    graph.forEachInEdge(nodeId, (edge, attrs) => {
      incomingWeight += (attrs as { weight?: number }).weight || 1;
    });

    graph.forEachOutEdge(nodeId, (edge, attrs) => {
      outgoingWeight += (attrs as { weight?: number }).weight || 1;
    });

    // Engagement = incoming engagement (how much others engage with this node)
    scores.set(nodeId, incomingWeight);
  });

  // Normalize to [0, 1]
  const maxScore = Math.max(...scores.values());
  if (maxScore > 0) {
    for (const [nodeId, score] of scores) {
      scores.set(nodeId, score / maxScore);
    }
  }

  return scores;
}

/**
 * Get top engaged nodes
 */
export function getTopEngagedNodes(
  data: GraphData | Graph,
  n: number = 10
): Array<{ nodeId: string; score: number; rank: number }> {
  const scores = calculateEngagementScores(data);

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([nodeId, score], index) => ({
      nodeId,
      score,
      rank: index + 1,
    }));
}

// ============================================================
// HOMOPHILY / ECHO CHAMBER
// ============================================================

/**
 * Calculate homophily score (tendency to connect with similar nodes)
 * Based on community structure
 */
export function calculateHomophily(
  data: GraphData | Graph,
  communityAssignments: Map<string, string>
): number {
  const graph = data instanceof Graph ? data : toGraphology(data);

  if (graph.size === 0) {
    return 0;
  }

  let sameCommunitySames = 0;
  let totalEdges = 0;

  graph.forEachEdge((edge, attrs, source, target) => {
    const sourceCommunity = communityAssignments.get(source);
    const targetCommunity = communityAssignments.get(target);

    if (sourceCommunity && targetCommunity) {
      totalEdges++;
      if (sourceCommunity === targetCommunity) {
        sameCommunitySames++;
      }
    }
  });

  return totalEdges > 0 ? sameCommunitySames / totalEdges : 0;
}

/**
 * Get echo chamber score (higher = more echo chamber behavior)
 */
export function getEchoChamberScore(homophily: number): {
  score: number;
  label: string;
  description: string;
} {
  const score = homophily * 100;

  if (score >= 80) {
    return {
      score,
      label: 'High',
      description: 'Your network is highly clustered with limited cross-group interaction',
    };
  } else if (score >= 60) {
    return {
      score,
      label: 'Moderate',
      description: 'Your network has some clustering but also cross-group connections',
    };
  } else if (score >= 40) {
    return {
      score,
      label: 'Balanced',
      description: 'Your network has a healthy mix of in-group and cross-group connections',
    };
  } else {
    return {
      score,
      label: 'Diverse',
      description: 'Your network is highly diverse with many cross-group connections',
    };
  }
}

export default calculateMetrics;
