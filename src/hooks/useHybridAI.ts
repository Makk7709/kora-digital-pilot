// ========================================
// 🚀 HOOK HYBRIDE IA - ORCHESTRATEUR
// ========================================
// Perplexity : Analyse & Insights
// ChatGPT : Rédaction & Résumés

import { useState, useCallback, useEffect } from 'react';
import { usePerplexity } from './usePerplexity';
import { ChatGPTService, type ChatGPTConfig, type ChatGPTResponse } from '@/lib/chatgpt-service';

export interface HybridAIState {
  perplexityReady: boolean;
  chatgptReady: boolean;
  isLoading: boolean;
  lastOperation?: 'analysis' | 'generation' | 'summary' | 'rewrite';
  error?: string;
  
  // Cache states
  perplexityCacheSize: number;
  chatgptCacheSize: number;
}

export interface AnalysisWithContentRequest {
  topic: string;
  contentType: 'social_post' | 'article' | 'email' | 'blog_post' | 'thread';
  tone?: 'professional' | 'friendly' | 'casual' | 'formal' | 'humorous';
  targetAudience?: 'professionals' | 'general' | 'young_adults' | 'experts';
  includeAnalysis?: boolean;
}

export interface HybridResponse {
  success: boolean;
  
  // Perplexity part (analysis)
  analysis?: {
    insights: string;
    sources: Array<{
      title: string;
      url: string;
      snippet: string;
    }>;
    trends: string[];
  };
  
  // ChatGPT part (content)
  content?: {
    text: string;
    model: string;
    usage?: any;
  };
  
  fromCache?: boolean;
  error?: string;
  timestamp: Date;
}

let chatgptService: ChatGPTService | null = null;

export const useHybridAI = () => {
  const [state, setState] = useState<HybridAIState>({
    perplexityReady: false,
    chatgptReady: false,
    isLoading: false,
    perplexityCacheSize: 0,
    chatgptCacheSize: 0,
  });

  const perplexity = usePerplexity();

  // ========================================
  // 🔧 INITIALISATION
  // ========================================

  useEffect(() => {
    initializeChatGPT();
    updateState();
  }, [perplexity.isInitialized]);

  const initializeChatGPT = useCallback(() => {
    const apiKey = import.meta.env.VITE_CHATGPT_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!chatgptService && apiKey) {
      const config: ChatGPTConfig = {
        apiKey,
        model: import.meta.env.VITE_CHATGPT_MODEL || 'gpt-4-turbo',
        maxTokens: 2000,
        temperature: 0.7,
      };

      chatgptService = new ChatGPTService(config);
      
      if (chatgptService.isConfigured()) {
        console.log('🔧 ChatGPT initialisé en mode API');
      }
    }
    
    updateState();
  }, []);

  const updateState = useCallback(() => {
    setState(prev => ({
      ...prev,
      perplexityReady: perplexity.isInitialized && !perplexity.error,
      chatgptReady: chatgptService?.isConfigured() || false,
      perplexityCacheSize: perplexity.cacheStats?.size || 0,
      chatgptCacheSize: chatgptService?.getCacheStats().size || 0,
    }));
  }, [perplexity.isInitialized, perplexity.error, perplexity.cacheStats?.size]);

  // ========================================
  // 🎯 MÉTHODES PRINCIPALES
  // ========================================

  /**
   * Génération complète : Analyse (Perplexity) + Contenu (ChatGPT)
   */
  const generateWithAnalysis = useCallback(async (
    request: AnalysisWithContentRequest
  ): Promise<HybridResponse> => {
    setState(prev => ({ ...prev, isLoading: true, lastOperation: 'generation', error: undefined }));

    try {
      const response: HybridResponse = {
        success: true,
        timestamp: new Date()
      };

      // Phase 1: Analyse avec Perplexity (si demandée)
      if (request.includeAnalysis !== false && state.perplexityReady) {
        const analysisPrompt = `Analyse les tendances actuelles et insights sur : ${request.topic}`;
        const perplexityResult = await perplexity.getBusinessInsights({
          query: analysisPrompt,
          industry: 'digital-marketing',
          depth: 'detailed'
        });
        
        if (perplexityResult && perplexityResult.content) {
          response.analysis = {
            insights: perplexityResult.content,
            sources: perplexityResult.sources || [],
            trends: extractTrends(perplexityResult.content)
          };
        }
      }

      // Phase 2: Génération de contenu avec ChatGPT
      if (state.chatgptReady && chatgptService) {
        const contentPrompt = buildContentPrompt(request, response.analysis);
        
        const chatgptResult = await chatgptService.generateContent({
          prompt: contentPrompt,
          type: request.contentType,
          tone: request.tone,
          targetAudience: request.targetAudience
        });

        if (chatgptResult.success) {
          response.content = {
            text: chatgptResult.content,
            model: chatgptResult.model,
            usage: chatgptResult.usage
          };
          response.fromCache = chatgptResult.fromCache;
        } else {
          response.success = false;
          response.error = chatgptResult.error;
        }
      } else {
        response.success = false;
        response.error = 'Service ChatGPT non disponible';
      }

      updateState();
      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      updateState();
      
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.perplexityReady, state.chatgptReady, perplexity, updateState]);

  /**
   * Résumé intelligent avec ChatGPT
   */
  const summarizeText = useCallback(async (
    text: string,
    options: {
      maxLength?: 'short' | 'medium' | 'long';
      format?: 'paragraph' | 'bullet_points' | 'key_points';
    } = {}
  ): Promise<ChatGPTResponse | null> => {
    if (!state.chatgptReady || !chatgptService) {
      console.warn('⚠️ ChatGPT non configuré pour résumé');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, lastOperation: 'summary' }));

    try {
      const result = await chatgptService.summarizeText({
        text,
        maxLength: options.maxLength || 'medium',
        format: options.format || 'paragraph'
      });

      updateState();
      return result;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.chatgptReady, updateState]);

  /**
   * Réécriture avec ChatGPT
   */
  const rewriteContent = useCallback(async (
    originalContent: string,
    options: {
      newTone: 'professional' | 'friendly' | 'casual' | 'formal' | 'humorous';
      targetAudience?: 'professionals' | 'general' | 'young_adults' | 'experts';
    }
  ): Promise<ChatGPTResponse | null> => {
    if (!state.chatgptReady || !chatgptService) {
      console.warn('⚠️ ChatGPT non configuré pour réécriture');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, lastOperation: 'rewrite' }));

    try {
      const result = await chatgptService.rewriteContent({
        originalContent,
        newTone: options.newTone,
        targetAudience: options.targetAudience
      });

      updateState();
      return result;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.chatgptReady, updateState]);

  /**
   * Analyse seule avec Perplexity
   */
  const analyzeOnly = useCallback(async (
    prompt: string,
    level: 'quick' | 'detailed' | 'comprehensive' = 'detailed'
  ) => {
    if (!state.perplexityReady) {
      console.warn('⚠️ Perplexity non configuré pour analyse');
      return null;
    }

    setState(prev => ({ ...prev, isLoading: true, lastOperation: 'analysis' }));

    try {
      const result = await perplexity.getBusinessInsights({
        query: prompt,
        depth: level,
        industry: 'digital-marketing'
      });
      updateState();
      return result;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.perplexityReady, perplexity, updateState]);

  // ========================================
  // 🧹 GESTION DU CACHE
  // ========================================

  const clearAllCaches = useCallback(() => {
    perplexity.clearCache?.();
    chatgptService?.clearCache();
    updateState();
    
    console.log('🧹 Caches IA nettoyés');
  }, [perplexity, updateState]);

  const getServicesStatus = useCallback(() => {
    return {
      perplexity: {
        ready: state.perplexityReady,
        simulationMode: perplexity.isSimulationMode,
        cacheSize: state.perplexityCacheSize
      },
      chatgpt: {
        ready: state.chatgptReady,
        model: chatgptService?.getModel() || 'Non configuré',
        cacheSize: state.chatgptCacheSize
      }
    };
  }, [state, perplexity.isSimulationMode]);

  return {
    // État
    ...state,
    
    // Méthodes principales
    generateWithAnalysis,
    summarizeText,
    rewriteContent,
    analyzeOnly,
    
    // Utilitaires
    clearAllCaches,
    getServicesStatus,
    
    // Services individuels (pour usage avancé)
    perplexityService: perplexity,
    chatgptService,
  };
};

// ========================================
// 🔧 FONCTIONS UTILITAIRES
// ========================================

function buildContentPrompt(request: AnalysisWithContentRequest, analysis?: any): string {
  let prompt = `Crée un ${request.contentType} sur le sujet : ${request.topic}`;
  
  if (analysis?.insights) {
    prompt += `\n\nUtilise ces insights pour enrichir le contenu :\n${analysis.insights}`;
  }
  
  if (analysis?.trends?.length > 0) {
    prompt += `\n\nTendances à intégrer : ${analysis.trends.join(', ')}`;
  }
  
  return prompt;
}

function extractTrends(content: string): string[] {
  // Simple extraction de tendances basée sur des mots-clés
  const trendKeywords = [
    'tendance', 'innovation', 'émergent', 'croissance', 'populaire',
    'nouveau', 'récent', 'évolution', 'développement', 'avenir'
  ];
  
  const trends: string[] = [];
  const sentences = content.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    if (trendKeywords.some(keyword => lowerSentence.includes(keyword))) {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 100) {
        trends.push(trimmed);
      }
    }
  });
  
  return trends.slice(0, 3); // Limite à 3 tendances
} 