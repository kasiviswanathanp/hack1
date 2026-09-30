export type UserRole =
  | 'CITIZEN'
  | 'AREA_OFFICER'
  | 'DEPARTMENT_OFFICER'
  | 'SUPERVISOR'
  | 'DISTRICT_MANAGER'
  | 'ADMIN'
  | 'FIELD_TEAM';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  organizationId?: string;
  districtId?: string;
  zoneId?: string;
  wardId?: string;
  areaId?: string;
  departmentId?: string;
  avatarUrl?: string;
  badgeNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ComplaintCategory =
  | 'Road'
  | 'Water'
  | 'Drainage'
  | 'Street Light'
  | 'Electric Infrastructure'
  | 'Waste'
  | 'Flooding'
  | 'Public Infrastructure'
  | 'Other';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'REJECTED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type EscalationLevelNumber = 0 | 1 | 2 | 3 | 4;

export interface EscalationLevelInfo {
  level: EscalationLevelNumber;
  title: string;
  role: UserRole;
  roleLabel: string;
  maxSlaHours: number;
}

export interface ComplaintLocation {
  latitude: number;
  longitude: number;
  readableAddress: string;
  area: string;
  ward: string;
  zone?: string;
  district?: string;
  municipality?: string;
}

export interface AIAnalysisResult {
  issueType: string;
  category: ComplaintCategory;
  severity: PriorityLevel;
  confidence: number; // e.g. 0.94 (94%)
  detectedDescription: string;
  suggestedDepartment: string;
  suggestedPriority: PriorityLevel;
  tags: string[];
  reasoning?: string;
  detectedAt?: string;
}

export interface ResolutionEvidence {
  beforeImageUrl?: string;
  afterImageUrl?: string;
  notes: string;
  resolvedAt: string;
  verifiedBy?: string;
  fieldTeamId?: string;
  fieldTeamName?: string;
}

export interface StatusHistoryEntry {
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  actorRole: UserRole;
  actorName: string;
  notes?: string;
  escalationLevel?: EscalationLevelNumber;
}

export interface Complaint {
  id: string; // e.g. CIV-2026-001245
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  organizationId: string;
  category: ComplaintCategory;
  description: string;
  landmark?: string;
  imageUrls: string[];
  location: ComplaintLocation;
  areaId: string;
  wardId: string;
  zoneId?: string;
  districtId?: string;

  aiAnalysis: AIAnalysisResult;
  priority: PriorityLevel;
  priorityScore: number; // 0 - 100

  departmentId: string;
  departmentName?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  fieldTeamId?: string;
  fieldTeamName?: string;

  status: ComplaintStatus;
  escalationLevel: EscalationLevelNumber;
  escalationReason?: string;
  previousOfficerName?: string;

  createdAt: string;
  updatedAt: string;
  responseDeadline: string; // ISO date
  resolutionDeadline: string; // ISO date
  resolvedAt?: string;
  resolutionEvidence?: ResolutionEvidence;
  statusHistory?: StatusHistoryEntry[];

  // AI Area Surge & Hotspot Prioritization
  isAiHotspot?: boolean;
  hotspotSurgeScore?: number;
  areaReportCount?: number;
  isHighestSurgeArea?: boolean;
  hotspotCategory?: string;
  hotspotAdvisory?: string;
}

export interface WorkOrder {
  id: string; // WO-2026-0081
  complaintId: string;
  complaintTitle: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  location: ComplaintLocation;
  fieldTeamId: string;
  fieldTeamName: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';
  assignedDate: string;
  deadline: string;
  instructions: string;
  beforePhoto?: string;
  afterPhoto?: string;
  completionNotes?: string;
  completedAt?: string;
}

export type NotificationType =
  | 'COMPLAINT_SUBMITTED'
  | 'COMPLAINT_ACCEPTED'
  | 'OFFICER_ASSIGNED'
  | 'WORK_STARTED'
  | 'COMPLAINT_ESCALATED'
  | 'FIELD_TEAM_ASSIGNED'
  | 'WORK_COMPLETED'
  | 'COMPLAINT_RESOLVED'
  | 'SLA_WARNING';

export interface CivicNotification {
  id: string;
  userId: string;
  complaintId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ComplaintCluster {
  id: string;
  areaName: string;
  ward: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  totalCount: number;
  openCount: number;
  resolvedCount: number;
  criticalCount: number;
  topCategory: ComplaintCategory;
  categoryBreakdown: Record<string, number>;
  averageResponseTimeHours: number;
  severityLevel: 'HIGH' | 'MEDIUM' | 'LOW'; // Red, Yellow, Green
}

export interface CityAnalyticsSummary {
  totalComplaints: number;
  openComplaints: number;
  criticalIssues: number;
  escalatedIssues: number;
  resolvedIssues: number;
  averageResponseTimeHours: number;
  averageResolutionTimeHours: number;
  resolutionRatePercent: number;
  escalationRatePercent: number;
  categoryDistribution: { category: ComplaintCategory; count: number; percentage: number }[];
  areaDistribution: { area: string; count: number; open: number; resolved: number }[];
  weeklyTrend: { date: string; submitted: number; resolved: number; escalated: number }[];
}

export interface AreaHierarchyNode {
  id: string;
  name: string;
  type: 'CITY' | 'ZONE' | 'WARD' | 'AREA';
  code: string;
  officerInCharge?: string;
  contactNumber?: string;
  parentId?: string;
  children?: AreaHierarchyNode[];
}
