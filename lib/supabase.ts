import { createClient } from '@supabase/supabase-js';

/**
 * Creates a server-side Supabase client with anon key
 * This client should ONLY be used in server components, API routes, or server actions
 * NEVER expose this client to the browser
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
