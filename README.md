# webdiy-template-fullstack

The default WebDIY template. Vite + React + TypeScript + Tailwind 4 + Hono, deployed to Cloudflare Workers via `@cloudflare/vite-plugin`. Frontend and backend bundle and deploy as one Worker.

## Stack

- **Frontend:** Vite 7, React 19, TypeScript, Tailwind 4, Radix Primitives, cva, motion
- **Backend:** Hono on Cloudflare Workers (same Worker as the frontend, via `@cloudflare/vite-plugin`)
- **Database + Auth:** Neon Postgres Data API + Neon Auth via a first-party proxy —
  pre-wired but inert until the project's database integration is provisioned
  (see "Neon" below)
- **Routing:** React Router 7
- **Forms:** React Hook Form + Zod
- **Server state:** TanStack Query
- **5 base components** in [src/components/ui/](src/components/ui) — Button, Input, Card, Dialog, Dropdown

## Setup

```bash
npm install
npm run dev
```

On WebDIY the database + auth are provisioned from the app (nothing to configure).
For standalone use, see "Neon" below and `.dev.vars.example`.

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

On first deploy, set production secrets (standalone use only — WebDIY injects
them at publish):

```bash
npx wrangler secret put NEON_AUTH_SERVER_KEY
```

## Architecture

- [src/server/index.ts](src/server/index.ts) — Hono app entry. Routes `/api/*` and falls through to the `ASSETS` binding for static paths.
- [src/server/routes/](src/server/routes) — split routes per resource here, mount them via `app.route('/api/<name>', module)`.
- [src/components/ui/](src/components/ui) — base UI primitives styled per project. Customise variants via `cva` rather than overriding inline.
- [src/features/](src/features) — organise app code by feature (e.g. `src/features/todos/{TodoList.tsx, useTodos.ts, types.ts}`).
- [src/hooks/](src/hooks) — shared React hooks.
- [src/lib/cn.ts](src/lib/cn.ts) — `clsx + tailwind-merge` helper.
- [src/server/neon-auth/](src/server/neon-auth) — Neon Auth first-party proxy (mounted at `/api/auth/*`) + `require-user.ts` JWKS bearer verification. The `vendor/` subdirectory is third-party code — don't edit it.
- [src/lib/neon-auth.ts](src/lib/neon-auth.ts) / [src/lib/neon-data.ts](src/lib/neon-data.ts) — browser auth client (against the proxy) + Data API PostgREST client.
- [src/index.css](src/index.css) — design tokens. Replace the placeholder OKLCH palette before building components.
- [migrations/](migrations) — the app's SQL migrations. On WebDIY, the `applyMigration` tool records each applied change here.
- [vite.config.ts](vite.config.ts) — uses `@webdiy/starter-vite-preset` (registers `@cloudflare/vite-plugin` + sets the proxy-compat invariants).
- [wrangler.toml](wrangler.toml) — CF Workers deploy config.

## Design tokens

The placeholder palette in `src/index.css` is intentionally generic. Replace it with a register-aligned palette before writing components — every base component reads from semantic tokens (`bg-primary`, `text-foreground`, `border-border`).

Add new component variants by extending the `cva()` call in `src/components/ui/<name>.tsx`. Don't paper over with inline `className="bg-blue-600 ..."` at call sites.

## Neon (WebDIY-provisioned database + auth)

On WebDIY, enabling the project's database integration provisions a Neon Postgres
database + Neon Auth and delivers the config automatically: `VITE_NEON_AUTH_URL`,
`VITE_NEON_JWKS_URL`, and `VITE_NEON_DATA_API_URL` appear in `.env` (public endpoint
URLs) and `NEON_AUTH_SERVER_KEY` arrives as a Worker binding. Until then everything
below is inert — `/api/auth/*` answers 501.

- **Auth:** the worker proxies `/api/auth/*` to the Neon Auth upstream and re-mints
  session cookies first-party + host-only ([src/server/neon-auth/](src/server/neon-auth)).
  Browser side, use `authClient` from [src/lib/neon-auth.ts](src/lib/neon-auth.ts)
  (`signIn.email`, `signUp.email`, `useSession()`, `signOut`) — never call the Neon
  upstream directly from the browser (third-party cookies break in Safari).
- **Data:** `createDataClient()` from [src/lib/neon-data.ts](src/lib/neon-data.ts)
  queries the Data API with the signed-in user's JWT attached; Postgres validates it
  and **Row-Level Security is the entire permission layer** — every exposed table
  needs RLS policies (`auth.user_id()` is the current user's id).
- **Protecting your own routes:** `verifyAuthToken(request)` from
  [src/server/neon-auth/require-user.ts](src/server/neon-auth/require-user.ts); the
  browser obtains the bearer token via `getAuthToken()`.
- **Standalone use** (outside WebDIY): put the `VITE_NEON_*` URLs in `.env` and
  `NEON_AUTH_SERVER_KEY` in `.dev.vars` (see `.dev.vars.example`).

## Cloudflare Workers compatibility

- **Use Hono.** Express / Fastify / NestJS appear to work in dev but will not deploy.
- **Use HTTP for Postgres** — the Neon Data API client, or `@neondatabase/serverless` for a raw connection string. `pg` / `mysql2` over native TCP do not work on Workers.
- **No filesystem writes.** Workers have no persistent local disk. Use R2 for blobs.
- **No native modules** (`bcrypt`, `sharp`, `canvas`). Use pure-JS alternatives or Workers-compatible services.

