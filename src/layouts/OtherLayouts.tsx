import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { HardHat, CheckCircle2, Shield, Settings, Users, Network } from 'lucide-react';
import { cn } from '@/utils';

export const FieldTeamLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <Navbar />
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-sm text-slate-900">Field Operations Unit</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              Mobile Responder
            </span>
          </div>

          <div className="flex space-x-4 text-xs font-semibold">
            <NavLink
              to="/field-team"
              end
              className={({ isActive }) =>
                cn(
                  'h-12 flex items-center border-b-2',
                  isActive ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-600'
                )
              }
            >
              Work Orders
            </NavLink>
            <NavLink
              to="/field-team/notifications"
              className={({ isActive }) =>
                cn(
                  'h-12 flex items-center border-b-2',
                  isActive ? 'border-amber-600 text-amber-600' : 'border-transparent text-slate-600'
                )
              }
            >
              Field Dispatches
            </NavLink>
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-20">
        <Outlet />
      </main>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <Navbar />
      <div className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-xs uppercase tracking-wider">System Administration Console</span>
          </div>
          <div className="flex space-x-6 text-xs font-semibold">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                cn('h-12 flex items-center border-b-2', isActive ? 'border-blue-400 text-blue-400' : 'border-transparent text-slate-400')
              }
            >
              Overview & Audits
            </NavLink>
            <NavLink
              to="/management/hotspots"
              className={({ isActive }) =>
                cn('h-12 flex items-center border-b-2', isActive ? 'border-blue-400 text-blue-400' : 'border-transparent text-slate-400')
              }
            >
              City Clusters
            </NavLink>
          </div>
        </div>
      </div>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};
