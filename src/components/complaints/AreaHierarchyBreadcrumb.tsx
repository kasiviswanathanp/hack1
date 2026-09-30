import React from 'react';
import { ComplaintLocation } from '@/types';
import { ChevronRight, Building, Layers, MapPin, UserCheck, Shield } from 'lucide-react';
import { cn } from '@/utils';

export const AreaHierarchyBreadcrumb: React.FC<{
  location: ComplaintLocation;
  assignedOfficerName?: string;
  departmentName?: string;
  className?: string;
}> = ({ location, assignedOfficerName, departmentName, className }) => {
  const steps = [
    { 
      label: location.district || 'Tamil Nadu District', 
      sub: 'District', 
      icon: <Layers className="w-3.5 h-3.5 text-indigo-600" /> 
    },
    { 
      label: location.municipality || 'Corporation / Municipality', 
      sub: 'Local Body', 
      icon: <Building className="w-3.5 h-3.5 text-blue-600" /> 
    },
    { 
      label: location.zone || 'Administrative Zone', 
      sub: 'Zone', 
      icon: <Shield className="w-3.5 h-3.5 text-purple-600" /> 
    },
    { 
      label: location.ward || 'Ward Jurisdiction', 
      sub: 'Ward', 
      icon: <MapPin className="w-3.5 h-3.5 text-emerald-600" /> 
    },
    { 
      label: location.area || 'Local Area', 
      sub: 'Grievance Site', 
      icon: <MapPin className="w-3.5 h-3.5 text-rose-600" /> 
    },
    {
      label: assignedOfficerName || 'Ward Area Officer',
      sub: departmentName || 'Responsible Authority',
      icon: <UserCheck className="w-3.5 h-3.5 text-amber-600" />,
    },
  ];

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-left', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Routing & Administrative Hierarchy
        </span>
        <span className="text-[11px] font-mono text-slate-400">Civic Jurisdiction Map</span>
      </div>

      <div className="flex items-center overflow-x-auto pb-2 scrollbar-thin gap-1.5 md:gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200/80 px-3 py-2 shrink-0">
              <div className="p-1 rounded bg-white shadow-2xs shrink-0">{step.icon}</div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-900 truncate max-w-[130px]">
                  {step.label}
                </span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wide truncate max-w-[130px]">
                  {step.sub}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
