import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for reports
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Reports module endpoint placeholder');
});

export default router;
