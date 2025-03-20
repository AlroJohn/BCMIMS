// In a file like lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';

// This must be a server-side only file, never imported in client components
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Make sure this env var is set in your .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export { supabaseAdmin };