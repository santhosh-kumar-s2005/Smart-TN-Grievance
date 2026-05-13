/**
 * UI Utility Functions
 * Priority colors, icons, and status helpers
 */

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  LucideIcon,
} from 'lucide-react';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export const getPriorityColor = (priority: PriorityLevel): string => {
  const colors: Record<PriorityLevel, string> = {
    CRITICAL: 'text-red-600 bg-red-50 border-red-200',
    HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
    MEDIUM: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    LOW: 'text-green-600 bg-green-50 border-green-200',
  };
  return colors[priority];
};

export const getPriorityBgColor = (priority: PriorityLevel): string => {
  const colors: Record<PriorityLevel, string> = {
    CRITICAL: 'bg-red-100',
    HIGH: 'bg-orange-100',
    MEDIUM: 'bg-yellow-100',
    LOW: 'bg-green-100',
  };
  return colors[priority];
};

export const getPriorityIcon = (priority: PriorityLevel): LucideIcon => {
  const icons: Record<PriorityLevel, LucideIcon> = {
    CRITICAL: Flame,
    HIGH: AlertTriangle,
    MEDIUM: AlertCircle,
    LOW: CheckCircle2,
  };
  return icons[priority];
};

export const getPriorityLabel = (priority: PriorityLevel): string => {
  const labels: Record<PriorityLevel, string> = {
    CRITICAL: 'Critical Priority',
    HIGH: 'High Priority',
    MEDIUM: 'Medium Priority',
    LOW: 'Low Priority',
  };
  return labels[priority];
};

export const getStatusBadgeColor = (
  status: 'pending' | 'in-progress' | 'resolved'
): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
  };
  return colors[status];
};

export const getStatusBgColor = (
  status: 'pending' | 'in-progress' | 'resolved'
): string => {
  const colors = {
    pending: 'bg-yellow-100',
    'in-progress': 'bg-blue-100',
    resolved: 'bg-green-100',
  };
  return colors[status];
};

export const getStatusIcon = (
  status: 'pending' | 'in-progress' | 'resolved'
): LucideIcon => {
  const icons = {
    pending: Clock,
    'in-progress': AlertCircle,
    resolved: CheckCircle2,
  };
  return icons[status];
};

export const getStatusLabel = (
  status: 'pending' | 'in-progress' | 'resolved'
): string => {
  const labels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
  };
  return labels[status];
};

export const formatPriority = (score: number): PriorityLevel => {
  if (score >= 70) return 'CRITICAL';
  if (score >= 40) return 'HIGH';
  if (score >= 20) return 'MEDIUM';
  return 'LOW';
};

export const capitalizeText = (text: string): string => {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const truncateText = (text: string, length: number): string => {
  if (text.length > length) {
    return text.slice(0, length) + '...';
  }
  return text;
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return d.toLocaleDateString();
};
