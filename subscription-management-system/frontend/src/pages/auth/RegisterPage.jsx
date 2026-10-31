import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState('Meridian Analytics Corp.');
  const [fullName, setFullName] = useState('Julian Mercer');
  const [email, setEmail] = useState('julian@meridian.io');
  const [password, setPassword] = useState('SecretPass123!');
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName || !email) {
      setError('Please provide all required fields.');
      return;
    }
    if (!agreed) {
      setError('Please acknowledge the terms of service.');
      return;
    }
    setError('');
    register({ companyName, fullName, email });
    showToast(`Organization "${companyName}" provisioned! (Customer Demo Mode)`);
    navigate('/customer/dashboard');
  };

  return (
    <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-8 space-y-6">
      <div className="text-center space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-gold">
          Tenant Onboarding
        </span>
        <h2 className="font-display text-2xl font-bold text-espresso">
          Create Organization Account
        </h2>
        <p className="text-xs text-espresso-muted">
          Launch your recurring billing infrastructure in minutes.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-champagne-light border border-champagne-gold/40 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-champagne-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-espresso">Client Prototype Mode</p>
          <p className="text-[11px] text-espresso-muted leading-tight">
            Creates a mock organization in client memory for testing and evaluating feature workflows.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-cherry-light border border-cherry/30 text-xs text-cherry-dark font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-espresso mb-1">Company / Organization Name</label>
          <div className="relative">
            <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Apex Meridian Corp"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-espresso mb-1">Primary Administrator Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="e.g. Sarah Jenkins"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-espresso mb-1">Corporate Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="admin@company.com"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-espresso mb-1">Master Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-cherry rounded"
          />
          <label htmlFor="terms" className="text-[11px] text-espresso-muted cursor-pointer">
            I agree to the Master Subscription Agreement and Data Processing Addendum.
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full mt-2">
          Provision Organization Workspace
        </Button>
      </form>

      <div className="text-center text-xs text-espresso-muted pt-2 border-t border-stone-warm">
        Already have access?{' '}
        <Link to="/auth/login" className="text-cherry font-semibold hover:underline">
          Return to login
        </Link>
      </div>
    </div>
  );
};
