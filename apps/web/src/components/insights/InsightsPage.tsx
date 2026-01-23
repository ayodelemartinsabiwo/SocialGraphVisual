import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

/**
 * Insight category types
 */
type InsightCategory = 'network' | 'community' | 'engagement' | 'growth' | 'all';

/**
 * Insight confidence levels
 */
type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Insight interface
 */
interface Insight {
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
 * Mock insights data
 */
const mockInsights: Insight[] = [
  {
    id: '1',
    category: 'community',
    title: 'You have 5 distinct communities in your network',
    description:
      'Your network naturally divides into 5 communities: Tech & Innovation (45), Creative Arts (38), Business & Finance (52), Lifestyle (31), and Entertainment (28). The Tech community has the strongest internal connections.',
    confidence: 'high',
    metric: {
      value: '5',
      label: 'Communities',
    },
    action: {
      label: 'View Communities',
      href: '/insights/positioning',
    },
  },
  {
    id: '2',
    category: 'network',
    title: '12 accounts bridge your communities together',
    description:
      'These "bridge" accounts connect different parts of your network. They have high betweenness centrality, meaning they\'re essential for information flow. Losing connection with them could fragment your network.',
    confidence: 'high',
    metric: {
      value: '12',
      label: 'Bridge Accounts',
      change: 2,
    },
    action: {
      label: 'View Bridges',
      href: '/graph',
    },
  },
  {
    id: '3',
    category: 'engagement',
    title: 'Your top 10% of connections drive 67% of your engagement',
    description:
      'A small group of 25 accounts generates most of your engagement. Consider nurturing these relationships while also diversifying your engagement sources to reduce dependency.',
    confidence: 'medium',
    metric: {
      value: '67%',
      label: 'Engagement from Top 10%',
    },
    action: {
      label: 'View Top Connections',
      href: '/insights/engagement',
    },
  },
  {
    id: '4',
    category: 'growth',
    title: 'Weak ties in Business & Finance offer growth opportunities',
    description:
      'You have 8 weak connections in the Business & Finance community that could unlock access to 150+ new connections. These are accounts you interact with rarely but who have large networks.',
    confidence: 'medium',
    metric: {
      value: '8',
      label: 'Growth Opportunities',
    },
    action: {
      label: 'View Opportunities',
      href: '/insights/growth',
    },
  },
  {
    id: '5',
    category: 'network',
    title: 'Your network shows moderate echo chamber characteristics',
    description:
      '72% of your connections share similar interests (homophily index: 0.72). While this creates strong bonds, consider expanding into adjacent interest areas for diverse perspectives.',
    confidence: 'high',
    metric: {
      value: '72%',
      label: 'Homophily',
    },
  },
  {
    id: '6',
    category: 'engagement',
    title: '34 dormant relationships detected',
    description:
      'You haven\'t interacted with 34 connections in the past 90 days. These accounts still follow you but engagement has dropped significantly. Consider re-engaging or evaluating their relevance.',
    confidence: 'low',
    metric: {
      value: '34',
      label: 'Dormant Connections',
    },
  },
];

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
  const [activeCategory, setActiveCategory] = useState<InsightCategory>('all');

  const filteredInsights =
    activeCategory === 'all'
      ? mockInsights
      : mockInsights.filter((i) => i.category === activeCategory);

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
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
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
          value="247"
          change={12}
          changeLabel="vs. last month"
        />
        <MetricCard
          icon={Network}
          label="Communities"
          value="5"
          description="Distinct groups"
        />
        <MetricCard
          icon={TrendingUp}
          label="Avg. Influence"
          value="0.42"
          description="PageRank score"
        />
        <MetricCard
          icon={BarChart3}
          label="Engagement Rate"
          value="8.2%"
          change={-0.5}
          changeLabel="vs. last month"
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
function InsightCard({ insight }: { insight: Insight }) {
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
