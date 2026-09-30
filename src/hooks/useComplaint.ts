import { useEffect, useState } from 'react';
import { complaintService } from '@/services/complaintService';
import { Complaint } from '@/types';

export function useComplaint(complaintId?: string) {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!complaintId) {
      setComplaint(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsub = complaintService.subscribeToComplaint(complaintId, (item) => {
      if (item) {
        setComplaint(item);
      } else {
        setError('Complaint record not found');
      }
      setIsLoading(false);
    });

    return unsub;
  }, [complaintId]);

  return {
    complaint,
    isLoading,
    error,
    reload: () => {
      if (complaintId) {
        complaintService.getComplaintById(complaintId).then((c) => setComplaint(c));
      }
    },
  };
}
