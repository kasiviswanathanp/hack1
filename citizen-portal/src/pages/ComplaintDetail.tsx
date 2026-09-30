import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  ShieldCheck,
  Star,
  RefreshCw,
  Camera,
  Check,
} from 'lucide-react';

export const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Rating & Reopen state
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [rated, setRated] = useState(false);
  const [reopening, setReopening] = useState(false);

  useEffect(() => {
    if (id) {
      api.getComplaint(id)
        .then((data) => setComplaint(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleRate = async (reopen: boolean = false) => {
    if (!id) return;
    try {
      await api.rateComplaint(id, rating, feedback, reopen);
      setRated(true);
      if (reopen) {
        alert('Complaint reopened and routed back to Zonal Supervisor.');
        window.location.reload();
      } else {
        alert('Thank you for rating municipal response service!');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit rating');
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-xs font-semibold text-slate-400">Loading complaint details...</div>;
  }

  if (!complaint) {
    return <div className="py-24 text-center text-xs font-semibold text-slate-400">Complaint not found.</div>;
  }

  const proof = complaint.resolution_proof;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/my-complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                {complaint.id}
              </span>
              <span className="text-xs font-bold text-slate-600">{complaint.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {complaint.title || complaint.description}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                complaint.status === 'RESOLVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : complaint.status === 'ESCALATED'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}
            >
              {complaint.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">{complaint.readable_address}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>SLA: {complaint.sla_evaluation?.label || 'On Track'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">{complaint.department_name || 'Municipal Roads'}</span>
          </div>
        </div>
      </div>

      {/* Resolution Proof Card (when resolved) */}
      {proof && (
        <div className="bg-emerald-50/60 rounded-3xl border-2 border-emerald-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Verified Proof of Resolution (Before vs. After)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold">
              GPS Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {proof.before_image_url && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Before Remediation:</span>
                <img
                  src={proof.before_image_url}
                  alt="Before"
                  className="w-full h-44 object-cover rounded-2xl border border-slate-200"
                />
              </div>
            )}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">After Field Work:</span>
              <img
                src={proof.after_image_url}
                alt="After"
                className="w-full h-44 object-cover rounded-2xl border border-emerald-300 shadow-xs"
              />
            </div>
          </div>

          <p className="text-xs text-emerald-900 bg-white p-3 rounded-2xl border border-emerald-200">
            <strong>Field Engineer Notes:</strong> {proof.notes}
          </p>

          {/* Citizen Rating & Reopen Section */}
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900">Are you satisfied with this resolution?</h4>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
            </div>

            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Leave feedback on the field team's repair work..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleRate(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Rating
              </button>

              <button
                type="button"
                onClick={() => handleRate(true)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Dispute & Reopen Grievance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State Machine Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Official Lifecycle Audit Trail</h3>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {(complaint.history || []).map((step: any, idx: number) => (
            <div key={idx} className="relative text-left space-y-1">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{step.status}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(step.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-600">{step.notes || 'Status transition logged.'}</p>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Actor: {step.actor_name} ({step.actor_role})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
