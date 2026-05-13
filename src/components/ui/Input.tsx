/**
 * Modern Input Component
 * With validation feedback and icons
 */

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animated?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      animated = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-4 py-2.5 bg-white border transition-all duration-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-0';

    const borderClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : success
        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    const finalClassName = `
      ${baseClasses}
      ${borderClasses}
      ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon || error || success ? 'pr-10' : ''}
      ${className || ''}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}

        <motion.div
          className="relative"
          animate={animated ? { y: error ? -2 : 0 } : undefined}
          transition={{ duration: 0.2 }}
        >
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={finalClassName}
            disabled={disabled}
            {...props}
          />

          {error && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          )}

          {success && !error && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
          )}

          {rightIcon && !error && !success && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </motion.div>

        {(error || helperText) && (
          <motion.p
            className={`text-xs font-medium mt-2 ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
