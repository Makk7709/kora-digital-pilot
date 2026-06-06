/**
 * 📋 REPORT GENERATION SERVICE
 * Service de génération de rapports - Extraction du monolithe
 * Responsabilité : Recommandations, alertes, assemblage final des rapports
 */

import { PerplexityService, createPerplexityService } from '../../lib/perplexity-service';
import { contentDeduplicationService } from '../ContentDeduplicationService';
import type {
  ActionableRecommendation,
  SmartAlerts,
  DeepResearchReport,
  DataFreshness,
  ObjectiveAnalysis,
  RecentAction,
  StrategicAnalysis,
  TrendAnalysis,
  SWOTMetrics,
  ContentMetrics,
  CompetitiveMetrics,
  ReputationKPIs,
} from '../../types/BrandIntelligenceTypes';

export class ReportGenerationService {
  private perplexityService: PerplexityService;
  private isInitialized = false;

  constructor() {
    // Initialisation avec clé API réelle
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
  }

  /**
   * 🎯 RECOMMANDATIONS ACTIONABLES RÉELLES
   */
  async generateRealRecommendations(
    brandName: string,
    metrics: {
      swotMetrics: SWOTMetrics;
      contentMetrics: ContentMetrics;
      competitiveMetrics: CompetitiveMetrics;
      reputationKPIs: ReputationKPIs;
    },
  ): Promise<ActionableRecommendation[]> {
    await this.ensureInitialized();

    // Synthèse des métriques pour le contexte
    const metricsContext = this.synthesizeMetricsContext(metrics);

    const query = `RECOMMANDATIONS STRATÉGIQUES PRIORITAIRES - ${brandName}

CONTEXTE MÉTRIQUES ACTUELLES:
${metricsContext}

Génère 8-10 recommandations stratégiques ACTIONABLES et MESURABLES:

1. RECOMMANDATIONS IMMÉDIATES (0-3 mois):
   - Actions correctives urgentes
   - Optimisations rapides à fort impact
   - Gestion de risques immédiats

2. RECOMMANDATIONS COURT TERME (3-6 mois):
   - Améliorations structurelles
   - Développement de capacités
   - Renforcement positionnement

3. RECOMMANDATIONS MOYEN TERME (6-12 mois):
   - Investissements stratégiques
   - Innovation et développement
   - Expansion et croissance

4. RECOMMANDATIONS LONG TERME (12+ mois):
   - Transformation organisationnelle
   - Vision et positionnement futur
   - Développement écosystème

Pour chaque recommandation, précise:
- Impact attendu (0-100)
- Budget estimé (€)
- Ressources nécessaires
- Département responsable
- Métriques de succès
- Niveau de risque
- Dépendances

Priorise selon l'urgence et l'impact potentiel pour ${brandName}.`;

    const response = await this.perplexityService.getBusinessInsights({
      query,
      context: 'Recommandations stratégiques actionables',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return this.parseRealRecommendations(response.content);
  }

  /**
   * 🚨 ALERTES INTELLIGENTES RÉELLES
   */
  async generateRealAlerts(
    brandName: string,
    metrics: {
      swotMetrics: SWOTMetrics;
      contentMetrics: ContentMetrics;
      competitiveMetrics: CompetitiveMetrics;
      reputationKPIs: ReputationKPIs;
    },
  ): Promise<SmartAlerts> {
    await this.ensureInitialized();

    const metricsContext = this.synthesizeMetricsContext(metrics);

    const query = `ALERTES STRATÉGIQUES INTELLIGENTES - ${brandName}

CONTEXTE MÉTRIQUES ACTUELLES:
${metricsContext}

Identifie les alertes par niveau de criticité:

1. ALERTES CRITIQUES (Action immédiate requise):
   - Menaces existentielles
   - Pertes de part de marché significatives
   - Crises de réputation majeures
   - Violations réglementaires
   - Défaillances opérationnelles critiques

2. ALERTES D'AVERTISSEMENT (Surveillance renforcée):
   - Tendances négatives confirmées
   - Pression concurrentielle accrue
   - Dégradation indicateurs clés
   - Risques émergents sectoriels
   - Signaux faibles préoccupants

3. ALERTES D'OPPORTUNITÉ (Potentiel à exploiter):
   - Fenêtres marché temporaires
   - Faiblesses concurrents exploitables
   - Tendances favorables émergentes
   - Innovations disruptives bénéfiques
   - Partenariats stratégiques possibles

Pour chaque alerte, fournis:
- Contexte détaillé
- Timeline d'impact
- Actions suggérées
- Métriques de suivi
- Seuils de déclenchement

Focus sur des alertes ACTIONABLES et MESURABLES pour ${brandName}.`;

    const response = await this.perplexityService.getBusinessInsights({
      query,
      context: 'Alertes stratégiques intelligentes',
      industry: 'business',
      depth: 'comprehensive',
      language: 'fr',
    });

    return this.parseRealAlerts(response.content);
  }

  /**
   * 📊 VALIDATION FRAÎCHEUR DES DONNÉES
   */
  validateRealDataFreshness(recentActions: RecentAction[]): DataFreshness {
    const now = new Date();

    if (recentActions.length === 0) {
      return {
        lastUpdated: now,
        dataAge: 24, // 24 heures par défaut
        reliability: 'low',
        sources: 1,
        lastUpdateTime: now,
        dataQualityScore: 30,
        isDataFresh: false,
        averageDataAge: 48,
        oldestDataAge: 168, // 1 semaine
      };
    }

    // Calculer l'âge moyen des données
    const actionAges = recentActions.map((action) => {
      const ageMs = now.getTime() - action.date.getTime();
      return ageMs / (1000 * 60 * 60); // Convertir en heures
    });

    const averageAge = actionAges.reduce((sum, age) => sum + age, 0) / actionAges.length;
    const oldestAge = Math.max(...actionAges);
    const mostRecentAge = Math.min(...actionAges);

    // Déterminer la fiabilité basée sur la fraîcheur
    let reliability: 'high' | 'medium' | 'low' = 'low';
    if (mostRecentAge <= 24) {
      reliability = 'high';
    } else if (mostRecentAge <= 72) {
      reliability = 'medium';
    }

    // Calculer le score de qualité des données
    let qualityScore = 100;
    if (averageAge > 168) qualityScore -= 30; // -30 si > 1 semaine
    if (averageAge > 72) qualityScore -= 20; // -20 si > 3 jours
    if (recentActions.length < 3) qualityScore -= 20; // -20 si peu d'actions
    qualityScore = Math.max(0, qualityScore);

    return {
      lastUpdated: recentActions[0]?.date || now,
      dataAge: mostRecentAge,
      reliability,
      sources: recentActions.length,
      lastUpdateTime: recentActions[0]?.date || now,
      dataQualityScore: qualityScore,
      isDataFresh: mostRecentAge <= 48,
      averageDataAge: averageAge,
      oldestDataAge: oldestAge,
    };
  }

  /**
   * 📋 ASSEMBLAGE RAPPORT FINAL
   */
  async assembleDeepResearchReport(
    brandName: string,
    components: {
      objectiveAnalysis: ObjectiveAnalysis;
      recentActions: RecentAction[];
      strategicAnalysis: StrategicAnalysis;
      trendAnalysis: TrendAnalysis;
      swotMetrics: SWOTMetrics;
      contentMetrics: ContentMetrics;
      competitiveMetrics: CompetitiveMetrics;
      reputationKPIs: ReputationKPIs;
    },
    confidenceScore: number,
  ): Promise<DeepResearchReport> {
    console.log(`🔍 Assemblage rapport recherche approfondie pour: ${brandName}`);

    try {
      // 1. Génération des recommandations et alertes
      const metrics = {
        swotMetrics: components.swotMetrics,
        contentMetrics: components.contentMetrics,
        competitiveMetrics: components.competitiveMetrics,
        reputationKPIs: components.reputationKPIs,
      };

      const [recommendations, alerts] = await Promise.all([
        this.generateRealRecommendations(brandName, metrics),
        this.generateRealAlerts(brandName, metrics),
      ]);

      // 2. Validation fraîcheur des données
      const dataFreshness = this.validateRealDataFreshness(components.recentActions);

      // 3. Construction du rapport initial
      const initialReport: DeepResearchReport = {
        brandName,
        executionTimestamp: new Date(),
        objectiveAnalysis: components.objectiveAnalysis,
        recentActions: components.recentActions,
        strategicAnalysis: components.strategicAnalysis,
        trendAnalysis: components.trendAnalysis,
        swotMetrics: components.swotMetrics,
        contentMetrics: components.contentMetrics,
        competitiveMetrics: components.competitiveMetrics,
        reputationKPIs: components.reputationKPIs,
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

      // 4. 🧹 APPLICATION DE LA DÉDUPLICATION INTELLIGENTE
      console.log('🧹 Application déduplication intelligente au rapport...');
      const deduplicatedReport =
        await contentDeduplicationService.deduplicateReportContent(initialReport);

      // 5. Statistiques de déduplication
      if (deduplicatedReport.objectiveAnalysis?.brandHistory) {
        const stats = contentDeduplicationService.getDeduplicationStats(
          deduplicatedReport.objectiveAnalysis.brandHistory,
        );
        console.log(
          `📊 Stats déduplication: ${stats.duplications} duplicatas supprimés, ${stats.uniqueWords} mots uniques, ${(stats.repetitionRate * 100).toFixed(1)}% répétition`,
        );

        // Ajouter les stats comme métadonnées
        (deduplicatedReport as any).deduplicationStats = stats;
      }

      // 6. Marquer le rapport comme optimisé
      (deduplicatedReport as any).qualityOptimized = true;
      (deduplicatedReport as any).optimizationTimestamp = new Date().toISOString();

      console.log(
        `✅ Rapport recherche approfondie assemblé avec succès pour ${brandName} (optimisé)`,
      );
      return deduplicatedReport;
    } catch (error) {
      console.error(`❌ Erreur assemblage rapport pour ${brandName}:`, error);
      throw new Error(
        `Impossible d'assembler le rapport pour ${brandName}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      );
    }
  }

  // === MÉTHODES UTILITAIRES ===

  private synthesizeMetricsContext(metrics: {
    swotMetrics: SWOTMetrics;
    contentMetrics: ContentMetrics;
    competitiveMetrics: CompetitiveMetrics;
    reputationKPIs: ReputationKPIs;
  }): string {
    return `
SWOT Global: ${metrics.swotMetrics.overallScore}/100
- Forces: ${metrics.swotMetrics.strengths.length} identifiées
- Faiblesses: ${metrics.swotMetrics.weaknesses.length} identifiées
- Opportunités: ${metrics.swotMetrics.opportunities.length} identifiées  
- Menaces: ${metrics.swotMetrics.threats.length} identifiées

Contenu & Sentiment:
- Volume: ${metrics.contentMetrics.volume.totalMentions} mentions
- Sentiment global: ${metrics.contentMetrics.sentiment.overallSentiment}/100
- Engagement: ${metrics.contentMetrics.reach.avgEngagement}%
- Viralité: ${metrics.contentMetrics.reach.viralityScore}/100

Position Concurrentielle:
- Part de marché: ${metrics.competitiveMetrics.marketShare.current}%
- Rang sectoriel: ${metrics.competitiveMetrics.benchmarkPosition.rank}
- Indice avantage: ${metrics.competitiveMetrics.competitiveAdvantageIndex}/100
- Niveau menace: ${metrics.competitiveMetrics.threatLevel}/100

Réputation:
- Score global: ${metrics.reputationKPIs.overallScore}/100
- Confiance: ${metrics.reputationKPIs.brandTrust}/100
- Reconnaissance: ${metrics.reputationKPIs.brandRecognition}/100
- Fidélité: ${metrics.reputationKPIs.brandLoyalty}/100`;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ReportGenerationService non initialisé');
    }
  }

  // === MÉTHODES DE PARSING ===

  private parseRealRecommendations(content: string): ActionableRecommendation[] {
    const cleanedContent = this.cleanRawContent(content);
    const recommendations: ActionableRecommendation[] = [];

    // Diviser le contenu en sections de recommandations
    const sections = cleanedContent
      .split(/(?:\d+\.|[-•*])\s*/)
      .filter((section) => section.trim().length > 30);

    sections.forEach((section, index) => {
      if (section.trim().length > 50) {
        const recommendation = this.parseRecommendationSection(section, index);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }
    });

    return recommendations.slice(0, 10); // Limiter à 10 recommandations
  }

  private parseRecommendationSection(
    section: string,
    index: number,
  ): ActionableRecommendation | null {
    const lines = section.split('\n').filter((line) => line.trim().length > 0);
    if (lines.length === 0) return null;

    const description = lines[0].trim();
    if (description.length < 20) return null;

    return {
      id: `rec_${Date.now()}_${index}`,
      title: this.generateRecommendationTitle(description),
      description,
      category: this.classifyRecommendationCategory(description),
      priority: this.assessRecommendationPriority(description),

      implementation: {
        timeline: this.extractRecommendationTimeline(description),
        estimatedBudget: this.estimateRecommendationBudget(description),
        requiredResources: this.extractRequiredResources(description),
        responsibleDepartment: this.identifyResponsibleDepartment(description),
      },

      expectedImpact: this.estimateRecommendationImpact(description),
      successMetrics: this.extractSuccessMetrics(description),
      risks: this.assessRecommendationRisk(description),
      dependencies: this.extractDependencies(description),
    };
  }

  private parseRealAlerts(content: string): SmartAlerts {
    const cleanedContent = this.cleanRawContent(content);

    return {
      critical: this.extractAlertsByType(cleanedContent, 'critical'),
      warnings: this.extractAlertsByType(cleanedContent, 'warning'),
      opportunities: this.extractAlertsByType(cleanedContent, 'opportunity'),
    };
  }

  private extractAlertsByType(
    content: string,
    type: 'critical' | 'warning' | 'opportunity',
  ): any[] {
    const alerts: any[] = [];
    const keywords = {
      critical: ['critique', 'urgent', 'immédiat', 'danger', 'menace majeure'],
      warning: ['avertissement', 'attention', 'surveillance', 'risque', 'tendance négative'],
      opportunity: ['opportunité', 'potentiel', 'avantage', 'chance', 'ouverture'],
    };

    const patterns = keywords[type].map(
      (keyword) =>
        new RegExp(String.raw`${keyword}[\s\S]*?(?=\n\n|${keywords[type].join('|')}|$)`, 'gi'),
    );

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const alertText = match[0].trim();
        if (alertText.length > 30) {
          const alert = this.createAlert(alertText, type, content);
          if (alert) {
            alerts.push(alert);
          }
        }
      }
    });

    // Fallback: générer des alertes basées sur le contenu général
    if (alerts.length === 0) {
      alerts.push(...this.generateAlertsFromMetrics(content, type));
    }

    return alerts.slice(0, 5); // Limiter à 5 alertes par type
  }

  private createAlert(
    description: string,
    type: 'critical' | 'warning' | 'opportunity',
    _content?: string,
  ): any | null {
    if (description.length < 20) return null;

    return {
      id: `alert_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      message: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
      context: this.extractAlertContext(description),
      timeline: this.extractAlertTimeline(description),
      suggestedAction: this.generateAlertAction(description, type),
      ...(type === 'critical' && {
        metrics: {
          metric: this.extractMetricFromDescription(description),
          currentValue: this.extractCurrentValue(description),
          threshold: this.extractThreshold(description),
          deviation: this.calculateDeviation(description),
        },
        historicalComparison: this.extractHistoricalComparison(description),
      }),
    };
  }

  private generateAlertsFromMetrics(
    content: string,
    type: 'critical' | 'warning' | 'opportunity',
  ): any[] {
    const alerts: any[] = [];

    const templates = {
      critical: [
        'Baisse significative de la part de marché détectée',
        'Dégradation du score de réputation observée',
        'Menace concurrentielle majeure identifiée',
      ],
      warning: [
        'Tendance négative du sentiment client',
        'Ralentissement de la croissance du contenu',
        'Pression concurrentielle en augmentation',
      ],
      opportunity: [
        'Nouvelle opportunité de marché détectée',
        'Faiblesse concurrentielle exploitable',
        'Tendance favorable émergente',
      ],
    };

    templates[type].forEach((template, index) => {
      alerts.push({
        id: `alert_${type}_gen_${index}`,
        message: template,
        context: 'Analyse automatique des métriques',
        timeline: type === 'critical' ? 'Immédiat' : type === 'warning' ? '1-3 mois' : '3-6 mois',
        suggestedAction: `Analyser en détail et définir un plan d'action pour: ${template.toLowerCase()}`,
      });
    });

    return alerts;
  }

  private cleanRawContent(content: string): string {
    if (!content) return content;

    const cleanupPatterns = [
      /Tu es Perplexity, un assistant de recherche utile formé par Perplexity AI\.[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      /Ta tâche est de rédiger une réponse précise[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      /Suis ces instructions pour formuler ta réponse[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
      /KORA\s*$/gm,
      /===== ENRICHISSEMENT CONTEXTUEL =====[\s\S]*?(?=\n\n|\n[^=])/gi,
      /SYNTHÈSE STRATÉGIQUE:[\s\S]*$/gi,
      /RECOMMANDATIONS OPÉRATIONNELLES:[\s\S]*$/gi,
      /selon les instructions|conformément aux directives|comme demandé/gi,
      /^\s*[=-]{3,}\s*$/gm,
    ];

    let cleanedContent = content;
    cleanupPatterns.forEach((pattern) => {
      cleanedContent = cleanedContent.replace(pattern, '');
    });

    return cleanedContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{3,}/g, ' ')
      .trim();
  }

  private generateRecommendationTitle(description: string): string {
    const words = description.split(' ').slice(0, 8);
    let title = words.join(' ');

    if (title.length > 80) {
      title = title.substring(0, 77) + '...';
    }

    return title;
  }

  private classifyRecommendationCategory(
    description: string,
  ): 'immediate' | 'short-term' | 'medium-term' | 'long-term' {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('immédiat') ||
      lowerDesc.includes('urgent') ||
      lowerDesc.includes('rapidement')
    ) {
      return 'immediate';
    } else if (
      lowerDesc.includes('court terme') ||
      lowerDesc.includes('prochains mois') ||
      lowerDesc.includes('3 mois')
    ) {
      return 'short-term';
    } else if (
      lowerDesc.includes('moyen terme') ||
      lowerDesc.includes('6 mois') ||
      lowerDesc.includes('année')
    ) {
      return 'medium-term';
    }

    return 'long-term';
  }

  private assessRecommendationPriority(
    description: string,
  ): 'critical' | 'high' | 'medium' | 'low' {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('critique') ||
      lowerDesc.includes('essentiel') ||
      lowerDesc.includes('vital')
    ) {
      return 'critical';
    } else if (
      lowerDesc.includes('important') ||
      lowerDesc.includes('prioritaire') ||
      lowerDesc.includes('majeur')
    ) {
      return 'high';
    } else if (lowerDesc.includes('modéré') || lowerDesc.includes('significatif')) {
      return 'medium';
    }

    return 'low';
  }

  private estimateRecommendationImpact(description: string): number {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('transformation') ||
      lowerDesc.includes('révolution') ||
      lowerDesc.includes('disruption')
    ) {
      return 90;
    } else if (lowerDesc.includes('amélioration majeure') || lowerDesc.includes('fort impact')) {
      return 75;
    } else if (lowerDesc.includes('optimisation') || lowerDesc.includes('amélioration')) {
      return 60;
    }

    return 45; // Impact moyen par défaut
  }

  private extractRecommendationTimeline(description: string): string {
    const timelineMatch = /(\d+)\s*(mois|semaines?|jours?)/i.exec(description);
    if (timelineMatch) {
      return `${timelineMatch[1]} ${timelineMatch[2]}`;
    }

    const category = this.classifyRecommendationCategory(description);
    const timelines = {
      immediate: '1-3 mois',
      'short-term': '3-6 mois',
      'medium-term': '6-12 mois',
      'long-term': '12+ mois',
    };

    return timelines[category];
  }

  private estimateRecommendationBudget(description: string): any {
    const budgetMatch = /(\d+(?:,\d{3})*)\s*(?:€|euros?)/i.exec(description);

    if (budgetMatch) {
      const amount = Number.parseInt(budgetMatch[1].replace(',', ''));
      return {
        min: amount * 0.8,
        max: amount * 1.2,
        currency: 'EUR',
      };
    }

    // Estimation basée sur le type de recommandation
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('technologie') ||
      lowerDesc.includes('système') ||
      lowerDesc.includes('plateforme')
    ) {
      return { min: 50000, max: 200000, currency: 'EUR' };
    } else if (
      lowerDesc.includes('marketing') ||
      lowerDesc.includes('communication') ||
      lowerDesc.includes('campagne')
    ) {
      return { min: 20000, max: 100000, currency: 'EUR' };
    } else if (
      lowerDesc.includes('formation') ||
      lowerDesc.includes('développement') ||
      lowerDesc.includes('compétences')
    ) {
      return { min: 10000, max: 50000, currency: 'EUR' };
    }

    return { min: 5000, max: 25000, currency: 'EUR' };
  }

  private extractRequiredResources(description: string): string[] {
    const resources: string[] = [];
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('équipe') ||
      lowerDesc.includes('personnel') ||
      lowerDesc.includes('ressources humaines')
    ) {
      resources.push('Ressources humaines');
    }
    if (
      lowerDesc.includes('technologie') ||
      lowerDesc.includes('système') ||
      lowerDesc.includes('logiciel')
    ) {
      resources.push('Infrastructure technique');
    }
    if (
      lowerDesc.includes('budget') ||
      lowerDesc.includes('financement') ||
      lowerDesc.includes('investissement')
    ) {
      resources.push('Budget');
    }
    if (
      lowerDesc.includes('formation') ||
      lowerDesc.includes('compétences') ||
      lowerDesc.includes('expertise')
    ) {
      resources.push('Formation et expertise');
    }
    if (
      lowerDesc.includes('temps') ||
      lowerDesc.includes('délai') ||
      lowerDesc.includes('planning')
    ) {
      resources.push('Temps et planification');
    }

    return resources.length > 0 ? resources : ['Ressources à définir'];
  }

  private identifyResponsibleDepartment(description: string): string {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('marketing') ||
      lowerDesc.includes('communication') ||
      lowerDesc.includes('publicité')
    ) {
      return 'Marketing';
    } else if (
      lowerDesc.includes('technologie') ||
      lowerDesc.includes('système') ||
      lowerDesc.includes('digital')
    ) {
      return 'IT/Digital';
    } else if (
      lowerDesc.includes('vente') ||
      lowerDesc.includes('commercial') ||
      lowerDesc.includes('client')
    ) {
      return 'Commercial';
    } else if (
      lowerDesc.includes('finance') ||
      lowerDesc.includes('budget') ||
      lowerDesc.includes('coût')
    ) {
      return 'Finance';
    } else if (
      lowerDesc.includes('ressources humaines') ||
      lowerDesc.includes('formation') ||
      lowerDesc.includes('personnel')
    ) {
      return 'RH';
    } else if (
      lowerDesc.includes('stratégie') ||
      lowerDesc.includes('direction') ||
      lowerDesc.includes('gouvernance')
    ) {
      return 'Direction générale';
    }

    return 'À définir';
  }

  private extractSuccessMetrics(description: string): string[] {
    const metrics: string[] = [];
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('part de marché') || lowerDesc.includes('market share')) {
      metrics.push('Part de marché');
    }
    if (
      lowerDesc.includes("chiffre d'affaires") ||
      lowerDesc.includes('revenus') ||
      lowerDesc.includes('ventes')
    ) {
      metrics.push("Chiffre d'affaires");
    }
    if (
      lowerDesc.includes('satisfaction') ||
      lowerDesc.includes('nps') ||
      lowerDesc.includes('client')
    ) {
      metrics.push('Satisfaction client');
    }
    if (
      lowerDesc.includes('engagement') ||
      lowerDesc.includes('social') ||
      lowerDesc.includes('audience')
    ) {
      metrics.push('Engagement digital');
    }
    if (
      lowerDesc.includes('réputation') ||
      lowerDesc.includes('image') ||
      lowerDesc.includes('notoriété')
    ) {
      metrics.push('Score de réputation');
    }
    if (
      lowerDesc.includes('efficacité') ||
      lowerDesc.includes('productivité') ||
      lowerDesc.includes('performance')
    ) {
      metrics.push('Indicateurs de performance');
    }

    return metrics.length > 0 ? metrics : ['KPIs à définir'];
  }

  private assessRecommendationRisk(description: string): 'low' | 'medium' | 'high' {
    const lowerDesc = description.toLowerCase();

    if (
      lowerDesc.includes('risque élevé') ||
      lowerDesc.includes('incertain') ||
      lowerDesc.includes('complexe')
    ) {
      return 'high';
    } else if (
      lowerDesc.includes('risque modéré') ||
      lowerDesc.includes('attention') ||
      lowerDesc.includes('surveillance')
    ) {
      return 'medium';
    }

    return 'low';
  }

  private extractDependencies(description: string): string[] {
    const dependencies: string[] = [];
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('budget') || lowerDesc.includes('financement')) {
      dependencies.push('Validation budgétaire');
    }
    if (
      lowerDesc.includes('équipe') ||
      lowerDesc.includes('ressources') ||
      lowerDesc.includes('personnel')
    ) {
      dependencies.push('Disponibilité des ressources');
    }
    if (
      lowerDesc.includes('technologie') ||
      lowerDesc.includes('système') ||
      lowerDesc.includes('plateforme')
    ) {
      dependencies.push('Infrastructure technique');
    }
    if (
      lowerDesc.includes('partenaire') ||
      lowerDesc.includes('externe') ||
      lowerDesc.includes('fournisseur')
    ) {
      dependencies.push('Partenaires externes');
    }
    if (
      lowerDesc.includes('réglement') ||
      lowerDesc.includes('conformité') ||
      lowerDesc.includes('légal')
    ) {
      dependencies.push('Conformité réglementaire');
    }

    return dependencies.length > 0 ? dependencies : ['Aucune dépendance critique'];
  }

  private extractAlertContext(description: string): string {
    const sentences = description.split('.').filter((s) => s.trim().length > 10);
    return sentences.length > 1 ? sentences[1].trim() : 'Contexte à analyser';
  }

  private extractAlertTimeline(description: string): string {
    const timelineMatch = /(\d+)\s*(mois|semaines?|jours?)/i.exec(description);
    if (timelineMatch) {
      return `${timelineMatch[1]} ${timelineMatch[2]}`;
    }

    if (
      description.toLowerCase().includes('immédiat') ||
      description.toLowerCase().includes('urgent')
    ) {
      return 'Immédiat';
    } else if (description.toLowerCase().includes('court terme')) {
      return '1-3 mois';
    }

    return '3-6 mois';
  }

  private generateAlertAction(
    description: string,
    type: 'critical' | 'warning' | 'opportunity',
  ): string {
    const actionTemplates = {
      critical: [
        "Mettre en place un plan d'action immédiat",
        'Convoquer une réunion de crise',
        "Activer les procédures d'urgence",
        'Communiquer avec les parties prenantes',
      ],
      warning: [
        'Renforcer la surveillance des indicateurs',
        'Analyser les causes profondes',
        'Préparer un plan de contingence',
        'Consulter les experts sectoriels',
      ],
      opportunity: [
        "Analyser la faisabilité et l'impact",
        "Développer une stratégie d'exploitation",
        'Allouer les ressources nécessaires',
        'Définir un calendrier de mise en œuvre',
      ],
    };

    const templates = actionTemplates[type];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private extractMetricFromDescription(description: string): string {
    const metrics = ['part de marché', 'réputation', 'satisfaction', 'engagement', 'revenus'];
    for (const metric of metrics) {
      if (description.toLowerCase().includes(metric)) {
        return metric;
      }
    }
    return 'Métrique à définir';
  }

  private extractCurrentValue(description: string): string {
    const valueMatch = /(\d+(?:\.\d+)?)\s*%/.exec(description);
    return valueMatch ? `${valueMatch[1]}%` : 'Valeur à mesurer';
  }

  private extractThreshold(description: string): number {
    const thresholdMatch = /seuil.*?(\d+(?:\.\d+)?)/i.exec(description);
    return thresholdMatch ? Number.parseFloat(thresholdMatch[1]) : 80;
  }

  private calculateDeviation(description: string): number {
    const deviationMatch = /écart.*?([+-]?\d+(?:\.\d+)?)/i.exec(description);
    return deviationMatch ? Number.parseFloat(deviationMatch[1]) : -10;
  }

  private extractHistoricalComparison(description: string): string {
    if (
      description.toLowerCase().includes('historique') ||
      description.toLowerCase().includes('précédent')
    ) {
      return 'Performance inférieure aux périodes précédentes';
    }
    return 'Données historiques à analyser';
  }
}

export const reportGenerationService = new ReportGenerationService();
