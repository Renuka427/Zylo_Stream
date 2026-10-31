import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('elena.vance@subscript-saas.com');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSent(true);
    showToast(`Password recovery link simulated for ${email}`);
  };

  return (
    <div className="bg-ivory rounded-2xl border border-stone-warm shadow-luxury p-8 space-y-6">
      <div className="text-center space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-champagne-gold">
          Credentials Recovery
        </span>
        <h2 className="font-display text-2xl font-bold text-espresso">
          Reset Your Password
        </h2>
        <p className="text-xs text-espresso-muted">
          Enter your registered email to receive recovery instructions.
        </p>
      </div>

      {isSent ? (
        <div className="p-4 rounded-xl bg-champagne-light border border-stone-warm text-center space-y-3 text-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
          <p className="font-bold text-espresso">Instructions Sent!</p>
          <p className="text-espresso-muted leading-relaxed">
            A secure password reset link has been dispatched to <span className="font-mono text-espresso font-semibold">{email}</span>.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/auth/reset-password')}
            className="w-full"
          >
            Continue to Reset Screen (Simulation)
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                placeholder="name@company.com"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Dispatch Recovery Link
          </Button>
        </form>
      )}

      <div className="text-center text-xs text-espresso-muted pt-2 border-t border-stone-warm">
        <Link to="/auth/login" className="inline-flex items-center gap-1.5 text-cherry font-semibold hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to login
        </Link>
      </div>
    </div>
  );
};
