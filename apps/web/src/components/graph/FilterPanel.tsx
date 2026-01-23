import { useState } from 'react';
import { X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  onClose: () => void;
}

/**
 * Community colors following VSG design system
 */
const communities = [
  { id: 0, name: 'Tech & Innovation', color: 'bg-vsg-community-blue', count: 45 },
  { id: 1, name: 'Creative Arts', color: 'bg-vsg-community-purple', count: 38 },
  { id: 2, name: 'Business & Finance', color: 'bg-vsg-community-green', count: 52 },
  { id: 3, name: 'Lifestyle', color: 'bg-vsg-community-amber', count: 31 },
  { id: 4, name: 'Entertainment', color: 'bg-vsg-community-pink', count: 28 },
];

/**
 * FilterPanel Component
 *
 * Collapsible filter panel for the graph view:
 * - Community toggles
 * - Node size range (by PageRank)
 * - Edge strength threshold
 * - Show/hide labels
 */
function FilterPanel({ onClose }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    communities: true,
    metrics: true,
    display: false,
  });

  const [filters, setFilters] = useState({
    communities: new Set(communities.map((c) => c.id)),
    minPageRank: 0,
    minEdgeWeight: 0,
    showLabels: true,
    showIsolated: true,
  });

  /**
   * Toggle section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  /**
   * Toggle community filter
   */
  const toggleCommunity = (communityId: number) => {
    setFilters((prev) => {
      const newCommunities = new Set(prev.communities);
      if (newCommunities.has(communityId)) {
        newCommunities.delete(communityId);
      } else {
        newCommunities.add(communityId);
      }
      return { ...prev, communities: newCommunities };
    });
  };

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setFilters({
      communities: new Set(communities.map((c) => c.id)),
      minPageRank: 0,
      minEdgeWeight: 0,
      showLabels: true,
      showIsolated: true,
    });
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0 border-b border-vsg-gray-200 dark:border-vsg-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-h4">Filters</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetFilters}
              aria-label="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto py-4">
        {/* Communities */}
        <FilterSection
          title="Communities"
          isExpanded={expandedSections.communities}
          onToggle={() => toggleSection('communities')}
        >
          <div className="space-y-2">
            {communities.map((community) => (
              <label
                key={community.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-vsg-gray-50 dark:hover:bg-vsg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.communities.has(community.id)}
                  onChange={() => toggleCommunity(community.id)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'w-5 h-5 rounded flex items-center justify-center border-2 transition-colors',
                    filters.communities.has(community.id)
                      ? 'border-vsg-orange-500 bg-vsg-orange-500'
                      : 'border-vsg-gray-300 dark:border-vsg-gray-600'
                  )}
                >
                  {filters.communities.has(community.id) && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div className={cn('w-3 h-3 rounded-full', community.color)} />
                <span className="flex-1 text-body-sm text-vsg-gray-700 dark:text-vsg-gray-300">
                  {community.name}
                </span>
                <span className="text-caption text-vsg-gray-400">
                  {community.count}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Metrics filters */}
        <FilterSection
          title="Metrics"
          isExpanded={expandedSections.metrics}
          onToggle={() => toggleSection('metrics')}
        >
          <div className="space-y-4">
            {/* PageRank threshold */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-body-sm text-vsg-gray-600 dark:text-vsg-gray-400">
                  Min Influence (PageRank)
                </label>
                <span className="text-body-sm font-medium text-vsg-gray-900 dark:text-white">
                  {filters.minPageRank}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={filters.minPageRank}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPageRank: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-vsg-gray-200 dark:bg-vsg-gray-700 rounded-lg appearance-none cursor-pointer accent-vsg-orange-500"
              />
            </div>

            {/* Edge weight threshold */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-body-sm text-vsg-gray-600 dark:text-vsg-gray-400">
                  Min Connection Strength
                </label>
                <span className="text-body-sm font-medium text-vsg-gray-900 dark:text-white">
                  {filters.minEdgeWeight}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={filters.minEdgeWeight}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minEdgeWeight: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-vsg-gray-200 dark:bg-vsg-gray-700 rounded-lg appearance-none cursor-pointer accent-vsg-orange-500"
              />
            </div>
          </div>
        </FilterSection>

        {/* Display options */}
        <FilterSection
          title="Display"
          isExpanded={expandedSections.display}
          onToggle={() => toggleSection('display')}
        >
          <div className="space-y-3">
            <label className="flex items-center justify-between p-2 rounded-md hover:bg-vsg-gray-50 dark:hover:bg-vsg-gray-800 cursor-pointer">
              <span className="text-body-sm text-vsg-gray-700 dark:text-vsg-gray-300">
                Show Labels
              </span>
              <ToggleSwitch
                checked={filters.showLabels}
                onChange={(checked) =>
                  setFilters((prev) => ({ ...prev, showLabels: checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-md hover:bg-vsg-gray-50 dark:hover:bg-vsg-gray-800 cursor-pointer">
              <span className="text-body-sm text-vsg-gray-700 dark:text-vsg-gray-300">
                Show Isolated Nodes
              </span>
              <ToggleSwitch
                checked={filters.showIsolated}
                onChange={(checked) =>
                  setFilters((prev) => ({ ...prev, showIsolated: checked }))
                }
              />
            </label>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
}

/**
 * Collapsible filter section
 */
function FilterSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="text-body font-medium text-vsg-gray-900 dark:text-white">
          {title}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-vsg-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-vsg-gray-400" />
        )}
      </button>
      {isExpanded && <div className="pt-2">{children}</div>}
    </div>
  );
}

/**
 * Toggle switch component
 */
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-10 h-6 rounded-full transition-colors',
        checked ? 'bg-vsg-orange-500' : 'bg-vsg-gray-300 dark:bg-vsg-gray-600'
      )}
    >
      <span
        className={cn(
          'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
          checked && 'translate-x-4'
        )}
      />
    </button>
  );
}

export default FilterPanel;
