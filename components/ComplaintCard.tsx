export default function ComplaintCard({ complaint }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-300 text-black">
      <p className="text-sm text-gray-500 mb-1">Ticket ID: {complaint.ticketId}</p>

      <h3 className="text-lg font-semibold mb-2">{complaint.description}</h3>

      <p className="text-sm text-gray-700 mb-2">📍 Location: {complaint.location}</p>

      <div className="flex gap-4 mt-2">
        <span className="px-3 py-1 text-xs rounded bg-yellow-200">{complaint.status}</span>

        <span className="px-3 py-1 text-xs rounded bg-blue-200">{complaint.priority}</span>
      </div>
    </div>
  );
}
