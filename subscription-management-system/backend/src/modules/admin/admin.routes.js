import { Router } from 'express';
import {
  getAdminOverviewStats,
  getAdminCustomers,
  getAdminSubscriptions,
  createAdminSubscription,
  updateAdminSubscription,
  getAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  getAdminInvoices,
  getAdminPayments,
  getAdminActivity
} from './admin.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.middleware.js';
import { validate, createPlanSchema } from '../../middleware/validate.middleware.js';

const router = Router();

// Strict RBAC: All administrative endpoints require valid authentication AND 'admin' role!
router.use(authenticate, requireRole('admin'));

router.get('/stats', getAdminOverviewStats);
router.get('/customers', getAdminCustomers);
router.get('/subscriptions', getAdminSubscriptions);
router.post('/subscriptions', createAdminSubscription);
router.put('/subscriptions/:id', updateAdminSubscription);
router.get('/plans', getAdminPlans);
router.post('/plans', validate(createPlanSchema), createAdminPlan);
router.put('/plans/:id', updateAdminPlan);
router.get('/invoices', getAdminInvoices);
router.get('/payments', getAdminPayments);
router.get('/activity', getAdminActivity);

export default router;
