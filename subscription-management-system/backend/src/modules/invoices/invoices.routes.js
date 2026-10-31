import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for invoices
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Invoices module endpoint placeholder');
});

export default router;
