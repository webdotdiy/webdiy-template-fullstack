/*
 * `import.meta.env` typing for worker code. Vite inlines VITE_-prefixed
 * values from `.env` into the worker bundle exactly as it does for browser
 * code (the worker is a Vite environment under @cloudflare/vite-plugin);
 * this mirrors the browser-side declaration in src/vite-env.d.ts for the
 * worker tsconfig, which doesn't load vite/client types.
 */
interface ImportMetaEnv {
  readonly VITE_NEON_AUTH_URL?: string;
  readonly VITE_NEON_JWKS_URL?: string;
  readonly VITE_NEON_DATA_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
