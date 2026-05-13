/**
 * Modern Badge Component
 * For priorities, statuses, tags
 */

import React from 'react';
import { motion } from 'framer-motion';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'critical' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  animated?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      animated = true,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 border border-gray-300',
      critical: 'bg-red-100 text-red-800 border border-red-300',
      high: 'bg-orange-100 text-orange-800 border border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      low: 'bg-green-100 text-green-800 border border-green-300',
      success: 'bg-green-100 text-green-800 border border-green-300',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      danger: 'bg-red-100 text-red-800 border border-red-300',
      info: 'bg-blue-100 text-blue-800 border border-blue-300',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs font-semibold rounded-md',
      md: 'px-3 py-1.5 text-sm font-semibold rounded-lg',
      lg: 'px-4 py-2 text-base font-semibold rounded-lg',
    };

    const baseClasses =
      'inline-flex items-center gap-1.5 font-medium transition-all duration-200';

    const finalClassName = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className || ''}
    `;

    return (
      <motion.span
        ref={ref}
        className={finalClassName}
        whileHover={animated ? { scale: 1.05 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
