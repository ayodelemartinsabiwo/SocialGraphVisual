import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Progress component props
 */
interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Show percentage label */
  showLabel?: boolean;
  /** Indeterminate loading state */
  indeterminate?: boolean;
}

/**
 * Progress Component
 *
 * A progress bar indicator.
 *
 * @example
 * <Progress value={50} />
 * <Progress value={75} variant="success" showLabel />
 * <Progress indeterminate />
 */
function Progress({
  className,
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  indeterminate = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-vsg-orange-500',
    success: 'bg-vsg-success-500',
    warning: 'bg-vsg-warning-500',
    error: 'bg-vsg-error-500',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-body-sm text-vsg-gray-600 dark:text-vsg-gray-400">
            Progress
          </span>
          <span className="text-body-sm font-medium text-vsg-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-vsg-gray-200 dark:bg-vsg-gray-800 overflow-hidden',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant],
            indeterminate && 'animate-progress-indeterminate w-1/3'
          )}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Circular Progress Component
 */
interface CircularProgressProps {
  /** Current value (0-100) */
  value: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Show percentage label */
  showLabel?: boolean;
  /** Additional class names */
  className?: string;
}

function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  variant = 'default',
  showLabel = false,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    default: 'stroke-vsg-orange-500',
    success: 'stroke-vsg-success-500',
    warning: 'stroke-vsg-warning-500',
    error: 'stroke-vsg-error-500',
  };

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-vsg-gray-200 dark:stroke-vsg-gray-800"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(variantColors[variant], 'transition-all duration-300 ease-out')}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-body-sm font-medium text-vsg-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export { Progress, CircularProgress };
export type { ProgressProps, CircularProgressProps };
