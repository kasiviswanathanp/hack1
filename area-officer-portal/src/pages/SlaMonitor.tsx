import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Clock, AlertTriangle, ShieldAlert, ArrowRight, MapPin } from 'lucide-react';

export const SlaMonitor: React.FC = () => {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWardIssues()
      .then((data) => setIssues(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ward SLA Countdown & Escalation Monitor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enforces 24-hour initial acknowledgement SLA and automatic escalation triggers.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 grid grid-cols-12 gap-2">
          <div className="col-span-3">Grievance & Area</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-3">Response SLA Remaining</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {issues.map((i) => {
            const isBreached = i.sla_evaluation?.is_breached;
            return (
              <div key={i.id} className="p-4 grid grid-cols-12 gap-2 items-center text-xs">
                <div className="col-span-3">
                  <span className="font-mono font-bold text-amber-800 block">{i.id}</span>
                  <span className="text-slate-500 truncate block">{i.area}</span>
                </div>
                <div className="col-span-2 font-bold text-slate-800 truncate">{i.category}</div>
                <div className="col-span-2">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      i.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {i.priority}
                  </span>
                </div>
                <div className="col-span-3">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                      isBreached ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{i.sla_evaluation?.label || 'On Track'}</span>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <Link
                    to={`/issue/${i.id}`}
                    className="px-3 py-1 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 inline-block"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
