import {
  INITIAL_CITY_ANALYTICS,
  INITIAL_COMPLAINTS,
  INITIAL_HOTSPOTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_WORK_ORDERS,
} from '@/services/demoData';
import {
  CityAnalyticsSummary,
  CivicNotification,
  Complaint,
  ComplaintCluster,
  ComplaintStatus,
  EscalationLevelNumber,
  ResolutionEvidence,
  UserRole,
  WorkOrder,
} from '@/types';

type Listener = () => void;

class DemoStore {
  private complaints: Complaint[] = [...INITIAL_COMPLAINTS];
  private workOrders: WorkOrder[] = [...INITIAL_WORK_ORDERS];
  private notifications: CivicNotification[] = [...INITIAL_NOTIFICATIONS];
  private hotspots: ComplaintCluster[] = [...INITIAL_HOTSPOTS];
  private analytics: CityAnalyticsSummary = { ...INITIAL_CITY_ANALYTICS };
  private listeners: Set<Listener> = new Set();

  constructor() {
    // Try to load any saved state from localStorage for persistent testing across page reloads
    try {
      const savedComplaints = localStorage.getItem('civicai_demo_complaints');
      if (savedComplaints) {
        const parsed: Complaint[] = JSON.parse(savedComplaints);
        const existingIds = new Set(parsed.map((c) => c.id));
        const missingInitial = INITIAL_COMPLAINTS.filter((c) => !existingIds.has(c.id));
        this.complaints = [...parsed, ...missingInitial];
      }
      const savedNotifications = localStorage.getItem('civicai_demo_notifications');
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications);
      }
      const savedWorkOrders = localStorage.getItem('civicai_demo_work_orders');
      if (savedWorkOrders) {
        this.workOrders = JSON.parse(savedWorkOrders);
      }
    } catch {
      // Ignore storage errors
    }
  }

  private notify() {
    this.persist();
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }

  private persist() {
    try {
      localStorage.setItem('civicai_demo_complaints', JSON.stringify(this.complaints));
      localStorage.setItem('civicai_demo_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('civicai_demo_work_orders', JSON.stringify(this.workOrders));
    } catch {
      // Ignore
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getComplaints(): Complaint[] {
    return [...this.complaints];
  }

  public getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find((c) => c.id === id);
  }

  public addComplaint(complaint: Complaint): Complaint {
    this.complaints = [complaint, ...this.complaints];

    // Auto-create notification for Citizen
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: complaint.citizenId,
      complaintId: complaint.id,
      type: 'COMPLAINT_SUBMITTED',
      title: 'Complaint Submitted Successfully',
      message: `Your complaint ${complaint.id} (${complaint.category}) has been logged and assigned to ${complaint.location.ward}.`,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/citizen/complaints/${complaint.id}`,
    });

    this.notify();
    return complaint;
  }

  public updateComplaintStatus(
    id: string,
    newStatus: ComplaintStatus,
    actorRole: UserRole,
    actorName: string,
    notes?: string,
    evidence?: ResolutionEvidence
  ): Complaint | null {
    const index = this.complaints.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = this.complaints[index];
    const updatedHistory = [
      ...(current.statusHistory || []),
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        updatedBy: actorName,
        actorRole,
        actorName,
        notes: notes || `Status transitioned to ${newStatus}`,
        escalationLevel: current.escalationLevel,
      },
    ];

    const updated: Complaint = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      statusHistory: updatedHistory,
      ...(evidence ? { resolutionEvidence: evidence, resolvedAt: evidence.resolvedAt } : {}),
      ...(newStatus === 'RESOLVED' && !evidence ? { resolvedAt: new Date().toISOString() } : {}),
    };

    this.complaints[index] = updated;

    // Send notification to citizen
    let notifTitle = `Status updated to ${newStatus}`;
    let notifType: CivicNotification['type'] = 'COMPLAINT_ACCEPTED';

    if (newStatus === 'IN_PROGRESS') {
      notifTitle = 'Work in Progress';
      notifType = 'WORK_STARTED';
    } else if (newStatus === 'RESOLVED') {
      notifTitle = 'Complaint Resolved';
      notifType = 'COMPLAINT_RESOLVED';
    }

    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: current.citizenId,
      complaintId: current.id,
      type: notifType,
      title: notifTitle,
      message: notes || `Your complaint ${current.id} is now ${newStatus}.`,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/citizen/complaints/${current.id}`,
    });

    this.notify();
    return updated;
  }

  public escalateComplaint(
    id: string,
    targetLevel: EscalationLevelNumber,
    reason: string,
    actorName = 'CivicAI Escalation Engine'
  ): Complaint | null {
    const index = this.complaints.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = this.complaints[index];
    const updatedHistory = [
      ...(current.statusHistory || []),
      {
        status: 'ESCALATED' as ComplaintStatus,
        timestamp: new Date().toISOString(),
        updatedBy: actorName,
        actorRole: 'ADMIN' as UserRole,
        actorName,
        notes: `Escalated to Level ${targetLevel}: ${reason}`,
        escalationLevel: targetLevel,
      },
    ];

    const updated: Complaint = {
      ...current,
      status: 'ESCALATED',
      escalationLevel: targetLevel,
      escalationReason: reason,
      previousOfficerName: current.assignedOfficerName,
      assignedOfficerName:
        targetLevel === 2
          ? 'Kavitha Sundaram (Department Officer)'
          : targetLevel === 3
          ? 'M. Sundararajan (Zonal Supervisor)'
          : 'Dr. A. Arunkumar IAS (District Collector)',
      updatedAt: new Date().toISOString(),
      statusHistory: updatedHistory,
    };

    this.complaints[index] = updated;

    // Notify citizen and next level officer
    this.addNotification({
      id: `notif-${Date.now()}`,
      userId: current.citizenId,
      complaintId: current.id,
      type: 'COMPLAINT_ESCALATED',
      title: `Complaint Escalated to Level ${targetLevel}`,
      message: `Your complaint has been escalated because the response deadline was exceeded.`,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/citizen/complaints/${current.id}`,
    });

    this.notify();
    return updated;
  }

  public assignFieldTeam(complaintId: string, fieldTeamId: string, fieldTeamName: string, instructions: string): Complaint | null {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return null;

    const workOrder: WorkOrder = {
      id: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      complaintId,
      complaintTitle: complaint.description.substring(0, 50) + '...',
      category: complaint.category,
      priority: complaint.priority,
      location: complaint.location,
      fieldTeamId,
      fieldTeamName,
      status: 'ASSIGNED',
      assignedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      instructions,
      beforePhoto: complaint.imageUrls[0],
    };

    this.workOrders = [workOrder, ...this.workOrders];

    const updated = this.updateComplaintStatus(
      complaintId,
      'IN_PROGRESS',
      'SUPERVISOR',
      'M. Sundararajan',
      `Field Team '${fieldTeamName}' dispatched. Work Order ${workOrder.id} generated.`
    );

    if (updated) {
      updated.fieldTeamId = fieldTeamId;
      updated.fieldTeamName = fieldTeamName;
      this.notify();
    }

    return updated;
  }

  public getWorkOrders(fieldTeamId?: string): WorkOrder[] {
    if (!fieldTeamId) return [...this.workOrders];
    return this.workOrders.filter((w) => w.fieldTeamId === fieldTeamId);
  }

  public getWorkOrderById(id: string): WorkOrder | undefined {
    return this.workOrders.find((w) => w.id === id);
  }

  public updateWorkOrderStatus(
    workOrderId: string,
    status: WorkOrder['status'],
    afterPhoto?: string,
    completionNotes?: string
  ): WorkOrder | null {
    const index = this.workOrders.findIndex((w) => w.id === workOrderId);
    if (index === -1) return null;

    const current = this.workOrders[index];
    const updated: WorkOrder = {
      ...current,
      status,
      ...(afterPhoto ? { afterPhoto } : {}),
      ...(completionNotes ? { completionNotes } : {}),
      ...(status === 'COMPLETED' ? { completedAt: new Date().toISOString() } : {}),
    };

    this.workOrders[index] = updated;

    if (status === 'COMPLETED') {
      // Mark linked complaint as RESOLVED
      this.updateComplaintStatus(
        current.complaintId,
        'RESOLVED',
        'FIELD_TEAM',
        current.fieldTeamName,
        `Field work successfully executed. ${completionNotes || 'On-ground remediation completed.'}`,
        {
          beforeImageUrl: current.beforePhoto,
          afterImageUrl: afterPhoto,
          notes: completionNotes || 'Field team resolved defect according to municipal specifications.',
          resolvedAt: new Date().toISOString(),
          fieldTeamId: current.fieldTeamId,
          fieldTeamName: current.fieldTeamName,
        }
      );
    }

    this.notify();
    return updated;
  }

  public getNotifications(userId: string): CivicNotification[] {
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'ALL');
  }

  public addNotification(notification: CivicNotification) {
    this.notifications = [notification, ...this.notifications];
    this.notify();
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.notify();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.notify();
  }

  public getHotspots(): ComplaintCluster[] {
    return [...this.hotspots];
  }

  public getCityAnalytics(): CityAnalyticsSummary {
    return { ...this.analytics };
  }

  public resetToDefault() {
    this.complaints = [...INITIAL_COMPLAINTS];
    this.workOrders = [...INITIAL_WORK_ORDERS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.hotspots = [...INITIAL_HOTSPOTS];
    this.analytics = { ...INITIAL_CITY_ANALYTICS };
    localStorage.removeItem('civicai_demo_complaints');
    localStorage.removeItem('civicai_demo_notifications');
    localStorage.removeItem('civicai_demo_work_orders');
    this.notify();
  }
}

export const demoStore = new DemoStore();
