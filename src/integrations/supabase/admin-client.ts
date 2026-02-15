import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!SUPABASE_URL) {
  throw new Error(
    'Missing Supabase URL. ' +
    'Please ensure VITE_SUPABASE_URL is set in your .env file.'
  );
}

// Use anon key as fallback for development
const serviceKey = SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Admin client with service role key for full access
export const supabaseAdmin = createClient<Database>(SUPABASE_URL, serviceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Regular client for user authentication
export const supabase = createClient<Database>(SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});