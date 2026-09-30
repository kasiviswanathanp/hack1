import React, { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { ROLES, APP_NAME, APP_TAGLINE } from '@/constants';
import { UserRole } from '@/types';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import {
  Bell,
  MapPin,
  Shield,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Menu,
  ExternalLink,
  LogIn,
  Layers,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/utils';
import { CivicLogo } from '@/components/common/CivicLogo';

const ROLE_LOGIN_PATHS: Record<UserRole, string> = {
  CITIZEN: '/login/citizen',
  AREA_OFFICER: '/login/area-officer',
  DEPARTMENT_OFFICER: '/login/department-officer',
  SUPERVISOR: '/login/supervisor',
  DISTRICT_MANAGER: '/login/manager',
  FIELD_TEAM: '/login/field-team',
  ADMIN: '/login/admin',
};

export const Navbar: React.FC<{ onToggleSidebar?: () => void; showSidebarToggle?: boolean }> = ({
  onToggleSidebar,
  showSidebarToggle = false,
}) => {
  const { currentUser, switchRole, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuMode, setMenuMode] = useState<'login' | 'switch'>('login');
  const navigate = useNavigate();

  const handleRoleChange = async (role: UserRole) => {
    setShowRoleMenu(false);
    await switchRole(role);
    const target = ROLES.find((r) => r.id === role)?.path || '/';
    navigate(target);
  };

  const handleGoToLoginPage = (role: UserRole) => {
    setShowRoleMenu(false);
    navigate(ROLE_LOGIN_PATHS[role] || '/login');
  };

  const currentRoleInfo = ROLES.find((r) => r.id === currentUser?.role) || ROLES[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Sidebar toggle */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <CivicLogo
            size="md"
            onClick={() => navigate(currentRoleInfo.path)}
          />
        </div>

        {/* Center: Ward / Geo badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-900">
            {currentUser?.areaId || 'Anna Nagar West'}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-mono">{currentUser?.wardId || 'Ward 102'}</span>
        </div>

        {/* Right: Separate Login Portals Button + Role Switcher Dropdown + Notifications + User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick link to separate login gateway */}
          <button
            onClick={() => navigate('/portals')}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
            title="Open Separate Login Portals Directory"
          >
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            <span>Login Portals</span>
          </button>

          {/* Role Dropdown with Separate Login Page direct links */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              title="Access Separate Login Pages or Switch Role"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline text-slate-500">Role:</span>
              <span className="text-slate-900 font-bold">{currentRoleInfo.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-3 shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 text-left">
                {/* Header with mode switcher */}
                <div className="pb-2.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      CivicAI Role Portals
                    </span>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        navigate('/portals');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Portal Hub</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Mode Tabs */}
                  <div className="mt-2 grid grid-cols-2 p-0.5 rounded-lg bg-slate-100 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setMenuMode('login')}
                      className={cn(
                        'py-1 rounded-md text-[11px] transition-all cursor-pointer',
                        menuMode === 'login' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                      )}
                    >
                      Go to Login Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuMode('switch')}
                      className={cn(
                        'py-1 rounded-md text-[11px] transition-all cursor-pointer',
                        menuMode === 'switch' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600'
                      )}
                    >
                      Instant Switch (Demo)
                    </button>
                  </div>
                </div>

                {/* 7 Roles List */}
                <div className="py-1 space-y-1.5 max-h-[380px] overflow-y-auto">
                  {ROLES.map((r) => {
                    const isSelected = r.id === currentUser?.role;
                    return (
                      <div
                        key={r.id}
                        className={cn(
                          'p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between gap-2',
                          isSelected
                            ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                            : 'bg-white hover:bg-slate-50 border-slate-150 text-slate-800'
                        )}
                      >
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            if (menuMode === 'login') {
                              handleGoToLoginPage(r.id);
                            } else {
                              handleRoleChange(r.id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold truncate">{r.label}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {r.description}
                          </p>
                        </div>

                        {/* Separate Login Page direct link button */}
                        <button
                          type="button"
                          onClick={() => handleGoToLoginPage(r.id)}
                          className="shrink-0 px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[10px] font-bold transition-all cursor-pointer border border-slate-200 flex items-center gap-1"
                          title={`Open separate ${r.label} login page`}
                        >
                          <span>Login</span>
                          <LogIn className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom link */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      navigate('/portals');
                    }}
                    className="w-full text-center py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>View All Separate Login Portals</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95">
                <NotificationCenter onClose={() => setShowNotifMenu(false)} />
              </div>
            )}
          </div>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowRoleMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 rounded-lg p-1 text-left hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 text-left">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {currentUser?.displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  {currentUser?.badgeNumber && (
                    <span className="mt-1 inline-block text-[10px] font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      ID: {currentUser.badgeNumber}
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/portals');
                    }}
                    className="w-full px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 rounded-lg text-left flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogIn className="w-4 h-4 text-blue-600" />
                    <span>Switch Login Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      const returnPath = ROLE_LOGIN_PATHS[currentUser?.role || 'CITIZEN'] || '/login/citizen';
                      setShowUserMenu(false);
                      logout();
                      navigate(returnPath);
                    }}
                    className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left flex items-center gap-2 cursor-pointer font-semibold border-t border-slate-100 mt-1 pt-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
