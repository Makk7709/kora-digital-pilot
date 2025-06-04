/**
 * 🧪 SETUP TESTS PRODUCTION - KORA PRISM
 * Configuration globale pour tests avec données réelles Perplexity
 */

import '@testing-library/jest-dom'
import { vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest'

// Configuration globale des tests
beforeAll(() => {
  console.log('🚀 DÉMARRAGE SUITE TESTS PRODUCTION - PRISM & PERPLEXITY');
  console.log('📊 Mode: Production-ready, données réelles uniquement');
  
  // Validation environment variables obligatoires
  const requiredEnvVars = [
    'VITE_PERPLEXITY_API_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => {
    const value = process.env[varName] || import.meta.env[varName];
    return !value || value.includes('your_') || value.includes('demo');
  });
  
  if (missingVars.length > 0) {
    throw new Error(`❌ VARIABLES D'ENVIRONNEMENT MANQUANTES: ${missingVars.join(', ')}`);
  }
  
  console.log('✅ Variables d\'environnement validées');
});

beforeEach(() => {
  // Reset des mocks avant chaque test
  if (typeof vi !== 'undefined') {
    vi.clearAllMocks();
  }
});

afterEach(() => {
  // Nettoyage après chaque test
  console.log('🧹 Test terminé, nettoyage effectué');
});

afterAll(() => {
  console.log('🏁 SUITE TESTS PRODUCTION TERMINÉE');
  console.log('📊 Rapport détaillé disponible en format JSON et HTML');
});

// Configuration globale pour fetch (si nécessaire)
if (typeof global !== 'undefined' && !global.fetch) {
  global.fetch = fetch;
}

// Types globaux pour tests
declare global {
  var __TEST_MODE__: boolean;
}

globalThis.__TEST_MODE__ = true; 