import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Session as SupabaseSession } from '@supabase/supabase-js';

import {
  DEMO_USER,
  getCurrentSession,
  signInWithPassword as signInImpl,
  signOut as signOutImpl,
  signUpWithPassword as signUpImpl,
  type KoraUser,
} from '@/lib/auth-client';
import { isSupabaseConfigured, supabase } from '@/lib/supabase-client';

/**
 * AuthContext — wraps the Supabase auth lifecycle.
 *
 * When Supabase is configured: subscribes to `onAuthStateChange` and exposes
 * the canonical user + session.
 *
 * When Supabase is NOT configured: returns the stable DEMO_USER instantly so
 * the rest of the app keeps rendering. The DataModeBanner (already mounted in
 * `/app`) signals to the operator that the data layer is degraded.
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

export interface AuthContextValue {
  user: KoraUser | null;
  /** Raw Supabase access token, or null in demo mode. */
  accessToken: string | null;
  loading: boolean;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const demoValueFactory = (): AuthContextValue => ({
  user: DEMO_USER,
  accessToken: null,
  loading: false,
  isDemoMode: true,
  isAuthenticated: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => undefined,
  refresh: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseEnabled = isSupabaseConfigured();
  const [user, setUser] = useState<KoraUser | null>(supabaseEnabled ? null : DEMO_USER);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(supabaseEnabled);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    if (!supabaseEnabled) return;
    const session = await getCurrentSession();
    if (!mountedRef.current) return;
    setUser(session?.user ?? null);
    setAccessToken(session?.accessToken ?? null);
  }, [supabaseEnabled]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      const session = await getCurrentSession();
      if (cancelled) return;
      setUser(session?.user ?? null);
      setAccessToken(session?.accessToken ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: string, session: SupabaseSession | null) => {
        if (cancelled) return;
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            isDemo: false,
          });
          setAccessToken(session.access_token ?? null);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      },
    );

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [supabaseEnabled]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { user: u, error } = await signInImpl(email, password);
      if (!error && u) {
        setUser(u);
        await refresh();
      }
      return { error };
    },
    [refresh],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { user: u, error } = await signUpImpl(email, password);
      if (!error && u) {
        setUser(u);
        await refresh();
      }
      return { error };
    },
    [refresh],
  );

  const signOutCb = useCallback(async () => {
    await signOutImpl();
    setUser(null);
    setAccessToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      loading,
      isDemoMode: !supabaseEnabled,
      isAuthenticated: user !== null,
      signIn,
      signUp,
      signOut: signOutCb,
      refresh,
    }),
    [user, accessToken, loading, supabaseEnabled, signIn, signUp, signOutCb, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Hook used outside of provider — return a demo-safe default so that
    // ad-hoc usage (storybook, isolated tests) does not throw.
    return demoValueFactory();
  }
  return ctx;
}
