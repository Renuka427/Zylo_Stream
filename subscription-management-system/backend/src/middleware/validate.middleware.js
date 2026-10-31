import { sendError } from '../utils/apiResponse.js';

/**
 * Higher-order middleware function for request payload validation.
 * Compatible with schema validation libraries (e.g., Zod, Joi).
 */
export const validate = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema.safeParse !== 'function') {
      return next();
    }

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return sendError(res, 'Validation failed', 400, result.error.errors);
    }

    req.validated = result.data;
    return next();
  };
};
