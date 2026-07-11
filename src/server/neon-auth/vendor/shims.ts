/*
 * Type shims for the `@/…` path aliases the vendored files import.
 * Type-only — nothing here exists at runtime.
 *
 * `VanillaBetterAuthClient` is deliberately permissive: upstream derives it
 * from better-auth's plugin-typed client so the endpoint tree is
 * name-checked at compile time, but that inference doesn't reproduce
 * outside the source repo. The tree was validated upstream at the vendored
 * commit, and the runtime proxy path never consults this type — so the
 * vendor copy trades that compile-time check away rather than dragging the
 * whole adapter-core type machinery in.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VanillaBetterAuthClient = Record<string, any>;

export type { Session as BetterAuthSession, User as BetterAuthUser } from 'better-auth/types';
