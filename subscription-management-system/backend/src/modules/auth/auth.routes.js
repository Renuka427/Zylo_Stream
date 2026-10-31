import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  googleAuth,
  getCurrentUser,
  updateProfile,
  logout
} from './auth.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema
} from '../../middleware/validate.middleware.js';

const router = Router();

// Public auth routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/admin-login', validate(loginSchema), adminLogin);
router.post('/google', googleAuth);
router.post('/logout', logout);

// Authenticated session routes
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
