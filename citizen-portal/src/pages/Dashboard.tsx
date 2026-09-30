import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  FilePlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyComplaints()
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Compute Metrics
  const total = complaints.length;
  const openCount = complaints.filter((c) => ['SUBMITTED', 'AI_ANALYSIS', 'VERIFIED'].includes(c.status)).length;
  const inProgress = complaints.filter((c) => ['ASSIGNED', 'IN_PROGRESS', 'FIELD_VISIT', 'RESOLUTION_SUBMITTED'].includes(c.status)).length;
  const resolved = complaints.filter((c) => c.status === 'RESOLVED').length;
  const escalated = complaints.filter((c) => c.status === 'ESCALATED' || (c.escalation_level && c.escalation_level > 1)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Powered Citizen Grievance Redressal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Vanakkam, {user?.full_name?.split(' ')[0] || 'Citizen'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Report civic defects across any of Tamil Nadu's 38 districts. Google AI classifies your issue, assigns legally binding SLA countdowns, and automatically escalates if officers fail to respond on time.
          </p>
          <div className="pt-2">
            <Link
              to="/report-issue"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Report a New Grievance</span>
            </Link>
          </div>
        </div>

        {/* Ambient Decorative Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Filed</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{total}</p>
          <span className="text-[11px] text-slate-400 block font-medium">All time volume</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Open</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{openCount}</p>
          <span className="text-[11px] text-amber-600 font-semibold block">Awaiting review</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">In Progress</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600">{inProgress}</p>
          <span className="text-[11px] text-indigo-600 font-semibold block">Field crew on site</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">{resolved}</p>
          <span className="text-[11px] text-emerald-600 font-semibold block">With photo proof</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Escalated</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600">{escalated}</p>
          <span className="text-[11px] text-rose-600 font-semibold block">Under supervisory probe</span>
        </div>
      </div>

      {/* Interactive Map & Submitted Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Submitted Complaints Map</h2>
              <p className="text-xs text-slate-500">Live GPS locations of all your reported civic defects</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              {complaints.length} Pins Active
            </span>
          </div>

          {/* Interactive Visual Map Surface */}
          <div className="h-80 sm:h-96 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 relative overflow-hidden border border-slate-700 flex flex-col justify-between">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#fff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Pins on the Map */}
            <div className="relative z-10 w-full h-full flex flex-wrap items-center justify-around p-6">
              {complaints.map((c, idx) => (
                <Link
                  key={c.id}
                  to={`/complaint/${c.id}`}
                  className="group relative flex flex-col items-center cursor-pointer m-2 transition-transform hover:scale-110"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
                      c.status === 'RESOLVED'
                        ? 'bg-emerald-500 shadow-emerald-500/40 ring-4 ring-emerald-500/20'
                        : c.status === 'ESCALATED'
                        ? 'bg-rose-500 shadow-rose-500/40 ring-4 ring-rose-500/20 animate-bounce'
                        : 'bg-blue-600 shadow-blue-600/40 ring-4 ring-blue-600/20'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700 shadow-sm truncate max-w-[130px]">
                    {c.area || c.category}
                  </div>
                </Link>
              ))}

              {complaints.length === 0 && (
                <div className="text-center text-slate-400 text-xs">
                  No grievances reported yet. Click "Report Grievance" to drop your first live location pin!
                </div>
              )}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span>● Green = Resolved</span>
              <span>● Blue = In Progress</span>
              <span>● Red = Escalated</span>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Complaints Feed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Grievances</h2>
            <Link to="/my-complaints" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to={`/complaint/${c.id}`}
                className="block p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-blue-600">{c.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'ESCALATED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{c.title || c.description}</h4>
                <p className="text-[11px] text-slate-500 truncate">{c.area}, {c.ward}</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>SLA: {c.sla_evaluation?.label || 'On Track'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </Link>
            ))}

            {complaints.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                You have not filed any grievances yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
