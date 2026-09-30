import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  AlertOctagon,
  MapPin,
  TrendingUp,
  HardHat,
  BarChart3,
  Bell,
  User,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/utils';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/store/AuthContext';

export const OfficerSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { counts } = useComplaints();

  const role = currentUser?.role;

  let consoleTitle = 'Officer Console';
  let consoleSubtitle = 'Municipal Command';
  let statusTitle = currentUser?.wardId ? `${currentUser.wardId} Status` : 'System Status';
  let statusText = 'Auto-escalation active for response > 24h.';
  let statusMetric = '92% In SLA';

  let links: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
    badge?: number;
    badgeColor?: string;
  }[] = [];

  if (role === 'SUPERVISOR') {
    consoleTitle = 'Supervisor Console';
    consoleSubtitle = 'Zonal Supervision';
    statusTitle = currentUser?.zoneId ? `${currentUser.zoneId} Status` : 'Zonal SLA Status';
    statusText = 'Level 3 Zonal escalation oversight.';
    statusMetric = '88% In SLA';
    links = [
      {
        label: 'Escalations Queue',
        path: '/supervisor/escalations',
        icon: ShieldAlert,
        exact: true,
        badge: counts.escalated,
        badgeColor: 'bg-rose-600',
      },
      {
        label: 'All Complaints',
        path: '/supervisor/complaints',
        icon: Inbox,
        badge: counts.all,
      },
      {
        label: 'Priority Queue',
        path: '/supervisor/priority',
        icon: AlertOctagon,
        badge: counts.critical,
        badgeColor: 'bg-red-500',
      },
      { label: 'Hotspot Map', path: '/supervisor/map', icon: MapPin },
      { label: 'Field Teams', path: '/supervisor/field-teams', icon: HardHat },
      { label: 'Analytics', path: '/supervisor/analytics', icon: BarChart3 },
      { label: 'Notifications', path: '/supervisor/notifications', icon: Bell },
      { label: 'Profile', path: '/profile', icon: User },
    ];
  } else if (role === 'DISTRICT_MANAGER') {
    consoleTitle = 'Management Console';
    consoleSubtitle = 'Executive Command';
    statusTitle = currentUser?.districtId ? `${currentUser.districtId} Oversight` : 'District Oversight';
    statusText = 'Executive Collectorate telemetry.';
    statusMetric = '94.2% Resolution';
    links = [
      {
        label: 'Executive Dashboard',
        path: '/management/dashboard',
        icon: LayoutDashboard,
        exact: true,
      },
      { label: 'Hotspot Intelligence', path: '/management/hotspots', icon: MapPin },
      {
        label: 'Complaints Directory',
        path: '/management/complaints',
        icon: Inbox,
        badge: counts.all,
      },
      {
        label: 'Priority Queue',
        path: '/management/priority',
        icon: AlertOctagon,
        badge: counts.critical,
        badgeColor: 'bg-red-500',
      },
      {
        label: 'Escalated Issues',
        path: '/management/escalations',
        icon: ShieldAlert,
        badge: counts.escalated,
        badgeColor: 'bg-rose-600',
      },
      { label: 'Field Operations', path: '/management/field-teams', icon: HardHat },
      { label: 'City Analytics', path: '/management/analytics', icon: BarChart3 },
      { label: 'Notifications', path: '/management/notifications', icon: Bell },
      { label: 'Profile', path: '/profile', icon: User },
    ];
  } else if (role === 'DEPARTMENT_OFFICER') {
    consoleTitle = 'Dept Officer Console';
    consoleSubtitle = currentUser?.departmentId || 'Operations Command';
    links = [
      { label: 'Dashboard', path: '/officer', icon: LayoutDashboard, exact: true },
      {
        label: 'Department Queue',
        path: '/officer/complaints',
        icon: Inbox,
        badge: counts.assigned,
      },
      {
        label: 'Priority Queue',
        path: '/officer/priority',
        icon: AlertOctagon,
        badge: counts.critical,
        badgeColor: 'bg-red-500',
      },
      {
        label: 'Escalated Issues',
        path: '/officer/escalations',
        icon: ShieldAlert,
        badge: counts.escalated,
        badgeColor: 'bg-rose-600',
      },
      { label: 'Hotspot Map', path: '/officer/map', icon: MapPin },
      { label: 'Field Teams', path: '/officer/field-teams', icon: HardHat },
      { label: 'Analytics', path: '/officer/analytics', icon: BarChart3 },
      { label: 'Notifications', path: '/officer/notifications', icon: Bell },
      { label: 'Profile', path: '/profile', icon: User },
    ];
  } else {
    // AREA_OFFICER, ADMIN, or fallback
    consoleTitle = role === 'ADMIN' ? 'Admin Console' : 'Area Officer Console';
    consoleSubtitle = currentUser?.wardId ? `${currentUser.wardId} • Ward Level` : 'Municipal Command';
    links = [
      { label: 'Dashboard', path: '/officer', icon: LayoutDashboard, exact: true },
      {
        label: 'Assigned Complaints',
        path: '/officer/complaints',
        icon: Inbox,
        badge: counts.assigned,
      },
      {
        label: 'Priority Queue',
        path: '/officer/priority',
        icon: AlertOctagon,
        badge: counts.critical,
        badgeColor: 'bg-red-500',
      },
      {
        label: 'Escalated Issues',
        path: '/officer/escalations',
        icon: ShieldAlert,
        badge: counts.escalated,
        badgeColor: 'bg-rose-600',
      },
      { label: 'Hotspot Map', path: '/officer/map', icon: MapPin },
      { label: 'Field Teams', path: '/officer/field-teams', icon: HardHat },
      { label: 'Analytics', path: '/officer/analytics', icon: BarChart3 },
      { label: 'Notifications', path: '/officer/notifications', icon: Bell },
      { label: 'Profile', path: '/profile', icon: User },
    ];
  }

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800 p-4 select-none">
      <div className="px-3 py-3 mb-2 flex items-center justify-between border-b border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {consoleSubtitle}
          </span>
          <h3 className="text-sm font-bold text-white">{consoleTitle}</h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pt-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.exact}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && link.badge > 0 && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
                    link.badgeColor || 'bg-slate-800'
                  )}
                >
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* SLA Status Widget */}
      <div className="mt-auto pt-4 border-t border-slate-800 text-left">
        <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300">{statusTitle}</span>
            <span className="text-[10px] font-bold text-emerald-400">{statusMetric}</span>
          </div>
          <p className="text-[11px] text-slate-400">{statusText}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={onClose}>
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />
          <div className="relative z-10 w-64 h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
