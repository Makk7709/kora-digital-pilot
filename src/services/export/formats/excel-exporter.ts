// Excel Export Service
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

export class ExcelExporter {
  generate(report: DeepResearchReport, options: ExportOptions): string {
    logger.debug('Generating Excel export (CSV-Tab format)');

    try {
      const excelLines: string[] = [];

      // En-tête du rapport Excel avec métadonnées
      excelLines.push(
        `Rapport Brand Intelligence\t${report.brandName || 'N/A'}\t\t`,
        `Date d'export\t${new Date().toLocaleDateString('fr-FR')}\t\t`,
        `Score de confiance\t${report.confidenceScore || 'N/A'}/100\t\t`,
        '',
      );

      // En-tête des colonnes
      excelLines.push('Section\tMétrique\tValeur\tDétails');

      // Analyse objective
      if (
        report.objectiveAnalysis &&
        (!options.sections || options.sections.includes('objectiveAnalysis'))
      ) {
        this.addObjectiveAnalysisToExcel(report.objectiveAnalysis, excelLines);
      }

      // Métriques SWOT
      if (report.swotMetrics && (!options.sections || options.sections.includes('swotMetrics'))) {
        this.addSWOTMetricsToExcel(report.swotMetrics, excelLines);
      }

      // Métriques concurrentielles
      if (
        report.competitiveMetrics &&
        (!options.sections || options.sections.includes('competitiveMetrics'))
      ) {
        this.addCompetitiveMetricsToExcel(report.competitiveMetrics, excelLines);
      }

      // KPIs réputation
      if (
        report.reputationKPIs &&
        (!options.sections || options.sections.includes('reputationKPIs'))
      ) {
        this.addReputationKPIsToExcel(report.reputationKPIs, excelLines);
      }

      // Recommandations
      if (
        report.recommendations &&
        (!options.sections || options.sections.includes('recommendations'))
      ) {
        this.addRecommendationsToExcel(report.recommendations, excelLines);
      }

      const excelContent = excelLines.join('\n');
      logger.debug(`Excel export generated: ${excelLines.length} lines`);
      return excelContent;
    } catch (error) {
      logger.error('Excel export failed', { error });
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Erreur génération Excel: ${message}`);
    }
  }

  private addObjectiveAnalysisToExcel(analysis: ObjectiveAnalysis, excelLines: string[]): void {
    excelLines.push('', 'ANALYSE OBJECTIVE\t\t\t');

    excelLines.push(
      `Analyse Objective\tAnnée de fondation\t${analysis.brandHistory?.foundingYear || 'N/A'}\t${analysis.brandHistory?.founders?.join('; ') || 'N/A'}`,
      `Analyse Objective\tSecteur d'activité\t${analysis.marketPosition?.sector?.join('; ') || 'N/A'}\t${analysis.marketPosition?.markets?.join('; ') || 'N/A'}`,
      `Analyse Objective\tChiffre d'affaires\t${analysis.financialHealth?.revenue || 'N/A'}\t${analysis.financialHealth?.profitability || 'N/A'}`,
      `Analyse Objective\tScore innovation\t${analysis.metrics?.innovationIndex || 'N/A'}\t/100`,
      `Analyse Objective\tScore réputation\t${analysis.metrics?.reputationScore || 'N/A'}\t/100`,
    );
  }

  private addSWOTMetricsToExcel(swot: SWOTMetrics, excelLines: string[]): void {
    excelLines.push('', 'ANALYSE SWOT\t\t\t');

    const overall = (swot as { overallScore?: number }).overallScore;
    excelLines.push(`SWOT\tScore global\t${overall ?? 'N/A'}\t/100`);

    const breakdown = swot.detailedBreakdown ?? ({} as Record<string, SwotItem[] | undefined>);

    if (Array.isArray(breakdown.strengths)) {
      excelLines.push('SWOT\tFORCES\t\t');
      breakdown.strengths.forEach((strength: SwotItem, index: number) => {
        excelLines.push(
          `SWOT\tForce ${index + 1}\t${this.escapeExcel(strength.item ?? '')}\tScore: ${strength.score ?? 'N/A'}`,
        );
      });
    }

    if (Array.isArray(breakdown.weaknesses)) {
      excelLines.push('SWOT\tFAIBLESSES\t\t');
      breakdown.weaknesses.forEach((weakness: SwotItem, index: number) => {
        excelLines.push(
          `SWOT\tFaiblesse ${index + 1}\t${this.escapeExcel(weakness.item ?? '')}\tSévérité: ${weakness.severity ?? 'N/A'}`,
        );
      });
    }

    if (Array.isArray(breakdown.opportunities)) {
      excelLines.push('SWOT\tOPPORTUNITÉS\t\t');
      breakdown.opportunities.forEach((opportunity: SwotItem, index: number) => {
        excelLines.push(
          `SWOT\tOpportunité ${index + 1}\t${this.escapeExcel(opportunity.item ?? '')}\tPotentiel: ${opportunity.potential ?? 'N/A'}`,
        );
      });
    }

    if (Array.isArray(breakdown.threats)) {
      excelLines.push('SWOT\tMENACES\t\t');
      breakdown.threats.forEach((threat: SwotItem, index: number) => {
        excelLines.push(
          `SWOT\tMenace ${index + 1}\t${this.escapeExcel(threat.item ?? '')}\tRisque: ${threat.risk ?? 'N/A'}`,
        );
      });
    }
  }

  private addCompetitiveMetricsToExcel(
    competitive: CompetitiveMetrics,
    excelLines: string[],
  ): void {
    excelLines.push('', 'ANALYSE CONCURRENTIELLE\t\t\t');

    excelLines.push(
      `Concurrentiel\tPart de marché actuelle\t${competitive.marketShare?.current || 'N/A'}\t%`,
      `Concurrentiel\tTendance part de marché\t${competitive.marketShare?.trend || 'N/A'}\t`,
      `Concurrentiel\tRang sectoriel\t${competitive.benchmarkPosition?.rank || 'N/A'}\t`,
      `Concurrentiel\tIndex avantage concurrentiel\t${competitive.competitiveAdvantageIndex || 'N/A'}\t/100`,
      `Concurrentiel\tNiveau de menace\t${competitive.threatLevel || 'N/A'}\t/100`,
    );
  }

  private addReputationKPIsToExcel(reputation: ReputationKPIs, excelLines: string[]): void {
    excelLines.push('', 'RÉPUTATION & KPIS\t\t\t');

    excelLines.push(
      `Réputation\tScore global\t${reputation.overallScore || 'N/A'}\t/100`,
      `Réputation\tConfiance marque\t${reputation.brandTrust || 'N/A'}\t/100`,
      `Réputation\tReconnaissance marque\t${reputation.brandRecognition || 'N/A'}\t/100`,
      `Réputation\tFidélité marque\t${reputation.brandLoyalty || 'N/A'}\t/100`,
      `Réputation\tRésilience aux crises\t${reputation.crisisResilience || 'N/A'}\t/100`,
    );
  }

  private addRecommendationsToExcel(
    recommendations: ActionableRecommendation[],
    excelLines: string[],
  ): void {
    excelLines.push('', 'RECOMMANDATIONS STRATÉGIQUES\t\t\t');

    if (Array.isArray(recommendations)) {
      recommendations.forEach((rec: ActionableRecommendation, index: number) => {
        excelLines.push(
          `Recommandations\tRecommandation ${index + 1}\t${this.escapeExcel(rec.title || rec.description || rec)}\tPriorité: ${rec.priority || 'N/A'}`,
          `Recommandations\tImpact attendu ${index + 1}\t${rec.expectedImpact || rec.estimatedImpact || 'N/A'}\t/100`,
          `Recommandations\tTimeline ${index + 1}\t${rec.implementation?.timeline || rec.timeline || 'N/A'}\t`,
        );

        // Espacement entre recommandations
        if (index < recommendations.length - 1) {
          excelLines.push('\t\t\t');
        }
      });
    }
  }

  private escapeExcel(text: unknown): string {
    const str = typeof text === 'string' ? text : String(text);

    return str
      .replace(/\t/g, ' ') // Remplacer tabulations par espaces
      .replace(/\n/g, ' ') // Remplacer retours à la ligne par espaces
      .replace(/\r/g, '') // Supprimer retours chariot
      .replace(/"/g, '""') // Échapper guillemets
      .trim();
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
      errors.push('Aucun contenu disponible pour export Excel');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
