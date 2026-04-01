'use client';

import { useEffect, useState, useRef } from 'react';
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
} from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import { Upload, Mic, Send, Trash2, MapPin, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('GENERAL');
  const [priority, setPriority] = useState('MINIMAL');
  const [impactScore, setImpactScore] = useState(0);
  const [locationType, setLocationType] = useState('residential');

  // Media states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Complaints list and errors
  const [complaints, setComplaints] = useState<any[]>([]);
  const [error, setError] = useState('');

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
            const data: any[] = [];
            querySnapshot.forEach((docSnap) => {
              data.push({ id: docSnap.id, ...docSnap.data() });
            });
            setComplaints(data.sort((a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)));
          },
          (error) => console.error('Error fetching complaints:', error)
        );
      }
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, [router]);

  function detectDepartment(text: string): string {
    const t = text.toLowerCase();
    if (/(water|leakage|drain|sewage)/.test(t)) return 'SANITARY';
    if (/(pothole|road|street damage)/.test(t)) return 'ROAD';
    if (/(power|electric|wire)/.test(t)) return 'ELECTRICITY';
    if (/(garbage|waste)/.test(t)) return 'SANITATION';
    return 'GENERAL';
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    const files = (e as any).dataTransfer?.files || (e.target as HTMLInputElement).files;
    const file = files?.[0];
    if (!file) return;

    setImageFile(file);
    setIsOcrLoading(true);
    setError('');

    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/image-analysis', { method: 'POST', body: form });
      
      if (!res.ok) throw new Error('Image analysis failed');
      
      const data = await res.json();
      setExtractedText(data.description);
      setDescription(data.description);
      setDepartment(data.department);
    } catch (err: any) {
      setError(err.message || 'Image analysis failed');
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleAudioRecord = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setError('Audio recording not supported');
      return;
    }

    setIsAudioLoading(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));

        try {
          const form = new FormData();
          form.append('audio', blob, 'audio.webm');
          const res = await fetch('/api/transcribe-audio', { method: 'POST', body: form });
          
          if (!res.ok) throw new Error('Transcription failed');
          
          const data = await res.json();
          setExtractedText(data.transcript);
          setDescription(data.transcript);
        } catch (err: any) {
          setError(err.message || 'Transcription failed');
        } finally {
          setIsAudioLoading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    });
  };

  // Auto-detect priority and department
  useEffect(() => {
    let finalText = description + (extractedText && extractedText !== description ? ' ' + extractedText : '');
    finalText = finalText.trim();

    if (!finalText) {
      setDepartment('GENERAL');
      setPriority('MINIMAL');
      setImpactScore(0);
      return;
    }

    const dept = detectDepartment(finalText);
    setDepartment(dept);
    const result = calculatePriority({ text: finalText, department: dept, locationType });
    setPriority(result.priority.toUpperCase());
    setImpactScore(result.totalScore);
  }, [description, extractedText, locationType]);

  const handleSubmit = async () => {
    if (!description.trim() || !location.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const ticketId = 'TN' + Date.now();
      await addDoc(collection(db, 'complaints'), {
        ticketId,
        userId: user.uid,
        description: description.trim(),
        location: location.trim(),
        department,
        priority,
        impactScore,
        locationType,
        status: 'PENDING',
        duplicateCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Reset
      setDescription('');
      setLocation('');
      setImageFile(null);
      setAudioBlob(null);
      setExtractedText('');
      setAudioUrl(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await deleteDoc(doc(db, 'complaints', id));
    } catch {
      setError('Delete failed');
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">File a New Complaint</h2>

              {error && (
                <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your grievance..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 min-h-24 resize-none"
                  />
                </div>

                <div
                  onDrop={(e) => { e.preventDefault(); handleImageChange(e); }}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                    disabled={isOcrLoading}
                  />
                  <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    <p className="text-sm font-medium">Drag image here or click to upload</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG up to 10MB</p>
                  </label>
                  {imageFile && <p className="text-sm text-green-600 dark:text-green-400 mt-2">✓ {imageFile.name}</p>}
                  {isOcrLoading && <Loader size="sm" text="Analyzing..." />}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Record Audio</p>
                  <Button
                    variant={isRecording ? 'danger' : 'secondary'}
                    fullWidth
                    onClick={handleAudioRecord}
                    disabled={isAudioLoading}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  {audioUrl && <p className="text-sm text-green-600 dark:text-green-400">✓ Audio recorded</p>}
                  {isAudioLoading && <Loader size="sm" text="Transcribing..." />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Location *"
                    placeholder="Street address or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={submitting}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      Location Type
                    </label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="public">Public Area</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Department</p>
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">{department}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Priority</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">{priority}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Impact</p>
                    <p className="font-bold text-green-600 dark:text-green-400">{impactScore}/100</p>
                  </div>
                </div>

                <Button type="submit" fullWidth size="lg" loading={submitting}>
                  <Send className="w-4 h-4" />
                  Submit Complaint
                </Button>
              </form>
            </Card>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Complaints</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total: {complaints.length}</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {complaints.length === 0 ? (
                <Card>
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">No complaints yet</p>
                </Card>
              ) : (
                complaints.map((c) => (
                  <Card key={c.id} className="space-y-2 p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{c.ticketId}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.description.substring(0, 35)}...</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                        c.status === 'RESOLVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        c.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-800 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded">
                        {c.department}
                      </span>
                      <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded">
                        {c.priority}
                      </span>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
