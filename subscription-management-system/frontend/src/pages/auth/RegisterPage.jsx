import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, User, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); setError('');
    if (password.length < 10) { setError('Use a password with at least 10 characters.'); return; }
    if (!agreed) { setError('Please accept the terms to continue.'); return; }
    setBusy(true);
    try {
      const result = await register({ companyName, fullName, email, password });
      if (result.emailConfirmationRequired) {
        setEmailSent(true);
        showToast('Check your inbox to verify your email address.');
      } else {
        showToast('Your Zylo Stream account is ready.');
        navigate('/customer/dashboard');
      }
    } catch (err) { setError(err.message || 'Unable to create your account.'); }
    finally { setBusy(false); }
  };

  if (emailSent) return (
    <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-9 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 grid place-items-center mx-auto"><CheckCircle2 className="w-7 h-7"/></div>
      <p className="text-[10px] uppercase font-bold tracking-[0.22em] text-champagne-gold">Almost there</p>
      <h2 className="font-display text-3xl font-bold text-espresso">Verify your email.</h2>
      <p className="text-sm text-espresso-muted">We sent a confirmation link to <strong>{email}</strong>. Open it to activate your account, then sign in.</p>
      <Link to="/login" className="text-sm font-semibold text-cherry hover:underline">Return to sign in</Link>
    </div>
  );

  return (
    <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-8 space-y-6">
      <div className="text-center space-y-2"><span className="text-[10px] uppercase font-bold tracking-[0.22em] text-champagne-gold">MEMBER ENROLMENT</span><h2 className="font-display text-3xl font-bold text-espresso">Create your account.</h2><p className="text-sm text-espresso-muted">A refined workspace for your recurring business.</p></div>
      {error && <div role="alert" className="p-3 rounded-xl bg-cherry-light border border-cherry/30 text-sm text-cherry-dark">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
        <div><label className="block font-semibold text-espresso mb-1.5">Company name</label><div className="relative"><Building className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input required value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="Your organisation"/></div></div>
        <div><label className="block font-semibold text-espresso mb-1.5">Full name</label><div className="relative"><User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input required autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="Your name"/></div></div>
        <div><label className="block font-semibold text-espresso mb-1.5">Work email</label><div className="relative"><Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="you@company.com"/></div></div>
        <div><label className="block font-semibold text-espresso mb-1.5">Password</label><div className="relative"><Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="At least 10 characters"/></div></div>
        <label className="flex items-start gap-2 text-xs text-espresso-muted pt-1"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="mt-0.5 accent-cherry"/><span>I agree to the Master Subscription Agreement and Data Processing Addendum.</span></label>
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>{busy?'Creating account…':'Create secure account'}</Button>
      </form>
      <div className="text-center text-sm text-espresso-muted pt-3 border-t border-stone-warm">Already registered? <Link to="/login" className="text-cherry font-semibold hover:underline">Sign in</Link></div>
    </div>
  );
};
