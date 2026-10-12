import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleNeonAuth, type NeonAuthBindings } from './neon-auth';

/*
 * Binding types stay structural (no Workers-only globals such as `Fetcher`):
 * the browser program type-checks this file through `import type { AppType }`
 * in `src/lib/api.ts`.
 */
type Bindings = NeonAuthBindings & {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

/*
 * Routes are chained off `new Hono()` so `AppType` carries every route's input
 * and output types to the typed client in `src/lib/api.ts`. A route registered
 * in a separate `app.get(...)` statement is invisible to the client types.
 *
 * Add routes as modules under `src/server/routes/` and chain them here:
 *   .route('/api/todos', todos)
 *
 * Neon Auth first-party proxy — sessions live as host-only cookies on THIS
 * origin. Answers 501 until the project's database/auth is provisioned.
 * Protect your own routes with `verifyAuthToken` from `./neon-auth/require-user`.
 */
const app = new Hono<{ Bindings: Bindings }>()
  .use('*', cors())
  .get('/api/health', (c) => c.json({ ok: true }))
  .all('/api/auth/*', (c) => handleNeonAuth(c.req.raw, c.env));

// Every non-API path falls through to the static assets (and the SPA's index.html).
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw));

export type AppType = typeof app;
export default app;
