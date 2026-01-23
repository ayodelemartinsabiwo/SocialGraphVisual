import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

/**
 * Header Component
 *
 * Fixed navigation header with:
 * - Logo and branding
 * - Theme toggle
 * - User menu (when authenticated)
 * - Mobile menu toggle
 */
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const location = useLocation();

  // Mock auth state - will be replaced with real auth
  const isAuthenticated = false;
  const user = null;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-fixed',
        'h-16 px-4 md:px-6',
        'bg-white/80 dark:bg-vsg-gray-900/80',
        'backdrop-blur-md',
        'border-b border-vsg-gray-200 dark:border-vsg-gray-800'
      )}
    >
      <div className="flex h-full items-center justify-between max-w-7xl mx-auto lg:max-w-none">
        {/* Left section: Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-vsg-gray-900 dark:text-white"
          >
            {/* Logo icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vsg-orange-500 to-vsg-orange-600 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5 text-white"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <circle cx="6" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
                <line x1="9" y1="9" x2="7.5" y2="7.5" />
                <line x1="15" y1="9" x2="16.5" y2="7.5" />
                <line x1="9" y1="15" x2="7.5" y2="16.5" />
                <line x1="15" y1="15" x2="16.5" y2="16.5" />
              </svg>
            </div>
            <span className="font-semibold text-body-lg hidden sm:block">
              Visual Social Graph
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/upload" current={location.pathname}>
              Upload
            </NavLink>
            <NavLink to="/graph" current={location.pathname}>
              Graph
            </NavLink>
            <NavLink to="/insights" current={location.pathname}>
              Insights
            </NavLink>
          </nav>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* User menu or Sign in */}
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div
                  className={cn(
                    'absolute right-0 top-full mt-2 w-48',
                    'bg-white dark:bg-vsg-gray-900',
                    'border border-vsg-gray-200 dark:border-vsg-gray-800',
                    'rounded-md shadow-lg',
                    'py-1'
                  )}
                >
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-body-sm hover:bg-vsg-gray-50 dark:hover:bg-vsg-gray-800"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-body-sm hover:bg-vsg-gray-50 dark:hover:bg-vsg-gray-800 w-full text-left text-vsg-error-500"
                    onClick={() => {
                      setUserMenuOpen(false);
                      // Handle logout
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="primary" size="sm" asChild>
              <Link to="/upload">Get Started</Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 md:hidden',
            'bg-white dark:bg-vsg-gray-900',
            'border-b border-vsg-gray-200 dark:border-vsg-gray-800',
            'shadow-lg'
          )}
        >
          <nav className="flex flex-col p-4 gap-1">
            <MobileNavLink
              to="/upload"
              current={location.pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload
            </MobileNavLink>
            <MobileNavLink
              to="/graph"
              current={location.pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Graph
            </MobileNavLink>
            <MobileNavLink
              to="/insights"
              current={location.pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              Insights
            </MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * Desktop navigation link
 */
function NavLink({
  to,
  current,
  children,
}: {
  to: string;
  current: string;
  children: React.ReactNode;
}) {
  const isActive = current.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        'px-3 py-2 rounded-sm text-body-sm font-medium',
        'transition-colors duration-fast',
        isActive
          ? 'text-vsg-orange-500 bg-vsg-orange-50 dark:bg-vsg-orange-500/10'
          : 'text-vsg-gray-600 dark:text-vsg-gray-400 hover:text-vsg-gray-900 dark:hover:text-white hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800'
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Mobile navigation link
 */
function MobileNavLink({
  to,
  current,
  onClick,
  children,
}: {
  to: string;
  current: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isActive = current.startsWith(to);

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'px-4 py-3 rounded-sm text-body font-medium',
        'transition-colors duration-fast',
        isActive
          ? 'text-vsg-orange-500 bg-vsg-orange-50 dark:bg-vsg-orange-500/10'
          : 'text-vsg-gray-600 dark:text-vsg-gray-400 hover:text-vsg-gray-900 dark:hover:text-white hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800'
      )}
    >
      {children}
    </Link>
  );
}

export default Header;
