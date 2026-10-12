import { hc } from 'hono/client';
import type { AppType } from '../server';

/*
 * Typed client for this app's own `/api/*` routes: request bodies, params and
 * JSON responses are checked against the Hono routes in `src/server/`.
 *
 *   const res = await api.api.health.$get();
 *   const data = await res.json();
 *
 * Keep the import type-only: the browser must never load server code.
 */
export const api = hc<AppType>('/');
