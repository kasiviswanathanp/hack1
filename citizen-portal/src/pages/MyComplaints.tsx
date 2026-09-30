import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { ListOrdered, MapPin, Clock, ArrowRight, Layers, CheckCircle2, ShieldAlert } from 'lucide-react';

export const MyComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.getMyComplaints()
      .then((data) => setComplaints(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = complaints.filter((c) => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN') return ['SUBMITTED', 'AI_ANALYSIS', 'VERIFIED'].includes(c.status);
    if (filter === 'ACTIVE') return ['ASSIGNED', 'IN_PROGRESS', 'FIELD_VISIT'].includes(c.status);
    if (filter === 'RESOLVED') return c.status === 'RESOLVED';
    if (filter === 'ESCALATED') return c.status === 'ESCALATED' || (c.escalation_level && c.escalation_level > 1);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Submitted Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Track real-time status transitions, field crew dispatch, and photo verification proof.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {(['ALL', 'OPEN', 'ACTIVE', 'RESOLVED', 'ESCALATED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-semibold text-slate-400">
          Loading grievances...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400 space-y-2">
          <p className="text-sm font-semibold">No complaints found matching this filter.</p>
          <Link to="/report-issue" className="text-xs text-blue-600 font-bold hover:underline">
            Report a new issue now →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/complaint/${c.id}`}
              className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                      {c.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{c.category}</span>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'ESCALATED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                  {c.title || c.description}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.area}, {c.ward} • {c.municipality}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold">SLA: {c.sla_evaluation?.label || 'On Track'}</span>
                </div>

                <div className="flex items-center gap-1 text-blue-600 font-bold hover:underline">
                  <span>Inspect Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
