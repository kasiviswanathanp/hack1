import { db, isFirebaseConfigured } from './firebase/config';
import { demoStore } from './store/demoStore';
import { aiSurgeService } from './aiSurgeService';
import {
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  EscalationLevelNumber,
  PriorityLevel,
  ResolutionEvidence,
  UserRole,
} from '@/types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

export interface ComplaintFilterOptions {
  status?: ComplaintStatus | 'ALL';
  category?: ComplaintCategory | 'ALL';
  priority?: PriorityLevel | 'ALL';
  areaId?: string;
  wardId?: string;
  citizenId?: string;
  escalationOnly?: boolean;
  sortBy?: 'newest' | 'oldest' | 'priority' | 'sla' | 'aiHotspot';
}

class ComplaintService {
  async getComplaints(filters?: ComplaintFilterOptions): Promise<Complaint[]> {
    if (isFirebaseConfigured && db) {
      try {
        const complaintsRef = collection(db, 'complaints');
        const q = query(complaintsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        let items: Complaint[] = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Complaint));

        if (filters) {
          items = this.applyFilters(items, filters);
        }
        return items;
      } catch (err) {
        console.warn('Firestore complaints query failed, using DemoStore:', err);
      }
    }

    let items = demoStore.getComplaints();
    if (filters) {
      items = this.applyFilters(items, filters);
    }
    return items;
  }

  async getComplaintById(id: string): Promise<Complaint | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'complaints', id));
        if (snap.exists()) {
          return { ...snap.data(), id: snap.id } as Complaint;
        }
      } catch (err) {
        console.warn('Firestore getDoc failed, using DemoStore:', err);
      }
    }

    const found = demoStore.getComplaintById(id);
    return found || null;
  }

  async createComplaint(complaint: Complaint): Promise<Complaint> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'complaints', complaint.id), complaint);
        return complaint;
      } catch (err) {
        console.warn('Firestore setDoc failed, saving to DemoStore:', err);
      }
    }

    return demoStore.addComplaint(complaint);
  }

  async updateStatus(
    id: string,
    newStatus: ComplaintStatus,
    actorRole: UserRole,
    actorName: string,
    notes?: string,
    evidence?: ResolutionEvidence
  ): Promise<Complaint | null> {
    if (isFirebaseConfigured && db) {
      try {
        const ref = doc(db, 'complaints', id);
        const updatePayload: Record<string, unknown> = {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
        if (evidence) {
          updatePayload.resolutionEvidence = evidence;
          updatePayload.resolvedAt = evidence.resolvedAt;
        }
        await setDoc(ref, updatePayload, { merge: true });
      } catch (err) {
        console.warn('Firestore update failed, updating DemoStore:', err);
      }
    }

    return demoStore.updateComplaintStatus(id, newStatus, actorRole, actorName, notes, evidence);
  }

  async escalateComplaint(
    id: string,
    targetLevel: EscalationLevelNumber,
    reason: string,
    actorName = 'SLA Escalation Engine'
  ): Promise<Complaint | null> {
    if (isFirebaseConfigured && db) {
      try {
        const ref = doc(db, 'complaints', id);
        await setDoc(
          ref,
          {
            status: 'ESCALATED',
            escalationLevel: targetLevel,
            escalationReason: reason,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Firestore escalation write failed, updating DemoStore:', err);
      }
    }

    return demoStore.escalateComplaint(id, targetLevel, reason, actorName);
  }

  /**
   * Realtime reactive subscription to a single complaint
   */
  subscribeToComplaint(id: string, callback: (complaint: Complaint | null) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const unsub = onSnapshot(doc(db, 'complaints', id), (snap) => {
          if (snap.exists()) {
            callback({ ...snap.data(), id: snap.id } as Complaint);
          } else {
            callback(null);
          }
        });
        return unsub;
      } catch (err) {
        console.warn('Realtime Firestore snapshot failed, falling back to DemoStore listener:', err);
      }
    }

    const check = () => {
      const item = demoStore.getComplaintById(id);
      callback(item || null);
    };

    check();
    return demoStore.subscribe(check);
  }

  /**
   * Realtime reactive subscription to list of complaints
   */
  subscribeToComplaints(filters: ComplaintFilterOptions | undefined, callback: (complaints: Complaint[]) => void): () => void {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
          let items: Complaint[] = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Complaint));
          if (filters) {
            items = this.applyFilters(items, filters);
          }
          callback(items);
        });
        return unsub;
      } catch (err) {
        console.warn('Firestore list snapshot failed, falling back to DemoStore listener:', err);
      }
    }

    const check = () => {
      let items = demoStore.getComplaints();
      if (filters) {
        items = this.applyFilters(items, filters);
      }
      callback(items);
    };

    check();
    return demoStore.subscribe(check);
  }

  private applyFilters(items: Complaint[], filters: ComplaintFilterOptions): Complaint[] {
    let result = [...items];

    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'ESCALATED') {
        result = result.filter((c) => c.status === 'ESCALATED' || (c.escalationLevel && c.escalationLevel > 1));
      } else {
        result = result.filter((c) => c.status === filters.status);
      }
    }

    if (filters.category && filters.category !== 'ALL') {
      result = result.filter((c) => c.category === filters.category);
    }

    if (filters.priority && filters.priority !== 'ALL') {
      result = result.filter((c) => c.priority === filters.priority);
    }

    if (filters.citizenId) {
      result = result.filter((c) => c.citizenId === filters.citizenId);
    }

    if (filters.wardId) {
      result = result.filter((c) => c.wardId === filters.wardId);
    }

    if (filters.escalationOnly) {
      result = result.filter((c) => c.status === 'ESCALATED' || c.escalationLevel > 1);
    }

    if (filters.sortBy === 'aiHotspot') {
      result = aiSurgeService.prioritizeComplaintsByAiHotspot(result);
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === 'priority') {
      const pMap: Record<PriorityLevel, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      result.sort((a, b) => (pMap[b.priority] || 0) - (pMap[a.priority] || 0));
    } else if (filters.sortBy === 'sla') {
      result.sort((a, b) => new Date(a.responseDeadline).getTime() - new Date(b.responseDeadline).getTime());
    } else {
      // Newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }
}

export const complaintService = new ComplaintService();
