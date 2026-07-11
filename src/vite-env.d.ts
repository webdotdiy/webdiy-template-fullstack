/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Neon Auth upstream base URL (platform-provisioned public var). */
  readonly VITE_NEON_AUTH_URL?: string;

  /** JWKS endpoint for verifying the project's auth JWTs. */
  readonly VITE_NEON_JWKS_URL?: string;

  /** PostgREST Data API endpoint for the project's Neon database. */
  readonly VITE_NEON_DATA_API_URL?: string;

  /** Publishable client key issued with the auth instance. */
  readonly VITE_NEON_AUTH_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
