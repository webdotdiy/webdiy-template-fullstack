import { NeonPostgrestClient } from '@neondatabase/postgrest-js';
import { getAuthToken } from './neon-auth';

/*
 * Data API client (PostgREST over the project's Neon database).
 *
 * Every request carries the signed-in user's JWT; Postgres validates it and
 * Row-Level Security enforces per-user access IN THE DATABASE — always write
 * RLS policies for tables exposed through this client (there is no other
 * permission layer). Anonymous/unauthenticated queries only work for tables
 * whose policies allow them.
 *
 * Usage:
 *   const db = createDataClient();
 *   const { data, error } = await db.from('notes').select('*');
 */

export function createDataClient(): NeonPostgrestClient {
  const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

  if (!dataApiUrl) {
    throw new Error('The Neon database is not provisioned for this project yet.');
  }

  return new NeonPostgrestClient({
    dataApiUrl,
    options: {
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          const token = await getAuthToken();
          const headers = new Headers(init?.headers);

          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }

          return fetch(input, { ...init, headers });
        },
      },
    },
  });
}
