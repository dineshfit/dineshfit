import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// Standard singleton pattern to absolutely prevent multiple instances in Next.js dev mode
let supabase;

if (typeof window !== 'undefined') {
  if (!globalThis.supabaseInstance) {
    globalThis.supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  supabase = globalThis.supabaseInstance;
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase };