import { complaintService } from './complaintService';
import { Complaint, ResolutionEvidence } from '@/types';

export const officerService = {
  async getAssignedComplaints(officerId?: string, wardId?: string): Promise<Complaint[]> {
    const all = await complaintService.getComplaints();
    return all.filter((c) => {
      if (officerId && c.assignedOfficerId === officerId) return true;
      if (wardId && c.wardId === wardId) return true;
      return c.status === 'ASSIGNED' || c.status === 'UNDER_REVIEW' || c.status === 'ESCALATED';
    });
  },

  async acceptComplaint(id: string, officerName: string): Promise<Complaint | null> {
    return complaintService.updateStatus(
      id,
      'IN_PROGRESS',
      'AREA_OFFICER',
      officerName,
      `Complaint acknowledged and accepted by Area Officer ${officerName}. Action plan initiated.`
    );
  },

  async startWork(id: string, officerName: string): Promise<Complaint | null> {
    return complaintService.updateStatus(
      id,
      'IN_PROGRESS',
      'AREA_OFFICER',
      officerName,
      'Remediation work initiated by municipal field crew.'
    );
  },

  async escalateComplaint(id: string, reason: string, officerName: string): Promise<Complaint | null> {
    return complaintService.escalateComplaint(id, 2, reason, officerName);
  },

  async resolveComplaint(id: string, evidence: ResolutionEvidence, officerName: string): Promise<Complaint | null> {
    return complaintService.updateStatus(
      id,
      'RESOLVED',
      'AREA_OFFICER',
      officerName,
      'Issue remediated and verified on site.',
      evidence
    );
  },
};
