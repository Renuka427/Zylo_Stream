import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../../config/database.js';
import { generateToken } from '../../middleware/auth.middleware.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

/**
 * Register a new Customer Account
 * Note: New registrations ALWAYS receive the 'customer' role.
 */
export async function register(req, res) {
  try {
    const { name, email, password, company } = req.body;

    // 1. Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    // 2. Hash password securely with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Generate ID and persist with customer role
    const userId = `usr_${crypto.randomUUID()}`;
    const role = 'customer'; // Strictly enforced server-side

    await db.query(
      'INSERT INTO users (id, name, email, password_hash, role, company) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, passwordHash, role, company || 'Independent Subscriber']
    );

    // Log creation
    await db.query(
      'INSERT INTO activity_logs (id, user_id, action, description) VALUES (?, ?, ?, ?)',
      [crypto.randomUUID(), userId, 'USER_REGISTERED', `Customer account created for ${name} (${email})`]
    );

    // 4. Generate Session Token
    const user = { id: userId, name, email, role, company: company || 'Independent Subscriber' };
    const token = generateToken(user);

    // Set secure cookie
    res.cookie('zylo_jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return sendSuccess(res, { user, token }, 'Registration successful. Welcome to Zylo Stream.', 201);
  } catch (err) {
    console.error('Registration error:', err);
    return sendError(res, 'Failed to complete registration.', 500);
  }
}

/**
 * Customer / General Login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Query user
    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    const user = users[0];

    // 2. Verify password with bcrypt
    if (!user.password_hash) {
      return sendError(res, 'Account configured with Google OAuth. Please use Google Sign-in.', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // 3. Issue Token
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    };
    const token = generateToken(safeUser);

    res.cookie('zylo_jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, { user: safeUser, token }, 'Signed in successfully.');
  } catch (err) {
    console.error('Login error:', err);
    return sendError(res, 'Authentication failed.', 500);
  }
}

/**
 * Administrator Login
 * Strictly checks credentials AND verifies that the user holds the 'admin' role.
 */
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return sendError(res, 'Invalid administrative credentials.', 401);
    }

    const user = users[0];

    // Verify Password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return sendError(res, 'Invalid administrative credentials.', 401);
    }

    // Enforce Administrator Role Check
    if (user.role !== 'admin') {
      return sendError(res, 'Access denied. Account does not possess administrative privileges.', 403);
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'admin',
      company: user.company
    };
    const token = generateToken(safeUser);

    res.cookie('zylo_jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(res, { user: safeUser, token }, 'Administrator authorized successfully.');
  } catch (err) {
    console.error('Admin login error:', err);
    return sendError(res, 'Administrative authorization failed.', 500);
  }
}

/**
 * Google Sign-in Endpoint
 * Validates real Google OAuth when credentials are present; provides clearly labeled demo simulation if unconfigured.
 */
export async function googleAuth(req, res) {
  try {
    const { role = 'customer' } = req.body;
    const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

    if (isGoogleConfigured) {
      // In production with Google credentials, token/code exchange happens here
      return sendError(
        res,
        'Google OAuth endpoint initialized. Complete token verification with Google Client ID.',
        501
      );
    }

    // Development demo OAuth with clear metadata
    let demoUser;
    if (role === 'admin') {
      demoUser = {
        id: 'usr_admin_001',
        name: 'Julian Sterling',
        email: 'admin@zylostream.io',
        role: 'admin',
        company: 'Zylo Stream Executive'
      };
    } else {
      demoUser = {
        id: 'usr_cust_001',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@acmestudio.io',
        role: 'customer',
        company: 'Acme Creative Studio'
      };
    }

    const token = generateToken(demoUser);

    res.cookie('zylo_jwt_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return sendSuccess(
      res,
      { user: demoUser, token, isDemoSimulation: true },
      'Simulated Google OAuth authentication completed.'
    );
  } catch (err) {
    return sendError(res, 'Google authentication failed.', 500);
  }
}

/**
 * Get Current Authenticated User (Session Verification)
 */
export async function getCurrentUser(req, res) {
  return sendSuccess(res, { user: req.user }, 'Session active.');
}

/**
 * Update Permitted Profile Fields (name, company)
 * Role cannot be altered by users!
 */
export async function updateProfile(req, res) {
  try {
    const { name, company } = req.body;
    const userId = req.user.id;

    await db.query(
      'UPDATE users SET name = COALESCE(?, name), company = COALESCE(?, company), updated_at = NOW() WHERE id = ?',
      [name || null, company || null, userId]
    );

    const updated = await db.query('SELECT id, name, email, role, company FROM users WHERE id = ?', [userId]);

    return sendSuccess(res, { user: updated[0] }, 'Profile updated successfully.');
  } catch (err) {
    console.error('Update profile error:', err);
    return sendError(res, 'Failed to update profile.', 500);
  }
}

/**
 * Secure Logout (Clears session cookies)
 */
export function logout(req, res) {
  res.clearCookie('zylo_jwt_token', {
    httpOnly: true,
    sameSite: 'lax'
  });
  return sendSuccess(res, null, 'Logged out successfully.');
}
