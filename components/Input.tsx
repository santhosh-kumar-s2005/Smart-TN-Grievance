import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200
          border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
}
