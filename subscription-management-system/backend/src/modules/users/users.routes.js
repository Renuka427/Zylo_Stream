import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse.js';

const router = Router();

// Placeholder route for users / profile
router.get('/', (req, res) => {
  return sendSuccess(res, [], 'Users module endpoint placeholder');
});

export default router;
