# webdiy-template-fullstack

The default WebDIY template. Vite + React + TypeScript + Tailwind 4 + Hono + Supabase, deployed to Cloudflare Workers via `@cloudflare/vite-plugin`. Frontend and backend bundle and deploy as one Worker.

## Stack

- **Frontend:** Vite 6, React 19, TypeScript, Tailwind 4, Radix Primitives, cva, motion
- **Backend:** Hono on Cloudflare Workers (same Worker as the frontend, via `@cloudflare/vite-plugin`)
- **Database + Auth + Storage:** Supabase
- **Routing:** React Router 7
- **Forms:** React Hook Form + Zod
- **Server state:** TanStack Query
- **5 base components** in [src/components/ui/](src/components/ui) — Button, Input, Card, Dialog, Dropdown

## Setup

1. **Create a Supabase project** at https://supabase.com.
2. **Copy `.dev.vars.example` to `.dev.vars`** and fill in your Supabase URL + keys (Project Settings → API).
3. **Install + run:**

   ```bash
   npm install
   npm run dev
   ```

The dev server runs the Vite frontend and the Hono Worker together via `@cloudflare/vite-plugin`. Hits to `/api/*` route through Hono; other paths serve from the SPA.

## Commands

```bash
npm run dev        # vite — integrated dev server (frontend + worker)
npm run build      # tsc -b && vite build → dist/client + dist/<worker>/
npm run preview    # vite preview
npm run lint       # eslint
npm run cf-typegen # wrangler types — regenerate Cloudflare binding types
npm run deploy     # build + wrangler deploy
```

## Deployment

```bash
npx wrangler login
npm run deploy
```

On first deploy, set production secrets:

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## Architecture

- [src/server/index.ts](src/server/index.ts) — Hono app entry. Routes `/api/*` and falls through to the `ASSETS` binding for static paths.
- [src/server/routes/](src/server/routes) — split routes per resource here, mount them via `app.route('/api/<name>', module)`.
- [src/components/ui/](src/components/ui) — base UI primitives styled per project. Customise variants via `cva` rather than overriding inline.
- [src/features/](src/features) — organise app code by feature (e.g. `src/features/todos/{TodoList.tsx, useTodos.ts, types.ts}`).
- [src/hooks/](src/hooks) — shared React hooks.
- [src/lib/cn.ts](src/lib/cn.ts) — `clsx + tailwind-merge` helper.
- [src/lib/supabase.ts](src/lib/supabase.ts) — `createBrowserClient()` for React, `createServerClient(env)` for Hono handlers.
- [src/index.css](src/index.css) — design tokens. Replace the placeholder OKLCH palette before building components.
- [migrations/](migrations) — Supabase SQL migrations. Apply via `supabase db push`.
- [vite.config.ts](vite.config.ts) — uses `@webdiy/starter-vite-preset` (registers `@cloudflare/vite-plugin` + sets the proxy-compat invariants).
- [wrangler.toml](wrangler.toml) — CF Workers deploy config.

## Design tokens

The placeholder palette in `src/index.css` is intentionally generic. Replace it with a register-aligned palette before writing components — every base component reads from semantic tokens (`bg-primary`, `text-foreground`, `border-border`).

Add new component variants by extending the `cva()` call in `src/components/ui/<name>.tsx`. Don't paper over with inline `className="bg-blue-600 ..."` at call sites.

## Cloudflare Workers compatibility

- **Use Hono.** Express / Fastify / NestJS appear to work in dev but will not deploy.
- **Use `@supabase/supabase-js` (HTTP) for Postgres.** `pg` / `mysql2` over native TCP do not work on Workers.
- **No filesystem writes.** Workers have no persistent local disk. Use Supabase Storage for blobs or R2.
- **No native modules** (`bcrypt`, `sharp`, `canvas`). Use pure-JS alternatives or Workers-compatible services.

## How do I set up Supabase?

1. Sign up at https://supabase.com and create a new project.
2. Open Project Settings → API. Copy the **URL**, **anon key**, and **service role key**.
3. Paste into `.dev.vars`:
   ```
   SUPABASE_URL=https://<ref>.supabase.co
   SUPABASE_ANON_KEY=<anon>
   SUPABASE_SERVICE_ROLE_KEY=<service-role>
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon>
   ```
4. (Optional) Apply the example migration: `supabase db push` (requires `supabase` CLI + `supabase link`).
