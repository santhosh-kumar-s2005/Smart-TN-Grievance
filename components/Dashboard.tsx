'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ComplaintCard from './ComplaintCard';

export default function Dashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: any[] = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setComplaints(data);
      },
      (error) => {
        console.error('[Dashboard] Firestore error:', error);
        if (error.code === 'permission-denied') {
          console.error('[Dashboard] Permission denied - Check Firestore rules');
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-semibold text-black">All Complaints</h2>

      {complaints.length === 0 && <p className="text-gray-500">No complaints yet.</p>}

      {complaints.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} />
      ))}
    </div>
  );
}
