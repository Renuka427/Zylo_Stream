import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to create or promote an Administrator account safely via CLI.
 * Usage:
 *   node src/scripts/createAdmin.js <email> <password> <name>
 * Example:
 *   node src/scripts/createAdmin.js executive@zylostream.io SuperSecurePass2026! "Executive Officer"
 */
async function createAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@zylostream.io';
  const password = args[1] || 'Admin@Zylo2026!';
  const name = args[2] || 'Julian Sterling';

  console.log(`[Admin Setup] Promoting/Creating Administrator: ${email}`);

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'zylo_stream';

  try {
    const conn = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName
    });

    const [rows] = await conn.query('SELECT id, email, role FROM users WHERE email = ?', [email]);
    const passwordHash = await bcrypt.hash(password, 10);

    if (rows.length > 0) {
      await conn.query('UPDATE users SET role = ?, password_hash = ? WHERE email = ?', ['admin', passwordHash, email]);
      console.log(`[Admin Setup] Successfully promoted existing user ${email} to 'admin' role.`);
    } else {
      const id = `usr_admin_${Date.now()}`;
      await conn.query(
        'INSERT INTO users (id, name, email, password_hash, role, company) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, email, passwordHash, 'admin', 'Zylo Stream Executive']
      );
      console.log(`[Admin Setup] Successfully created new administrator ${email} (ID: ${id}).`);
    }

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error(`[Admin Setup] Failed to update administrator in MySQL:`, err.message);
    process.exit(1);
  }
}

createAdmin();
