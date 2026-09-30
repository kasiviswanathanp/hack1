import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { UserRole } from '@/types';
import {
  Shield,
  User,
  Building,
  Layers,
  ShieldAlert,
  HardHat,
  ShieldCheck,
  Terminal,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/utils';
import { CivicEmblem } from '@/components/common/CivicLogo';

interface PortalCard {
  id: string;
  title: string;
  level: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  borderColor: string;
  loginPath: string;
  defaultRole: UserRole;
  demoName: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const portals: PortalCard[] = [
    {
      id: 'citizen',
      title: 'Citizen Grievance Portal',
      level: 'Public Level',
      description: 'Report civic issues, upload photo evidence, track live SLA countdowns & receive resolution updates.',
      icon: <User className="w-6 h-6 text-blue-600" />,
      badge: 'Public Portal',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      borderColor: 'hover:border-blue-400',
      loginPath: '/login/citizen',
      defaultRole: 'CITIZEN',
      demoName: 'Priya Ramanathan (Citizen)',
    },
    {
      id: 'area-officer',
      title: 'Area Officer Portal',
      level: 'Level 1 • Ward',
      description: 'Ward intake queue, initial citizen complaint acknowledgement, and response SLA monitoring.',
      icon: <Building className="w-6 h-6 text-blue-600" />,
      badge: 'Ward Officer',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      borderColor: 'hover:border-blue-400',
      loginPath: '/login/area-officer',
      defaultRole: 'AREA_OFFICER',
      demoName: 'Rajesh Kumar (Ward 102)',
    },
    {
      id: 'dept-officer',
      title: 'Department Officer Portal',
      level: 'Level 2 • Operations',
      description: 'Departmental triage for Roads, Drainage, Water Supply, and Street Lighting infrastructure.',
      icon: <Layers className="w-6 h-6 text-indigo-600" />,
      badge: 'Dept Head',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      borderColor: 'hover:border-indigo-400',
      loginPath: '/login/department-officer',
      defaultRole: 'DEPARTMENT_OFFICER',
      demoName: 'Kavitha Sundaram (Roads Dept)',
    },
    {
      id: 'supervisor',
      title: 'Zonal Supervisor Portal',
      level: 'Level 3 • Escalations',
      description: 'Overdue SLA escalation oversight, inter-ward routing, and field crew mobilization.',
      icon: <ShieldAlert className="w-6 h-6 text-rose-600" />,
      badge: 'Zonal Authority',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      borderColor: 'hover:border-rose-400',
      loginPath: '/login/supervisor',
      defaultRole: 'SUPERVISOR',
      demoName: 'M. Sundararajan (Zone 8 Supervisor)',
    },
    {
      id: 'district-manager',
      title: 'District Manager Portal',
      level: 'Level 4 • Executive',
      description: 'District Collector IAS oversight, city-wide GIS hotspot intelligence & executive analytics.',
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      badge: 'District Collector',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      borderColor: 'hover:border-purple-400',
      loginPath: '/login/manager',
      defaultRole: 'DISTRICT_MANAGER',
      demoName: 'Dr. A. Arunkumar IAS (District Collector)',
    },
    {
      id: 'field-team',
      title: 'Field Operations Portal',
      level: 'Ground Response',
      description: 'On-ground repair crews receiving dispatch work orders and submitting before/after photos.',
      icon: <HardHat className="w-6 h-6 text-amber-600" />,
      badge: 'Field Ops Crew',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      borderColor: 'hover:border-amber-400',
      loginPath: '/login/field-team',
      defaultRole: 'FIELD_TEAM',
      demoName: 'Lead Murugan (Repair Crew Bravo)',
    },
    {
      id: 'admin',
      title: 'System Administrator Portal',
      level: 'Root Authority',
      description: 'System governance, Firestore security rules, SLA policies, and administrative audit logs.',
      icon: <Terminal className="w-6 h-6 text-rose-600" />,
      badge: 'IT Admin Root',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      borderColor: 'hover:border-rose-400',
      loginPath: '/login/admin',
      defaultRole: 'ADMIN',
      demoName: 'K. Senthil Nathan (IT Admin)',
    },
  ];

  const handleQuickEnter = async (role: UserRole) => {
    await switchRole(role);
    switch (role) {
      case 'CITIZEN':
        navigate('/citizen');
        break;
      case 'AREA_OFFICER':
      case 'DEPARTMENT_OFFICER':
        navigate('/officer');
        break;
      case 'SUPERVISOR':
        navigate('/supervisor/escalations');
        break;
      case 'DISTRICT_MANAGER':
        navigate('/management/dashboard');
        break;
      case 'FIELD_TEAM':
        navigate('/field-team');
        break;
      case 'ADMIN':
        navigate('/admin');
        break;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 sm:p-10 text-white shadow-2xl backdrop-blur-xl text-left space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <CivicEmblem className="w-14 h-14 mx-auto drop-shadow-xl hover:scale-105 transition-transform" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Greater Chennai Corporation Civic Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Dedicated Official Login Portals
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Each stakeholder role has an isolated, dedicated login page. Select your specific departmental portal below to access your tailored authentication gateway.
        </p>
      </div>

      {/* 7 Dedicated Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className={cn(
              'group relative rounded-2xl border border-slate-700/80 bg-slate-800/80 p-5 transition-all duration-200 hover:shadow-xl hover:bg-slate-800 text-left flex flex-col justify-between space-y-4',
              portal.borderColor
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 shadow-xs">
                  {portal.icon}
                </div>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider', portal.badgeColor)}>
                  {portal.badge}
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {portal.level}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {portal.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                {portal.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-700/60">
              <div className="text-[11px] text-slate-400 truncate">
                <span className="font-semibold text-slate-300">Official: </span>
                <span>{portal.demoName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={portal.loginPath}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Open Login Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleQuickEnter(portal.defaultRole)}
                  className="py-2 px-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                  title="Quick enter with 1 click"
                >
                  Quick Enter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="pt-2 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-3">
        <span>Protected by Cloud Firestore Security Rules</span>
        <span>•</span>
        <Link to="/login/citizen" className="text-blue-400 hover:underline font-semibold">
          Go to Citizen Login Page
        </Link>
        <span>•</span>
        <Link to="/register" className="text-slate-400 hover:underline">
          New Resident Registration
        </Link>
      </div>
    </div>
  );
};
