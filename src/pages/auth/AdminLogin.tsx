import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import {
  ShieldAlert,
  Mail,
  Lock,
  AlertCircle,
  LogIn,
  KeyRound,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, switchRole, isLoading } = useAuth();

  const [email, setEmail] = useState('admin@civicai.org');
  const [securityPin, setSecurityPin] = useState('ADM-SYS-999');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmail(email, password);
      await switchRole('ADMIN');
      navigate('/admin');
    } catch (err: any) {
      setError(err?.message || 'Administrator authentication failed. Please verify credentials.');
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    await switchRole('ADMIN');
    navigate('/admin');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-rose-500/40 bg-slate-950 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl text-left space-y-6">
      {/* Brand & Header */}
      <div className="text-center space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-700 text-white mx-auto shadow-md shadow-rose-700/40">
          <Terminal className="w-7 h-7" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold">
          <KeyRound className="w-3.5 h-3.5 text-rose-400" />
          <span>System Administration • Root Authority</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          System Administrator Login
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Manage system configurations, Firestore security rules, SLA policies, and department hierarchies.
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
          label="Administrator Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefixIcon={<Mail className="w-4 h-4 text-slate-400" />}
          className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Root Security Key"
            type="text"
            value={securityPin}
            onChange={(e) => setSecurityPin(e.target.value)}
            prefixIcon={<KeyRound className="w-4 h-4 text-rose-400" />}
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
          className="w-full font-bold bg-rose-700 hover:bg-rose-600 shadow-md shadow-rose-700/30 py-2.5 text-sm"
        >
          Authenticate as Administrator
        </Button>
      </form>

      {/* Demo helper */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-800"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Demo Admin Sign-In (K. Senthil Nathan - Principal IT Admin)</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-850">
        <span>CivicAI Infrastructure & Governance Directorate</span>
      </div>
    </div>
  );
};
