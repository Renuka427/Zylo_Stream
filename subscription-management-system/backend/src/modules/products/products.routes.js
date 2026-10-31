import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for products
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Products module endpoint placeholder');
});

export default router;
