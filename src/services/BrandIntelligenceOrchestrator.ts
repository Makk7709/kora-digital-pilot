/**
 * 🎼 BRAND INTELLIGENCE ORCHESTRATOR
 * Service orchestrateur principal - Remplace le monolithe
 * Responsabilité : Coordination des modules spécialisés et interface principale
 */

import { brandAnalysisCore } from './core/BrandAnalysisCore';
import { dataAggregationService } from './brand/DataAggregationService';
import { reportGenerationService } from './integration/ReportGenerationService';
import type { DeepResearchReport } from '../types/BrandIntelligenceTypes';

export class BrandIntelligenceOrchestrator {
  /**
   * 🚀 MÉTHODE PRINCIPALE - Deep Research Report RÉEL
   * Orchestre l'ensemble des modules pour générer un rapport complet
   */
  async generateRealDeepResearchReport(brandName: string): Promise<DeepResearchReport> {
    console.log(`🔍 Génération rapport recherche approfondie orchestré pour: ${brandName}`);

    try {
      // 1. PHASE ANALYSE CORE - Analyses fondamentales en parallèle
      console.log('📊 Phase 1: Analyses fondamentales...');
      const [objectiveAnalysis, recentActions, strategicAnalysis, trendAnalysis] =
        await Promise.all([
          brandAnalysisCore.generateRealObjectiveAnalysis(brandName),
          brandAnalysisCore.analyzeRealRecentActions(brandName),
          brandAnalysisCore.performRealStrategicAnalysis(brandName),
          brandAnalysisCore.detectRealTrendsAndSignals(brandName),
        ]);

      // 2. PHASE AGRÉGATION DONNÉES - Métriques et KPIs en parallèle
      console.log('🎯 Phase 2: Agrégation métriques...');
      const [swotMetrics, contentMetrics, competitiveMetrics, reputationKPIs] = await Promise.all([
        dataAggregationService.extractRealSWOTMetrics(brandName),
        dataAggregationService.analyzeRealContentMetrics(brandName),
        dataAggregationService.calculateRealCompetitiveMetrics(brandName),
        dataAggregationService.computeRealReputationKPIs(brandName),
      ]);

      // 3. CALCUL SCORE DE CONFIANCE
      console.log('🔍 Phase 3: Calcul score de confiance...');
      const confidenceScore = dataAggregationService.calculateRealConfidenceScore(
        objectiveAnalysis,
        recentActions,
      );

      // 4. ASSEMBLAGE RAPPORT FINAL - Recommandations, alertes, déduplication
      console.log('📋 Phase 4: Assemblage rapport final...');
      const finalReport = await reportGenerationService.assembleDeepResearchReport(
        brandName,
        {
          objectiveAnalysis,
          recentActions,
          strategicAnalysis,
          trendAnalysis,
          swotMetrics,
          contentMetrics,
          competitiveMetrics,
          reputationKPIs,
        },
        confidenceScore,
      );

      console.log(
        `✅ Rapport recherche approfondie orchestré généré avec succès pour ${brandName}`,
      );
      console.log(
        `📊 Métriques finales: Score confiance ${confidenceScore}/100, ${finalReport.recommendations.length} recommandations, ${Object.keys(finalReport.alerts).length} types d'alertes`,
      );

      return finalReport;
    } catch (error) {
      console.error(`❌ Erreur orchestration rapport pour ${brandName}:`, error);
      throw new Error(
        `Impossible de générer le rapport orchestré pour ${brandName}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }
  }

  /**
   * 🏥 VÉRIFICATION SANTÉ DES MODULES
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    modules: {
      brandAnalysisCore: boolean;
      dataAggregationService: boolean;
      reportGenerationService: boolean;
    };
    timestamp: Date;
  }> {
    const results = {
      brandAnalysisCore: false,
      dataAggregationService: false,
      reportGenerationService: false,
    };

    try {
      // Test basic functionality of each module
      const testBrand = 'Test-Health-Check';

      // Test BrandAnalysisCore
      try {
        await brandAnalysisCore.generateRealObjectiveAnalysis(testBrand);
        results.brandAnalysisCore = true;
      } catch (error) {
        console.warn('BrandAnalysisCore health check failed:', error);
      }

      // Test DataAggregationService
      try {
        await dataAggregationService.extractRealSWOTMetrics(testBrand);
        results.dataAggregationService = true;
      } catch (error) {
        console.warn('DataAggregationService health check failed:', error);
      }

      // Test ReportGenerationService (without actual API calls)
      try {
        const _mockMetrics: {
          swotMetrics: {
            overallScore: number;
            strengths: unknown[];
            weaknesses: unknown[];
            opportunities: unknown[];
            threats: unknown[];
          };
          contentMetrics: {
            volume: { totalMentions: number; weeklyAverage: number; monthlyGrowth: number };
            sentiment: {
              positive: number;
              neutral: number;
              negative: number;
              overallSentiment: number;
            };
            reach: { totalReach: number; avgEngagement: number; viralityScore: number };
            topics: unknown[];
            influencers: unknown[];
          };
          competitiveMetrics: {
            marketShare: {
              current: number;
              trend: 'stable';
              projectedShare: number;
              historicalData: unknown[];
            };
            benchmarkPosition: { rank: number; percentile: number; gapToLeader: number };
            competitiveAdvantageIndex: number;
            threatLevel: number;
            opportunityGaps: unknown[];
            positionQuadrant: 'challenger';
            costAdvantage: number;
          };
          reputationKPIs: {
            overallScore: number;
            brandTrust: number;
            brandRecognition: number;
            brandLoyalty: number;
            publicPerception: { favorability: number; awareness: number; consideration: number };
            socialMediaMetrics: { followers: number; engagement: number; sentimentScore: number };
            crisisResilience: number;
            competitorComparison: unknown[];
          };
        } = {
          swotMetrics: {
            overallScore: 70,
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: [],
          },
          contentMetrics: {
            volume: { totalMentions: 100, weeklyAverage: 10, monthlyGrowth: 5 },
            sentiment: { positive: 60, neutral: 25, negative: 15, overallSentiment: 45 },
            reach: { totalReach: 10000, avgEngagement: 3, viralityScore: 40 },
            topics: [],
            influencers: [],
          },
          competitiveMetrics: {
            marketShare: { current: 15, trend: 'stable', projectedShare: 16, historicalData: [] },
            benchmarkPosition: { rank: 5, percentile: 50, gapToLeader: 20 },
            competitiveAdvantageIndex: 65,
            threatLevel: 40,
            opportunityGaps: [],
            positionQuadrant: 'challenger',
            costAdvantage: 0,
          },
          reputationKPIs: {
            overallScore: 65,
            brandTrust: 70,
            brandRecognition: 60,
            brandLoyalty: 55,
            publicPerception: { favorability: 65, awareness: 70, consideration: 50 },
            socialMediaMetrics: { followers: 50000, engagement: 3, sentimentScore: 15 },
            crisisResilience: 60,
            competitorComparison: [],
          },
        };

        reportGenerationService.validateRealDataFreshness([]);
        results.reportGenerationService = true;
      } catch (error) {
        console.warn('ReportGenerationService health check failed:', error);
      }

      const healthyModules = Object.values(results).filter(Boolean).length;
      const totalModules = Object.keys(results).length;

      let status: 'healthy' | 'degraded' | 'unhealthy';
      if (healthyModules === totalModules) {
        status = 'healthy';
      } else if (healthyModules >= totalModules / 2) {
        status = 'degraded';
      } else {
        status = 'unhealthy';
      }

      return {
        status,
        modules: results,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Health check global error:', error);
      return {
        status: 'unhealthy',
        modules: results,
        timestamp: new Date(),
      };
    }
  }

  /**
   * 📊 MÉTRIQUES D'UTILISATION
   */
  getUsageMetrics(): {
    totalReports: number;
    lastExecution: Date | null;
    averageExecutionTime: number;
    errorRate: number;
  } {
    // Ces métriques seraient normalement stockées et trackées
    // Pour l'instant, retournons des valeurs par défaut
    return {
      totalReports: 0,
      lastExecution: null,
      averageExecutionTime: 0,
      errorRate: 0,
    };
  }
}

// Instance principale exportée
export const brandIntelligenceOrchestrator = new BrandIntelligenceOrchestrator();

// Export du service pour compatibilité avec l'ancien code
export { brandIntelligenceOrchestrator as realBrandIntelligenceService };
