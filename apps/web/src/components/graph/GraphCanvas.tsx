import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { cn } from '@/lib/utils';
import { COMMUNITY_COLORS_HEX } from '@/lib/graph/colors';
import type { GraphNode as SharedGraphNode, GraphEdge as SharedGraphEdge } from '@vsg/shared';

// Force Vite recompile - timestamp: 2026-01-26T15:57

// Internal D3 compatible types (extends shared with D3 simulation fields)
interface D3GraphNode extends SharedGraphNode {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  bio?: string; // Optional bio field for industry classification
}

interface D3GraphEdge {
  source: string | D3GraphNode;
  target: string | D3GraphNode;
  weight: number;
}

interface GraphCanvasProps {
  zoom: number;
  viewMode: 'force' | 'radial' | 'hierarchical' | 'circular';
  searchQuery: string;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  nodes?: SharedGraphNode[];
  edges?: SharedGraphEdge[];
  showLabels?: boolean;
}

/**
 * Community colors from shared utility (supports 16+ communities with cycling)
 */
const communityColors = COMMUNITY_COLORS_HEX;

/**
 * Industry-based community names and colors
 */
const INDUSTRY_COMMUNITIES = {
  0: { name: 'Technology', color: '#3B82F6' }, // Blue
  1: { name: 'Creative', color: '#8B5CF6' },    // Purple
  2: { name: 'Business', color: '#10B981' },    // Green
  3: { name: 'Media', color: '#F59E0B' },       // Amber
  4: { name: 'Education', color: '#EC4899' },   // Pink
  5: { name: 'Healthcare', color: '#06B6D4' },  // Cyan
  6: { name: 'Finance', color: '#14B8A6' },     // Teal
  7: { name: 'Community', color: '#6366F1' },   // Indigo
};

/**
 * Keywords for industry classification
 */
const INDUSTRY_KEYWORDS = {
  Technology: ['tech', 'developer', 'software', 'engineer', 'programmer', 'code', 'data', 'ai', 'ml', 'cloud', 'devops', 'frontend', 'backend', 'fullstack', 'web dev', 'mobile dev'],
  Creative: ['design', 'designer', 'art', 'artist', 'creative', 'ui', 'ux', 'graphic', 'video', 'photo', 'content', 'writer', 'author', 'illustrator', 'animator'],
  Business: ['business', 'entrepreneur', 'founder', 'ceo', 'cto', 'manager', 'consultant', 'strategy', 'sales', 'marketing', 'product', 'startup', 'venture'],
  Media: ['media', 'journalist', 'reporter', 'news', 'broadcaster', 'podcaster', 'youtuber', 'influencer', 'streamer', 'content creator'],
  Education: ['teacher', 'educator', 'professor', 'instructor', 'student', 'academic', 'researcher', 'scholar', 'education', 'learning'],
  Healthcare: ['doctor', 'nurse', 'health', 'medical', 'physician', 'therapist', 'healthcare', 'wellness', 'fitness', 'nutrition'],
  Finance: ['finance', 'banker', 'investor', 'trader', 'analyst', 'accounting', 'economist', 'financial', 'crypto', 'blockchain'],
};

/**
 * Classify node into industry based on bio, username, or display name
 */
function classifyNodeIndustry(node: D3GraphNode): number {
  const searchText = `${node.displayName} ${node.username} ${node.bio || ''}`.toLowerCase();

  // Check each industry for keyword matches
  const industryScores: { [key: string]: number } = {};

  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        score++;
      }
    }
    if (score > 0) {
      industryScores[industry] = score;
    }
  }

  // Return industry with highest score
  if (Object.keys(industryScores).length > 0) {
    const topIndustry = Object.entries(industryScores).sort((a, b) => b[1] - a[1])[0][0];
    return Object.keys(INDUSTRY_COMMUNITIES).find(
      key => INDUSTRY_COMMUNITIES[parseInt(key) as keyof typeof INDUSTRY_COMMUNITIES].name === topIndustry
    ) ? parseInt(Object.keys(INDUSTRY_COMMUNITIES).find(
      key => INDUSTRY_COMMUNITIES[parseInt(key) as keyof typeof INDUSTRY_COMMUNITIES].name === topIndustry
    )!) : 7; // Default to Community
  }

  // Default to Community if no industry matches
  return 7;
}

/**
 * GraphCanvas Component
 *
 * D3.js force-directed graph visualization with:
 * - Community coloring (Louvain output)
 * - Node sizing based on PageRank
 * - Edge weighting for engagement strength
 * - Zoom/pan interactions
 * - Node selection and highlighting
 * - Multiple layout modes (force, radial, hierarchical)
 */

/**
 * Apply circular layout - perfect circle with center node (matching mockup)
 */
function applyCircularLayout(nodes: D3GraphNode[], width: number, height: number): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38; // Slightly larger for better spacing

  // Find self node
  const selfNode = nodes.find((n) => n.type === 'SELF');
  const otherNodes = nodes.filter((n) => n.type !== 'SELF');

  // Position self node at center
  if (selfNode) {
    selfNode.x = centerX;
    selfNode.y = centerY;
  }

  // Arrange other nodes in perfect circle
  const angleStep = (2 * Math.PI) / otherNodes.length;
  otherNodes.forEach((node, index) => {
    const angle = angleStep * index - Math.PI / 2; // Start from top
    node.x = centerX + radius * Math.cos(angle);
    node.y = centerY + radius * Math.sin(angle);
  });
}

/**
 * Apply radial layout - nodes arranged in concentric circles by community
 */
function applyRadialLayout(nodes: D3GraphNode[], width: number, height: number): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.4;

  // Group nodes by community
  const communities = new Map<number, D3GraphNode[]>();
  for (const node of nodes) {
    const cid = node.communityId || 0;
    if (!communities.has(cid)) {
      communities.set(cid, []);
    }
    communities.get(cid)!.push(node);
  }

  // Sort communities by size (largest first)
  const sortedCommunities = [...communities.entries()].sort((a, b) => b[1].length - a[1].length);

  // Assign each community to a ring, with nodes spread around
  const numRings = Math.max(1, sortedCommunities.length);
  const ringSpacing = maxRadius / numRings;

  sortedCommunities.forEach(([, communityNodes], ringIndex) => {
    const radius = ringSpacing * (ringIndex + 1);
    const angleStep = (2 * Math.PI) / communityNodes.length;

    communityNodes.forEach((node, nodeIndex) => {
      const angle = angleStep * nodeIndex - Math.PI / 2; // Start from top
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });
  });
}

/**
 * Apply hierarchical/tree layout - root at top, levels below
 */
function applyHierarchicalLayout(
  nodes: D3GraphNode[],
  edges: D3GraphEdge[],
  width: number,
  height: number
): void {
  // Build adjacency for degree calculation
  const degree = new Map<string, number>();
  for (const node of nodes) {
    degree.set(node.id, 0);
  }
  for (const edge of edges) {
    const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
    degree.set(sourceId, (degree.get(sourceId) || 0) + 1);
    degree.set(targetId, (degree.get(targetId) || 0) + 1);
  }
  
  // Find root (highest degree node, or highest pageRank)
  let rootNode = nodes[0];
  let maxScore = 0;
  for (const node of nodes) {
    const score = (degree.get(node.id) || 0) + (node.pageRank || 0) * 100;
    if (score > maxScore) {
      maxScore = score;
      rootNode = node;
    }
  }
  
  // BFS to assign levels
  const level = new Map<string, number>();
  const visited = new Set<string>();
  const queue: D3GraphNode[] = [rootNode];
  level.set(rootNode.id, 0);
  visited.add(rootNode.id);
  
  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
    adjacency.get(sourceId)?.push(targetId);
    adjacency.get(targetId)?.push(sourceId);
  }
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = level.get(current.id) || 0;
    
    for (const neighborId of adjacency.get(current.id) || []) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        level.set(neighborId, currentLevel + 1);
        const neighbor = nodes.find(n => n.id === neighborId);
        if (neighbor) queue.push(neighbor);
      }
    }
  }
  
  // Handle disconnected nodes (put them at bottom)
  const maxLevel = Math.max(...level.values(), 0);
  for (const node of nodes) {
    if (!level.has(node.id)) {
      level.set(node.id, maxLevel + 1);
    }
  }
  
  // Group nodes by level
  const levels = new Map<number, D3GraphNode[]>();
  for (const node of nodes) {
    const lvl = level.get(node.id) || 0;
    if (!levels.has(lvl)) {
      levels.set(lvl, []);
    }
    levels.get(lvl)!.push(node);
  }
  
  // Assign positions
  const numLevels = Math.max(...levels.keys()) + 1;
  const levelHeight = height / (numLevels + 1);
  const padding = 50;
  
  for (const [lvl, levelNodes] of levels.entries()) {
    const y = padding + levelHeight * (lvl + 0.5);
    const xStep = (width - 2 * padding) / (levelNodes.length + 1);
    
    levelNodes.forEach((node, index) => {
      node.x = padding + xStep * (index + 1);
      node.y = y;
    });
  }
}

function GraphCanvas({
  zoom,
  viewMode,
  searchQuery,
  selectedNode,
  onNodeSelect,
  nodes: propNodes,
  edges: propEdges,
  showLabels = true,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const simulationRef = useRef<d3.Simulation<D3GraphNode, D3GraphEdge> | null>(null);

  // Convert shared types to D3-compatible format and validate edges
  const graphData = useMemo(() => {
    // Only proceed if we have real nodes
    if (!propNodes || propNodes.length === 0) {
      console.warn('[GraphCanvas] No nodes provided - GraphPage should handle this');
      return { nodes: [], edges: [] };
    }

    // Clone nodes - use hybrid approach for industry classification
    const d3Nodes: D3GraphNode[] = propNodes.map((node) => {
      // Try keyword-based industry classification first
      const industryId = classifyNodeIndustry(node);

      // If keyword matching found an industry (not Community/7), use it
      // Otherwise, map backend's Louvain community to an industry cyclically
      let finalCommunityId: number;
      if (industryId !== 7) {
        // Keyword matching found an industry
        finalCommunityId = industryId;
      } else if (node.communityId !== undefined && node.communityId !== null) {
        // Map backend community to industry (cycle through 0-7)
        finalCommunityId = node.communityId % 8;
      } else {
        // Fallback to Community
        finalCommunityId = 7;
      }

      return {
        ...node,
        communityId: finalCommunityId,
        // Ensure display name uses real username if no displayName
        displayName: node.displayName || node.username || `User ${node.id.slice(0, 8)}`,
      };
    });

    // Create a set of valid node IDs for O(1) lookup
    const nodeIds = new Set(d3Nodes.map(n => n.id));

    // Filter edges to only include those referencing existing nodes
    // This prevents D3.js "node not found" errors
    const d3Edges: D3GraphEdge[] = (propEdges || [])
      .filter((edge) => {
        const sourceValid = nodeIds.has(edge.source);
        const targetValid = nodeIds.has(edge.target);
        if (!sourceValid || !targetValid) {
          console.warn(`[GraphCanvas] Filtering invalid edge: ${edge.source} -> ${edge.target}`);
          return false;
        }
        return true;
      })
      .map((edge) => ({
        source: edge.source,
        target: edge.target,
        // Ensure minimum weight for visibility, scale up for thickness
        weight: Math.max(0.3, edge.weight || 0.3),
      }));

    // Use label propagation for nodes that couldn't be classified by industry
    assignIndustryCommunities(d3Nodes, d3Edges);

    console.log(`[GraphCanvas] Loaded ${d3Nodes.length} nodes, ${d3Edges.length} valid edges`);
    return { nodes: d3Nodes, edges: d3Edges };
  }, [propNodes, propEdges]);

/**
 * Industry-based community assignment with label propagation fallback
 * For nodes classified as "Community" (7), use label propagation to assign
 * them to industry communities based on their connections
 */
function assignIndustryCommunities(nodes: D3GraphNode[], edges: D3GraphEdge[]): void {
  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
    adjacency.get(sourceId)?.push(targetId);
    adjacency.get(targetId)?.push(sourceId);
  }

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // For nodes with "Community" classification (7), use label propagation
  // to assign them to industry communities based on their connections
  for (const node of nodes) {
    // Skip nodes that already have industry classification
    if (node.communityId !== 7) continue;

    const neighbors = adjacency.get(node.id) || [];
    if (neighbors.length === 0) {
      // Isolated node - keep as Community
      continue;
    }

    // Count industry votes from neighbors
    const industryVotes = new Map<number, number>();
    for (const neighborId of neighbors) {
      const neighbor = nodeMap.get(neighborId);
      if (neighbor && neighbor.communityId !== undefined && neighbor.communityId !== 7) {
        const votes = industryVotes.get(neighbor.communityId) || 0;
        industryVotes.set(neighbor.communityId, votes + 1);
      }
    }

    // Assign to most popular industry among neighbors
    if (industryVotes.size > 0) {
      let maxVotes = 0;
      let bestIndustry = 7;
      for (const [industry, votes] of industryVotes) {
        if (votes > maxVotes) {
          maxVotes = votes;
          bestIndustry = industry;
        }
      }
      node.communityId = bestIndustry;
    }
    // Otherwise keep as Community (7)
  }

  // Log industry distribution
  const industryCount = new Map<number, number>();
  for (const node of nodes) {
    const count = industryCount.get(node.communityId || 7) || 0;
    industryCount.set(node.communityId || 7, count + 1);
  }

  console.log('[GraphCanvas] Industry distribution:');
  for (const [industryId, count] of industryCount.entries()) {
    const industry = INDUSTRY_COMMUNITIES[industryId as keyof typeof INDUSTRY_COMMUNITIES];
    console.log(`  ${industry?.name || 'Unknown'}: ${count} nodes`);
  }
}

  /**
   * Handle resize
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  /**
   * Initialize D3 visualization with different layouts based on viewMode
   */
  useEffect(() => {
    if (!svgRef.current || !graphData) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create container group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-container');

    // Setup zoom behavior
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Create edges first (behind nodes)
    const edgesGroup = g.append('g').attr('class', 'edges');
    const nodesGroup = g.append('g').attr('class', 'nodes');
    const labelsGroup = g.append('g').attr('class', 'labels');

    // Create edge elements - scale thickness by weight
    const edges = edgesGroup
      .selectAll('line')
      .data(graphData.edges)
      .join('line')
      .attr('stroke', '#9CA3AF')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => {
        // Scale edge width: min 0.5, max 4 based on weight
        const weight = d.weight || 0.3;
        return Math.max(0.5, weight * 4);
      });

    // Create node elements
    const nodes = nodesGroup
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', (d) => Math.max(6, (d.pageRank || 0.5) * 20 + 4))
      .attr('fill', (d) => {
        // Use industry colors if available, otherwise fallback to generic colors
        const industryId = d.communityId || 0;
        return INDUSTRY_COMMUNITIES[industryId as keyof typeof INDUSTRY_COMMUNITIES]?.color || communityColors[industryId % communityColors.length];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d.id);
      })
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('stroke', '#F97316')
          .attr('stroke-width', 3);

        // Highlight connected edges
        edges
          .attr('stroke-opacity', (e) => {
            const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
            const targetId = typeof e.target === 'string' ? e.target : e.target.id;
            return sourceId === d.id || targetId === d.id ? 0.8 : 0.1;
          })
          .attr('stroke', (e) => {
            const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
            const targetId = typeof e.target === 'string' ? e.target : e.target.id;
            return sourceId === d.id || targetId === d.id ? '#F97316' : '#9CA3AF';
          });
      })
      .on('mouseout', function () {
        d3.select(this)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);

        edges
          .attr('stroke-opacity', 0.3)
          .attr('stroke', '#9CA3AF');
      });

    // Add labels for larger nodes
    const labels = labelsGroup
      .selectAll('text')
      .data(graphData.nodes.filter((d) => (d.pageRank || 0) > 0.7))
      .join('text')
      .text((d) => d.displayName)
      .attr('font-size', 10)
      .attr('fill', '#374151')
      .attr('text-anchor', 'middle')
      .attr('dy', -12)
      .attr('pointer-events', 'none');

    // Apply layout based on viewMode
    if (viewMode === 'circular') {
      // CIRCULAR LAYOUT: Perfect circle with center node (matches mockup)
      applyCircularLayout(graphData.nodes, width, height);

      // Set fixed positions with smooth transition
      nodes
        .transition()
        .duration(800)
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);

      edges
        .transition()
        .duration(800)
        .attr('x1', (d) => (d.source as D3GraphNode).x!)
        .attr('y1', (d) => (d.source as D3GraphNode).y!)
        .attr('x2', (d) => (d.target as D3GraphNode).x!)
        .attr('y2', (d) => (d.target as D3GraphNode).y!);

      labels
        .transition()
        .duration(800)
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);

      // Add drag for circular layout
      nodes.call(
        d3
          .drag<SVGCircleElement, D3GraphNode>()
          .on('drag', (event, d) => {
            d.x = event.x;
            d.y = event.y;
            d3.select(event.sourceEvent.target).attr('cx', d.x || 0).attr('cy', d.y || 0);

            // Update connected edges
            edges
              .filter((e) => {
                const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
                const targetId = typeof e.target === 'string' ? e.target : e.target.id;
                return sourceId === d.id || targetId === d.id;
              })
              .attr('x1', (e) => (e.source as D3GraphNode).x!)
              .attr('y1', (e) => (e.source as D3GraphNode).y!)
              .attr('x2', (e) => (e.target as D3GraphNode).x!)
              .attr('y2', (e) => (e.target as D3GraphNode).y!);
          }) as unknown as (selection: d3.Selection<SVGCircleElement | d3.BaseType, D3GraphNode, SVGGElement, unknown>) => void
      );

    } else if (viewMode === 'radial') {
      // RADIAL LAYOUT: Position nodes in concentric circles by community
      applyRadialLayout(graphData.nodes, width, height);
      
      // Set fixed positions immediately
      nodes
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);
      
      edges
        .attr('x1', (d) => (d.source as D3GraphNode).x!)
        .attr('y1', (d) => (d.source as D3GraphNode).y!)
        .attr('x2', (d) => (d.target as D3GraphNode).x!)
        .attr('y2', (d) => (d.target as D3GraphNode).y!);
      
      labels
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);

      // Add drag for radial layout (fixed positions, no simulation)
      nodes.call(
        d3
          .drag<SVGCircleElement, D3GraphNode>()
          .on('drag', (event, d) => {
            d.x = event.x;
            d.y = event.y;
            d3.select(event.sourceEvent.target).attr('cx', d.x || 0).attr('cy', d.y || 0);
            
            // Update connected edges
            edges
              .filter((e) => {
                const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
                const targetId = typeof e.target === 'string' ? e.target : e.target.id;
                return sourceId === d.id || targetId === d.id;
              })
              .attr('x1', (e) => (e.source as D3GraphNode).x!)
              .attr('y1', (e) => (e.source as D3GraphNode).y!)
              .attr('x2', (e) => (e.target as D3GraphNode).x!)
              .attr('y2', (e) => (e.target as D3GraphNode).y!);
          }) as unknown as (selection: d3.Selection<SVGCircleElement | d3.BaseType, D3GraphNode, SVGGElement, unknown>) => void
      );

    } else if (viewMode === 'hierarchical') {
      // HIERARCHICAL/TREE LAYOUT: Find most connected node as root
      applyHierarchicalLayout(graphData.nodes, graphData.edges, width, height);
      
      // Set fixed positions
      nodes
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);
      
      edges
        .attr('x1', (d) => (d.source as D3GraphNode).x!)
        .attr('y1', (d) => (d.source as D3GraphNode).y!)
        .attr('x2', (d) => (d.target as D3GraphNode).x!)
        .attr('y2', (d) => (d.target as D3GraphNode).y!);
      
      labels
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);

      // Add drag for hierarchical layout
      nodes.call(
        d3
          .drag<SVGCircleElement, D3GraphNode>()
          .on('drag', (event, d) => {
            d.x = event.x;
            d.y = event.y;
            d3.select(event.sourceEvent.target).attr('cx', d.x || 0).attr('cy', d.y || 0);
            
            edges
              .filter((e) => {
                const sourceId = typeof e.source === 'string' ? e.source : e.source.id;
                const targetId = typeof e.target === 'string' ? e.target : e.target.id;
                return sourceId === d.id || targetId === d.id;
              })
              .attr('x1', (e) => (e.source as D3GraphNode).x!)
              .attr('y1', (e) => (e.source as D3GraphNode).y!)
              .attr('x2', (e) => (e.target as D3GraphNode).x!)
              .attr('y2', (e) => (e.target as D3GraphNode).y!);
          }) as unknown as (selection: d3.Selection<SVGCircleElement | d3.BaseType, D3GraphNode, SVGGElement, unknown>) => void
      );

    } else {
      // FORCE LAYOUT (default)
      const simulation = d3
        .forceSimulation<D3GraphNode>(graphData.nodes)
        .force(
          'link',
          d3
            .forceLink<D3GraphNode, D3GraphEdge>(graphData.edges)
            .id((d) => d.id)
            .distance(80)
            .strength((d) => d.weight * 0.5)
        )
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(20));

      simulationRef.current = simulation;

      // Add drag behavior for force simulation
      nodes.call(
        d3
          .drag<SVGCircleElement, D3GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as unknown as (selection: d3.Selection<SVGCircleElement | d3.BaseType, D3GraphNode, SVGGElement, unknown>) => void
      );

      // Update positions on simulation tick
      simulation.on('tick', () => {
        edges
          .attr('x1', (d) => (d.source as D3GraphNode).x!)
          .attr('y1', (d) => (d.source as D3GraphNode).y!)
          .attr('x2', (d) => (d.target as D3GraphNode).x!)
          .attr('y2', (d) => (d.target as D3GraphNode).y!);

        nodes
          .attr('cx', (d) => d.x!)
          .attr('cy', (d) => d.y!);

        labels
          .attr('x', (d) => d.x!)
          .attr('y', (d) => d.y!);
      });
    }

    // Click on background to deselect
    svg.on('click', () => {
      onNodeSelect(null);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, dimensions, viewMode, onNodeSelect]);

  /**
   * Update zoom level
   */
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const { width, height } = dimensions;

    svg
      .transition()
      .duration(300)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform as any,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(zoom).translate(-width / 2, -height / 2)
      );
  }, [zoom, dimensions]);

  /**
   * Highlight search matches
   */
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const query = searchQuery.toLowerCase();

    if (query) {
      svg
        .selectAll<SVGCircleElement, D3GraphNode>('circle')
        .attr('opacity', (d) =>
          d.displayName.toLowerCase().includes(query) || d.username.toLowerCase().includes(query) ? 1 : 0.2
        );
    } else {
      svg.selectAll<SVGCircleElement, D3GraphNode>('circle').attr('opacity', 1);
    }
  }, [searchQuery]);

  /**
   * Highlight selected node
   */
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg
      .selectAll<SVGCircleElement, D3GraphNode>('circle')
      .attr('stroke', (d) => (d.id === selectedNode ? '#F97316' : '#fff'))
      .attr('stroke-width', (d) => (d.id === selectedNode ? 4 : 2));
  }, [selectedNode]);

  /**
   * Toggle label visibility
   */
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('.labels').style('display', showLabels ? 'block' : 'none');
  }, [showLabels]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-full',
        'bg-vsg-gray-50 dark:bg-vsg-gray-950'
      )}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
}

export default GraphCanvas;
