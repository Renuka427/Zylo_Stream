import { Router } from 'express';
import {
  getCustomerStats,
  getCustomerSubscriptions,
  createCustomerSubscription,
  cancelCustomerSubscription,
  getCustomerInvoices,
  getCustomerPayments,
  recordCustomerPayment
} from './customer.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
  validate,
  createSubscriptionSchema,
  recordPaymentSchema
} from '../../middleware/validate.middleware.js';

const router = Router();

// All customer routes require authentication and enforce user ownership
router.use(authenticate);

router.get('/stats', getCustomerStats);
router.get('/subscriptions', getCustomerSubscriptions);
router.post('/subscriptions', validate(createSubscriptionSchema), createCustomerSubscription);
router.delete('/subscriptions/:id', cancelCustomerSubscription);
router.get('/invoices', getCustomerInvoices);
router.get('/payments', getCustomerPayments);
router.post('/payments', validate(recordPaymentSchema), recordCustomerPayment);

export default router;
