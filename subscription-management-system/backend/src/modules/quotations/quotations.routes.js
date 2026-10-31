import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for quotations
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Quotations module endpoint placeholder');
});

export default router;
