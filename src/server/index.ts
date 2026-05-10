import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  ASSETS: Fetcher;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.get('/api/health', (c) => c.json({ ok: true }));

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
