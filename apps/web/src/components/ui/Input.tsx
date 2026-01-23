import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Input component props
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input size variant */
  inputSize?: 'sm' | 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Left icon/element */
  leftElement?: React.ReactNode;
  /** Right icon/element */
  rightElement?: React.ReactNode;
}

/**
 * Input Component
 *
 * A styled text input following VSG design system.
 *
 * @example
 * <Input placeholder="Enter your email" />
 * <Input inputSize="lg" leftElement={<Search />} />
 * <Input error={true} />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      inputSize = 'md',
      error = false,
      leftElement,
      rightElement,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 text-body-sm px-3',
      md: 'h-10 text-body px-4',
      lg: 'h-12 text-body-lg px-4',
    };

    const hasLeftElement = !!leftElement;
    const hasRightElement = !!rightElement;

    const inputClasses = cn(
      'w-full rounded-md border bg-white dark:bg-vsg-gray-900',
      'transition-colors duration-fast',
      'placeholder:text-vsg-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      sizeClasses[inputSize],
      hasLeftElement && 'pl-10',
      hasRightElement && 'pr-10',
      error
        ? 'border-vsg-error-500 focus:border-vsg-error-500 focus:ring-vsg-error-500/30'
        : 'border-vsg-gray-200 dark:border-vsg-gray-800 focus:border-vsg-orange-500 focus:ring-vsg-orange-500/30',
      disabled && 'opacity-50 cursor-not-allowed bg-vsg-gray-50 dark:bg-vsg-gray-800',
      className
    );

    if (hasLeftElement || hasRightElement) {
      return (
        <div className="relative">
          {hasLeftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-vsg-gray-400">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            {...props}
          />
          {hasRightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-vsg-gray-400">
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
export type { InputProps };
