import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

/*
 * Bearer-token verification for the app's own /api/* routes.
 *
 * The browser obtains a short-lived JWT from `/api/auth/token` (proxied to
 * Neon Auth) and sends it as `Authorization: Bearer <jwt>`. This verifies it
 * against the project's JWKS. Database-side enforcement is separate: Data
 * API queries carry the same JWT and Postgres RLS validates it there — use
 * this helper only to protect worker routes.
 */

export type AuthenticatedUser = JWTPayload & { sub: string };

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

/** The verified JWT payload (`sub` = user id), or null when missing/invalid/unconfigured. */
export async function verifyAuthToken(request: Request): Promise<AuthenticatedUser | null> {
  const jwksUrl = import.meta.env.VITE_NEON_JWKS_URL;

  if (!jwksUrl) {
    return null;
  }

  const header = request.headers.get('authorization') ?? '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  try {
    jwks ??= createRemoteJWKSet(new URL(jwksUrl));

    const { payload } = await jwtVerify(header.slice('Bearer '.length), jwks);

    return typeof payload.sub === 'string' && payload.sub.length > 0 ? (payload as AuthenticatedUser) : null;
  } catch {
    return null;
  }
}
