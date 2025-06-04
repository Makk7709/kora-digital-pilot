// Report Export Orchestrator
// Main coordinator service that replaces the monolithic ReportExportService.ts

import { JSONExporter } from './formats/json-exporter';
import { CSVExporter } from './formats/csv-exporter';
import { PDFExporter } from './formats/pdf-exporter';
import { ExcelExporter } from './formats/excel-exporter';
import { contentDeduplicationService } from '../ContentDeduplicationService';
import type { ExportOptions, ExportResult } from '../../types/BrandIntelligenceTypes';

export interface ExportHistoryItem {
  timestamp: Date;
  fileName: string;
  format: string;
  fileSize: number;
  brandName: string;
}

export interface ReportExportServiceInterface {
  exportReport(report: any, options: ExportOptions): Promise<ExportResult>;
  validateExportOptions(options: ExportOptions): { isValid: boolean; errors: string[] };
  getSupportedFormats(): string[];
  getExportHistory(): ExportHistoryItem[];
  cleanupOldExports(): Promise<number>;
}

export class ReportExportOrchestrator implements ReportExportServiceInterface {
  private exportHistory: ExportHistoryItem[] = [];
  private jsonExporter = new JSONExporter();
  private csvExporter = new CSVExporter();
  private pdfExporter = new PDFExporter();
  private excelExporter = new ExcelExporter();

  constructor() {
    this.loadHistoryFromStorage();
  }

  /**
   * 🎯 EXPORT PRINCIPAL - Multi-formats
   */
  async exportReport(report: any, options: ExportOptions): Promise<ExportResult> {
    const startTime = Date.now();
    console.log(`🚀 Démarrage export ${options.format.toUpperCase()}...`);

    try {
      // 1. Validation
      const validation = this.validateExportOptions(options);
      if (!validation.isValid) {
        throw new Error(`Options invalides: ${validation.errors.join(', ')}`);
      }

      // 2. 🧹 DÉDUPLICATION INTELLIGENTE (si activée)
      let processedReport = report;
      if (options.enableDeduplication !== false) {
        console.log('🧹 Application déduplication intelligente...');
        processedReport = await contentDeduplicationService.deduplicateReportContent(report);
        
        if (report.rawData?.objectiveAnalysis) {
          const stats = contentDeduplicationService.getDeduplicationStats(report.rawData.objectiveAnalysis);
          console.log(`📊 Déduplication stats: ${stats.duplications} duplicatas, ${stats.uniqueWords} mots uniques, ${(stats.repetitionRate*100).toFixed(1)}% répétition`);
        }
      }

      // 3. 🎨 AMÉLIORATION QUALITÉ (si activée)
      if (options.qualityEnhancement !== false) {
        console.log('🎨 Application amélioration qualité...');
        processedReport = this.enhanceReportQuality(processedReport);
      }

      // 4. Génération du contenu selon le format
      let content: string | Uint8Array;
      let mimeType: string;

      switch (options.format) {
        case 'json':
          content = this.jsonExporter.generate(processedReport, options);
          mimeType = 'application/json';
          break;
        case 'csv':
          content = this.csvExporter.generate(processedReport, options);
          mimeType = 'text/csv';
          break;
        case 'pdf':
          content = this.pdfExporter.generate(processedReport, options);
          mimeType = 'application/pdf';
          break;
        case 'excel':
          content = this.excelExporter.generate(processedReport, options);
          mimeType = 'application/vnd.ms-excel';
          break;
        default:
          throw new Error(`Format non supporté: ${options.format}`);
      }

      // 5. Compression (seulement pour les formats texte)
      if (options.compressionLevel && options.compressionLevel !== 'none' && typeof content === 'string') {
        content = this.compressContent(content, options.compressionLevel);
      }

      // 6. Génération du nom de fichier
      const fileName = this.generateFileName(report.brandName || 'Report', options.format);

      // 7. Création du blob et URL de téléchargement
      let blob: Blob;
      let downloadUrl: string;

      if (typeof content === 'string') {
        blob = new Blob([content], { type: mimeType });
      } else {
        blob = new Blob([content], { type: mimeType });
      }

      downloadUrl = URL.createObjectURL(blob);

      // 8. Enregistrement dans l'historique
      const historyItem: ExportHistoryItem = {
        timestamp: new Date(),
        fileName,
        format: options.format,
        fileSize: blob.size,
        brandName: report.brandName || 'Unknown'
      };

      this.exportHistory.push(historyItem);
      this.saveHistoryToStorage();

      // 9. Génération des métadonnées enrichies
      const metadata = this.generateEnhancedMetadata(processedReport, options, startTime);

      const result: ExportResult = {
        success: true,
        fileName,
        filePath: downloadUrl,
        fileSize: blob.size,
        format: options.format,
        downloadUrl,
        metadata: {
          ...metadata,
          deduplicationApplied: options.enableDeduplication !== false,
          qualityEnhanced: options.qualityEnhancement !== false,
          originalReportSize: JSON.stringify(report).length,
          processedReportSize: JSON.stringify(processedReport).length
        }
      };

      const duration = Date.now() - startTime;
      console.log(`✅ Export ${options.format.toUpperCase()} réussi en ${duration}ms - Taille: ${blob.size} bytes`);

      return result;

    } catch (error) {
      console.error(`❌ Erreur export ${options.format}:`, error);
      
      return {
        success: false,
        fileName: '',
        filePath: '',
        fileSize: 0,
        format: options.format,
        downloadUrl: '',
        errors: [error instanceof Error ? error.message : 'Erreur inconnue']
      };
    }
  }

  validateExportOptions(options: ExportOptions): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!options.format) {
      errors.push('Format requis');
    }

    if (!this.getSupportedFormats().includes(options.format)) {
      errors.push(`Format non supporté: ${options.format}`);
    }

    if (options.sections && options.sections.length === 0) {
      errors.push('Au moins une section requise si sections spécifiées');
    }

    const validSections = ['objectiveAnalysis', 'strategicAnalysis', 'swotMetrics', 'competitiveMetrics', 'recommendations', 'alerts'];
    if (options.sections) {
      const invalidSections = options.sections.filter(s => !validSections.includes(s));
      if (invalidSections.length > 0) {
        errors.push(`Sections invalides: ${invalidSections.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getSupportedFormats(): string[] {
    return ['json', 'csv', 'pdf', 'excel'];
  }

  getExportHistory(): ExportHistoryItem[] {
    return [...this.exportHistory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async cleanupOldExports(): Promise<number> {
    const beforeCount = this.exportHistory.length;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30); // 30 jours

    this.exportHistory = this.exportHistory.filter(item => item.timestamp > cutoffDate);
    this.saveHistoryToStorage();

    const deletedCount = beforeCount - this.exportHistory.length;
    console.log(`🧹 Nettoyage historique: ${deletedCount} exports supprimés`);
    
    return deletedCount;
  }

  // === MÉTHODES PRIVÉES ===

  private compressContent(content: string, level: string): string {
    // Compression basique pour les navigateurs
    console.log(`🗜️ Compression niveau ${level}...`);
    
    switch (level) {
      case 'light':
        return content.replace(/\s{2,}/g, ' ').replace(/\n\s*\n/g, '\n');
      case 'medium':
        return content.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
      case 'heavy':
        return content.replace(/\s+/g, ' ').replace(/\n/g, '').trim();
      default:
        return content;
    }
  }

  private generateFileName(brandName: string, format: string): string {
    const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');
    return `brand-intelligence-${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}.${format}`;
  }

  private enhanceReportQuality(report: any): any {
    console.log('🎨 Amélioration qualité du rapport...');
    
    try {
      const enhanced = JSON.parse(JSON.stringify(report)); // Deep copy
      
      // Améliorer les textes dans les recommandations
      if (enhanced.recommendations && Array.isArray(enhanced.recommendations)) {
        enhanced.recommendations = enhanced.recommendations.map((rec: any) => ({
          ...rec,
          title: rec.title ? this.enhanceTextQuality(rec.title) : rec.title,
          description: rec.description ? this.enhanceTextQuality(rec.description) : rec.description
        }));
      }
      
      // Améliorer les textes SWOT
      if (enhanced.swotMetrics) {
        ['strengths', 'weaknesses', 'opportunities', 'threats'].forEach(key => {
          if (enhanced.swotMetrics[key] && Array.isArray(enhanced.swotMetrics[key])) {
            enhanced.swotMetrics[key] = enhanced.swotMetrics[key].map((item: any) => {
              if (typeof item === 'string') {
                return this.enhanceTextQuality(item);
              } else if (item.item) {
                return { ...item, item: this.enhanceTextQuality(item.item) };
              }
              return item;
            });
          }
        });
      }
      
      return enhanced;
      
    } catch (error) {
      console.warn('Erreur amélioration qualité:', error);
      return report;
    }
  }

  private enhanceTextQuality(text: string): string {
    if (!text || typeof text !== 'string') return text;
    
    return text
      // Capitaliser la première lettre
      .replace(/^[a-z]/, char => char.toUpperCase())
      // Corriger les espaces multiples
      .replace(/\s+/g, ' ')
      // Nettoyer les caractères spéciaux en début/fin
      .replace(/^[^\w]+|[^\w.!?]+$/g, '')
      // S'assurer qu'il y a une ponctuation finale
      .replace(/([^.!?])$/, '$1.')
      .trim();
  }

  private generateEnhancedMetadata(report: any, options: ExportOptions, startTime: number): any {
    const duration = Date.now() - startTime;
    
    return {
      exportTimestamp: new Date().toISOString(),
      exportDuration: duration,
      brandName: report.brandName || 'Unknown',
      format: options.format,
      sectionsIncluded: options.sections || ['all'],
      reportStats: {
        hasObjectiveAnalysis: !!report.objectiveAnalysis,
        hasSWOTMetrics: !!report.swotMetrics,
        hasCompetitiveMetrics: !!report.competitiveMetrics,
        hasReputationKPIs: !!report.reputationKPIs,
        recommendationsCount: Array.isArray(report.recommendations) ? report.recommendations.length : 0,
        confidenceScore: report.confidenceScore || 0
      },
      qualityScore: this.calculateOverallQualityScore(report),
      version: '2.0'
    };
  }

  private calculateOverallQualityScore(report: any): number {
    let score = 0;
    let maxScore = 0;

    // Score basé sur la complétude
    const sections = ['objectiveAnalysis', 'swotMetrics', 'competitiveMetrics', 'reputationKPIs', 'recommendations'];
    sections.forEach(section => {
      maxScore += 20;
      if (report[section]) {
        score += 20;
      }
    });

    // Bonus pour la qualité des données
    if (report.confidenceScore && report.confidenceScore > 70) {
      score += 10;
      maxScore += 10;
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
  }

  private loadHistoryFromStorage(): void {
    try {
      const stored = localStorage.getItem('kora-export-history');
      if (stored) {
        this.exportHistory = JSON.parse(stored).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Erreur chargement historique export:', error);
      this.exportHistory = [];
    }
  }

  private saveHistoryToStorage(): void {
    try {
      localStorage.setItem('kora-export-history', JSON.stringify(this.exportHistory));
    } catch (error) {
      console.warn('Erreur sauvegarde historique export:', error);
    }
  }
}

// Factory function pour créer une instance configurée
export function createReportExportService(): ReportExportOrchestrator {
  return new ReportExportOrchestrator();
}

// Export par défaut
export default ReportExportOrchestrator; 