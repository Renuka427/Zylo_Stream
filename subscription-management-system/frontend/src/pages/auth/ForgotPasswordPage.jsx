import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';

export const ForgotPasswordPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { await authService.requestPasswordReset(email); setIsSent(true); showToast('Password reset instructions sent.'); }
    catch (err) { setError(err.message || 'Unable to send reset email.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-8 space-y-6">
      <div className="text-center space-y-2"><span className="text-[10px] uppercase font-bold tracking-[0.22em] text-champagne-gold">ACCOUNT RECOVERY</span><h2 className="font-display text-3xl font-bold text-espresso">Reset your password.</h2><p className="text-sm text-espresso-muted">We’ll email you a secure, one-time recovery link.</p></div>
      {error && <div role="alert" className="p-3 rounded-xl bg-cherry-light border border-cherry/30 text-sm text-cherry-dark">{error}</div>}
      {isSent ? <div className="p-5 rounded-2xl bg-champagne-light border border-stone-warm text-center space-y-3"><CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto"/><p className="font-bold">Check your inbox</p><p className="text-sm text-espresso-muted">If an account exists for <strong>{email}</strong>, a password reset link is on its way.</p></div> :
      <form onSubmit={handleSubmit} className="space-y-4 text-sm"><label className="block font-semibold">Email address</label><div className="relative"><Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="you@company.com"/></div><Button type="submit" variant="primary" className="w-full" disabled={busy}>{busy?'Sending…':'Send recovery link'}</Button></form>}
      <div className="text-center text-sm pt-2 border-t border-stone-warm"><Link to="/login" className="inline-flex items-center gap-2 text-cherry font-semibold"><ArrowLeft className="w-4 h-4"/>Back to sign in</Link></div>
    </div>
  );
};
