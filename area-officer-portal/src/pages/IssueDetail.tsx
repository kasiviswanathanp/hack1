import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Send,
  ShieldAlert,
  XCircle,
  Edit2,
  FileText,
} from 'lucide-react';

export const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<any | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Actions state
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teamInstructions, setTeamInstructions] = useState<string>('');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [escalateReason, setEscalateReason] = useState<string>('');
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    if (id) {
      Promise.all([api.getIssue(id), api.getFieldTeams()])
        .then(([iss, tms]) => {
          setIssue(iss);
          setTeams(tms);
          if (tms.length > 0) setSelectedTeam(tms[0].id);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    if (!id) return;
    try {
      await api.updateStatus(id, status, internalNotes);
      alert(`Issue marked as ${status}`);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleAssignTeam = async () => {
    if (!id || !selectedTeam) return;
    const teamObj = teams.find((t) => t.id === selectedTeam);
    try {
      await api.assignTeam(id, selectedTeam, teamObj?.name || 'Field Squad', teamInstructions);
      alert(`Field team ${teamObj?.name} dispatched successfully!`);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Team assignment failed');
    }
  };

  const handleEscalate = async () => {
    if (!id || !escalateReason) {
      alert('Please provide an escalation justification reason.');
      return;
    }
    try {
      await api.escalate(id, escalateReason, 2);
      alert('Grievance escalated to Level 2 (Department Officer).');
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Escalation failed');
    }
  };

  if (loading) return <div className="py-24 text-center text-xs font-semibold text-slate-400">Loading issue details...</div>;
  if (!issue) return <div className="py-24 text-center text-xs font-semibold text-slate-400">Issue not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <Link
        to="/ward-issues"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Ward Queue</span>
      </Link>

      {/* Main Issue Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                {issue.id}
              </span>
              <span className="text-xs font-bold text-slate-600">{issue.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {issue.title || issue.description}
            </h1>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              issue.status === 'RESOLVED'
                ? 'bg-emerald-100 text-emerald-800'
                : issue.status === 'ESCALATED'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {issue.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div>
            <span className="font-bold block text-slate-400 uppercase text-[10px]">Location</span>
            <span>{issue.readable_address}</span>
          </div>
          <div>
            <span className="font-bold block text-slate-400 uppercase text-[10px]">Reporting Citizen</span>
            <span>{issue.citizen_name} ({issue.citizen_phone || 'N/A'})</span>
          </div>
          <div>
            <span className="font-bold block text-slate-400 uppercase text-[10px]">Response SLA</span>
            <span className="font-bold text-amber-700">{issue.sla_evaluation?.label || 'On Track'}</span>
          </div>
        </div>

        {issue.image_url && (
          <div className="pt-2">
            <span className="font-bold block text-slate-400 uppercase text-[10px] mb-1">Citizen Evidence</span>
            <img
              src={issue.image_url}
              alt="Evidence"
              className="w-full sm:w-80 h-44 object-cover rounded-2xl border border-slate-200"
            />
          </div>
        )}
      </div>

      {/* Action 1: Verification & Status Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>1. Verify & Accept Grievance</span>
        </h3>
        <p className="text-xs text-slate-500">
          Review defect coordinates and accept or reject the report into the active municipal response workflow.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleUpdateStatus('VERIFIED')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
          >
            Verify & Accept Issue
          </button>
          <button
            type="button"
            onClick={() => handleUpdateStatus('REJECTED')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
          >
            Reject Grievance
          </button>
        </div>
      </div>

      {/* Action 2: Dispatch Field Team */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>2. Dispatch Ward Field Team</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Field Response Unit</label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full sm:w-96 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Lead: {t.leader_name} • {t.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Instructions & Safety Notes</label>
            <textarea
              rows={2}
              value={teamInstructions}
              onChange={(e) => setTeamInstructions(e.target.value)}
              placeholder="e.g. Bring asphalt compactor and safety cones. Heavy vehicular flow during peak hours."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAssignTeam}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Field Squad to Site</span>
          </button>
        </div>
      </div>

      {/* Action 3: Overdue Escalation to Level 2 */}
      <div className="bg-rose-50/60 p-6 rounded-3xl border border-rose-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>3. Overdue Escalation to Level 2 (Department Officer)</span>
        </h3>
        <p className="text-xs text-rose-700">
          If defect complexity exceeds ward resources or SLA is approaching breach, escalate to Level 2 Department Officer.
        </p>

        <div className="space-y-3">
          <textarea
            rows={2}
            value={escalateReason}
            onChange={(e) => setEscalateReason(e.target.value)}
            placeholder="Reason for escalation: e.g. Major underground pipeline breach requiring departmental heavy excavation..."
            className="w-full p-2.5 rounded-xl border border-rose-300 text-xs bg-white"
          />

          <button
            type="button"
            onClick={handleEscalate}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-sm"
          >
            Escalate to Department Officer (Level 2)
          </button>
        </div>
      </div>
    </div>
  );
};
