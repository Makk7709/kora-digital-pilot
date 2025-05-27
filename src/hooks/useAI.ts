import { useState, useCallback, useRef } from 'react';
import { aiService, AIRequest, AIResponse, ImageRequest, ImageResponse } from '@/lib/ai-service';

interface UseAIState {
  isGenerating: boolean;
  lastResponse: AIResponse | null;
  error: string | null;
  history: AIResponse[];
  // Nouveaux états pour les images
  isGeneratingImage: boolean;
  lastImageResponse: ImageResponse | null;
  imageError: string | null;
  imageHistory: ImageResponse[];
}

interface UseAIReturn extends UseAIState {
  generateContent: (request: AIRequest) => Promise<AIResponse>;
  generateImage: (request: ImageRequest) => Promise<ImageResponse>;
  clearHistory: () => void;
  clearImageHistory: () => void;
  testConnection: () => Promise<{ openai: boolean; anthropic: boolean }>;
}

export const useAI = (): UseAIReturn => {
  const [state, setState] = useState<UseAIState>({
    isGenerating: false,
    lastResponse: null,
    error: null,
    history: [],
    isGeneratingImage: false,
    lastImageResponse: null,
    imageError: null,
    imageHistory: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateContent = useCallback(async (request: AIRequest): Promise<AIResponse> => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
    }));

    try {
      const response = await aiService.generateContent(request);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        lastResponse: response,
        history: [response, ...prev.history.slice(0, 9)], // Garder les 10 dernières
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, []);

  const generateImage = useCallback(async (request: ImageRequest): Promise<ImageResponse> => {
    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isGeneratingImage: true,
      imageError: null,
    }));

    try {
      const response = await aiService.generateImage(request);
      
      setState(prev => ({
        ...prev,
        isGeneratingImage: false,
        lastImageResponse: response,
        imageHistory: [response, ...prev.imageHistory.slice(0, 9)], // Garder les 10 dernières
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      setState(prev => ({
        ...prev,
        isGeneratingImage: false,
        imageError: errorMessage,
      }));

      throw error;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      history: [],
      lastResponse: null,
      error: null,
    }));
  }, []);

  const clearImageHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      imageHistory: [],
      lastImageResponse: null,
      imageError: null,
    }));
  }, []);

  const testConnection = useCallback(async () => {
    return await aiService.testConnection();
  }, []);

  return {
    ...state,
    generateContent,
    generateImage,
    clearHistory,
    clearImageHistory,
    testConnection,
  };
}; 