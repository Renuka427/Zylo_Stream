import { supabase } from '../config/supabase.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Authentication middleware validating the Supabase JWT access token.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Missing or malformed Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // In local dev without credentials, bypass or warn if mock token
    if (!supabase) {
      req.user = { id: 'mock-user-id', email: 'dev@example.com', role: 'admin' };
      return next();
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return sendError(res, 'Invalid or expired authentication token', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};
