import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for customers
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Customers module endpoint placeholder');
});

export default router;
