import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../services/authService';

/**
 * RoleGuard ensures users are authenticated and possess the required role.
 * - Non-authenticated users are redirected to their corresponding login screen.
 * - Authenticated users attempting to cross role boundaries are sent to /access-denied.
 */
export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated, role } = useAuth();
  const location = useLocation();

  // 1. Not Authenticated
  if (!isAuthenticated || !user) {
    if (allowedRoles.includes(USER_ROLES.ADMIN)) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Check
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" state={{ from: location, requiredRoles: allowedRoles, currentRole: role }} replace />;
  }

  return children;
};
