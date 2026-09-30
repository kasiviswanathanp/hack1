import React, { useState, useMemo } from 'react';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/store/AuthContext';
import { StatusBadge, PriorityBadge } from '@/components/common/Badge';
import { SLAIndicator } from '@/components/complaints/SLAIndicator';
import { DataTable, Column } from '@/components/common/DataTable';
import { Complaint } from '@/types';
import { calculateSLA, formatDate } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { aiSurgeService } from '@/services/aiSurgeService';
import {
  ShieldAlert,
  AlertTriangle,
  Eye,
  Flame,
  Radio,
  MapPin,
  Send,
  HardHat,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils';

export const SupervisorEscalations: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const supervisorZone = currentUser?.zoneId || 'Zone 8 (Central)';

  // Fetch all complaints for comprehensive AI Area Surge detection
  const { complaints: allComplaints, isLoading: allLoading } = useComplaints();
  const [filterHotspotOnly, setFilterHotspotOnly] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Compute AI surge specifically for this Supervisor's zone
  const zoneSurgeInfo = useMemo(() => {
    return aiSurgeService.getSupervisorZoneHotspots(allComplaints, supervisorZone);
  }, [allComplaints, supervisorZone]);

  // Sort complaints so the high-frequency area complaints appear at the VERY TOP
  const prioritizedComplaints = useMemo(() => {
    // Start with escalated or high priority complaints
    const relevant = allComplaints.filter((c) => {
      if (filterHotspotOnly && zoneSurgeInfo.topArea) {
        return (c.location?.area || c.areaId) === zoneSurgeInfo.topArea.areaName;
      }
      return c.status === 'ESCALATED' || c.escalationLevel > 1 || c.priority === 'CRITICAL' || c.priority === 'HIGH';
    });

    return aiSurgeService.prioritizeComplaintsByAiHotspot(relevant);
  }, [allComplaints, filterHotspotOnly, zoneSurgeInfo]);

  const handleQuickDispatch = (areaName: string) => {
    setDispatchSuccess(`Emergency field dispatch order broadcast to Team Bravo for ${areaName}.`);
    setTimeout(() => setDispatchSuccess(null), 5000);
  };

  const columns: Column<Complaint>[] = [
    {
      key: 'id',
      header: 'Complaint & AI Priority',
      render: (c: Complaint) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-slate-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              #{c.id}
            </span>
            {c.isHighestSurgeArea && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white">
                <Flame className="w-2.5 h-2.5" />
                AI Top Priority
              </span>
            )}
          </div>
          {c.isHighestSurgeArea && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded border border-rose-200">
              <Radio className="w-2.5 h-2.5 text-rose-600 animate-pulse" />
              Surge Cluster ({c.areaReportCount} reports)
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'area',
      header: 'Area & Ward',
      render: (c) => (
        <div>
          <span className={cn('font-bold block text-xs truncate max-w-[150px]', c.isHighestSurgeArea ? 'text-rose-700 font-extrabold' : 'text-slate-800')}>
            {c.location?.area || c.areaId}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">{c.location?.ward || c.wardId}</span>
        </div>
      ),
    },
    {
      key: 'issue',
      header: 'Issue Category',
      render: (c) => (
        <div className="space-y-1">
          <span className="font-bold text-slate-900 block text-xs truncate max-w-[170px]">
            {c.aiAnalysis?.issueType || c.category}
          </span>
          <PriorityBadge priority={c.priority} />
        </div>
      ),
    },
    {
      key: 'officer',
      header: 'Assigned Officer',
      render: (c) => (
        <span className="text-xs font-medium text-slate-700 block truncate max-w-[140px]">
          {c.assignedOfficerName || 'Ward Area Officer'}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Escalation Level',
      render: (c) => (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          Level {c.escalationLevel || 1}
        </span>
      ),
    },
    {
      key: 'deadline',
      header: 'SLA Response Deadline',
      render: (c) => (
        <div className="text-xs font-mono text-slate-600">
          <SLAIndicator deadlineIso={c.responseDeadline} compact />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'action',
      header: 'Action',
      render: (c) => (
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          className="bg-rose-600 hover:bg-rose-500 font-bold"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/supervisor/complaints/${c.id}`);
          }}
        >
          Review Escalation
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">
              Zonal Supervisor Escalation Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jurisdiction: <strong className="text-slate-800">{supervisorZone}</strong> • Automatic AI clustering prioritizes high-frequency complaints to the top of your docket.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterHotspotOnly(!filterHotspotOnly)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border',
              filterHotspotOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Show Only Top Surge Area</span>
          </button>
        </div>
      </div>

      {/* DISPATCH TOAST ALERT */}
      {dispatchSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* SPECIFIC AREA HOTSPOT SUPERVISOR BANNER (User requirement: "ஒவ்வொரு பர்டிகுலர் ஏரியாக்கும் உள்ள அந்த சூப்பர்வைசர்ட்ட போய் காமிக்கணும்") */}
      {zoneSurgeInfo.topArea && (
        <div className="rounded-3xl border border-rose-300 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 p-6 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-wider uppercase shadow-md">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
                  <span>AI Surge Detected in Your Zone</span>
                </span>
                <span className="text-xs font-mono text-rose-300">
                  {zoneSurgeInfo.topArea.wardId} • {zoneSurgeInfo.topArea.totalReports} Correlated Grievances
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Critical Grievance Surge: {zoneSurgeInfo.topArea.areaName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The CivicAI intelligence engine detected an acute concentration of <strong>{zoneSurgeInfo.topArea.totalReports} civic reports</strong> in {zoneSurgeInfo.topArea.areaName}. All {zoneSurgeInfo.topArea.totalReports} complaints have been <strong>auto-promoted to Rank #1, #2, #3 at the TOP of your escalation queue</strong> below.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-rose-200">
                <span className="flex items-center gap-1 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Primary Issue: {zoneSurgeInfo.topArea.primaryCategory}
                </span>
                <span>•</span>
                <span>{zoneSurgeInfo.topArea.criticalReports} Critical Hazards</span>
                <span>•</span>
                <span className="font-mono text-amber-300">{zoneSurgeInfo.topArea.surgeMultiplier}x Average Rate</span>
              </div>
            </div>

            {/* Quick Supervisor Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <Button
                variant="primary"
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 font-bold text-xs shadow-md shadow-rose-600/40"
                leftIcon={<HardHat className="w-4 h-4" />}
                onClick={() => handleQuickDispatch(zoneSurgeInfo.topArea!.areaName)}
              >
                Mobilize Rapid Field Team
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-white border-slate-700 hover:bg-slate-800 text-xs"
                leftIcon={<Send className="w-3.5 h-3.5 text-blue-400" />}
                onClick={() => handleQuickDispatch(`Notice to ${zoneSurgeInfo.topArea?.wardId} Officer`)}
              >
                Issue Priority Notice to Ward Officer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Escalation Queue Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="font-semibold text-slate-700">
            Active Priority Docket ({prioritizedComplaints.length} cases)
          </span>
          <span className="text-[11px] font-mono text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            🔥 High-Surge Area Complaints Pinned at Top
          </span>
        </div>

        <DataTable<Complaint>
          columns={columns}
          data={prioritizedComplaints}
          keyExtractor={(c) => c.id}
          onRowClick={(c: Complaint) => navigate(`/supervisor/complaints/${c.id}`)}
        />
      </div>
    </div>
  );
};
