import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge variants
 */
type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';

/**
 * Badge component props
 */
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Badge Component
 *
 * A small status indicator or label.
 *
 * @example
 * <Badge>Default</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="sm">Error</Badge>
 */
function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-vsg-gray-100 dark:bg-vsg-gray-800 text-vsg-gray-700 dark:text-vsg-gray-300',
    primary: 'bg-vsg-orange-100 dark:bg-vsg-orange-500/20 text-vsg-orange-600 dark:text-vsg-orange-400',
    secondary: 'bg-vsg-gray-200 dark:bg-vsg-gray-700 text-vsg-gray-800 dark:text-vsg-gray-200',
    success: 'bg-vsg-success-100 dark:bg-vsg-success-500/20 text-vsg-success-600 dark:text-vsg-success-400',
    warning: 'bg-vsg-warning-100 dark:bg-vsg-warning-500/20 text-vsg-warning-600 dark:text-vsg-warning-400',
    error: 'bg-vsg-error-100 dark:bg-vsg-error-500/20 text-vsg-error-600 dark:text-vsg-error-400',
    outline: 'border border-vsg-gray-200 dark:border-vsg-gray-700 text-vsg-gray-700 dark:text-vsg-gray-300',
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-caption',
    md: 'px-2 py-0.5 text-caption',
    lg: 'px-2.5 py-1 text-body-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
