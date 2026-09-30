import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '@/constants';
import { Button } from '@/components/common/Button';
import { StatsCard } from '@/components/common/StatsAndDialog';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/store/AuthContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  PlusCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  Construction,
  Droplets,
  Waves,
  Lightbulb,
  Zap,
  Trash2,
  Building2,
  HelpCircle,
} from 'lucide-react';

const categoryIconMap: Record<string, React.ReactNode> = {
  Construction: <Construction className="w-5 h-5 text-amber-600" />,
  Droplets: <Droplets className="w-5 h-5 text-blue-600" />,
  Waves: <Waves className="w-5 h-5 text-cyan-600" />,
  Lightbulb: <Lightbulb className="w-5 h-5 text-yellow-600" />,
  Zap: <Zap className="w-5 h-5 text-orange-600" />,
  Trash2: <Trash2 className="w-5 h-5 text-emerald-600" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-rose-600" />,
  Building2: <Building2 className="w-5 h-5 text-indigo-600" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-slate-600" />,
};

export const CitizenHome: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { complaints, counts } = useComplaints();

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Civic Redressal • Google Cloud & Firebase Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Report a civic issue in seconds.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Upload a photo of road damage, drainage issues, or outages. Our Google Gemini Vision engine classifies defects, detects your municipal ward, and initiates a binding SLA response countdown.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              leftIcon={<PlusCircle className="w-5 h-5" />}
              onClick={() => navigate('/citizen/report')}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 px-6 font-bold"
            >
              Report an Issue
            </Button>

            <Button
              size="lg"
              variant="outline"
              leftIcon={<FileText className="w-5 h-5 text-white" />}
              onClick={() => navigate('/citizen/complaints')}
              className="border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 font-semibold"
            >
              View My Complaints
            </Button>
          </div>
        </div>

        {/* Ambient background graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path
              fill="#3b82f6"
              d="M45.7,-77.8C59.9,-70.6,72.7,-59.8,80.8,-46C88.9,-32.2,92.3,-15.5,90.2,0.6C88.2,16.8,80.7,32.3,71.2,46.1C61.6,59.8,50,71.7,36.2,78.2C22.4,84.7,6.4,85.8,-8.9,83.9C-24.1,82,-38.5,77,-50.7,68.5C-62.9,60,-72.8,47.9,-79.8,34.3C-86.8,20.7,-90.9,5.7,-88.7,-8.7C-86.5,-23.1,-78.1,-36.8,-67.7,-47.9C-57.3,-59,-45,-67.5,-31.8,-75.2C-18.6,-82.9,-4.6,-89.8,9.7,-88.9C24.1,-87.9,31.6,-85.1,45.7,-77.8Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>

      {/* Nearby Civic Status Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Ward 102 & Nearby Area Status
            </h2>
            <p className="text-xs text-slate-500">Live aggregated counts from Cloud Firestore</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Anna Nagar West Corridor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Active Issues Nearby"
            value={counts.all - counts.resolved}
            subtitle="Under active triage or field work"
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            badgeText="In Progress"
            badgeVariant="warning"
            onClick={() => navigate('/citizen/map')}
          />

          <StatsCard
            title="Resolved Issues"
            value={counts.resolved}
            subtitle="Verified by photographic evidence"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            badgeText="Remediated"
            badgeVariant="safe"
            trend={{ value: '18% this week', positive: true }}
            onClick={() => navigate('/citizen/complaints')}
          />

          <StatsCard
            title="Critical Issues"
            value={counts.critical}
            subtitle="Urgent public safety hazards"
            icon={<AlertTriangle className="w-5 h-5 text-rose-600" />}
            badgeText="High SLA"
            badgeVariant="critical"
            onClick={() => navigate('/citizen/map')}
          />
        </div>
      </div>

      {/* Categories Grid (Section 5 requirements) */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">Browse by Issue Category</h2>
          <p className="text-xs text-slate-500">
            Select a category to quickly log an issue with automated departmental routing
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/citizen/report?category=${cat.id}`)}
              className="group rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 group-hover:bg-blue-50 transition-colors">
                  {categoryIconMap[cat.iconName] || <HelpCircle className="w-5 h-5 text-slate-500" />}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  SLA: {cat.defaultSlaHours}h
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.label}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {cat.department}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Preview & Recent Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent complaints */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Complaints in Your Area</h3>
            <button
              onClick={() => navigate('/citizen/complaints')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentComplaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        </div>

        {/* Small Map Preview Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Area Hotspot Preview</h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Explore localized incident clusters and active road closures in Chennai district.
            </p>

            <div
              onClick={() => navigate('/citizen/map')}
              className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer group"
            >
              {/* Stylized preview mini map */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-blue-950 flex items-center justify-center">
                <div className="space-y-2 text-center">
                  <div className="w-8 h-8 rounded-full bg-red-500/80 text-white font-bold flex items-center justify-center mx-auto text-xs animate-bounce shadow-lg shadow-red-500/50">
                    27
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 block">
                    Anna Nagar Active Cluster
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  Open Interactive Map
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Live GPS Sync</span>
            <span className="font-semibold text-blue-600">6 Clusters Monitored</span>
          </div>
        </div>
      </div>
    </div>
  );
};
