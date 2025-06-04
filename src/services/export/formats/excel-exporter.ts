// Excel Export Service
// Extracted from monolithic ReportExportService.ts for better organization

import type { ExportOptions } from '../../../types/BrandIntelligenceTypes';

export class ExcelExporter {
  
  generate(report: any, options: ExportOptions): string {
    console.log('📊 Génération export Excel (format CSV-Tab)...');
    
    try {
      const excelLines: string[] = [];
      
      // En-tête du rapport Excel avec métadonnées
      excelLines.push(`Rapport Brand Intelligence\t${report.brandName || 'N/A'}\t\t`);
      excelLines.push(`Date d'export\t${new Date().toLocaleDateString('fr-FR')}\t\t`);
      excelLines.push(`Score de confiance\t${report.confidenceScore || 'N/A'}/100\t\t`);
      excelLines.push(''); // Ligne vide
      
      // En-tête des colonnes
      excelLines.push('Section\tMétrique\tValeur\tDétails');
      
      // Analyse objective
      if (report.objectiveAnalysis && (!options.sections || options.sections.includes('objectiveAnalysis'))) {
        this.addObjectiveAnalysisToExcel(report.objectiveAnalysis, excelLines);
      }
      
      // Métriques SWOT
      if (report.swotMetrics && (!options.sections || options.sections.includes('swotMetrics'))) {
        this.addSWOTMetricsToExcel(report.swotMetrics, excelLines);
      }
      
      // Métriques concurrentielles
      if (report.competitiveMetrics && (!options.sections || options.sections.includes('competitiveMetrics'))) {
        this.addCompetitiveMetricsToExcel(report.competitiveMetrics, excelLines);
      }
      
      // KPIs réputation
      if (report.reputationKPIs && (!options.sections || options.sections.includes('reputationKPIs'))) {
        this.addReputationKPIsToExcel(report.reputationKPIs, excelLines);
      }
      
      // Recommandations
      if (report.recommendations && (!options.sections || options.sections.includes('recommendations'))) {
        this.addRecommendationsToExcel(report.recommendations, excelLines);
      }
      
      const excelContent = excelLines.join('\n');
      console.log(`✅ Export Excel généré - ${excelLines.length} lignes`);
      
      return excelContent;

    } catch (error) {
      console.error('❌ Erreur génération Excel:', error);
      throw new Error(`Erreur génération Excel: ${error.message}`);
    }
  }

  private addObjectiveAnalysisToExcel(analysis: any, excelLines: string[]): void {
    excelLines.push(''); // Ligne de séparation
    excelLines.push('ANALYSE OBJECTIVE\t\t\t');
    
    excelLines.push(`Analyse Objective\tAnnée de fondation\t${analysis.brandHistory?.foundingYear || 'N/A'}\t${analysis.brandHistory?.founders?.join('; ') || 'N/A'}`);
    excelLines.push(`Analyse Objective\tSecteur d'activité\t${analysis.marketPosition?.sector?.join('; ') || 'N/A'}\t${analysis.marketPosition?.markets?.join('; ') || 'N/A'}`);
    excelLines.push(`Analyse Objective\tChiffre d'affaires\t${analysis.financialHealth?.revenue || 'N/A'}\t${analysis.financialHealth?.profitability || 'N/A'}`);
    excelLines.push(`Analyse Objective\tScore innovation\t${analysis.metrics?.innovationIndex || 'N/A'}\t/100`);
    excelLines.push(`Analyse Objective\tScore réputation\t${analysis.metrics?.reputationScore || 'N/A'}\t/100`);
  }

  private addSWOTMetricsToExcel(swot: any, excelLines: string[]): void {
    excelLines.push(''); // Ligne de séparation
    excelLines.push('ANALYSE SWOT\t\t\t');
    
    excelLines.push(`SWOT\tScore global\t${swot.overallScore || 'N/A'}\t/100`);
    
    // Forces
    if (swot.strengths && Array.isArray(swot.strengths)) {
      excelLines.push('SWOT\tFORCES\t\t');
      swot.strengths.forEach((strength: any, index: number) => {
        excelLines.push(`SWOT\tForce ${index + 1}\t${this.escapeExcel(strength.item || strength)}\tScore: ${strength.score || 'N/A'}`);
      });
    }
    
    // Faiblesses
    if (swot.weaknesses && Array.isArray(swot.weaknesses)) {
      excelLines.push('SWOT\tFAIBLESSES\t\t');
      swot.weaknesses.forEach((weakness: any, index: number) => {
        excelLines.push(`SWOT\tFaiblesse ${index + 1}\t${this.escapeExcel(weakness.item || weakness)}\tSévérité: ${weakness.severity || 'N/A'}`);
      });
    }
    
    // Opportunités
    if (swot.opportunities && Array.isArray(swot.opportunities)) {
      excelLines.push('SWOT\tOPPORTUNITÉS\t\t');
      swot.opportunities.forEach((opportunity: any, index: number) => {
        excelLines.push(`SWOT\tOpportunité ${index + 1}\t${this.escapeExcel(opportunity.item || opportunity)}\tPotentiel: ${opportunity.potential || 'N/A'}`);
      });
    }
    
    // Menaces
    if (swot.threats && Array.isArray(swot.threats)) {
      excelLines.push('SWOT\tMENACES\t\t');
      swot.threats.forEach((threat: any, index: number) => {
        excelLines.push(`SWOT\tMenace ${index + 1}\t${this.escapeExcel(threat.item || threat)}\tRisque: ${threat.risk || 'N/A'}`);
      });
    }
  }

  private addCompetitiveMetricsToExcel(competitive: any, excelLines: string[]): void {
    excelLines.push(''); // Ligne de séparation
    excelLines.push('ANALYSE CONCURRENTIELLE\t\t\t');
    
    excelLines.push(`Concurrentiel\tPart de marché actuelle\t${competitive.marketShare?.current || 'N/A'}\t%`);
    excelLines.push(`Concurrentiel\tTendance part de marché\t${competitive.marketShare?.trend || 'N/A'}\t`);
    excelLines.push(`Concurrentiel\tRang sectoriel\t${competitive.benchmarkPosition?.rank || 'N/A'}\t`);
    excelLines.push(`Concurrentiel\tIndex avantage concurrentiel\t${competitive.competitiveAdvantageIndex || 'N/A'}\t/100`);
    excelLines.push(`Concurrentiel\tNiveau de menace\t${competitive.threatLevel || 'N/A'}\t/100`);
  }

  private addReputationKPIsToExcel(reputation: any, excelLines: string[]): void {
    excelLines.push(''); // Ligne de séparation
    excelLines.push('RÉPUTATION & KPIS\t\t\t');
    
    excelLines.push(`Réputation\tScore global\t${reputation.overallScore || 'N/A'}\t/100`);
    excelLines.push(`Réputation\tConfiance marque\t${reputation.brandTrust || 'N/A'}\t/100`);
    excelLines.push(`Réputation\tReconnaissance marque\t${reputation.brandRecognition || 'N/A'}\t/100`);
    excelLines.push(`Réputation\tFidélité marque\t${reputation.brandLoyalty || 'N/A'}\t/100`);
    excelLines.push(`Réputation\tRésilience aux crises\t${reputation.crisisResilience || 'N/A'}\t/100`);
  }

  private addRecommendationsToExcel(recommendations: any[], excelLines: string[]): void {
    excelLines.push(''); // Ligne de séparation
    excelLines.push('RECOMMANDATIONS STRATÉGIQUES\t\t\t');
    
    if (Array.isArray(recommendations)) {
      recommendations.forEach((rec: any, index: number) => {
        excelLines.push(`Recommandations\tRecommandation ${index + 1}\t${this.escapeExcel(rec.title || rec.description || rec)}\tPriorité: ${rec.priority || 'N/A'}`);
        excelLines.push(`Recommandations\tImpact attendu ${index + 1}\t${rec.expectedImpact || rec.estimatedImpact || 'N/A'}\t/100`);
        excelLines.push(`Recommandations\tTimeline ${index + 1}\t${rec.implementation?.timeline || rec.timeline || 'N/A'}\t`);
        
        // Espacement entre recommandations
        if (index < recommendations.length - 1) {
          excelLines.push('\t\t\t');
        }
      });
    }
  }

  private escapeExcel(text: string | any): string {
    if (typeof text !== 'string') {
      text = String(text);
    }
    
    // Échapper les caractères spéciaux Excel et remplacer les tabulations
    return text
      .replace(/\t/g, ' ') // Remplacer tabulations par espaces
      .replace(/\n/g, ' ') // Remplacer retours à la ligne par espaces
      .replace(/\r/g, '')  // Supprimer retours chariot
      .replace(/"/g, '""') // Échapper guillemets
      .trim();
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
      errors.push('Aucun contenu disponible pour export Excel');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 