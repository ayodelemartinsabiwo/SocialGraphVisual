import { Link, useLocation } from 'react-router-dom';
import {
  Upload,
  Network,
  Lightbulb,
  Settings,
  HelpCircle,
  BarChart3,
  Users,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Sidebar navigation item type
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

/**
 * Navigation sections
 */
const mainNavItems: NavItem[] = [
  { label: 'Upload Data', href: '/upload', icon: Upload },
  { label: 'Network Graph', href: '/graph', icon: Network },
  { label: 'Insights', href: '/insights', icon: Lightbulb },
];

const viewNavItems: NavItem[] = [
  { label: 'Positioning Map', href: '/insights/positioning', icon: Users },
  { label: 'Engagement Circles', href: '/insights/engagement', icon: BarChart3 },
  { label: 'Growth Opportunities', href: '/insights/growth', icon: TrendingUp },
];

const bottomNavItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help & Support', href: '/help', icon: HelpCircle },
];

/**
 * Sidebar Component
 *
 * Left navigation sidebar with:
 * - Main navigation links
 * - View-specific shortcuts
 * - Settings and help
 * - Hidden on mobile, visible on desktop (lg+)
 */
function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0',
        'w-64 overflow-y-auto',
        'bg-white dark:bg-vsg-gray-900',
        'border-r border-vsg-gray-200 dark:border-vsg-gray-800',
        'hidden lg:block',
        'transition-transform duration-normal ease-out'
      )}
    >
      <div className="flex flex-col h-full py-4">
        {/* Main Navigation */}
        <nav className="px-3 space-y-1">
          <p className="px-3 py-2 text-caption font-medium text-vsg-gray-500 dark:text-vsg-gray-400 uppercase tracking-wider">
            Main
          </p>
          {mainNavItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={location.pathname === item.href || location.pathname.startsWith(item.href + '/')}
            />
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 mx-3 border-t border-vsg-gray-200 dark:border-vsg-gray-800" />

        {/* Insight Views */}
        <nav className="px-3 space-y-1">
          <p className="px-3 py-2 text-caption font-medium text-vsg-gray-500 dark:text-vsg-gray-400 uppercase tracking-wider">
            Views
          </p>
          {viewNavItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Navigation */}
        <nav className="px-3 space-y-1 mt-auto">
          <div className="my-4 mx-0 border-t border-vsg-gray-200 dark:border-vsg-gray-800" />
          {bottomNavItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>

        {/* Pro upgrade banner */}
        <div className="mx-3 mt-4 p-4 rounded-md bg-gradient-to-br from-vsg-orange-500 to-vsg-orange-600 text-white">
          <p className="font-semibold text-body-sm">Upgrade to Pro</p>
          <p className="text-caption opacity-90 mt-1">
            Unlock all platforms, advanced insights, and exports.
          </p>
          <Link
            to="/pricing"
            className="inline-block mt-3 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-caption font-medium transition-colors"
          >
            Learn more
          </Link>
        </div>
      </div>
    </aside>
  );
}

/**
 * Sidebar link component
 */
function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-sm',
        'text-body-sm font-medium',
        'transition-all duration-fast',
        isActive
          ? 'text-vsg-orange-500 bg-vsg-orange-50 dark:bg-vsg-orange-500/10'
          : 'text-vsg-gray-700 dark:text-vsg-gray-300 hover:text-vsg-gray-900 dark:hover:text-white hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-vsg-orange-500')} />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="px-2 py-0.5 text-caption font-medium bg-vsg-orange-100 dark:bg-vsg-orange-500/20 text-vsg-orange-600 dark:text-vsg-orange-400 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export default Sidebar;
