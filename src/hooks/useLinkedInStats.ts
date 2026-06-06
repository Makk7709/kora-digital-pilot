import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { linkedinAPI } from '@/lib/linkedin-api';
import type { LinkedInMetrics, LinkedInPost } from '@/lib/linkedin-api';

type StatsPeriod = '7d' | '30d' | '90d';

interface StatsState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdate: Date | null;
  retryCount: number;
}

interface CacheEntry {
  data: LinkedInMetrics;
  timestamp: number;
  period: string;
}

interface UseLinkedInStatsReturn {
  // État des données
  metrics: LinkedInMetrics | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdate: Date | null;
  isAuthenticated: boolean;

  // Actions
  refreshStats: (period?: StatsPeriod) => Promise<void>;
  clearError: () => void;
  clearCache: () => void;

  // Métriques formatées pour l'affichage
  formattedMetrics: {
    reach: { value: string; trend: string; isPositive: boolean };
    engagement: { value: string; trend: string; isPositive: boolean };
    clicks: { value: string; trend: string; isPositive: boolean };
    growth: { value: string; isPositive: boolean };
  } | null;

  // Posts récents avec métriques
  topPosts: LinkedInPost[];

  // Statut de connexion
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'checking';

  // Informations de cache
  cacheInfo: {
    isFromCache: boolean;
    cacheAge: number; // en minutes
  };
}

export const useLinkedInStats = (
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes par défaut
  cacheTimeout = 120000, // 2 minutes de cache par défaut
): UseLinkedInStatsReturn => {
  const [metrics, setMetrics] = useState<LinkedInMetrics | null>(null);
  const [state, setState] = useState<StatsState>({
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdate: null,
    retryCount: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'error' | 'checking'
  >('checking');
  const [cacheInfo, setCacheInfo] = useState<{ isFromCache: boolean; cacheAge: number }>({
    isFromCache: false,
    cacheAge: 0,
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  // Vérifier le cache
  const getCachedData = useCallback(
    (period: string): LinkedInMetrics | null => {
      const cacheKey = `linkedin_${period}`;
      const cached = cacheRef.current.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        const ageMinutes = Math.floor((Date.now() - cached.timestamp) / 60000);
        setCacheInfo({ isFromCache: true, cacheAge: ageMinutes });
        return cached.data;
      }

      setCacheInfo({ isFromCache: false, cacheAge: 0 });
      return null;
    },
    [cacheTimeout],
  );

  // Mettre en cache les données
  const setCachedData = useCallback((period: string, data: LinkedInMetrics) => {
    const cacheKey = `linkedin_${period}`;
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now(),
      period,
    });
  }, []);

  // Vider le cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setCacheInfo({ isFromCache: false, cacheAge: 0 });
  }, []);

  // Vérifier l'authentification
  const checkAuthentication = useCallback(async () => {
    try {
      setConnectionStatus('checking');
      const isAuth = linkedinAPI.isAuthenticated();

      if (isAuth) {
        // Test de connectivité réelle
        const isConnected = await linkedinAPI.testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'error');
        return isConnected;
      } else {
        setConnectionStatus('disconnected');
        return false;
      }
    } catch (error) {
      console.error('Erreur vérification authentification:', error);
      setConnectionStatus('error');
      return false;
    }
  }, []);

  // Récupérer les statistiques avec gestion d'erreurs robuste
  const fetchStats = useCallback(
    async (period: StatsPeriod = '7d', isRefresh = false) => {
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        isLoading: !isRefresh,
        isRefreshing: isRefresh,
        error: null,
      }));

      try {
        const cachedData = getCachedData(period);
        if (cachedData) {
          setMetrics(cachedData);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isRefreshing: false,
            lastUpdate: new Date(),
            retryCount: 0,
            error: null,
          }));
        } else {
          const data = await linkedinAPI.getMetrics(period);

          setMetrics(data);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            isRefreshing: false,
            lastUpdate: new Date(),
            retryCount: 0,
            error: null,
          }));

          setCachedData(period, data);
        }

        // Programmer le prochain rafraîchissement automatique
        if (autoRefresh && refreshInterval > 0) {
          refreshTimeoutRef.current = setTimeout(() => {
            fetchStats(period, true);
          }, refreshInterval);
        }
      } catch (error) {
        console.error('Erreur récupération stats LinkedIn:', error);

        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isRefreshing: false,
          error: errorMessage,
          retryCount: prev.retryCount + 1,
        }));

        // Retry automatique avec backoff exponentiel (max 3 tentatives)
        setState((currentState) => {
          if (currentState.retryCount < 3) {
            const retryDelay = Math.min(1000 * Math.pow(2, currentState.retryCount), 10000);
            retryTimeoutRef.current = setTimeout(() => {
              fetchStats(period, isRefresh);
            }, retryDelay);
          }
          return currentState;
        });
      }
    },
    [autoRefresh, refreshInterval, getCachedData, setCachedData],
  );

  // Action de rafraîchissement manuel
  const refreshStats = useCallback(
    async (period: StatsPeriod = '7d') => {
      // Vérifier d'abord la connexion
      const isConnected = await checkAuthentication();
      if (!isConnected) {
        setState((prev) => ({
          ...prev,
          error: 'LinkedIn non connecté. Veuillez vous authentifier.',
        }));
        return;
      }

      await fetchStats(period, true);
    },
    [checkAuthentication, fetchStats],
  );

  // Effacer les erreurs
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, retryCount: 0 }));
  }, []);

  // Formater les métriques pour l'affichage
  const formattedMetrics = useMemo(() => {
    if (!metrics) return null;

    const parseGrowth = (growth: string) => {
      const value = Number.parseFloat(growth.replace(/[+%]/g, ''));
      return { value: growth, isPositive: value >= 0 };
    };

    return {
      reach: {
        value: metrics.totalReach,
        trend: metrics.growth,
        isPositive: parseGrowth(metrics.growth).isPositive,
      },
      engagement: {
        value: metrics.totalEngagement,
        trend: metrics.growth,
        isPositive: parseGrowth(metrics.growth).isPositive,
      },
      clicks: {
        value: metrics.totalClicks,
        trend: metrics.growth,
        isPositive: parseGrowth(metrics.growth).isPositive,
      },
      growth: parseGrowth(metrics.growth),
    };
  }, [metrics]);

  // Posts les plus performants
  const topPosts = useMemo(() => {
    if (!metrics?.posts) return [];

    return metrics.posts
      .sort((a, b) => {
        const aEngagement = a.metrics.likes + a.metrics.comments + a.metrics.shares;
        const bEngagement = b.metrics.likes + b.metrics.comments + b.metrics.shares;
        return bEngagement - aEngagement;
      })
      .slice(0, 5);
  }, [metrics]);

  // Initialisation et nettoyage
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;

      try {
        await checkAuthentication();

        if (mounted) {
          await fetchStats('7d');
        }
      } catch (error) {
        console.error('Erreur initialisation LinkedIn stats:', error);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            error: "Erreur lors de l'initialisation",
          }));
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkAuthentication, fetchStats]);

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    metrics,
    isLoading: state.isLoading,
    isRefreshing: state.isRefreshing,
    error: state.error,
    lastUpdate: state.lastUpdate,
    isAuthenticated: connectionStatus === 'connected',
    refreshStats,
    clearError,
    clearCache,
    formattedMetrics,
    topPosts,
    connectionStatus,
    cacheInfo,
  };
};

export default useLinkedInStats;
