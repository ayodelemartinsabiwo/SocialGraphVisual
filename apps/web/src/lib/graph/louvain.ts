/**
 * Louvain Community Detection
 * @module lib/graph/louvain
 *
 * Implementation of the Louvain algorithm for community detection.
 * Uses graphology-communities-louvain under the hood.
 */

import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';
import type {
  Community,
  CommunityResult,
  LouvainOptions,
  ProgressCallback,
  GraphData,
} from './types';
import { toGraphology } from './builder';

// ============================================================
// DEFAULT OPTIONS
// ============================================================

const DEFAULT_OPTIONS: Required<LouvainOptions> = {
  resolution: 1,
  randomize: false,
  maxIterations: 100,
  minModularityGain: 0.0001,
};

// ============================================================
// COMMUNITY COLORS
// ============================================================

const COMMUNITY_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#f43f5e', // rose
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
];

// ============================================================
// LOUVAIN ALGORITHM
// ============================================================

/**
 * Run Louvain community detection on a graph
 */
export function detectCommunities(
  data: GraphData | Graph,
  options?: LouvainOptions,
  onProgress?: ProgressCallback
): CommunityResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  onProgress?.({
    phase: 'community-detection',
    current: 0,
    total: 4,
    percentage: 0,
    message: 'Initializing community detection...',
  });

  // Convert to graphology if needed
  const graph = data instanceof Graph ? data : toGraphology(data);

  // Handle empty or single-node graphs
  if (graph.order < 2) {
    return {
      communities: [],
      modularity: 0,
      nodeAssignments: new Map(),
    };
  }

  onProgress?.({
    phase: 'community-detection',
    current: 1,
    total: 4,
    percentage: 25,
    message: 'Running Louvain algorithm...',
  });

  // Run Louvain algorithm
  const details = louvain.detailed(graph, {
    resolution: opts.resolution,
    randomWalk: opts.randomize,
  });

  onProgress?.({
    phase: 'community-detection',
    current: 2,
    total: 4,
    percentage: 50,
    message: 'Processing communities...',
  });

  // Build node assignments map
  const nodeAssignments = new Map<string, string>();
  const communityNodes = new Map<string, string[]>();

  graph.forEachNode((nodeId) => {
    const communityId = graph.getNodeAttribute(nodeId, 'community')?.toString() || '0';
    nodeAssignments.set(nodeId, communityId);

    if (!communityNodes.has(communityId)) {
      communityNodes.set(communityId, []);
    }
    communityNodes.get(communityId)!.push(nodeId);
  });

  onProgress?.({
    phase: 'community-detection',
    current: 3,
    total: 4,
    percentage: 75,
    message: 'Calculating community metrics...',
  });

  // Build community objects
  const communities: Community[] = [];
  let colorIndex = 0;

  for (const [communityId, nodeIds] of communityNodes) {
    const density = calculateCommunityDensity(graph, nodeIds);

    communities.push({
      id: communityId,
      nodeIds,
      size: nodeIds.length,
      density,
      label: `Community ${parseInt(communityId) + 1}`,
      color: COMMUNITY_COLORS[colorIndex % COMMUNITY_COLORS.length],
    });

    colorIndex++;
  }

  // Sort by size (largest first)
  communities.sort((a, b) => b.size - a.size);

  onProgress?.({
    phase: 'community-detection',
    current: 4,
    total: 4,
    percentage: 100,
    message: `Found ${communities.length} communities`,
  });

  return {
    communities,
    modularity: details.modularity,
    nodeAssignments,
  };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate the density of a community (internal edges / possible edges)
 */
function calculateCommunityDensity(graph: Graph, nodeIds: string[]): number {
  if (nodeIds.length < 2) {
    return 1;
  }

  const nodeSet = new Set(nodeIds);
  let internalEdges = 0;

  for (const nodeId of nodeIds) {
    graph.forEachOutEdge(nodeId, (edge, attrs, source, target) => {
      if (nodeSet.has(target)) {
        internalEdges++;
      }
    });
  }

  // For directed graph: max edges = n * (n - 1)
  const maxEdges = nodeIds.length * (nodeIds.length - 1);

  return maxEdges > 0 ? internalEdges / maxEdges : 0;
}

/**
 * Get inter-community edges
 */
export function getInterCommunityEdges(
  graph: Graph,
  nodeAssignments: Map<string, string>
): Map<string, { source: string; target: string; weight: number }[]> {
  const interEdges = new Map<string, { source: string; target: string; weight: number }[]>();

  graph.forEachEdge((edge, attrs, source, target) => {
    const sourceCommunity = nodeAssignments.get(source);
    const targetCommunity = nodeAssignments.get(target);

    if (sourceCommunity && targetCommunity && sourceCommunity !== targetCommunity) {
      const key = [sourceCommunity, targetCommunity].sort().join('-');

      if (!interEdges.has(key)) {
        interEdges.set(key, []);
      }

      interEdges.get(key)!.push({
        source,
        target,
        weight: (attrs as { weight?: number }).weight || 1,
      });
    }
  });

  return interEdges;
}

/**
 * Get community hierarchy (for multi-level Louvain)
 */
export function getCommunityHierarchy(
  data: GraphData | Graph,
  maxLevels: number = 3
): CommunityResult[] {
  const graph = data instanceof Graph ? data.copy() : toGraphology(data);
  const results: CommunityResult[] = [];

  for (let level = 0; level < maxLevels; level++) {
    const result = detectCommunities(graph);

    // Stop if we only have one community
    if (result.communities.length <= 1) {
      break;
    }

    results.push(result);

    // Contract graph for next level
    const contracted = contractGraph(graph, result.nodeAssignments);
    if (contracted.order === graph.order) {
      break; // No further contraction possible
    }
  }

  return results;
}

/**
 * Contract a graph by merging communities into super-nodes
 */
function contractGraph(graph: Graph, nodeAssignments: Map<string, string>): Graph {
  const contracted = new Graph({ multi: false, type: 'directed', allowSelfLoops: false });

  // Add community nodes
  const communities = new Set(nodeAssignments.values());
  for (const communityId of communities) {
    contracted.addNode(communityId);
  }

  // Add edges between communities
  const edgeWeights = new Map<string, number>();

  graph.forEachEdge((edge, attrs, source, target) => {
    const sourceCommunity = nodeAssignments.get(source);
    const targetCommunity = nodeAssignments.get(target);

    if (sourceCommunity && targetCommunity && sourceCommunity !== targetCommunity) {
      const key = `${sourceCommunity}->${targetCommunity}`;
      const weight = (attrs as { weight?: number }).weight || 1;
      edgeWeights.set(key, (edgeWeights.get(key) || 0) + weight);
    }
  });

  for (const [key, weight] of edgeWeights) {
    const [source, target] = key.split('->');
    contracted.addEdge(source, target, { weight });
  }

  return contracted;
}

/**
 * Assign colors to nodes based on their community
 */
export function assignCommunityColors(
  data: GraphData,
  result: CommunityResult
): GraphData {
  const communityColors = new Map<string, string>();

  for (const community of result.communities) {
    communityColors.set(community.id, community.color || COMMUNITY_COLORS[0]);
  }

  const updatedNodes = data.nodes.map((node) => {
    const communityId = result.nodeAssignments.get(node.id);
    const color = communityId ? communityColors.get(communityId) : undefined;

    return {
      ...node,
      metrics: {
        ...node.metrics,
        communityId,
      },
      visual: {
        ...node.visual,
        color: color || node.visual?.color || '#6366f1',
      },
    } as typeof node;
  });

  return {
    ...data,
    nodes: updatedNodes,
  };
}

export default detectCommunities;
