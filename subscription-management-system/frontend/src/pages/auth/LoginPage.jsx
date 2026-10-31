import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(email, password, 'customer'); showToast('Welcome back to Zylo Stream.'); navigate('/customer/dashboard'); }
    catch (err) { setError(err.message || 'Unable to sign in.'); }
    finally { setBusy(false); }
  };
  const handleGoogle = async () => {
    setError(''); setBusy(true);
    try { await loginWithGoogle(); }
    catch (err) { setError(err.message || 'Google sign-in could not start.'); setBusy(false); }
  };

  return (
    <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-champagne-gold">CUSTOMER PORTAL</span>
        <h2 className="font-display text-3xl font-black text-espresso tracking-tight">Welcome back.</h2>
        <p className="text-sm text-espresso-muted">One secure space for every subscription.</p>
      </div>
      <button type="button" onClick={handleGoogle} disabled={busy} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-warm bg-white hover:bg-stone-50 transition-colors shadow-sm text-sm font-semibold text-espresso disabled:opacity-60">
        <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
        Continue with Google
      </button>
      <div className="flex items-center gap-3"><div className="flex-1 h-px bg-stone-warm"/><span className="text-[10px] uppercase font-bold tracking-widest text-espresso-muted">or continue with email</span><div className="flex-1 h-px bg-stone-warm"/></div>
      {error && <div role="alert" className="p-3 rounded-xl bg-cherry-light border border-cherry/30 text-sm text-cherry-dark">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div><label className="block font-semibold text-espresso mb-1.5">Email address</label><div className="relative"><Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white text-espresso pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="you@company.com"/></div></div>
        <div><div className="flex items-center justify-between mb-1.5"><label className="font-semibold text-espresso">Password</label><Link to="/forgot-password" className="text-xs text-cherry hover:underline font-medium">Forgot password?</Link></div><div className="relative"><Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type={showPassword?'text':'password'} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white text-espresso pl-10 pr-10 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="Enter your password"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-stone-400" aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></div>
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>{busy?'Signing in…':'Sign in securely'}</Button>
      </form>
      <div className="pt-3 border-t border-stone-warm text-center space-y-3 text-sm text-espresso-muted">
        <p>New to Zylo Stream? <Link to="/register" className="text-cherry font-semibold hover:underline">Create your account</Link></p>
        <Link to="/admin/login" className="inline-flex items-center gap-2 text-cherry-dark hover:text-cherry font-medium"><ShieldCheck className="w-4 h-4"/> Administrator access</Link>
      </div>
    </div>
  );
};
