import { createClient } from '@supabase/supabase-js';

// Fallbacks prevent build-time crash when env vars aren't available during
// Next.js module initialization. Real values must be set in Vercel env vars.
export const supabase = createClient(
  process.env.SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.SUPABASE_ANON_KEY ?? 'placeholder',
);
