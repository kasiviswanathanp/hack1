import React, { useState } from 'react';
import { demoStore } from '@/services/store/demoStore';
import { isFirebaseConfigured } from '@/services/firebase/config';
import { Button } from '@/components/common/Button';
import { DEMO_USERS } from '@/services/demoData';
import { DEMO_AREAS } from '@/constants';
import {
  Shield,
  Database,
  RefreshCw,
  Users,
  Layers,
  MapPin,
  CheckCircle2,
  Server,
  Cloud,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemoData = () => {
    demoStore.resetToDefault();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Administration & Infrastructure
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            CivicAI Administrative Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Hierarchy routing configuration, Firebase connection diagnostics, and demo environment controls.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDemoData}
          leftIcon={<RefreshCw className="w-4 h-4 text-blue-600" />}
        >
          Reset Demo Data Store
        </Button>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo store reset to default baseline data. All SLAs and mock complaints refreshed.</span>
        </div>
      )}

      {/* Infrastructure Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Firebase Backend</span>
            <Cloud className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-sm font-bold text-slate-900">
              {isFirebaseConfigured ? 'Connected to Cloud Firestore' : 'Running in Local Demo Store'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isFirebaseConfigured
              ? 'Real-time WebSocket snapshot listeners and Firebase Auth are active.'
              : 'Add Firebase environment keys to .env to connect directly to Google Cloud.'}
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">AI Vision Engine</span>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-slate-900">Google Gemini 2.0</span>
          </div>
          <p className="text-xs text-slate-500">
            Automated visual feature extraction, pothole sizing, and priority severity triage.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">SLA Daemon Engine</span>
            <Server className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-900">Active (4-Tier Routing)</span>
          </div>
          <p className="text-xs text-slate-500">
            Level 1 Area Officer → Level 2 Department Officer → Level 3 Supervisor → Level 4 District Manager.
          </p>
        </div>
      </div>

      {/* Ward Hierarchy Matrix (Section 18 requirements) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Configured Ward Jurisdictions & Routing Matrix</span>
            </h3>
            <span className="text-xs text-slate-500">
              Administrative hierarchy for Greater Chennai Corporation
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {DEMO_AREAS.length} Active Wards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {DEMO_AREAS.map((a) => (
            <div key={a.area} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                <span className="truncate">{a.area}</span>
                <span className="text-blue-600 font-mono text-[11px]">{a.ward}</span>
              </div>
              <span className="text-slate-500 block">{a.zone}</span>
              <span className="text-slate-400 block text-[10px] mt-1">{a.district}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seed Personas Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Authenticated Role Accounts (Demo Mode)</span>
            </h3>
            <span className="text-xs text-slate-500">
              Pre-configured stakeholder profiles for testing multi-tier escalation
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(DEMO_USERS).map(([key, u]) => (
            <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{u.displayName}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {u.role}
                </span>
              </div>
              <span className="text-slate-500 font-mono block">{u.email}</span>
              {u.badgeNumber && (
                <span className="text-[10px] font-mono text-slate-400 block">
                  Badge: {u.badgeNumber}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
