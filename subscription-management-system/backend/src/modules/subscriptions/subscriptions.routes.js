import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for subscriptions
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Subscriptions module endpoint placeholder');
});

export default router;
