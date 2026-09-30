import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Citizen Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your contact credentials and grievance status notification preferences.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black">
            {user?.full_name ? user.full_name[0] : 'C'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.full_name}</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Citizen Profile</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase">Email Address</span>
            <p className="font-semibold text-slate-800">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase">Phone Number</span>
            <p className="font-semibold text-slate-800">{user?.phone || '+91 98401 23456'}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase">Assigned District</span>
            <p className="font-semibold text-slate-800">{user?.district_id || 'Chennai District'}</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase">Local Ward</span>
            <p className="font-semibold text-slate-800">{user?.ward_id || 'Ward 102 (Anna Nagar West)'}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold text-slate-900">Notification Channels</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Updates
            </span>
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> SMS Real-time Alerts
            </span>
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> In-App Status Tracking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
