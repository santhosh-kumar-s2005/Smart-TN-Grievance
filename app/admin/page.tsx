'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import ComplaintCard from '@/components/ComplaintCard';
import Loader from '@/components/Loader';
import StatCard from '@/components/StatCard';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Filter,
  ArrowUpDown,
  LogOut,
} from 'lucide-react';

type Complaint = {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  district: string;
  userId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt?: any;
  updatedAt?: any;
};

type FilterOptions = {
  priority: 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  sortBy: 'priority' | 'date' | 'status';
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState<FilterOptions>({
    priority: 'ALL',
    status: 'ALL',
    sortBy: 'priority',
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const [categoryBreakdown, setCategoryBreakdown] = useState<{ [k: string]: number }>({});
  const [districtBreakdown, setDistrictBreakdown] = useState<{ [k: string]: number }>({});

  // Route protection and data fetching
  useEffect(() => {
    let unsubscribe: any;

    const checkAdminAndFetch = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`/api/check-role?uid=${currentUser.uid}`);
        if (!res.ok) throw new Error('Failed to check role');

        const data = await res.json();
        if (data.role !== 'ADMIN') {
          setError('Access Denied - Admin only');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        setUser(currentUser);

        // Set up real-time listener for all complaints
        unsubscribe = onSnapshot(
          collection(db, 'complaints'),
          (snapshot) => {
            const list: Complaint[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({ id: docSnap.id, ...data } as Complaint);
            });

            setComplaints(list);
            setLoading(false);

            // Calculate stats
            setStats({
              total: list.length,
              pending: list.filter((c) => c.status === 'PENDING').length,
              inProgress: list.filter((c) => c.status === 'IN_PROGRESS').length,
              resolved: list.filter((c) => c.status === 'RESOLVED').length,
              high: list.filter((c) => c.priority === 'HIGH').length,
              medium: list.filter((c) => c.priority === 'MEDIUM').length,
              low: list.filter((c) => c.priority === 'LOW').length,
            });

            // Category breakdown
            const catBreakdown: { [k: string]: number } = {};
            list.forEach((c) => {
              catBreakdown[c.category] = (catBreakdown[c.category] || 0) + 1;
            });
            setCategoryBreakdown(catBreakdown);

            // District breakdown
            const distBreakdown: { [k: string]: number } = {};
            list.forEach((c) => {
              distBreakdown[c.district] = (distBreakdown[c.district] || 0) + 1;
            });
            setDistrictBreakdown(distBreakdown);
          },
          (err) => {
            console.error('Firestore error:', err);
            if (err.code === 'permission-denied') {
              setError('Permission denied - Check Firestore rules');
            } else {
              setError('Failed to load complaints');
            }
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Setup error:', err);
        setError('Failed to verify admin access');
        setLoading(false);
      }
    };

    checkAdminAndFetch();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...complaints];

    // Apply priority filter
    if (filters.priority !== 'ALL') {
      filtered = filtered.filter((c) => c.priority === filters.priority);
    }

    // Apply status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter((c) => c.status === filters.status);
    }

    // Apply sorting
    if (filters.sortBy === 'priority') {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (filters.sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (filters.sortBy === 'status') {
      const statusOrder = { PENDING: 0, IN_PROGRESS: 1, RESOLVED: 2 };
      filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    setFilteredComplaints(filtered);
  }, [complaints, filters]);

  const handleStatusChange = async (complaint: Complaint, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'complaints', complaint.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar userRole="ADMIN" userName={user?.email?.split('@')[0] || 'Admin'} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all citizen grievances and track resolution progress
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Complaints"
            value={stats.total}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<TrendingUp className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
        </div>

        {/* Priority Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">🔴 High Priority</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.high}</p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">🟡 Medium Priority</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.medium}</p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">🟢 Low Priority</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.low}</p>
          </Card>
        </div>

        {/* Category & District Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          {Object.keys(categoryBreakdown).length > 0 && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Complaints by Category
              </h2>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="inline-flex items-center justify-center min-w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {/* District Breakdown */}
          {Object.keys(districtBreakdown).length > 0 && (
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Complaints by District
              </h2>
              <div className="space-y-3">
                {Object.entries(districtBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([district, count]) => (
                    <div key={district} className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">{district}</span>
                      <span className="inline-flex items-center justify-center min-w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>

        {/* Complaints Table */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Complaints</h2>

            {/* Filter Controls */}
            <div className="flex gap-3 flex-wrap">
              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">🔴 High</option>
                  <option value="MEDIUM">🟡 Medium</option>
                  <option value="LOW">🟢 Low</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-600" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="priority">Sort by Priority</option>
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {complaints.length === 0
                  ? 'No complaints yet'
                  : 'No complaints match the selected filters'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                        {complaint.ticketId}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {complaint.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {complaint.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">{complaint.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">District</p>
                      <p className="font-medium text-gray-900 dark:text-white">{complaint.district}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Status</p>
                      <p className={`font-medium px-2 py-1 rounded text-xs w-fit ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                        Update Status
                      </label>
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint, e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </div>
        </Card>
      </div>
    </div>
  );
}
