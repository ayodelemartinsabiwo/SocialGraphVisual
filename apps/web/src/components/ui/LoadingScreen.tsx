import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  /** Optional message to display */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show as fullscreen overlay */
  fullScreen?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * LoadingScreen Component
 *
 * Displays a branded loading indicator with the VSG logo animation.
 * Used for route transitions and async data loading.
 */
function LoadingScreen({
  message = 'Loading...',
  size = 'md',
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo/Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            sizeClasses[size],
            'rounded-full border-2 border-vsg-gray-200 dark:border-vsg-gray-700'
          )}
        />
        {/* Spinning arc */}
        <div
          className={cn(
            sizeClasses[size],
            'absolute inset-0 rounded-full border-2 border-transparent border-t-vsg-orange-500',
            'animate-spin'
          )}
        />
        {/* Center dot */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center'
          )}
        >
          <div className="w-2 h-2 rounded-full bg-vsg-orange-500 animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      {message && (
        <p className="text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={cn(
          'fixed inset-0 z-50',
          'flex items-center justify-center',
          'bg-vsg-gray-50 dark:bg-vsg-gray-950',
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={message}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center p-8', className)}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {content}
    </div>
  );
}

export default LoadingScreen;
