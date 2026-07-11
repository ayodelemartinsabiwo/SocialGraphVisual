import { cn } from '@/lib/utils';
import { getCommunityColorHex, getCommunityDisplayName } from '@/lib/graph/colors';

/**
 * Community info from graph statistics
 */
export interface CommunityInfo {
  id: number;
  size: number;
}

interface LegendProps {
  /** Array of community sizes from graph.statistics.communities.sizes */
  communitySizes?: number[];
  /** Maximum communities to display (default: 8) */
  maxDisplay?: number;
}

/**
 * Legend Component
 *
 * Displays the color legend for the graph visualization:
 * - Community colors (dynamic from graph data)
 * - Node size meaning
 * - Edge weight meaning
 */
function Legend({ communitySizes = [], maxDisplay = 8 }: LegendProps) {
  // Build dynamic community list from sizes array
  const communities = communitySizes.slice(0, maxDisplay).map((size, index) => ({
    id: index,
    name: getCommunityDisplayName(index, size),
    color: getCommunityColorHex(index),
  }));

  // Show message if no communities detected
  const hasNoCommunities = communities.length === 0;
  return (
    <div className="bg-white dark:bg-vsg-gray-900 rounded-md shadow-md p-3 min-w-[180px]">
      {/* Communities */}
      <div className="mb-3">
        <p className="text-caption font-medium text-vsg-gray-500 uppercase tracking-wider mb-2">
          Communities {communities.length > 0 && `(${communitySizes.length})`}
        </p>
        <div className="space-y-1.5">
          {hasNoCommunities ? (
            <p className="text-caption text-vsg-gray-400 italic">No communities detected</p>
          ) : (
            <>
              {communities.map((community) => (
                <div key={community.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: community.color }}
                  />
                  <span className="text-caption text-vsg-gray-700 dark:text-vsg-gray-300 truncate">
                    {community.name}
                  </span>
                </div>
              ))}
              {communitySizes.length > maxDisplay && (
                <p className="text-caption text-vsg-gray-400 italic">
                  +{communitySizes.length - maxDisplay} more
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Node size */}
      <div className="mb-3 pt-3 border-t border-vsg-gray-200 dark:border-vsg-gray-800">
        <p className="text-caption font-medium text-vsg-gray-500 uppercase tracking-wider mb-2">
          Node Size
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-vsg-gray-400" />
            <span className="text-caption text-vsg-gray-500">Low</span>
          </div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-vsg-gray-300 to-vsg-gray-500 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-vsg-gray-600" />
            <span className="text-caption text-vsg-gray-500">High</span>
          </div>
        </div>
        <p className="text-caption text-vsg-gray-400 mt-1">
          = Influence (PageRank)
        </p>
      </div>

      {/* Edge weight */}
      <div className="pt-3 border-t border-vsg-gray-200 dark:border-vsg-gray-800">
        <p className="text-caption font-medium text-vsg-gray-500 uppercase tracking-wider mb-2">
          Edge Thickness
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-px bg-vsg-gray-400" />
            <span className="text-caption text-vsg-gray-500">Weak</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <div className="w-4 h-1 bg-vsg-gray-600 rounded-full" />
            <span className="text-caption text-vsg-gray-500">Strong</span>
          </div>
        </div>
        <p className="text-caption text-vsg-gray-400 mt-1">
          = Connection strength
        </p>
      </div>
    </div>
  );
}

export default Legend;
