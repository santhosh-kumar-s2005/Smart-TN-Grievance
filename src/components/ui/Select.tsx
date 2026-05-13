/**
 * Select Component
 * Modern dropdown with animations
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      label,
      placeholder = 'Select an option...',
      error,
      disabled = false,
      clearable = true,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div ref={ref} className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div ref={containerRef} className="relative">
          <motion.button
            className={`
              w-full px-4 py-2.5 bg-white border rounded-lg font-medium 
              text-left transition-all duration-200 flex items-center justify-between
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
            `}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span className="flex items-center gap-2">
              {selectedOption?.icon && <>{selectedOption.icon}</>}
              <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                {selectedOption?.label || placeholder}
              </span>
            </span>

            <div className="flex items-center gap-2">
              {selectedOption && clearable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange?.(null as any);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="max-h-60 overflow-y-auto">
                  {options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      className={`
                        w-full px-4 py-3 text-left flex items-center gap-2 font-medium
                        transition-colors duration-150 border-b border-gray-100
                        hover:bg-blue-50 ${
                          value === option.value
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-gray-700'
                        }
                      `}
                      onClick={() => {
                        onChange?.(option.value);
                        setIsOpen(false);
                      }}
                      whileHover={{ x: 4 }}
                    >
                      {option.icon && <>{option.icon}</>}
                      <span>{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.p
            className="text-xs font-medium mt-2 text-red-600"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
