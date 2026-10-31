import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('elena.vance@subscript-saas.com');
  const [password, setPassword] = useState('demo-pass-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid corporate email address.');
      return;
    }
    setError('');
    login(email, password);
    showToast('Signed in successfully (Demo Simulation Mode)');
    navigate('/dashboard');
  };

  const handleDemoQuickLogin = () => {
    login('elena.vance@subscript-saas.com', 'demo-password');
    showToast('Signed in with Demo Administrator Profile!');
    navigate('/dashboard');
  };

  return (
    <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-8 space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-gold">
          Account Access
        </span>
        <h2 className="font-display text-2xl font-bold text-espresso">
          Welcome to Subscript
        </h2>
        <p className="text-xs text-espresso-muted">
          Access your recurring revenue command center.
        </p>
      </div>

      {/* Demo Mode Notice Banner */}
      <div className="p-3 rounded-xl bg-champagne-light border border-champagne-gold/40 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-champagne-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-espresso">Interactive Demo Simulation</p>
          <p className="text-[11px] text-espresso-muted leading-tight">
            Authentication is simulated client-side for hackathon demonstration. No credentials are sent to a live server.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-cherry-light border border-cherry/30 text-xs text-cherry-dark font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-espresso mb-1">Corporate Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-espresso">Password</label>
            <Link
              to="/auth/forgot-password"
              className="text-[11px] text-cherry hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-9 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="••••••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-stone-400 hover:text-espresso"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Sign In to Ledger
        </Button>
      </form>

      {/* One-Click Quick Demo Login */}
      <div className="pt-2 border-t border-stone-warm">
        <Button
          type="button"
          variant="secondary"
          className="w-full text-xs"
          icon={ArrowRight}
          onClick={handleDemoQuickLogin}
        >
          Instant 1-Click Demo Login
        </Button>
      </div>

      <div className="text-center text-xs text-espresso-muted">
        Don&apos;t have an organization account?{' '}
        <Link to="/auth/register" className="text-cherry font-semibold hover:underline">
          Register new tenant
        </Link>
      </div>
    </div>
  );
};
