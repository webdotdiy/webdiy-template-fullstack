import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleNeonAuth, type NeonAuthBindings } from './neon-auth';

type Bindings = NeonAuthBindings & {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/api/health', (c) => c.json({ ok: true }));

/*
 * Neon Auth first-party proxy — sessions live as host-only cookies on THIS
 * origin. Answers 501 until the project's database/auth is provisioned.
 * Protect your own routes with `verifyAuthToken` from
 * `./neon-auth/require-user`.
 */
app.all('/api/auth/*', (c) => handleNeonAuth(c.req.raw, c.env));

/*
 * Add new routes under /api/* in src/server/routes/ and import them
 * here, e.g.:
 *
 *   import todos from './routes/todos';
 *   app.route('/api/todos', todos);
 */

// Static assets fall through to the Workers Static Assets binding.
app.all('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
