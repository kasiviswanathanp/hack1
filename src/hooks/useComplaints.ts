import { useEffect, useState, useMemo } from 'react';
import { complaintService, ComplaintFilterOptions } from '@/services/complaintService';
import { Complaint } from '@/types';

export function useComplaints(initialFilters?: ComplaintFilterOptions) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComplaintFilterOptions>(initialFilters || {});

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsub = complaintService.subscribeToComplaints(filters, (items) => {
      setComplaints(items);
      setIsLoading(false);
    });

    return unsub;
  }, [JSON.stringify(filters)]);

  const counts = useMemo(() => {
    return {
      all: complaints.length,
      submitted: complaints.filter((c) => c.status === 'SUBMITTED').length,
      underReview: complaints.filter((c) => c.status === 'UNDER_REVIEW').length,
      assigned: complaints.filter((c) => c.status === 'ASSIGNED').length,
      inProgress: complaints.filter((c) => c.status === 'IN_PROGRESS').length,
      escalated: complaints.filter((c) => c.status === 'ESCALATED' || c.escalationLevel > 1).length,
      resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
      rejected: complaints.filter((c) => c.status === 'REJECTED').length,
      critical: complaints.filter((c) => c.priority === 'CRITICAL').length,
    };
  }, [complaints]);

  return {
    complaints,
    isLoading,
    error,
    filters,
    setFilters,
    counts,
  };
}
