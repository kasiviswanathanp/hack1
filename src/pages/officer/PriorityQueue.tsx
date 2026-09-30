import React, { useState, useMemo } from 'react';
import { useComplaints } from '@/hooks/useComplaints';
import { PriorityBadge, StatusBadge } from '@/components/common/Badge';
import { SLAIndicator } from '@/components/complaints/SLAIndicator';
import { DataTable, Column } from '@/components/common/DataTable';
import { Complaint, PriorityLevel, ComplaintStatus, ComplaintCategory } from '@/types';
import { CATEGORIES, DEMO_AREAS } from '@/constants';
import { formatTimeRelative } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { aiSurgeService } from '@/services/aiSurgeService';
import {
  AlertOctagon,
  Eye,
  Sparkles,
  Flame,
  Radio,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { cn } from '@/utils';

export const PriorityQueue: React.FC = () => {
  const navigate = useNavigate();

  // Filters
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');
  const [aiHotspotBoost, setAiHotspotBoost] = useState<boolean>(true);

  const { complaints, isLoading } = useComplaints({
    priority: selectedPriority,
    category: selectedCategory,
    status: selectedStatus,
    sortBy: aiHotspotBoost ? 'aiHotspot' : 'priority',
  });

  // AI Area Surge Analytics
  const hotspotAnalytics = useMemo(() => {
    return aiSurgeService.computeAreaSurgeAnalytics(complaints);
  }, [complaints]);

  // Apply Area filter & AI Area Surge ranking
  const displayedComplaints = useMemo(() => {
    let list = [...complaints];
    if (selectedArea !== 'ALL') {
      list = list.filter((c) => (c.location?.area || c.areaId) === selectedArea);
    }
    if (aiHotspotBoost) {
      list = aiSurgeService.prioritizeComplaintsByAiHotspot(list);
    }
    return list;
  }, [complaints, selectedArea, aiHotspotBoost]);

  const topHotspot = hotspotAnalytics.topHotspot;

  const columns: Column<Complaint>[] = [
    {
      key: 'id',
      header: 'Complaint & AI Rank',
      render: (c: Complaint) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              #{c.id}
            </span>
            {c.isHighestSurgeArea && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-600 text-white shadow-2xs">
                <Flame className="w-2.5 h-2.5" />
                AI Top Priority
              </span>
            )}
          </div>
          {c.isHighestSurgeArea && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
              Hotspot Cluster ({c.areaReportCount} reports)
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'issue',
      header: 'Issue / Category',
      render: (c) => (
        <div>
          <span className="font-bold text-slate-900 block truncate max-w-[180px]">
            {c.aiAnalysis?.issueType || c.category}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">{c.category}</span>
        </div>
      ),
    },
    {
      key: 'area',
      header: 'Area & Ward',
      render: (c) => {
        const isHotspot = c.isHighestSurgeArea;
        return (
          <div className="text-xs">
            <div className="flex items-center gap-1">
              <span className={cn('font-bold block truncate max-w-[140px]', isHotspot ? 'text-rose-700 font-extrabold' : 'text-slate-800')}>
                {c.location?.area || c.areaId}
              </span>
              {isHotspot && (
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" title="Active Surge Hotspot" />
              )}
            </div>
            <span className="text-slate-400 font-mono text-[11px]">{c.location?.ward || c.wardId}</span>
          </div>
        );
      },
    },
    {
      key: 'priority',
      header: 'Severity Priority',
      render: (c) => <PriorityBadge priority={c.priority} />,
    },
    {
      key: 'age',
      header: 'Logged',
      render: (c) => (
        <span className="text-xs text-slate-500 font-mono">
          {formatTimeRelative(c.createdAt)}
        </span>
      ),
    },
    {
      key: 'sla',
      header: 'Response SLA',
      render: (c) => <SLAIndicator deadlineIso={c.responseDeadline} compact />,
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
          variant="outline"
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/officer/complaints/${c.id}`);
          }}
        >
          Review
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
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Officer Priority Queue</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            AI-powered intake prioritizing high-density area complaint surges and urgent SLA deadlines.
          </p>
        </div>

        {/* AI Hotspot Boost Switch */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl shadow-2xs">
          <button
            type="button"
            onClick={() => setAiHotspotBoost(!aiHotspotBoost)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              aiHotspotBoost
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>AI Hotspot Prioritization: {aiHotspotBoost ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* AI AREA SURGE & HOTSPOT RADAR BANNER */}
      {topHotspot && topHotspot.totalReports >= 2 && (
        <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-amber-50 to-white p-5 shadow-xs text-left relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
                  <Radio className="w-3 h-3 animate-pulse" />
                  AI Hotspot Cluster Detected
                </span>
                <span className="text-xs font-bold text-rose-800 font-mono">
                  {topHotspot.surgeMultiplier}x Grievance Surge
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900">
                Highest Complaint Volume: {topHotspot.areaName} ({topHotspot.wardId})
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI engine detected <strong>{topHotspot.totalReports} correlated reports</strong> in {topHotspot.areaName} (primarily {topHotspot.primaryCategory} defects). Complaints from this surge area have been dynamically elevated to the <strong>TOP OF THE QUEUE (Rank #1)</strong> for immediate officer intervention.
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
              <Button
                size="sm"
                variant="primary"
                className="bg-rose-600 hover:bg-rose-500 font-bold text-xs"
                onClick={() => setSelectedArea(topHotspot.areaName)}
              >
                Focus on {topHotspot.areaName} ({topHotspot.totalReports})
              </Button>
              {selectedArea === topHotspot.areaName && (
                <button
                  type="button"
                  onClick={() => setSelectedArea('ALL')}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Clear Area Filter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Area Filter
          </label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2 bg-slate-50 font-medium"
          >
            <option value="ALL">All Municipal Areas</option>
            {DEMO_AREAS.map((a) => (
              <option key={a.area} value={a.area}>
                {a.area} ({a.ward})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Priority Severity
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as any)}
            className="w-full rounded-lg border border-slate-200 p-2 bg-slate-50 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full rounded-lg border border-slate-200 p-2 bg-slate-50 font-medium"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full rounded-lg border border-slate-200 p-2 bg-slate-50 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <DataTable<Complaint>
        columns={columns}
        data={displayedComplaints}
        keyExtractor={(c) => c.id}
        onRowClick={(c: Complaint) => navigate(`/officer/complaints/${c.id}`)}
      />
    </div>
  );
};
