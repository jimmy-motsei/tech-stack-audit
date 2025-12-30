import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public access (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend operations (full permissions)
// Only use this in server-side API routes!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
