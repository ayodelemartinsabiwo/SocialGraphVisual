import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * NotFoundPage Component
 *
 * 404 error page with:
 * - Friendly message
 * - Navigation options
 * - Brand-consistent styling
 */
function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Illustration */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          {/* Background circles */}
          <div className="absolute inset-0 bg-vsg-orange-100 dark:bg-vsg-orange-500/10 rounded-full" />
          <div className="absolute inset-4 bg-vsg-orange-200 dark:bg-vsg-orange-500/20 rounded-full" />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-display font-bold text-vsg-orange-500">404</span>
            </div>
          </div>

          {/* Decorative nodes */}
          <div className="absolute top-2 right-2 w-4 h-4 bg-vsg-community-blue rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-2 w-3 h-3 bg-vsg-community-purple rounded-full animate-pulse delay-100" />
          <div className="absolute top-1/3 left-0 w-2 h-2 bg-vsg-community-green rounded-full animate-pulse delay-200" />
        </div>

        {/* Message */}
        <h1 className="text-h2 font-bold text-vsg-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Go to Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400">
          Looking for something specific?{' '}
          <Link
            to="/help"
            className="text-vsg-orange-500 hover:text-vsg-orange-600 font-medium"
          >
            Visit our Help Center
          </Link>
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
