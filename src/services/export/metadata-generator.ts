// Metadata Generator Service
// Extracted from monolithic ReportExportService.ts for better organization

export class MetadataGenerator {
  
  /**
   * Génère les métadonnées enrichies pour un export
   */
  generateMetadata(report: any, options: any, startTime: number): any {
    const executionTime = Date.now() - startTime;
    
    return {
      generatedAt: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      reportType: 'deep-research',
      brandName: report.brandName || 'Unknown',
      format: options.format,
      sectionsIncluded: options.sections || ['all'],
      dataQualityScore: this.calculateDataQualityScore(report),
      confidenceLevel: report.confidenceScore || 0,
      totalDataPoints: this.countDataPoints(report),
      version: '1.0.0'
    };
  }

  /**
   * Calcule un score de qualité des données
   */
  private calculateDataQualityScore(report: any): number {
    let score = 0;
    let totalChecks = 0;

    // Vérifications de base
    if (report.objectiveAnalysis) {
      score += 20;
      totalChecks += 20;
    }
    if (report.swotMetrics) {
      score += 20;
      totalChecks += 20;
    }
    if (report.competitiveMetrics) {
      score += 20;
      totalChecks += 20;
    }
    if (report.reputationKPIs) {
      score += 20;
      totalChecks += 20;
    }
    if (report.recommendations && report.recommendations.length > 0) {
      score += 20;
      totalChecks += 20;
    }

    return Math.round((score / totalChecks) * 100);
  }

  /**
   * Compte les points de données dans le rapport
   */
  private countDataPoints(report: any): number {
    let count = 0;
    
    if (report.objectiveAnalysis) count += 10;
    if (report.strategicAnalysis) count += 8;
    if (report.swotMetrics) count += 15;
    if (report.contentMetrics) count += 12;
    if (report.competitiveMetrics) count += 10;
    if (report.reputationKPIs) count += 8;
    if (report.recommendations) count += report.recommendations.length;
    if (report.alerts) count += 5;

    return count;
  }
} 