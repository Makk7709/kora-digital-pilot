/**
 * Fire-and-forget usage telemetry.
 *
 * `logUsage` posts a tiny event to the proxy (`/api/usage`), which forwards
 * it to Supabase. All errors are intentionally swallowed: telemetry should
 * never break user-facing flows.
 *
 * In demo mode (no Supabase configured) the event is logged to the console
 * only — the server-side endpoint will respond `202` without writing.
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

import { getCurrentSession } from './auth-client';
import { isSupabaseConfigured, supabase } from './supabase-client';

const USAGE_ENDPOINT = '/api/usage';

/** Canonical events tracked by the app. Free-form is allowed, but prefer this list. */
export const USAGE_EVENTS = {
  AUTH_LOGIN_SUCCESS: 'auth.login.success',
  AUTH_SIGNUP_SUCCESS: 'auth.signup.success',
  AUTH_LOGOUT: 'auth.logout',
  LINKEDIN_CONNECT_SUCCESS: 'linkedin.connect.success',
  REPORT_GENERATED: 'report.generated',
  EXPORT_PDF: 'export.pdf',
} as const;

// S6571 : on garde l'autocomplétion sur le catalogue d'events (`USAGE_EVENTS`) tout en autorisant
// des chaînes ad-hoc, via l'astuce `string & {}` qui empêche TypeScript d'aplatir l'union.
type CatalogEvent = (typeof USAGE_EVENTS)[keyof typeof USAGE_EVENTS];

export type UsageEventName = CatalogEvent | (string & {});

export interface LogUsageOptions {
  /** Force the event to be sent even in demo mode (server will no-op). */
  alwaysSend?: boolean;
}

export async function logUsage(
  eventName: UsageEventName,
  properties: Record<string, unknown> = {},
  options: LogUsageOptions = {},
): Promise<void> {
  try {
    // In dev / demo mode we can short-circuit to avoid a useless POST, except
    // when the caller explicitly asks to record it (useful for debugging).
    if (!isSupabaseConfigured() && !options.alwaysSend) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[usage] (demo) skipped', eventName, properties);
      }
      return;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Attach the Supabase JWT so the proxy can identify the org via
    // supabase.auth.getUser(jwt). Cookies are also forwarded for the
    // LinkedIn session.
    if (isSupabaseConfigured() && supabase) {
      const session = await getCurrentSession();
      if (session?.accessToken) {
        headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    await fetch(USAGE_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ event_name: eventName, properties }),
    });
  } catch {
    // Telemetry is best-effort: never let it bubble.
  }
}
