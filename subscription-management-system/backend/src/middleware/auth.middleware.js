import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { sendError } from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zylo_stream_dev_secret_key_2026!';

/**
 * Generates a signed JWT token for a verified user
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/**
 * Authentication middleware: verifies Bearer token or HTTP-only cookie
 */
export async function authenticate(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.zylo_jwt_token) {
      // 2. Check Cookie
      token = req.cookies.zylo_jwt_token;
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please sign in.', 401);
    }

    // 3. Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Fetch User Record from Database
    const users = await db.query('SELECT id, name, email, role, company FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0) {
      return sendError(res, 'User session expired or account not found.', 401);
    }

    req.user = users[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired. Please sign in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
}

/**
 * Role-Based Access Control (RBAC) middleware:
 * Enforces server-side authorization for admin or customer roles.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
        403
      );
    }

    next();
  };
}
