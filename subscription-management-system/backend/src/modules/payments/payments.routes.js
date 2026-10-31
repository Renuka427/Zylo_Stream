import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for payments
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Payments module endpoint placeholder');
});

export default router;
