import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const USER_ROLES = { CUSTOMER: 'customer', ADMIN: 'admin' };

const normalizeUser = (authUser, profile) => ({
  id: authUser.id,
  email: authUser.email,
  name: profile?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Customer',
  company: profile?.company_name || authUser.user_metadata?.company_name || '',
  role: profile?.role || USER_ROLES.CUSTOMER,
  avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
  emailVerified: Boolean(authUser.email_confirmed_at)
});

const ensureProfile = async (authUser) => {
  const { data: profile, error } = await supabase
    .from('user_profiles').select('id, full_name, company_name, role').eq('id', authUser.id).maybeSingle();
  if (error) throw error;
  if (profile) return normalizeUser(authUser, profile);
  const payload = {
    id: authUser.id,
    full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
    company_name: authUser.user_metadata?.company_name || null,
    role: USER_ROLES.CUSTOMER
  };
  const { data, error: insertError } = await supabase
    .from('user_profiles').insert(payload).select('id, full_name, company_name, role').single();
  if (insertError) throw insertError;
  return normalizeUser(authUser, data);
};

export const authService = {
  isConfigured: isSupabaseConfigured,

  async getSessionUser(session) {
    if (!session?.user) return null;
    return ensureProfile(session.user);
  },

  async login(email, password, requestedRole = USER_ROLES.CUSTOMER) {
    if (!supabase) throw new Error('Supabase is not configured. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Unable to establish a user session.');
    const user = await ensureProfile(data.user);
    if (requestedRole === USER_ROLES.ADMIN && user.role !== USER_ROLES.ADMIN) {
      await supabase.auth.signOut();
      throw new Error('This account is not authorized for administrator access.');
    }
    return { user, session: data.session };
  },

  async loginWithGoogle() {
    if (!supabase) throw new Error('Supabase is not configured. Add the Supabase frontend environment variables.');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' }
    });
    if (error) throw error;
  },

  async register(data) {
    if (!supabase) throw new Error('Supabase is not configured. Add the Supabase frontend environment variables.');
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
        data: {
          full_name: data.fullName || data.name || '',
          company_name: data.companyName || data.company || ''
        }
      }
    });
    if (error) throw error;
    if (result.session && result.user) return { user: await ensureProfile(result.user), emailConfirmationRequired: false };
    return { user: null, emailConfirmationRequired: true };
  },

  async requestPasswordReset(email) {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    if (error) throw error;
  },

  async updatePassword(password) {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },

  async updateProfile(updates = {}) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw authError || new Error('Please sign in again.');
    const permitted = {
      full_name: updates.fullName || updates.name,
      company_name: updates.companyName || updates.company
    };
    Object.keys(permitted).forEach((key) => permitted[key] === undefined && delete permitted[key]);
    const { data, error } = await supabase.from('user_profiles')
      .update(permitted).eq('id', user.id).select('id, full_name, company_name, role').single();
    if (error) throw error;
    return normalizeUser(user, data);
  },

  async logout() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
