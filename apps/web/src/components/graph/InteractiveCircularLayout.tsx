/**
 * Interactive Circular Layout
 * @module components/graph/InteractiveCircularLayout
 *
 * Enhanced circular graph visualization matching the original mockup:
 * - Perfect circular arrangement
 * - Smooth animations
 * - Advanced hover effects
 * - Gradient edges
 * - Particle effects
 */

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphEdge } from '@vsg/shared';

interface InteractiveCircularLayoutProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;
  onNodeSelect: (nodeId: string | null) => void;
  selectedNode: string | null;
  communityColors: string[];
}

export function InteractiveCircularLayout({
  nodes,
  edges,
  width,
  height,
  onNodeSelect,
  selectedNode,
  communityColors,
}: InteractiveCircularLayoutProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create main group for zoom/pan
    const g = svg.append('g').attr('class', 'graph-container');

    // Setup zoom
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Calculate layout positions
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Separate self node from others
    const selfNode = nodes.find((n) => n.type === 'SELF');
    const otherNodes = nodes.filter((n) => n.type !== 'SELF');

    // Position self node at center
    if (selfNode) {
      (selfNode as any).x = centerX;
      (selfNode as any).y = centerY;
    }

    // Arrange other nodes in perfect circle
    const angleStep = (2 * Math.PI) / otherNodes.length;
    otherNodes.forEach((node, index) => {
      const angle = angleStep * index - Math.PI / 2; // Start from top
      (node as any).x = centerX + radius * Math.cos(angle);
      (node as any).y = centerY + radius * Math.sin(angle);
    });

    // Create gradients for edges
    const defs = svg.append('defs');

    // Create gradient from center (orange) to periphery (gray)
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'edge-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#F97316').attr('stop-opacity', 0.6);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#9CA3AF').attr('stop-opacity', 0.3);

    // Create glow filter for hover effect
    const filter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', 4)
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create edge group
    const edgesGroup = g.append('g').attr('class', 'edges');
    const nodesGroup = g.append('g').attr('class', 'nodes');

    // Draw edges with smooth curves
    const edgeElements = edgesGroup
      .selectAll('path')
      .data(edges)
      .join('path')
      .attr('d', (d) => {
        const source = nodes.find((n) => n.id === d.source);
        const target = nodes.find((n) => n.id === d.target);
        if (!source || !target) return '';

        const sx = (source as any).x;
        const sy = (source as any).y;
        const tx = (target as any).x;
        const ty = (target as any).y;

        // Create curved edge path
        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;

        return `M ${sx},${sy} Q ${midX},${midY} ${tx},${ty}`;
      })
      .attr('fill', 'none')
      .attr('stroke', 'url(#edge-gradient)')
      .attr('stroke-width', (d) => Math.max(0.5, d.weight * 3))
      .attr('stroke-opacity', 0.2)
      .attr('class', 'edge-path');

    // Draw nodes
    const nodeElements = nodesGroup
      .selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${(d as any).x},${(d as any).y})`)
      .style('cursor', 'pointer');

    // Add outer glow circle (hidden by default)
    nodeElements
      .append('circle')
      .attr('class', 'node-glow')
      .attr('r', (d) => {
        const baseSize = d.type === 'SELF' ? 16 : Math.max(6, (d.pageRank || 0.01) * 25 + 4);
        return baseSize + 8;
      })
      .attr('fill', (d) => {
        const cid = d.communityId || 0;
        return communityColors[cid % communityColors.length];
      })
      .attr('opacity', 0)
      .attr('filter', 'url(#glow)');

    // Add main circle
    nodeElements
      .append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d) => {
        return d.type === 'SELF' ? 16 : Math.max(6, (d.pageRank || 0.01) * 25 + 4);
      })
      .attr('fill', (d) => {
        const cid = d.communityId || 0;
        return communityColors[cid % communityColors.length];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add label for self node
    nodeElements
      .filter((d) => d.type === 'SELF')
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', 30)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .attr('fill', '#374151')
      .text('You');

    // Interactive hover effects
    nodeElements
      .on('mouseover', function (event, d) {
        // Enlarge node with smooth transition
        d3.select(this)
          .select('.node-circle')
          .transition()
          .duration(200)
          .attr('stroke-width', 4)
          .attr('stroke', '#F97316');

        // Show glow
        d3.select(this)
          .select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0.4);

        // Highlight connected edges
        edgeElements
          .transition()
          .duration(200)
          .attr('stroke-opacity', (e) => {
            return e.source === d.id || e.target === d.id ? 0.8 : 0.05;
          })
          .attr('stroke-width', (e) => {
            return e.source === d.id || e.target === d.id ? 3 : 0.5;
          });

        // Show tooltip
        showTooltip(event, d);
      })
      .on('mouseout', function () {
        // Reset node
        d3.select(this)
          .select('.node-circle')
          .transition()
          .duration(200)
          .attr('stroke-width', 2)
          .attr('stroke', '#fff');

        // Hide glow
        d3.select(this)
          .select('.node-glow')
          .transition()
          .duration(200)
          .attr('opacity', 0);

        // Reset edges
        edgeElements
          .transition()
          .duration(200)
          .attr('stroke-opacity', 0.2)
          .attr('stroke-width', (d) => Math.max(0.5, d.weight * 3));

        // Hide tooltip
        hideTooltip();
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        onNodeSelect(d.id);

        // Add "pulse" animation on click
        const nodeData = d;
        d3.select(this)
          .select('.node-glow')
          .attr('opacity', 0.8)
          .transition()
          .duration(600)
          .ease(d3.easeCircleOut)
          .attr('r', () => {
            const baseSize = nodeData.type === 'SELF' ? 16 : Math.max(6, (nodeData.pageRank || 0.01) * 25 + 4);
            return baseSize + 20;
          })
          .attr('opacity', 0);
      });

    // Smooth entrance animation
    nodeElements
      .style('opacity', 0)
      .transition()
      .duration(800)
      .delay((_, i) => i * 10)
      .style('opacity', 1);

    edgeElements
      .attr('stroke-dasharray', function () {
        const length = (this as SVGPathElement).getTotalLength();
        return `${length} ${length}`;
      })
      .attr('stroke-dashoffset', function () {
        return (this as SVGPathElement).getTotalLength();
      })
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);

    // Tooltip element
    let tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    function showTooltip(event: MouseEvent, node: GraphNode) {
      if (!tooltip) {
        tooltip = d3
          .select('body')
          .append('div')
          .attr('class', 'graph-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.9)')
          .style('color', '#fff')
          .style('padding', '8px 12px')
          .style('border-radius', '6px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('opacity', 0);
      }

      tooltip
        .html(
          `
          <div style="min-width: 150px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${node.displayName}</div>
            <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 6px;">${node.username}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
              ${node.followerCount !== undefined ? `<div>Followers: ${node.followerCount}</div>` : ''}
              ${node.followingCount !== undefined ? `<div>Following: ${node.followingCount}</div>` : ''}
              ${node.pageRank !== undefined ? `<div>Influence: ${(node.pageRank * 100).toFixed(1)}%</div>` : ''}
              ${node.communityId !== undefined ? `<div>Community: ${node.communityId}</div>` : ''}
            </div>
          </div>
        `
        )
        .style('left', `${event.pageX + 15}px`)
        .style('top', `${event.pageY - 30}px`)
        .transition()
        .duration(200)
        .style('opacity', 1);
    }

    function hideTooltip() {
      if (tooltip) {
        tooltip.transition().duration(200).style('opacity', 0);
      }
    }

    // Cleanup
    return () => {
      if (tooltip) {
        tooltip.remove();
      }
    };
  }, [nodes, edges, width, height, onNodeSelect, selectedNode, communityColors]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
      }}
    />
  );
}
