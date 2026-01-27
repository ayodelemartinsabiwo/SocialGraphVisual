import { X, User, Users, TrendingUp, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { GraphNode, GraphEdge } from '@vsg/shared';

interface NodeDetailsProps {
  node: GraphNode | null;
  edges: GraphEdge[];
  allNodes: GraphNode[];
  onClose: () => void;
}

/**
 * Community colors following VSG design system
 */
const communityColors = [
  { bg: 'bg-vsg-community-blue', text: 'text-vsg-community-blue', name: 'Tech & Innovation' },
  { bg: 'bg-vsg-community-purple', text: 'text-vsg-community-purple', name: 'Creative Arts' },
  { bg: 'bg-vsg-community-green', text: 'text-vsg-community-green', name: 'Business & Finance' },
  { bg: 'bg-vsg-community-amber', text: 'text-vsg-community-amber', name: 'Lifestyle' },
  { bg: 'bg-vsg-community-pink', text: 'text-vsg-community-pink', name: 'Entertainment' },
];

/**
 * NodeDetails Component
 *
 * Sidebar panel showing detailed information about a selected node:
 * - Basic info (name, platform)
 * - Network metrics (PageRank, betweenness, degree)
 * - Community membership
 * - Connections list
 * - Engagement stats
 */
function NodeDetails({ node, edges, allNodes, onClose }: NodeDetailsProps) {
  if (!node) return null;

  // Calculate metrics from actual data
  const connectedEdges = edges.filter(
    e => e.source === node.id || e.target === node.id
  );
  
  const inDegree = edges.filter(e => e.target === node.id).length;
  const outDegree = edges.filter(e => e.source === node.id).length;
  const degree = inDegree + outDegree;
  
  // Find mutual connections (both follow each other)
  const mutualConnections = edges.filter(e => {
    if (e.source === node.id) {
      return edges.some(e2 => e2.source === e.target && e2.target === node.id);
    }
    return false;
  }).length;

  // Get top connections by edge weight
  const topConnections = connectedEdges
    .map(e => {
      const otherId = e.source === node.id ? e.target : e.source;
      const otherNode = allNodes.find(n => n.id === otherId);
      return {
        id: otherId,
        name: otherNode?.displayName || otherNode?.username || otherId,
        strength: e.weight,
      };
    })
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 5);

  const communityInfo = communityColors[(node.communityId || 0) % communityColors.length];
  const pageRank = node.pageRank || 0;
  const betweenness = node.betweenness || 0;

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0 border-b border-vsg-gray-200 dark:border-vsg-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-vsg-gray-200 dark:bg-vsg-gray-800 flex items-center justify-center">
              <User className="w-6 h-6 text-vsg-gray-400" />
            </div>
            <div>
              <CardTitle className="text-h4">{node.displayName}</CardTitle>
              <p className="text-body-sm text-vsg-gray-500">@{node.username}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto py-4 space-y-6">
        {/* Community badge */}
        <div>
          <p className="text-caption text-vsg-gray-500 uppercase tracking-wider mb-2">
            Community
          </p>
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', communityInfo.bg)} />
            <span className="text-body font-medium text-vsg-gray-900 dark:text-white">
              {communityInfo.name}
            </span>
          </div>
        </div>

        {/* Network metrics */}
        <div>
          <p className="text-caption text-vsg-gray-500 uppercase tracking-wider mb-3">
            Network Metrics
          </p>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              icon={TrendingUp}
              label="Influence"
              value={`${(pageRank * 100).toFixed(0)}%`}
              description="PageRank score"
            />
            <MetricCard
              icon={Zap}
              label="Bridge Score"
              value={`${(betweenness * 100).toFixed(0)}%`}
              description="Betweenness centrality"
            />
            <MetricCard
              icon={Users}
              label="Connections"
              value={degree.toString()}
              description={`${inDegree} in / ${outDegree} out`}
            />
            <MetricCard
              icon={Users}
              label="Mutual"
              value={mutualConnections.toString()}
              description="Mutual connections"
            />
          </div>
        </div>

        {/* Top connections */}
        <div>
          <p className="text-caption text-vsg-gray-500 uppercase tracking-wider mb-3">
            Strongest Connections
          </p>
          <div className="space-y-2">
            {topConnections.length > 0 ? (
              topConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-vsg-gray-50 dark:hover:bg-vsg-gray-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-vsg-gray-200 dark:bg-vsg-gray-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-vsg-gray-400" />
                    </div>
                    <span className="text-body-sm font-medium text-vsg-gray-900 dark:text-white truncate max-w-[120px]">
                      {connection.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-vsg-gray-200 dark:bg-vsg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-vsg-orange-500 rounded-full"
                        style={{ width: `${Math.max(connection.strength * 100, 10)}%` }}
                      />
                    </div>
                    <span className="text-caption text-vsg-gray-500 w-8 text-right">
                      {Math.round(connection.strength * 100)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-body-sm text-vsg-gray-400">No connections found</p>
            )}
          </div>
        </div>

        {/* Node type badge */}
        <div className="pt-4 border-t border-vsg-gray-200 dark:border-vsg-gray-800">
          <span className={cn(
            "inline-block px-2 py-1 rounded text-caption font-medium",
            node.type === 'SELF' 
              ? "bg-vsg-orange-100 text-vsg-orange-700 dark:bg-vsg-orange-900 dark:text-vsg-orange-300"
              : "bg-vsg-gray-100 text-vsg-gray-700 dark:bg-vsg-gray-800 dark:text-vsg-gray-300"
          )}>
            {node.type === 'SELF' ? 'You' : 'Connection'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Metric card component
 */
function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="p-3 rounded-md bg-vsg-gray-50 dark:bg-vsg-gray-800">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-vsg-orange-500" />
        <span className="text-caption text-vsg-gray-500">{label}</span>
      </div>
      <p className="text-h4 font-bold text-vsg-gray-900 dark:text-white">{value}</p>
      <p className="text-caption text-vsg-gray-400 mt-0.5">{description}</p>
    </div>
  );
}

export default NodeDetails;
