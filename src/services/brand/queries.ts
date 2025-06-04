// Brand Analysis Query Templates
// Extracted from monolithic BrandAnalysisService.ts for better organization

export const BRAND_ANALYSIS_QUERIES = {
  mentions: (brandName: string) => 
    `Trouve toutes les mentions récentes de "${brandName}" sur réseaux sociaux, presse, forums. Inclus sentiment et source.`,
  
  sentiment: (brandName: string) => 
    `Analyse le sentiment global pour "${brandName}" basé sur mentions récentes. Retourne pourcentages positif/neutre/négatif.`,
  
  competitors: (brandName: string) => 
    `Identifie les 5 principaux concurrents de "${brandName}" avec leur positionnement et parts de voix.`,
  
  keywords: (brandName: string) => 
    `Extrais les mots-clés les plus associés à "${brandName}" dans les conversations en ligne.`,
  
  swot: (brandName: string) => 
    `Génère une analyse SWOT complète pour "${brandName}" basée sur données marché actuelles.`,
  
  alerts: (brandName: string) => 
    `Identifie les alertes critiques ou signaux faibles concernant "${brandName}".`
};

// Query configuration and context
export interface QueryConfig {
  timeout?: number;
  retryAttempts?: number;
  context?: string;
}

export const DEFAULT_QUERY_CONFIGS: Record<string, QueryConfig> = {
  mentions: {
    timeout: 10000,
    retryAttempts: 3,
    context: 'brand analysis'
  },
  sentiment: {
    timeout: 8000,
    retryAttempts: 2,
    context: 'sentiment analysis'
  },
  competitors: {
    timeout: 12000,
    retryAttempts: 3,
    context: 'competitive analysis'
  },
  keywords: {
    timeout: 8000,
    retryAttempts: 2,
    context: 'keyword analysis'
  },
  swot: {
    timeout: 10000,
    retryAttempts: 2,
    context: 'SWOT analysis'
  },
  alerts: {
    timeout: 8000,
    retryAttempts: 2,
    context: 'alert analysis'
  }
};

// Helper to get query with configuration
export function getQueryWithConfig(type: keyof typeof BRAND_ANALYSIS_QUERIES, brandName: string) {
  return {
    query: BRAND_ANALYSIS_QUERIES[type](brandName),
    config: DEFAULT_QUERY_CONFIGS[type] || {}
  };
} 