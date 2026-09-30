import React, { useMemo } from 'react';
import { useComplaints } from '@/hooks/useComplaints';
import { StatsCard } from '@/components/common/StatsAndDialog';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { useAuth } from '@/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { aiSurgeService } from '@/services/aiSurgeService';
import {
  Inbox,
  Clock,
  AlertCircle,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Radio,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export const OfficerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { complaints, counts, isLoading } = useComplaints();

  // AI Area Surge Analytics
  const hotspotAnalytics = useMemo(() => {
    return aiSurgeService.computeAreaSurgeAnalytics(complaints);
  }, [complaints]);

  const topHotspot = hotspotAnalytics.topHotspot;

  const assignedComplaints = useMemo(() => {
    const list = complaints.filter(
      (c) => c.status === 'ASSIGNED' || c.status === 'UNDER_REVIEW' || c.status === 'SUBMITTED'
    );
    // Prioritize high-frequency area complaints to the TOP
    return aiSurgeService.prioritizeComplaintsByAiHotspot(list);
  }, [complaints]);

  const escalatedComplaints = useMemo(() => {
    const list = complaints.filter(
      (c) => c.status === 'ESCALATED' || c.escalationLevel > 1
    );
    return aiSurgeService.prioritizeComplaintsByAiHotspot(list);
  }, [complaints]);

  return (
    <div className="space-y-6 text-left">
      {/* Officer Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            {currentUser?.departmentId || 'Municipal Roads & Infrastructure'}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            Officer Operational Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ward Officer {currentUser?.displayName} • Jurisdiction: {currentUser?.wardId || 'Ward 102'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/officer/priority')}
            leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
          >
            Priority Queue ({counts.critical})
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/officer/escalations')}
            leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-white" />}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Escalations ({counts.escalated})
          </Button>
        </div>
      </div>

      {/* 6 Required Dashboard Cards (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard
          title="Total Assigned"
          value={counts.all}
          subtitle="All grievances"
          icon={<Inbox className="w-4 h-4 text-blue-600" />}
          onClick={() => navigate('/officer/complaints')}
        />

        <StatsCard
          title="Active SLA"
          value={counts.all - counts.resolved - counts.escalated}
          subtitle="Under strict timer"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          onClick={() => navigate('/officer/priority')}
        />

        <StatsCard
          title="Critical Queue"
          value={counts.critical}
          subtitle="Immediate triage"
          icon={<AlertCircle className="w-4 h-4 text-red-600" />}
          badgeVariant="critical"
          onClick={() => navigate('/officer/priority')}
        />

        <StatsCard
          title="Field Operations"
          value={counts.inProgress}
          subtitle="Crew on-ground"
          icon={<Wrench className="w-4 h-4 text-indigo-600" />}
          onClick={() => navigate('/officer/field-teams')}
        />

        <StatsCard
          title="Escalated"
          value={counts.escalated}
          subtitle="Supervisory notice"
          icon={<ShieldAlert className="w-4 h-4 text-rose-600" />}
          badgeText="Overdue"
          badgeVariant="critical"
          onClick={() => navigate('/officer/escalations')}
        />

        <StatsCard
          title="Resolved"
          value={counts.resolved}
          subtitle="100% verified"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          badgeVariant="safe"
          onClick={() => navigate('/officer/complaints')}
        />
      </div>

      {/* AI AREA SURGE & HOTSPOT ALERT BANNER */}
      {topHotspot && topHotspot.totalReports >= 2 && (
        <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-amber-50 to-white p-4 sm:p-5 shadow-xs text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase">
                <Radio className="w-3 h-3 animate-pulse" />
                AI Area Surge Active
              </span>
              <span className="text-xs font-bold text-rose-800 font-mono">
                {topHotspot.totalReports} Correlated Reports ({topHotspot.surgeMultiplier}x Surge)
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Hotspot Concentration in {topHotspot.areaName} ({topHotspot.wardId})
            </h3>
            <p className="text-xs text-slate-600">
              {topHotspot.aiAdvisory} These complaints have been automatically bumped to the top of your operational queue.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            className="bg-rose-600 hover:bg-rose-500 font-bold text-xs shrink-0"
            onClick={() => navigate('/officer/priority')}
            leftIcon={<Flame className="w-3.5 h-3.5" />}
          >
            Review {topHotspot.areaName} Hotspot Queue
          </Button>
        </div>
      )}

      {/* Two Column Layout: Urgent SLA Escalations & High Priority Assigned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalated Issues Urgent Action Box */}
        <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">SLA Escalation Alerts</h3>
                <span className="text-[11px] text-slate-500">
                  Response SLA breached without acknowledgement
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/officer/escalations')}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({escalatedComplaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {escalatedComplaints.slice(0, 3).map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                linkPrefix="/officer/complaints"
              />
            ))}
          </div>
        </div>

        {/* Assigned Pending Action */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Assigned Ward Queue</h3>
                <span className="text-[11px] text-slate-500">Auto-prioritized with High Surge at Top</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/officer/complaints')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all ({assignedComplaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {assignedComplaints.slice(0, 3).map((c) => (
              <ComplaintCard
                key={c.id}
                complaint={c}
                linkPrefix="/officer/complaints"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
