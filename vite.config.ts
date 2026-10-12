import path from 'node:path';
import { defineConfig } from '@webdiy/starter-vite-preset';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/*
 * Fullstack template — Vite + React + Hono on Cloudflare Workers.
 *
 * `defineConfig` from @webdiy/starter-vite-preset registers
 * `@cloudflare/vite-plugin` and enforces the WebDIY preview invariants (any
 * Host accepted, a fixed port, and the hot-update settings the preview needs —
 * the preset's README lists them). Do NOT swap this import for vite's own
 * `defineConfig` — the preview will break.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  /*
   * The template's browser dependencies, pre-bundled when the sandbox image is
   * built, so a project's first page load finds them ready instead of
   * re-bundling every dependency and reloading the page.
   */
  optimizeDeps: {
    include: [
      'react-router',
      '@tanstack/react-query',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
      'motion/react',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'hono/client',
      '@neondatabase/neon-js/auth',
      '@neondatabase/neon-js/auth/react',
      '@neondatabase/postgrest-js',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
    ],
  },
});
