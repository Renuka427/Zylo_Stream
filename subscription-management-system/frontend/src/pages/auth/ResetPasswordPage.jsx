import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    showToast('Password updated successfully! Please sign in with your new password.');
    navigate('/auth/login');
  };

  return (
    <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-8 space-y-6">
      <div className="text-center space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-gold">
          Security Update
        </span>
        <h2 className="font-display text-2xl font-bold text-espresso">
          Set New Password
        </h2>
        <p className="text-xs text-espresso-muted">
          Choose a robust new passphrase for your executive account.
        </p>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-cherry-light border border-cherry/30 text-xs text-cherry-dark font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-espresso mb-1">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Minimum 8 characters"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-espresso mb-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-ivory-surface text-espresso pl-9 pr-3 py-2.5 rounded-xl border border-stone-warm focus:outline-none focus:border-cherry"
              placeholder="Re-enter new password"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          Update Credentials & Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-espresso-muted pt-2 border-t border-stone-warm">
        <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-cherry font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </div>
    </div>
  );
};
