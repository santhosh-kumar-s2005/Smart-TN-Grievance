import React from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'indigo' | 'blue' | 'green' | 'red' | 'yellow';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  label,
  value,
  icon,
  color = 'indigo',
  trend,
}: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          {icon && <div className={`${colorClasses[color]} p-3 rounded-lg`}>{icon}</div>}
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-gray-500 text-sm">from last month</span>
          </div>
        )}
      </div>
    </Card>
  );
}
