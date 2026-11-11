/**
 * DreamX Supabase Service-Role Admin Client (SERVER-ONLY)
 * Strictly adheres to PRD §17.4 & V-17: Service-role key never reaches the client bundle.
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

if (typeof window !== 'undefined') {
  throw new Error('SECURITY VIOLATION: Service role client cannot be imported into client-side code!');
}

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in server environment variables.');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
