import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../services/authService';

export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-espresso-muted">Restoring your secure session…</div>;
  if (!isAuthenticated || !user) {
    return <Navigate to={allowedRoles.includes(USER_ROLES.ADMIN) ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" state={{ from: location, requiredRoles: allowedRoles, currentRole: role }} replace />;
  }
  return children;
};
