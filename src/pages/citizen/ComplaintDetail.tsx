import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaint } from '@/hooks/useComplaint';
import { StatusBadge, PriorityBadge } from '@/components/common/Badge';
import { ComplaintTimeline } from '@/components/complaints/ComplaintTimeline';
import { EscalationTracker } from '@/components/complaints/EscalationTracker';
import { AreaHierarchyBreadcrumb } from '@/components/complaints/AreaHierarchyBreadcrumb';
import { ImagePreview } from '@/components/common/ImagePreview';
import { Button } from '@/components/common/Button';
import { LoadingState, ErrorState } from '@/components/common/FeedbackStates';
import { formatDate } from '@/utils';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Building,
  UserCheck,
  CheckCircle2,
  HardHat,
  Share2,
} from 'lucide-react';

export const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { complaint, isLoading, error } = useComplaint(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingState message="Loading complaint details & SLA timeline..." />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <ErrorState
          title="Complaint Record Not Found"
          message={`Unable to locate record ${id}. Please check the ID and try again.`}
          onRetry={() => navigate('/citizen/complaints')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      {/* Back button & Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                #{complaint.id}
              </span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {complaint.aiAnalysis?.issueType || complaint.category}
            </h1>
          </div>

          <div className="text-xs text-slate-500 sm:text-right space-y-0.5">
            <span className="block font-mono">Reported: {formatDate(complaint.createdAt)}</span>
            <span className="block text-slate-400">Last synchronized with Firestore</span>
          </div>
        </div>
      </div>

      {/* SLA & Escalation Tracker (Section 10 & 33 requirements) */}
      <EscalationTracker complaint={complaint} />

      {/* Main Grid: Left side details, Right side timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Evidence photo, AI details, Location, Resolution evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Evidence Photo */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Photo Evidence
            </h3>
            {complaint.imageUrls && complaint.imageUrls[0] ? (
              <ImagePreview
                src={complaint.imageUrls[0]}
                alt="Citizen Evidence"
                caption={`Original evidence uploaded for ${complaint.id}`}
                heightClass="h-72"
              />
            ) : (
              <div className="h-48 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                No photo attached
              </div>
            )}
          </div>

          {/* AI Analysis Card */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Google Gemini AI Classification</span>
              </div>
              <span className="text-xs font-mono font-bold bg-white text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                {Math.round((complaint.aiAnalysis?.confidence || 0.91) * 100)}% Confidence
              </span>
            </div>

            <div className="rounded-xl bg-white p-4 border border-blue-150 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">
                {complaint.aiAnalysis?.issueType}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {complaint.aiAnalysis?.detectedDescription}
              </p>
              {complaint.aiAnalysis?.reasoning && (
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">AI Reasoning: </span>
                  {complaint.aiAnalysis.reasoning}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {complaint.aiAnalysis?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description & Landmark */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Description & Notes
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-150">
              {complaint.description}
            </p>

            {complaint.landmark && (
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <span className="font-bold text-slate-700">Landmark:</span>
                <span>{complaint.landmark}</span>
              </div>
            )}
          </div>

          {/* Resolution Evidence Box (when resolved) */}
          {complaint.status === 'RESOLVED' && complaint.resolutionEvidence && (
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Photographic Proof of Resolution</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {complaint.resolutionEvidence.beforeImageUrl && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Before Remediation:
                    </span>
                    <ImagePreview
                      src={complaint.resolutionEvidence.beforeImageUrl}
                      caption="Defect prior to repair"
                      heightClass="h-44"
                    />
                  </div>
                )}

                {complaint.resolutionEvidence.afterImageUrl && (
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block mb-1">
                      After Field Work:
                    </span>
                    <ImagePreview
                      src={complaint.resolutionEvidence.afterImageUrl}
                      caption="Verified completed work"
                      heightClass="h-44"
                    />
                  </div>
                )}
              </div>

              <p className="text-xs text-emerald-950 bg-white p-3 rounded-xl border border-emerald-200 leading-relaxed">
                <span className="font-bold">Field Engineer Verification: </span>
                {complaint.resolutionEvidence.notes}
              </p>
            </div>
          )}

          {/* Area Routing Hierarchy (Section 18) */}
          <AreaHierarchyBreadcrumb
            location={complaint.location}
            assignedOfficerName={complaint.assignedOfficerName}
            departmentName={complaint.departmentName}
          />
        </div>

        {/* Right Column: Timeline & Authority info */}
        <div className="space-y-6">
          {/* Responsible Department & Officer Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Responsible Civic Authority
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">
                    {complaint.departmentName || 'Municipal Roads & Infrastructure'}
                  </span>
                  <span className="text-slate-500">Jurisdiction Department</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    {complaint.assignedOfficerName || 'Ward Area Officer'}
                  </span>
                  <span className="text-slate-500">Assigned Municipal Officer</span>
                </div>
              </div>

              {complaint.fieldTeamName && (
                <div className="flex items-start gap-2.5">
                  <HardHat className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {complaint.fieldTeamName}
                    </span>
                    <span className="text-slate-500">On-Ground Field Response Team</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Real-Time Resolution Timeline
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <ComplaintTimeline complaint={complaint} />
          </div>
        </div>
      </div>
    </div>
  );
};
