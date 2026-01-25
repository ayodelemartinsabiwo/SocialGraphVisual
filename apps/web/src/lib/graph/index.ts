/**
 * Graph Library
 * @module lib/graph
 *
 * Client-side graph processing and analysis.
 * Combines graphology with custom algorithms for social network analysis.
 */

// Types
export * from './types';

// Builder
export {
  GraphBuilder,
  createGraphBuilder,
  toGraphology,
  fromGraphology,
} from './builder';

// Algorithms
export {
  runFullAnalysis,
  runCommunityDetection,
  runPageRank,
  runBetweenness,
  getNodeStatistics,
  getEdgeStatistics,
  filterByCommunity,
  getEgoNetwork,
  type FullAnalysisResult,
  type AnalysisInsights,
} from './algorithms';

// Community Detection (Louvain)
export {
  detectCommunities,
  getInterCommunityEdges,
  getCommunityHierarchy,
  assignCommunityColors,
} from './louvain';

// PageRank
export {
  calculatePageRank,
  getTopPageRankNodes,
  applyPageRankToGraph,
  calculatePersonalizedPageRank,
  getPageRankPercentile,
} from './pagerank';

// Betweenness Centrality
export {
  calculateBetweenness,
  getBridgeNodes,
  identifyCommunityBridges,
  applyBetweennessToGraph,
  getBetweennessPercentile,
  findArticulationPoints,
} from './betweenness';

// Metrics
export {
  calculateMetrics,
  calculateNodeMetrics,
  getDegreeDistribution,
  getInDegreeDistribution,
  getOutDegreeDistribution,
  calculateEngagementScores,
  getTopEngagedNodes,
  calculateHomophily,
  getEchoChamberScore,
} from './metrics';
