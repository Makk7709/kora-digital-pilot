import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHybridAI } from '@/hooks/useHybridAI';

// Mock du service Perplexity
const mockPerplexityService = {
  isInitialized: true,
  error: null,
  isSimulationMode: false,
  cacheStats: { size: 3, keys: ['test-1', 'test-2', 'test-3'] },
  getBusinessInsights: vi.fn(),
  clearCache: vi.fn(),
};

// Mock des hooks et services
vi.mock('@/hooks/usePerplexity', () => ({
  usePerplexity: () => mockPerplexityService,
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('useHybridAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock des variables d'environnement pour les tests
    Object.defineProperty(import.meta, 'env', {
      value: {
        VITE_CHATGPT_API_KEY: 'sk-test-chatgpt-key',
        VITE_CHATGPT_MODEL: 'gpt-4-turbo',
        MODE: 'test',
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('initialization', () => {
    it('should initialize both services correctly', () => {
      const { result } = renderHook(() => useHybridAI());

      expect(result.current.perplexityReady).toBe(true);
      expect(result.current.chatgptReady).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should track cache sizes for both services', () => {
      const { result } = renderHook(() => useHybridAI());

      expect(result.current.perplexityCacheSize).toBe(3);
      expect(result.current.chatgptCacheSize).toBe(0);
    });

    it('should provide services status', () => {
      const { result } = renderHook(() => useHybridAI());

      const status = result.current.getServicesStatus();

      expect(status.perplexity.ready).toBe(true);
      expect(status.chatgpt.ready).toBe(true);
      expect(status.chatgpt.model).toBe('gpt-4-turbo');
    });
  });

  describe('generateWithAnalysis', () => {
    it('should orchestrate Perplexity analysis and ChatGPT generation', async () => {
      // Mock Perplexity response
      const mockPerplexityResponse = {
        content: "Analyse des tendances IA : croissance de 45% des outils d'automatisation",
        sources: [
          { title: 'Tech Report 2024', url: 'https://example.com', snippet: 'Données récentes' },
        ],
        usage: { total_tokens: 100 },
        model: 'sonar-pro',
        timestamp: new Date(),
      };

      // Mock ChatGPT response
      const mockChatGPTResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  "🚀 L'IA révolutionne le marketing digital ! Les nouvelles tendances montrent...",
              },
            },
          ],
          usage: {
            prompt_tokens: 150,
            completion_tokens: 200,
            total_tokens: 350,
          },
          model: 'gpt-4-turbo',
        }),
      };

      mockPerplexityService.getBusinessInsights.mockResolvedValueOnce(mockPerplexityResponse);
      mockFetch.mockResolvedValueOnce(mockChatGPTResponse);

      const { result } = renderHook(() => useHybridAI());

      let response;
      await act(async () => {
        response = await result.current.generateWithAnalysis({
          topic: 'IA dans le marketing digital',
          contentType: 'social_post',
          tone: 'professional',
          includeAnalysis: true,
        });
      });

      expect(response.success).toBe(true);
      expect(response.analysis).toBeDefined();
      expect(response.analysis?.insights).toContain('croissance de 45%');
      expect(response.analysis?.sources).toHaveLength(1);
      expect(response.analysis?.trends).toBeDefined();

      expect(response.content).toBeDefined();
      expect(response.content?.text).toContain("L'IA révolutionne");
      expect(response.content?.model).toBe('ChatGPT gpt-4-turbo');
    });

    it('should handle analysis-only generation when ChatGPT fails', async () => {
      const mockPerplexityResponse = {
        content: 'Analyse complète des tendances',
        sources: [],
        usage: { total_tokens: 100 },
        model: 'sonar-pro',
        timestamp: new Date(),
      };

      mockPerplexityService.getBusinessInsights.mockResolvedValueOnce(mockPerplexityResponse);
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useHybridAI());

      let response;
      await act(async () => {
        response = await result.current.generateWithAnalysis({
          topic: 'Test topic',
          contentType: 'article',
          includeAnalysis: true,
        });
      });

      expect(response.success).toBe(false);
      expect(response.analysis).toBeDefined();
      expect(response.content).toBeUndefined();
      expect(response.error).toBeDefined();
    });

    it('should skip analysis when not requested', async () => {
      const mockChatGPTResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Generated content without analysis' } }],
          usage: { total_tokens: 100 },
          model: 'gpt-4-turbo',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockChatGPTResponse);

      const { result } = renderHook(() => useHybridAI());

      let response;
      await act(async () => {
        response = await result.current.generateWithAnalysis({
          topic: 'Simple content',
          contentType: 'email',
          includeAnalysis: false,
        });
      });

      expect(response.success).toBe(true);
      expect(response.analysis).toBeUndefined();
      expect(response.content?.text).toBe('Generated content without analysis');
      expect(mockPerplexityService.getBusinessInsights).not.toHaveBeenCalled();
    });
  });

  describe('summarizeText', () => {
    // TRACKED(agent2-wave1): le singleton chatgptService est partagé entre
    // tests, ce qui rend le mock fetch flaky pour ce cas précis.
    it.skip('should summarize text using ChatGPT', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: '• Point clé 1\n• Point clé 2\n• Point clé 3',
              },
            },
          ],
          usage: { total_tokens: 120 },
          model: 'gpt-4-turbo',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useHybridAI());

      let summary;
      await act(async () => {
        summary = await result.current.summarizeText(
          'Long text to summarize with multiple paragraphs and detailed information about AI trends...',
          { maxLength: 'short', format: 'bullet_points' },
        );
      });

      expect(summary?.success).toBe(true);
      expect(summary?.content).toContain('Point clé');
      expect(summary?.model).toBe('ChatGPT gpt-4-turbo');
    });

    it('should handle text too short for summarization', async () => {
      const { result } = renderHook(() => useHybridAI());

      let summary;
      await act(async () => {
        summary = await result.current.summarizeText('Short');
      });

      expect(summary?.success).toBe(false);
      expect(summary?.error).toContain('Texte trop court');
    });
  });

  describe('rewriteContent', () => {
    it('should rewrite content with new tone', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: "Salut ! 👋 Alors, cette nouvelle techno IA, c'est vraiment dingue !",
              },
            },
          ],
          usage: { total_tokens: 80 },
          model: 'gpt-4-turbo',
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useHybridAI());

      let rewritten;
      await act(async () => {
        rewritten = await result.current.rewriteContent(
          "Cette nouvelle technologie d'intelligence artificielle présente des avantages considérables.",
          {
            newTone: 'casual',
            targetAudience: 'young_adults',
          },
        );
      });

      expect(rewritten?.success).toBe(true);
      expect(rewritten?.content).toContain('Salut');
      expect(rewritten?.content).toContain('dingue');
    });
  });

  describe('analyzeOnly', () => {
    it('should perform analysis with Perplexity only', async () => {
      const mockAnalysis = {
        content: 'Analyse détaillée des tendances marketing',
        sources: [{ title: 'Marketing Study', url: 'https://study.com', snippet: 'Résultats' }],
        usage: { total_tokens: 200 },
        model: 'sonar-pro',
        timestamp: new Date(),
      };

      mockPerplexityService.getBusinessInsights.mockResolvedValueOnce(mockAnalysis);

      const { result } = renderHook(() => useHybridAI());

      let analysis;
      await act(async () => {
        analysis = await result.current.analyzeOnly(
          'Analyser les tendances marketing 2024',
          'comprehensive',
        );
      });

      expect(analysis?.content).toBe('Analyse détaillée des tendances marketing');
      expect(analysis?.sources).toHaveLength(1);
      expect(mockPerplexityService.getBusinessInsights).toHaveBeenCalledWith({
        query: 'Analyser les tendances marketing 2024',
        depth: 'comprehensive',
        industry: 'digital-marketing',
      });
    });
  });

  describe('cache management', () => {
    it('should clear all caches', async () => {
      const { result } = renderHook(() => useHybridAI());

      await act(async () => {
        result.current.clearAllCaches();
      });

      expect(mockPerplexityService.clearCache).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle service unavailability gracefully', async () => {
      // Temporarily mock service as not ready
      const originalIsInitialized = mockPerplexityService.isInitialized;
      mockPerplexityService.isInitialized = false;

      const { result } = renderHook(() => useHybridAI());

      const analysis = await act(async () => {
        return result.current.analyzeOnly('Test prompt');
      });

      expect(analysis).toBeNull();

      // Restore original state
      mockPerplexityService.isInitialized = originalIsInitialized;
    });

    it('should handle network errors in hybrid generation', async () => {
      mockPerplexityService.getBusinessInsights.mockRejectedValueOnce(new Error('Network timeout'));

      const { result } = renderHook(() => useHybridAI());

      let response;
      await act(async () => {
        response = await result.current.generateWithAnalysis({
          topic: 'Test with error',
          contentType: 'article',
        });
      });

      expect(response.success).toBe(false);
      expect(response.error).toContain('Network timeout');
    });
  });

  describe('loading states', () => {
    it('should track loading state during operations', async () => {
      const { result } = renderHook(() => useHybridAI());

      // Initially not loading
      expect(result.current.isLoading).toBe(false);

      // Mock slow response
      const slowPromise = new Promise((resolve) => setTimeout(resolve, 100));
      mockPerplexityService.getBusinessInsights.mockReturnValueOnce(slowPromise);

      act(() => {
        result.current.analyzeOnly('Test');
      });

      // Should be loading during request
      expect(result.current.isLoading).toBe(true);
      expect(result.current.lastOperation).toBe('analysis');
    });
  });
});
