/**
 * Graph Storage Service
 * @module services/graph/storage
 *
 * Handles graph data retrieval, caching, and management.
 */

import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import type { Platform, GraphStatus } from '@vsg/shared';

// ============================================================
// TYPES
// ============================================================

export interface StoredGraph {
  id: string;
  userId: string;
  platform: Platform;
  nodesData: unknown[];
  edgesData: unknown[];
  metadata: Record<string, unknown>;
  statistics: Record<string, unknown> | null;
  status: GraphStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphListItem {
  id: string;
  platform: Platform;
  nodeCount: number;
  edgeCount: number;
  status: GraphStatus;
  createdAt: Date;
}

export interface GraphQueryOptions {
  userId: string;
  platform?: Platform;
  status?: GraphStatus;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

// ============================================================
// CACHE CONFIGURATION
// ============================================================

const CACHE_TTL = 3600; // 1 hour
const CACHE_PREFIX = 'graph:';

/**
 * Get cache key for a graph
 */
function getCacheKey(graphId: string): string {
  return `${CACHE_PREFIX}${graphId}`;
}

// ============================================================
// GRAPH RETRIEVAL
// ============================================================

/**
 * Get a graph by ID with caching
 */
export async function getGraph(
  graphId: string,
  userId: string
): Promise<StoredGraph | null> {
  // Try cache first (if redis is available)
  const cacheKey = getCacheKey(graphId);
  if (redis) {
    const cached = await redis.get(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached) as StoredGraph;
      // Verify ownership
      if (parsed.userId !== userId) {
        return null;
      }
      return parsed;
    }
  }

  // Fetch from database
  const graph = await prisma.graph.findFirst({
    where: {
      id: graphId,
      userId: userId,
    },
  });

  if (!graph) {
    return null;
  }

  // Parse JSON strings from SQLite
  const nodesData = typeof graph.nodesData === 'string' ? JSON.parse(graph.nodesData) : graph.nodesData;
  const edgesData = typeof graph.edgesData === 'string' ? JSON.parse(graph.edgesData) : graph.edgesData;
  const metadata = typeof graph.metadata === 'string' ? JSON.parse(graph.metadata) : graph.metadata;
  const statistics = graph.statistics ? (typeof graph.statistics === 'string' ? JSON.parse(graph.statistics) : graph.statistics) : null;

  const stored: StoredGraph = {
    id: graph.id,
    userId: graph.userId,
    platform: graph.platform as Platform,
    nodesData: nodesData as unknown[],
    edgesData: edgesData as unknown[],
    metadata: metadata as Record<string, unknown>,
    statistics: statistics as Record<string, unknown> | null,
    status: graph.status as GraphStatus,
    createdAt: graph.createdAt,
    updatedAt: graph.updatedAt,
  };

  // Cache the result (if redis is available)
  if (redis) {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(stored));
  }

  return stored;
}

/**
 * Get graph without ownership check (for internal use)
 */
export async function getGraphInternal(graphId: string): Promise<StoredGraph | null> {
  const graph = await prisma.graph.findUnique({
    where: { id: graphId },
  });

  if (!graph) {
    return null;
  }

  // Parse JSON strings from SQLite
  const nodesDataInternal = typeof graph.nodesData === 'string' ? JSON.parse(graph.nodesData) : graph.nodesData;
  const edgesDataInternal = typeof graph.edgesData === 'string' ? JSON.parse(graph.edgesData) : graph.edgesData;
  const metadataInternal = typeof graph.metadata === 'string' ? JSON.parse(graph.metadata) : graph.metadata;
  const statisticsInternal = graph.statistics ? (typeof graph.statistics === 'string' ? JSON.parse(graph.statistics) : graph.statistics) : null;

  return {
    id: graph.id,
    userId: graph.userId,
    platform: graph.platform as Platform,
    nodesData: nodesDataInternal as unknown[],
    edgesData: edgesDataInternal as unknown[],
    metadata: metadataInternal as Record<string, unknown>,
    statistics: statisticsInternal as Record<string, unknown> | null,
    status: graph.status as GraphStatus,
    createdAt: graph.createdAt,
    updatedAt: graph.updatedAt,
  };
}

/**
 * List graphs for a user
 */
export async function listGraphs(
  options: GraphQueryOptions
): Promise<{ graphs: GraphListItem[]; total: number }> {
  const {
    userId,
    platform,
    status,
    limit = 10,
    offset = 0,
    orderBy = 'createdAt',
    order = 'desc',
  } = options;

  // Build where clause
  const where: Record<string, unknown> = { userId };
  if (platform) where.platform = platform;
  if (status) where.status = status;

  // Get total count
  const total = await prisma.graph.count({ where });

  // Get paginated results
  const graphs = await prisma.graph.findMany({
    where,
    select: {
      id: true,
      platform: true,
      status: true,
      createdAt: true,
      metadata: true,
    },
    orderBy: { [orderBy]: order },
    take: limit,
    skip: offset,
  });

  const items: GraphListItem[] = graphs.map((g) => {
    // Parse JSON strings from SQLite
    const meta = typeof g.metadata === 'string' ? JSON.parse(g.metadata) : g.metadata;
    return {
      id: g.id,
      platform: g.platform as Platform,
      nodeCount: (meta?.nodeCount as number) || 0,
      edgeCount: (meta?.edgeCount as number) || 0,
      status: g.status as GraphStatus,
      createdAt: g.createdAt,
    };
  });

  return { graphs: items, total };
}

// ============================================================
// GRAPH UPDATES
// ============================================================

/**
 * Update graph statistics
 */
export async function updateStatistics(
  graphId: string,
  statistics: Record<string, unknown>
): Promise<void> {
  await prisma.graph.update({
    where: { id: graphId },
    data: { statistics: JSON.stringify(statistics) },
  });

  // Invalidate cache
  await invalidateCache(graphId);
}

/**
 * Update graph metadata
 */
export async function updateMetadata(
  graphId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  const graph = await prisma.graph.findUnique({
    where: { id: graphId },
    select: { metadata: true },
  });

  // Parse JSON strings from SQLite
  const existingMeta = graph?.metadata ? (typeof graph.metadata === 'string' ? JSON.parse(graph.metadata) : graph.metadata) : {};
  const mergedMeta = { ...existingMeta, ...metadata };

  await prisma.graph.update({
    where: { id: graphId },
    data: {
      metadata: JSON.stringify(mergedMeta),
    },
  });

  // Invalidate cache
  await invalidateCache(graphId);
}

// ============================================================
// GRAPH DELETION
// ============================================================

/**
 * Delete a graph and all associated data
 */
export async function deleteGraph(
  graphId: string,
  userId: string
): Promise<boolean> {
  // Verify ownership
  const graph = await prisma.graph.findFirst({
    where: { id: graphId, userId },
  });

  if (!graph) {
    return false;
  }

  // Delete insights first (due to foreign key)
  await prisma.insight.deleteMany({
    where: { graphId },
  });

  // Delete exports
  await prisma.export.deleteMany({
    where: { graphId },
  });

  // Delete the graph
  await prisma.graph.delete({
    where: { id: graphId },
  });

  // Invalidate cache
  await invalidateCache(graphId);

  return true;
}

/**
 * Delete all graphs for a user
 */
export async function deleteAllUserGraphs(userId: string): Promise<number> {
  // Get all graph IDs first
  const graphs = await prisma.graph.findMany({
    where: { userId },
    select: { id: true },
  });

  const graphIds = graphs.map((g) => g.id);

  // Delete insights for all graphs
  await prisma.insight.deleteMany({
    where: { graphId: { in: graphIds } },
  });

  // Delete exports for all graphs
  await prisma.export.deleteMany({
    where: { graphId: { in: graphIds } },
  });

  // Delete all graphs
  const result = await prisma.graph.deleteMany({
    where: { userId },
  });

  // Invalidate all caches
  for (const graphId of graphIds) {
    await invalidateCache(graphId);
  }

  return result.count;
}

// ============================================================
// CACHE MANAGEMENT
// ============================================================

/**
 * Invalidate cache for a graph
 */
export async function invalidateCache(graphId: string): Promise<void> {
  if (!redis) return;
  const cacheKey = getCacheKey(graphId);
  await redis.del(cacheKey);
}

/**
 * Warm cache for a graph
 */
export async function warmCache(graphId: string): Promise<void> {
  if (!redis) return;
  const graph = await getGraphInternal(graphId);
  if (graph) {
    const cacheKey = getCacheKey(graphId);
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(graph));
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  hitRate: number;
  missRate: number;
  keys: number;
}> {
  if (!redis) {
    return { hitRate: 0, missRate: 0, keys: 0 };
  }
  // Simple stats - in production, use proper cache monitoring
  const pattern = `${CACHE_PREFIX}*`;
  const keys = await redis.keys(pattern);

  return {
    hitRate: 0, // Would need to track hits/misses
    missRate: 0,
    keys: keys.length,
  };
}

// ============================================================
// UTILITIES
// ============================================================

/**
 * Check if a user owns a graph
 */
export async function isGraphOwner(
  graphId: string,
  userId: string
): Promise<boolean> {
  const count = await prisma.graph.count({
    where: { id: graphId, userId },
  });
  return count > 0;
}

/**
 * Get graph count for a user
 */
export async function getUserGraphCount(userId: string): Promise<number> {
  return prisma.graph.count({ where: { userId } });
}

/**
 * Get graph count by platform for a user
 */
export async function getGraphCountByPlatform(
  userId: string
): Promise<Record<Platform, number>> {
  const results = await prisma.graph.groupBy({
    by: ['platform'],
    where: { userId },
    _count: { id: true },
  });

  const counts: Record<string, number> = {};
  for (const result of results) {
    counts[result.platform] = result._count.id;
  }

  return counts as Record<Platform, number>;
}

export default {
  getGraph,
  getGraphInternal,
  listGraphs,
  updateStatistics,
  updateMetadata,
  deleteGraph,
  deleteAllUserGraphs,
  invalidateCache,
  warmCache,
  getCacheStats,
  isGraphOwner,
  getUserGraphCount,
  getGraphCountByPlatform,
};
