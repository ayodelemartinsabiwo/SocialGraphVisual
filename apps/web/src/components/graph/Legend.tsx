import { cn } from '@/lib/utils';

/**
 * Community data with colors from VSG design system
 */
const communities = [
  { name: 'Tech & Innovation', color: 'bg-vsg-community-blue' },
  { name: 'Creative Arts', color: 'bg-vsg-community-purple' },
  { name: 'Business & Finance', color: 'bg-vsg-community-green' },
  { name: 'Lifestyle', color: 'bg-vsg-community-amber' },
  { name: 'Entertainment', color: 'bg-vsg-community-pink' },
];

/**
 * Legend Component
 *
 * Displays the color legend for the graph visualization:
 * - Community colors
 * - Node size meaning
 * - Edge weight meaning
 */
function Legend() {
  return (
    <div className="bg-white dark:bg-vsg-gray-900 rounded-md shadow-md p-3 min-w-[180px]">
      {/* Communities */}
      <div className="mb-3">
        <p className="text-caption font-medium text-vsg-gray-500 uppercase tracking-wider mb-2">
          Communities
        </p>
        <div className="space-y-1.5">
          {communities.map((community) => (
            <div key={community.name} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', community.color)} />
              <span className="text-caption text-vsg-gray-700 dark:text-vsg-gray-300">
                {community.name}
              </span>
            </div>
          ))}
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
