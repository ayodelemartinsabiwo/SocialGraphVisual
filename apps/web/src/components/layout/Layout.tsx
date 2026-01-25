import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

/**
 * Layout Component
 *
 * Main application layout with:
 * - Fixed header at top
 * - Collapsible sidebar on left (desktop)
 * - Main content area with proper spacing
 * - Mobile-responsive design
 */
function Layout() {
  return (
    <div className="min-h-screen bg-vsg-gray-50 dark:bg-vsg-gray-950">
      {/* Fixed Header */}
      <Header />

      {/* Main container with sidebar and content */}
      <div className="flex pt-16">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <Sidebar />

        {/* Main content area */}
        <main
          className={cn(
            'flex-1 min-h-[calc(100vh-4rem)]',
            'px-4 py-6 md:px-6 lg:px-8',
            'lg:ml-64', // Offset for sidebar on desktop
            'transition-all duration-normal ease-out'
          )}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
