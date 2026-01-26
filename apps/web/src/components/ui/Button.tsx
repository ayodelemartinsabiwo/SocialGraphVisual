import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';

/**
 * Button size types
 */
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

/**
 * Button component props
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Shows loading spinner and disables interaction */
  isLoading?: boolean;
  /** Icon to show before text */
  leftIcon?: ReactNode;
  /** Icon to show after text */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Button content */
  children?: ReactNode;
  /** Render as child component (for composing with Link, etc.) */
  asChild?: boolean;
}

/**
 * Variant styles mapping
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-vsg-orange-600 text-white
    hover:bg-vsg-orange-700
    active:bg-vsg-orange-800
    focus-visible:ring-vsg-orange-600
    disabled:bg-vsg-gray-300 disabled:text-vsg-gray-500
  `,
  secondary: `
    bg-vsg-gray-100 text-vsg-gray-900
    hover:bg-vsg-gray-200
    active:bg-vsg-gray-300
    focus-visible:ring-vsg-gray-400
    dark:bg-vsg-gray-800 dark:text-vsg-gray-100
    dark:hover:bg-vsg-gray-700
    disabled:bg-vsg-gray-100 disabled:text-vsg-gray-400
  `,
  outline: `
    border-2 border-vsg-gray-300 bg-transparent text-vsg-gray-900
    hover:bg-vsg-gray-50 hover:border-vsg-gray-400
    active:bg-vsg-gray-100
    focus-visible:ring-vsg-gray-400
    dark:border-vsg-gray-600 dark:text-vsg-gray-100
    dark:hover:bg-vsg-gray-800 dark:hover:border-vsg-gray-500
    disabled:border-vsg-gray-200 disabled:text-vsg-gray-400
  `,
  ghost: `
    bg-transparent text-vsg-gray-900
    hover:bg-vsg-gray-100
    active:bg-vsg-gray-200
    focus-visible:ring-vsg-gray-400
    dark:text-vsg-gray-100
    dark:hover:bg-vsg-gray-800
    disabled:text-vsg-gray-400
  `,
  link: `
    bg-transparent text-vsg-orange-700 underline-offset-4
    hover:underline hover:text-vsg-orange-800
    active:text-vsg-orange-900
    focus-visible:ring-vsg-orange-700
    disabled:text-vsg-gray-400 disabled:no-underline
  `,
  destructive: `
    bg-vsg-error-500 text-white
    hover:bg-vsg-error-600
    active:bg-vsg-error-600
    focus-visible:ring-vsg-error-500
    disabled:bg-vsg-gray-300 disabled:text-vsg-gray-500
  `,
};

/**
 * Size styles mapping
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-body-sm gap-1.5 rounded-sm',
  md: 'h-10 px-4 text-body gap-2 rounded-sm',
  lg: 'h-12 px-6 text-body-lg gap-2.5 rounded-md',
  icon: 'h-10 w-10 rounded-sm',
};

/**
 * Button Component
 *
 * A versatile button component with multiple variants and sizes.
 * Supports loading state, icons, and full width mode.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * // With loading state
 * <Button isLoading>Submitting...</Button>
 *
 * // With icons
 * <Button leftIcon={<Plus />}>Add Item</Button>
 *
 * // Icon only
 * <Button variant="ghost" size="icon" aria-label="Settings">
 *   <Settings />
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const Comp = asChild ? Slot : 'button';

    const buttonClasses = cn(
      // Base styles
      'inline-flex items-center justify-center',
      'font-semibold whitespace-nowrap',
      'transition-all duration-fast ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-60',
      // Variant styles
      variantStyles[variant],
      // Size styles
      sizeStyles[size],
      // Full width
      fullWidth && 'w-full',
      // Custom className
      className
    );

    // When asChild is true, render without internal structure
    if (asChild) {
      return (
        <Comp ref={ref} className={buttonClasses} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}

        {/* Left icon (hidden when loading) */}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button text */}
        {children && <span>{children}</span>}

        {/* Right icon */}
        {rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
