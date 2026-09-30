import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert } from 'lucide-react';

export const RoleGuard: React.FC<{
  allowedRoles: UserRole[];
  redirectPath?: string;
}> = ({ allowedRoles, redirectPath = '/login' }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={redirectPath} replace />;
  }

  // Allow admin everywhere, or match allowed roles
  const hasAccess = currentUser.role === 'ADMIN' || allowedRoles.includes(currentUser.role);

  if (!hasAccess) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 p-8 rounded-2xl border border-amber-200 bg-amber-50 text-center space-y-4 shadow-sm">
        <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-800 mb-1">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-amber-900">Role Authorization Required</h3>
        <p className="text-sm text-amber-800 max-w-md mx-auto">
          This portal view is intended for <b>{allowedRoles.join(' or ')}</b>. Your current active role is{' '}
          <b>{currentUser.role}</b>.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-xs font-bold rounded-xl border border-amber-300 text-amber-900 bg-white hover:bg-amber-100 transition-colors cursor-pointer"
          >
            ← Go Back
          </button>
          <a
            href={
              currentUser.role === 'SUPERVISOR'
                ? '/supervisor/escalations'
                : currentUser.role === 'DISTRICT_MANAGER'
                ? '/management/dashboard'
                : currentUser.role === 'AREA_OFFICER' || currentUser.role === 'DEPARTMENT_OFFICER'
                ? '/officer'
                : currentUser.role === 'FIELD_TEAM'
                ? '/field-team'
                : currentUser.role === 'ADMIN'
                ? '/admin'
                : '/citizen'
            }
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-800 text-white hover:bg-amber-900 transition-colors"
          >
            Return to My Portal
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

