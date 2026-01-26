import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Network } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useThemeStore } from '@/stores/themeStore';
import { cn } from '@/lib/utils';

/**
 * LandingHeader Component
 *
 * Sticky navigation header for the landing page with:
 * - Logo and branding
 * - Navigation links (Features, How It Works, Pricing)
 * - Theme toggle
 * - Primary CTA button
 * - Mobile hamburger menu
 *
 * Per VSG_UI_LAYOUT_SPECIFICATION.md Section 2.1:
 * - Desktop: 72px height, logo + nav links + CTA
 * - Mobile: 56px height, logo + theme toggle + hamburger
 */
function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme, toggleTheme } = useThemeStore();

  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'h-[72px] md:h-[72px] h-[56px]',
          'px-4 md:px-6 lg:px-8',
          'bg-white dark:bg-vsg-gray-900',
          'border-b border-vsg-gray-200 dark:border-vsg-gray-700',
          'transition-shadow duration-200',
          isScrolled && 'shadow-md'
        )}
      >
        <div className="flex h-full items-center justify-between max-w-7xl mx-auto">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-vsg-gray-900 dark:text-white"
          >
            {/* Logo icon - 32x32 desktop, 24x24 mobile */}
            <div className="w-8 h-8 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-vsg-orange-500 to-vsg-orange-600 flex items-center justify-center">
              <Network className="w-5 h-5 md:w-5 md:h-5 text-white" />
            </div>
            {/* Full text on desktop, abbreviated on mobile */}
            <span className="font-semibold text-xl hidden sm:block">
              Visual Social Graph
            </span>
            <span className="font-semibold text-lg sm:hidden">VSG</span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="w-10 h-10"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop CTA */}
            <Button
              variant="primary"
              size="sm"
              asChild
              className="hidden md:inline-flex"
            >
              <Link to="/upload" className="text-white">
                Get Started
              </Link>
            </Button>

            {/* Mobile hamburger menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden w-10 h-10"
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
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in menu */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-64 md:hidden',
          'bg-white dark:bg-vsg-gray-900',
          'border-l border-vsg-gray-200 dark:border-vsg-gray-700',
          'transform transition-transform duration-300 ease-out',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col p-4 gap-2">
          <MobileNavLink
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </MobileNavLink>
          <MobileNavLink
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
          >
            How It Works
          </MobileNavLink>
          <MobileNavLink
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </MobileNavLink>

          {/* CTA Button */}
          <div className="mt-4 pt-4 border-t border-vsg-gray-200 dark:border-vsg-gray-700">
            <Button
              variant="primary"
              size="lg"
              asChild
              className="w-full"
            >
              <Link
                to="/upload"
                className="text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}

/**
 * Desktop navigation link (anchor)
 */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        'text-body font-medium',
        'text-vsg-gray-700 dark:text-vsg-gray-300',
        'hover:text-vsg-orange-500 dark:hover:text-vsg-orange-400',
        'transition-colors duration-fast',
        'relative',
        'after:absolute after:bottom-0 after:left-0 after:right-0',
        'after:h-0.5 after:bg-vsg-orange-500',
        'after:scale-x-0 hover:after:scale-x-100',
        'after:transition-transform after:duration-200'
      )}
    >
      {children}
    </a>
  );
}

/**
 * Mobile navigation link (anchor)
 */
function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'px-4 py-3 rounded-md',
        'text-body font-medium',
        'text-vsg-gray-700 dark:text-vsg-gray-300',
        'hover:text-vsg-orange-500 dark:hover:text-vsg-orange-400',
        'hover:bg-vsg-gray-100 dark:hover:bg-vsg-gray-800',
        'transition-colors duration-fast'
      )}
    >
      {children}
    </a>
  );
}

export default LandingHeader;
