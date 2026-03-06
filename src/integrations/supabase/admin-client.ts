/**
 * SECURITY WARNING: Do NOT import the service role key in this file.
 * This file runs in the browser where it's accessible to users.
 * 
 * Service role key exposure is a CRITICAL SECURITY VULNERABILITY.
 * It allows unlimited database access and bypasses all Row Level Security policies.
 * 
 * For admin operations, use Supabase Edge Functions instead.
 * Edge Functions run server-side with secure authentication.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

// ✅ Public client for browser use with anonymous key
// This respects Row Level Security policies and is safe to expose
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});