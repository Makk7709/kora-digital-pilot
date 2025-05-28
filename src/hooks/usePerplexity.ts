import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getPerplexityService, 
  createPerplexityService, 
  PerplexityResponse, 
  InsightRequest, 
  MarketInsight,
  PerplexityConfig 
} from '@/lib/perplexity-service';
import { useToast } from '@/hooks/use-toast';

interface UsePerplexityState {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastResponse: PerplexityResponse | null;
  insights: MarketInsight[];
  cacheStats: { size: number; keys: string[] };
}

interface UsePerplexityReturn extends UsePerplexityState {
  // Méthodes principales
  initializeService: (config: PerplexityConfig) => void;
  getBusinessInsights: (request: InsightRequest) => Promise<PerplexityResponse | null>;
  getMarketingTrends: (topic: string, timeframe?: '24h' | '7d' | '30d') => Promise<MarketInsight[]>;
  getAITechWatch: (domain: string) => Promise<PerplexityResponse | null>;
  getCompetitorAnalysis: (competitors: string[], market: string) => Promise<PerplexityResponse | null>;
  generateContentWithResearch: (topic: string, contentType: 'article' | 'post' | 'thread') => Promise<PerplexityResponse | null>;
  findReliableSources: (topic: string, sourceTypes?: string[]) => Promise<PerplexityResponse | null>;
  
  // Utilitaires
  clearCache: () => void;
  refreshCacheStats: () => void;
  reset: () => void;
}

export const usePerplexity = (): UsePerplexityReturn => {
  const [state, setState] = useState<UsePerplexityState>({
    isLoading: false,
    isInitialized: false,
    error: null,
    lastResponse: null,
    insights: [],
    cacheStats: { size: 0, keys: [] },
  });

  const { toast } = useToast();

  // Initialiser le service Perplexity
  const initializeService = useCallback((config: PerplexityConfig) => {
    try {
      createPerplexityService(config);
      setState(prev => ({
        ...prev,
        isInitialized: true,
        error: null,
      }));
      
      toast({
        title: "Perplexity initialisé",
        description: "Service d'insights IA activé avec succès",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'initialisation';
      setState(prev => ({
        ...prev,
        isInitialized: false,
        error: errorMessage,
      }));
      
      toast({
        title: "Erreur d'initialisation",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Vérifier l'initialisation automatiquement
  useEffect(() => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (apiKey && !state.isInitialized) {
      initializeService({
        apiKey,
        model: 'sonar-pro',
        maxTokens: 2000,
        temperature: 0.3,
      });
    }
  }, [initializeService, state.isInitialized]);

  // Méthode générique pour les appels avec gestion d'erreurs
  const makePerplexityCall = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T | null> => {
    if (!state.isInitialized) {
      toast({
        title: "Service non initialisé",
        description: "Veuillez configurer Perplexity d'abord",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await operation();
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast({
        title: `Erreur ${operationName}`,
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [state.isInitialized, toast]);

  // Obtenir des insights business
  const getBusinessInsights = useCallback(async (request: InsightRequest): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(async () => {
      const service = getPerplexityService();
      const response = await service.getBusinessInsights(request);
      setState(prev => ({ ...prev, lastResponse: response }));
      return response;
    }, 'insights business');
  }, [makePerplexityCall]);

  // Obtenir les tendances marketing
  const getMarketingTrends = useCallback(async (
    topic: string, 
    timeframe: '24h' | '7d' | '30d' = '7d'
  ): Promise<MarketInsight[]> => {
    const result = await makePerplexityCall(async () => {
      const service = getPerplexityService();
      const insights = await service.getDigitalMarketingTrends(topic, timeframe);
      setState(prev => ({ ...prev, insights }));
      return insights;
    }, 'tendances marketing');

    return result || [];
  }, [makePerplexityCall]);

  // Veille technologique IA
  const getAITechWatch = useCallback(async (domain: string): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(async () => {
      const service = getPerplexityService();
      const response = await service.getAITechWatch(domain);
      setState(prev => ({ ...prev, lastResponse: response }));
      return response;
    }, 'veille technologique');
  }, [makePerplexityCall]);

  // Analyse concurrentielle
  const getCompetitorAnalysis = useCallback(async (
    competitors: string[], 
    market: string
  ): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(async () => {
      const service = getPerplexityService();
      const response = await service.getCompetitorAnalysis(competitors, market);
      setState(prev => ({ ...prev, lastResponse: response }));
      return response;
    }, 'analyse concurrentielle');
  }, [makePerplexityCall]);

  // Génération de contenu avec recherche
  const generateContentWithResearch = useCallback(async (
    topic: string, 
    contentType: 'article' | 'post' | 'thread'
  ): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(async () => {
      const service = getPerplexityService();
      const response = await service.generateContentWithResearch(topic, contentType);
      setState(prev => ({ ...prev, lastResponse: response }));
      return response;
    }, 'génération de contenu');
  }, [makePerplexityCall]);

  // Recherche de sources fiables
  const findReliableSources = useCallback(async (
    topic: string, 
    sourceTypes: string[] = []
  ): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(async () => {
      const service = getPerplexityService();
      const response = await service.findReliableSources(topic, sourceTypes);
      setState(prev => ({ ...prev, lastResponse: response }));
      return response;
    }, 'recherche de sources');
  }, [makePerplexityCall]);

  // Vider le cache
  const clearCache = useCallback(() => {
    if (state.isInitialized) {
      const service = getPerplexityService();
      service.clearCache();
      refreshCacheStats();
      
      toast({
        title: "Cache vidé",
        description: "Le cache Perplexity a été effacé",
      });
    }
  }, [state.isInitialized, toast]);

  // Actualiser les stats du cache
  const refreshCacheStats = useCallback(() => {
    if (state.isInitialized) {
      const service = getPerplexityService();
      const cacheStats = service.getCacheStats();
      setState(prev => ({ ...prev, cacheStats }));
    }
  }, [state.isInitialized]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isInitialized: false,
      error: null,
      lastResponse: null,
      insights: [],
      cacheStats: { size: 0, keys: [] },
    });
  }, []);

  // Actualiser les stats du cache périodiquement
  useEffect(() => {
    if (state.isInitialized) {
      const interval = setInterval(refreshCacheStats, 30000); // Toutes les 30 secondes
      return () => clearInterval(interval);
    }
  }, [state.isInitialized, refreshCacheStats]);

  // Mémoriser les fonctions pour éviter les re-renders inutiles
  const memoizedReturn = useMemo(() => ({
    ...state,
    initializeService,
    getBusinessInsights,
    getMarketingTrends,
    getAITechWatch,
    getCompetitorAnalysis,
    generateContentWithResearch,
    findReliableSources,
    clearCache,
    refreshCacheStats,
    reset,
  }), [
    state,
    initializeService,
    getBusinessInsights,
    getMarketingTrends,
    getAITechWatch,
    getCompetitorAnalysis,
    generateContentWithResearch,
    findReliableSources,
    clearCache,
    refreshCacheStats,
    reset,
  ]);

  return memoizedReturn;
};

// Hook spécialisé pour les insights marketing
export const useMarketingInsights = (topic?: string) => {
  const perplexity = usePerplexity();
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh des insights
  useEffect(() => {
    if (autoRefresh && topic && perplexity.isInitialized) {
      const interval = setInterval(() => {
        perplexity.getMarketingTrends(topic, '24h');
      }, 60 * 60 * 1000); // Toutes les heures

      return () => clearInterval(interval);
    }
  }, [autoRefresh, topic, perplexity]);

  return {
    ...perplexity,
    autoRefresh,
    setAutoRefresh,
    quickInsights: useCallback(async (query: string) => {
      return perplexity.getBusinessInsights({
        query,
        industry: 'digital-marketing',
        depth: 'quick',
        language: 'fr',
      });
    }, [perplexity]),
  };
};

// Hook spécialisé pour la veille technologique
export const useTechWatch = (domains: string[] = []) => {
  const perplexity = usePerplexity();
  const [watchlist, setWatchlist] = useState<string[]>(domains);
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    domain: string;
    alert: string;
    timestamp: Date;
    priority: 'high' | 'medium' | 'low';
  }>>([]);

  // Surveiller les domaines de la watchlist
  const monitorDomains = useCallback(async () => {
    if (!perplexity.isInitialized || watchlist.length === 0) return;

    const newAlerts = [];
    
    for (const domain of watchlist) {
      try {
        const response = await perplexity.getAITechWatch(domain);
        if (response) {
          // Parser les alertes importantes
          const lines = response.content.split('\n').filter(line => 
            line.toLowerCase().includes('nouveau') || 
            line.toLowerCase().includes('breakthrough') ||
            line.toLowerCase().includes('révolution')
          );

          for (const line of lines) {
            newAlerts.push({
              id: Math.random().toString(36).substr(2, 9),
              domain,
              alert: line.trim(),
              timestamp: new Date(),
              priority: line.toLowerCase().includes('révolution') ? 'high' as const : 'medium' as const,
            });
          }
        }
      } catch (error) {
        console.warn(`Erreur monitoring ${domain}:`, error);
      }
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 20)); // Garder les 20 plus récents
    }
  }, [perplexity, watchlist]);

  // Ajouter un domaine à surveiller
  const addToWatchlist = useCallback((domain: string) => {
    setWatchlist(prev => [...new Set([...prev, domain])]);
  }, []);

  // Retirer un domaine de la surveillance
  const removeFromWatchlist = useCallback((domain: string) => {
    setWatchlist(prev => prev.filter(d => d !== domain));
  }, []);

  // Effacer les alertes
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    ...perplexity,
    watchlist,
    alerts,
    addToWatchlist,
    removeFromWatchlist,
    clearAlerts,
    monitorDomains,
  };
}; 