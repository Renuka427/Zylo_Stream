import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { authService } from '../../services/authService';

export const AuthCallbackPage = () => {
  const navigate = useNavigate(); const [message, setMessage] = useState('Verifying your secure sign-in…');
  useEffect(() => {
    let active = true;
    const finish = async () => {
      if (!supabase) { setMessage('Authentication is not configured.'); return; }
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) { if (active) setMessage(error?.message || 'This sign-in link is invalid or expired.'); return; }
      try {
        const user = await authService.getSessionUser(data.session);
        if (active) navigate(user.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard', { replace: true });
      } catch (profileError) { if (active) setMessage(profileError.message || 'Unable to load your account.'); }
    };
    finish();
    return () => { active = false; };
  }, [navigate]);
  return <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-9 text-center"><p className="font-display text-2xl font-bold text-espresso">Zylo Stream</p><p className="mt-3 text-sm text-espresso-muted">{message}</p></div>;
};
