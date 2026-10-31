import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, USER_ROLES } from '../services/authService';
import { MOCK_CUSTOMER_USER, MOCK_ADMIN_USER } from '../mock/customerMockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('zylo_auth_token_v2') || true);

  // Sync to authService
  const login = async (email, password, requestedRole = USER_ROLES.CUSTOMER) => {
    const { user: loggedInUser } = await authService.login(email, password, requestedRole);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return loggedInUser;
  };

  const loginWithGoogle = async (role = USER_ROLES.CUSTOMER) => {
    const { user: loggedInUser } = await authService.loginWithGoogleDemo(role);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return loggedInUser;
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Switch role for quick testing in hackathon demo
  const switchRole = (newRole) => {
    if (newRole === USER_ROLES.ADMIN) {
      const admin = { ...MOCK_ADMIN_USER };
      setUser(admin);
      localStorage.setItem('zylo_auth_user_v2', JSON.stringify(admin));
      return admin;
    } else {
      const customer = { ...MOCK_CUSTOMER_USER };
      setUser(customer);
      localStorage.setItem('zylo_auth_user_v2', JSON.stringify(customer));
      return customer;
    }
  };

  const updateCustomerProfile = async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const register = async (data) => {
    const newCustomer = await authService.register(data);
    setUser(newCustomer);
    setIsAuthenticated(true);
    return newCustomer;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || USER_ROLES.CUSTOMER,
        isAuthenticated,
        login,
        loginWithGoogle,
        logout,
        switchRole,
        updateCustomerProfile,
        register,
        isAdmin: user?.role === USER_ROLES.ADMIN,
        isCustomer: user?.role === USER_ROLES.CUSTOMER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
