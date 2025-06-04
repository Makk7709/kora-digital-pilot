/**
 * 🧪 TEST RAPIDE - CONNECTIVITÉ PERPLEXITY
 * Validation express de la clé API avec configuration fonctionnelle
 */

import { describe, it, expect } from 'vitest';
import { createPerplexityService } from '../../lib/perplexity-service';

describe('🚀 TEST RAPIDE - PERPLEXITY API', () => {

  it('⚡ DOIT se connecter à Perplexity avec configuration fonctionnelle', async () => {
    // Configuration identique à celle qui fonctionne dans l'app
    const perplexityService = createPerplexityService({
      apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
      model: 'sonar-pro', // Modèle qui fonctionne
      maxTokens: 4000,
      temperature: 0.7
    });

    console.log('🔑 Clé API:', import.meta.env.VITE_PERPLEXITY_API_KEY?.substring(0, 8) + '...');
    console.log('🤖 Modèle:', 'sonar-pro');

    const response = await perplexityService.getBusinessInsights({
      query: 'Test rapide',
      context: 'Validation',
      depth: 'quick',
      language: 'fr'
    });

    expect(response).toBeDefined();
    expect(response.content).toBeTruthy();
    expect(response.content.length).toBeGreaterThan(5);
    
    console.log('✅ Connexion réussie !');
    console.log('📝 Réponse:', response.content.substring(0, 100) + '...');
    
  }, 15000);

}); 