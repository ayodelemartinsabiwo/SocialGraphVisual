/**
 * Graph Analyzer
 * @module services/insights/analyzer
 *
 * Server-side graph analysis for insight generation.
 * Uses graphology for algorithm execution.
 */

import GraphConstructor from 'graphology';
import louvainFn from 'graphology-communities-louvain';
import * as metrics from 'graphology-metrics';
import type { StoredGraph } from '../graph/storage.js';

// Use any for graphology to work around ESM/CJS interop issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Graph = GraphConstructor as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const louvain = louvainFn as any;

// Extract metrics functions
const { centrality, graph: graphMetrics } = metrics;
const pagerank = centrality.pagerank;
const betweenness = centrality.betweenness;
const density = graphMetrics.density;

// Type alias for graphology Graph instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GraphInstance = any;

// ============================================================
// TYPES
// ============================================================

export interface AnalysisResult {
  // Graph metrics
  nodeCount: number;
  edgeCount: number;
  density: number;
  averageDegree: number;
  reciprocity: number;

  // Community analysis
  communities: CommunityInfo[];
  modularity: number;

  // Centrality rankings
  topInfluencers: NodeRanking[];
  bridgeNodes: NodeRanking[];

  // Engagement metrics
  echoChamberScore: number;
  engagementDistribution: EngagementTier[];

  // Growth metrics
  potentialConnections: number;
  networkMaturity: number;
}

export interface CommunityInfo {
  id: string;
  size: number;
  density: number;
  percentage: number;
}

export interface NodeRanking {
  nodeId: string;
  score: number;
  rank: number;
}

export interface EngagementTier {
  tier: 'core' | 'active' | 'casual' | 'peripheral';
  count: number;
  percentage: number;
}

// ============================================================
// GRAPH CONSTRUCTION
// ============================================================

/**
 * Build a graphology instance from stored graph data
 */
function buildGraph(stored: StoredGraph): GraphInstance {
  const graph: GraphInstance = new Graph({ multi: false, type: 'directed', allowSelfLoops: false });

  const nodes = stored.nodesData as Array<{ id: string; [key: string]: unknown }>;
  const edges = stored.edgesData as Array<{
    source: string;
    target: string;
    weight?: number;
  }>;

  // Add nodes
  for (const node of nodes) {
    if (!graph.hasNode(node.id)) {
      graph.addNode(node.id, node);
    }
  }

  // Add edges
  for (const edge of edges) {
    if (
      graph.hasNode(edge.source) &&
      graph.hasNode(edge.target) &&
      !graph.hasEdge(edge.source, edge.target)
    ) {
      graph.addEdge(edge.source, edge.target, {
        weight: edge.weight || 1,
      });
    }
  }

  return graph;
}

// ============================================================
// MAIN ANALYSIS
// ============================================================

/**
 * Run full analysis on a graph
 */
export async function analyzeGraph(stored: StoredGraph): Promise<AnalysisResult> {
  const graph = buildGraph(stored);

  // Basic metrics
  const nodeCount = graph.order;
  const edgeCount = graph.size;
  const graphDensity = nodeCount > 1 ? density(graph) : 0;
  const averageDegree = nodeCount > 0 ? (edgeCount * 2) / nodeCount : 0;
  const reciprocity = calculateReciprocity(graph);

  // Community detection
  const { communities, modularity } = detectCommunities(graph);

  // Centrality measures
  const topInfluencers = calculateTopInfluencers(graph);
  const bridgeNodes = calculateBridgeNodes(graph);

  // Engagement analysis
  const echoChamberScore = calculateEchoChamberScore(graph, communities);
  const engagementDistribution = calculateEngagementDistribution(graph);

  // Growth metrics
  const potentialConnections = calculatePotentialConnections(graph, communities);
  const networkMaturity = calculateNetworkMaturity(graph);

  return {
    nodeCount,
    edgeCount,
    density: graphDensity,
    averageDegree,
    reciprocity,
    communities,
    modularity,
    topInfluencers,
    bridgeNodes,
    echoChamberScore,
    engagementDistribution,
    potentialConnections,
    networkMaturity,
  };
}

// ============================================================
// COMMUNITY DETECTION
// ============================================================

/**
 * Detect communities using Louvain algorithm
 */
function detectCommunities(
  graph: GraphInstance
): { communities: CommunityInfo[]; modularity: number } {
  if (graph.order < 2) {
    return { communities: [], modularity: 0 };
  }

  // Run Louvain - assign communities to nodes
  // The louvain function returns community assignments and modifies the graph
  louvain(graph, { resolution: 1 });

  // Count nodes per community
  const communityCounts = new Map<string, number>();
  graph.forEachNode((nodeId: string) => {
    const community = graph.getNodeAttribute(nodeId, 'community')?.toString() || '0';
    communityCounts.set(community, (communityCounts.get(community) || 0) + 1);
  });

  // Build community info
  const communities: CommunityInfo[] = [];
  for (const [id, size] of communityCounts) {
    const communityDensity = calculateCommunityDensity(graph, id);
    communities.push({
      id,
      size,
      density: communityDensity,
      percentage: (size / graph.order) * 100,
    });
  }

  // Sort by size
  communities.sort((a, b) => b.size - a.size);

  // Calculate modularity manually
  const modularity = calculateModularity(graph, communityCounts);

  return {
    communities,
    modularity,
  };
}

/**
 * Calculate modularity of the community assignment
 */
function calculateModularity(
  graph: GraphInstance,
  _communityCounts: Map<string, number>
): number {
  if (graph.size === 0) return 0;

  const m = graph.size;
  let q = 0;

  graph.forEachEdge((_edge: string, _attrs: unknown, source: string, target: string) => {
    const ci = graph.getNodeAttribute(source, 'community');
    const cj = graph.getNodeAttribute(target, 'community');

    if (ci === cj) {
      const ki = graph.degree(source);
      const kj = graph.degree(target);
      q += 1 - (ki * kj) / (2 * m);
    }
  });

  return q / (2 * m);
}

/**
 * Calculate density within a community
 */
function calculateCommunityDensity(graph: GraphInstance, communityId: string): number {
  const members: string[] = [];
  graph.forEachNode((nodeId: string) => {
    if (graph.getNodeAttribute(nodeId, 'community')?.toString() === communityId) {
      members.push(nodeId);
    }
  });

  if (members.length < 2) return 1;

  let internalEdges = 0;
  const memberSet = new Set(members);

  for (const nodeId of members) {
    graph.forEachOutEdge(nodeId, (_edge: string, _attrs: unknown, _source: string, target: string) => {
      if (memberSet.has(target)) {
        internalEdges++;
      }
    });
  }

  const maxEdges = members.length * (members.length - 1);
  return maxEdges > 0 ? internalEdges / maxEdges : 0;
}

// ============================================================
// CENTRALITY ANALYSIS
// ============================================================

/**
 * Calculate top influencers using PageRank
 */
function calculateTopInfluencers(graph: GraphInstance, count: number = 10): NodeRanking[] {
  if (graph.order === 0) return [];

  const scores = pagerank(graph, {
    alpha: 0.85,
    maxIterations: 100,
    tolerance: 1e-6,
    getEdgeWeight: (edge: string) => graph.getEdgeAttribute(edge, 'weight') || 1,
  });

  return Object.entries(scores)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, count)
    .map(([nodeId, score], index) => ({
      nodeId,
      score: score as number,
      rank: index + 1,
    }));
}

/**
 * Calculate bridge nodes using betweenness centrality
 */
function calculateBridgeNodes(graph: GraphInstance, count: number = 10): NodeRanking[] {
  if (graph.order < 3) return [];

  const scores = betweenness(graph, { normalized: true });

  return Object.entries(scores)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, count)
    .map(([nodeId, score], index) => ({
      nodeId,
      score: score as number,
      rank: index + 1,
    }));
}

// ============================================================
// ENGAGEMENT ANALYSIS
// ============================================================

/**
 * Calculate echo chamber score based on homophily
 */
function calculateEchoChamberScore(
  graph: GraphInstance,
  communities: CommunityInfo[]
): number {
  if (graph.size === 0 || communities.length <= 1) return 0;

  let sameCommunityEdges = 0;
  let totalEdges = 0;

  graph.forEachEdge((_edge: string, _attrs: unknown, source: string, target: string) => {
    const sourceCommunity = graph.getNodeAttribute(source, 'community');
    const targetCommunity = graph.getNodeAttribute(target, 'community');

    totalEdges++;
    if (sourceCommunity === targetCommunity) {
      sameCommunityEdges++;
    }
  });

  return totalEdges > 0 ? (sameCommunityEdges / totalEdges) * 100 : 0;
}

/**
 * Calculate engagement distribution tiers
 */
function calculateEngagementDistribution(graph: GraphInstance): EngagementTier[] {
  if (graph.order === 0) {
    return [
      { tier: 'core', count: 0, percentage: 0 },
      { tier: 'active', count: 0, percentage: 0 },
      { tier: 'casual', count: 0, percentage: 0 },
      { tier: 'peripheral', count: 0, percentage: 0 },
    ];
  }

  // Calculate degree for each node
  const degrees: number[] = [];
  graph.forEachNode((nodeId: string) => {
    degrees.push(graph.degree(nodeId));
  });

  // Sort degrees to find percentiles
  degrees.sort((a, b) => b - a);

  // Define tier thresholds based on percentiles
  const p90 = degrees[Math.floor(degrees.length * 0.1)] || 0;
  const p70 = degrees[Math.floor(degrees.length * 0.3)] || 0;
  const p40 = degrees[Math.floor(degrees.length * 0.6)] || 0;

  // Count nodes in each tier
  let core = 0,
    active = 0,
    casual = 0,
    peripheral = 0;

  graph.forEachNode((nodeId: string) => {
    const degree = graph.degree(nodeId);
    if (degree >= p90) core++;
    else if (degree >= p70) active++;
    else if (degree >= p40) casual++;
    else peripheral++;
  });

  const total = graph.order;

  return [
    { tier: 'core', count: core, percentage: (core / total) * 100 },
    { tier: 'active', count: active, percentage: (active / total) * 100 },
    { tier: 'casual', count: casual, percentage: (casual / total) * 100 },
    { tier: 'peripheral', count: peripheral, percentage: (peripheral / total) * 100 },
  ];
}

// ============================================================
// GROWTH METRICS
// ============================================================

/**
 * Calculate potential connections (weak ties between communities)
 */
function calculatePotentialConnections(
  graph: GraphInstance,
  communities: CommunityInfo[]
): number {
  if (communities.length < 2) return 0;

  // Count inter-community edges as potential growth areas
  let interCommunityEdges = 0;

  graph.forEachEdge((_edge: string, _attrs: unknown, source: string, target: string) => {
    const sourceCommunity = graph.getNodeAttribute(source, 'community');
    const targetCommunity = graph.getNodeAttribute(target, 'community');

    if (sourceCommunity !== targetCommunity) {
      interCommunityEdges++;
    }
  });

  // Potential = nodes in smaller communities that could be connected
  const firstCommunity = communities[0];
  const smallerCommunities = firstCommunity
    ? communities.filter((c) => c.size < firstCommunity.size / 2)
    : [];
  const potentialNodes = smallerCommunities.reduce((sum, c) => sum + c.size, 0);

  return potentialNodes + interCommunityEdges;
}

/**
 * Calculate network maturity (0-100)
 */
function calculateNetworkMaturity(graph: GraphInstance): number {
  if (graph.order === 0) return 0;

  // Factors: density, reciprocity, community structure
  const graphDensity = density(graph);
  const reciprocity = calculateReciprocity(graph);

  // Average clustering coefficient approximation
  let totalClustering = 0;
  let count = 0;
  graph.forEachNode((nodeId: string) => {
    const neighbors = graph.neighbors(nodeId);
    if (neighbors.length >= 2) {
      let triangles = 0;
      for (let i = 0; i < neighbors.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          const ni = neighbors[i];
          const nj = neighbors[j];
          if (ni && nj && graph.hasEdge(ni, nj)) {
            triangles++;
          }
        }
      }
      const maxTriangles = (neighbors.length * (neighbors.length - 1)) / 2;
      totalClustering += maxTriangles > 0 ? triangles / maxTriangles : 0;
      count++;
    }
  });
  const avgClustering = count > 0 ? totalClustering / count : 0;

  // Weighted combination
  const maturity =
    graphDensity * 30 + // Density contribution
    reciprocity * 40 + // Reciprocity contribution
    avgClustering * 30; // Clustering contribution

  return Math.min(100, maturity * 100);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Calculate reciprocity (fraction of bidirectional edges)
 */
function calculateReciprocity(graph: GraphInstance): number {
  if (graph.size === 0) return 0;

  let reciprocal = 0;
  graph.forEachEdge((_edge: string, _attrs: unknown, source: string, target: string) => {
    if (graph.hasEdge(target, source)) {
      reciprocal++;
    }
  });

  return reciprocal / graph.size;
}

export default analyzeGraph;
