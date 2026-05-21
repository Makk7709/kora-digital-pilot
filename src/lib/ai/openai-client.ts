// Client OpenAI (chat + DALL-E). Extrait depuis `ai-service.ts` pour
// permettre de garder le module principal en dessous de 800 lignes.

import { logger } from '../logger';
import type { AIRequest, AIProviderResult, ImageRequest, ImageResponse } from './types';
import { buildSystemPrompt } from './system-prompt';

export function isOpenAIKeyValid(key: string): boolean {
  if (!key || key.length < 20) return false;
  if (key.includes('your-openai-key-here') || key.includes('sk-proj-your-key-here')) {
    return false;
  }
  return key.startsWith('sk-') || key.startsWith('sk-proj-');
}

export async function callOpenAI(
  request: AIRequest,
  apiKey: string,
  model: string,
  signal: AbortSignal,
): Promise<AIProviderResult> {
  if (!isOpenAIKeyValid(apiKey)) {
    throw new Error('Clé API OpenAI manquante ou invalide (placeholder détecté)');
  }

  const systemPrompt = buildSystemPrompt(request);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.prompt },
      ],
      max_tokens: request.maxTokens || 4000,
      temperature: 0.8,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `OpenAI API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`,
    );
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    model: `OpenAI ${model}`,
  };
}

export async function generateImageWithOpenAI(
  request: ImageRequest,
  apiKey: string,
  timeoutMs: number,
): Promise<ImageResponse> {
  if (!isOpenAIKeyValid(apiKey)) {
    throw new Error("Clé API OpenAI manquante ou invalide pour la génération d'images");
  }

  if (!request.prompt?.trim()) {
    throw new Error("Le prompt pour l'image ne peut pas être vide");
  }

  if (request.prompt.length > 1000) {
    throw new Error('Le prompt est trop long (maximum 1000 caractères)');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: request.prompt.trim(),
        size: request.size || '1024x1024',
        quality: request.quality || 'standard',
        style: request.style || 'vivid',
        n: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `OpenAI Images API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`,
      );
    }

    const data = await response.json();
    const imageData = data.data[0];

    if (!imageData?.url) {
      throw new Error("Aucune URL d'image reçue de l'API OpenAI");
    }

    logger.info('✅ Image générée avec succès');

    return {
      imageUrl: imageData.url,
      revisedPrompt: imageData.revised_prompt,
      model: 'DALL-E 3',
      success: true,
      timestamp: Date.now(),
      size: request.size || '1024x1024',
    };
  } catch (error) {
    logger.error("❌ Erreur lors de la génération d'image:", error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error("Timeout lors de la génération d'image");
      }
      throw error;
    }

    throw new Error("Erreur inconnue lors de la génération d'image");
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function testOpenAIConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
