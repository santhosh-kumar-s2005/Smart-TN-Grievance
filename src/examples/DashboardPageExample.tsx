/**
 * Modern Dashboard Example Page
 * Demonstrates AppLayout, Cards, Badges, and animations
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { AppLayout } from '@/components/layouts';
import { Card, Badge, Button } from '@/components/ui';
import {
  containerVariants,
  itemVariants,
} from '@/animations/variants';
import {
  getPriorityColor,
  getPriorityIcon,
  getTimeAgo,
} from '@/utils/ui-helpers';
import { theme } from '@/theme';

interface ComplaintStats {
  total: number;
  critical: number;
  resolved: number;
  pending: number;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: Date;
  category: string;
}

// Mock data - replace with real API calls
const mockStats: ComplaintStats = {
  total: 156,
  critical: 12,
  resolved: 89,
  pending: 55,
};

const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing accidents near intersection',
    priority: 'HIGH',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Road Infrastructure',
  },
  {
    id: '2',
    title: 'Water pipeline leak',
    description: 'Water wastage from broken pipeline',
    priority: 'CRITICAL',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    category: 'Water Supply',
  },
  {
    id: '3',
    title: 'Street light malfunction',
    description: 'Street light not working for 2 weeks',
    priority: 'MEDIUM',
    status: 'resolved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: 'Utilities',
  },
];

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <motion.div variants={itemVariants}>
    <Card
      variant="elevated"
      padding="lg"
      hoverable
      className="bg-gradient-to-br from-white to-gray-50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} opacity-10`}>{icon}</div>
      </div>
    </Card>
  </motion.div>
);

export default function DashboardPage() {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const PriorityIcon = getPriorityIcon(selectedPriority as any);
  const priorityColor = getPriorityColor(selectedPriority as any);

  return (
    <AppLayout
      userName="John Administrator"
      userEmail="john@example.com"
      userRole="admin"
      notificationCount={3}
    >
      {/* Page Title */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your grievance overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          title="Total Complaints"
          value={mockStats.total}
          icon={<BarChart3 className="w-6 h-6" />}
          color="text-blue-600"
        />
        <StatCard
          title="Critical Priority"
          value={mockStats.critical}
          icon={<AlertCircle className="w-6 h-6" />}
          color="text-red-600"
        />
        <StatCard
          title="Resolved"
          value={mockStats.resolved}
          icon={<CheckCircle2 className="w-6 h-6" />}
          color="text-green-600"
        />
        <StatCard
          title="Pending"
          value={mockStats.pending}
          icon={<Clock className="w-6 h-6" />}
          color="text-orange-600"
        />
      </motion.div>

      {/* Recent Complaints */}
      <motion.div
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Complaints
          </h2>
          <Button variant="primary" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {mockComplaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              variants={itemVariants}
            >
              <Card
                variant="default"
                padding="md"
                hoverable
                className="bg-white hover:border-blue-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {complaint.title}
                      </h3>
                      <Badge
                        variant={complaint.priority.toLowerCase()}
                        size="sm"
                        icon={<PriorityIcon className="w-3 h-3" />}
                      >
                        {complaint.priority}
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {complaint.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{complaint.category}</span>
                      <span>•</span>
                      <span>{getTimeAgo(complaint.createdAt)}</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      complaint.status === 'resolved'
                        ? 'success'
                        : complaint.status === 'in-progress'
                          ? 'info'
                          : 'warning'
                    }
                    size="sm"
                  >
                    {complaint.status === 'in-progress'
                      ? 'In Progress'
                      : complaint.status.charAt(0).toUpperCase() +
                        complaint.status.slice(1)}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts Section (Placeholder) */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Priority Distribution
            </h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-gray-500">
            Chart Placeholder - Integrate Chart.js or Recharts
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Status Breakdown
            </h3>
            <BarChart3 className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center text-gray-500">
            Chart Placeholder - Integrate Chart.js or Recharts
          </div>
        </Card>
      </motion.div>
    </AppLayout>
  );
}
