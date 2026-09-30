import React from 'react';
import { Complaint } from '@/types';
import { calculateSLA, formatDate } from '@/utils';
import { ESCALATION_LEVELS } from '@/constants';
import { AlertTriangle, Clock, ArrowDown, ShieldAlert, CheckCircle, UserCheck } from 'lucide-react';
import { cn } from '@/utils';

export const EscalationTracker: React.FC<{ complaint: Complaint; className?: string }> = ({
  complaint,
  className,
}) => {
  const sla = calculateSLA(complaint.responseDeadline, complaint.createdAt);
  const currentLevel = complaint.escalationLevel || 1;
  const isEscalated = complaint.status === 'ESCALATED' || currentLevel > 1;

  return (
    <div
      className={cn(
        'rounded-2xl border p-5 md:p-6 text-left transition-all shadow-xs',
        isEscalated
          ? 'bg-rose-50/40 border-rose-200'
          : sla.badgeVariant === 'critical'
          ? 'bg-amber-50/40 border-amber-200'
          : 'bg-white border-slate-200',
        className
      )}
    >
      {/* Top Header Card */}
      <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200/80">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Automated SLA & Governance
          </span>
          <h4 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2 mt-0.5">
            {isEscalated ? (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Hierarchical Escalation Active</span>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Response SLA Monitor</span>
              </>
            )}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {sla.isOverdue ? (
            <div className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue ({sla.overdueDurationText})</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{sla.timeRemainingText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Primary 4-Level Escalation Ladder */}
      <div className="mt-5 space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Municipal Routing Hierarchy
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
          {ESCALATION_LEVELS.filter((l) => l.level > 0).map((lvl) => {
            const isPassed = currentLevel > lvl.level;
            const isCurrent = currentLevel === lvl.level;
            const isFuture = currentLevel < lvl.level;

            return (
              <div
                key={lvl.level}
                className={cn(
                  'rounded-xl p-3 border text-left flex flex-col justify-between transition-all',
                  isCurrent && isEscalated
                    ? 'border-rose-400 bg-rose-100/70 shadow-xs ring-2 ring-rose-200'
                    : isCurrent
                    ? 'border-blue-400 bg-blue-50/70 shadow-xs ring-2 ring-blue-200'
                    : isPassed
                    ? 'border-slate-200 bg-slate-50 opacity-70'
                    : 'border-dashed border-slate-200 bg-slate-50/40 opacity-40'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                      Level {lvl.level}
                    </span>
                    {isPassed ? (
                      <span className="text-[10px] font-bold text-rose-600">SLA Exceeded</span>
                    ) : isCurrent ? (
                      <span
                        className={cn(
                          'text-[10px] font-extrabold uppercase',
                          isEscalated ? 'text-rose-700' : 'text-blue-700'
                        )}
                      >
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Next</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900 text-xs truncate">{lvl.roleLabel}</p>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  SLA: {lvl.maxSlaHours}h window
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escalation Details Box (Section 33 requirements) */}
      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">RESPONSE DEADLINE</span>
            <span className="font-bold font-mono text-slate-900">{formatDate(complaint.responseDeadline)}</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">CURRENT LEVEL</span>
            <span className="font-bold text-slate-900">
              Level {complaint.escalationLevel} ({complaint.status})
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">CURRENT RESPONSIBLE OWNER</span>
            <span className="font-bold text-blue-700 truncate block">
              {complaint.assignedOfficerName || 'Ward Area Officer'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">PREVIOUS ASSIGNEE</span>
            <span className="font-medium text-slate-700 truncate block">
              {complaint.previousOfficerName || 'Ward Intake'}
            </span>
          </div>
        </div>

        {complaint.escalationReason && (
          <div className="pt-3 border-t border-slate-200 flex items-start gap-2.5 text-xs text-rose-800 bg-rose-50/70 p-3 rounded-lg border border-rose-200/80">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Why it escalated:</span>
              <p className="mt-0.5 leading-relaxed">{complaint.escalationReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
