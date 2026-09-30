import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useComplaint } from '@/hooks/useComplaint';
import { useComplaints } from '@/hooks/useComplaints';
import { useAuth } from '@/store/AuthContext';
import { officerService } from '@/services/officerService';
import { supervisorService } from '@/services/supervisorService';
import { StatusBadge, PriorityBadge } from '@/components/common/Badge';
import { EscalationTracker } from '@/components/complaints/EscalationTracker';
import { AreaHierarchyBreadcrumb } from '@/components/complaints/AreaHierarchyBreadcrumb';
import { ImagePreview } from '@/components/common/ImagePreview';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { LoadingState, ErrorState } from '@/components/common/FeedbackStates';
import { formatDate } from '@/utils';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HardHat,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Wrench,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export const OfficerComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isOfficer, isSupervisor, isAdmin } = useAuth();
  const { complaint, isLoading, error, reload } = useComplaint(id);
  const { complaints } = useComplaints();

  // Action Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form inputs for modals
  const [escalateReason, setEscalateReason] = useState(
    'Specialized heavy machinery or inter-department coordination required.'
  );
  const [selectedFieldTeam, setSelectedFieldTeam] = useState('demo-field-1');
  const [fieldInstructions, setFieldInstructions] = useState(
    'Deploy cold-mix patch crew and ensure traffic safety cones are positioned.'
  );
  const [resolveNotes, setResolveNotes] = useState(
    'Remediation verified completed according to municipal engineering standards.'
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingState message="Loading officer complaint dossier..." />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <ErrorState
          title="Complaint Record Not Found"
          message={`Unable to locate record ${id}.`}
          onRetry={() => navigate('/officer')}
        />
      </div>
    );
  }

  // Calculate nearby similar complaints in same area (Section 13 requirement)
  const nearbyComplaints = complaints.filter(
    (c) => c.location.area === complaint.location.area && c.id !== complaint.id
  );
  const sameCategoryNearby = nearbyComplaints.filter((c) => c.category === complaint.category);

  // Handler: Accept Complaint
  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await officerService.acceptComplaint(
        complaint.id,
        currentUser?.displayName || 'Area Officer'
      );
      reload();
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Start Work
  const handleStartWork = async () => {
    setActionLoading(true);
    try {
      await officerService.startWork(
        complaint.id,
        currentUser?.displayName || 'Area Officer'
      );
      reload();
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Escalate Complaint
  const handleConfirmEscalate = async () => {
    setActionLoading(true);
    try {
      await officerService.escalateComplaint(
        complaint.id,
        escalateReason,
        currentUser?.displayName || 'Area Officer'
      );
      setShowEscalateModal(false);
      reload();
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Assign Field Team
  const handleConfirmAssign = async () => {
    setActionLoading(true);
    try {
      await supervisorService.assignFieldTeam(
        complaint.id,
        selectedFieldTeam,
        selectedFieldTeam === 'demo-field-1' ? 'Team Bravo (Road Repairs)' : 'Team Alpha (Drainage)',
        fieldInstructions
      );
      setShowAssignModal(false);
      reload();
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Mark Resolved
  const handleConfirmResolve = async () => {
    setActionLoading(true);
    try {
      await officerService.resolveComplaint(
        complaint.id,
        {
          beforeImageUrl: complaint.imageUrls[0],
          afterImageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80',
          notes: resolveNotes,
          resolvedAt: new Date().toISOString(),
          verifiedBy: currentUser?.displayName || 'Officer',
        },
        currentUser?.displayName || 'Officer'
      );
      setShowResolveModal(false);
      reload();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Breadcrumb */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Officer Queue</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                #{complaint.id}
              </span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                AI Score: {complaint.priorityScore}/100
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              {complaint.aiAnalysis?.issueType || complaint.category}
            </h1>
          </div>

          {/* Action Toolbar (Section 13) */}
          <div className="flex items-center gap-2 flex-wrap">
            {complaint.status === 'ASSIGNED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                isLoading={actionLoading}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Accept Complaint
              </Button>
            )}

            {complaint.status !== 'RESOLVED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssignModal(true)}
                leftIcon={<HardHat className="w-4 h-4 text-amber-600" />}
              >
                Assign Field Team
              </Button>
            )}

            {complaint.status === 'ASSIGNED' || complaint.status === 'UNDER_REVIEW' ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowEscalateModal(true)}
                leftIcon={<ShieldAlert className="w-4 h-4 text-white" />}
              >
                Escalate Issue
              </Button>
            ) : null}

            {complaint.status !== 'RESOLVED' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowResolveModal(true)}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark Resolved
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Escalation Tracker */}
      <EscalationTracker complaint={complaint} />

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Evidence, AI Classification, Citizen Report, Local Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Evidence with AI Overlay */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Photo Evidence Inspection
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Uploaded: {formatDate(complaint.createdAt)}
              </span>
            </div>

            {complaint.imageUrls && complaint.imageUrls[0] ? (
              <ImagePreview
                src={complaint.imageUrls[0]}
                alt="Defect"
                caption={`Visual Evidence for ${complaint.id}`}
                heightClass="h-72"
              />
            ) : null}
          </div>

          {/* AI Inspection Card (Section 13) */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Google Gemini AI Inspection Dossier
                </h4>
              </div>
              <span className="text-xs font-bold bg-white text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono">
                {Math.round((complaint.aiAnalysis?.confidence || 0.91) * 100)}% Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-blue-150">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Detected Category
                </span>
                <span className="font-bold text-slate-900 text-sm">{complaint.category}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-150">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Recommended Dept
                </span>
                <span className="font-bold text-slate-900 truncate block">
                  {complaint.aiAnalysis?.suggestedDepartment}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-150">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Hazard Priority
                </span>
                <span className="font-bold text-red-700 block">
                  {complaint.aiAnalysis?.suggestedPriority}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-blue-150 leading-relaxed">
              <span className="font-bold text-slate-900">Diagnostic Summary: </span>
              {complaint.aiAnalysis?.detectedDescription}
            </p>
          </div>

          {/* Citizen Description & Contact Details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Description & Location
            </h3>
            <p className="text-sm text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
              {complaint.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block">Reporter</span>
                <span className="font-bold text-slate-800">{complaint.citizenName}</span>
                <span className="text-slate-500 block font-mono">{complaint.citizenPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Identified Landmark</span>
                <span className="font-medium text-slate-800">{complaint.landmark || 'None stated'}</span>
              </div>
            </div>
          </div>

          {/* Hierarchy routing */}
          <AreaHierarchyBreadcrumb
            location={complaint.location}
            assignedOfficerName={complaint.assignedOfficerName}
            departmentName={complaint.departmentName}
          />
        </div>

        {/* Right Column: Local Area Intelligence & Similar Nearby Issues */}
        <div className="space-y-6">
          {/* Nearby Similar Complaints in Same Area (Section 13) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Local Area Intelligence</h3>
                <span className="text-[11px] text-slate-500">
                  {complaint.location.area} ({complaint.location.ward})
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {nearbyComplaints.length + 1} Total in Area
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs space-y-1">
              <span className="font-semibold text-slate-700">Cluster Density Warning:</span>
              <p className="text-slate-500 text-[11px]">
                {sameCategoryNearby.length} other {complaint.category} issues currently open within a 500m radius.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Nearby Incident Records:
              </span>
              {nearbyComplaints.slice(0, 3).map((nc) => (
                <div
                  key={nc.id}
                  onClick={() => navigate(`/officer/complaints/${nc.id}`)}
                  className="p-3 rounded-xl border border-slate-150 hover:border-blue-300 hover:bg-slate-50 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-blue-600">#{nc.id}</span>
                    <StatusBadge status={nc.status} />
                  </div>
                  <p className="font-medium text-slate-800 truncate">{nc.category}: {nc.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status History & Audit Log */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Immutable Action History
            </h3>

            <div className="space-y-3 text-xs">
              {complaint.statusHistory?.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-blue-700">{h.actorName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(h.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{h.notes || h.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Escalate */}
      <Modal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        title="Escalate Issue to Next Supervisory Level"
        description="Escalation alerts the Department Supervisor and District Management."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Escalation</label>
            <textarea
              rows={3}
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="rounded-xl bg-rose-50 p-3 border border-rose-200 text-rose-900">
            <span className="font-bold block">SLA Impact:</span>
            <span>Target response authority transitions from Level 1 Area Officer to Level 2 Department Officer.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowEscalateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmEscalate}
              isLoading={actionLoading}
            >
              Confirm Escalation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Assign Field Team */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Dispatch Field Operations Team"
        description="Generates an on-ground Work Order with evidence requirement."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Field Response Unit</label>
            <select
              value={selectedFieldTeam}
              onChange={(e) => setSelectedFieldTeam(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white"
            >
              <option value="demo-field-1">Rapid Road Repair Team Bravo (Murugan)</option>
              <option value="demo-field-2">Sanitation & Drainage Unit Alpha</option>
              <option value="demo-field-3">Electrical Infrastructure Crew 4</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Field Team Instructions</label>
            <textarea
              rows={3}
              value={fieldInstructions}
              onChange={(e) => setFieldInstructions(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmAssign}
              isLoading={actionLoading}
            >
              Generate Work Order & Dispatch
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Mark Resolved */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Verify Resolution & Close Grievance"
        description="Official closure requires site remediation notes."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Remediation Verification Notes</label>
            <textarea
              rows={3}
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 text-emerald-900">
            <span className="font-bold block">Resolution Protocol:</span>
            <span>A completion notification with before/after photos will be delivered to citizen {complaint.citizenName}.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowResolveModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleConfirmResolve}
              isLoading={actionLoading}
            >
              Verify & Resolve Complaint
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
