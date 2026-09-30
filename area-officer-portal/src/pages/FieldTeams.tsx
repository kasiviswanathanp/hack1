import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Users, Phone, MapPin, CheckCircle2, Clock } from 'lucide-react';

export const FieldTeams: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFieldTeams()
      .then((data) => setTeams(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-left space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ward Field Teams & Readiness
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Monitor field squads assigned to your ward, track active task loads, and dispatch teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {t.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Squad Lead: <strong>{t.leader_name}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact: {t.contact_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Stationed: {t.ward_id || 'Ward 102 (Central Zone)'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Task Load</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {t.active_task_count || 1} Active Assignments
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
