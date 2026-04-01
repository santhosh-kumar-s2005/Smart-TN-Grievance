'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  writeBatch,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import StatCard from '@/components/StatCard';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';

type Complaint = {
  id: string;
  ticketId: string;
  description: string;
  department: string;
  location: string;
  status: string;
  priority: string;
  impactScore: number;
  duplicateCount: number;
  createdAt?: any;
  updatedAt?: any;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    highPriority: 0,
  });

  const [deptLoad, setDeptLoad] = useState<{ [k: string]: number }>({});

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

        // Set up real-time listener
        unsubscribe = onSnapshot(
          collection(db, 'complaints'),
          (snapshot) => {
            const list: Complaint[] = [];
            snapshot.forEach((docSnap) => {
              const d = docSnap.data();
              if (!d.parentTicketId) {
                list.push({ id: docSnap.id, ...d } as Complaint);
              }
            });

            // Sort by priority and duplicates
            list.sort((a, b) => {
              const priorityOrder: any = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, MINIMAL: 0 };
              const pa = priorityOrder[a.priority] || 0;
              const pb = priorityOrder[b.priority] || 0;
              if (pb !== pa) return pb - pa;
              return (b.duplicateCount || 0) - (a.duplicateCount || 0);
            });

            setComplaints(list);
            setLoading(false);

            // Calculate stats
            setStats({
              total: list.length,
              pending: list.filter((c) => c.status === 'PENDING').length,
              inProgress: list.filter((c) => c.status === 'IN_PROGRESS').length,
              resolved: list.filter((c) => c.status === 'RESOLVED').length,
              critical: list.filter((c) => c.priority === 'CRITICAL').length,
              highPriority: list.filter((c) => c.priority === 'HIGH').length,
            });

            // Department breakdown
            const dept: { [k: string]: number } = {};
            list.forEach((c) => {
              dept[c.department] = (dept[c.department] || 0) + 1;
            });
            setDeptLoad(dept);
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

  const handleStatusChange = async (complaint: Complaint, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'complaints', complaint.id), {
        status: newStatus,
        updatedAt: new Date(),
      });

      // Update child complaints
      const childQuery = query(
        collection(db, 'complaints'),
        where('parentTicketId', '==', complaint.ticketId)
      );
      const childSnap = await getDocs(childQuery);
      const batch = writeBatch(db);
      childSnap.forEach((childDoc) => {
        batch.update(childDoc.ref, {
          status: newStatus,
          updatedAt: new Date(),
        });
      });
      await batch.commit();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of all citizen grievances and department performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
          <StatCard
            label="Critical"
            value={stats.critical}
            icon={<Zap className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            label="High Priority"
            value={stats.highPriority}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="orange"
          />
        </div>

        {/* Department Breakdown */}
        {Object.keys(deptLoad).length > 0 && (
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Complaints by Department
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(deptLoad).map(([dept, count]) => (
                <div
                  key={dept}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {dept}
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Complaints Table */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            All Complaints
          </h2>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No complaints yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Ticket
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Priority
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Reports
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Impact
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          {complaint.ticketId}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="max-w-xs truncate text-gray-900 dark:text-gray-100">
                          {complaint.description}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700 dark:text-gray-300">
                          {complaint.department}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold">
                          {complaint.duplicateCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700 dark:text-gray-300">
                          {complaint.impactScore}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(complaint, e.target.value)
                          }
                          className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

