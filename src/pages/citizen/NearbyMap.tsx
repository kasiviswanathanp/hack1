import React from 'react';
import { useHotspots } from '@/hooks/useHotspots';
import { HotspotMap } from '@/components/maps/HotspotMap';
import { LoadingState } from '@/components/common/FeedbackStates';

export const NearbyMap: React.FC = () => {
  const { hotspots, selectedCluster, setSelectedCluster, isLoading } = useHotspots();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Nearby Civic Status & Incident Hotspots
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore real-time complaint clusters, road repairs, and drainage emergencies across municipal wards.
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Aggregating geographic cluster data..." />
      ) : (
        <HotspotMap
          clusters={hotspots}
          selectedCluster={selectedCluster}
          onSelectCluster={setSelectedCluster}
        />
      )}
    </div>
  );
};
