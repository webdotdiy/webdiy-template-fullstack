import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser-side client. Reads from import.meta.env (Vite-injected at
 * build). Anon key only — never service role on the client.
 *
 * Pair with a single shared instance: `export const supabase = createBrowserClient();`
 * in a top-level module if you want one client across the app.
 */
export function createBrowserClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy `.dev.vars.example` to `.dev.vars` and fill in your Supabase project values.',
    );
  }

  return createClient(url, anonKey);
}

/**
 * Server-side client (Hono context). Service-role for server-only ops
 * that need to bypass RLS (e.g. admin tasks, cron). For per-user
 * queries, prefer creating a request-scoped client with the user's
 * Authorization header so RLS policies apply normally.
 */
export function createServerClient(env: {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
