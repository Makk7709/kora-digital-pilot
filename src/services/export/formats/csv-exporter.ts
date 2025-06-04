// CSV Export Service
// Extracted from monolithic ReportExportService.ts for better organization

import type { ExportOptions } from '../../../types/BrandIntelligenceTypes';

export class CSVExporter {
  
  generate(report: any, options: ExportOptions): string {
    console.log('📊 Génération export CSV...');
    
    try {
      const csvLines: string[] = [];
      
      // En-tête du rapport
      csvLines.push('Section,Métrique,Valeur,Détails');
      
      // Analyse objective
      if (report.objectiveAnalysis && (!options.sections || options.sections.includes('objectiveAnalysis'))) {
        this.addObjectiveAnalysisToCSV(report.objectiveAnalysis, csvLines);
      }
      
      // Métriques SWOT
      if (report.swotMetrics && (!options.sections || options.sections.includes('swotMetrics'))) {
        this.addSWOTMetricsToCSV(report.swotMetrics, csvLines);
      }
      
      // Métriques concurrentielles
      if (report.competitiveMetrics && (!options.sections || options.sections.includes('competitiveMetrics'))) {
        this.addCompetitiveMetricsToCSV(report.competitiveMetrics, csvLines);
      }
      
      // KPIs réputation
      if (report.reputationKPIs && (!options.sections || options.sections.includes('reputationKPIs'))) {
        this.addReputationKPIsToCSV(report.reputationKPIs, csvLines);
      }
      
      // Recommandations
      if (report.recommendations && (!options.sections || options.sections.includes('recommendations'))) {
        this.addRecommendationsToCSV(report.recommendations, csvLines);
      }
      
      const csvContent = csvLines.join('\n');
      console.log(`✅ Export CSV généré - ${csvLines.length} lignes`);
      
      return csvContent;

    } catch (error) {
      console.error('❌ Erreur génération CSV:', error);
      throw new Error(`Erreur génération CSV: ${error.message}`);
    }
  }

  private addObjectiveAnalysisToCSV(analysis: any, csvLines: string[]): void {
    csvLines.push(`Analyse Objective,Année de fondation,${analysis.brandHistory?.foundingYear || 'N/A'},${analysis.brandHistory?.founders?.join('; ') || 'N/A'}`);
    csvLines.push(`Analyse Objective,Secteur d'activité,${analysis.marketPosition?.sector?.join('; ') || 'N/A'},${analysis.marketPosition?.markets?.join('; ') || 'N/A'}`);
    csvLines.push(`Analyse Objective,Chiffre d'affaires,${analysis.financialHealth?.revenue || 'N/A'},${analysis.financialHealth?.profitability || 'N/A'}`);
    csvLines.push(`Analyse Objective,Score innovation,${analysis.metrics?.innovationIndex || 'N/A'},/100`);
    csvLines.push(`Analyse Objective,Score réputation,${analysis.metrics?.reputationScore || 'N/A'},/100`);
  }

  private addSWOTMetricsToCSV(swot: any, csvLines: string[]): void {
    csvLines.push(`SWOT,Score global,${swot.overallScore || 'N/A'},/100`);
    
    // Forces
    if (swot.strengths && Array.isArray(swot.strengths)) {
      swot.strengths.forEach((strength: any, index: number) => {
        csvLines.push(`SWOT,Force ${index + 1},${this.escapeCSV(strength.item || strength)},Score: ${strength.score || 'N/A'}`);
      });
    }
    
    // Faiblesses
    if (swot.weaknesses && Array.isArray(swot.weaknesses)) {
      swot.weaknesses.forEach((weakness: any, index: number) => {
        csvLines.push(`SWOT,Faiblesse ${index + 1},${this.escapeCSV(weakness.item || weakness)},Sévérité: ${weakness.severity || 'N/A'}`);
      });
    }
    
    // Opportunités
    if (swot.opportunities && Array.isArray(swot.opportunities)) {
      swot.opportunities.forEach((opportunity: any, index: number) => {
        csvLines.push(`SWOT,Opportunité ${index + 1},${this.escapeCSV(opportunity.item || opportunity)},Potentiel: ${opportunity.potential || 'N/A'}`);
      });
    }
    
    // Menaces
    if (swot.threats && Array.isArray(swot.threats)) {
      swot.threats.forEach((threat: any, index: number) => {
        csvLines.push(`SWOT,Menace ${index + 1},${this.escapeCSV(threat.item || threat)},Risque: ${threat.risk || 'N/A'}`);
      });
    }
  }

  private addCompetitiveMetricsToCSV(competitive: any, csvLines: string[]): void {
    csvLines.push(`Concurrentiel,Part de marché actuelle,${competitive.marketShare?.current || 'N/A'},%`);
    csvLines.push(`Concurrentiel,Tendance part de marché,${competitive.marketShare?.trend || 'N/A'},`);
    csvLines.push(`Concurrentiel,Rang sectoriel,${competitive.benchmarkPosition?.rank || 'N/A'},`);
    csvLines.push(`Concurrentiel,Index avantage concurrentiel,${competitive.competitiveAdvantageIndex || 'N/A'},/100`);
    csvLines.push(`Concurrentiel,Niveau de menace,${competitive.threatLevel || 'N/A'},/100`);
  }

  private addReputationKPIsToCSV(reputation: any, csvLines: string[]): void {
    csvLines.push(`Réputation,Score global,${reputation.overallScore || 'N/A'},/100`);
    csvLines.push(`Réputation,Confiance marque,${reputation.brandTrust || 'N/A'},/100`);
    csvLines.push(`Réputation,Reconnaissance marque,${reputation.brandRecognition || 'N/A'},/100`);
    csvLines.push(`Réputation,Fidélité marque,${reputation.brandLoyalty || 'N/A'},/100`);
    csvLines.push(`Réputation,Résilience aux crises,${reputation.crisisResilience || 'N/A'},/100`);
  }

  private addRecommendationsToCSV(recommendations: any[], csvLines: string[]): void {
    if (Array.isArray(recommendations)) {
      recommendations.forEach((rec: any, index: number) => {
        csvLines.push(`Recommandations,Recommandation ${index + 1},${this.escapeCSV(rec.title || rec.description || rec)},Priorité: ${rec.priority || 'N/A'}`);
        csvLines.push(`Recommandations,Impact attendu ${index + 1},${rec.expectedImpact || rec.estimatedImpact || 'N/A'},/100`);
        csvLines.push(`Recommandations,Timeline ${index + 1},${rec.implementation?.timeline || rec.timeline || 'N/A'},`);
      });
    }
  }

  private escapeCSV(text: string | any): string {
    if (typeof text !== 'string') {
      text = String(text);
    }
    
    // Échapper les guillemets et les virgules
    if (text.includes('"') || text.includes(',') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    
    return text;
  }

  validateContent(report: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier qu'il y a du contenu à exporter
    const hasContent = report.objectiveAnalysis || 
                      report.swotMetrics || 
                      report.competitiveMetrics || 
                      report.reputationKPIs || 
                      report.recommendations;

    if (!hasContent) {
      errors.push('Aucun contenu disponible pour export CSV');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 