// Quality Enhancement Service
// Extracted from monolithic ReportExportService.ts for better organization

export class QualityEnhancementService {

  /**
   * Améliore la qualité d'un rapport avant export
   */
  enhanceReport(report: any): any {
    const enhanced = { ...report };

    // Amélioration du contenu textuel
    enhanced.objectiveAnalysis = this.enhanceObjectiveAnalysis(enhanced.objectiveAnalysis);
    enhanced.strategicAnalysis = this.enhanceStrategicAnalysis(enhanced.strategicAnalysis);
    enhanced.recommendations = this.enhanceRecommendations(enhanced.recommendations);

    // Nettoyage et normalisation des données
    enhanced.swotMetrics = this.normalizeMetrics(enhanced.swotMetrics);
    enhanced.competitiveMetrics = this.normalizeMetrics(enhanced.competitiveMetrics);

    return enhanced;
  }

  /**
   * Améliore l'analyse objective
   */
  private enhanceObjectiveAnalysis(analysis: any): any {
    if (!analysis) return analysis;

    const enhanced = { ...analysis };

    // Amélioration de l'historique de marque
    if (typeof enhanced.brandHistory === 'string') {
      enhanced.brandHistory = this.enhanceText(enhanced.brandHistory);
    }

    // Amélioration de la position marché
    if (typeof enhanced.marketPosition === 'string') {
      enhanced.marketPosition = this.enhanceText(enhanced.marketPosition);
    }

    // Amélioration de la santé financière
    if (typeof enhanced.financialHealth === 'string') {
      enhanced.financialHealth = this.enhanceText(enhanced.financialHealth);
    }

    return enhanced;
  }

  /**
   * Améliore l'analyse stratégique
   */
  private enhanceStrategicAnalysis(analysis: any): any {
    if (!analysis) return analysis;

    const enhanced = { ...analysis };

    // Amélioration de la stratégie de base
    if (enhanced.coreStrategy) {
      enhanced.coreStrategy = this.enhanceText(enhanced.coreStrategy);
    }

    // Amélioration des avantages concurrentiels
    if (Array.isArray(enhanced.competitiveAdvantage)) {
      enhanced.competitiveAdvantage = enhanced.competitiveAdvantage.map((advantage: string) =>
        this.enhanceText(advantage)
      );
    }

    return enhanced;
  }

  /**
   * Améliore les recommandations
   */
  private enhanceRecommendations(recommendations: any[]): any[] {
    if (!Array.isArray(recommendations)) return recommendations;

    return recommendations.map(rec => ({
      ...rec,
      title: this.enhanceText(rec.title || ''),
      description: this.enhanceText(rec.description || ''),
      implementation: rec.implementation ? {
        ...rec.implementation,
        steps: Array.isArray(rec.implementation.steps) 
          ? rec.implementation.steps.map((step: string) => this.enhanceText(step))
          : rec.implementation.steps
      } : undefined
    }));
  }

  /**
   * Normalise les métriques
   */
  private normalizeMetrics(metrics: any): any {
    if (!metrics) return metrics;

    const normalized = { ...metrics };

    // Normalisation des scores (0-100)
    Object.keys(normalized).forEach(key => {
      if (typeof normalized[key] === 'number' && key.includes('Score')) {
        normalized[key] = Math.max(0, Math.min(100, normalized[key]));
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

    // Suppression des espaces multiples
    enhanced = enhanced.replace(/\s+/g, ' ');

    // Suppression des espaces en début/fin
    enhanced = enhanced.trim();

    // Correction des ponctuations
    enhanced = enhanced.replace(/\s+([,.!?;:])/g, '$1');
    enhanced = enhanced.replace(/([,.!?;:])\s*/g, '$1 ');

    // Capitalisation après ponctuation
    enhanced = enhanced.replace(/([.!?])\s+([a-z])/g, (match, punct, letter) => 
      punct + ' ' + letter.toUpperCase()
    );

    // Capitalisation du début
    if (enhanced.length > 0) {
      enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    }

    return enhanced;
  }

  /**
   * Évalue la qualité d'un rapport
   */
  assessQuality(report: any): {
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Vérification de la complétude
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

    // Suggestions d'amélioration
    if (report.recommendations && report.recommendations.length < 3) {
      suggestions.push('Considérer d\'ajouter plus de recommandations (minimum 3)');
    }

    if (report.confidenceScore && report.confidenceScore < 70) {
      suggestions.push('Score de confiance faible - vérifier la qualité des données');
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions
    };
  }
} 