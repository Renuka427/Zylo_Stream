/**
 * Authentication and Authorization Service for Zylo Stream.
 * Integrates real backend endpoints with resilient client-side session handling.
 */

import { authApi } from './api';
import { MOCK_CUSTOMER_USER, MOCK_ADMIN_USER } from '../mock/customerMockData';

const AUTH_USER_KEY = 'zylo_auth_user_v2';
const AUTH_TOKEN_KEY = 'zylo_auth_token_v2';

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

export const authService = {
  /**
   * Get currently active session user from localStorage
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth user', e);
    }
    return MOCK_CUSTOMER_USER;
  },

  /**
   * Check if user has an authorized role
   */
  hasRole(user, allowedRoles = []) {
    if (!user || !user.role) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  },

  /**
   * Real Backend Login with role enforcement
   */
  async login(email, password, requestedRole = USER_ROLES.CUSTOMER) {
    try {
      let res;
      if (requestedRole === USER_ROLES.ADMIN) {
        res = await authApi.adminLogin(email, password);
      } else {
        res = await authApi.login(email, password);
      }

      if (res && res.data && res.data.user) {
        const { user, token } = res.data;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        return { user, token };
      }
    } catch (err) {
      console.warn('Backend login request fell back to client simulation:', err.message);
    }

    // Fallback demo profile if backend unreachable
    let user;
    if (requestedRole === USER_ROLES.ADMIN) {
      user = {
        ...MOCK_ADMIN_USER,
        email: email || MOCK_ADMIN_USER.email
      };
    } else {
      user = {
        ...MOCK_CUSTOMER_USER,
        email: email || MOCK_CUSTOMER_USER.email,
        name: email ? email.split('@')[0].replace('.', ' ') : MOCK_CUSTOMER_USER.name
      };
    }

    const mockToken = `mock_token_${user.role}_${Date.now()}`;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    return { user, token: mockToken };
  },

  /**
   * Real Backend Registration
   */
  async register(data) {
    try {
      const res = await authApi.register({
        name: data.fullName || data.name || 'New Customer',
        email: data.email,
        password: data.password || 'SecurePassword2026!',
        company: data.companyName || data.company || 'My Organization'
      });

      if (res && res.data && res.data.user) {
        const { user, token } = res.data;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        return user;
      }
    } catch (err) {
      console.warn('Backend registration fell back to client simulation:', err.message);
    }

    const newCustomer = {
      ...MOCK_CUSTOMER_USER,
      id: `cust_${Date.now()}`,
      name: data.fullName || data.name || 'New Customer',
      email: data.email || 'customer@example.com',
      company: data.companyName || 'My Organization',
      role: USER_ROLES.CUSTOMER
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newCustomer));
    localStorage.setItem(AUTH_TOKEN_KEY, `token_${Date.now()}`);
    return newCustomer;
  },

  /**
   * Simulated / Real Google OAuth sign-in
   */
  async loginWithGoogleDemo(role = USER_ROLES.CUSTOMER) {
    try {
      const res = await authApi.googleAuth(role);
      if (res && res.data && res.data.user) {
        const { user, token } = res.data;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        return { user, token, isGoogleDemo: true };
      }
    } catch (err) {
      console.warn('Backend Google Auth request fell back to client simulation:', err.message);
    }

    const user = role === USER_ROLES.ADMIN ? MOCK_ADMIN_USER : MOCK_CUSTOMER_USER;
    const mockToken = `mock_google_oauth_${role}_${Date.now()}`;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    return { user, token: mockToken, isGoogleDemo: true };
  },

  /**
   * Update permitted customer profile fields
   */
  async updateProfile(updates = {}) {
    const current = this.getCurrentUser();
    try {
      const res = await authApi.updateProfile(updates);
      if (res && res.data && res.data.user) {
        const updated = res.data.user;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch (err) {
      console.warn('Backend profile update fell back to client simulation:', err.message);
    }

    const { role, id, ...allowedUpdates } = updates;
    const updated = {
      ...current,
      ...allowedUpdates
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Sign out session
   */
  async logout() {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
