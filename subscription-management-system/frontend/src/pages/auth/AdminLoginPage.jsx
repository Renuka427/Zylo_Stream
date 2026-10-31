import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await login(email, password, 'admin');
      showToast('Administrator session authorized.');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Administrative verification failed.');
    } finally { setBusy(false); }
  };

  return (
    <div className="bg-ivory rounded-3xl border-2 border-cherry/20 shadow-luxury p-8 sm:p-10 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cherry via-champagne-gold to-cherry-dark"/>
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cherry/10 border border-cherry/20 text-[10px] font-bold text-cherry uppercase tracking-widest"><ShieldAlert className="w-3.5 h-3.5"/> Restricted workspace</div>
        <h2 className="font-display text-3xl font-black text-espresso">Administrator access</h2>
        <p className="text-sm text-espresso-muted">Use an account explicitly provisioned with administrator privileges.</p>
      </div>
      {error && <div role="alert" className="p-3 rounded-xl bg-cherry-light border border-cherry/30 text-sm text-cherry-dark">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div><label className="block font-semibold mb-1.5">Administrative email</label><div className="relative"><Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-white pl-10 pr-3 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="admin@company.com"/></div></div>
        <div><label className="block font-semibold mb-1.5">Password</label><div className="relative"><Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5"/><input type={showPassword?'text':'password'} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-white pl-10 pr-10 py-3 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry" placeholder="Your password"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-stone-400" aria-label={showPassword?'Hide password':'Show password'}>{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></div>
        <Button type="submit" variant="primary" className="w-full bg-cherry hover:bg-cherry-dark text-ivory" disabled={busy}>{busy?'Verifying…':'Authorize administrator session'}</Button>
      </form>
      <div className="text-center text-sm pt-3 border-t border-stone-warm text-espresso-muted"><Link to="/login" className="text-cherry font-semibold hover:underline">Customer sign in</Link><span className="mx-2">·</span><Link to="/" className="inline-flex items-center gap-1 text-cherry font-semibold"><ArrowLeft className="w-3.5 h-3.5"/> Home</Link></div>
    </div>
  );
};
