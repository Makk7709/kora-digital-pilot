// CSV Export Service
// Extracted from monolithic ReportExportService.ts for better organization

import type {
  ActionableRecommendation,
  CompetitiveMetrics,
  DeepResearchReport,
  ExportOptions,
  ObjectiveAnalysis,
  ReputationKPIs,
  SWOTMetrics,
} from '../../../types/BrandIntelligenceTypes';
import { logger } from '../../../lib/logger';

type SwotItem = {
  item?: string;
  score?: number;
  severity?: number;
  potential?: number;
  risk?: number;
};

export class CSVExporter {
  generate(report: DeepResearchReport, options: ExportOptions): string {
    logger.debug('Generating CSV export');

    try {
      const csvLines: string[] = [];

      // En-tête du rapport
      csvLines.push('Section,Métrique,Valeur,Détails');

      // Analyse objective
      if (
        report.objectiveAnalysis &&
        (!options.sections || options.sections.includes('objectiveAnalysis'))
      ) {
        this.addObjectiveAnalysisToCSV(report.objectiveAnalysis, csvLines);
      }

      // Métriques SWOT
      if (report.swotMetrics && (!options.sections || options.sections.includes('swotMetrics'))) {
        this.addSWOTMetricsToCSV(report.swotMetrics, csvLines);
      }

      // Métriques concurrentielles
      if (
        report.competitiveMetrics &&
        (!options.sections || options.sections.includes('competitiveMetrics'))
      ) {
        this.addCompetitiveMetricsToCSV(report.competitiveMetrics, csvLines);
      }

      // KPIs réputation
      if (
        report.reputationKPIs &&
        (!options.sections || options.sections.includes('reputationKPIs'))
      ) {
        this.addReputationKPIsToCSV(report.reputationKPIs, csvLines);
      }

      // Recommandations
      if (
        report.recommendations &&
        (!options.sections || options.sections.includes('recommendations'))
      ) {
        this.addRecommendationsToCSV(report.recommendations, csvLines);
      }

      const csvContent = csvLines.join('\n');
      logger.debug(`CSV export generated: ${csvLines.length} lines`);
      return csvContent;
    } catch (error) {
      logger.error('CSV export failed', { error });
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Erreur génération CSV: ${message}`);
    }
  }

  private addObjectiveAnalysisToCSV(analysis: ObjectiveAnalysis, csvLines: string[]): void {
    csvLines.push(
      `Analyse Objective,Année de fondation,${analysis.brandHistory?.foundingYear || 'N/A'},${analysis.brandHistory?.founders?.join('; ') || 'N/A'}`,
    );
    csvLines.push(
      `Analyse Objective,Secteur d'activité,${analysis.marketPosition?.sector?.join('; ') || 'N/A'},${analysis.marketPosition?.markets?.join('; ') || 'N/A'}`,
    );
    csvLines.push(
      `Analyse Objective,Chiffre d'affaires,${analysis.financialHealth?.revenue || 'N/A'},${analysis.financialHealth?.profitability || 'N/A'}`,
    );
    csvLines.push(
      `Analyse Objective,Score innovation,${analysis.metrics?.innovationIndex || 'N/A'},/100`,
    );
    csvLines.push(
      `Analyse Objective,Score réputation,${analysis.metrics?.reputationScore || 'N/A'},/100`,
    );
  }

  private addSWOTMetricsToCSV(swot: SWOTMetrics, csvLines: string[]): void {
    const overall = (swot as { overallScore?: number }).overallScore;
    csvLines.push(`SWOT,Score global,${overall ?? 'N/A'},/100`);

    const breakdown = swot.detailedBreakdown ?? ({} as Record<string, SwotItem[] | undefined>);

    if (Array.isArray(breakdown.strengths)) {
      breakdown.strengths.forEach((strength: SwotItem, index: number) => {
        csvLines.push(
          `SWOT,Force ${index + 1},${this.escapeCSV(strength.item ?? '')},Score: ${strength.score ?? 'N/A'}`,
        );
      });
    }

    if (Array.isArray(breakdown.weaknesses)) {
      breakdown.weaknesses.forEach((weakness: SwotItem, index: number) => {
        csvLines.push(
          `SWOT,Faiblesse ${index + 1},${this.escapeCSV(weakness.item ?? '')},Sévérité: ${weakness.severity ?? 'N/A'}`,
        );
      });
    }

    if (Array.isArray(breakdown.opportunities)) {
      breakdown.opportunities.forEach((opportunity: SwotItem, index: number) => {
        csvLines.push(
          `SWOT,Opportunité ${index + 1},${this.escapeCSV(opportunity.item ?? '')},Potentiel: ${opportunity.potential ?? 'N/A'}`,
        );
      });
    }

    if (Array.isArray(breakdown.threats)) {
      breakdown.threats.forEach((threat: SwotItem, index: number) => {
        csvLines.push(
          `SWOT,Menace ${index + 1},${this.escapeCSV(threat.item ?? '')},Risque: ${threat.risk ?? 'N/A'}`,
        );
      });
    }
  }

  private addCompetitiveMetricsToCSV(competitive: CompetitiveMetrics, csvLines: string[]): void {
    csvLines.push(
      `Concurrentiel,Part de marché actuelle,${competitive.marketShare?.current || 'N/A'},%`,
    );
    csvLines.push(
      `Concurrentiel,Tendance part de marché,${competitive.marketShare?.trend || 'N/A'},`,
    );
    csvLines.push(`Concurrentiel,Rang sectoriel,${competitive.benchmarkPosition?.rank || 'N/A'},`);
    csvLines.push(
      `Concurrentiel,Index avantage concurrentiel,${competitive.competitiveAdvantageIndex || 'N/A'},/100`,
    );
    csvLines.push(`Concurrentiel,Niveau de menace,${competitive.threatLevel || 'N/A'},/100`);
  }

  private addReputationKPIsToCSV(reputation: ReputationKPIs, csvLines: string[]): void {
    csvLines.push(`Réputation,Score global,${reputation.overallScore || 'N/A'},/100`);
    csvLines.push(`Réputation,Confiance marque,${reputation.brandTrust || 'N/A'},/100`);
    csvLines.push(`Réputation,Reconnaissance marque,${reputation.brandRecognition || 'N/A'},/100`);
    csvLines.push(`Réputation,Fidélité marque,${reputation.brandLoyalty || 'N/A'},/100`);
    csvLines.push(`Réputation,Résilience aux crises,${reputation.crisisResilience || 'N/A'},/100`);
  }

  private addRecommendationsToCSV(
    recommendations: ActionableRecommendation[],
    csvLines: string[],
  ): void {
    if (Array.isArray(recommendations)) {
      recommendations.forEach((rec: ActionableRecommendation, index: number) => {
        csvLines.push(
          `Recommandations,Recommandation ${index + 1},${this.escapeCSV(rec.title || rec.description || rec)},Priorité: ${rec.priority || 'N/A'}`,
        );
        csvLines.push(
          `Recommandations,Impact attendu ${index + 1},${rec.expectedImpact || rec.estimatedImpact || 'N/A'},/100`,
        );
        csvLines.push(
          `Recommandations,Timeline ${index + 1},${rec.implementation?.timeline || rec.timeline || 'N/A'},`,
        );
      });
    }
  }

  private escapeCSV(text: unknown): string {
    const str = typeof text === 'string' ? text : String(text);
    // Échapper les guillemets et les virgules
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  validateContent(report: DeepResearchReport): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier qu'il y a du contenu à exporter
    const hasContent =
      report.objectiveAnalysis ||
      report.swotMetrics ||
      report.competitiveMetrics ||
      report.reputationKPIs ||
      report.recommendations;

    if (!hasContent) {
      errors.push('Aucun contenu disponible pour export CSV');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
