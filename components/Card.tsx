import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 ${
        hoverable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
