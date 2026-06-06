/**
 * Thin authentication wrapper.
 *
 * Two modes:
 *   1. Supabase mode  (default when VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
 *      are configured). All calls are delegated to `supabase.auth.*`.
 *   2. Demo mode      (fallback when Supabase is not configured). A stable
 *      in-memory session is returned synchronously so the rest of the app
 *      keeps working — useful for local dev and for showcasing Kora without
 *      provisioning anything.
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

import { isSupabaseConfigured, supabase } from './supabase-client';

// -----------------------------------------------------------------------------
// Public types
// -----------------------------------------------------------------------------

export interface KoraUser {
  id: string;
  email: string;
  isDemo: boolean;
}

export interface KoraOrg {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: 'owner' | 'admin' | 'member';
  isDemo: boolean;
}

export interface KoraSession {
  user: KoraUser;
  accessToken: string | null;
}

export interface AuthResult {
  user: KoraUser | null;
  error: string | null;
}

// -----------------------------------------------------------------------------
// Demo fallback
// -----------------------------------------------------------------------------

export const DEMO_USER: KoraUser = {
  id: 'demo-user',
  email: 'demo@local',
  isDemo: true,
};

export const DEMO_ORG: KoraOrg = {
  id: 'demo-org',
  name: 'Demo Organization',
  slug: 'demo',
  plan: 'free',
  role: 'owner',
  isDemo: true,
};

const DEMO_SESSION: KoraSession = {
  user: DEMO_USER,
  accessToken: null,
};

// -----------------------------------------------------------------------------
// Auth API
// -----------------------------------------------------------------------------

export async function signUpWithPassword(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { user: DEMO_USER, error: null };
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { user: null, error: error.message };
  const user = data.user;
  return {
    user: user ? { id: user.id, email: user.email ?? email, isDemo: false } : null,
    error: null,
  };
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { user: DEMO_USER, error: null };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  const user = data.user;
  return {
    user: user ? { id: user.id, email: user.email ?? email, isDemo: false } : null,
    error: null,
  };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured() || !supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<KoraSession | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return DEMO_SESSION;
  }
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user) return null;
  return {
    user: {
      id: session.user.id,
      email: session.user.email ?? '',
      isDemo: false,
    },
    accessToken: session.access_token,
  };
}

export async function getCurrentUser(): Promise<KoraUser | null> {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Returns the "current" organization for the user. In Supabase mode we ask
 * the DB for the first org_members row of the user; in demo mode we return a
 * stable fake org so the UI keeps rendering.
 */
export async function getCurrentOrg(): Promise<KoraOrg | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return DEMO_ORG;
  }
  const session = await getCurrentSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('org_members')
    .select('role, organizations:org_id(id, name, slug, plan)')
    .eq('user_id', session.user.id)
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  // Supabase returns the related row as an object or array depending on the
  // FK shape; normalise both.
  const rawOrg = data.organizations as
    | { id: string; name: string; slug: string; plan: string }
    | { id: string; name: string; slug: string; plan: string }[]
    | null;
  const org = Array.isArray(rawOrg) ? rawOrg[0] : rawOrg;
  if (!org) return null;

  const role = (data.role as KoraOrg['role']) ?? 'member';
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    plan: org.plan,
    role,
    isDemo: false,
  };
}
