/**
 * Server-side Supabase admin client.
 *
 * Loaded via `require()` from `server.cjs`. Uses the service-role key, which
 * MUST NEVER be exposed to the browser bundle. The dual export shape (CJS +
 * ESM) means the file can also be type-checked by the Vite/TS toolchain
 * without being bundled (no `import.meta.env` access here).
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedAdminClient: SupabaseClient | null | undefined;

/**
 * Returns a singleton Supabase admin client, or `null` if the required
 * server-only env vars are not configured. Callers MUST handle the `null`
 * case and degrade gracefully (typically by no-op'ing the operation).
 */
export function getAdminClient(): SupabaseClient | null {
  if (cachedAdminClient !== undefined) {
    return cachedAdminClient;
  }

  const url = (process.env.SUPABASE_URL ?? '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();

  if (!url || !serviceKey) {
    cachedAdminClient = null;
    return null;
  }

  cachedAdminClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cachedAdminClient;
}

export function isAdminConfigured(): boolean {
  return getAdminClient() !== null;
}

// CommonJS interop: server.cjs uses `require('./src/lib/supabase-admin')`.
// Vite/TS would normally strip this, but we keep it explicit to make the
// intent obvious. The actual `.cjs` runtime resolves it via tsx/ts-node?
// — No: server.cjs requires the compiled JS from a sibling .cjs file. To
// avoid a compile step we ship a parallel CommonJS module
// `src/lib/supabase-admin.cjs` that mirrors this file. Keep both in sync.
