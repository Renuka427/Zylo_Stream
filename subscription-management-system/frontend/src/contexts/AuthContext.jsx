import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'usr_01',
    name: 'Elena Vance',
    email: 'elena.vance@subscript-saas.com',
    role: 'VP Finance (Owner)',
    organization: 'Subscript Technologies Inc.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = (email, password) => {
    // Simulated mock login
    setIsAuthenticated(true);
    setUser({
      id: 'usr_01',
      name: email ? email.split('@')[0].replace('.', ' ') : 'Demo Admin',
      email: email || 'admin@subscript-saas.com',
      role: 'VP Finance',
      organization: 'Subscript Technologies Inc.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const register = (data) => {
    setIsAuthenticated(true);
    setUser({
      id: `usr_${Date.now()}`,
      name: data.fullName || 'Demo User',
      email: data.email || 'demo@subscript-saas.com',
      role: 'Administrator',
      organization: data.companyName || 'New Venture Inc.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
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
