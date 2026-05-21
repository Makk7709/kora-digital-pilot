// Types partagés du service IA. Extraits depuis `ai-service.ts` pour permettre
// le découpage en sous-modules (provider clients + fallback) sans cycle d'import.

export interface AIRequest {
  prompt: string;
  platform: string;
  contentType: string;
  tone: string;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  success: boolean;
  timestamp: number;
  platform: string;
}

export interface ImageRequest {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

export interface ImageResponse {
  imageUrl: string;
  revisedPrompt?: string;
  model: string;
  success: boolean;
  timestamp: number;
  size: string;
}

export interface AIError {
  message: string;
  code: string;
  retryable: boolean;
}

export type AIProviderResult = Omit<AIResponse, 'success' | 'timestamp' | 'platform'>;
