import React from 'react';
import { Complaint, ComplaintStatus } from '@/types';
import { formatDate } from '@/utils';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  AlertTriangle,
  HardHat,
  Wrench,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/utils';

export interface TimelineStep {
  title: string;
  description: string;
  timestamp?: string;
  actor?: string;
  status: 'completed' | 'current' | 'upcoming' | 'escalated';
  icon: React.ReactNode;
}

export const ComplaintTimeline: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  const isEscalated = complaint.status === 'ESCALATED' || complaint.escalationLevel > 1;

  // Build sequential steps based on complaint history and state
  const steps: TimelineStep[] = [
    {
      title: 'Complaint Submitted',
      description: `Reported by ${complaint.citizenName} via CivicAI citizen portal.`,
      timestamp: complaint.createdAt,
      status: 'completed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    {
      title: 'AI Analysis & Triage',
      description: `Google Gemini classified issue as ${complaint.aiAnalysis?.issueType || complaint.category} (${Math.round((complaint.aiAnalysis?.confidence || 0.9) * 100)}% confidence).`,
      timestamp: complaint.aiAnalysis?.detectedAt || complaint.createdAt,
      status: 'completed',
      icon: <Sparkles className="w-4 h-4 text-blue-600" />,
    },
  ];

  if (isEscalated) {
    steps.push({
      title: 'Assigned to Area Officer (Level 1)',
      description: `Assigned to ${complaint.previousOfficerName || 'Ward Area Officer'}. SLA response window initiated.`,
      timestamp: complaint.createdAt,
      status: 'completed',
      icon: <UserCheck className="w-4 h-4 text-slate-500" />,
    });

    steps.push({
      title: 'Escalation Notice',
      description:
        complaint.escalationReason ||
        'Escalated because response deadline was exceeded. Transferred to supervisory oversight.',
      timestamp: complaint.updatedAt,
      status: 'escalated',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />,
    });

    steps.push({
      title: `Escalated to Level ${complaint.escalationLevel}`,
      description: `Assigned to ${complaint.assignedOfficerName || 'Zonal Supervisor'} for priority dispatch.`,
      timestamp: complaint.updatedAt,
      status: complaint.status === 'ESCALATED' ? 'current' : 'completed',
      icon: <UserCheck className="w-4 h-4 text-amber-600" />,
    });
  } else {
    steps.push({
      title: 'Assigned to Responsible Officer',
      description: `Assigned to ${complaint.assignedOfficerName || 'Ward Area Officer'}.`,
      timestamp: complaint.status !== 'SUBMITTED' ? complaint.updatedAt : undefined,
      status: complaint.status === 'SUBMITTED' ? 'upcoming' : 'completed',
      icon: <UserCheck className="w-4 h-4 text-blue-600" />,
    });
  }

  // Field Team & Work step
  const hasFieldTeam = Boolean(complaint.fieldTeamId || complaint.fieldTeamName);
  const isWorkInProgress = complaint.status === 'IN_PROGRESS';
  const isResolved = complaint.status === 'RESOLVED';

  steps.push({
    title: 'Field Team Mobilization',
    description: hasFieldTeam
      ? `Dispatched ${complaint.fieldTeamName || 'Municipal Response Crew'} for on-site execution.`
      : 'Awaiting field crew dispatch.',
    status: hasFieldTeam ? (isWorkInProgress ? 'current' : 'completed') : 'upcoming',
    icon: <HardHat className="w-4 h-4 text-indigo-600" />,
  });

  steps.push({
    title: 'Remediation Work',
    description: isWorkInProgress
      ? 'On-site remediation and structural repair in progress.'
      : isResolved
      ? 'Remediation work completed.'
      : 'Scheduled for ground crew execution.',
    status: isWorkInProgress ? 'current' : isResolved ? 'completed' : 'upcoming',
    icon: <Wrench className="w-4 h-4 text-purple-600" />,
  });

  steps.push({
    title: 'Resolution Verified',
    description: isResolved
      ? complaint.resolutionEvidence?.notes || 'Verified resolved with before/after evidence photos.'
      : 'Awaiting final verification and inspection photo.',
    timestamp: complaint.resolvedAt,
    status: isResolved ? 'completed' : 'upcoming',
    icon: <CheckCheck className="w-4 h-4 text-emerald-600" />,
  });

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-slate-200">
      {steps.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isStepEscalated = step.status === 'escalated';

        return (
          <div key={idx} className="relative group text-left">
            {/* Step node dot */}
            <div
              className={cn(
                'absolute -left-6 top-1 flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white transition-all',
                isCompleted
                  ? 'border-emerald-500 text-emerald-600 shadow-xs'
                  : isStepEscalated
                  ? 'border-rose-500 bg-rose-50 text-rose-600 animate-pulse'
                  : isCurrent
                  ? 'border-blue-600 bg-blue-50 text-blue-600 ring-4 ring-blue-100'
                  : 'border-slate-300 text-slate-300'
              )}
            >
              {step.icon}
            </div>

            <div
              className={cn(
                'rounded-xl p-3.5 border transition-all',
                isStepEscalated
                  ? 'bg-rose-50/70 border-rose-200'
                  : isCurrent
                  ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                  : isCompleted
                  ? 'bg-white border-slate-200/80'
                  : 'bg-slate-50/50 border-slate-200/50 opacity-60'
              )}
            >
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span
                  className={cn(
                    'text-xs md:text-sm font-bold',
                    isStepEscalated
                      ? 'text-rose-900'
                      : isCurrent
                      ? 'text-blue-900'
                      : 'text-slate-800'
                  )}
                >
                  {step.title}
                </span>
                {step.timestamp && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDate(step.timestamp)}
                  </span>
                )}
              </div>

              <p
                className={cn(
                  'text-xs mt-1 leading-relaxed',
                  isStepEscalated ? 'text-rose-800' : 'text-slate-600'
                )}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
