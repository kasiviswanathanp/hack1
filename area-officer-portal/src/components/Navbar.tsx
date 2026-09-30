import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Inbox,
  Send,
  Users,
  Clock,
  Bell,
  User,
  LogOut,
  MapPin,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Ward Dashboard', icon: <Inbox className="w-4 h-4" /> },
    { to: '/ward-issues', label: 'Ward Issues', icon: <MapPin className="w-4 h-4" /> },
    { to: '/field-teams', label: 'Field Teams', icon: <Users className="w-4 h-4" /> },
    { to: '/sla-monitor', label: 'SLA Monitor', icon: <Clock className="w-4 h-4" /> },
    { to: '/notifications', label: 'Alerts', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Role Badge */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-black">
                L1
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-white block leading-tight">
                  CivicAI Area Command
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  Level 1 Officer :3001 • {user?.ward_id || 'Ward 102'}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-extrabold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Controls */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{user.full_name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-sm"
              >
                Officer Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
