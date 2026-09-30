import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, FileText, Map, User } from 'lucide-react';
import { cn } from '@/utils';

export const MobileNav: React.FC = () => {
  const navItems = [
    { label: 'Home', path: '/citizen', icon: Home, exact: true },
    { label: 'Report', path: '/citizen/report', icon: PlusCircle, highlight: true },
    { label: 'My Issues', path: '/citizen/complaints', icon: FileText },
    { label: 'Map', path: '/citizen/map', icon: Map },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center -mt-5 transition-transform active:scale-95',
                    isActive ? 'scale-105' : ''
                  )
                }
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 mt-1">{item.label}</span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center px-2 py-1 text-center transition-colors',
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
