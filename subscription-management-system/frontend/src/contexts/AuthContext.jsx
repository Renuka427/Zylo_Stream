import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, USER_ROLES } from '../services/authService';
import { MOCK_CUSTOMER_USER, MOCK_ADMIN_USER } from '../mock/customerMockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('zylo_auth_token_v2') || true);

  // Sync to authService
  const login = (email, password, requestedRole = USER_ROLES.CUSTOMER) => {
    const { user: loggedInUser } = authService.login(email, password, requestedRole);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return loggedInUser;
  };

  const loginWithGoogle = (role = USER_ROLES.CUSTOMER) => {
    const { user: loggedInUser } = authService.loginWithGoogleDemo(role);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return loggedInUser;
  };

  const logout = () => {
    authService.logout();
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

  const updateCustomerProfile = (updates) => {
    const updated = authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const register = (data) => {
    // New registrants receive the customer role by default
    const newCustomer = {
      ...MOCK_CUSTOMER_USER,
      id: `cust_${Date.now()}`,
      name: data.fullName || data.name || 'New Customer',
      email: data.email || 'customer@example.com',
      company: data.companyName || 'My Organization',
      role: USER_ROLES.CUSTOMER
    };
    setUser(newCustomer);
    setIsAuthenticated(true);
    localStorage.setItem('zylo_auth_user_v2', JSON.stringify(newCustomer));
    localStorage.setItem('zylo_auth_token_v2', `token_${Date.now()}`);
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
