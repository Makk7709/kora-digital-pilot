import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock des variables d'environnement pour les tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock pour ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock pour l'API fetch
global.fetch = vi.fn();

// Mock des variables d'environnement
vi.mock('vite', () => ({
  defineConfig: vi.fn(config => config),
}));

// Variables d'environnement par défaut pour les tests
const mockEnv = {
  VITE_PERPLEXITY_API_KEY: 'test-perplexity-key',
  VITE_OPENAI_API_KEY: 'test-openai-key',
  VITE_CHATGPT_API_KEY: 'sk-test-chatgpt-key',
  VITE_CHATGPT_MODEL: 'gpt-4-turbo',
  MODE: 'test',
  DEV: false,
  PROD: false,
};

Object.defineProperty(import.meta, 'env', {
  value: mockEnv,
  writable: true,
}); 