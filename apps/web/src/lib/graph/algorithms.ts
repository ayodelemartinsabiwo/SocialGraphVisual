/**
 * Graph Algorithms Orchestration
 * @module lib/graph/algorithms
 *
 * Main entry point for running graph algorithms.
 * Combines community detection, centrality measures, and metrics.
 */

import Graph from 'graphology';
import type {
  GraphData,
  GraphNode,
  CommunityResult,
  PageRankResult,
  BetweennessResult,
  MetricsResult,
  ProgressCallback,
  LouvainOptions,
  PageRankOptions,
  BetweennessOptions,
} from './types';
import { toGraphology } from './builder';
import { detectCommunities, assignCommunityColors } from './louvain';
import { calculatePageRank, applyPageRankToGraph } from './pagerank';
import { calculateBetweenness, applyBetweennessToGraph } from './betweenness';
import { calculateMetrics, calculateHomophily, getEchoChamberScore } from './metrics';

// ============================================================
// FULL ANALYSIS RESULT
// ============================================================

export interface FullAnalysisResult {
  // Graph data with all metrics applied
  enrichedGraph: GraphData;

  // Individual algorithm results
  communities: CommunityResult;
  pageRank: PageRankResult;
  betweenness: BetweennessResult;
  metrics: MetricsResult;

  // Derived insights
  insights: AnalysisInsights;
}

export interface AnalysisInsights {
  communityCount: number;
  largestCommunitySize: number;
  modularity: number;
  topInfluencers: Array<{ nodeId: string; label: string; score: number }>;
  bridgeNodes: Array<{ nodeId: string; label: string; score: number }>;
  echoChamberScore: { score: number; label: string; description: string };
  networkDensity: number;
  averageDegree: number;
  reciprocity: number;
}

// ============================================================
// FULL ANALYSIS
// ============================================================

/**
 * Run full graph analysis (all algorithms)
 */
export async function runFullAnalysis(
  data: GraphData,
  options?: {
    louvain?: LouvainOptions;
    pageRank?: PageRankOptions;
    betweenness?: BetweennessOptions;
  },
  onProgress?: ProgressCallback
): Promise<FullAnalysisResult> {
  const totalPhases = 5;
  let currentPhase = 0;

  const updateProgress = (phase: string, pct: number, message: string) => {
    const overallPct = ((currentPhase + pct / 100) / totalPhases) * 100;
    onProgress?.({
      phase,
      current: Math.round(pct),
      total: 100,
      percentage: Math.round(overallPct),
      message,
    });
  };

  // Phase 1: Community Detection
  updateProgress('communities', 0, 'Detecting communities...');
  const communities = detectCommunities(
    data,
    options?.louvain,
    (p) => updateProgress('communities', p.percentage, p.message || '')
  );
  currentPhase++;

  // Phase 2: PageRank
  updateProgress('pagerank', 0, 'Calculating influence scores...');
  const pageRank = calculatePageRank(
    data,
    options?.pageRank,
    (p) => updateProgress('pagerank', p.percentage, p.message || '')
  );
  currentPhase++;

  // Phase 3: Betweenness Centrality
  updateProgress('betweenness', 0, 'Finding bridge nodes...');
  const betweenness = calculateBetweenness(
    data,
    options?.betweenness,
    (p) => updateProgress('betweenness', p.percentage, p.message || '')
  );
  currentPhase++;

  // Phase 4: Graph Metrics
  updateProgress('metrics', 0, 'Calculating network metrics...');
  const metrics = calculateMetrics(
    data,
    (p) => updateProgress('metrics', p.percentage, p.message || '')
  );
  currentPhase++;

  // Phase 5: Apply results to graph and generate insights
  updateProgress('finalize', 0, 'Generating insights...');

  // Apply all metrics to graph
  let enrichedGraph = applyPageRankToGraph(data, pageRank);
  enrichedGraph = applyBetweennessToGraph(enrichedGraph, betweenness);
  enrichedGraph = assignCommunityColors(enrichedGraph, communities);

  // Calculate homophily/echo chamber
  const homophily = calculateHomophily(data, communities.nodeAssignments);
  const echoChamberScore = getEchoChamberScore(homophily);

  // Generate insights
  const insights = generateInsights(
    enrichedGraph,
    communities,
    pageRank,
    betweenness,
    metrics,
    echoChamberScore
  );

  updateProgress('finalize', 100, 'Analysis complete');

  return {
    enrichedGraph,
    communities,
    pageRank,
    betweenness,
    metrics,
    insights,
  };
}

/**
 * Generate analysis insights from algorithm results
 */
function generateInsights(
  data: GraphData,
  communities: CommunityResult,
  pageRank: PageRankResult,
  betweenness: BetweennessResult,
  metrics: MetricsResult,
  echoChamberScore: { score: number; label: string; description: string }
): AnalysisInsights {
  // Find top influencers by PageRank
  const topInfluencers = Array.from(pageRank.scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nodeId, score]) => {
      const node = data.nodes.find((n) => n.id === nodeId);
      return {
        nodeId,
        label: node?.label || nodeId,
        score,
      };
    });

  // Find bridge nodes by betweenness
  const bridgeNodes = Array.from(betweenness.scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nodeId, score]) => {
      const node = data.nodes.find((n) => n.id === nodeId);
      return {
        nodeId,
        label: node?.label || nodeId,
        score,
      };
    });

  // Find largest community
  const largestCommunity = communities.communities.reduce(
    (max, c) => (c.size > max.size ? c : max),
    communities.communities[0] || { size: 0 }
  );

  return {
    communityCount: communities.communities.length,
    largestCommunitySize: largestCommunity?.size || 0,
    modularity: communities.modularity,
    topInfluencers,
    bridgeNodes,
    echoChamberScore,
    networkDensity: metrics.density,
    averageDegree: metrics.averageDegree,
    reciprocity: metrics.reciprocity,
  };
}

// ============================================================
// INDIVIDUAL ALGORITHM RUNNERS
// ============================================================

/**
 * Run only community detection
 */
export async function runCommunityDetection(
  data: GraphData,
  options?: LouvainOptions,
  onProgress?: ProgressCallback
): Promise<{ communities: CommunityResult; enrichedGraph: GraphData }> {
  const communities = detectCommunities(data, options, onProgress);
  const enrichedGraph = assignCommunityColors(data, communities);

  return { communities, enrichedGraph };
}

/**
 * Run only PageRank
 */
export async function runPageRank(
  data: GraphData,
  options?: PageRankOptions,
  onProgress?: ProgressCallback
): Promise<{ pageRank: PageRankResult; enrichedGraph: GraphData }> {
  const pageRank = calculatePageRank(data, options, onProgress);
  const enrichedGraph = applyPageRankToGraph(data, pageRank);

  return { pageRank, enrichedGraph };
}

/**
 * Run only betweenness centrality
 */
export async function runBetweenness(
  data: GraphData,
  options?: BetweennessOptions,
  onProgress?: ProgressCallback
): Promise<{ betweenness: BetweennessResult; enrichedGraph: GraphData }> {
  const betweenness = calculateBetweenness(data, options, onProgress);
  const enrichedGraph = applyBetweennessToGraph(data, betweenness);

  return { betweenness, enrichedGraph };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get node statistics summary
 */
export function getNodeStatistics(data: GraphData): {
  total: number;
  byType: Record<string, number>;
  avgDegree: number;
  maxDegree: number;
  minDegree: number;
} {
  const byType: Record<string, number> = {};
  let totalDegree = 0;
  let maxDegree = 0;
  let minDegree = Infinity;

  for (const node of data.nodes) {
    byType[node.type] = (byType[node.type] || 0) + 1;

    const degree = node.metrics?.degree || 0;
    totalDegree += degree;
    maxDegree = Math.max(maxDegree, degree);
    minDegree = Math.min(minDegree, degree);
  }

  return {
    total: data.nodes.length,
    byType,
    avgDegree: data.nodes.length > 0 ? totalDegree / data.nodes.length : 0,
    maxDegree,
    minDegree: minDegree === Infinity ? 0 : minDegree,
  };
}

/**
 * Get edge statistics summary
 */
export function getEdgeStatistics(data: GraphData): {
  total: number;
  byType: Record<string, number>;
  avgWeight: number;
  maxWeight: number;
  reciprocalCount: number;
} {
  const byType: Record<string, number> = {};
  let totalWeight = 0;
  let maxWeight = 0;
  let reciprocalCount = 0;

  for (const edge of data.edges) {
    byType[edge.type] = (byType[edge.type] || 0) + 1;
    totalWeight += edge.weight;
    maxWeight = Math.max(maxWeight, edge.weight);

    if (edge.metadata.reciprocated) {
      reciprocalCount++;
    }
  }

  return {
    total: data.edges.length,
    byType,
    avgWeight: data.edges.length > 0 ? totalWeight / data.edges.length : 0,
    maxWeight,
    reciprocalCount,
  };
}

/**
 * Filter graph by community
 */
export function filterByCommunity(
  data: GraphData,
  communityId: string,
  nodeAssignments: Map<string, string>
): GraphData {
  const communityNodes = new Set(
    Array.from(nodeAssignments.entries())
      .filter(([_, cId]) => cId === communityId)
      .map(([nodeId]) => nodeId)
  );

  const nodes = data.nodes.filter((n) => communityNodes.has(n.id));
  const edges = data.edges.filter(
    (e) => communityNodes.has(e.source) && communityNodes.has(e.target)
  );

  return {
    ...data,
    nodes,
    edges,
    metadata: {
      ...data.metadata,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
  };
}

/**
 * Get subgraph around a node (ego network)
 */
export function getEgoNetwork(
  data: GraphData,
  nodeId: string,
  depth: number = 1
): GraphData {
  const graph = toGraphology(data);
  const includedNodes = new Set<string>([nodeId]);

  // BFS to find nodes within depth
  let currentLevel = [nodeId];
  for (let d = 0; d < depth; d++) {
    const nextLevel: string[] = [];
    for (const node of currentLevel) {
      graph.forEachNeighbor(node, (neighbor) => {
        if (!includedNodes.has(neighbor)) {
          includedNodes.add(neighbor);
          nextLevel.push(neighbor);
        }
      });
    }
    currentLevel = nextLevel;
  }

  const nodes = data.nodes.filter((n) => includedNodes.has(n.id));
  const edges = data.edges.filter(
    (e) => includedNodes.has(e.source) && includedNodes.has(e.target)
  );

  return {
    ...data,
    nodes,
    edges,
    metadata: {
      ...data.metadata,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
  };
}

export default runFullAnalysis;
