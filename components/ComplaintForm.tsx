'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ComplaintForm() {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !location) {
      alert('Please fill all fields');
      return;
    }

    try {
      const ticketId = 'TN' + Date.now();

      await addDoc(collection(db, 'complaints'), {
        ticketId,
        description,
        location,
        status: 'PENDING',
        priority: 'MEDIUM',
        category: 'GENERAL',
        createdAt: serverTimestamp(),
      });

      setDescription('');
      setLocation('');
      alert('Complaint submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error submitting complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter complaint description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Complaint
      </button>
    </form>
  );
}
