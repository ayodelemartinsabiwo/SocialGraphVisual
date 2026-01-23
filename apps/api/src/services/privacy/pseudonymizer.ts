/**
 * Pseudonymization Service
 * @module services/privacy/pseudonymizer
 *
 * HMAC-SHA256 based pseudonymization for privacy-preserving data storage.
 * Pseudonyms are deterministic (same input = same output) but irreversible.
 */

import crypto from 'crypto';
import { getUserKey, ensureUserKey } from './keyManager.js';

// ============================================================
// TYPES
// ============================================================

export interface PseudonymizationContext {
  userId: string;
  secretKey: string;
}

export interface PseudonymizedNode {
  id: string; // pseudonymized
  originalIdHash: string; // for duplicate detection
  metadata: {
    pseudonymized: true;
    pseudonymizedAt: number;
    dataType: string;
  };
}

export interface PseudonymizedEdge {
  source: string; // pseudonymized
  target: string; // pseudonymized
  metadata: {
    pseudonymized: true;
    pseudonymizedAt: number;
  };
}

// ============================================================
// CORE PSEUDONYMIZATION
// ============================================================

/**
 * Generate a pseudonym for an identifier using HMAC-SHA256
 */
export function pseudonymize(identifier: string, secretKey: string): string {
  return crypto
    .createHmac('sha256', secretKey)
    .update(identifier.toLowerCase().trim())
    .digest('hex')
    .substring(0, 16); // Use first 16 chars (64 bits) for reasonable ID length
}

/**
 * Generate a hash for deduplication (different from pseudonym)
 */
export function hashForDeduplication(identifier: string, secretKey: string): string {
  // Use a different key derivation for dedup hash to prevent correlation
  const dedupKey = crypto
    .createHmac('sha256', secretKey)
    .update('dedup')
    .digest('hex');

  return crypto
    .createHmac('sha256', dedupKey)
    .update(identifier.toLowerCase().trim())
    .digest('hex');
}

/**
 * Check if two identifiers would produce the same pseudonym
 */
export function wouldMatch(
  identifier1: string,
  identifier2: string,
  secretKey: string
): boolean {
  return pseudonymize(identifier1, secretKey) === pseudonymize(identifier2, secretKey);
}

// ============================================================
// BATCH PSEUDONYMIZATION
// ============================================================

/**
 * Pseudonymize a batch of identifiers
 */
export function pseudonymizeBatch(
  identifiers: string[],
  secretKey: string
): Map<string, string> {
  const result = new Map<string, string>();

  for (const identifier of identifiers) {
    result.set(identifier, pseudonymize(identifier, secretKey));
  }

  return result;
}

/**
 * Create a pseudonymization context for a user
 */
export async function createContext(userId: string): Promise<PseudonymizationContext> {
  const secretKey = await ensureUserKey(userId);

  return {
    userId,
    secretKey,
  };
}

// ============================================================
// GRAPH PSEUDONYMIZATION
// ============================================================

/**
 * Pseudonymize a node
 */
export function pseudonymizeNode(
  node: {
    id: string;
    type: string;
    [key: string]: unknown;
  },
  ctx: PseudonymizationContext
): PseudonymizedNode {
  const pseudoId = pseudonymize(node.id, ctx.secretKey);
  const idHash = hashForDeduplication(node.id, ctx.secretKey);

  return {
    id: pseudoId,
    originalIdHash: idHash,
    metadata: {
      pseudonymized: true,
      pseudonymizedAt: Date.now(),
      dataType: node.type,
    },
  };
}

/**
 * Pseudonymize an edge
 */
export function pseudonymizeEdge(
  edge: {
    source: string;
    target: string;
    [key: string]: unknown;
  },
  ctx: PseudonymizationContext
): PseudonymizedEdge {
  return {
    source: pseudonymize(edge.source, ctx.secretKey),
    target: pseudonymize(edge.target, ctx.secretKey),
    metadata: {
      pseudonymized: true,
      pseudonymizedAt: Date.now(),
    },
  };
}

/**
 * Pseudonymize an entire graph structure
 */
export function pseudonymizeGraph(
  graph: {
    nodes: Array<{ id: string; type: string; [key: string]: unknown }>;
    edges: Array<{ source: string; target: string; [key: string]: unknown }>;
    metadata?: Record<string, unknown>;
  },
  ctx: PseudonymizationContext
): {
  nodes: PseudonymizedNode[];
  edges: PseudonymizedEdge[];
  metadata: {
    pseudonymized: true;
    pseudonymizedAt: number;
    nodeCount: number;
    edgeCount: number;
  };
} {
  // Pseudonymize nodes
  const nodeIdMap = new Map<string, string>();
  const pseudoNodes: PseudonymizedNode[] = [];

  for (const node of graph.nodes) {
    const pseudoId = pseudonymize(node.id, ctx.secretKey);
    nodeIdMap.set(node.id, pseudoId);

    pseudoNodes.push({
      id: pseudoId,
      originalIdHash: hashForDeduplication(node.id, ctx.secretKey),
      metadata: {
        pseudonymized: true,
        pseudonymizedAt: Date.now(),
        dataType: node.type,
      },
    });
  }

  // Pseudonymize edges (only include edges where both nodes exist)
  const pseudoEdges: PseudonymizedEdge[] = [];

  for (const edge of graph.edges) {
    const sourceId = nodeIdMap.get(edge.source);
    const targetId = nodeIdMap.get(edge.target);

    if (sourceId && targetId) {
      pseudoEdges.push({
        source: sourceId,
        target: targetId,
        metadata: {
          pseudonymized: true,
          pseudonymizedAt: Date.now(),
        },
      });
    }
  }

  return {
    nodes: pseudoNodes,
    edges: pseudoEdges,
    metadata: {
      pseudonymized: true,
      pseudonymizedAt: Date.now(),
      nodeCount: pseudoNodes.length,
      edgeCount: pseudoEdges.length,
    },
  };
}

// ============================================================
// SENSITIVE DATA HANDLING
// ============================================================

/**
 * Scrub sensitive fields from an object
 */
export function scrubSensitiveFields<T extends Record<string, unknown>>(
  obj: T,
  sensitiveFields: string[]
): Partial<T> {
  const result: Partial<T> = { ...obj };

  for (const field of sensitiveFields) {
    if (field in result) {
      delete result[field];
    }
  }

  return result;
}

/**
 * Default sensitive fields that should never be stored
 */
export const DEFAULT_SENSITIVE_FIELDS = [
  'email',
  'phone',
  'phoneNumber',
  'address',
  'location',
  'ip',
  'ipAddress',
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'ssn',
  'socialSecurity',
  'creditCard',
  'cardNumber',
  'cvv',
  'birthDate',
  'birthday',
  'dob',
];

/**
 * Scrub all known sensitive fields from an object
 */
export function scrubAllSensitive<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return scrubSensitiveFields(obj, DEFAULT_SENSITIVE_FIELDS);
}

// ============================================================
// VALIDATION
// ============================================================

/**
 * Check if data appears to be properly pseudonymized
 */
export function isPseudonymized(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check for pseudonymization metadata
  if (obj.metadata && typeof obj.metadata === 'object') {
    return (obj.metadata as Record<string, unknown>).pseudonymized === true;
  }

  return false;
}

/**
 * Check if a string looks like a pseudonymized ID (16 hex chars)
 */
export function looksLikePseudoId(id: string): boolean {
  return /^[a-f0-9]{16}$/i.test(id);
}

// ============================================================
// AUDIT LOGGING
// ============================================================

/**
 * Create audit log entry for pseudonymization operation
 */
export function createAuditEntry(
  operation: 'pseudonymize' | 'batch_pseudonymize' | 'graph_pseudonymize',
  userId: string,
  details: {
    itemCount?: number;
    dataType?: string;
    success: boolean;
    error?: string;
  }
): {
  timestamp: number;
  operation: string;
  userId: string;
  details: typeof details;
} {
  return {
    timestamp: Date.now(),
    operation,
    userId,
    details,
  };
}

export default {
  pseudonymize,
  hashForDeduplication,
  wouldMatch,
  pseudonymizeBatch,
  createContext,
  pseudonymizeNode,
  pseudonymizeEdge,
  pseudonymizeGraph,
  scrubSensitiveFields,
  scrubAllSensitive,
  isPseudonymized,
  looksLikePseudoId,
  createAuditEntry,
  DEFAULT_SENSITIVE_FIELDS,
};
