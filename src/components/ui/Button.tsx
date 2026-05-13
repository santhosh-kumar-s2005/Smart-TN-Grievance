/**
 * Modern Button Component
 * Multiple variants: primary, secondary, ghost, danger, success
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      animated = true,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/50',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
      md: 'px-4 py-2 text-base font-medium rounded-lg',
      lg: 'px-6 py-3 text-lg font-semibold rounded-lg',
    };

    const baseClasses =
      'inline-flex items-center justify-center gap-2 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

    const finalClassName = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className || ''}
    `;

    return (
      <motion.button
        ref={ref}
        className={finalClassName}
        disabled={disabled || isLoading}
        whileHover={!disabled && animated ? { scale: 1.02 } : undefined}
        whileTap={!disabled && animated ? { scale: 0.98 } : undefined}
        {...props}
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
