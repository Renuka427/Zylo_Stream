import { Router } from 'express';
import { db } from '../../config/database.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

const router = Router();

// Public plans listing for subscription catalog and pricing views
router.get('/', async (req, res) => {
  try {
    const plans = await db.query('SELECT * FROM subscription_plans WHERE status = ? ORDER BY price ASC', ['active']);
    return sendSuccess(res, plans, 'Active subscription plans retrieved.');
  } catch (err) {
    return sendError(res, 'Failed to fetch subscription plans.', 500);
  }
});

export default router;
