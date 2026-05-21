// Quality Enhancement Service
// Extracted from monolithic ReportExportService.ts for better organization

type AnyRecord = Record<string, unknown>;

type RecommendationLike = {
  title?: string;
  description?: string;
  implementation?: { steps?: unknown } & AnyRecord;
} & AnyRecord;

type QualityAssessableReport = {
  objectiveAnalysis?: unknown;
  swotMetrics?: unknown;
  recommendations?: unknown[];
  confidenceScore?: number;
} & AnyRecord;

export class QualityEnhancementService {
  /**
   * Améliore la qualité d'un rapport avant export
   */
  enhanceReport(report: AnyRecord): AnyRecord {
    const enhanced: AnyRecord = { ...report };

    enhanced.objectiveAnalysis = this.enhanceObjectiveAnalysis(
      enhanced.objectiveAnalysis as AnyRecord | undefined,
    );
    enhanced.strategicAnalysis = this.enhanceStrategicAnalysis(
      enhanced.strategicAnalysis as AnyRecord | undefined,
    );
    enhanced.recommendations = this.enhanceRecommendations(
      enhanced.recommendations as RecommendationLike[] | undefined,
    );

    enhanced.swotMetrics = this.normalizeMetrics(enhanced.swotMetrics as AnyRecord | undefined);
    enhanced.competitiveMetrics = this.normalizeMetrics(
      enhanced.competitiveMetrics as AnyRecord | undefined,
    );

    return enhanced;
  }

  /**
   * Améliore l'analyse objective
   */
  private enhanceObjectiveAnalysis(analysis: AnyRecord | undefined): AnyRecord | undefined {
    if (!analysis) return analysis;

    const enhanced: AnyRecord = { ...analysis };

    if (typeof enhanced.brandHistory === 'string') {
      enhanced.brandHistory = this.enhanceText(enhanced.brandHistory);
    }

    if (typeof enhanced.marketPosition === 'string') {
      enhanced.marketPosition = this.enhanceText(enhanced.marketPosition);
    }

    if (typeof enhanced.financialHealth === 'string') {
      enhanced.financialHealth = this.enhanceText(enhanced.financialHealth);
    }

    return enhanced;
  }

  /**
   * Améliore l'analyse stratégique
   */
  private enhanceStrategicAnalysis(analysis: AnyRecord | undefined): AnyRecord | undefined {
    if (!analysis) return analysis;

    const enhanced: AnyRecord = { ...analysis };

    if (typeof enhanced.coreStrategy === 'string') {
      enhanced.coreStrategy = this.enhanceText(enhanced.coreStrategy);
    }

    if (Array.isArray(enhanced.competitiveAdvantage)) {
      enhanced.competitiveAdvantage = (enhanced.competitiveAdvantage as string[]).map(
        (advantage: string) => this.enhanceText(advantage),
      );
    }

    return enhanced;
  }

  /**
   * Améliore les recommandations
   */
  private enhanceRecommendations(
    recommendations: RecommendationLike[] | undefined,
  ): RecommendationLike[] | undefined {
    if (!Array.isArray(recommendations)) return recommendations;

    return recommendations.map((rec) => ({
      ...rec,
      title: this.enhanceText(rec.title || ''),
      description: this.enhanceText(rec.description || ''),
      implementation: rec.implementation
        ? {
            ...rec.implementation,
            steps: Array.isArray(rec.implementation.steps)
              ? (rec.implementation.steps as string[]).map((step: string) => this.enhanceText(step))
              : rec.implementation.steps,
          }
        : undefined,
    }));
  }

  /**
   * Normalise les métriques
   */
  private normalizeMetrics(metrics: AnyRecord | undefined): AnyRecord | undefined {
    if (!metrics) return metrics;

    const normalized: AnyRecord = { ...metrics };

    Object.keys(normalized).forEach((key) => {
      const value = normalized[key];
      if (typeof value === 'number' && key.includes('Score')) {
        normalized[key] = Math.max(0, Math.min(100, value));
      }
    });

    return normalized;
  }

  /**
   * Améliore la qualité d'un texte
   */
  private enhanceText(text: string): string {
    if (!text || typeof text !== 'string') return text;

    let enhanced = text;

    enhanced = enhanced.replace(/\s+/g, ' ');
    enhanced = enhanced.trim();

    enhanced = enhanced.replace(/\s+([,.!?;:])/g, '$1');
    enhanced = enhanced.replace(/([,.!?;:])\s*/g, '$1 ');

    enhanced = enhanced.replace(
      /([.!?])\s+([a-z])/g,
      (_match, punct, letter) => punct + ' ' + letter.toUpperCase(),
    );

    if (enhanced.length > 0) {
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    }

    return enhanced;
  }

  /**
   * Évalue la qualité d'un rapport
   */
  assessQuality(report: QualityAssessableReport): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    if (!report.objectiveAnalysis) {
      issues.push('Analyse objective manquante');
      score -= 20;
    }

    if (!report.swotMetrics) {
      issues.push('Métriques SWOT manquantes');
      score -= 15;
    }

    if (!report.recommendations || report.recommendations.length === 0) {
      issues.push('Aucune recommandation fournie');
      score -= 15;
    }

    if (report.recommendations && report.recommendations.length < 3) {
      suggestions.push("Considérer d'ajouter plus de recommandations (minimum 3)");
    }

    if (report.confidenceScore && report.confidenceScore < 70) {
      suggestions.push('Score de confiance faible - vérifier la qualité des données');
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
    };
  }
}
