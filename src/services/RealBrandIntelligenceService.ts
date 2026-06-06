/**
 * 🚀 REAL BRAND INTELLIGENCE SERVICE
 * Service authentique 100% Perplexity (pas de mock).
 *
 * Ce module est l'orchestrateur. La logique pure (parsing, extraction,
 * recommandations, prompts) vit dans `src/services/brand/real/*` afin de
 * garder ce fichier en dessous de 800 lignes et faciliter les évolutions.
 */

import { logger } from '../lib/logger';
import { PerplexityService, createPerplexityService } from '../lib/perplexity-service';
import type {
  ActionableRecommendation,
  CompetitiveMetrics,
  ContentMetrics,
  DataFreshness,
  DeepResearchReport,
  ObjectiveAnalysis,
  RecentAction,
  ReputationKPIs,
  SmartAlerts,
  StrategicAnalysis,
  SWOTMetrics,
  TrendAnalysis,
} from '../types/BrandIntelligenceTypes';
import { contentDeduplicationService } from './ContentDeduplicationService';
import { extractSectorKeywords } from './brand/real/extractors';
import {
  parseRealAlerts,
  parseRealCompetitiveMetrics,
  parseRealContentMetrics,
  parseRealObjectiveAnalysis,
  parseRealRecentActions,
  parseRealRecommendations,
  parseRealReputationKPIs,
  parseRealStrategicAnalysis,
  parseRealSWOTMetrics,
  parseRealTrendAnalysis,
} from './brand/real/parsers';
import {
  buildAlertsPrompt,
  buildCompetitivePrompt,
  buildContentMetricsPrompt,
  buildObjectiveAnalysisPrompt,
  buildRecentActionsPrompt,
  buildRecommendationsPrompt,
  buildReputationPrompt,
  buildSectorIdentificationPrompt,
  buildStrategicAnalysisPrompt,
  buildSWOTPrompt,
  buildTrendsPrompt,
} from './brand/real/prompts';

interface DeduplicationStats {
  duplications: number;
  uniqueWords: number;
  repetitionRate: number;
}

export class RealBrandIntelligenceService {
  private readonly perplexityService: PerplexityService;
  private isInitialized = false;

  constructor(perplexityService?: PerplexityService) {
    if (perplexityService) {
      this.perplexityService = perplexityService;
      this.isInitialized = true;
      logger.debug('🔧 [RealBrandIntelligenceService] Utilisation du service Perplexity fourni');
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
      if (!apiKey) {
        throw new Error('VITE_PERPLEXITY_API_KEY manquante dans .env');
      }

      this.perplexityService = createPerplexityService({
        apiKey,
        model: import.meta.env.VITE_PERPLEXITY_MODEL || 'llama-3.1-sonar-large-128k-online',
        maxTokens: Number.parseInt(import.meta.env.VITE_PERPLEXITY_MAX_TOKENS) || 8000,
        temperature: Number.parseFloat(import.meta.env.VITE_PERPLEXITY_TEMPERATURE) || 0.2,
      });

      this.isInitialized = true;
      logger.debug('🔧 [RealBrandIntelligenceService] Service Perplexity créé depuis .env');
    } catch (error) {
      logger.error('❌ [RealBrandIntelligenceService] Erreur initialisation:', error);
      throw new Error(
        `Impossible d'initialiser RealBrandIntelligenceService: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }
  }

  static withPerplexityService(perplexityService: PerplexityService): RealBrandIntelligenceService {
    return new RealBrandIntelligenceService(perplexityService);
  }

  async generateRealDeepResearchReport(brandName: string): Promise<DeepResearchReport> {
    logger.info(`🔍 Génération rapport recherche approfondie pour: ${brandName}`);

    try {
      await this.ensureInitialized();

      const [objectiveAnalysis, recentActions, strategicAnalysis, trendAnalysis] =
        await Promise.all([
          this.generateRealObjectiveAnalysis(brandName),
          this.analyzeRealRecentActions(brandName),
          this.performRealStrategicAnalysis(brandName),
          this.detectRealTrendsAndSignals(brandName),
        ]);

      const [swotMetrics, contentMetrics, competitiveMetrics, reputationKPIs] = await Promise.all([
        this.extractRealSWOTMetrics(brandName),
        this.analyzeRealContentMetrics(brandName),
        this.calculateRealCompetitiveMetrics(brandName),
        this.computeRealReputationKPIs(brandName),
      ]);

      const allMetrics = { swotMetrics, contentMetrics, competitiveMetrics, reputationKPIs };
      const [recommendations, alerts] = await Promise.all([
        this.generateRealRecommendations(brandName, allMetrics),
        this.generateRealAlerts(brandName, allMetrics),
      ]);

      const confidenceScore = this.calculateRealConfidenceScore(objectiveAnalysis, recentActions);
      const dataFreshness = this.validateRealDataFreshness(recentActions);

      const initialReport: DeepResearchReport = {
        brandName,
        executionTimestamp: new Date(),
        objectiveAnalysis,
        recentActions,
        strategicAnalysis,
        trendAnalysis,
        swotMetrics,
        contentMetrics,
        competitiveMetrics,
        reputationKPIs,
        recommendations,
        alerts,
        confidenceScore,
        dataFreshness,
        sources: [
          {
            source: 'Perplexity AI',
            reliability: 85,
            lastUpdated: new Date(),
            type: 'primary',
            credibility: 'high',
          },
        ],
        limitations: ['Données basées sur sources publiques', 'Analyse en temps réel limitée'],
      };

      logger.debug('🧹 Application déduplication intelligente au rapport...');
      const deduplicatedReport =
        await contentDeduplicationService.deduplicateReportContent(initialReport);

      if (deduplicatedReport.objectiveAnalysis?.brandHistory) {
        const stats = contentDeduplicationService.getDeduplicationStats(
          deduplicatedReport.objectiveAnalysis.brandHistory,
        ) as DeduplicationStats;
        logger.info(
          `📊 Stats déduplication: ${stats.duplications} duplicatas, ${stats.uniqueWords} mots uniques, ${(stats.repetitionRate * 100).toFixed(1)}% répétition`,
        );

        (
          deduplicatedReport as DeepResearchReport & { deduplicationStats?: unknown }
        ).deduplicationStats = stats;
      }

      (deduplicatedReport as DeepResearchReport & { qualityOptimized?: boolean }).qualityOptimized =
        true;
      (
        deduplicatedReport as DeepResearchReport & { optimizationTimestamp?: string }
      ).optimizationTimestamp = new Date().toISOString();

      logger.info(`✅ Rapport recherche approfondie généré pour ${brandName} (optimisé)`);
      return deduplicatedReport;
    } catch (error) {
      logger.error(`❌ Erreur génération rapport pour ${brandName}:`, error);
      throw new Error(
        `Impossible de générer le rapport pour ${brandName}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }
  }

  // === Méthodes async qui appellent Perplexity ===

  private async generateRealObjectiveAnalysis(brandName: string): Promise<ObjectiveAnalysis> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildObjectiveAnalysisPrompt(brandName),
      context: 'Analyse factuelle et objective',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });
    return parseRealObjectiveAnalysis(response.content, brandName);
  }

  private async analyzeRealRecentActions(brandName: string): Promise<RecentAction[]> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildRecentActionsPrompt(brandName),
      context: 'Actions récentes documentées',
      industry: 'business',
      depth: 'detailed',
      language: 'fr',
    });
    return parseRealRecentActions(response.content, brandName);
  }

  private async performRealStrategicAnalysis(brandName: string): Promise<StrategicAnalysis> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildStrategicAnalysisPrompt(brandName),
      context: 'Analyse stratégique approfondie',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });
    return parseRealStrategicAnalysis(response.content, brandName);
  }

  private async detectRealTrendsAndSignals(brandName: string): Promise<TrendAnalysis> {
    const sectorResponse = await this.perplexityService.getBusinessInsights({
      query: buildSectorIdentificationPrompt(brandName),
      context: 'Identification secteur',
      industry: 'business',
      depth: 'quick',
      language: 'fr',
    });

    const sectorKeywords = extractSectorKeywords(sectorResponse.content);
    const sectorContext =
      sectorKeywords.length > 0 ? sectorKeywords.join(', ') : 'business général';

    const response = await this.perplexityService.getBusinessInsights({
      query: buildTrendsPrompt(brandName, sectorContext),
      context: `Détection tendances sectorielles - ${sectorContext}`,
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return parseRealTrendAnalysis(response.content, brandName);
  }

  private async extractRealSWOTMetrics(brandName: string): Promise<SWOTMetrics> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildSWOTPrompt(brandName),
      context: 'Analyse SWOT quantifiée',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });
    return parseRealSWOTMetrics(response.content);
  }

  private async analyzeRealContentMetrics(brandName: string): Promise<ContentMetrics> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildContentMetricsPrompt(brandName),
      context: 'Métriques de contenu',
      industry: 'digital-marketing',
      depth: 'detailed',
      language: 'fr',
    });
    return parseRealContentMetrics(response.content);
  }

  private async calculateRealCompetitiveMetrics(brandName: string): Promise<CompetitiveMetrics> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildCompetitivePrompt(brandName),
      context: 'Analyse concurrentielle détaillée',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });
    return parseRealCompetitiveMetrics(response.content);
  }

  private async computeRealReputationKPIs(brandName: string): Promise<ReputationKPIs> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildReputationPrompt(brandName),
      context: 'KPIs de réputation',
      industry: 'business',
      depth: 'detailed',
      language: 'fr',
    });
    return parseRealReputationKPIs(response.content);
  }

  private async generateRealRecommendations(
    brandName: string,
    _metrics: unknown,
  ): Promise<ActionableRecommendation[]> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildRecommendationsPrompt(brandName),
      context: 'Recommandations stratégiques',
      industry: 'business',
      depth: 'detailed',
      language: 'fr',
    });
    return parseRealRecommendations(response.content);
  }

  private async generateRealAlerts(brandName: string, _metrics: unknown): Promise<SmartAlerts> {
    const response = await this.perplexityService.getBusinessInsights({
      query: buildAlertsPrompt(brandName),
      context: 'Alertes intelligentes',
      industry: 'business',
      depth: 'detailed',
      language: 'fr',
    });
    return parseRealAlerts(response.content);
  }

  // === Helpers de scoring de confiance et fraîcheur ===

  private calculateRealConfidenceScore(
    objectiveAnalysis: ObjectiveAnalysis,
    recentActions: RecentAction[],
  ): number {
    let baseScore = 70;

    if (objectiveAnalysis.foundingYear) baseScore += 5;
    if (objectiveAnalysis.marketCapitalization) baseScore += 5;
    if (objectiveAnalysis.employeeCount) baseScore += 5;

    if (recentActions.length > 3) baseScore += 10;

    const recentActionsRecent = recentActions.filter((action) => {
      const daysSince = (Date.now() - action.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 90;
    }).length;

    if (recentActionsRecent > 2) baseScore += 10;

    const avgConfidence =
      recentActions.length > 0
        ? recentActions.reduce((sum, action) => sum + action.confidenceLevel, 0) /
          recentActions.length
        : 0.8;

    baseScore = baseScore + avgConfidence * 10;

    return Math.min(95, Math.max(50, Math.round(baseScore)));
  }

  private validateRealDataFreshness(recentActions: RecentAction[]): DataFreshness {
    const now = Date.now();
    const veryRecentActions = recentActions.filter((action) => {
      const daysSince = (now - action.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }).length;

    let dataQualityScore = 70;
    let isDataFresh = true;
    let oldestDataAge = 0;
    let averageDataAge = 0;

    if (recentActions.length > 0) {
      const ages = recentActions.map((action) => (now - action.date.getTime()) / (1000 * 60 * 60));
      oldestDataAge = Math.max(...ages);
      averageDataAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;

      if (veryRecentActions >= 3) {
        dataQualityScore = 95;
      } else if (veryRecentActions >= 2) {
        dataQualityScore = 85;
      } else if (veryRecentActions >= 1) {
        dataQualityScore = 75;
      } else {
        dataQualityScore = 50;
        isDataFresh = false;
      }
    }

    let reliability: 'high' | 'medium' | 'low';
    if (isDataFresh) reliability = 'high';
    else if (averageDataAge < 72) reliability = 'medium';
    else reliability = 'low';

    return {
      lastUpdated: recentActions.length > 0 ? recentActions[0].date : new Date(),
      dataAge: oldestDataAge,
      reliability,
      sources: recentActions.length,
      isDataFresh,
      oldestDataAge,
      averageDataAge,
      lastUpdateTime: recentActions.length > 0 ? recentActions[0].date : new Date(),
      dataQualityScore,
    } as DataFreshness;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Service non initialisé');
    }
  }
}
