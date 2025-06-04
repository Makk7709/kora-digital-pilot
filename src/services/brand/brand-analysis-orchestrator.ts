// Brand Analysis Orchestrator
// Main coordinator service that replaces the monolithic BrandAnalysisService.ts

import { BrandAnalysisAPIService } from './api-service';
import { BrandReportGenerator } from './report-generator';
import { 
  BrandAnalysisService,
  BrandReport, 
  PerplexityReport, 
  RealMention, 
  RealSentiment, 
  RealCompetitor, 
  RealKeyword 
} from '../../types/brand-analysis';

export class BrandAnalysisOrchestrator implements BrandAnalysisService {
  private apiService: BrandAnalysisAPIService;
  private reportGenerator: BrandReportGenerator;
  
  constructor(perplexityService: any) {
    this.apiService = new BrandAnalysisAPIService(perplexityService);
    this.reportGenerator = new BrandReportGenerator();
  }

  async analyzeBrand(brandName: string): Promise<BrandReport> {
    try {
      console.log('🎯 Début de l\'analyse complète pour:', brandName);
      
      // Lancer toutes les analyses en parallèle pour optimiser les performances
      const [mentionsData, sentimentData, competitorsData, keywordsData, swotData, alertsData] = await Promise.all([
        this.apiService.getMentions(brandName),
        this.apiService.getSentimentFromAPI(brandName),
        this.apiService.getCompetitors(brandName),
        this.apiService.getKeywordsFromAPI(brandName),
        this.apiService.getSWOTFromAPI(brandName),
        this.apiService.getAlertsFromAPI(brandName)
      ]);

      const brandReport: BrandReport = {
        mentions: mentionsData,
        sentiment: sentimentData,
        competitors: competitorsData,
        keywords: keywordsData,
        swot: swotData,
        alerts: alertsData,
        brandName,
        analysisTimestamp: new Date()
      };

      console.log('✅ Analyse complète terminée pour:', brandName);
      console.log(`📊 Résumé: ${mentionsData.length} mentions, ${competitorsData.length} concurrents, score: ${sentimentData.overallScore}/100`);
      
      return brandReport;
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse de marque:', error);
      throw new Error(`Impossible d'analyser la marque ${brandName}: ${error.message}`);
    }
  }

  async getMentions(brandName: string): Promise<RealMention[]> {
    return this.apiService.getMentions(brandName);
  }

  async getCompetitors(brandName: string): Promise<RealCompetitor[]> {
    return this.apiService.getCompetitors(brandName);
  }

  async getSentiment(mentions: RealMention[]): Promise<RealSentiment> {
    // Calculer le sentiment depuis les mentions réelles
    return this.apiService.calculateSentimentFromMentions(mentions);
  }

  async getKeywords(content: string[]): Promise<RealKeyword[]> {
    // Extraire des mots-clés depuis le contenu fourni
    return this.apiService.extractKeywordsFromContent(content);
  }

  async generatePerplexityReport(brandReport: BrandReport): Promise<PerplexityReport> {
    return this.reportGenerator.generatePerplexityReport(brandReport);
  }

  // Méthodes supplémentaires pour l'orchestration

  async performQuickAnalysis(brandName: string): Promise<{
    mentions: RealMention[];
    sentiment: RealSentiment;
    summary: string;
  }> {
    console.log('⚡ Analyse rapide pour:', brandName);
    
    try {
      // Analyse rapide avec seulement mentions et sentiment
      const [mentions, sentiment] = await Promise.all([
        this.apiService.getMentions(brandName),
        this.apiService.getSentimentFromAPI(brandName)
      ]);

      const summary = `${brandName}: ${mentions.length} mentions, score ${sentiment.overallScore}/100 (${sentiment.trend})`;
      
      return { mentions, sentiment, summary };
    } catch (error) {
      console.error('Erreur analyse rapide:', error);
      throw error;
    }
  }

  async getFullAnalysisWithReport(brandName: string): Promise<{
    brandReport: BrandReport;
    perplexityReport: PerplexityReport;
  }> {
    console.log('📋 Analyse complète avec rapport pour:', brandName);
    
    try {
      // Effectuer l'analyse complète
      const brandReport = await this.analyzeBrand(brandName);
      
      // Générer le rapport Perplexity
      const perplexityReport = await this.generatePerplexityReport(brandReport);
      
      console.log('✅ Analyse complète avec rapport terminée');
      
      return { brandReport, perplexityReport };
    } catch (error) {
      console.error('Erreur analyse complète avec rapport:', error);
      throw error;
    }
  }

  async validateAnalysisResults(brandReport: BrandReport): Promise<{
    isValid: boolean;
    issues: string[];
    quality: 'high' | 'medium' | 'low';
  }> {
    const issues: string[] = [];
    
    // Validation des mentions
    if (brandReport.mentions.length === 0) {
      issues.push('Aucune mention trouvée');
    }
    
    // Validation du sentiment
    const sentimentTotal = brandReport.sentiment.positive + brandReport.sentiment.neutral + brandReport.sentiment.negative;
    if (Math.abs(sentimentTotal - 100) > 5) {
      issues.push('Incohérence dans les pourcentages de sentiment');
    }
    
    // Validation des concurrents
    if (brandReport.competitors.length === 0) {
      issues.push('Aucun concurrent identifié');
    }
    
    // Validation SWOT
    const swotTotal = brandReport.swot.strengths.length + brandReport.swot.weaknesses.length + 
                     brandReport.swot.opportunities.length + brandReport.swot.threats.length;
    if (swotTotal < 4) {
      issues.push('Analyse SWOT incomplète');
    }

    // Déterminer la qualité
    let quality: 'high' | 'medium' | 'low' = 'high';
    if (issues.length > 3) {
      quality = 'low';
    } else if (issues.length > 1) {
      quality = 'medium';
    }

    return {
      isValid: issues.length === 0,
      issues,
      quality
    };
  }

  async getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    apiHealth: any;
    lastAnalysis: Date | null;
    uptime: number;
  }> {
    try {
      const apiHealth = await this.apiService.getAPIHealthStats();
      
      return {
        status: 'healthy',
        apiHealth,
        lastAnalysis: new Date(),
        uptime: Date.now()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        apiHealth: null,
        lastAnalysis: null,
        uptime: 0
      };
    }
  }

  // Méthode de compatibilité pour l'ancien code
  async getBusinessInsights(query: string, context?: string) {
    console.log('⚠️ Méthode dépréciée getBusinessInsights appelée');
    // Rediriger vers une analyse basique
    return {
      content: `Analyse demandée: ${query}`,
      context: context || 'general',
      timestamp: new Date()
    };
  }
}

// Export de compatibilité pour l'ancien code
export class BrandAnalysisServiceImpl extends BrandAnalysisOrchestrator {
  constructor(perplexityService: any) {
    super(perplexityService);
    console.log('⚠️ BrandAnalysisServiceImpl est déprécié, utilisez BrandAnalysisOrchestrator');
  }
}

// Factory function pour créer une instance configurée
export function createBrandAnalysisService(perplexityService: any): BrandAnalysisService {
  return new BrandAnalysisOrchestrator(perplexityService);
}

// Export par défaut
export default BrandAnalysisOrchestrator; 