# Vendored: Neon Auth first-party proxy core

Vendored from [`neondatabase/neon-js`](https://github.com/neondatabase/neon-js)
at commit `186ac6b` (`@neondatabase/auth@0.4.2-beta`), `packages/auth/src/server/`
— Apache-2.0 licensed by Neon, Inc.

**Why vendored:** the framework-agnostic proxy core (`handleAuthProxyRequest`)
runs on Cloudflare Workers, but the package's only server export is
`@neondatabase/auth/next/server`, which hard-imports `next/headers` /
`next/server` and cannot resolve outside Next.js. Neon's roadmap lists a
standalone server entry — when it ships, replace this directory with the
package import and delete the vendor copy.

**What changed vs upstream (mechanical only):**

- `@/server/…` path aliases rewritten to relative imports.
- `@/types` and `@/core/better-auth-types` (type-only imports) point at
  `./shims.ts`, a local reduction of those two files.
- Test files, the Next adapter, `client-factory`, and `middleware/` are not
  vendored (not needed by the proxy path).

Runtime dependencies: `better-auth` (pinned to the version the source repo
pins) and `jose` — both declared in the template's `package.json`.

Do not hand-edit these files; re-vendor from a newer upstream commit instead
(copy the same file list, re-apply the three rewrites above).
