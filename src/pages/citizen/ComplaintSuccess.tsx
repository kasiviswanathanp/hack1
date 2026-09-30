import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Complaint } from '@/types';
import { Button } from '@/components/common/Button';
import { StatusBadge } from '@/components/common/Badge';
import { formatDate } from '@/utils';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share2,
  Copy,
} from 'lucide-react';

export const ComplaintSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const complaint = (location.state as { complaint?: Complaint })?.complaint;
  const complaintId = id || complaint?.id || 'CIV-2026-001245';

  const copyId = () => {
    navigator.clipboard.writeText(complaintId);
    alert(`Complaint ID ${complaintId} copied to clipboard!`);
  };

  const steps = [
    { title: 'Submitted', desc: 'Complaint registered in Firestore', done: true },
    { title: 'AI Analysed', desc: 'Google Gemini verified visual defect', done: true },
    { title: 'Officer Assigned', desc: 'Dispatched to Ward 102 Area Queue', done: false },
    { title: 'Under Review', desc: 'SLA countdown active', done: false },
    { title: 'Field Work', desc: 'Ground crew dispatch', done: false },
    { title: 'Resolved', desc: 'Photographic proof verification', done: false },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-left space-y-6">
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30 animate-in zoom-in">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Official Municipal Submission
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Complaint Submitted Successfully
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
            Your grievance has been classified and linked to the municipal SLA governance monitor.
          </p>
        </div>

        {/* Complaint ID readout */}
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white border border-emerald-300/80 px-4 py-2.5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Complaint ID:</span>
          <span className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider">
            {complaintId}
          </span>
          <button
            onClick={copyId}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            title="Copy ID"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
            <div className="mt-1">
              <StatusBadge status="SUBMITTED" />
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Area</span>
            <span className="font-bold text-slate-900 block mt-1">
              {complaint?.location.area || 'Anna Nagar West'}, {complaint?.location.ward || 'Ward 102'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Response Window</span>
            <span className="font-bold font-mono text-blue-700 block mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Within 24 Hours SLA</span>
            </span>
          </div>
        </div>

        {/* Sequential Timeline required by Section 7 */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Grievance Resolution Lifecycle
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {steps.map((st, i) => (
              <div
                key={st.title}
                className={`p-2.5 rounded-xl border text-center ${
                  st.done
                    ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50/50 text-slate-500'
                }`}
              >
                <span className="text-[10px] block font-mono text-slate-400">Step {i + 1}</span>
                <span className="text-xs font-bold truncate block">{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => navigate('/citizen')}
          className="w-full sm:w-auto"
        >
          Return to Dashboard
        </Button>

        <Button
          variant="primary"
          onClick={() => navigate(`/citizen/complaints/${complaintId}`)}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto font-bold px-6"
        >
          Track Complaint
        </Button>
      </div>
    </div>
  );
};
