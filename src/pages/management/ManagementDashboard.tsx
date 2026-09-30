import React, { useState, useEffect } from 'react';
import { managementService } from '@/services/managementService';
import { CityAnalyticsSummary, ComplaintCluster } from '@/types';
import { StatsCard } from '@/components/common/StatsAndDialog';
import { HotspotMap } from '@/components/maps/HotspotMap';
import { LoadingState } from '@/components/common/FeedbackStates';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Inbox,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { cn } from '@/utils';

import { TAMIL_NADU_MUNICIPALITIES } from '@/data/tamilNaduJurisdictions';

export const ManagementDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<CityAnalyticsSummary | null>(null);
  const [hotspots, setHotspots] = useState<ComplaintCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<ComplaintCluster | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      managementService.getCityAnalytics(),
      managementService.getHotspotClusters(),
    ]).then(([ana, clus]) => {
      setAnalytics(ana);
      setHotspots(clus);
      if (clus.length > 0) setSelectedCluster(clus[0]);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingState message="Aggregating municipal analytics and GIS hotspot feeds..." />
      </div>
    );
  }

  const activeJurisdictionName = selectedMunicipality === 'ALL' 
    ? 'Tamil Nadu State-Wide Command & Control' 
    : selectedMunicipality;

  return (
    <div className="space-y-8 text-left">
      {/* Executive Header with Jurisdiction Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Government of Tamil Nadu • Municipal Administration
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {activeJurisdictionName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Executive Civic Intelligence & SLA Monitor
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Live telemetry from Cloud Firestore, automated AI triage, and real-time SLA countdowns across Tamil Nadu urban local bodies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Municipal Corporation Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-600 shrink-0">Jurisdiction:</span>
            <select
              value={selectedMunicipality}
              onChange={(e) => setSelectedMunicipality(e.target.value)}
              className="text-xs font-semibold text-slate-900 bg-transparent border-none focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All 38 Districts (State Overview)</option>
              {TAMIL_NADU_MUNICIPALITIES.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live SLA Active</span>
          </span>
        </div>
      </div>

      {/* 7 Required Executive Metrics (Section 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatsCard
          title="Total Reports"
          value={analytics.totalComplaints}
          subtitle="All-time volume"
          icon={<Inbox className="w-4 h-4 text-blue-600" />}
        />

        <StatsCard
          title="Open Issues"
          value={analytics.openComplaints}
          subtitle="Active in system"
          icon={<Clock className="w-4 h-4 text-amber-600" />}
          badgeVariant="warning"
        />

        <StatsCard
          title="Critical"
          value={analytics.criticalIssues}
          subtitle="Safety hazards"
          icon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
          badgeVariant="critical"
        />

        <StatsCard
          title="Escalated"
          value={analytics.escalatedIssues}
          subtitle="SLA breached"
          icon={<ShieldAlert className="w-4 h-4 text-rose-600" />}
          badgeVariant="critical"
          badgeText="Supervised"
        />

        <StatsCard
          title="Resolved"
          value={analytics.resolvedIssues}
          subtitle="With proof photo"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          badgeVariant="safe"
          trend={{ value: `${analytics.resolutionRatePercent}%`, positive: true }}
        />

        <StatsCard
          title="Avg Response"
          value={`${analytics.averageResponseTimeHours}h`}
          subtitle="Time to accept"
          icon={<Clock className="w-4 h-4 text-indigo-600" />}
        />

        <StatsCard
          title="Avg Resolution"
          value={`${analytics.averageResolutionTimeHours}h`}
          subtitle="Turnaround time"
          icon={<TrendingUp className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* Hotspots Map Section (Section 14 & 17) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              City-Wide Incident Hotspot Aggregation
            </h2>
            <p className="text-xs text-slate-500">
              Click any colored cluster to inspect localized ward volume, open ratios, and departmental breakdown.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">6 Monitored Zones</span>
        </div>

        <HotspotMap
          clusters={hotspots}
          selectedCluster={selectedCluster}
          onSelectCluster={setSelectedCluster}
        />
      </div>

      {/* Analytics Charts & Graphs Section (Section 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints by Category Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
            <span className="text-xs text-slate-400 font-mono">Volume Split</span>
          </div>

          <div className="space-y-3">
            {analytics.categoryDistribution.map((cat) => (
              <div key={cat.category} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{cat.category}</span>
                  <span className="font-mono text-slate-500 font-bold">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints by Area Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Complaints by Ward Jurisdiction</h3>
            <span className="text-xs text-slate-400 font-mono">Open vs Resolved</span>
          </div>

          <div className="space-y-3">
            {analytics.areaDistribution.map((area) => {
              const total = area.count;
              const resPercent = Math.round((area.resolved / total) * 100);

              return (
                <div key={area.area} className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span className="truncate">{area.area}</span>
                    <span className="font-mono">{total} total</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="text-amber-700">{area.open} open</span>
                    <span className="text-emerald-700">{area.resolved} resolved ({resPercent}%)</span>
                  </div>

                  <div className="w-full bg-amber-200/80 rounded-full h-1.5 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-l-full"
                      style={{ width: `${resPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Trend Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">7-Day Incident & Resolution Trend</h3>
            <span className="text-xs text-slate-400 font-mono">Daily Inflow</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2">
            {analytics.weeklyTrend.map((day) => {
              const heightPercent = Math.min(100, Math.round((day.submitted / 50) * 100));

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.submitted}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-lg h-40 flex items-end overflow-hidden p-0.5">
                    <div
                      className="w-full bg-blue-600 rounded-t transition-all group-hover:bg-blue-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{day.date}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" />
              <span>Reported Inflow</span>
            </span>
            <span className="font-semibold text-emerald-600">
              Escalation Rate: {analytics.escalationRatePercent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
