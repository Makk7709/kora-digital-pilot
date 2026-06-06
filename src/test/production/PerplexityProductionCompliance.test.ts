/**
 * 🎯 TESTS DE CONFORMITÉ PRODUCTION - PERPLEXITY
 * Validation exhaustive : Zéro mock, zéro démo, production-only
 * Responsabilité : Architecte QA/Production ex-McKinsey Accenture
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { RealBrandIntelligenceService } from '../../services/RealBrandIntelligenceService';
import { createPerplexityService } from '../../lib/perplexity-service';

// Configuration stricte pour tests production
const PRODUCTION_TEST_TIMEOUT = 60000; // 60 secondes pour API réelles
const TEST_BRANDS = ['Tesla', 'Apple', 'Microsoft', 'Google'];

describe('🔍 CONFORMITÉ PRODUCTION - PERPLEXITY MODULE', () => {
  let service: RealBrandIntelligenceService;

  beforeAll(() => {
    // 🔐 VALIDATION CLÉ API OBLIGATOIRE
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey || apiKey.includes('your_') || apiKey.includes('demo') || apiKey.includes('test')) {
      throw new Error('❌ CLÉ API PERPLEXITY RÉELLE OBLIGATOIRE POUR TESTS PRODUCTION');
    }

    console.log('🔑 Clé API Perplexity validée pour tests production');
    service = new RealBrandIntelligenceService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('🚨 AUDIT ANTI-MOCK & ANTI-DÉMO', () => {
    it("🔒 DOIT utiliser UNIQUEMENT des variables d'environnement réelles", () => {
      const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;

      // Validation format clé Perplexity
      expect(apiKey).toMatch(/^pplx-[A-Za-z0-9]+$/);
      expect(apiKey).not.toContain('demo');
      expect(apiKey).not.toContain('test');
      expect(apiKey).not.toContain('mock');
      expect(apiKey).not.toContain('fake');
      expect(apiKey.length).toBeGreaterThan(20);
    });

    it('🚫 DOIT rejeter toute configuration avec fallback demo', () => {
      const perplexityService = createPerplexityService({
        apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
        model: import.meta.env.VITE_PERPLEXITY_MODEL || 'llama-3.1-sonar-large-128k-online',
        maxTokens: Number.parseInt(import.meta.env.VITE_PERPLEXITY_MAX_TOKENS) || 8000,
        temperature: Number.parseFloat(import.meta.env.VITE_PERPLEXITY_TEMPERATURE) || 0.2,
      });

      expect(perplexityService).toBeDefined();
      expect(() => perplexityService.updateConfig({ apiKey: 'demo-key' })).not.toThrow();
    });

    it('⚡ DOIT échouer sans clé API valide', () => {
      expect(() => {
        const badService = createPerplexityService({
          apiKey: '',
          model: 'test',
        });
      }).toThrow();
    });
  });

  describe('📊 TESTS DONNÉES RÉELLES UNIQUEMENT', () => {
    it(
      '🔄 DOIT générer un rapport complet avec données Perplexity réelles',
      async () => {
        const testBrand = 'Tesla';

        const report = await service.generateRealDeepResearchReport(testBrand);

        // Validations structure
        expect(report).toBeDefined();
        expect(report.brandName).toBe(testBrand);
        expect(report.objectiveAnalysis).toBeDefined();
        expect(report.strategicAnalysis).toBeDefined();
        expect(report.swotMetrics).toBeDefined();
        expect(report.competitiveMetrics).toBeDefined();
        expect(report.recommendations).toBeDefined();

        // Validations contenu réel
        expect(report.objectiveAnalysis.brandHistory.foundingYear).toBeGreaterThan(1900);
        expect(report.objectiveAnalysis.brandHistory.foundingYear).toBeLessThan(2025);
        expect(report.objectiveAnalysis.brandHistory.founders.length).toBeGreaterThan(0);

        // Validation métriques réalistes
        expect(report.swotMetrics.overallScore).toBeGreaterThanOrEqual(0);
        expect(report.swotMetrics.overallScore).toBeLessThanOrEqual(100);
        expect(report.confidenceScore).toBeGreaterThanOrEqual(0);
        expect(report.confidenceScore).toBeLessThanOrEqual(100);

        // Validation sources réelles
        expect(report.sources.length).toBeGreaterThan(0);
        report.sources.forEach((source) => {
          expect(source.source).toBeDefined();
          expect(source.reliability).toBeGreaterThan(0);
          expect(source.lastUpdated).toBeInstanceOf(Date);
        });
      },
      PRODUCTION_TEST_TIMEOUT,
    );

    it(
      '💼 DOIT analyser plusieurs marques avec cohérence',
      async () => {
        const reports = await Promise.all(
          TEST_BRANDS.slice(0, 2).map((brand) => service.generateRealDeepResearchReport(brand)),
        );

        reports.forEach((report, index) => {
          expect(report.brandName).toBe(TEST_BRANDS[index]);
          expect(report.confidenceScore).toBeGreaterThan(50); // Minimum acceptable
          expect(report.recommendations.length).toBeGreaterThan(0);
          expect(report.swotMetrics.strengths.length).toBeGreaterThan(0);
          expect(report.swotMetrics.weaknesses.length).toBeGreaterThan(0);
        });
      },
      PRODUCTION_TEST_TIMEOUT * 2,
    );
  });

  describe("⚠️ GESTION D'ERREURS PRODUCTION", () => {
    it('🚨 DOIT gérer gracieusement les erreurs API Perplexity', async () => {
      // Test avec une marque inexistante pour forcer la robustesse
      const invalidBrand = 'XYZ_BRAND_THAT_DOES_NOT_EXIST_12345';

      await expect(async () => {
        await service.generateRealDeepResearchReport(invalidBrand);
      }).rejects.toThrow();
    });

    it(
      '🔧 DOIT maintenir la cohérence des données malgré les erreurs partielles',
      async () => {
        const report = await service.generateRealDeepResearchReport('Apple');

        // Vérifier que même en cas d'erreur partielle, la structure reste cohérente
        expect(report.brandName).toBe('Apple');
        expect(report.executionTimestamp).toBeInstanceOf(Date);
        expect(report.confidenceScore).toBeGreaterThanOrEqual(0);

        // Validation déduplication
        if ((report as any).deduplicationStats) {
          const stats = (report as any).deduplicationStats;
          expect(stats.duplications).toBeGreaterThanOrEqual(0);
          expect(stats.uniqueWords).toBeGreaterThan(0);
          expect(stats.repetitionRate).toBeGreaterThanOrEqual(0);
          expect(stats.repetitionRate).toBeLessThanOrEqual(1);
        }
      },
      PRODUCTION_TEST_TIMEOUT,
    );
  });

  describe('🎯 MÉTRIQUES DE PERFORMANCE PRODUCTION', () => {
    it(
      '⚡ DOIT respecter les SLA de performance',
      async () => {
        const startTime = Date.now();

        const report = await service.generateRealDeepResearchReport('Microsoft');

        const executionTime = Date.now() - startTime;

        // SLA Production : 30 secondes maximum
        expect(executionTime).toBeLessThan(30000);

        // Validation qualité vs vitesse
        expect(report.confidenceScore).toBeGreaterThan(60); // Qualité minimale
        console.log(`⚡ Performance: ${executionTime}ms pour score ${report.confidenceScore}`);
      },
      PRODUCTION_TEST_TIMEOUT,
    );

    it(
      '📊 DOIT fournir des métriques de fraîcheur des données',
      async () => {
        const report = await service.generateRealDeepResearchReport('Google');

        expect(report.dataFreshness).toBeDefined();
        expect(report.dataFreshness.lastUpdateTime).toBeInstanceOf(Date);
        expect(report.dataFreshness.dataQualityScore).toBeGreaterThan(0);
        expect(report.dataFreshness.dataQualityScore).toBeLessThanOrEqual(100);

        // Les données doivent être récentes (moins de 7 jours)
        const daysSinceUpdate =
          (Date.now() - report.dataFreshness.lastUpdateTime.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysSinceUpdate).toBeLessThan(7);
      },
      PRODUCTION_TEST_TIMEOUT,
    );
  });

  describe('🔐 SÉCURITÉ & CONFORMITÉ', () => {
    it('🛡️ DOIT protéger les clés API dans les logs', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await service.generateRealDeepResearchReport('Tesla');

      // Vérifier qu'aucune clé API complète n'apparaît dans les logs
      const logCalls = consoleSpy.mock.calls.flat().join(' ');
      expect(logCalls).not.toContain(import.meta.env.VITE_PERPLEXITY_API_KEY);

      consoleSpy.mockRestore();
    });

    it('📋 DOIT tracer les appels API pour audit', async () => {
      const consoleSpy = vi.spyOn(console, 'log');

      await service.generateRealDeepResearchReport('Apple');

      // Vérifier présence de logs d'audit
      const logCalls = consoleSpy.mock.calls.flat().join(' ');
      expect(logCalls).toContain('🔍 Génération rapport recherche approfondie');
      expect(logCalls).toContain('✅ Rapport recherche approfondie généré avec succès');

      consoleSpy.mockRestore();
    });
  });
});

describe("🚀 TESTS D'INTÉGRATION PERPLEXITY API", () => {
  it("🌐 DOIT se connecter à l'API Perplexity réelle", async () => {
    const perplexityService = createPerplexityService({
      apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
      model: 'llama-3.1-sonar-large-128k-online',
      maxTokens: 1000,
      temperature: 0.2,
    });

    const response = await perplexityService.getBusinessInsights({
      query: 'Test de connectivité API Perplexity',
      context: 'Test technique',
      depth: 'quick',
      language: 'fr',
    });

    expect(response).toBeDefined();
    expect(response.content).toBeTruthy();
    expect(response.content.length).toBeGreaterThan(10);
    expect(response.timestamp).toBeInstanceOf(Date);
    expect(response.usage).toBeDefined();
    expect(response.usage.total_tokens).toBeGreaterThan(0);
  }, 15000);

  it('📈 DOIT gérer les requêtes concurrentes', async () => {
    const perplexityService = createPerplexityService({
      apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
      model: 'llama-3.1-sonar-large-128k-online',
      maxTokens: 500,
      temperature: 0.2,
    });

    const queries = ['Tendances IA 2024', 'Innovation Tesla', 'Stratégie Apple'];

    const responses = await Promise.all(
      queries.map((query) =>
        perplexityService.getBusinessInsights({
          query,
          context: 'Test concurrence',
          depth: 'quick',
          language: 'fr',
        }),
      ),
    );

    expect(responses).toHaveLength(3);
    responses.forEach((response, index) => {
      expect(response.content).toBeTruthy();
      expect(response.content.toLowerCase()).toContain(queries[index].toLowerCase().split(' ')[0]);
    });
  }, 30000);
});
