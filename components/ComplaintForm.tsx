'use client';

import { useState, useMemo } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { calculatePriorityWithScore } from '@/lib/priority';
import { getPriorityIcon, getPriorityColor, getPriorityLabel } from '@/lib/priorityScorer';
import { AlertCircle, TrendingUp } from 'lucide-react';

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

export default function ComplaintForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // Calculate priority score in real-time as user types
  const priorityScore = useMemo(() => {
    if (!description.trim()) return null;
    return calculatePriorityWithScore({
      description,
      category,
      status: 'PENDING',
      createdAt: new Date(),
    });
  }, [description, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

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

    setLoading(true);

    try {
      const ticketId = 'TN' + Date.now();
      
      // Calculate final priority score at submission
      const finalScore = calculatePriorityWithScore({
        description,
        category,
        status: 'PENDING',
        createdAt: new Date(),
      });

      await addDoc(collection(db, 'complaints'), {
        ticketId,
        title: title.trim(),
        description: description.trim(),
        district,
        category,
        priority: finalScore.priorityLevel,
        priorityScore: finalScore.totalScore,
        scoreBreakdown: finalScore.breakdown,
        matchedKeywords: finalScore.matchedKeywords,
        scoreExplanation: finalScore.explanation,
        status: 'PENDING',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDistrict('');
      setCategory('');
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      setError('Error submitting complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg border border-gray-200">
      {error && (
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
          <p className="text-sm text-green-700">Complaint submitted successfully! Your ticket ID will be displayed in your dashboard.</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Complaint Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Brief title of your complaint"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">-- Select Category --</option>
          {COMPLAINT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          District <span className="text-red-500">*</span>
        </label>
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">-- Select District --</option>
          {DISTRICTS.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Describe your grievance in detail (minimum 20 characters)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <p className="text-xs text-gray-500 mt-1">{description.length}/2000 characters</p>
      </div>

      {/* Priority Score Preview */}
      {priorityScore && (
        <div className={`p-4 rounded-lg border-2 ${getPriorityColor(priorityScore.priorityLevel)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getPriorityIcon(priorityScore.priorityLevel)}</span>
              <div>
                <p className="font-semibold text-sm">Priority: {getPriorityLabel(priorityScore.priorityLevel)}</p>
                <p className="text-xs opacity-75">Score: {priorityScore.totalScore}/100+</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
              className="text-xs px-2 py-1 rounded bg-white bg-opacity-50 hover:bg-opacity-75 transition"
            >
              {showScoreBreakdown ? 'Hide' : 'View'} Details
            </button>
          </div>

          {showScoreBreakdown && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Keywords Score:</span>
                <span className="font-semibold">{priorityScore.breakdown.keywordScore}</span>
              </div>
              {priorityScore.breakdown.severityBoost > 0 && (
                <div className="flex justify-between text-orange-700">
                  <span>Urgency Boost:</span>
                  <span className="font-semibold">+{priorityScore.breakdown.severityBoost}</span>
                </div>
              )}
              {priorityScore.breakdown.categoryBoost > 0 && (
                <div className="flex justify-between text-blue-700">
                  <span>Category Boost:</span>
                  <span className="font-semibold">+{priorityScore.breakdown.categoryBoost}</span>
                </div>
              )}
              {priorityScore.matchedKeywords.length > 0 && (
                <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                  <p className="text-xs opacity-75 mb-1">Matched Keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {priorityScore.matchedKeywords.slice(0, 5).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-2 py-1 rounded bg-white bg-opacity-30"
                      >
                        {keyword}
                      </span>
                    ))}
                    {priorityScore.matchedKeywords.length > 5 && (
                      <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-30">
                        +{priorityScore.matchedKeywords.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? 'Submitting...' : (
          <>
            <TrendingUp className="w-4 h-4" />
            Submit Complaint
          </>
        )}
      </button>
    </form>
  );
}

