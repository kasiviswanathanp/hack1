import { demoStore } from './store/demoStore';
import { complaintService } from './complaintService';
import { Complaint } from '@/types';

export const supervisorService = {
  async getEscalatedComplaints(): Promise<Complaint[]> {
    const all = await complaintService.getComplaints();
    return all.filter((c) => c.status === 'ESCALATED' || c.escalationLevel >= 2);
  },

  async assignFieldTeam(
    complaintId: string,
    fieldTeamId: string,
    fieldTeamName: string,
    instructions: string
  ): Promise<Complaint | null> {
    return demoStore.assignFieldTeam(complaintId, fieldTeamId, fieldTeamName, instructions);
  },

  async elevateToDistrictManager(complaintId: string, reason: string): Promise<Complaint | null> {
    return complaintService.escalateComplaint(complaintId, 4, reason, 'Zonal Supervisor');
  },
};
