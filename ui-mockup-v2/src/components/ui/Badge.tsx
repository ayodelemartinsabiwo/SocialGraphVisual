import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'border-transparent bg-vsg-primary text-white hover:bg-vsg-primary/80',
        secondary: 'border-transparent bg-vsg-neutral-100 text-vsg-neutral-900 hover:bg-vsg-neutral-100/80',
        outline: 'text-vsg-neutral-900 border-vsg-neutral-200',
        destructive: 'border-transparent bg-vsg-error text-white hover:bg-vsg-error/80',
        success: 'border-transparent bg-vsg-success text-white hover:bg-vsg-success/80',
        warning: 'border-transparent bg-vsg-warning text-white hover:bg-vsg-warning/80',
    };

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-vsg-neutral-950 focus:ring-offset-2 dark:border-vsg-neutral-800 dark:focus:ring-vsg-neutral-300',
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
