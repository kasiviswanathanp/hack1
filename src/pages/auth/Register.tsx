import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import { Shield, Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { CivicEmblem } from '@/components/common/CivicLogo';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password, name, 'CITIZEN');
      navigate('/citizen');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    }
  };

  return (
    <div className="rounded-3xl border border-slate-700/80 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl text-left space-y-6">
      <div className="text-center space-y-2">
        <CivicEmblem className="w-14 h-14 mx-auto drop-shadow-lg hover:scale-105 transition-transform" />
        <h1 className="text-2xl font-extrabold tracking-tight">Citizen Registration</h1>
        <p className="text-xs text-slate-400 font-medium">{APP_TAGLINE}</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-red-700 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Legal Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefixIcon={<User className="w-4 h-4" />}
          className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
          placeholder="e.g. Priya Ramanathan"
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefixIcon={<Mail className="w-4 h-4" />}
          className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
          placeholder="priya@citizen.org"
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          prefixIcon={<Lock className="w-4 h-4" />}
          className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
          required
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="w-full font-bold shadow-md shadow-blue-600/30"
        >
          Create CivicAI Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400">
        <span>Already have an account? </span>
        <Link to="/login" className="text-blue-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
