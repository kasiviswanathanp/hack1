import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import {
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  LogIn,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const DistrictManagerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, switchRole, isLoading } = useAuth();

  const [email, setEmail] = useState('arunkumar.ias@civicai.org');
  const [clearanceId, setClearanceId] = useState('DM-CHN-001');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmail(email, password);
      await switchRole('DISTRICT_MANAGER');
      navigate('/management/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    await switchRole('DISTRICT_MANAGER');
    navigate('/management/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-purple-500/40 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl text-left space-y-6">
      {/* Brand & Header */}
      <div className="text-center space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600 text-white mx-auto shadow-md shadow-purple-600/40">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
          <span>Executive Level 4 • District Collectorate</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          District Manager Login
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Executive oversight for District Collector IAS & Municipal Commissioner to monitor city-wide GIS hotspots.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Executive Official Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefixIcon={<Mail className="w-4 h-4 text-slate-400" />}
          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Officer Clearance ID"
            type="text"
            value={clearanceId}
            onChange={(e) => setClearanceId(e.target.value)}
            prefixIcon={<KeyRound className="w-4 h-4 text-purple-400" />}
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 font-mono text-xs"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            prefixIcon={<Lock className="w-4 h-4 text-slate-400" />}
            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
          className="w-full font-bold bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 py-2.5 text-sm"
        >
          Access Executive Console
        </Button>
      </form>

      {/* Demo helper */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Demo Executive Sign-In (Dr. A. Arunkumar IAS)</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-850">
        <span>Office of the District Collector & District Magistrate</span>
      </div>
    </div>
  );
};
