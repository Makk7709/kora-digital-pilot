// ✅ UTILISATION DU FETCH NATIF DU NAVIGATEUR
// import fetch, { Response } from 'node-fetch'; // ❌ Retiré car incompatible navigateur

export interface PerplexityConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

// Configuration par défaut
const DEFAULT_CONFIG: Partial<PerplexityConfig> = {
  model: 'llama-3.1-sonar-small-128k-online',
  maxTokens: 1000,
  temperature: 0.2,
};

export interface PerplexityResponse {
  content: string;
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  timestamp: Date;
}

export interface InsightRequest {
  query: string;
  context?: string;
  industry?: 'digital-marketing' | 'ai' | 'productivity' | 'business' | 'tech';
  depth?: 'quick' | 'detailed' | 'comprehensive';
  sources?: string[];
  language?: 'fr' | 'en';
}

export interface MarketInsight {
  trend: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  actionable_insights: string[];
  sources: Array<{
    title: string;
    url: string;
    credibility: number;
  }>;
  confidence_score: number;
  last_updated: Date;
}

class PerplexityService {
  private readonly baseURL = 'https://api.perplexity.ai/chat/completions';
  private readonly cache = new Map<string, { data: PerplexityResponse; timestamp: number }>();
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes
  private config: PerplexityConfig;

  constructor(config: PerplexityConfig) {
    this.config = config;
    console.log('🔧 [PerplexityService] Initialisation:', {
      apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'MANQUANTE',
      model: config.model,
      maxTokens: config.maxTokens
    });
  }

  // Méthode principale pour obtenir des insights métier
  async getBusinessInsights(request: InsightRequest): Promise<PerplexityResponse> {
    const cacheKey = this.generateCacheKey(request);
    
    // Vérifier le cache
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    try {
      const prompt = this.buildBusinessPrompt(request);
      console.log('📡 [PerplexityService] Appel API avec prompt:', prompt.substring(0, 100) + '...');
      
      const response = await this.makeRequest(prompt);
      
      // Mettre en cache
      this.setCachedResponse(cacheKey, response);
      
      return response;
    } catch (error) {
      console.error('❌ [PerplexityService] Erreur Business Insights:', error);
      throw new Error(`Impossible d'obtenir les insights: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  // Insights spécialisés pour le marketing digital
  async getDigitalMarketingTrends(topic: string, timeframe: '24h' | '7d' | '30d' = '7d'): Promise<MarketInsight[]> {
    const request: InsightRequest = {
      query: `Dernières tendances en marketing digital concernant ${topic}`,
      industry: 'digital-marketing',
      depth: 'comprehensive',
      language: 'fr',
      context: `Analyse pour une agence de marketing digital spécialisée en IA. 
                Période d'analyse: ${timeframe}. 
                Focus sur les insights actionnables et les opportunités business.`
    };

    const response = await this.getBusinessInsights(request);
    return this.parseMarketInsights(response);
  }

  // Veille technologique IA
  async getAITechWatch(domain: string): Promise<PerplexityResponse> {
    const request: InsightRequest = {
      query: `Dernières innovations et développements en IA pour ${domain}`,
      industry: 'ai',
      depth: 'detailed',
      language: 'fr',
      context: `Veille technologique pour Kora Digital. 
                Focus sur les technologies émergentes, les nouveaux outils, 
                et les applications pratiques en entreprise.`
    };

    return await this.getBusinessInsights(request);
  }

  // Analyse concurrentielle
  async getCompetitorAnalysis(competitors: string[], market: string): Promise<PerplexityResponse> {
    const competitorList = competitors.join(', ');
    const request: InsightRequest = {
      query: `Analyse concurrentielle récente: ${competitorList} sur le marché ${market}`,
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
      context: `Analyse pour Kora Digital. 
                Identifier les stratégies, innovations, et positionnements récents. 
                Focus sur les opportunités de différenciation.`
    };

    return await this.getBusinessInsights(request);
  }

  // Génération de contenu avec recherche temps réel
  async generateContentWithResearch(topic: string, contentType: 'article' | 'post' | 'thread'): Promise<PerplexityResponse> {
    const request: InsightRequest = {
      query: `Créer un ${contentType} sur ${topic} avec les dernières informations et statistiques`,
      industry: 'digital-marketing',
      depth: 'detailed',
      language: 'fr',
      context: `Génération de contenu pour Kora Digital. 
                Inclure des données récentes, des exemples concrets, 
                et des insights actionnables. Ton professionnel et engageant.`
    };

    return await this.getBusinessInsights(request);
  }

  // Recherche de sources fiables
  async findReliableSources(topic: string, sourceTypes: string[] = []): Promise<PerplexityResponse> {
    const sourceFilter = sourceTypes.length > 0 ? ` depuis ${sourceTypes.join(', ')}` : '';
    const request: InsightRequest = {
      query: `Sources fiables et récentes sur ${topic}${sourceFilter}`,
      depth: 'comprehensive',
      language: 'fr',
      context: `Recherche de sources pour Kora Digital. 
                Privilégier les sources académiques, les rapports d'industrie, 
                et les publications reconnues.`
    };

    return await this.getBusinessInsights(request);
  }

  // Méthodes privées
  private async makeRequest(prompt: string): Promise<PerplexityResponse> {
    console.log('📡 [PerplexityService] Appel API avec prompt:', prompt.substring(0, 100) + '...');
    console.log('🔄 [PerplexityService] makeRequest démarré');

    // ✅ VALIDATIONS INITIALES
    if (!this.config.apiKey) {
      throw new Error('Clé API Perplexity manquante');
    }
    
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt vide ou invalide');
    }

    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };

    const body = {
      model: this.config.model || 'sonar-pro',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: this.config.maxTokens || 4000,
      temperature: this.config.temperature || 0.2,
      stream: false,
    };

    console.log('📡 [PerplexityService] Envoi requête:', {
      url: this.baseURL,
      model: body.model,
      maxTokens: body.max_tokens,
      promptLength: prompt.length
    });

    let response: Response;
    try {
      response = await fetch(this.baseURL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      
      console.log('📊 [PerplexityService] Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
    } catch (error) {
      console.error('❌ [PerplexityService] Erreur fetch:', error);
      throw new Error(`Erreur réseau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: { message: 'Erreur inconnue' } };
      }
      
      console.error('❌ [PerplexityService] Erreur API:', {
        status: response.status,
        error: errorData
      });
      
      throw new Error(`Erreur API Perplexity: ${response.status} - ${errorData.error?.message || 'Erreur inconnue'}`);
    }

    let data;
    try {
      data = await response.json();
      console.log('✅ [PerplexityService] Données parsées:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        hasContent: !!data.choices?.[0]?.message?.content
      });
    } catch (error) {
      console.error('❌ [PerplexityService] Erreur parsing JSON:', error);
      throw new Error('Impossible de parser la réponse JSON');
    }

    // ✅ VALIDATION DES DONNÉES
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse API invalide: structure de données manquante');
    }
    
    // Nettoyer le contenu avant de le retourner
    const cleanedContent = this.cleanPerplexityContent(data.choices[0].message.content);
    
    return {
      content: cleanedContent,
      sources: this.extractSources(cleanedContent),
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      model: data.model || this.config.model || 'sonar-pro',
      timestamp: new Date(),
    };
  }

  private buildBusinessPrompt(request: InsightRequest): string {
    let prompt = `${request.query}`;
    
    if (request.context) {
      prompt += `\n\nContexte: ${request.context}`;
    }

    if (request.industry) {
      prompt += `\n\nSecteur: ${request.industry}`;
    }

    if (request.depth) {
      const depthInstructions = {
        'quick': 'Réponse concise avec les points clés',
        'detailed': 'Analyse détaillée avec exemples et données',
        'comprehensive': 'Analyse complète avec tendances, impacts et recommandations'
      };
      prompt += `\n\nNiveau de détail: ${depthInstructions[request.depth]}`;
    }

    if (request.sources && request.sources.length > 0) {
      prompt += `\n\nSources préférées: ${request.sources.join(', ')}`;
    }

    prompt += `\n\nFormat de réponse:
    1. Résumé exécutif
    2. Points clés avec données récentes
    3. Implications business
    4. Recommandations actionnables
    5. Sources et références`;

    return prompt;
  }

  private extractSources(content: string): Array<{ title: string; url: string; snippet: string }> {
    // Parser intelligent pour extraire les sources du contenu
    const sources: Array<{ title: string; url: string; snippet: string }> = [];
    
    // Regex pour détecter les URLs
    const urlRegex = /https?:\/\/[^\s\)]+/g;
    const urls = content.match(urlRegex) || [];
    
    // Regex pour détecter les références [1], [2], etc.
    const refRegex = /\[(\d+)\][^[]*?([^.!?]*[.!?])/g;
    let match;
    
    while ((match = refRegex.exec(content)) !== null) {
      const refNumber = parseInt(match[1]);
      const snippet = match[2].trim();
      
      if (urls[refNumber - 1]) {
        sources.push({
          title: `Source ${refNumber}`,
          url: urls[refNumber - 1],
          snippet: snippet.substring(0, 200) + '...',
        });
      }
    }

    return sources;
  }

  private parseMarketInsights(response: PerplexityResponse): MarketInsight[] {
    // Parser intelligent pour extraire des insights structurés
    const insights: MarketInsight[] = [];
    const lines = response.content.split('\n').filter(line => line.trim());
    
    let currentInsight: Partial<MarketInsight> = {};
    
    for (const line of lines) {
      if (line.includes('Tendance:') || line.includes('Trend:')) {
        if (currentInsight.trend) {
          insights.push(currentInsight as MarketInsight);
          currentInsight = {};
        }
        currentInsight.trend = line.replace(/Tendance:|Trend:/, '').trim();
      } else if (line.includes('Impact:')) {
        const impact = line.toLowerCase();
        currentInsight.impact = impact.includes('élevé') || impact.includes('high') ? 'high' :
                               impact.includes('moyen') || impact.includes('medium') ? 'medium' : 'low';
      } else if (line.includes('Délai:') || line.includes('Timeframe:')) {
        currentInsight.timeframe = line.replace(/Délai:|Timeframe:/, '').trim();
      }
    }
    
    if (currentInsight.trend) {
      insights.push(currentInsight as MarketInsight);
    }

    // Ajouter des valeurs par défaut si nécessaire
    return insights.map(insight => ({
      ...insight,
      actionable_insights: insight.actionable_insights || [],
      sources: response.sources.map(source => ({
        ...source,
        credibility: 0.8, // Score par défaut
      })),
      confidence_score: 0.85,
      last_updated: new Date(),
    }));
  }

  private generateCacheKey(request: InsightRequest): string {
    return btoa(JSON.stringify({
      query: request.query,
      industry: request.industry,
      depth: request.depth,
      context: request.context?.substring(0, 100), // Limiter pour éviter des clés trop longues
    }));
  }

  private getCachedResponse(key: string): PerplexityResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedResponse(key: string, response: PerplexityResponse): void {
    this.cache.set(key, {
      data: response,
      timestamp: Date.now(),
    });
  }

  // Méthodes utilitaires publiques
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  updateConfig(newConfig: Partial<PerplexityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 🧹 Nettoie le contenu de Perplexity en supprimant les prompts système
   * et autres éléments indésirables qui peuvent apparaître dans la réponse
   */
  private cleanPerplexityContent(content: string): string {
    if (!content) return content;

    // Liste des patterns de prompts système à supprimer
    const systemPromptPatterns = [
      // Prompt Perplexity principal
      /Tu es Perplexity, un assistant de recherche utile formé par Perplexity AI\.[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Instructions système complètes
      /Ta tâche est de rédiger une réponse précise, complète et détaillée[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Instructions de formatage
      /Suis ces instructions pour formuler ta réponse[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Règles de citation
      /Cite les résultats de recherche utilisés directement[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Instructions de formatage markdown
      /Rédige une réponse bien formatée optimisée pour la lisibilité[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Restrictions
      /N'inclus pas d'URL ou de liens dans la réponse[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Types de requêtes spécifiques
      /<query_type_rules>[\s\S]*?<\/query_type_rules>/gi,
      
      // Restrictions générales
      /<restrictions>[\s\S]*?<\/restrictions>/gi,
      
      // Enrichissement contextuel
      /===== ENRICHISSEMENT CONTEXTUEL =====[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Synthèse stratégique
      /SYNTHÈSE STRATÉGIQUE:[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Recommandations opérationnelles
      /RECOMMANDATIONS OPÉRATIONNELLES:[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      
      // Lignes de métadonnées KORA
      /KORA[\s]*$/gm,
      
      // Instructions génériques de début
      /^(Voici une analyse|Voici un rapport|Voici une synthèse)[\s\S]*?(?=\n\n)/gi,
      
      // Références aux instructions
      /selon les instructions fournies|conformément aux directives|comme demandé dans les instructions/gi
    ];

    let cleanedContent = content;

    // Appliquer tous les patterns de nettoyage
    systemPromptPatterns.forEach(pattern => {
      cleanedContent = cleanedContent.replace(pattern, '');
    });

    // Nettoyer les espaces multiples et les sauts de ligne excessifs
    cleanedContent = cleanedContent
      .replace(/\n{3,}/g, '\n\n')  // Réduire les sauts de ligne multiples
      .replace(/\s{3,}/g, ' ')     // Réduire les espaces multiples
      .trim();                     // Supprimer les espaces en début/fin

    // Si le contenu a été trop nettoyé, retourner l'original avec un nettoyage minimal
    if (cleanedContent.length < content.length * 0.3) {
      console.warn('⚠️ [PerplexityService] Nettoyage trop agressif, conservation du contenu original');
      return content
        .replace(/Tu es Perplexity, un assistant de recherche utile formé par Perplexity AI\.[\s\S]*?(?=\n\n)/gi, '')
        .replace(/KORA[\s]*$/gm, '')
        .trim();
    }

    console.log(`🧹 [PerplexityService] Contenu nettoyé: ${content.length} → ${cleanedContent.length} caractères`);
    
    return cleanedContent;
  }
}

// Instance singleton
let perplexityInstance: PerplexityService | null = null;

export const createPerplexityService = (config: PerplexityConfig): PerplexityService => {
  perplexityInstance = new PerplexityService(config);
  return perplexityInstance;
};

export const getPerplexityService = (): PerplexityService => {
  if (!perplexityInstance) {
    throw new Error('Service Perplexity non initialisé. Appelez createPerplexityService() d\'abord.');
  }
  return perplexityInstance;
};

export { PerplexityService }; 