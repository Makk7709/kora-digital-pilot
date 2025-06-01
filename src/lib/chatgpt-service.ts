// ========================================
// 🤖 SERVICE CHATGPT 4.1 - RÉDACTION & RÉSUMÉ
// ========================================
// Rôle : Génération de contenu et résumés
// Complémentaire à Perplexity (analyse)

export interface ChatGPTConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface ContentGenerationRequest {
  prompt: string;
  type: 'social_post' | 'article' | 'email' | 'blog_post' | 'thread';
  tone?: 'professional' | 'friendly' | 'casual' | 'formal' | 'humorous';
  targetAudience?: 'professionals' | 'general' | 'young_adults' | 'experts';
  maxTokens?: number;
  language?: 'fr' | 'en';
}

export interface SummarizationRequest {
  text: string;
  maxLength: 'short' | 'medium' | 'long';
  format?: 'paragraph' | 'bullet_points' | 'key_points';
  language?: 'fr' | 'en';
}

export interface RewriteRequest {
  originalContent: string;
  newTone: 'professional' | 'friendly' | 'casual' | 'formal' | 'humorous';
  targetAudience?: 'professionals' | 'general' | 'young_adults' | 'experts';
  language?: 'fr' | 'en';
}

export interface ChatGPTResponse {
  success: boolean;
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  fromCache?: boolean;
  timestamp: Date;
  error?: string;
}

interface CacheEntry {
  response: ChatGPTResponse;
  timestamp: number;
}

export class ChatGPTService {
  private readonly baseURL = 'https://api.openai.com/v1/chat/completions';
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes
  private config: ChatGPTConfig;

  constructor(config: ChatGPTConfig) {
    this.config = {
      model: 'gpt-4-turbo',
      maxTokens: 2000,
      temperature: 0.7,
      timeout: 30000,
      ...config
    };
  }

  // ========================================
  // 🔧 CONFIGURATION & VALIDATION
  // ========================================

  public isConfigured(): boolean {
    const apiKey = this.config.apiKey;
    if (!apiKey || apiKey.length < 10) return false;
    
    // En environnement de test, accepter les clés de test
    if (import.meta.env.MODE === 'test' || import.meta.env.NODE_ENV === 'test') {
      return apiKey.startsWith('sk-test-') || apiKey.startsWith('sk-');
    }
    
    // En production, validation stricte
    if (!apiKey.startsWith('sk-')) return false;
    if (apiKey.length < 20) return false;
    if (apiKey.includes('test-key') || apiKey.includes('your-key')) return false;
    return true;
  }

  public getModel(): string {
    return this.config.model || 'gpt-4-turbo';
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  public clearCache(): void {
    this.cache.clear();
  }

  // ========================================
  // 🎯 GÉNÉRATION DE CONTENU PRINCIPAL
  // ========================================

  public async generateContent(
    request: ContentGenerationRequest,
    signal?: AbortSignal
  ): Promise<ChatGPTResponse> {
    try {
      // Validation
      if (!this.isConfigured()) {
        return this.createErrorResponse('Service ChatGPT non configuré correctement');
      }

      // Cache check
      const cacheKey = this.generateCacheKey('content', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, fromCache: true };
      }

      // Build system prompt
      const systemPrompt = this.buildContentSystemPrompt(request);
      
      // API Call
      const response = await this.makeAPICall({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || this.config.maxTokens,
        temperature: this.config.temperature,
      }, signal);

      // Cache and return
      this.setCache(cacheKey, response);
      return response;

    } catch (error) {
      return this.handleError(error);
    }
  }

  // ========================================
  // 📝 RÉSUMÉS DE TEXTE
  // ========================================

  public async summarizeText(
    request: SummarizationRequest,
    signal?: AbortSignal
  ): Promise<ChatGPTResponse> {
    try {
      // Validation de la longueur
      if (request.text.length < 100) {
        return this.createErrorResponse('Texte trop court pour un résumé (minimum 100 caractères)');
      }

      if (!this.isConfigured()) {
        return this.createErrorResponse('Service ChatGPT non configuré correctement');
      }

      // Cache check
      const cacheKey = this.generateCacheKey('summary', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, fromCache: true };
      }

      // Build system prompt
      const systemPrompt = this.buildSummarySystemPrompt(request);
      
      // API Call
      const response = await this.makeAPICall({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Texte à résumer :\n\n${request.text}` }
        ],
        max_tokens: this.getMaxTokensForSummary(request.maxLength),
        temperature: 0.3, // Plus déterministe pour les résumés
      }, signal);

      // Cache and return
      this.setCache(cacheKey, response);
      return response;

    } catch (error) {
      return this.handleError(error);
    }
  }

  // ========================================
  // ✏️ RÉÉCRITURE DE CONTENU
  // ========================================

  public async rewriteContent(
    request: RewriteRequest,
    signal?: AbortSignal
  ): Promise<ChatGPTResponse> {
    try {
      if (!this.isConfigured()) {
        return this.createErrorResponse('Service ChatGPT non configuré correctement');
      }

      // Cache check
      const cacheKey = this.generateCacheKey('rewrite', request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { ...cached, fromCache: true };
      }

      // Build system prompt
      const systemPrompt = this.buildRewriteSystemPrompt(request);
      
      // API Call
      const response = await this.makeAPICall({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Contenu à réécrire :\n\n${request.originalContent}` }
        ],
        max_tokens: Math.max(request.originalContent.length * 1.5, 500),
        temperature: 0.7,
      }, signal);

      // Cache and return
      this.setCache(cacheKey, response);
      return response;

    } catch (error) {
      return this.handleError(error);
    }
  }

  // ========================================
  // 🔧 MÉTHODES PRIVÉES
  // ========================================

  private async makeAPICall(
    requestBody: any,
    signal?: AbortSignal
  ): Promise<ChatGPTResponse> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        ...requestBody,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ChatGPT API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      model: `ChatGPT ${data.model}`,
      usage: data.usage,
      timestamp: new Date(),
    };
  }

  private buildContentSystemPrompt(request: ContentGenerationRequest): string {
    const language = request.language || 'fr';
    const tone = request.tone || 'professional';
    const audience = request.targetAudience || 'professionals';

    const prompts = {
      fr: {
        social_post: `Tu es un expert en rédaction de contenu social media. Crée du contenu ${tone} pour ${audience}. Le contenu doit être engageant, authentique et adapté aux réseaux sociaux.`,
        article: `Tu es un rédacteur expert. Écris un article ${tone} de qualité pour ${audience}. Structure claire, informations précises, style fluide.`,
        email: `Tu es un expert en rédaction d'emails. Crée un email ${tone} pour ${audience}. Objet clair, contenu concis, appel à l'action efficace.`,
        blog_post: `Tu es un rédacteur de blog expérimenté. Écris un article ${tone} pour ${audience}. SEO-friendly, informatif, engageant.`,
        thread: `Tu es un expert en threads Twitter/X. Crée un thread ${tone} pour ${audience}. Format: numérotation, contenu découpé, engagement maximal.`
      }
    };

    return prompts[language]?.[request.type] || prompts.fr[request.type];
  }

  private buildSummarySystemPrompt(request: SummarizationRequest): string {
    const language = request.language || 'fr';
    const format = request.format || 'paragraph';
    const length = request.maxLength;

    const instructions = {
      fr: {
        paragraph: `Tu es un expert en résumé. Crée un résumé ${length} en format paragraphe. Préserve les idées clés.`,
        bullet_points: `Tu es un expert en résumé. Crée un résumé ${length} en points clés. Format bullet points lisible.`,
        key_points: `Tu es un expert en résumé. Extrais les points essentiels. Format: points clés numérotés.`
      }
    };

    return instructions[language]?.[format] || instructions.fr.paragraph;
  }

  private buildRewriteSystemPrompt(request: RewriteRequest): string {
    const language = request.language || 'fr';
    const tone = request.newTone;
    const audience = request.targetAudience || 'professionals';

    return `Tu es un expert en réécriture. Réécris le contenu avec un ton ${tone} pour ${audience}. Garde le sens mais adapte le style, la forme et le vocabulaire.`;
  }

  private getMaxTokensForSummary(length: string): number {
    const limits = {
      short: 150,
      medium: 300,
      long: 600
    };
    return limits[length as keyof typeof limits] || 300;
  }

  private generateCacheKey(type: string, request: any): string {
    return `${type}_${JSON.stringify(request)}`;
  }

  private getFromCache(key: string): ChatGPTResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check expiration
    if (Date.now() - entry.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return entry.response;
  }

  private setCache(key: string, response: ChatGPTResponse): void {
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  private createErrorResponse(error: string): ChatGPTResponse {
    return {
      success: false,
      content: '',
      model: `ChatGPT ${this.config.model}`,
      error,
      timestamp: new Date()
    };
  }

  private handleError(error: any): ChatGPTResponse {
    let errorMessage = 'Erreur inconnue';
    
    if (error.name === 'AbortError') {
      errorMessage = 'Requête interrompue (aborted)';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return this.createErrorResponse(errorMessage);
  }
} 