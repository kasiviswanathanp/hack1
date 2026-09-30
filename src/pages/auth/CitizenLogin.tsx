import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  LogIn,
  Shield,
  Sparkles,
} from 'lucide-react';
import { CivicEmblem } from '@/components/common/CivicLogo';

export const CitizenLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, switchRole, isLoading } = useAuth();

  const [email, setEmail] = useState('priya.citizen@civicai.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await loginWithEmail(email, password);
      await switchRole('CITIZEN');
      navigate('/citizen');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      await switchRole('CITIZEN');
      navigate('/citizen');
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    await switchRole('CITIZEN');
    navigate('/citizen');
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-slate-900 shadow-xl text-left space-y-6">
      {/* Brand & Header */}
      <div className="text-center space-y-2">
        <CivicEmblem className="w-14 h-14 mx-auto drop-shadow-md hover:scale-105 transition-transform" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <User className="w-3.5 h-3.5" />
          <span>Citizen Public Grievance Portal</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Citizen Login
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Report civic issues, track real-time resolution deadlines, and receive SMS/WhatsApp updates.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Citizen Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefixIcon={<Mail className="w-4 h-4 text-slate-400" />}
          placeholder="your.email@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          prefixIcon={<Lock className="w-4 h-4 text-slate-400" />}
          placeholder="••••••••"
          required
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
          className="w-full font-bold shadow-sm shadow-blue-500/25 py-2.5 text-sm"
        >
          Sign In
        </Button>
      </form>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span>Sign In with Google</span>
      </button>

      {/* Demo helper */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-blue-200"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Demo Citizen Sign-In (Priya Ramanathan)</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1.5">
        <div>
          <span>New resident? </span>
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register an Account
          </Link>
        </div>
        <div className="pt-1.5 border-t border-slate-100">
          <Link to="/portals" className="text-slate-400 hover:text-blue-600 text-[11px] font-medium transition-colors">
            Official Municipal Staff & Officer Portals →
          </Link>
        </div>
      </div>
    </div>
  );
};
