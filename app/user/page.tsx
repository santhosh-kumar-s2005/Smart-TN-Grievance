'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { calculatePriority } from '@/lib/priority';
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import ComplaintCard from '@/components/ComplaintCard';
import Loader from '@/components/Loader';
import { AlertCircle, Plus, LogOut } from 'lucide-react';

const COMPLAINT_CATEGORIES = [
  'Water Supply',
  'Electricity',
  'Roads & Drainage',
  'Sanitation',
  'Traffic',
  'Street Lights',
  'Public Health',
  'Others',
];

const DISTRICTS = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Erode',
  'Tirunelveli',
  'Kanyakumari',
  'Chengalpattu',
  'Ranipet',
];

type Complaint = {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: string;
  district: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: any;
  updatedAt: any;
};

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');

  // Complaints list
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // Route protection and real-time listener
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        setLoading(false);

        const q = query(collection(db, 'complaints'), where('userId', '==', currentUser.uid));
        unsubscribeSnapshot = onSnapshot(
          q,
          (querySnapshot) => {
            const data: Complaint[] = [];
            querySnapshot.forEach((docSnap) => {
              data.push({ id: docSnap.id, ...docSnap.data() } as Complaint);
            });

            // Sort by creation date (newest first)
            data.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });

            setComplaints(data);

            // Calculate stats
            setStats({
              total: data.length,
              pending: data.filter((c) => c.status === 'PENDING').length,
              inProgress: data.filter((c) => c.status === 'IN_PROGRESS').length,
              resolved: data.filter((c) => c.status === 'RESOLVED').length,
            });
          },
          (error) => {
            console.error('Error fetching complaints:', error);
            setError('Failed to load complaints');
          }
        );
      }
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Complaint title is required');
      return;
    }
    if (!description.trim()) {
      setError('Complaint description is required');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!district) {
      setError('Please select a district');
      return;
    }

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }

    setSubmitting(true);

    try {
      const ticketId = 'TN' + Date.now();
      const priority = calculatePriority(description);

      await addDoc(collection(db, 'complaints'), {
        ticketId,
        userId: user.uid,
        title: title.trim(),
        description: description.trim(),
        category,
        district,
        priority,
        status: 'PENDING',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setDistrict('');
      setShowForm(false);
      setError('');
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      setError('Error submitting complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await deleteDoc(doc(db, 'complaints', id));
    } catch (err: any) {
      setError('Failed to delete complaint');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Loader size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar userRole="USER" userName={user?.email?.split('@')[0] || 'User'} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {user?.displayName || user?.email?.split('@')[0]}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your grievances efficiently</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Complaints</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
          </Card>
          <Card className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Resolved</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Toggle Form Button */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                File New Complaint
              </button>
            )}

            {/* Form */}
            {showForm && (
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File a New Complaint</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                {error && (
                  <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Complaint Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Brief title of your complaint"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{title.length}/100 characters</p>
                  </div>

                  {/* Category and District */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      >
                        <option value="">-- Select Category --</option>
                        {COMPLAINT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      >
                        <option value="">-- Select District --</option>
                        {DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Detailed Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Describe your grievance in detail (minimum 20 characters)"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={2000}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description.length}/2000 characters</p>
                  </div>

                  {/* Priority Display */}
                  {description.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Auto-Detected Priority:</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {calculatePriority(description)} Priority
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition"
                    >
                      {submitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium px-4 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Card>
            )}

            {/* Your Complaints */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Complaints</h3>

              {complaints.length === 0 ? (
                <Card className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No complaints yet. File one to get started!</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="relative">
                      <ComplaintCard complaint={complaint} />
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="absolute top-4 right-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold"
                        title="Delete complaint"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Priority Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">🔴 High</span>
                  <span className="font-bold text-red-600">
                    {complaints.filter((c) => c.priority === 'HIGH').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">🟡 Medium</span>
                  <span className="font-bold text-yellow-600">
                    {complaints.filter((c) => c.priority === 'MEDIUM').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">🟢 Low</span>
                  <span className="font-bold text-green-600">
                    {complaints.filter((c) => c.priority === 'LOW').length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Tips for Better Resolution</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Provide detailed descriptions</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Select correct category</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Mention specific location</span>
                </li>
                <li className="flex gap-2">
                  <span>✓</span>
                  <span>Use clear, concise language</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
