import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';
import { sendSuccess } from './utils/apiResponse.js';

// Module Route Imports
import usersRoutes from './modules/users/users.routes.js';
import customersRoutes from './modules/customers/customers.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import plansRoutes from './modules/plans/plans.routes.js';
import subscriptionsRoutes from './modules/subscriptions/subscriptions.routes.js';
import quotationsRoutes from './modules/quotations/quotations.routes.js';
import invoicesRoutes from './modules/invoices/invoices.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import discountsRoutes from './modules/discounts/discounts.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';

const app = express();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  }, 'Subscription Management System API is running smoothly');
});

// Domain Feature Module Routes
app.use('/api/users', usersRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/quotations', quotationsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/discounts', discountsRoutes);
app.use('/api/reports', reportsRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
