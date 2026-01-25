/**
 * Graph Service
 * @module services/graph
 *
 * Server-side graph data management including ingestion,
 * storage, and retrieval.
 */

// Ingestion
export {
  validateGraphInput,
  ingestGraph,
  ingestGraphsBatch,
  updateGraphStatus,
  markGraphReady,
  markGraphFailed,
  type IngestGraphInput,
  type GraphNodeInput,
  type GraphEdgeInput,
  type IngestResult,
} from './ingestion.js';

// Storage
export {
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
  type StoredGraph,
  type GraphListItem,
  type GraphQueryOptions,
} from './storage.js';

// Re-export defaults
export { default as ingestion } from './ingestion.js';
export { default as storage } from './storage.js';
