import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RoleGuard } from '../components/auth/RoleGuard';

// Public Landing Page
import { LandingPage } from '../pages/landing/LandingPage';

// Public / Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { AccessDeniedPage } from '../pages/auth/AccessDeniedPage';

// Customer Portal Pages
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { CustomerSubscriptionsPage } from '../pages/customer/CustomerSubscriptionsPage';
import { CustomerPlansPage } from '../pages/customer/CustomerPlansPage';
import { CustomerInvoicesPage } from '../pages/customer/CustomerInvoicesPage';
import { CustomerPaymentsPage } from '../pages/customer/CustomerPaymentsPage';
import { CustomerNotificationsPage } from '../pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';
import { CustomerSupportPage } from '../pages/customer/CustomerSupportPage';

// Administrator Executive Pages (Preserved)
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

// 404
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  // ==========================================
  // 1. PUBLIC ROUTES
  // ==========================================
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/access-denied',
    element: <AccessDeniedPage />
  },

  // ==========================================
  // 2. AUTHENTICATION SCREENS
  // ==========================================
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'admin/login',
        element: <AdminLoginPage />
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
      },
      // Backwards-compatible /auth aliases
      {
        path: 'auth/login',
        element: <LoginPage />
      },
      {
        path: 'auth/register',
        element: <RegisterPage />
      },
      {
        path: 'auth/forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: 'auth/reset-password',
        element: <ResetPasswordPage />
      }
    ]
  },

  // ==========================================
  // 3. CUSTOMER PORTAL ROUTES (/customer/*)
  // Protected with RoleGuard allowedRoles: ['customer']
  // ==========================================
  {
    path: '/customer',
    element: (
      <RoleGuard allowedRoles={['customer']}>
        <CustomerLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/customer/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <CustomerDashboardPage />
      },
      {
        path: 'subscriptions',
        element: <CustomerSubscriptionsPage />
      },
      {
        path: 'plans',
        element: <CustomerPlansPage />
      },
      {
        path: 'invoices',
        element: <CustomerInvoicesPage />
      },
      {
        path: 'payments',
        element: <CustomerPaymentsPage />
      },
      {
        path: 'notifications',
        element: <CustomerNotificationsPage />
      },
      {
        path: 'profile',
        element: <CustomerProfilePage />
      },
      {
        path: 'support',
        element: <CustomerSupportPage />
      }
    ]
  },

  // ==========================================
  // 4. ADMINISTRATOR PORTAL ROUTES (/admin/*)
  // Protected with RoleGuard allowedRoles: ['admin']
  // ==========================================
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout />
      </RoleGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
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

  // ==========================================
  // 5. DIRECT ADMIN FEATURE ALIASES (/dashboard, /subscriptions, etc.)
  // Preserves existing links and prevents broken routes
  // ==========================================
  {
    element: (
      <RoleGuard allowedRoles={['admin']}>
        <DashboardLayout />
      </RoleGuard>
    ),
    children: [
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

  // ==========================================
  // 6. CATCH-ALL 404
  // ==========================================
  {
    path: '*',
    element: <NotFoundPage />
  }
]);
