import { getPriorityColor, getPriorityIcon } from '@/lib/priority';
import { Calendar, MapPin, Tag, AlertCircle, Zap } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'RESOLVED':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'Water Supply': '💧',
    'Electricity': '⚡',
    'Roads & Drainage': '🛣️',
    'Sanitation': '🧹',
    'Traffic': '🚗',
    'Street Lights': '💡',
    'Public Health': '🏥',
    'Others': '📋',
  };
  return icons[category] || '📋';
};

export default function ComplaintCard({ complaint }: any) {
  const priorityColor = getPriorityColor(complaint.priority);
  const statusColor = getStatusColor(complaint.status);
  const categoryIcon = getCategoryIcon(complaint.category);
  const hasScoreData = complaint.priorityScore !== undefined;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date =
      timestamp instanceof Date ? timestamp : new Date(timestamp.toDate?.() || timestamp);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-5">
      {/* Header: Title and ID */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black truncate">{complaint.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            Ticket ID: <span className="font-mono">{complaint.ticketId}</span>
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{complaint.description}</p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcon}</span>
          <div>
            <p className="text-gray-500 text-xs">Category</p>
            <p className="font-medium text-gray-800">{complaint.category}</p>
          </div>
        </div>

        {/* District */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-gray-500 text-xs">District</p>
            <p className="font-medium text-gray-800">{complaint.district}</p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-gray-500 text-xs">Submitted</p>
            <p className="font-medium text-gray-800">{formatDate(complaint.createdAt)}</p>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex flex-col gap-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor} w-fit`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Priority Badge with Score */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getPriorityIcon(complaint.priority)}</span>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${priorityColor}`}>
            {complaint.priority} Priority
          </span>
        </div>
        
        {/* Priority Score Display */}
        {hasScoreData && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1 rounded-full border border-indigo-200">
            <Zap className="w-3 h-3 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700">
              Score: {complaint.priorityScore}
            </span>
          </div>
        )}
      </div>

      {/* Score Breakdown Tooltip */}
      {hasScoreData && complaint.scoreBreakdown && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
          <div className="font-semibold text-gray-700 mb-2">Score Breakdown:</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Keywords:</span>
              <span className="font-semibold">{complaint.scoreBreakdown.keywordScore}</span>
            </div>
            {complaint.scoreBreakdown.severityBoost > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Urgency:</span>
                <span className="font-semibold">+{complaint.scoreBreakdown.severityBoost}</span>
              </div>
            )}
            {complaint.scoreBreakdown.categoryBoost > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Category:</span>
                <span className="font-semibold">+{complaint.scoreBreakdown.categoryBoost}</span>
              </div>
            )}
            {complaint.scoreBreakdown.recencyBoost > 0 && (
              <div className="flex justify-between text-purple-600">
                <span>Age:</span>
                <span className="font-semibold">+{complaint.scoreBreakdown.recencyBoost}</span>
              </div>
            )}
          </div>
          {complaint.matchedKeywords && complaint.matchedKeywords.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-300">
              <p className="text-gray-600 mb-1">Keywords Detected:</p>
              <div className="flex flex-wrap gap-1">
                {complaint.matchedKeywords.slice(0, 4).map((keyword: string) => (
                  <span
                    key={keyword}
                    className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
                {complaint.matchedKeywords.length > 4 && (
                  <span className="inline-block px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs">
                    +{complaint.matchedKeywords.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Metadata Footer */}
      <div className="pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>
          {complaint.updatedAt ? `Updated: ${formatDate(complaint.updatedAt)}` : 'Just created'}
        </span>
      </div>
    </div>
  );
}
