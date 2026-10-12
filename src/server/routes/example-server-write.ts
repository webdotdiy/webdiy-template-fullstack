import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { neon } from '@neondatabase/serverless';
import { z } from 'zod';
import { verifyAuthToken } from '../neon-auth/require-user';

/*
 * Pattern for a PRIVILEGED write: a server route the browser cannot bypass.
 * Not mounted — copy it into a real route module, mount it in
 * `src/server/index.ts` with `.route('/api/<name>', module)`, then delete this
 * file.
 *
 * Use this path when RLS cannot express the rule: writes across users,
 * counters other users must not edit, anything that needs a secret, webhooks.
 * Plain per-user rows stay on the Data API (`src/lib/neon-data.ts`), where
 * Row-Level Security is the guard.
 *
 * `DATABASE_URL` connects as the app's own database role, `app_rw`. It is not
 * a signed-in user, so a policy keyed on `auth.user_id()` never lets it
 * through, and with RLS on, a role no policy applies to is denied. Give every
 * table this route touches a policy for `app_rw`, and scope the user policies
 * to `authenticated` (the Data API's role for signed-in users):
 *
 *   create policy server_access on tasks to app_rw using (true) with check (true);
 *   create policy own_tasks on tasks to authenticated using (created_by = auth.user_id());
 *
 * With that policy RLS no longer restricts the route: this route IS the
 * permission check. Verify the caller, validate the body, and scope every
 * statement yourself.
 */

type Bindings = { DATABASE_URL?: string };

const body = z.object({ projectId: z.uuid(), title: z.string().trim().min(1).max(120) });

const exampleServerWrite = new Hono<{ Bindings: Bindings }>().post(
  '/',
  zValidator('json', body),
  async (c) => {
    const user = await verifyAuthToken(c.req.raw);

    if (!user) {
      return c.json({ error: 'Sign in first.' }, 401);
    }

    if (!c.env.DATABASE_URL) {
      return c.json({ error: 'The database is not provisioned for this project yet.' }, 503);
    }

    const { projectId, title } = c.req.valid('json');
    const sql = neon(c.env.DATABASE_URL);

    // The membership check and the write in one statement: no row is written unless the caller may write it.
    const rows = await sql`
    insert into tasks (project_id, title, created_by)
    select ${projectId}, ${title}, ${user.sub}
    where exists (select 1 from project_members where project_id = ${projectId} and user_id = ${user.sub})
    returning id, title`;

    return rows.length > 0
      ? c.json({ task: rows[0] }, 201)
      : c.json({ error: 'Not a member of this project.' }, 403);
  },
);

export default exampleServerWrite;
