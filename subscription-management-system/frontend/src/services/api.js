/**
 * Centralized API client service for Zylo Stream.
 * Connects frontend React components to Express / MySQL backend endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = async (endpoint, options = {}) => {
  const token =
    localStorage.getItem('zylo_auth_token_v2') ||
    localStorage.getItem('sms_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // include cookies for secure sessions
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
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

// Authentication Endpoints
export const authApi = {
  login: (email, password) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  adminLogin: (email, password) =>
    apiClient('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (userData) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  googleAuth: (role = 'customer') =>
    apiClient('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ role })
    }),

  getMe: () => apiClient('/auth/me'),

  updateProfile: (updates) =>
    apiClient('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  logout: () =>
    apiClient('/auth/logout', {
      method: 'POST'
    })
};

// Customer Endpoints (Guarded with user-level ownership)
export const customerApi = {
  getStats: () => apiClient('/customer/stats'),
  getSubscriptions: () => apiClient('/customer/subscriptions'),
  createSubscription: (planId) =>
    apiClient('/customer/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId })
    }),
  cancelSubscription: (id) =>
    apiClient(`/customer/subscriptions/${id}`, {
      method: 'DELETE'
    }),
  getInvoices: () => apiClient('/customer/invoices'),
  getPayments: () => apiClient('/customer/payments'),
  recordPayment: (paymentData) =>
    apiClient('/customer/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })
};

// Administrator Endpoints (Guarded with requireRole('admin'))
export const adminApi = {
  getStats: () => apiClient('/admin/stats'),
  getCustomers: () => apiClient('/admin/customers'),
  getSubscriptions: () => apiClient('/admin/subscriptions'),
  createSubscription: (data) =>
    apiClient('/admin/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateSubscription: (id, data) =>
    apiClient(`/admin/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getPlans: () => apiClient('/admin/plans'),
  createPlan: (data) =>
    apiClient('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updatePlan: (id, data) =>
    apiClient(`/admin/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getInvoices: () => apiClient('/admin/invoices'),
  getPayments: () => apiClient('/admin/payments'),
  getActivity: () => apiClient('/admin/activity')
};

// Public Plans Catalog
export const plansApi = {
  getPlans: () => apiClient('/plans')
};
