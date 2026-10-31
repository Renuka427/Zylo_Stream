import { z } from 'zod';
import { sendError } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse(req.body);
    req.body = validated;
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return sendError(res, `Validation failed: ${messages}`, 400, err.errors);
    }
    return sendError(res, 'Invalid request payload', 400);
  }
};

// Validation Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company: z.string().optional()
  // NOTE: 'role' is intentionally omitted here to prevent escalation of privilege!
});

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  company: z.string().optional()
});

export const createSubscriptionSchema = z.object({
  plan_id: z.string().min(1, 'Plan ID is required')
});

export const createPlanSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be a non-negative number'),
  billing_cycle: z.enum(['monthly', 'quarterly', 'yearly', 'weekly']).default('monthly'),
  features: z.array(z.string()).optional()
});

export const recordPaymentSchema = z.object({
  invoice_id: z.string().min(1, 'Invoice ID is required'),
  amount: z.number().positive('Amount must be positive'),
  payment_method: z.string().default('Credit Card')
});
