import path from 'node:path';
import { defineConfig } from '@webdiy/starter-vite-preset';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/*
 * Fullstack template — Vite + React + Hono on Cloudflare Workers.
 *
 * `defineConfig` from @webdiy/starter-vite-preset registers
 * `@cloudflare/vite-plugin` and forcibly sets `server.allowedHosts: true`
 * + `server.hmr: false` for the WebDIY preview proxy. Do NOT swap this
 * import for vite's own `defineConfig` — the preview will break.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
