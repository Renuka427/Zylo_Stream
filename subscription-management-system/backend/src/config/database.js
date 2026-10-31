import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

/**
 * Direct PostgreSQL database connection configuration.
 * For complex queries, migrations, or direct connection pooling with pg / postgres.js.
 */
export const dbConfig = {
  connectionString: process.env.DATABASE_URL || '',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

logger.debug('Database configuration loaded.');
