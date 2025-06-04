/**
 * 🚀 TESTS DE CHARGE - PERPLEXITY MODULE
 * Tests de performance et de robustesse en conditions réelles
 * Simulation d'utilisation intensive pour validation production
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { RealBrandIntelligenceService } from '../../services/RealBrandIntelligenceService';
import { createPerplexityService } from '../../lib/perplexity-service';

// Configuration tests de charge
const LOAD_TEST_TIMEOUT = 120000; // 2 minutes pour tests de charge
const CONCURRENT_REQUESTS = 5;
const STRESS_TEST_BRANDS = ['Tesla', 'Apple', 'Microsoft', 'Google', 'Amazon'];

describe('🔥 TESTS DE CHARGE - PRODUCTION PERPLEXITY', () => {
  let service: RealBrandIntelligenceService;
  const performanceMetrics: Array<{
    brand: string;
    executionTime: number;
    confidenceScore: number;
    timestamp: Date;
  }> = [];

  beforeAll(() => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey || apiKey.includes('your_') || apiKey.includes('demo')) {
      throw new Error('❌ CLÉ API PERPLEXITY RÉELLE OBLIGATOIRE POUR TESTS DE CHARGE');
    }
    
    service = new RealBrandIntelligenceService();
    console.log('🔥 Démarrage tests de charge Perplexity - Production ready');
  });

  afterAll(() => {
    // Rapport de performance final
    if (performanceMetrics.length > 0) {
      const avgTime = performanceMetrics.reduce((sum, m) => sum + m.executionTime, 0) / performanceMetrics.length;
      const avgScore = performanceMetrics.reduce((sum, m) => sum + m.confidenceScore, 0) / performanceMetrics.length;
      
      console.log('📊 RAPPORT PERFORMANCE FINALE:');
      console.log(`⚡ Temps moyen: ${Math.round(avgTime)}ms`);
      console.log(`🎯 Score confiance moyen: ${Math.round(avgScore)}`);
      console.log(`📈 Total requêtes: ${performanceMetrics.length}`);
      
      // Validations finales SLA
      expect(avgTime).toBeLessThan(25000); // SLA: 25s moyenne
      expect(avgScore).toBeGreaterThan(65); // SLA: 65% confiance
    }
  });

  describe('⚡ PERFORMANCE INDIVIDUELLE', () => {

    it('🎯 DOIT respecter SLA pour rapport Tesla complet', async () => {
      const startTime = Date.now();
      
      const report = await service.generateRealDeepResearchReport('Tesla');
      
      const executionTime = Date.now() - startTime;
      
      // Enregistrer métriques
      performanceMetrics.push({
        brand: 'Tesla',
        executionTime,
        confidenceScore: report.confidenceScore,
        timestamp: new Date()
      });

      // Validations SLA Production
      expect(executionTime).toBeLessThan(30000); // Max 30s
      expect(report.confidenceScore).toBeGreaterThan(60); // Min 60%
      
      // Validations contenu complet
      expect(report.objectiveAnalysis).toBeDefined();
      expect(report.strategicAnalysis).toBeDefined();
      expect(report.swotMetrics).toBeDefined();
      expect(report.competitiveMetrics).toBeDefined();
      expect(report.recommendations.length).toBeGreaterThan(3);
      
      console.log(`✅ Tesla: ${executionTime}ms, Score: ${report.confidenceScore}`);
      
    }, LOAD_TEST_TIMEOUT);

    it('🚀 DOIT maintenir performance sur Apple', async () => {
      const startTime = Date.now();
      
      const report = await service.generateRealDeepResearchReport('Apple');
      
      const executionTime = Date.now() - startTime;
      
      performanceMetrics.push({
        brand: 'Apple',
        executionTime,
        confidenceScore: report.confidenceScore,
        timestamp: new Date()
      });

      expect(executionTime).toBeLessThan(30000);
      expect(report.confidenceScore).toBeGreaterThan(60);
      expect(report.sources.length).toBeGreaterThan(0);
      
      console.log(`✅ Apple: ${executionTime}ms, Score: ${report.confidenceScore}`);
      
    }, LOAD_TEST_TIMEOUT);

  });

  describe('🔀 TESTS CONCURRENTS', () => {

    it('🌊 DOIT gérer 3 requêtes simultanées', async () => {
      const brands = ['Microsoft', 'Google', 'Amazon'];
      const startTime = Date.now();
      
      const reports = await Promise.all(
        brands.map(brand => service.generateRealDeepResearchReport(brand))
      );
      
      const totalTime = Date.now() - startTime;
      
      // Enregistrer toutes les métriques
      reports.forEach((report, index) => {
        performanceMetrics.push({
          brand: brands[index],
          executionTime: totalTime / 3, // Temps approximatif par requête
          confidenceScore: report.confidenceScore,
          timestamp: new Date()
        });
      });

      // Validations concurrence
      expect(reports).toHaveLength(3);
      expect(totalTime).toBeLessThan(60000); // Max 60s pour 3 requêtes
      
      reports.forEach((report, index) => {
        expect(report.brandName).toBe(brands[index]);
        expect(report.confidenceScore).toBeGreaterThan(50);
        expect(report.recommendations.length).toBeGreaterThan(0);
      });
      
      console.log(`🌊 Concurrence 3x: ${totalTime}ms total`);
      
    }, LOAD_TEST_TIMEOUT);

    it('⚡ DOIT optimiser via cache Perplexity', async () => {
      const perplexityService = createPerplexityService({
        apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
        model: 'llama-3.1-sonar-large-128k-online',
        maxTokens: 1000,
        temperature: 0.2
      });

      const query = 'Innovation stratégique Tesla 2024';
      
      // Premier appel - sans cache
      const start1 = Date.now();
      const response1 = await perplexityService.getBusinessInsights({
        query,
        context: 'Test cache',
        depth: 'quick',
        language: 'fr'
      });
      const time1 = Date.now() - start1;

      // Deuxième appel - avec cache potentiel
      const start2 = Date.now();
      const response2 = await perplexityService.getBusinessInsights({
        query,
        context: 'Test cache',
        depth: 'quick',
        language: 'fr'
      });
      const time2 = Date.now() - start2;

      // Validations cache
      expect(response1.content).toBeTruthy();
      expect(response2.content).toBeTruthy();
      expect(response1.content).toBe(response2.content); // Cache hit
      expect(time2).toBeLessThan(time1 * 0.5); // Cache doit être plus rapide
      
      console.log(`📦 Cache: ${time1}ms → ${time2}ms (${Math.round((1-time2/time1)*100)}% plus rapide)`);
      
    }, 30000);

  });

  describe('🎪 TESTS DE STRESS', () => {

    it('💪 DOIT résister à charge séquentielle intensive', async () => {
      const brands = STRESS_TEST_BRANDS.slice(0, 3); // Limiter pour éviter timeout
      const results: Array<{ brand: string; success: boolean; time: number }> = [];
      
      for (const brand of brands) {
        try {
          const startTime = Date.now();
          const report = await service.generateRealDeepResearchReport(brand);
          const executionTime = Date.now() - startTime;
          
          results.push({ brand, success: true, time: executionTime });
          
          performanceMetrics.push({
            brand,
            executionTime,
            confidenceScore: report.confidenceScore,
            timestamp: new Date()
          });
          
          // Délai entre requêtes pour éviter rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          results.push({ brand, success: false, time: 0 });
          console.warn(`⚠️ Échec pour ${brand}:`, error.message);
        }
      }

      // Validations stress
      const successRate = results.filter(r => r.success).length / results.length;
      expect(successRate).toBeGreaterThanOrEqual(0.8); // 80% minimum
      
      const avgTime = results.filter(r => r.success).reduce((sum, r) => sum + r.time, 0) / results.filter(r => r.success).length;
      expect(avgTime).toBeLessThan(35000); // Dégradation acceptable
      
      console.log(`💪 Stress: ${Math.round(successRate*100)}% succès, ${Math.round(avgTime)}ms moyen`);
      
    }, LOAD_TEST_TIMEOUT * 2);

    it('🔄 DOIT récupérer après erreurs temporaires', async () => {
      const perplexityService = createPerplexityService({
        apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
        model: 'llama-3.1-sonar-large-128k-online',
        maxTokens: 8000,
        temperature: 0.2
      });

      let successCount = 0;
      let errorCount = 0;
      
      // Simulation 5 requêtes rapides
      for (let i = 0; i < 5; i++) {
        try {
          const response = await perplexityService.getBusinessInsights({
            query: `Test resilience ${i + 1}`,
            context: 'Test résilience',
            depth: 'quick',
            language: 'fr'
          });
          
          if (response.content && response.content.length > 10) {
            successCount++;
          }
          
        } catch (error) {
          errorCount++;
          console.warn(`⚠️ Erreur requête ${i + 1}:`, error.message);
        }
        
        // Délai court entre requêtes
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Validations résilience
      expect(successCount).toBeGreaterThanOrEqual(3); // 60% minimum
      expect(errorCount).toBeLessThan(3); // Max 40% d'erreurs
      
      console.log(`🔄 Résilience: ${successCount} succès, ${errorCount} erreurs`);
      
    }, 60000);

  });

  describe('📊 MONITORING CONTINU', () => {

    it('📈 DOIT monitorer la dégradation de performance', async () => {
      const monitoringResults: Array<{ timestamp: number; responseTime: number }> = [];
      
      // 3 mesures espacées
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        
        try {
          await service.generateRealDeepResearchReport('Tesla');
          const responseTime = Date.now() - start;
          
          monitoringResults.push({
            timestamp: Date.now(),
            responseTime
          });
          
        } catch (error) {
          console.warn('⚠️ Erreur monitoring:', error.message);
        }
        
        // Délai entre mesures
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 5000));
      }

      // Analyse tendance performance
      if (monitoringResults.length >= 2) {
        const firstTime = monitoringResults[0].responseTime;
        const lastTime = monitoringResults[monitoringResults.length - 1].responseTime;
        const degradation = (lastTime - firstTime) / firstTime;
        
        // Alerte si dégradation > 50%
        if (degradation > 0.5) {
          console.warn(`⚠️ Dégradation performance détectée: ${Math.round(degradation*100)}%`);
        }
        
        expect(degradation).toBeLessThan(1.0); // Max 100% dégradation
        
        console.log(`📈 Monitoring: ${firstTime}ms → ${lastTime}ms (${Math.round(degradation*100)}%)`);
      }
      
    }, LOAD_TEST_TIMEOUT);

  });

}); 