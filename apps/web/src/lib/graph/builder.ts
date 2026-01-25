/**
 * Graph Builder
 * @module lib/graph/builder
 *
 * Constructs graph data structures from parsed social media data.
 */

import Graph from 'graphology';
import type { Platform } from '@vsg/shared';
import type {
  GraphNode,
  GraphEdge,
  GraphData,
  GraphMetadata,
  NodeType,
  EdgeType,
  ProgressCallback,
} from './types';

// ============================================================
// GRAPH BUILDER CLASS
// ============================================================

export class GraphBuilder {
  private graph: Graph;
  private platform: Platform;
  private nodeMap: Map<string, GraphNode>;
  private edgeMap: Map<string, GraphEdge>;

  constructor(platform: Platform) {
    this.graph = new Graph({ multi: false, type: 'directed', allowSelfLoops: false });
    this.platform = platform;
    this.nodeMap = new Map();
    this.edgeMap = new Map();
  }

  // ============================================================
  // NODE OPERATIONS
  // ============================================================

  /**
   * Add a node to the graph
   */
  addNode(
    id: string,
    label: string,
    type: NodeType,
    metadata?: Partial<GraphNode['metadata']>
  ): GraphNode {
    if (this.nodeMap.has(id)) {
      return this.nodeMap.get(id)!;
    }

    const node: GraphNode = {
      id,
      label,
      type,
      platform: this.platform,
      metadata: {
        pseudonymizedId: id,
        addedAt: Date.now(),
        source: 'parser',
        ...metadata,
      },
    };

    this.nodeMap.set(id, node);
    this.graph.addNode(id, { ...node });

    return node;
  }

  /**
   * Get a node by ID
   */
  getNode(id: string): GraphNode | undefined {
    return this.nodeMap.get(id);
  }

  /**
   * Check if node exists
   */
  hasNode(id: string): boolean {
    return this.nodeMap.has(id);
  }

  /**
   * Update node properties
   */
  updateNode(id: string, updates: Partial<GraphNode>): void {
    const node = this.nodeMap.get(id);
    if (node) {
      Object.assign(node, updates);
      this.graph.replaceNodeAttributes(id, { ...node });
    }
  }

  // ============================================================
  // EDGE OPERATIONS
  // ============================================================

  /**
   * Add an edge to the graph
   */
  addEdge(
    source: string,
    target: string,
    type: EdgeType,
    weight: number = 1,
    metadata?: Partial<GraphEdge['metadata']>
  ): GraphEdge | null {
    // Skip self-loops
    if (source === target) {
      return null;
    }

    // Ensure nodes exist
    if (!this.hasNode(source) || !this.hasNode(target)) {
      return null;
    }

    const edgeId = `${source}->${target}`;

    // Check for existing edge
    if (this.edgeMap.has(edgeId)) {
      const existing = this.edgeMap.get(edgeId)!;
      existing.weight += weight;
      existing.metadata.interactions++;
      this.graph.setEdgeAttribute(source, target, 'weight', existing.weight);
      return existing;
    }

    const edge: GraphEdge = {
      id: edgeId,
      source,
      target,
      type,
      weight,
      metadata: {
        createdAt: Date.now(),
        interactions: 1,
        reciprocated: false,
        sources: [],
        ...metadata,
      },
    };

    this.edgeMap.set(edgeId, edge);
    this.graph.addEdge(source, target, { ...edge });

    // Check for reciprocation
    const reverseId = `${target}->${source}`;
    if (this.edgeMap.has(reverseId)) {
      edge.metadata.reciprocated = true;
      const reverseEdge = this.edgeMap.get(reverseId)!;
      reverseEdge.metadata.reciprocated = true;
    }

    return edge;
  }

  /**
   * Get an edge by source and target
   */
  getEdge(source: string, target: string): GraphEdge | undefined {
    return this.edgeMap.get(`${source}->${target}`);
  }

  /**
   * Check if edge exists
   */
  hasEdge(source: string, target: string): boolean {
    return this.edgeMap.has(`${source}->${target}`);
  }

  // ============================================================
  // BULK OPERATIONS
  // ============================================================

  /**
   * Add multiple nodes at once
   */
  addNodes(nodes: Array<{ id: string; label: string; type: NodeType }>): void {
    for (const node of nodes) {
      this.addNode(node.id, node.label, node.type);
    }
  }

  /**
   * Add multiple edges at once
   */
  addEdges(
    edges: Array<{
      source: string;
      target: string;
      type: EdgeType;
      weight?: number;
    }>
  ): void {
    for (const edge of edges) {
      this.addEdge(edge.source, edge.target, edge.type, edge.weight);
    }
  }

  // ============================================================
  // MUTUAL DETECTION
  // ============================================================

  /**
   * Detect and mark mutual relationships
   */
  detectMutuals(): void {
    for (const [edgeId, edge] of this.edgeMap) {
      const reverseId = `${edge.target}->${edge.source}`;
      if (this.edgeMap.has(reverseId)) {
        edge.metadata.reciprocated = true;
        edge.type = 'mutual';

        // Update node types if both are follow relationships
        const sourceNode = this.nodeMap.get(edge.source);
        const targetNode = this.nodeMap.get(edge.target);

        if (sourceNode && sourceNode.type !== 'self') {
          sourceNode.type = 'mutual';
        }
        if (targetNode && targetNode.type !== 'self') {
          targetNode.type = 'mutual';
        }
      }
    }
  }

  // ============================================================
  // METRICS CALCULATION
  // ============================================================

  /**
   * Calculate basic node metrics
   */
  calculateNodeMetrics(): void {
    for (const [nodeId, node] of this.nodeMap) {
      const inDegree = this.graph.inDegree(nodeId);
      const outDegree = this.graph.outDegree(nodeId);

      node.metrics = {
        degree: inDegree + outDegree,
        inDegree,
        outDegree,
      };

      this.graph.setNodeAttribute(nodeId, 'metrics', node.metrics);
    }
  }

  // ============================================================
  // BUILD OUTPUT
  // ============================================================

  /**
   * Build the final graph data structure
   */
  build(onProgress?: ProgressCallback): GraphData {
    onProgress?.({
      phase: 'building',
      current: 0,
      total: 3,
      percentage: 0,
      message: 'Detecting mutual relationships...',
    });

    // Step 1: Detect mutuals
    this.detectMutuals();

    onProgress?.({
      phase: 'building',
      current: 1,
      total: 3,
      percentage: 33,
      message: 'Calculating metrics...',
    });

    // Step 2: Calculate metrics
    this.calculateNodeMetrics();

    onProgress?.({
      phase: 'building',
      current: 2,
      total: 3,
      percentage: 66,
      message: 'Finalizing graph...',
    });

    // Step 3: Build output
    const nodes = Array.from(this.nodeMap.values());
    const edges = Array.from(this.edgeMap.values());

    const metadata: GraphMetadata = {
      platform: this.platform,
      createdAt: Date.now(),
      parsedAt: Date.now(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      version: '1.0.0',
    };

    onProgress?.({
      phase: 'building',
      current: 3,
      total: 3,
      percentage: 100,
      message: 'Graph built successfully',
    });

    return {
      nodes,
      edges,
      metadata,
    };
  }

  /**
   * Get the underlying graphology instance
   */
  getGraphologyInstance(): Graph {
    return this.graph;
  }

  /**
   * Get node count
   */
  get nodeCount(): number {
    return this.nodeMap.size;
  }

  /**
   * Get edge count
   */
  get edgeCount(): number {
    return this.edgeMap.size;
  }
}

// ============================================================
// FACTORY FUNCTION
// ============================================================

/**
 * Create a new graph builder
 */
export function createGraphBuilder(platform: Platform): GraphBuilder {
  return new GraphBuilder(platform);
}

// ============================================================
// CONVERSION UTILITIES
// ============================================================

/**
 * Convert GraphData to a graphology instance
 */
export function toGraphology(data: GraphData): Graph {
  const graph = new Graph({ multi: false, type: 'directed', allowSelfLoops: false });

  // Add nodes
  for (const node of data.nodes) {
    graph.addNode(node.id, { ...node });
  }

  // Add edges
  for (const edge of data.edges) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.addEdge(edge.source, edge.target, { ...edge });
    }
  }

  return graph;
}

/**
 * Convert graphology instance to GraphData
 */
export function fromGraphology(graph: Graph, platform: Platform): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Extract nodes
  graph.forEachNode((nodeId, attributes) => {
    nodes.push(attributes as GraphNode);
  });

  // Extract edges
  graph.forEachEdge((edgeId, attributes) => {
    edges.push(attributes as GraphEdge);
  });

  return {
    nodes,
    edges,
    metadata: {
      platform,
      createdAt: Date.now(),
      parsedAt: Date.now(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      version: '1.0.0',
    },
  };
}

export default GraphBuilder;
