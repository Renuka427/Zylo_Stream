import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for plans
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Plans module endpoint placeholder');
});

export default router;
