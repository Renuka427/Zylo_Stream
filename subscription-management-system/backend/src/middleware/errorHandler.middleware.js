import { logger } from '../utils/logger.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Global error handling middleware.
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled error during request: ${req.method} ${req.originalUrl}`, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  return sendError(res, message, statusCode, details);
};

/**
 * 404 Not Found route handler.
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};
