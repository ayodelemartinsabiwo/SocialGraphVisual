/**
 * Graph Types
 * @module lib/graph/types
 *
 * Type definitions for client-side graph processing.
 */

import type { Platform } from '@vsg/shared';

// ============================================================
// NODE TYPES
// ============================================================

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  platform: Platform;
  metadata: NodeMetadata;
  metrics?: NodeMetrics;
  position?: NodePosition;
  visual?: NodeVisual;
}

export type NodeType = 'user' | 'self' | 'mutual' | 'follower' | 'following';

export interface NodeMetadata {
  originalId?: string;
  pseudonymizedId: string;
  addedAt: number;
  source: string;
  tags?: string[];
}

export interface NodeMetrics {
  degree: number;
  inDegree: number;
  outDegree: number;
  pageRank?: number;
  betweenness?: number;
  closeness?: number;
  communityId?: string;
  clusteringCoefficient?: number;
}

export interface NodePosition {
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NodeVisual {
  size: number;
  color: string;
  opacity: number;
  highlighted: boolean;
  selected: boolean;
}

// ============================================================
// EDGE TYPES
// ============================================================

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  metadata: EdgeMetadata;
  visual?: EdgeVisual;
}

export type EdgeType = 'follow' | 'mutual' | 'mention' | 'reply' | 'like' | 'connection';

export interface EdgeMetadata {
  createdAt: number;
  interactions: number;
  reciprocated: boolean;
  sources: string[];
}

export interface EdgeVisual {
  width: number;
  color: string;
  opacity: number;
  curved: boolean;
}

// ============================================================
// GRAPH TYPES
// ============================================================

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export interface GraphMetadata {
  platform: Platform;
  createdAt: number;
  parsedAt: number;
  nodeCount: number;
  edgeCount: number;
  version: string;
}

// ============================================================
// ALGORITHM TYPES
// ============================================================

export interface Community {
  id: string;
  nodeIds: string[];
  size: number;
  density: number;
  label?: string;
  color?: string;
}

export interface CommunityResult {
  communities: Community[];
  modularity: number;
  nodeAssignments: Map<string, string>;
}

export interface PageRankResult {
  scores: Map<string, number>;
  iterations: number;
  converged: boolean;
}

export interface BetweennessResult {
  scores: Map<string, number>;
  normalized: boolean;
}

export interface MetricsResult {
  density: number;
  averageDegree: number;
  averageClusteringCoefficient: number;
  diameter: number;
  connectedComponents: number;
  reciprocity: number;
}

// ============================================================
// ALGORITHM OPTIONS
// ============================================================

export interface LouvainOptions {
  resolution?: number;
  randomize?: boolean;
  maxIterations?: number;
  minModularityGain?: number;
}

export interface PageRankOptions {
  damping?: number;
  maxIterations?: number;
  tolerance?: number;
}

export interface BetweennessOptions {
  normalized?: boolean;
  weighted?: boolean;
  sampleSize?: number;
}

export interface LayoutOptions {
  type: 'force' | 'circular' | 'hierarchical' | 'radial';
  iterations?: number;
  strength?: number;
  nodeSpacing?: number;
}

// ============================================================
// CALLBACK TYPES
// ============================================================

export type ProgressCallback = (progress: AlgorithmProgress) => void;

export interface AlgorithmProgress {
  phase: string;
  current: number;
  total: number;
  percentage: number;
  message?: string;
}
