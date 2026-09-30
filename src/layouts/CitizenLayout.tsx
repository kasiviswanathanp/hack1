import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { PlusCircle, FileText, Map, Home, Bell, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils';

export const CitizenLayout: React.FC = () => {
  const navigate = useNavigate();

  const citizenNav = [
    { label: 'Home', path: '/citizen', exact: true },
    { label: 'Report Issue', path: '/citizen/report' },
    { label: 'My Complaints', path: '/citizen/complaints' },
    { label: 'Nearby Issues', path: '/citizen/map' },
    { label: 'Notifications', path: '/citizen/notifications' },
    { label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Desktop Citizen Navigation Bar */}
      <div className="hidden sm:block border-b border-slate-200 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
          <nav className="flex space-x-6">
            {citizenNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center text-xs font-semibold h-12 border-b-2 transition-colors cursor-pointer',
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={() => navigate('/citizen/report')}
          >
            Report an Issue
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 sm:pb-12">
        <Outlet />
      </main>

      {/* Citizen Mobile Bottom Nav */}
      <MobileNav />

      {/* Civic Tech Trust Footer */}
      <footer className="hidden sm:block border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">CivicAI Official Citizen Grievance Portal</span>
              <span>• Powered by Google Cloud & Firebase</span>
            </div>
            <div>
              <span>Municipal Service Level Agreement (SLA) Enforced • 24/7 Auto-Escalation Engine</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="font-medium text-slate-500">Official Municipal Portals:</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <NavLink to="/login/area-officer" className="hover:text-blue-600 transition-colors">Ward Officer</NavLink>
              <span>•</span>
              <NavLink to="/login/department-officer" className="hover:text-blue-600 transition-colors">Department Officer</NavLink>
              <span>•</span>
              <NavLink to="/login/supervisor" className="hover:text-blue-600 transition-colors">Zonal Supervisor</NavLink>
              <span>•</span>
              <NavLink to="/login/manager" className="hover:text-blue-600 transition-colors">District Collector</NavLink>
              <span>•</span>
              <NavLink to="/login/field-team" className="hover:text-blue-600 transition-colors">Field Crew</NavLink>
              <span>•</span>
              <NavLink to="/login/admin" className="hover:text-blue-600 transition-colors">IT Admin</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
