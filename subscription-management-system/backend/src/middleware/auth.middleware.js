import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import { db } from '../config/database.js';
import { sendError } from '../utils/apiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'zylo_stream_dev_secret_key_2026!';
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabaseAuth = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

/** Legacy token generator retained for local/legacy login routes. */
export function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

/**
 * Accept either a legacy Zylo JWT or a verified Supabase access token.
 * Supabase tokens are checked remotely with Auth getUser(token), never by
 * decoding an unverified JWT payload.
 */
export async function authenticate(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7).trim()
      : null;
    const token = bearer || req.cookies?.zylo_jwt_token;
    if (!token) return sendError(res, 'Authentication required. Please sign in.', 401);

    let identity = null;
    let supabaseIdentity = false;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      identity = { id: String(decoded.id), email: decoded.email, role: decoded.role };
    } catch (legacyError) {
      if (!supabaseAuth) {
        return sendError(res, 'Supabase token validation is not configured on the API.', 503);
      }
      const { data, error } = await supabaseAuth.auth.getUser(token);
      if (error || !data?.user) {
        return sendError(res, 'Invalid or expired authentication token.', 401);
      }
      identity = { id: data.user.id, email: data.user.email, role: null };
      supabaseIdentity = true;
    }

    if (supabaseIdentity) {
      const profiles = await db.query(
        'SELECT id, full_name, company_name, role FROM user_profiles WHERE id = ?',
        [identity.id]
      );
      if (!profiles || profiles.length === 0) {
        return sendError(res, 'Account profile not found. Please contact support.', 403);
      }
      const profile = profiles[0];
      req.user = {
        id: identity.id,
        name: profile.full_name || identity.email?.split('@')[0] || 'Customer',
        email: identity.email,
        role: profile.role,
        company: profile.company_name || null
      };
    } else {
      const users = await db.query(
        'SELECT id, name, email, role, company FROM users WHERE id = ?',
        [identity.id]
      );
      if (!users || users.length === 0) {
        return sendError(res, 'User session expired or account not found.', 401);
      }
      req.user = users[0];
    }

    return next();
  } catch (err) {
    console.error('[Auth] Authentication middleware failed:', err.message);
    return sendError(res, 'Unable to verify authentication.', 500);
  }
}

/** Server-side role checks; only the persisted profile role is trusted. */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return sendError(res, 'Authentication required.', 401);
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
        403
      );
    }
    return next();
  };
}
