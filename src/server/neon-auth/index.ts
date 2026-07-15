import { handleAuthProxyRequest } from './vendor/proxy';

/*
 * First-party Neon Auth proxy mount (`/api/auth/*`).
 *
 * The browser talks to THIS origin; the worker forwards to the Neon Auth
 * upstream and re-mints the session cookies as first-party, host-only
 * cookies. `domain` is deliberately never set on the proxy config — a
 * host-only cookie keeps each deployed app's session isolated to its own
 * hostname.
 *
 * Configuration comes from the platform-managed variables:
 *   - VITE_NEON_AUTH_URL      (public, .env)  — the upstream base URL
 *   - NEON_AUTH_COOKIE_SECRET (secret binding) — signs the session cache cookie
 *
 * When either is absent the mount answers 501 so the app still builds and
 * runs before a database/auth has been provisioned for the project.
 */

const AUTH_MOUNT_PREFIX = '/api/auth/';

export interface NeonAuthBindings {
  NEON_AUTH_COOKIE_SECRET?: string;
}

export function neonAuthConfigured(env: NeonAuthBindings): boolean {
  return Boolean(import.meta.env.VITE_NEON_AUTH_URL && env.NEON_AUTH_COOKIE_SECRET);
}

export async function handleNeonAuth(request: Request, env: NeonAuthBindings): Promise<Response> {
  const baseUrl = import.meta.env.VITE_NEON_AUTH_URL;
  const cookieSecret = env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl || !cookieSecret) {
    return Response.json(
      { error: 'Neon Auth is not provisioned for this project yet.' },
      { status: 501 },
    );
  }

  const { pathname } = new URL(request.url);
  const path = pathname.startsWith(AUTH_MOUNT_PREFIX) ? pathname.slice(AUTH_MOUNT_PREFIX.length) : '';

  if (!path) {
    return Response.json({ error: 'Missing auth path.' }, { status: 404 });
  }

  return handleAuthProxyRequest({ request, path, baseUrl, cookieSecret });
}
