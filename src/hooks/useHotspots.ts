import { useState, useEffect } from 'react';
import { managementService } from '@/services/managementService';
import { ComplaintCluster } from '@/types';

export function useHotspots() {
  const [hotspots, setHotspots] = useState<ComplaintCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<ComplaintCluster | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    managementService.getHotspotClusters().then((items) => {
      setHotspots(items);
      if (items.length > 0) {
        setSelectedCluster(items[0]);
      }
      setIsLoading(false);
    });
  }, []);

  return {
    hotspots,
    selectedCluster,
    setSelectedCluster,
    isLoading,
  };
}
