/**
 * Modern Card Component
 * Glassmorphism + modern shadow design
 */

import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  animated?: boolean;
  background?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      animated = true,
      background,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantClasses = {
      default: 'bg-white border border-gray-100',
      elevated: 'bg-white shadow-lg border border-gray-100',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-glass',
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100',
    };

    const baseClasses =
      'rounded-xl transition-all duration-300 overflow-hidden';

    const finalClassName = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${className || ''}
    `;

    return (
      <motion.div
        ref={ref}
        className={finalClassName}
        style={{
          background: background,
        }}
        whileHover={
          hoverable && animated
            ? {
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-4px)',
              }
            : undefined
        }
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
