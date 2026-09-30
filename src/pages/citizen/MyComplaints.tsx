import React, { useState } from 'react';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/store/AuthContext';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { EmptyState, LoadingState } from '@/components/common/FeedbackStates';
import { ComplaintStatus } from '@/types';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Filter, ArrowUpDown } from 'lucide-react';

const STATUS_FILTERS: { id: ComplaintStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Complaints' },
  { id: 'SUBMITTED', label: 'Submitted' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'ESCALATED', label: 'Escalated' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'REJECTED', label: 'Rejected' },
];

export const MyComplaints: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeStatus, setActiveStatus] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // For citizen role, restrict to their own complaints via citizenId.
  // Officers/Admins using the same component see all complaints (no citizenId filter).
  const citizenId = currentUser?.role === 'CITIZEN' ? (currentUser?.uid ?? undefined) : undefined;

  const { complaints, isLoading, counts } = useComplaints({
    status: activeStatus,
    sortBy,
    ...(citizenId ? { citizenId } : {}),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">My Complaints</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time progress, response deadlines, and photographic verification of resolutions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/citizen/report')}
          className="self-start sm:self-auto font-bold"
        >
          Report New Issue
        </Button>
      </div>

      {/* Filter Tabs & Sort bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Horizontal filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {STATUS_FILTERS.map((f) => {
            const isSelected = activeStatus === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveStatus(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{f.label}</span>
                {f.id === 'ALL' && (
                  <span className="ml-1.5 opacity-80 font-mono">({counts.all})</span>
                )}
                {f.id === 'ESCALATED' && counts.escalated > 0 && (
                  <span className="ml-1.5 px-1 rounded-full bg-rose-500 text-white text-[10px]">
                    {counts.escalated}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority Severity</option>
          </select>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <LoadingState message="Loading your submitted grievances..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          description={
            activeStatus === 'ALL'
              ? 'You have not submitted any complaints yet. Report an issue in seconds with photo and location.'
              : `No complaints found with status '${activeStatus}'.`
          }
          actionText="Submit an Issue"
          onAction={() => navigate('/citizen/report')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
};
