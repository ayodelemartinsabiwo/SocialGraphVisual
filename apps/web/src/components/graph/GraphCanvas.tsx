import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { cn } from '@/lib/utils';

interface GraphNode {
  id: string;
  label: string;
  community: number;
  pageRank: number;
  betweenness: number;
  degree: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  weight: number;
}

interface GraphCanvasProps {
  zoom: number;
  viewMode: 'force' | 'radial' | 'hierarchical';
  searchQuery: string;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

/**
 * Community colors following VSG design system
 */
const communityColors = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#EF4444', // Red
  '#6366F1', // Indigo
];

/**
 * Generate mock graph data
 */
function generateMockData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Create nodes with communities
  const numNodes = 100;
  const numCommunities = 5;

  for (let i = 0; i < numNodes; i++) {
    const community = Math.floor(Math.random() * numCommunities);
    nodes.push({
      id: `node-${i}`,
      label: `User ${i}`,
      community,
      pageRank: Math.random(),
      betweenness: Math.random() * 0.1,
      degree: 0,
    });
  }

  // Create edges - more likely within same community
  for (let i = 0; i < numNodes; i++) {
    const numEdges = Math.floor(Math.random() * 5) + 2;
    for (let j = 0; j < numEdges; j++) {
      // 70% chance to connect within community
      let targetIdx: number;
      if (Math.random() < 0.7) {
        // Find node in same community
        const sameCommNodes = nodes.filter(
          (n, idx) => n.community === nodes[i].community && idx !== i
        );
        if (sameCommNodes.length > 0) {
          const target = sameCommNodes[Math.floor(Math.random() * sameCommNodes.length)];
          targetIdx = nodes.findIndex((n) => n.id === target.id);
        } else {
          targetIdx = Math.floor(Math.random() * numNodes);
        }
      } else {
        targetIdx = Math.floor(Math.random() * numNodes);
      }

      if (targetIdx !== i) {
        // Check if edge already exists
        const exists = edges.some(
          (e) =>
            (typeof e.source === 'string' ? e.source : e.source.id) === nodes[i].id &&
            (typeof e.target === 'string' ? e.target : e.target.id) === nodes[targetIdx].id
        );

        if (!exists) {
          edges.push({
            source: nodes[i].id,
            target: nodes[targetIdx].id,
            weight: Math.random() * 0.8 + 0.2,
          });
          nodes[i].degree++;
          nodes[targetIdx].degree++;
        }
      }
    }
  }

  return { nodes, edges };
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
 * - Performance optimization for large graphs
 */
function GraphCanvas({
  zoom,
  viewMode,
  searchQuery,
  selectedNode,
  onNodeSelect,
}: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [graphData] = useState(() => generateMockData());
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);

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
   * Initialize D3 visualization
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

    // Create simulation
    const simulation = d3
      .forceSimulation<GraphNode>(graphData.nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphEdge>(graphData.edges)
          .id((d) => d.id)
          .distance(80)
          .strength((d) => d.weight * 0.5)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    simulationRef.current = simulation;

    // Create edge elements
    const edges = g
      .append('g')
      .attr('class', 'edges')
      .selectAll('line')
      .data(graphData.edges)
      .join('line')
      .attr('stroke', '#9CA3AF')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', (d) => Math.max(1, d.weight * 2));

    // Create node elements
    const nodes = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', (d) => Math.max(6, d.pageRank * 20 + 4))
      .attr('fill', (d) => communityColors[d.community % communityColors.length])
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
      })
      .call(
        d3
          .drag<SVGCircleElement, GraphNode>()
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
          }) as unknown as (selection: d3.Selection<SVGCircleElement | d3.BaseType, GraphNode, SVGGElement, unknown>) => void
      );

    // Add labels for larger nodes
    const labels = g
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(graphData.nodes.filter((d) => d.pageRank > 0.7))
      .join('text')
      .text((d) => d.label)
      .attr('font-size', 10)
      .attr('fill', '#374151')
      .attr('text-anchor', 'middle')
      .attr('dy', -12)
      .attr('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      edges
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      nodes
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);

      labels
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);
    });

    // Click on background to deselect
    svg.on('click', () => {
      onNodeSelect(null);
    });

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions, onNodeSelect]);

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
        .selectAll<SVGCircleElement, GraphNode>('circle')
        .attr('opacity', (d) =>
          d.label.toLowerCase().includes(query) ? 1 : 0.2
        );
    } else {
      svg.selectAll<SVGCircleElement, GraphNode>('circle').attr('opacity', 1);
    }
  }, [searchQuery]);

  /**
   * Highlight selected node
   */
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .attr('stroke', (d) => (d.id === selectedNode ? '#F97316' : '#fff'))
      .attr('stroke-width', (d) => (d.id === selectedNode ? 4 : 2));
  }, [selectedNode]);

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
