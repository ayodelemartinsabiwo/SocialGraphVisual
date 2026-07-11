/**
 * Graph algorithm tests
 * @module lib/graph/__tests__/graph-algorithms
 *
 * Covers the pure client-side graph pipeline: builder conversions,
 * PageRank, Louvain community detection, and graph metrics.
 */

import { describe, it, expect } from 'vitest';
import type { GraphData, GraphNode, GraphEdge } from '../types';
import { toGraphology, fromGraphology } from '../builder';
import { calculatePageRank, getTopPageRankNodes } from '../pagerank';
import { detectCommunities } from '../louvain';
import { calculateMetrics } from '../metrics';

// ============================================================
// FIXTURES
// ============================================================

function makeNode(id: string): GraphNode {
  return {
    id,
    label: id,
    type: 'user',
    platform: 'INSTAGRAM',
    metadata: {
      pseudonymizedId: `pseudo-${id}`,
      addedAt: 0,
      source: 'test',
    },
  };
}

function makeEdge(source: string, target: string, weight = 1): GraphEdge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    type: 'follow',
    weight,
    metadata: {
      createdAt: 0,
      interactions: 0,
      reciprocated: false,
      sources: ['test'],
    },
  };
}

function makeGraph(nodeIds: string[], edgePairs: Array<[string, string]>): GraphData {
  return {
    nodes: nodeIds.map(makeNode),
    edges: edgePairs.map(([s, t]) => makeEdge(s, t)),
    metadata: {
      platform: 'INSTAGRAM',
      createdAt: 0,
      parsedAt: 0,
      nodeCount: nodeIds.length,
      edgeCount: edgePairs.length,
      version: '1.0.0',
    },
  };
}

/** Two 4-cliques (a-b-c-d, w-x-y-z) connected by a single bridge edge d->w */
const TWO_CLUSTERS = makeGraph(
  ['a', 'b', 'c', 'd', 'w', 'x', 'y', 'z'],
  [
    ['a', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'c'], ['b', 'd'], ['c', 'd'],
    ['w', 'x'], ['w', 'y'], ['w', 'z'], ['x', 'y'], ['x', 'z'], ['y', 'z'],
    ['d', 'w'],
  ]
);

const EMPTY_GRAPH = makeGraph([], []);

// ============================================================
// BUILDER
// ============================================================

describe('builder conversions', () => {
  it('round-trips nodes and edges through graphology', () => {
    const graph = toGraphology(TWO_CLUSTERS);

    expect(graph.order).toBe(8);
    expect(graph.size).toBe(13);

    const back = fromGraphology(graph, 'INSTAGRAM');
    expect(back.nodes.map((n) => n.id).sort()).toEqual(['a', 'b', 'c', 'd', 'w', 'x', 'y', 'z']);
    expect(back.edges).toHaveLength(13);
    expect(back.metadata.nodeCount).toBe(8);
  });

  it('skips edges whose endpoints are missing', () => {
    const data = makeGraph(['a', 'b'], [['a', 'b']]);
    data.edges.push(makeEdge('a', 'ghost'));

    const graph = toGraphology(data);
    expect(graph.size).toBe(1);
  });
});

// ============================================================
// PAGERANK
// ============================================================

describe('calculatePageRank', () => {
  it('returns empty result for an empty graph', () => {
    const result = calculatePageRank(EMPTY_GRAPH);
    expect(result.scores.size).toBe(0);
    expect(result.converged).toBe(true);
  });

  it('gives a single node the maximum score', () => {
    const result = calculatePageRank(makeGraph(['solo'], []));
    expect(result.scores.get('solo')).toBe(1.0);
  });

  it('scores every node and normalizes to [0, 1]', () => {
    const result = calculatePageRank(TWO_CLUSTERS);

    expect(result.scores.size).toBe(8);
    const values = [...result.scores.values()];
    expect(Math.max(...values)).toBeCloseTo(1.0);
    for (const v of values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('ranks a hub node above peripheral nodes', () => {
    // star: everyone points at hub
    const star = makeGraph(
      ['hub', 'p1', 'p2', 'p3'],
      [['p1', 'hub'], ['p2', 'hub'], ['p3', 'hub']]
    );
    const result = calculatePageRank(star);

    const hubScore = result.scores.get('hub') ?? 0;
    for (const id of ['p1', 'p2', 'p3']) {
      expect(hubScore).toBeGreaterThan(result.scores.get(id) ?? 0);
    }
  });

  it('getTopPageRankNodes returns descending ranks', () => {
    const result = calculatePageRank(TWO_CLUSTERS);
    const top = getTopPageRankNodes(result, 3);

    expect(top).toHaveLength(3);
    expect(top[0].rank).toBe(1);
    expect(top[0].score).toBeGreaterThanOrEqual(top[1].score);
    expect(top[1].score).toBeGreaterThanOrEqual(top[2].score);
  });
});

// ============================================================
// LOUVAIN
// ============================================================

describe('detectCommunities', () => {
  it('returns no communities for graphs with fewer than 2 nodes', () => {
    expect(detectCommunities(EMPTY_GRAPH).communities).toHaveLength(0);
    expect(detectCommunities(makeGraph(['solo'], [])).communities).toHaveLength(0);
  });

  it('separates two weakly-connected cliques into two communities', () => {
    const result = detectCommunities(TWO_CLUSTERS);

    expect(result.communities).toHaveLength(2);
    expect(result.modularity).toBeGreaterThan(0);

    // every node is assigned to exactly one community
    expect(result.nodeAssignments.size).toBe(8);

    // the cliques stay together
    const communityOf = (id: string) => result.nodeAssignments.get(id);
    expect(communityOf('a')).toBe(communityOf('b'));
    expect(communityOf('b')).toBe(communityOf('c'));
    expect(communityOf('c')).toBe(communityOf('d'));
    expect(communityOf('w')).toBe(communityOf('x'));
    expect(communityOf('x')).toBe(communityOf('y'));
    expect(communityOf('y')).toBe(communityOf('z'));
    expect(communityOf('a')).not.toBe(communityOf('w'));
  });

  it('community sizes sum to the node count', () => {
    const result = detectCommunities(TWO_CLUSTERS);
    const total = result.communities.reduce((sum, c) => sum + c.size, 0);
    expect(total).toBe(8);
  });
});

// ============================================================
// METRICS
// ============================================================

describe('calculateMetrics', () => {
  it('returns zeros for an empty graph', () => {
    const result = calculateMetrics(EMPTY_GRAPH);
    expect(result.density).toBe(0);
    expect(result.averageDegree).toBe(0);
    expect(result.connectedComponents).toBe(0);
  });

  it('computes density and average degree for a known graph', () => {
    // directed triangle: 3 nodes, 3 edges
    const triangle = makeGraph(['a', 'b', 'c'], [['a', 'b'], ['b', 'c'], ['c', 'a']]);
    const result = calculateMetrics(triangle);

    // directed density = e / (n * (n - 1)) = 3 / 6
    expect(result.density).toBeCloseTo(0.5);
    // each node has degree 2 (one in, one out)
    expect(result.averageDegree).toBeCloseTo(2);
    expect(result.connectedComponents).toBe(1);
  });

  it('counts connected components', () => {
    const disconnected = makeGraph(['a', 'b', 'x', 'y'], [['a', 'b'], ['x', 'y']]);
    const result = calculateMetrics(disconnected);
    expect(result.connectedComponents).toBe(2);
  });
});
