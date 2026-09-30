import { ComplaintCategory, EscalationLevelInfo, PriorityLevel, UserRole } from '@/types';

export const APP_NAME = 'CivicAI';
export const APP_TAGLINE = 'Report. Resolve. Improve Your City.';

export const ROLES: { id: UserRole; label: string; description: string; path: string }[] = [
  {
    id: 'CITIZEN',
    label: 'Citizen',
    description: 'Report civic issues, track progress & receive updates',
    path: '/citizen',
  },
  {
    id: 'AREA_OFFICER',
    label: 'Area Officer',
    description: 'Level 1 responder managing ward-level issues & dispatching',
    path: '/officer',
  },
  {
    id: 'DEPARTMENT_OFFICER',
    label: 'Department Officer',
    description: 'Level 2 supervisor managing department-specific workflows',
    path: '/officer',
  },
  {
    id: 'SUPERVISOR',
    label: 'Zonal Supervisor',
    description: 'Level 3 oversight handling SLA escalations & field teams',
    path: '/supervisor',
  },
  {
    id: 'DISTRICT_MANAGER',
    label: 'District Manager',
    description: 'Executive oversight, city hotspot maps & SLA governance',
    path: '/management',
  },
  {
    id: 'FIELD_TEAM',
    label: 'Field Team',
    description: 'On-ground response team uploading proof of resolution',
    path: '/field-team',
  },
  {
    id: 'ADMIN',
    label: 'System Admin',
    description: 'Hierarchy mapping, department routing & system audits',
    path: '/admin',
  },
];

export const CATEGORIES: {
  id: ComplaintCategory;
  label: string;
  department: string;
  defaultSlaHours: number;
  iconName: string;
  color: string;
}[] = [
  {
    id: 'Road',
    label: 'Road & Potholes',
    department: 'Municipal Roads & Infrastructure',
    defaultSlaHours: 24,
    iconName: 'Construction',
    color: 'amber',
  },
  {
    id: 'Water',
    label: 'Water Supply & Leakage',
    department: 'Metro Water & Sewerage Board',
    defaultSlaHours: 12,
    iconName: 'Droplets',
    color: 'blue',
  },
  {
    id: 'Drainage',
    label: 'Drainage & Sewage Overflow',
    department: 'Sanitation & Drainage Operations',
    defaultSlaHours: 18,
    iconName: 'Waves',
    color: 'cyan',
  },
  {
    id: 'Street Light',
    label: 'Street Light Outage',
    department: 'Electrical Lighting Maintenance',
    defaultSlaHours: 24,
    iconName: 'Lightbulb',
    color: 'yellow',
  },
  {
    id: 'Electric Infrastructure',
    label: 'Damaged Electric Cables/Poles',
    department: 'Electricity Board & Safety Grid',
    defaultSlaHours: 8,
    iconName: 'Zap',
    color: 'orange',
  },
  {
    id: 'Waste',
    label: 'Garbage & Waste Disposal',
    department: 'Solid Waste Management',
    defaultSlaHours: 16,
    iconName: 'Trash2',
    color: 'emerald',
  },
  {
    id: 'Flooding',
    label: 'Waterlogging & Flooding',
    department: 'Disaster Management & Storm Water',
    defaultSlaHours: 6,
    iconName: 'AlertTriangle',
    color: 'rose',
  },
  {
    id: 'Public Infrastructure',
    label: 'Public Park / Footpath Damage',
    department: 'Civic Assets & Parks Division',
    defaultSlaHours: 48,
    iconName: 'Building2',
    color: 'indigo',
  },
  {
    id: 'Other',
    label: 'General Civic Grievance',
    department: 'General Administration Grievance Cell',
    defaultSlaHours: 36,
    iconName: 'HelpCircle',
    color: 'slate',
  },
];

export const ESCALATION_LEVELS: EscalationLevelInfo[] = [
  {
    level: 0,
    title: 'Standard Intake',
    role: 'CITIZEN',
    roleLabel: 'Citizen Submission',
    maxSlaHours: 0,
  },
  {
    level: 1,
    title: 'Level 1: Ward Level',
    role: 'AREA_OFFICER',
    roleLabel: 'Area Officer',
    maxSlaHours: 24,
  },
  {
    level: 2,
    title: 'Level 2: Department Oversight',
    role: 'DEPARTMENT_OFFICER',
    roleLabel: 'Department Officer',
    maxSlaHours: 18,
  },
  {
    level: 3,
    title: 'Level 3: Zonal Supervision',
    role: 'SUPERVISOR',
    roleLabel: 'Zonal Supervisor',
    maxSlaHours: 12,
  },
  {
    level: 4,
    title: 'Level 4: Executive District Control',
    role: 'DISTRICT_MANAGER',
    roleLabel: 'District Manager',
    maxSlaHours: 8,
  },
];

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; text: string; border: string }
> = {
  SUBMITTED: {
    label: 'Submitted',
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'amber',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  ASSIGNED: {
    label: 'Assigned',
    color: 'indigo',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'purple',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  ESCALATED: {
    label: 'Escalated',
    color: 'rose',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'emerald',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'slate',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
  },
};

export const PRIORITY_CONFIG: Record<
  PriorityLevel,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  CRITICAL: {
    label: 'Critical',
    bg: 'bg-red-500/10',
    text: 'text-red-700',
    dot: 'bg-red-600',
    border: 'border-red-200',
  },
  HIGH: {
    label: 'High',
    bg: 'bg-amber-500/10',
    text: 'text-amber-700',
    dot: 'bg-amber-600',
    border: 'border-amber-200',
  },
  MEDIUM: {
    label: 'Medium',
    bg: 'bg-blue-500/10',
    text: 'text-blue-700',
    dot: 'bg-blue-600',
    border: 'border-blue-200',
  },
  LOW: {
    label: 'Low',
    bg: 'bg-slate-500/10',
    text: 'text-slate-700',
    dot: 'bg-slate-500',
    border: 'border-slate-200',
  },
};

export const DEMO_AREAS = [
  { area: 'Anna Nagar West', ward: 'Ward 102', zone: 'Zone 8 (Central)', district: 'Chennai District' },
  { area: 'T. Nagar Commercial', ward: 'Ward 114', zone: 'Zone 10 (South)', district: 'Chennai District' },
  { area: 'Adyar Canal Corridor', ward: 'Ward 173', zone: 'Zone 13 (South-East)', district: 'Chennai District' },
  { area: 'Velachery Bypass Road', ward: 'Ward 178', zone: 'Zone 14 (South)', district: 'Chennai District' },
  { area: 'Mylapore Heritage Zone', ward: 'Ward 121', zone: 'Zone 9 (Central-East)', district: 'Chennai District' },
  { area: 'Kilpauk Medical Enclave', ward: 'Ward 104', zone: 'Zone 8 (Central)', district: 'Chennai District' },
];
