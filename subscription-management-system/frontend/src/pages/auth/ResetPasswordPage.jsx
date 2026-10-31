import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { authService } from '../../services/authService';

export const ResetPasswordPage = () => {
  const navigate = useNavigate(); const { showToast } = useToast();
  const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault(); setError('');
    if (password.length < 10) { setError('Use at least 10 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try { await authService.updatePassword(password); showToast('Password updated. Please sign in again.'); navigate('/login'); }
    catch (err) { setError(err.message || 'Unable to update password.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-8 space-y-6">
      <div className="text-center space-y-2"><span className="text-[10px] uppercase font-bold tracking-[0.22em] text-champagne-gold">SECURITY UPDATE</span><h2 className="font-display text-3xl font-bold text-espresso">Choose a new password.</h2><p className="text-sm text-espresso-muted">Use a strong password that you haven’t used elsewhere.</p></div>
      {error && <div role="alert" className="p-3 rounded-xl bg-cherry-light border border-cherry/30 text-sm text-cherry-dark">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div><label className="block font-semibold mb-1.5">New password</label><div className="relative"><Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="At least 10 characters"/></div></div>
        <div><label className="block font-semibold mb-1.5">Confirm password</label><input type="password" required minLength={10} autoComplete="new-password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full bg-white px-4 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="Enter it again"/></div>
        <Button type="submit" variant="primary" className="w-full" disabled={busy}>{busy?'Updating…':'Update password'}</Button>
      </form>
      <div className="text-center text-sm pt-2 border-t border-stone-warm"><Link to="/login" className="inline-flex items-center gap-2 text-cherry font-semibold"><ArrowLeft className="w-4 h-4"/>Back to sign in</Link></div>
    </div>
  );
};
