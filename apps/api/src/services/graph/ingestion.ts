/**
 * Graph Ingestion Service
 * @module services/graph/ingestion
 *
 * Handles incoming graph data from clients, validates, pseudonymizes,
 * and stores graph data in the database.
 */

import { prisma } from '../../config/database.js';
import {
  createContext,
  pseudonymizeGraph,
  scrubAllSensitive,
} from '../privacy/index.js';
import type { Platform, GraphStatus } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export interface IngestGraphInput {
  userId: string;
  platform: Platform;
  nodes: GraphNodeInput[];
  edges: GraphEdgeInput[];
  metadata?: Record<string, unknown>;
}

export interface GraphNodeInput {
  id: string;
  label: string;
  type: string;
  metadata?: Record<string, unknown>;
}

export interface GraphEdgeInput {
  source: string;
  target: string;
  type: string;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface IngestResult {
  graphId: string;
  nodeCount: number;
  edgeCount: number;
  status: GraphStatus;
  warnings: string[];
}

// ============================================================
// VALIDATION
// ============================================================

const MAX_NODES = 50000;
const MAX_EDGES = 500000;
const MAX_LABEL_LENGTH = 100;

/**
 * Validate incoming graph data
 */
export function validateGraphInput(
  input: IngestGraphInput
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check node count
  if (input.nodes.length > MAX_NODES) {
    errors.push(`Too many nodes: ${input.nodes.length} (max: ${MAX_NODES})`);
  }

  // Check edge count
  if (input.edges.length > MAX_EDGES) {
    errors.push(`Too many edges: ${input.edges.length} (max: ${MAX_EDGES})`);
  }

  // Check for valid platform
  const validPlatforms: Platform[] = ['TWITTER', 'INSTAGRAM', 'LINKEDIN', 'FACEBOOK', 'TIKTOK'];
  if (!validPlatforms.includes(input.platform)) {
    errors.push(`Invalid platform: ${input.platform}`);
  }

  // Validate nodes
  const nodeIds = new Set<string>();
  for (const node of input.nodes) {
    if (!node.id) {
      errors.push('Node missing required field: id');
    }
    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }
    nodeIds.add(node.id);

    if (node.label && node.label.length > MAX_LABEL_LENGTH) {
      errors.push(`Node label too long: ${node.id}`);
    }
  }

  // Validate edges
  for (const edge of input.edges) {
    if (!edge.source || !edge.target) {
      errors.push('Edge missing required fields: source/target');
    }
    if (!nodeIds.has(edge.source)) {
      errors.push(`Edge references non-existent source node: ${edge.source}`);
    }
    if (!nodeIds.has(edge.target)) {
      errors.push(`Edge references non-existent target node: ${edge.target}`);
    }
    if (edge.source === edge.target) {
      errors.push(`Self-loop detected: ${edge.source}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================
// GRAPH INGESTION
// ============================================================

/**
 * Ingest graph data from client
 */
export async function ingestGraph(input: IngestGraphInput): Promise<IngestResult> {
  const warnings: string[] = [];

  // Step 1: Validate input
  const validation = validateGraphInput(input);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Step 2: Create pseudonymization context
  const ctx = await createContext(input.userId);

  // Step 3: Prepare nodes for pseudonymization
  const cleanedNodes = input.nodes.map((node) => ({
    id: node.id,
    type: node.type,
    ...(node.metadata ? scrubAllSensitive(node.metadata) : {}),
  }));

  // Step 4: Prepare edges for pseudonymization
  const cleanedEdges = input.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    type: edge.type,
    weight: edge.weight,
    ...(edge.metadata ? scrubAllSensitive(edge.metadata) : {}),
  }));

  // Step 5: Pseudonymize the graph
  const graphToProcess = {
    nodes: cleanedNodes,
    edges: cleanedEdges,
    metadata: input.metadata ?? {},
  };
  const pseudonymized = pseudonymizeGraph(graphToProcess, ctx);

  // Build metadata object (avoid undefined values for Prisma)
  const graphMetadata: Record<string, unknown> = {
    ...pseudonymized.metadata,
  };
  if (input.metadata) {
    graphMetadata['originalMetadata'] = scrubAllSensitive(input.metadata);
  }

  // Step 6: Store in database
  const graph = await prisma.graph.create({
    data: {
      userId: input.userId,
      platform: input.platform,
      nodesData: JSON.parse(JSON.stringify(pseudonymized.nodes)),
      edgesData: JSON.parse(JSON.stringify(pseudonymized.edges)),
      metadata: JSON.parse(JSON.stringify(graphMetadata)),
      status: 'PROCESSING',
    },
  });

  return {
    graphId: graph.id,
    nodeCount: pseudonymized.nodes.length,
    edgeCount: pseudonymized.edges.length,
    status: 'PROCESSING',
    warnings,
  };
}

/**
 * Bulk ingest multiple graphs
 */
export async function ingestGraphsBatch(
  inputs: IngestGraphInput[]
): Promise<IngestResult[]> {
  const results: IngestResult[] = [];

  for (const input of inputs) {
    try {
      const result = await ingestGraph(input);
      results.push(result);
    } catch (error) {
      results.push({
        graphId: '',
        nodeCount: 0,
        edgeCount: 0,
        status: 'ERROR',
        warnings: [(error as Error).message],
      });
    }
  }

  return results;
}

// ============================================================
// GRAPH STATUS UPDATES
// ============================================================

/**
 * Update graph processing status
 */
export async function updateGraphStatus(
  graphId: string,
  status: GraphStatus,
  statistics?: Record<string, unknown>
): Promise<void> {
  if (statistics) {
    await prisma.graph.update({
      where: { id: graphId },
      data: {
        status,
        statistics: JSON.parse(JSON.stringify(statistics)),
      },
    });
  } else {
    await prisma.graph.update({
      where: { id: graphId },
      data: { status },
    });
  }
}

/**
 * Mark graph as ready with computed statistics
 */
export async function markGraphReady(
  graphId: string,
  statistics: {
    nodeCount: number;
    edgeCount: number;
    density: number;
    communities: number;
    avgDegree: number;
  }
): Promise<void> {
  await updateGraphStatus(graphId, 'READY', statistics);
}

/**
 * Mark graph as failed with error details
 */
export async function markGraphFailed(
  graphId: string,
  error: string
): Promise<void> {
  await prisma.graph.update({
    where: { id: graphId },
    data: {
      status: 'ERROR',
      metadata: JSON.parse(JSON.stringify({
        error,
        failedAt: Date.now(),
      })),
    },
  });
}

export default {
  validateGraphInput,
  ingestGraph,
  ingestGraphsBatch,
  updateGraphStatus,
  markGraphReady,
  markGraphFailed,
};
