import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@zylostream.io');
  const [password, setPassword] = useState('admin-super-pass-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid administrative email.');
      return;
    }
    setError('');
    try {
      await login(email, password, 'admin');
      showToast('Signed in successfully as Administrator');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Administrative verification failed.');
    }
  };


  const handleGoogleDemoLogin = async () => {
    await loginWithGoogle('admin');
    showToast('Administrator verified with Google OAuth!', 'info');
    navigate('/admin/dashboard');
  };

  return (
    <div className="bg-ivory rounded-3xl border-2 border-cherry/20 shadow-luxury p-8 sm:p-10 space-y-6 relative overflow-hidden">
      {/* Subtle top indicator strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cherry via-champagne-gold to-cherry-dark" />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cherry/10 border border-cherry/20 text-[10px] font-bold text-cherry uppercase tracking-widest mx-auto">
          <ShieldAlert className="w-3.5 h-3.5 text-cherry" />
          <span>RESTRICTED APPLICATION ZONE</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
          Administrator Access
        </h2>
        <p className="text-xs sm:text-sm text-espresso-muted">
          Sign in to access the Zylo Stream administration workspace.
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
          <span>Continue with Google (Demo Admin OAuth)</span>
        </button>

        <div className="p-2.5 rounded-xl bg-champagne-light border border-stone-warm text-[11px] text-espresso-muted flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-champagne-gold shrink-0 mt-0.5" />
          <span>
            Development mode: Role is simulated as <strong>admin</strong>. No live server requests are sent.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-[1px] bg-stone-warm" />
        <span className="text-[10px] uppercase font-bold text-espresso-muted">or administrative credentials</span>
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
          <label className="block font-semibold text-espresso mb-1">Administrative Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="admin@zylostream.io"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-espresso">Security Key / Password</label>
            <span className="text-[11px] text-espresso-muted">Enterprise Vault</span>
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

        <Button type="submit" variant="primary" className="w-full bg-cherry hover:bg-cherry-dark text-ivory">
          Authorize Administrator Session
        </Button>
      </form>


      {/* Links back to public home & customer portal */}
      <div className="pt-2 space-y-3 text-center text-xs text-espresso-muted border-t border-stone-warm/50">
        <div>
          Not an administrator?{' '}
          <Link to="/login" className="text-cherry font-semibold hover:underline">
            Go to Customer Sign-In
          </Link>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-espresso-muted hover:text-cherry font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
