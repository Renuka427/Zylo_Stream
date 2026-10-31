/**
 * Centralized API client service for frontend HTTP requests.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('sms_auth_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
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

export const checkHealth = () => apiClient('/health');
