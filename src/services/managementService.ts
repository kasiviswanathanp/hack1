import { demoStore } from './store/demoStore';
import { CityAnalyticsSummary, ComplaintCluster } from '@/types';

export const managementService = {
  async getHotspotClusters(): Promise<ComplaintCluster[]> {
    return demoStore.getHotspots();
  },

  async getCityAnalytics(): Promise<CityAnalyticsSummary> {
    return demoStore.getCityAnalytics();
  },
};
