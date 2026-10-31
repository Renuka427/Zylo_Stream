import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Feature Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { SubscriptionsPage } from '../pages/subscriptions/SubscriptionsPage';
import { CustomersPage } from '../pages/customers/CustomersPage';
import { ProductsPage } from '../pages/products/ProductsPage';
import { PlansPage } from '../pages/plans/PlansPage';
import { QuotationsPage } from '../pages/quotations/QuotationsPage';
import { InvoicesPage } from '../pages/invoices/InvoicesPage';
import { PaymentsPage } from '../pages/payments/PaymentsPage';
import { DiscountsPage } from '../pages/discounts/DiscountsPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// 404
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // Main Dashboard Routes
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'subscriptions',
        element: <SubscriptionsPage />
      },
      {
        path: 'customers',
        element: <CustomersPage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'plans',
        element: <PlansPage />
      },
      {
        path: 'quotations',
        element: <QuotationsPage />
      },
      {
        path: 'invoices',
        element: <InvoicesPage />
      },
      {
        path: 'payments',
        element: <PaymentsPage />
      },
      {
        path: 'discounts',
        element: <DiscountsPage />
      },
      {
        path: 'reports',
        element: <ReportsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },

  // Authentication Routes
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />
      }
    ]
  },

  // Catch-all 404
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
