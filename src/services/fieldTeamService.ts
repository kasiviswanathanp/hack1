import { demoStore } from './store/demoStore';
import { WorkOrder } from '@/types';

export const fieldTeamService = {
  async getWorkOrders(fieldTeamId?: string): Promise<WorkOrder[]> {
    return demoStore.getWorkOrders(fieldTeamId);
  },

  async getWorkOrderById(id: string): Promise<WorkOrder | undefined> {
    return demoStore.getWorkOrderById(id);
  },

  async acceptWorkOrder(id: string): Promise<WorkOrder | null> {
    return demoStore.updateWorkOrderStatus(id, 'ACCEPTED');
  },

  async startWork(id: string): Promise<WorkOrder | null> {
    return demoStore.updateWorkOrderStatus(id, 'IN_PROGRESS');
  },

  async completeWork(
    id: string,
    afterPhotoUrl: string,
    completionNotes: string
  ): Promise<WorkOrder | null> {
    return demoStore.updateWorkOrderStatus(id, 'COMPLETED', afterPhotoUrl, completionNotes);
  },
};
