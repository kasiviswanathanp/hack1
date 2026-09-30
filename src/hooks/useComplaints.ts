import { useEffect, useState, useMemo } from 'react';
import { complaintService, ComplaintFilterOptions } from '@/services/complaintService';
import { Complaint } from '@/types';

export function useComplaints(initialFilters?: ComplaintFilterOptions) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [unfilteredComplaints, setUnfilteredComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualFilters, setManualFilters] = useState<ComplaintFilterOptions>({});

  const activeFilters = useMemo(() => {
    return { ...initialFilters, ...manualFilters };
  }, [JSON.stringify(initialFilters), JSON.stringify(manualFilters)]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Subscribe to filtered list for view display
    const unsubList = complaintService.subscribeToComplaints(activeFilters, (items) => {
      setComplaints(items);
      setIsLoading(false);
    });

    // Also subscribe to scope list (only filtering by user/ward scope if present, without status/category/priority/sort)
    // to calculate permanent, accurate badge and tab counts
    const scopeFilters: ComplaintFilterOptions = {};
    if (activeFilters.citizenId) scopeFilters.citizenId = activeFilters.citizenId;
    if (activeFilters.wardId) scopeFilters.wardId = activeFilters.wardId;

    const unsubScope = complaintService.subscribeToComplaints(scopeFilters, (items) => {
      setUnfilteredComplaints(items);
    });

    return () => {
      unsubList();
      unsubScope();
    };
  }, [JSON.stringify(activeFilters)]);

  const counts = useMemo(() => {
    const source = unfilteredComplaints.length > 0 ? unfilteredComplaints : complaints;
    return {
      all: source.length,
      submitted: source.filter((c) => c.status === 'SUBMITTED').length,
      underReview: source.filter((c) => c.status === 'UNDER_REVIEW').length,
      assigned: source.filter((c) => c.status === 'ASSIGNED').length,
      inProgress: source.filter((c) => c.status === 'IN_PROGRESS').length,
      escalated: source.filter((c) => c.status === 'ESCALATED' || (c.escalationLevel && c.escalationLevel > 1)).length,
      resolved: source.filter((c) => c.status === 'RESOLVED').length,
      rejected: source.filter((c) => c.status === 'REJECTED').length,
      critical: source.filter((c) => c.priority === 'CRITICAL').length,
    };
  }, [unfilteredComplaints, complaints]);

  return {
    complaints,
    isLoading,
    error,
    filters: activeFilters,
    setFilters: setManualFilters,
    counts,
  };
}
