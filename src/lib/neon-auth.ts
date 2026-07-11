import { createAuthClient } from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

/*
 * Browser auth client, pointed at this app's own `/api/auth/*` proxy —
 * never directly at the Neon Auth upstream. First-party cookies on the
 * app's origin are what make sessions work in every browser (Safari/ITP
 * blocks the third-party-cookie client-direct mode).
 *
 * Usage:
 *   await authClient.signUp.email({ email, password, name });
 *   await authClient.signIn.email({ email, password });
 *   const { data: session } = authClient.useSession();  // React hook
 *   await authClient.signOut();
 */

/** Whether this project has Neon Auth provisioned (false until the database integration is enabled). */
export const neonAuthEnabled = Boolean(import.meta.env.VITE_NEON_AUTH_URL);

export const authClient = createAuthClient('/api/auth', { adapter: BetterAuthReactAdapter() });

/**
 * A short-lived JWT for the signed-in user — attach as
 * `Authorization: Bearer <token>` on Data API queries and this app's own
 * protected /api/* routes. Null when signed out.
 */
export async function getAuthToken(): Promise<string | null> {
  const res = await fetch('/api/auth/token', { credentials: 'include' });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json().catch(() => null)) as { token?: string } | null;

  return data?.token ?? null;
}
