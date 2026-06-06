// Façade du service IA Kora. Délègue la logique provider/fallback aux
// sous-modules dans `./ai/` afin de garder ce fichier en dessous de 300
// lignes tout en préservant l'API publique consommée par les hooks et
// composants (`aiService`, `AIRequest`, `AIResponse`, `ImageRequest`, ...).

import { logger } from './logger';
import type {
  AIRequest,
  AIResponse,
  AIError,
  ImageRequest,
  ImageResponse,
  AIProviderResult,
} from './ai/types';
import { callOpenAI, generateImageWithOpenAI, testOpenAIConnection } from './ai/openai-client';
import { callAnthropic, testAnthropicConnection } from './ai/anthropic-client';
import { generateDynamicFallback } from './ai/fallback-generator';

export type { AIRequest, AIResponse, AIError, ImageRequest, ImageResponse } from './ai/types';

class AIService {
  private readonly openaiKey: string;
  private readonly anthropicKey: string;
  private readonly timeout: number;
  private readonly retryDelay: number = 1000;

  constructor() {
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    this.timeout = Number.parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000');

    const isOpenAIValid =
      this.openaiKey &&
      this.openaiKey.length > 20 &&
      !this.openaiKey.includes('your-openai-key-here') &&
      !this.openaiKey.includes('sk-proj-your-key-here') &&
      (this.openaiKey.startsWith('sk-') || this.openaiKey.startsWith('sk-proj-'));

    const isAnthropicValid =
      this.anthropicKey &&
      this.anthropicKey.length > 20 &&
      !this.anthropicKey.includes('your-anthropic-key-here') &&
      !this.anthropicKey.includes('sk-ant-your-key-here') &&
      this.anthropicKey.startsWith('sk-ant-');

    if (!isOpenAIValid && !isAnthropicValid) {
      logger.error('🚨 ERREUR CRITIQUE : Aucune clé API valide détectée');
    }
  }

  async generateContent(request: AIRequest): Promise<AIResponse> {
    if (!request.prompt?.trim()) {
      throw new Error('Le prompt ne peut pas être vide');
    }

    if (!['linkedin', 'instagram', 'twitter', 'facebook', 'tiktok'].includes(request.platform)) {
      logger.warn(`⚠️ Plateforme non reconnue: ${request.platform}, utilisation de linkedin`);
      request.platform = 'linkedin';
    }

    if (
      !['post', 'thread', 'story', 'article', 'carousel', 'video'].includes(request.contentType)
    ) {
      logger.warn(`⚠️ Type non reconnu: ${request.contentType}, utilisation de post`);
      request.contentType = 'post';
    }

    const validTones = [
      'Professionnel & stratégique',
      'Innovant & futuriste',
      'Educatif & expert',
      'Inspirant & visionnaire',
      'professionnel',
      'décontracté',
      'inspirant',
      'éducatif',
      'humoristique',
      'urgent',
      'bienveillant',
    ];

    if (!validTones.includes(request.tone)) {
      logger.warn(`⚠️ Ton non reconnu: ${request.tone}, utilisation par défaut`);
      request.tone = 'Professionnel & stratégique';
    }

    const attempts = [
      { provider: 'openai', model: 'gpt-4o', priority: 'primary' },
      { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', priority: 'fallback' },
      { provider: 'openai', model: 'gpt-3.5-turbo', priority: 'emergency' },
    ];

    let lastError: AIError | null = null;

    for (const attempt of attempts) {
      try {
        const response = await this.callAIProvider(request, attempt.provider, attempt.model);

        if (this.validateGeneratedContent(response.content, request)) {
          return {
            ...response,
            success: true,
            timestamp: Date.now(),
            platform: request.platform,
          };
        }
        logger.warn(`⚠️ Contenu généré par ${attempt.provider} ne respecte pas les spécifications`);
      } catch (error) {
        lastError = this.handleError(error, attempt.provider);
        logger.warn(`❌ Échec ${attempt.provider} (${attempt.priority}):`, lastError.message);

        if (attempts.indexOf(attempt) < attempts.length - 1) {
          await this.delay(this.retryDelay);
        }
      }
    }

    logger.warn('🔄 Tous les providers ont échoué, génération de contenu dynamique optimisé');
    return generateDynamicFallback(request);
  }

  private async callAIProvider(
    request: AIRequest,
    provider: string,
    model: string,
  ): Promise<AIProviderResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      if (provider === 'openai') {
        return await callOpenAI(request, this.openaiKey, model, controller.signal);
      }
      if (provider === 'anthropic') {
        return await callAnthropic(request, this.anthropicKey, model, controller.signal);
      }
      throw new Error(`Provider non supporté: ${provider}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private handleError(error: unknown, provider: string): AIError {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';

    if (message.includes('timeout') || message.includes('network') || message.includes('500')) {
      return { message, code: 'RETRYABLE', retryable: true };
    }

    if (message.includes('401') || message.includes('403')) {
      return { message: `Clé API ${provider} invalide`, code: 'AUTH_ERROR', retryable: false };
    }

    if (message.includes('429') || message.includes('quota')) {
      return { message: `Quota ${provider} dépassé`, code: 'QUOTA_ERROR', retryable: true };
    }

    return { message, code: 'UNKNOWN', retryable: false };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async generateImage(request: ImageRequest): Promise<ImageResponse> {
    return generateImageWithOpenAI(request, this.openaiKey, this.timeout);
  }

  async testConnection(): Promise<{ openai: boolean; anthropic: boolean; corsIssue?: boolean }> {
    const [openai, anthropic] = await Promise.all([
      testOpenAIConnection(this.openaiKey),
      testAnthropicConnection(this.anthropicKey),
    ]);
    return { openai, anthropic, corsIssue: false };
  }

  private validateGeneratedContent(content: string, request: AIRequest): boolean {
    if (!content || content.trim().length < 50) return false;

    switch (request.contentType) {
      case 'article':
        if (content.length < 1000) return false;
        break;
      case 'thread':
        if (!content.includes('1/') && !content.includes('1.')) return false;
        break;
      case 'post':
        if (request.platform === 'twitter' && content.length > 280) return false;
        break;
    }

    return true;
  }
}

export const aiService = new AIService();
