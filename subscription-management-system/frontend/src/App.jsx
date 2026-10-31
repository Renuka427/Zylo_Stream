import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { MockDataProvider } from './contexts/MockDataContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MockDataProvider>
          <RouterProvider router={router} />
        </MockDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
