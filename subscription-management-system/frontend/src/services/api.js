/**
 * Centralized API client for Zylo Stream.
 * Uses the active Supabase access token for protected Express API calls.
 */
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = async (endpoint, options = {}) => {
  const { data: { session } = {} } = supabase
    ? await supabase.auth.getSession()
    : { data: { session: null } };
  const legacyToken = localStorage.getItem('zylo_auth_token_v2') || localStorage.getItem('sms_auth_token');
  const accessToken = session?.access_token || legacyToken;

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.error?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

// Health Check
export const checkHealth = () => apiClient('/health');

// Legacy authentication endpoints retained for older screens or admin provisioning.
export const authApi = {
  login: (email, password) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  adminLogin: (email, password) => apiClient('/auth/admin-login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  googleAuth: (role = 'customer') => apiClient('/auth/google', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => apiClient('/auth/me'),
  updateProfile: (updates) => apiClient('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }),
  logout: () => apiClient('/auth/logout', { method: 'POST' })
};

// Customer Endpoints (ownership enforced by server-side middleware)
export const customerApi = {
  getStats: () => apiClient('/customer/stats'),
  getSubscriptions: () => apiClient('/customer/subscriptions'),
  createSubscription: (planId) => apiClient('/customer/subscriptions', { method: 'POST', body: JSON.stringify({ plan_id: planId }) }),
  cancelSubscription: (id) => apiClient(`/customer/subscriptions/${id}`, { method: 'DELETE' }),
  getInvoices: () => apiClient('/customer/invoices'),
  getPayments: () => apiClient('/customer/payments'),
  recordPayment: (paymentData) => apiClient('/customer/payments', { method: 'POST', body: JSON.stringify(paymentData) })
};

// Administrator Endpoints (requireRole('admin') remains server-side)
export const adminApi = {
  getStats: () => apiClient('/admin/stats'),
  getCustomers: () => apiClient('/admin/customers'),
  getSubscriptions: () => apiClient('/admin/subscriptions'),
  createSubscription: (data) => apiClient('/admin/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
  updateSubscription: (id, data) => apiClient(`/admin/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getPlans: () => apiClient('/admin/plans'),
  createPlan: (data) => apiClient('/admin/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => apiClient(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getInvoices: () => apiClient('/admin/invoices'),
  getPayments: () => apiClient('/admin/payments'),
  getActivity: () => apiClient('/admin/activity')
};

// Public Plans Catalog
export const plansApi = { getPlans: () => apiClient('/plans') };
