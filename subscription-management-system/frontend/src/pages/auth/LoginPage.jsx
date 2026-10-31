import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('eleanor.vance@acmestudio.io');
  const [password, setPassword] = useState('demo-customer-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    await login(email, password, 'customer');
    showToast('Signed in successfully as Customer');
    navigate('/customer/dashboard');
  };

  const handleDemoQuickLogin = async () => {
    await login('eleanor.vance@acmestudio.io', 'demo-customer-2026', 'customer');
    showToast('Signed in as Eleanor Vance (Customer Profile)!', 'success');
    navigate('/customer/dashboard');
  };

  const handleGoogleDemoLogin = async () => {
    await loginWithGoogle('customer');
    showToast('Signed in with Google identity!', 'info');
    navigate('/customer/dashboard');
  };

  return (
    <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-8 sm:p-10 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-gold">
          CUSTOMER PORTAL
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
          Welcome back.
        </h2>
        <p className="text-xs sm:text-sm text-espresso-muted">
          Sign in to manage your subscriptions in one place.
        </p>
      </div>

      {/* Google OAuth Demo Button */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoogleDemoLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-stone-warm bg-white hover:bg-stone-50 transition-colors shadow-sm text-xs font-semibold text-espresso"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google (Demo OAuth)</span>
        </button>

        {/* Informational Disclaimer on OAuth */}
        <div className="p-2.5 rounded-xl bg-champagne-light/70 border border-stone-warm/60 text-[11px] text-espresso-muted flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-champagne-gold shrink-0 mt-0.5" />
          <span>
            Development mode: Google identity is simulated client-side. No credentials are transmitted.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-[1px] bg-stone-warm" />
        <span className="text-[10px] uppercase font-bold text-espresso-muted">or corporate email</span>
        <div className="flex-1 h-[1px] bg-stone-warm" />
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-cherry-light border border-cherry/30 text-xs text-cherry-dark font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-espresso mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="customer@acmestudio.io"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-espresso">Password</label>
            <Link
              to="/forgot-password"
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
              className="w-full bg-white text-espresso pl-9 pr-9 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
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
          Sign In to Customer Portal
        </Button>
      </form>

      {/* One-Click Quick Demo Login */}
      <div className="pt-2 border-t border-stone-warm space-y-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full text-xs"
          icon={ArrowRight}
          onClick={handleDemoQuickLogin}
        >
          Instant 1-Click Customer Demo (Eleanor Vance)
        </Button>
      </div>

      {/* Cross-portal Navigation Links */}
      <div className="pt-2 space-y-2 text-center text-xs text-espresso-muted">
        <div>
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="text-cherry font-semibold hover:underline">
            Register Organization
          </Link>
        </div>
        <div className="pt-2 border-t border-stone-warm/50">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-cherry-dark hover:text-cherry font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-champagne-gold" />
            <span>Administrator Access &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
