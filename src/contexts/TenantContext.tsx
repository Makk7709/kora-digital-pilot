import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { DEMO_ORG, type KoraOrg } from '@/lib/auth-client';
import { isSupabaseConfigured, supabase } from '@/lib/supabase-client';

/**
 * TenantContext — exposes the current organization and (optionally) the list
 * of orgs the user belongs to, so a future UI can switch between them.
 *
 * In demo mode (Supabase not configured) we surface a stable DEMO_ORG. In
 * Supabase mode we query `org_members` joined to `organizations`, scoped by
 * RLS to the authenticated user.
 *
 * Wave 3 — Agent 6 (SaaSisation light).
 */

export interface TenantContextValue {
  currentOrg: KoraOrg | null;
  orgs: KoraOrg[];
  loading: boolean;
  isDemoMode: boolean;
  switchOrg: (orgId: string) => void;
  refresh: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface MembershipRow {
  role: KoraOrg['role'];
  organizations:
    | { id: string; name: string; slug: string; plan: string }
    | { id: string; name: string; slug: string; plan: string }[]
    | null;
}

function pickOrg(row: MembershipRow): KoraOrg | null {
  const raw = Array.isArray(row.organizations) ? row.organizations[0] : row.organizations;
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    plan: raw.plan,
    role: row.role ?? 'member',
    isDemo: false,
  };
}

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode: authDemo, isAuthenticated } = useAuth();
  const supabaseEnabled = isSupabaseConfigured();

  const [orgs, setOrgs] = useState<KoraOrg[]>(supabaseEnabled ? [] : [DEMO_ORG]);
  const [currentOrg, setCurrentOrg] = useState<KoraOrg | null>(
    supabaseEnabled ? null : DEMO_ORG,
  );
  const [loading, setLoading] = useState<boolean>(supabaseEnabled);

  const refresh = useCallback(async () => {
    if (!supabaseEnabled || !supabase) {
      setOrgs([DEMO_ORG]);
      setCurrentOrg(DEMO_ORG);
      setLoading(false);
      return;
    }
    if (!isAuthenticated || !user) {
      setOrgs([]);
      setCurrentOrg(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('org_members')
      .select('role, organizations:org_id(id, name, slug, plan)')
      .eq('user_id', user.id);

    if (error || !data) {
      setOrgs([]);
      setCurrentOrg(null);
      setLoading(false);
      return;
    }

    const normalised = (data as MembershipRow[])
      .map(pickOrg)
      .filter((o): o is KoraOrg => o !== null);

    setOrgs(normalised);
    setCurrentOrg((prev) => {
      if (prev && normalised.some((o) => o.id === prev.id)) return prev;
      return normalised[0] ?? null;
    });
    setLoading(false);
  }, [isAuthenticated, supabaseEnabled, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const switchOrg = useCallback(
    (orgId: string) => {
      const next = orgs.find((o) => o.id === orgId);
      if (next) setCurrentOrg(next);
    },
    [orgs],
  );

  const value = useMemo<TenantContextValue>(
    () => ({
      currentOrg,
      orgs,
      loading,
      isDemoMode: authDemo || !supabaseEnabled,
      switchOrg,
      refresh,
    }),
    [currentOrg, orgs, loading, authDemo, supabaseEnabled, switchOrg, refresh],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    return {
      currentOrg: DEMO_ORG,
      orgs: [DEMO_ORG],
      loading: false,
      isDemoMode: true,
      switchOrg: () => undefined,
      refresh: async () => undefined,
    };
  }
  return ctx;
}
