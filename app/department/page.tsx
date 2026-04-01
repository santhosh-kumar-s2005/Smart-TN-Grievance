'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, where, updateDoc, doc, onAuthStateChanged } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import StatCard from '@/components/StatCard';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

export default function DepartmentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [department, setDepartment] = useState('ROAD');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Route protection and data fetching
  useEffect(() => {
    const checkAccess = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`/api/check-role?uid=${currentUser.uid}`);
        if (!res.ok) {
          setError('Failed to verify access');
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.role !== 'DEPARTMENT') {
          setError('Access Denied - Department Staff only');
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        setUser(currentUser);
        fetchComplaints();
      } catch (err) {
        console.error('Access check error:', err);
        setError('Failed to verify access');
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  const fetchComplaints = async () => {
    try {
      const q = query(
        collection(db, 'complaints'),
        where('department', '==', department)
      );

      const querySnapshot = await getDocs(q);
      const data: any[] = [];

      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });

      // Sort by priority and duplicates
      data.sort((a, b) => {
        const priorityOrder: any = { CRITICAL: 3, HIGH: 2, MEDIUM: 1, MINIMAL: 0 };
        const pa = priorityOrder[a.priority] || 0;
        const pb = priorityOrder[b.priority] || 0;
        if (pb !== pa) return pb - pa;
        return (b.duplicateCount || 0) - (a.duplicateCount || 0);
      });

      setComplaints(data);
      setLoading(false);

      // Calculate stats
      setStats({
        total: data.length,
        pending: data.filter((c) => c.status === 'PENDING').length,
        inProgress: data.filter((c) => c.status === 'IN_PROGRESS').length,
        resolved: data.filter((c) => c.status === 'RESOLVED').length,
      });
    } catch (err) {
      console.error('Error fetching complaints:', err);
      if (err instanceof Error && 'code' in err && err.code === 'permission-denied') {
        setError('Permission denied - Check Firestore rules');
      } else {
        setError('Failed to load complaints');
      }
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'complaints', id), {
        status: newStatus,
        updatedAt: new Date(),
      });
      fetchComplaints();
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
        <Loader size="lg" text="Loading department dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar
        userRole="DEPARTMENT"
        userName={`${department} Staff`}
      />

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
            {department} Department
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and resolve grievances assigned to your department
          </p>
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
            icon={<AlertCircle className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard
            label="Resolved"
            value={stats.resolved}
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
          />
        </div>

        {/* Complaints Cards */}
        {complaints.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No complaints for {department} department
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {complaints.map((complaint) => (
              <Card key={complaint.id}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left: Complaint Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded">
                        {complaint.ticketId}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {complaint.description}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{complaint.location}</span>
                      </p>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                            Impact Score
                          </p>
                          <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {complaint.impactScore}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                            Reports
                          </p>
                          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                            {complaint.duplicateCount || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                            Linked Issues
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {complaint.duplicateCount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2 w-full md:w-auto">
                    {complaint.status !== 'RESOLVED' && (
                      <>
                        {complaint.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="primary"
                            fullWidth
                            onClick={() => updateStatus(complaint.id, 'IN_PROGRESS')}
                          >
                            Start Work
                          </Button>
                        )}
                        {complaint.status === 'IN_PROGRESS' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            fullWidth
                            onClick={() => updateStatus(complaint.id, 'IN_PROGRESS')}
                          >
                            Mark as In Progress
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          fullWidth
                          onClick={() => updateStatus(complaint.id, 'RESOLVED')}
                        >
                          Mark Resolved
                        </Button>
                      </>
                    )}
                    {complaint.status === 'RESOLVED' && (
                      <div className="text-center py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-xs text-green-700 dark:text-green-400 font-semibold">
                          ✓ Resolved
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
