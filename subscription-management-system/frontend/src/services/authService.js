/**
 * Authentication and Authorization Service for Zylo Stream.
 * Handles client-side demonstration auth, role checks, and prepares
 * a clean abstraction for future production Supabase Auth / Google OAuth.
 */

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
    // Default to Customer Demo Profile
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
   * Standard login method with role assignment
   */
  login(email, password, requestedRole = USER_ROLES.CUSTOMER) {
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
   * Simulated Google OAuth sign-in
   * Explicitly labeled as demo simulation
   */
  loginWithGoogleDemo(role = USER_ROLES.CUSTOMER) {
    const user = role === USER_ROLES.ADMIN ? MOCK_ADMIN_USER : MOCK_CUSTOMER_USER;
    const mockToken = `mock_google_oauth_${role}_${Date.now()}`;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    return { user, token: mockToken, isGoogleDemo: true };
  },

  /**
   * Update permitted customer profile fields (role cannot be changed by user)
   */
  updateProfile(updates = {}) {
    const current = this.getCurrentUser();
    // Enforce role immutability
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
  logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
