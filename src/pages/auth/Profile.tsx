import React from 'react';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/common/Button';
import { ROLES } from '@/constants';
import { User, Shield, Mail, Phone, MapPin, Building, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const roleInfo = ROLES.find((r) => r.id === currentUser?.role);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 text-left space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900">User Profile & Credentials</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Municipal authorization token and role-based permissions verified by Cloud Firestore.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              <User className="w-8 h-8" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser?.displayName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                {roleInfo?.label || currentUser?.role}
              </span>
              {currentUser?.badgeNumber && (
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {currentUser.badgeNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
            <span className="text-slate-400 block uppercase font-bold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <span className="font-semibold text-slate-800 font-mono">{currentUser?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
            <span className="text-slate-400 block uppercase font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </span>
            <span className="font-semibold text-slate-800 font-mono">
              {currentUser?.phoneNumber || '+91 98401 23456'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
            <span className="text-slate-400 block uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Ward Jurisdiction
            </span>
            <span className="font-semibold text-slate-800">
              {currentUser?.areaId || 'Anna Nagar West'} ({currentUser?.wardId || 'Ward 102'})
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
            <span className="text-slate-400 block uppercase font-bold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> Department
            </span>
            <span className="font-semibold text-slate-800">
              {currentUser?.departmentId || 'Citizen Public Redressal Portal'}
            </span>
          </div>
        </div>

        {/* Security Rule verification banner (Section 29) */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Role-Based Authorization Architecture</span>
          </div>
          <p className="text-blue-800 leading-relaxed">
            All privileges, dispatch orders, and escalation state transitions are evaluated against Firestore Security Rules using token claims. Frontend role switches are mirrored in session context.
          </p>
        </div>

        {/* Sign Out */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
