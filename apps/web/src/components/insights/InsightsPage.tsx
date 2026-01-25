import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Users,
  TrendingUp,
  BarChart3,
  Network,
  ArrowRight,
  Share2,
  Download,
  RefreshCw,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useInsights, useRegenerateInsights } from '@/hooks/useInsights';
import { useGraph } from '@/hooks/useGraph';
import type { InsightCategory as SharedInsightCategory, Confidence, ListInsightsResponse } from '@vsg/shared';

/**
 * Summary insight type from the list API
 */
type InsightSummary = ListInsightsResponse['insights'][number];

/**
 * Insight category types for UI (includes 'all')
 */
type InsightCategory = 'network' | 'community' | 'engagement' | 'growth' | 'all';

/**
 * Insight confidence levels (lowercase for UI)
 */
type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Display insight interface (mapped from shared type)
 */
interface DisplayInsight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  confidence: ConfidenceLevel;
  metric?: {
    value: string;
    label: string;
    change?: number;
  };
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Map shared category to local category
 */
function mapCategory(category: SharedInsightCategory): InsightCategory {
  const mapping: Record<SharedInsightCategory, InsightCategory> = {
    NETWORK: 'network',
    COMMUNITY: 'community',
    ENGAGEMENT: 'engagement',
    GROWTH: 'growth',
  };
  return mapping[category] || 'network';
}

/**
 * Map shared confidence to local confidence
 */
function mapConfidence(confidence: Confidence): ConfidenceLevel {
  const mapping: Record<Confidence, ConfidenceLevel> = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
  };
  return mapping[confidence] || 'medium';
}

/**
 * Convert insight summary to DisplayInsight
 */
function mapToDisplayInsight(insight: InsightSummary, graphId?: string): DisplayInsight {
  return {
    id: insight.id,
    category: mapCategory(insight.category),
    title: insight.title,
    description: insight.description,
    confidence: mapConfidence(insight.confidence),
    action: {
      label: 'View Details',
      href: graphId ? `/graph/${graphId}` : '/graph',
    },
  };
}

/**
 * Category configuration
 */
const categories: { value: InsightCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'all', label: 'All Insights', icon: Lightbulb },
  { value: 'network', label: 'Network Structure', icon: Network },
  { value: 'community', label: 'Communities', icon: Users },
  { value: 'engagement', label: 'Engagement', icon: BarChart3 },
  { value: 'growth', label: 'Growth', icon: TrendingUp },
];

/**
 * InsightsPage Component
 *
 * Main insights dashboard showing:
 * - Key metrics summary
 * - Filtered insight cards
 * - Quick actions
 * - Export options
 */
function InsightsPage() {
  const { id: graphId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<InsightCategory>('all');

  // Fetch insights using the hook
  const {
    data: insightsData,
    isLoading: insightsLoading,
    isError: insightsError,
    error: insightsErrorDetails,
  } = useInsights(graphId || null);

  // Fetch graph data for metrics
  const {
    graph,
    isLoading: graphLoading,
    isError: graphError,
  } = useGraph(graphId || null);

  // Regenerate insights mutation
  const regenerateMutation = useRegenerateInsights();

  // Map shared insights to display insights
  const displayInsights = useMemo(() => {
    if (!insightsData?.insights) return [];
    return insightsData.insights.map((insight) => mapToDisplayInsight(insight, graphId));
  }, [insightsData, graphId]);

  // Filter insights by category
  const filteredInsights = useMemo(() => {
    if (activeCategory === 'all') return displayInsights;
    return displayInsights.filter((i) => i.category === activeCategory);
  }, [displayInsights, activeCategory]);

  // Graph stats for metric cards
  const graphStats = {
    totalConnections: graph?.nodes?.length ?? 0,
    communities: graph?.statistics?.communities?.count ?? 0,
    avgInfluence: graph?.statistics?.centrality?.pageRank?.selfPercentile
      ? (graph.statistics.centrality.pageRank.selfPercentile / 100).toFixed(2)
      : '0.00',
    engagementRate: graph?.statistics?.engagement?.activePercentage
      ? `${graph.statistics.engagement.activePercentage.toFixed(1)}%`
      : '0%',
  };

  // Show loading state
  const isLoading = insightsLoading || graphLoading;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vsg-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-body text-vsg-gray-500 dark:text-vsg-gray-400">
            Loading insights...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (insightsError || graphError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-vsg-warning-500 mx-auto mb-4" />
          <h2 className="text-h3 font-semibold text-vsg-gray-900 dark:text-white mb-2">
            Failed to Load Insights
          </h2>
          <p className="text-body text-vsg-gray-500 dark:text-vsg-gray-400 mb-4">
            {insightsErrorDetails?.message || 'An unexpected error occurred'}
          </p>
          <Button variant="primary" onClick={() => navigate('/upload')}>
            Upload New Graph
          </Button>
        </div>
      </div>
    );
  }

  // Show empty state when no graph ID
  if (!graphId) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lightbulb className="w-12 h-12 text-vsg-gray-400 mx-auto mb-4" />
          <h2 className="text-h3 font-semibold text-vsg-gray-900 dark:text-white mb-2">
            No Graph Selected
          </h2>
          <p className="text-body text-vsg-gray-500 dark:text-vsg-gray-400 mb-4">
            Upload your social network data to generate insights.
          </p>
          <Button variant="primary" onClick={() => navigate('/upload')}>
            Upload Data
          </Button>
        </div>
      </div>
    );
  }

  // Handle refresh
  const handleRefresh = () => {
    if (graphId) {
      regenerateMutation.mutate(graphId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
            Network Insights
          </h1>
          <p className="mt-2 text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400">
            AI-free, deterministic insights about your digital network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={regenerateMutation.isPending}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', regenerateMutation.isPending && 'animate-spin')} />
            {regenerateMutation.isPending ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Total Connections"
          value={graphStats.totalConnections.toString()}
          description="Nodes in network"
        />
        <MetricCard
          icon={Network}
          label="Communities"
          value={graphStats.communities.toString()}
          description="Distinct groups"
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg. Influence"
          value={graphStats.avgInfluence}
          description="PageRank score"
        />
        <MetricCard
          icon={BarChart3}
          label="Engagement Rate"
          value={graphStats.engagementRate}
          description="Active connections"
        />
      </div>

      {/* Quick view links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickViewCard
          title="Positioning Map"
          description="See where you stand among peers"
          href="/insights/positioning"
          icon={Users}
        />
        <QuickViewCard
          title="Engagement Circles"
          description="Visualize engagement intensity"
          href="/insights/engagement"
          icon={BarChart3}
        />
        <QuickViewCard
          title="Growth Opportunities"
          description="Discover expansion paths"
          href="/insights/growth"
          icon={TrendingUp}
        />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors',
              activeCategory === value
                ? 'bg-vsg-orange-500 text-white'
                : 'bg-vsg-gray-100 dark:bg-vsg-gray-800 text-vsg-gray-600 dark:text-vsg-gray-400 hover:bg-vsg-gray-200 dark:hover:bg-vsg-gray-700'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Insights list */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* Pro upgrade banner */}
      <Card className="bg-gradient-to-br from-vsg-orange-500 to-vsg-orange-600 text-white border-0">
        <CardContent className="py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-h4 font-semibold mb-1">Unlock Advanced Insights</h3>
              <p className="text-body text-white/90">
                Get historical tracking, multi-platform comparison, and detailed growth analytics with Pro.
              </p>
            </div>
          </div>
          <Button
            className="bg-white text-vsg-orange-600 hover:bg-vsg-gray-100 flex-shrink-0"
            asChild
          >
            <Link to="/pricing">Upgrade to Pro</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Metric card component
 */
function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-vsg-orange-100 dark:bg-vsg-orange-500/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-vsg-orange-500" />
          </div>
          <span className="text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400">
            {label}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
            {value}
          </span>
          {change !== undefined && (
            <span
              className={cn(
                'text-body-sm font-medium',
                change > 0 ? 'text-vsg-success-500' : 'text-vsg-error-500'
              )}
            >
              {change > 0 ? '+' : ''}
              {change}
              {changeLabel && (
                <span className="text-vsg-gray-400 ml-1">{changeLabel}</span>
              )}
            </span>
          )}
          {description && (
            <span className="text-body-sm text-vsg-gray-400">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Quick view card component
 */
function QuickViewCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link to={href}>
      <Card interactive className="h-full">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-vsg-gray-100 dark:bg-vsg-gray-800 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-vsg-gray-600 dark:text-vsg-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-body font-semibold text-vsg-gray-900 dark:text-white mb-0.5">
              {title}
            </h3>
            <p className="text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400 truncate">
              {description}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-vsg-gray-400 flex-shrink-0" />
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Insight card component
 */
function InsightCard({ insight }: { insight: DisplayInsight }) {
  const confidenceConfig = {
    high: {
      icon: CheckCircle2,
      color: 'text-vsg-success-500',
      bg: 'bg-vsg-success-100 dark:bg-vsg-success-500/20',
      label: 'High confidence',
    },
    medium: {
      icon: Info,
      color: 'text-vsg-warning-500',
      bg: 'bg-vsg-warning-100 dark:bg-vsg-warning-500/20',
      label: 'Medium confidence',
    },
    low: {
      icon: AlertTriangle,
      color: 'text-vsg-gray-500',
      bg: 'bg-vsg-gray-100 dark:bg-vsg-gray-800',
      label: 'Low confidence',
    },
  };

  const categoryIcons = {
    network: Network,
    community: Users,
    engagement: BarChart3,
    growth: TrendingUp,
    all: Lightbulb,
  };

  const config = confidenceConfig[insight.confidence];
  const CategoryIcon = categoryIcons[insight.category];
  const ConfidenceIcon = config.icon;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Category icon */}
          <div className="w-12 h-12 rounded-lg bg-vsg-orange-100 dark:bg-vsg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <CategoryIcon className="w-6 h-6 text-vsg-orange-500" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-body-lg font-semibold text-vsg-gray-900 dark:text-white">
                {insight.title}
              </h3>
            </div>

            <p className="text-body text-vsg-gray-600 dark:text-vsg-gray-400 mb-4">
              {insight.description}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Metric */}
              {insight.metric && (
                <div className="flex items-center gap-2">
                  <span className="text-h4 font-bold text-vsg-gray-900 dark:text-white">
                    {insight.metric.value}
                  </span>
                  <span className="text-body-sm text-vsg-gray-500">
                    {insight.metric.label}
                  </span>
                  {insight.metric.change !== undefined && (
                    <span
                      className={cn(
                        'text-body-sm font-medium',
                        insight.metric.change > 0 ? 'text-vsg-success-500' : 'text-vsg-error-500'
                      )}
                    >
                      {insight.metric.change > 0 ? '+' : ''}
                      {insight.metric.change}
                    </span>
                  )}
                </div>
              )}

              {/* Confidence */}
              <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-full', config.bg)}>
                <ConfidenceIcon className={cn('w-3.5 h-3.5', config.color)} />
                <span className={cn('text-caption font-medium', config.color)}>
                  {config.label}
                </span>
              </div>

              {/* Action */}
              {insight.action && (
                <Link
                  to={insight.action.href}
                  className="ml-auto flex items-center gap-1 text-body-sm font-medium text-vsg-orange-500 hover:text-vsg-orange-600 transition-colors"
                >
                  {insight.action.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default InsightsPage;
