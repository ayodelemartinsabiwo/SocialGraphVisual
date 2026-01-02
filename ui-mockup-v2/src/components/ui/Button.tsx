import * as React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-vsg-primary text-white hover:bg-vsg-orange-600 active:bg-vsg-orange-700 shadow-sm',
            secondary: 'bg-vsg-neutral-100 text-vsg-neutral-900 hover:bg-vsg-neutral-200 active:bg-vsg-neutral-300',
            outline: 'border-2 border-vsg-neutral-200 bg-transparent hover:bg-vsg-neutral-50 text-vsg-neutral-700',
            ghost: 'bg-transparent hover:bg-vsg-neutral-100 text-vsg-neutral-700',
            link: 'text-vsg-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto',
            destructive: 'bg-vsg-error text-white hover:bg-red-600',
        };

        const sizes = {
            sm: 'h-9 px-3 text-sm',
            md: 'h-11 px-5 text-base',
            lg: 'h-14 px-8 text-lg',
            icon: 'h-11 w-11 p-0',
        };

        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vsg-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button };
