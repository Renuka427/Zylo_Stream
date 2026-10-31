import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, USER_ROLES } from '../services/authService';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) console.error('Unable to restore Supabase session:', error.message);
      if (!mounted) return;
      setSession(data.session);
      try { setUser(await authService.getSessionUser(data.session)); }
      catch (profileError) { console.error('Unable to load account profile:', profileError.message); }
      if (mounted) setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) { setUser(null); return; }
      // Defer profile query outside the auth callback to avoid locking the auth client.
      setTimeout(async () => {
        if (!mounted) return;
        try { setUser(await authService.getSessionUser(nextSession)); }
        catch (profileError) { console.error('Unable to load account profile:', profileError.message); }
      }, 0);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const login = async (email, password, requestedRole = USER_ROLES.CUSTOMER) => {
    const result = await authService.login(email, password, requestedRole);
    setUser(result.user); setSession(result.session); return result.user;
  };
  const loginWithGoogle = () => authService.loginWithGoogle();
  const logout = async () => { await authService.logout(); setUser(null); setSession(null); };
  const register = (data) => authService.register(data);
  const updateCustomerProfile = async (updates) => {
    const updated = await authService.updateProfile(updates); setUser(updated); return updated;
  };

  return (
    <AuthContext.Provider value={{
      user, session, loading, isAuthenticated: Boolean(session?.user && user),
      role: user?.role || USER_ROLES.CUSTOMER, login, loginWithGoogle, logout,
      updateCustomerProfile, register,
      isAdmin: user?.role === USER_ROLES.ADMIN,
      isCustomer: user?.role === USER_ROLES.CUSTOMER
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
