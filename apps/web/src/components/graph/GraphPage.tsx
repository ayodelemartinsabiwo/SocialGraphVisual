import { useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  Filter,
  Search,
  Settings2,
  Users,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import GraphCanvas from './GraphCanvas';
import NodeDetails from './NodeDetails';
import FilterPanel from './FilterPanel';
import Legend from './Legend';

/**
 * View modes for the graph
 */
type ViewMode = 'force' | 'radial' | 'hierarchical';

/**
 * GraphPage Component
 *
 * Main graph visualization page with:
 * - Interactive D3.js graph canvas
 * - Zoom/pan controls
 * - Filter panel
 * - Node details sidebar
 * - Community legend
 * - Export options
 */
function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('force');
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with real graph data from store
  const graphStats = {
    nodes: 247,
    edges: 1832,
    communities: 5,
    density: 0.06,
  };

  /**
   * Handle zoom controls
   */
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
  }, []);

  /**
   * Handle node selection
   */
  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId);
  }, []);

  /**
   * Handle export
   */
  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export graph');
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
            Network Graph
          </h1>
          <p className="text-body text-vsg-gray-500 dark:text-vsg-gray-400 mt-1">
            {graphStats.nodes} connections • {graphStats.communities} communities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vsg-gray-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'pl-9 pr-4 py-2 rounded-md border w-48 lg:w-64',
                'bg-white dark:bg-vsg-gray-900',
                'border-vsg-gray-200 dark:border-vsg-gray-800',
                'text-body-sm text-vsg-gray-900 dark:text-white',
                'placeholder:text-vsg-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-vsg-orange-500 focus:border-transparent'
              )}
            />
          </div>

          {/* Filter toggle */}
          <Button
            variant={showFilters ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
          >
            <Filter className="w-5 h-5" />
          </Button>

          {/* Legend toggle */}
          <Button
            variant={showLegend ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setShowLegend(!showLegend)}
            aria-label="Toggle legend"
          >
            {showLegend ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </Button>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Filter panel - collapsible */}
        {showFilters && (
          <div className="w-64 flex-shrink-0">
            <FilterPanel onClose={() => setShowFilters(false)} />
          </div>
        )}

        {/* Graph canvas */}
        <div className="flex-1 relative min-w-0">
          <Card padding="none" className="h-full overflow-hidden">
            {/* Canvas */}
            <GraphCanvas
              zoom={zoom}
              viewMode={viewMode}
              searchQuery={searchQuery}
              selectedNode={selectedNode}
              onNodeSelect={handleNodeSelect}
            />

            {/* Zoom controls */}
            <div className="absolute bottom-4 left-4 flex flex-col gap-1">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                className="shadow-md"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                className="shadow-md"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleResetView}
                aria-label="Reset view"
                className="shadow-md"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoom(1)}
                aria-label="Fit to screen"
                className="shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* View mode selector */}
            <div className="absolute bottom-4 right-4 flex gap-1 bg-white dark:bg-vsg-gray-900 rounded-md shadow-md p-1">
              {[
                { mode: 'force' as ViewMode, icon: Users, label: 'Force' },
                { mode: 'radial' as ViewMode, icon: Layers, label: 'Radial' },
                { mode: 'hierarchical' as ViewMode, icon: Settings2, label: 'Tree' },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-3 py-1.5 rounded text-body-sm font-medium transition-colors',
                    viewMode === mode
                      ? 'bg-vsg-orange-500 text-white'
                      : 'text-vsg-gray-600 dark:text-vsg-gray-400 hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800'
                  )}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Legend */}
            {showLegend && (
              <div className="absolute top-4 left-4">
                <Legend />
              </div>
            )}

            {/* Zoom indicator */}
            <div className="absolute top-4 right-4 px-2 py-1 bg-white dark:bg-vsg-gray-900 rounded shadow-sm text-caption text-vsg-gray-500">
              {Math.round(zoom * 100)}%
            </div>
          </Card>
        </div>

        {/* Node details panel - shows when node is selected */}
        {selectedNode && (
          <div className="w-80 flex-shrink-0">
            <NodeDetails
              nodeId={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="mt-4 flex items-center gap-6 text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400">
        <span>
          <strong className="text-vsg-gray-900 dark:text-white">{graphStats.nodes}</strong> nodes
        </span>
        <span>
          <strong className="text-vsg-gray-900 dark:text-white">{graphStats.edges}</strong> edges
        </span>
        <span>
          <strong className="text-vsg-gray-900 dark:text-white">{graphStats.communities}</strong> communities
        </span>
        <span>
          Density: <strong className="text-vsg-gray-900 dark:text-white">{(graphStats.density * 100).toFixed(1)}%</strong>
        </span>
      </div>
    </div>
  );
}

export default GraphPage;
