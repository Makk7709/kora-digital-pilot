/**
 * CommonJS twin of `src/lib/supabase-admin.ts`.
 *
 * `server.cjs` cannot directly require the .ts file without a transpiler, so
 * this minimal CJS module mirrors the same public API:
 *
 *   - getAdminClient(): SupabaseClient | null
 *   - isAdminConfigured(): boolean
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

const { createClient } = require('@supabase/supabase-js');

// Side-effect: load .env if no one did it before us. `server.cjs` already
// calls dotenv.config() at startup, so this is a no-op in the standard
// boot path but it makes the module safe to require from tests / scripts.
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is a regular dep; this catch only guards against running in an
  // environment where it is intentionally absent (e.g. a stripped container).
}

let cachedAdminClient;
let cacheInitialised = false;

function getAdminClient() {
  if (cacheInitialised) return cachedAdminClient;

  const url = (process.env.SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!url || !serviceKey) {
    cachedAdminClient = null;
    cacheInitialised = true;
    return null;
  }

  cachedAdminClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  cacheInitialised = true;
  return cachedAdminClient;
}

function isAdminConfigured() {
  return getAdminClient() !== null;
}

module.exports = {
  getAdminClient,
  isAdminConfigured,
};
