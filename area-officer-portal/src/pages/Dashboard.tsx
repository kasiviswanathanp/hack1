import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Send,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWardSummary(), api.getWardIssues(), api.getFieldTeams()])
      .then(([s, i, t]) => {
        setSummary(s);
        setIssues(i);
        setTeams(t);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Greater Chennai Corporation • Ward 102 Area Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
            Ward Officer Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Level 1 responder queue for verifying incoming complaints, dispatching field crews, and meeting 24h response SLA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/sla-monitor"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>SLA Countdown Engine</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Ward Complaints</span>
          <p className="text-2xl font-black text-slate-900">{summary?.total || issues.length}</p>
          <span className="text-[10px] text-slate-400 block font-medium">All logged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase">New (Unverified)</span>
          <p className="text-2xl font-black text-amber-600">{summary?.new_cases || 1}</p>
          <span className="text-[10px] text-amber-500 block font-medium">Requires triage</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-rose-600 uppercase">High Priority</span>
          <p className="text-2xl font-black text-rose-600">{summary?.critical || 2}</p>
          <span className="text-[10px] text-rose-500 block font-medium">Safety risks</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 uppercase">Pending Teams</span>
          <p className="text-2xl font-black text-indigo-600">{summary?.pending_assignment || 1}</p>
          <span className="text-[10px] text-indigo-500 block font-medium">Need dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Resolved</span>
          <p className="text-2xl font-black text-emerald-600">{summary?.resolved || 1}</p>
          <span className="text-[10px] text-emerald-500 block font-medium">Proof verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-purple-600 uppercase">Field Teams</span>
          <p className="text-2xl font-black text-purple-600">{teams.length}</p>
          <span className="text-[10px] text-purple-500 block font-medium">Available now</span>
        </div>
      </div>

      {/* Main Ward Grievance Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Ward Grievances Pending Officer Action</h2>
            <Link to="/ward-issues" className="text-xs font-bold text-amber-600 hover:underline">
              View All Ward Issues →
            </Link>
          </div>

          <div className="space-y-3">
            {issues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {issue.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{issue.category}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        issue.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {issue.title || issue.description}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{issue.area}, {issue.ward}</span>
                    <span>•</span>
                    <span className="text-amber-700 font-semibold">{issue.sla_evaluation?.label || 'On Track'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/issue/${issue.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Action
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Field Team Availability */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Field Squad Readiness</h2>
            <Link to="/field-teams" className="text-xs font-bold text-amber-600 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {teams.map((t) => (
              <div key={t.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{t.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Lead: {t.leader_name} ({t.contact_number})</p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Assigned: {t.ward_id || 'Ward 102'}</span>
                  <span className="font-semibold text-slate-600">{t.active_task_count || 0} active tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
