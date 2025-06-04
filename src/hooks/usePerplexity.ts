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
  isSimulationMode: boolean;
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

// Données de simulation pour le mode démo
const generateSimulatedResponse = (topic: string, contentType: string): PerplexityResponse => {
  const simulatedContent = {
    'Tendances IA 2025': `🚀 **Tendances IA 2025 : Ce qui va révolutionner votre business**

L'intelligence artificielle continue sa progression fulgurante. Voici les tendances clés à surveiller :

🔥 **1. IA Générative Multimodale**
- Fusion texte, image, vidéo et audio
- Création de contenu immersif
- Applications marketing révolutionnaires

🎯 **2. IA Prédictive Avancée**
- Anticipation des comportements clients
- Optimisation des campagnes en temps réel
- ROI marketing multiplié par 3

⚡ **3. Automatisation Intelligente**
- Workflows adaptatifs
- Personnalisation à grande échelle
- Réduction des coûts de 40%

💡 **Conseil Kora** : Intégrez ces technologies dès maintenant pour prendre l'avantage concurrentiel !

#IA #Innovation #Marketing #Tendances2025`,

    'marketing digital': `📈 **Marketing Digital : Les stratégies gagnantes de 2025**

Le paysage digital évolue rapidement. Voici comment rester en tête :

🎯 **Personnalisation Hyper-Ciblée**
- Segmentation comportementale avancée
- Contenu adaptatif en temps réel
- Taux de conversion +250%

🤖 **Marketing Automation Intelligent**
- Parcours clients auto-optimisés
- Lead scoring prédictif
- Nurturing personnalisé

📱 **Expérience Omnicanale**
- Cohérence sur tous les touchpoints
- Attribution cross-device
- Customer lifetime value optimisée

🔍 **Analytics Prédictifs**
- Anticipation des tendances
- Optimisation proactive
- Décisions data-driven

Transformez votre approche marketing avec Kora Digital !

#MarketingDigital #Stratégie #Innovation #ROI`,

    'default': `✨ **Contenu Intelligent Généré par Kora**

Voici un contenu optimisé pour votre audience :

🎯 **Message Clé**
Contenu personnalisé basé sur les dernières tendances et insights de votre secteur.

📊 **Données Contextuelles**
- Analyse des performances passées
- Optimisation des horaires de publication
- Suggestions d'engagement

🚀 **Call-to-Action**
Engagez votre communauté avec ce contenu stratégique !

#KoraDigital #IA #ContentMarketing #Stratégie`
  };

  return {
    content: simulatedContent[topic as keyof typeof simulatedContent] || simulatedContent.default,
    sources: [
      {
        title: "Kora Digital - Insights IA",
        url: "https://kora-digital.com/insights",
        snippet: "Analyse basée sur les dernières tendances du marché"
      },
      {
        title: "Tendances Marketing 2025",
        url: "https://marketing-trends.com/2025",
        snippet: "Rapport complet sur l'évolution du marketing digital"
      }
    ],
    usage: {
      prompt_tokens: 150,
      completion_tokens: 300,
      total_tokens: 450
    },
    model: 'kora-simulation-v1',
    timestamp: new Date()
  };
};

const generateSimulatedInsights = (topic: string): MarketInsight[] => {
  return [
    {
      trend: `Tendance émergente : ${topic}`,
      impact: 'high',
      timeframe: '7 derniers jours',
      actionable_insights: [
        `Créer du contenu sur ${topic}`,
        'Optimiser les hashtags associés',
        'Planifier une série de posts'
      ],
      sources: [
        {
          title: 'Google Trends Analytics',
          url: 'https://trends.google.com',
          credibility: 0.95
        },
        {
          title: 'Social Media Analytics Report',
          url: 'https://analytics.social',
          credibility: 0.88
        }
      ],
      confidence_score: 0.85,
      last_updated: new Date()
    },
    {
      trend: 'Optimisation des horaires de publication',
      impact: 'medium',
      timeframe: '30 derniers jours',
      actionable_insights: [
        'Publier entre 9h-11h et 17h-19h',
        'Éviter les weekends pour le B2B',
        'Tester les créneaux 14h-16h'
      ],
      sources: [
        {
          title: 'Engagement Analytics Platform',
          url: 'https://engagement.analytics',
          credibility: 0.92
        },
        {
          title: 'Social Media Timing Study',
          url: 'https://timing.study',
          credibility: 0.78
        }
      ],
      confidence_score: 0.78,
      last_updated: new Date()
    }
  ];
};

export const usePerplexity = (): UsePerplexityReturn => {
  const [state, setState] = useState<UsePerplexityState>({
    isLoading: false,
    isInitialized: false,
    isSimulationMode: false,
    error: null,
    lastResponse: null,
    insights: [],
    cacheStats: { size: 0, keys: [] },
  });

  const { toast } = useToast();

  // Initialiser le service Perplexity
  const initializeService = useCallback((config: PerplexityConfig) => {
    try {
      // Vérifier si on a une vraie clé API
      const isRealApiKey = config.apiKey && 
        config.apiKey !== 'demo_key_for_testing' && 
        config.apiKey !== 'your_perplexity_api_key_here' &&
        config.apiKey.length > 10;

      if (isRealApiKey) {
        // Mode réel avec API
        createPerplexityService(config);
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isSimulationMode: false,
          error: null,
        }));
        
        toast({
          title: "Perplexity initialisé",
          description: "Service d'insights IA activé avec succès",
        });
      } else {
        // Mode simulation
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isSimulationMode: true,
          error: null,
          cacheStats: { size: 5, keys: ['demo-cache-1', 'demo-cache-2'] }
        }));
        
        toast({
          title: "Mode simulation activé",
          description: "Actions IA disponibles en mode démo (configurez l'API pour le mode réel)",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'initialisation';
      setState(prev => ({
        ...prev,
        isInitialized: false,
        isSimulationMode: false,
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
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY || 'demo_key_for_testing';
    if (!state.isInitialized) {
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
    simulationFallback: () => T,
    operationName: string
  ): Promise<T | null> => {
    if (!state.isInitialized) {
      toast({
        title: "Service non initialisé",
        description: "Initialisation en cours...",
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let result: T;
      
      if (state.isSimulationMode) {
        // Mode simulation
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler un délai
        result = simulationFallback();
        
        toast({
          title: `${operationName} (simulation)`,
          description: "Résultat généré en mode démo",
        });
      } else {
        // Mode réel
        result = await operation();
        
        toast({
          title: `${operationName} réussi`,
          description: "Données récupérées via Perplexity API",
        });
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      // En cas d'erreur, basculer en mode simulation
      if (!state.isSimulationMode) {
        const fallbackResult = simulationFallback();
        
        toast({
          title: `${operationName} (mode secours)`,
          description: "Résultat généré en mode simulation suite à une erreur API",
        });
        
        return fallbackResult;
      }

      toast({
        title: `Erreur ${operationName}`,
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [state.isInitialized, state.isSimulationMode, toast]);

  // Obtenir des insights business
  const getBusinessInsights = useCallback(async (request: InsightRequest): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(
      async () => {
        const service = getPerplexityService();
        const response = await service.getBusinessInsights(request);
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      () => {
        const response = generateSimulatedResponse(request.query, 'business');
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      'Insights business'
    );
  }, [makePerplexityCall]);

  // Obtenir les tendances marketing
  const getMarketingTrends = useCallback(async (
    topic: string, 
    timeframe: '24h' | '7d' | '30d' = '7d'
  ): Promise<MarketInsight[]> => {
    const result = await makePerplexityCall(
      async () => {
        const service = getPerplexityService();
        const insights = await service.getDigitalMarketingTrends(topic, timeframe);
        setState(prev => ({ ...prev, insights }));
        return insights;
      },
      () => {
        const insights = generateSimulatedInsights(topic);
        setState(prev => ({ ...prev, insights }));
        return insights;
      },
      'Tendances marketing'
    );

    return result || [];
  }, [makePerplexityCall]);

  // Veille technologique IA
  const getAITechWatch = useCallback(async (domain: string): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(
      async () => {
        const service = getPerplexityService();
        const response = await service.getAITechWatch(domain);
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      () => {
        const response = generateSimulatedResponse(domain, 'tech-watch');
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      'Veille technologique'
    );
  }, [makePerplexityCall]);

  // Analyse concurrentielle
  const getCompetitorAnalysis = useCallback(async (
    competitors: string[], 
    market: string
  ): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(
      async () => {
        const service = getPerplexityService();
        const response = await service.getCompetitorAnalysis(competitors, market);
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      () => {
        const response = generateSimulatedResponse(`Analyse concurrentielle ${market}`, 'competitor-analysis');
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      'Analyse concurrentielle'
    );
  }, [makePerplexityCall]);

  // Génération de contenu avec recherche
  const generateContentWithResearch = useCallback(async (
    topic: string, 
    contentType: 'article' | 'post' | 'thread'
  ): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(
      async () => {
        const service = getPerplexityService();
        const response = await service.generateContentWithResearch(topic, contentType);
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      () => {
        const response = generateSimulatedResponse(topic, contentType);
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      'Génération de contenu'
    );
  }, [makePerplexityCall]);

  // Recherche de sources fiables
  const findReliableSources = useCallback(async (
    topic: string, 
    sourceTypes: string[] = []
  ): Promise<PerplexityResponse | null> => {
    return makePerplexityCall(
      async () => {
        const service = getPerplexityService();
        const response = await service.findReliableSources(topic, sourceTypes);
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      () => {
        const response = generateSimulatedResponse(`Sources fiables ${topic}`, 'sources');
        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      },
      'Recherche de sources'
    );
  }, [makePerplexityCall]);

  // Vider le cache
  const clearCache = useCallback(() => {
    if (state.isInitialized) {
      if (!state.isSimulationMode) {
        const service = getPerplexityService();
        service.clearCache();
      }
      
      setState(prev => ({ 
        ...prev, 
        cacheStats: { size: 0, keys: [] }
      }));
      
      toast({
        title: "Cache vidé",
        description: "Le cache a été effacé",
      });
    }
  }, [state.isInitialized, state.isSimulationMode, toast]);

  // Actualiser les stats du cache
  const refreshCacheStats = useCallback(() => {
    if (state.isInitialized) {
      if (!state.isSimulationMode) {
        const service = getPerplexityService();
        const cacheStats = service.getCacheStats();
        setState(prev => ({ ...prev, cacheStats }));
      } else {
        // Stats simulées
        setState(prev => ({ 
          ...prev, 
          cacheStats: { 
            size: Math.floor(Math.random() * 10) + 1, 
            keys: ['demo-1', 'demo-2', 'demo-3'] 
          }
        }));
      }
    }
  }, [state.isInitialized, state.isSimulationMode]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isInitialized: false,
      isSimulationMode: false,
      error: null,
      lastResponse: null,
      insights: [],
      cacheStats: { size: 0, keys: [] },
    });
  }, []);

  // 🛡️ PROTECTION CRÉDIT API - Actualiser les stats du cache seulement sur demande
  useEffect(() => {
    if (state.isInitialized) {
      // ✅ RETIRÉ: Plus d'actualisation automatique périodique pour protéger les crédits
      // L'utilisateur peut manuellement actualiser via refreshCacheStats()
      console.log('📊 Cache stats: Actualisation manuelle uniquement pour protéger les crédits API');
    }
  }, [state.isInitialized]); // ✅ RETIRÉ refreshCacheStats des dependencies

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

  // 🛡️ PROTECTION CRÉDIT API - Auto-refresh désactivé par défaut 
  useEffect(() => {
    if (autoRefresh && topic && perplexity.isInitialized) {
      console.warn('⚠️ Auto-refresh activé - Consommation crédits API en cours');
      const interval = setInterval(() => {
        console.log(`🔄 [Auto-refresh] Appel API pour: ${topic}`);
        perplexity.getMarketingTrends(topic, '24h');
      }, 60 * 60 * 1000); // Toutes les heures

      return () => {
        console.log('🛑 Auto-refresh arrêté');
        clearInterval(interval);
      };
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