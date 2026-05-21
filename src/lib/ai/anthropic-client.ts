// Client Anthropic (Claude) via proxy backend. Extrait depuis
// `ai-service.ts` pour réduire la taille du module et isoler la logique CORS.

import type { AIRequest, AIProviderResult } from './types';
import { buildSystemPrompt } from './system-prompt';

export function isAnthropicKeyValid(key: string): boolean {
  if (!key || key.length < 20) return false;
  if (key.includes('your-anthropic-key-here') || key.includes('sk-ant-your-key-here')) {
    return false;
  }
  return key.startsWith('sk-ant-');
}

export async function callAnthropic(
  request: AIRequest,
  apiKey: string,
  model: string,
  signal: AbortSignal,
): Promise<AIProviderResult> {
  if (!isAnthropicKeyValid(apiKey)) {
    throw new Error('Clé API Anthropic manquante ou invalide (placeholder détecté)');
  }

  const systemPrompt = buildSystemPrompt(request);

  const response = await fetch('/api/anthropic/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
    body: JSON.stringify({
      model,
      max_tokens: request.maxTokens || 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: request.prompt }],
      temperature: 0.8,
      anthropic_key: apiKey,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      `Anthropic Proxy Error: ${response.status} - ${error.error?.message || error.details || 'Unknown error'}`,
    );
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text || '',
    model: `Claude ${model} (via proxy)`,
  };
}

export async function testAnthropicConnection(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('/api/anthropic/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'test' }],
        anthropic_key: apiKey,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
