import React from 'react';
import { Complaint } from '@/types';
import { StatusBadge, PriorityBadge } from '@/components/common/Badge';
import { SLAIndicator } from './SLAIndicator';
import { formatDate, formatTimeRelative } from '@/utils';
import { MapPin, Calendar, UserCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ComplaintCardProps {
  complaint: Complaint;
  linkPrefix?: string;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  linkPrefix = '/citizen/complaints',
}) => {
  const navigate = useNavigate();

  const isEscalated = complaint.status === 'ESCALATED' || complaint.escalationLevel > 1;

  return (
    <div
      onClick={() => navigate(`${linkPrefix}/${complaint.id}`)}
      className="group relative rounded-2xl border border-slate-200/90 bg-white p-4 md:p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-blue-300 cursor-pointer text-left flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & ID */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              #{complaint.id}
            </span>
            <PriorityBadge priority={complaint.priority} />
            {isEscalated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Level {complaint.escalationLevel}
              </span>
            )}
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        {/* Image & Main Info Grid */}
        <div className="flex gap-4 items-start">
          {complaint.imageUrls && complaint.imageUrls[0] ? (
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
              <img
                src={complaint.imageUrls[0]}
                alt={complaint.category}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm md:text-base text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {complaint.aiAnalysis?.issueType || complaint.category}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {complaint.description}
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 truncate font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                {complaint.location.area}, {complaint.location.ward}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                {formatTimeRelative(complaint.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Meta info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[240px]">
          <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {complaint.assignedOfficerName || complaint.departmentName || 'Assigned to Ward Queue'}
          </span>
        </div>

        {complaint.status !== 'RESOLVED' && complaint.status !== 'REJECTED' ? (
          <SLAIndicator deadlineIso={complaint.responseDeadline} compact />
        ) : (
          <span className="text-[11px] font-medium text-emerald-700">
            Resolved: {formatDate(complaint.resolvedAt)}
          </span>
        )}

        <div className="text-blue-600 font-semibold text-xs flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
