import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for discounts
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Discounts module endpoint placeholder');
});

export default router;
