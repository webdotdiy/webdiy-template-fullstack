/*
 * Ambient globals the vendored files reference. At runtime both exist on
 * workerd via the `nodejs_compat` compatibility flag (and Vite statically
 * replaces `process.env.NODE_ENV` at build time anyway); the worker
 * tsconfig deliberately doesn't load @types/node, so declare just what the
 * vendored code touches.
 */
declare namespace NodeJS {
  interface ErrnoException extends Error {
    code?: string;
  }
}

declare const process: { env: { NODE_ENV?: string } };
