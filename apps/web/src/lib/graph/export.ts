/**
 * Graph Export Utilities
 * @module lib/graph/export
 *
 * Export graph visualizations as PNG, SVG, or JSON
 */

import type { GraphNode, GraphEdge } from '@vsg/shared';

/**
 * Export the SVG element as a PNG image
 */
export async function exportToPNG(
  svgElement: SVGSVGElement,
  filename: string = 'network-graph.png'
): Promise<void> {
  // Clone the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Get dimensions
  const width = svgElement.clientWidth || 800;
  const height = svgElement.clientHeight || 600;
  
  // Set explicit dimensions on clone
  svgClone.setAttribute('width', String(width));
  svgClone.setAttribute('height', String(height));
  
  // Add white background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'white');
  svgClone.insertBefore(bg, svgClone.firstChild);
  
  // Serialize to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  // Create blob and image
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  // Load into canvas for PNG conversion
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2; // 2x for higher resolution
    canvas.height = height * 2;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(2, 2);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      
      // Download
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          downloadBlob(pngBlob, filename);
        }
      }, 'image/png');
    }
    
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
}

/**
 * Export the SVG element as an SVG file
 */
export function exportToSVG(
  svgElement: SVGSVGElement,
  filename: string = 'network-graph.svg'
): void {
  // Clone and prepare
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Get dimensions
  const width = svgElement.clientWidth || 800;
  const height = svgElement.clientHeight || 600;
  
  // Set explicit dimensions
  svgClone.setAttribute('width', String(width));
  svgClone.setAttribute('height', String(height));
  svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Add white background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'white');
  svgClone.insertBefore(bg, svgClone.firstChild);
  
  // Serialize and download
  const serializer = new XMLSerializer();
  const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(svgClone);
  
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

/**
 * Export graph data as JSON
 */
export function exportToJSON(
  nodes: GraphNode[],
  edges: GraphEdge[],
  metadata?: {
    name?: string;
    createdAt?: string;
    statistics?: Record<string, unknown>;
  },
  filename: string = 'network-graph.json'
): void {
  const data = {
    exportedAt: new Date().toISOString(),
    metadata: metadata || {},
    graph: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodes: nodes.map((n) => ({
        id: n.id,
        displayName: n.displayName,
        username: n.username,
        type: n.type,
        communityId: n.communityId,
        pageRank: n.pageRank,
        degree: n.degree,
      })),
      edges: edges.map((e) => ({
        source: e.source,
        target: e.target,
        weight: e.weight,
        type: e.type,
      })),
    },
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, filename);
}

/**
 * Export graph data as CSV (nodes)
 */
export function exportNodesToCSV(
  nodes: GraphNode[],
  filename: string = 'network-nodes.csv'
): void {
  const headers = ['id', 'displayName', 'username', 'type', 'communityId', 'pageRank', 'degree'];
  const rows = nodes.map((n) => [
    n.id,
    `"${(n.displayName || '').replace(/"/g, '""')}"`,
    n.username || '',
    n.type || '',
    n.communityId ?? '',
    n.pageRank ?? '',
    n.degree ?? '',
  ]);
  
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, filename);
}

/**
 * Helper to trigger file download
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
