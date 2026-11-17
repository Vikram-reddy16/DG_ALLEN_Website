// Anonymous Supabase client for the public careers site.
// No cookies / session: safe to use inside "use cache" functions. RLS limits the
// anon role to published jobs and active categories, so there is nothing private here.
import { createClient } from "@supabase/supabase-js";

export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
