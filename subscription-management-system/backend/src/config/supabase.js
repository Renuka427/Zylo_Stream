import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabase = null;
export let supabaseAdmin = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  if (supabaseServiceRoleKey && !supabaseServiceRoleKey.includes('your-supabase')) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
  logger.info('Supabase client initialized successfully.');
} else {
  logger.warn('Supabase credentials not configured in environment. Supabase client initialized in mock/fallback mode.');
}
