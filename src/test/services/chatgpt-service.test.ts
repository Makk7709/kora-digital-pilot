import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ChatGPTService } from '@/lib/chatgpt-service'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ChatGPTService', () => {
  let service: ChatGPTService
  
  beforeEach(() => {
    vi.resetAllMocks()
    service = new ChatGPTService({
      apiKey: 'sk-test-key',
      model: 'gpt-4-turbo',
      maxTokens: 2000,
      temperature: 0.7
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(service).toBeDefined()
      expect(service.getModel()).toBe('gpt-4-turbo')
      expect(service.isConfigured()).toBe(true)
    })

    it('should detect invalid API key', () => {
      const invalidService = new ChatGPTService({
        apiKey: 'invalid-key',
        model: 'gpt-4-turbo'
      })
      expect(invalidService.isConfigured()).toBe(false)
    })

    it('should handle missing API key', () => {
      const emptyService = new ChatGPTService({
        apiKey: '',
        model: 'gpt-4-turbo'
      })
      expect(emptyService.isConfigured()).toBe(false)
    })
  })

  describe('content generation', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'Generated content for social media post'
            }
          }],
          usage: {
            prompt_tokens: 50,
            completion_tokens: 25,
            total_tokens: 75
          },
          model: 'gpt-4-turbo'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await service.generateContent({
        prompt: 'Create a social media post about AI',
        type: 'social_post',
        tone: 'professional',
        maxTokens: 1000
      })

      expect(result.success).toBe(true)
      expect(result.content).toBe('Generated content for social media post')
      expect(result.model).toBe('ChatGPT gpt-4-turbo')
      expect(result.usage?.total_tokens).toBe(75)
    })

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({
          error: { message: 'Invalid API key' }
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await service.generateContent({
        prompt: 'Test prompt',
        type: 'social_post'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid API key')
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.generateContent({
        prompt: 'Test prompt',
        type: 'social_post'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })
  })

  describe('text summarization', () => {
    it('should summarize text successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'Résumé du texte avec les points clés'
            }
          }],
          usage: {
            prompt_tokens: 200,
            completion_tokens: 50,
            total_tokens: 250
          },
          model: 'gpt-4-turbo'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await service.summarizeText({
        text: 'Long text to summarize with multiple paragraphs and detailed information about AI trends in marketing and business automation. This text contains more than 100 characters and should be suitable for summarization.',
        maxLength: 'medium',
        format: 'bullet_points'
      })

      expect(result.success).toBe(true)
      expect(result.content).toBe('Résumé du texte avec les points clés')
      expect(result.model).toBe('ChatGPT gpt-4-turbo')
    })

    it('should validate text length for summarization', async () => {
      const result = await service.summarizeText({
        text: 'Short text',
        maxLength: 'short'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Texte trop court')
    })
  })

  describe('content rewriting', () => {
    it('should rewrite content successfully', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'Contenu réécrit avec le nouveau ton'
            }
          }],
          usage: {
            prompt_tokens: 100,
            completion_tokens: 80,
            total_tokens: 180
          },
          model: 'gpt-4-turbo'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await service.rewriteContent({
        originalContent: 'Original content',
        newTone: 'friendly',
        targetAudience: 'young_adults'
      })

      expect(result.success).toBe(true)
      expect(result.content).toBe('Contenu réécrit avec le nouveau ton')
    })
  })

  describe('caching', () => {
    it('should cache responses for identical requests', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Cached response' } }],
          usage: { total_tokens: 50 },
          model: 'gpt-4-turbo'
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const request = { prompt: 'Same prompt', type: 'social_post' as const }
      
      // First call
      const result1 = await service.generateContent(request)
      expect(result1.content).toBe('Cached response')
      
      // Second call should use cache
      const result2 = await service.generateContent(request)
      expect(result2.content).toBe('Cached response')
      expect(result2.fromCache).toBe(true)
      
      // Should only have made one API call
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('should clear cache', () => {
      service.clearCache()
      expect(service.getCacheStats().size).toBe(0)
    })
  })

  describe('rate limiting', () => {
    it('should handle rate limiting', async () => {
      const mockResponse = {
        ok: false,
        status: 429,
        json: async () => ({
          error: { message: 'Rate limit exceeded' }
        })
      }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await service.generateContent({
        prompt: 'Test prompt',
        type: 'social_post'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Rate limit exceeded')
    })
  })

  describe('abortable requests', () => {
    it('should support request cancellation', async () => {
      const controller = new AbortController()
      
      // Mock fetch to simulate abort
      mockFetch.mockImplementationOnce(() => 
        Promise.reject(Object.assign(new Error('This operation was aborted'), { name: 'AbortError' }))
      )

      // Start request and abort immediately
      const requestPromise = service.generateContent({
        prompt: 'Test prompt',
        type: 'social_post'
      }, controller.signal)
      
      controller.abort()
      
      const result = await requestPromise
      expect(result.success).toBe(false)
      expect(result.error).toContain('aborted')
    })
  })
}) 