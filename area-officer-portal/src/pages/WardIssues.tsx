import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { MapPin, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const WardIssues: React.FC = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWardIssues()
      .then((data) => setIssues(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = issues.filter((i) => {
    if (filter === 'ALL') return true;
    if (filter === 'SUBMITTED') return i.status === 'SUBMITTED';
    if (filter === 'ACTIVE') return ['ASSIGNED', 'IN_PROGRESS'].includes(i.status);
    if (filter === 'ESCALATED') return i.status === 'ESCALATED' || (i.escalation_level && i.escalation_level > 1);
    if (filter === 'RESOLVED') return i.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ward Issues Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Complaints strictly scoped to your assigned ward jurisdiction.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {(['ALL', 'SUBMITTED', 'ACTIVE', 'ESCALATED', 'RESOLVED'] as const).map((tab) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {c.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
              <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{c.title || c.description}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{c.area}, {c.ward}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                SLA: {c.sla_evaluation?.label || 'On Track'}
              </span>
              <Link
                to={`/issue/${c.id}`}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
