/**
 * Browser-side Supabase client.
 *
 * The client is intentionally optional: when neither `VITE_SUPABASE_URL` nor
 * `VITE_SUPABASE_ANON_KEY` is configured, we export `null` so the rest of the
 * app can fall back to the in-memory demo session (see `auth-client.ts` and
 * `AuthContext.tsx`).
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

const isConfigured = url.length > 0 && anon.length > 0;

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

export function getSupabaseUrl(): string {
  return url;
}
