// Report Export Orchestrator
// Main coordinator service that replaces the monolithic ReportExportService.ts

import { JSONExporter } from './formats/json-exporter';
import { CSVExporter } from './formats/csv-exporter';
import { PDFExporter } from './formats/pdf-exporter';
import { ExcelExporter } from './formats/excel-exporter';
import { contentDeduplicationService } from '../ContentDeduplicationService';
import type {
  DeepResearchReport,
  ExportOptions,
  ExportResult,
} from '../../types/BrandIntelligenceTypes';
import { logger } from '../../lib/logger';

type ReportPayload = Record<string, unknown> & {
  brandName?: string;
  confidenceScore?: number;
  objectiveAnalysis?: unknown;
  swotMetrics?: Record<string, unknown>;
  competitiveMetrics?: unknown;
  reputationKPIs?: unknown;
  recommendations?: unknown[];
  rawData?: { objectiveAnalysis?: unknown };
};

type RecommendationLike = Record<string, unknown> & {
  title?: string;
  description?: string;
};

type SwotItemLike = string | (Record<string, unknown> & { item?: string });

export interface ExportHistoryItem {
  timestamp: Date;
  fileName: string;
  format: string;
  fileSize: number;
  brandName: string;
}

export interface ReportExportServiceInterface {
  exportReport(report: ReportPayload, options: ExportOptions): Promise<ExportResult>;
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
  async exportReport(report: ReportPayload, options: ExportOptions): Promise<ExportResult> {
    const startTime = Date.now();
    logger.debug(`🚀 Démarrage export ${options.format.toUpperCase()}...`);

    try {
      // 1. Validation
      const validation = this.validateExportOptions(options);
      if (!validation.isValid) {
        throw new Error(`Options invalides: ${validation.errors.join(', ')}`);
      }

      // 2. 🧹 DÉDUPLICATION INTELLIGENTE (si activée)
      let processedReport = report;
      if (options.enableDeduplication !== false) {
        logger.debug('🧹 Application déduplication intelligente...');
        processedReport = await contentDeduplicationService.deduplicateReportContent(report);

        const rawObjective =
          typeof report.rawData?.objectiveAnalysis === 'string'
            ? report.rawData.objectiveAnalysis
            : undefined;
        if (rawObjective) {
          const stats = contentDeduplicationService.getDeduplicationStats(rawObjective);
          logger.debug(
            `Déduplication stats: ${stats.duplications} duplicatas, ${stats.uniqueWords} mots uniques, ${(stats.repetitionRate * 100).toFixed(1)}% répétition`,
          );
        }
      }

      // 3. 🎨 AMÉLIORATION QUALITÉ (si activée)
      if (options.qualityEnhancement !== false) {
        logger.debug('🎨 Application amélioration qualité...');
        processedReport = this.enhanceReportQuality(processedReport);
      }

      // 4. Génération du contenu selon le format
      let content: string | Uint8Array;
      let mimeType: string;

      // Cast vers DeepResearchReport: les exporters attendent ce shape même si
      // l'orchestrateur tolère une union plus large (BrandReport-like).
      const reportForExport = processedReport as unknown as DeepResearchReport;
      switch (options.format) {
        case 'json':
          content = this.jsonExporter.generate(reportForExport, options);
          mimeType = 'application/json';
          break;
        case 'csv':
          content = this.csvExporter.generate(reportForExport, options);
          mimeType = 'text/csv';
          break;
        case 'pdf':
          content = this.pdfExporter.generate(reportForExport, options);
          mimeType = 'application/pdf';
          break;
        case 'excel':
          content = this.excelExporter.generate(reportForExport, options);
          mimeType = 'application/vnd.ms-excel';
          break;
        default:
          throw new Error(`Format non supporté: ${options.format}`);
      }

      // 5. Compression (seulement pour les formats texte)
      if (
        options.compressionLevel &&
        options.compressionLevel !== 'none' &&
        typeof content === 'string'
      ) {
        content = this.compressContent(content, options.compressionLevel);
      }

      // 6. Génération du nom de fichier
      const fileName = this.generateFileName(report.brandName || 'Report', options.format);

      // 7. Création du blob et URL de téléchargement
      const blob = new Blob([content], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);

      // 8. Enregistrement dans l'historique
      const historyItem: ExportHistoryItem = {
        timestamp: new Date(),
        fileName,
        format: options.format,
        fileSize: blob.size,
        brandName: report.brandName || 'Unknown',
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
          processedReportSize: JSON.stringify(processedReport).length,
        },
      };

      const duration = Date.now() - startTime;
      logger.debug(
        `✅ Export ${options.format.toUpperCase()} réussi en ${duration}ms - Taille: ${blob.size} bytes`,
      );

      return result;
    } catch (error) {
      logger.error(`❌ Erreur export ${options.format}:`, error);

      return {
        success: false,
        fileName: '',
        filePath: '',
        fileSize: 0,
        format: options.format,
        downloadUrl: '',
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
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

    if (options.sections?.length === 0) {
      errors.push('Au moins une section requise si sections spécifiées');
    }

    const validSections = [
      'objectiveAnalysis',
      'strategicAnalysis',
      'swotMetrics',
      'competitiveMetrics',
      'recommendations',
      'alerts',
    ];
    if (options.sections) {
      const invalidSections = options.sections.filter((s) => !validSections.includes(s));
      if (invalidSections.length > 0) {
        errors.push(`Sections invalides: ${invalidSections.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
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

    this.exportHistory = this.exportHistory.filter((item) => item.timestamp > cutoffDate);
    this.saveHistoryToStorage();

    const deletedCount = beforeCount - this.exportHistory.length;
    logger.debug(`🧹 Nettoyage historique: ${deletedCount} exports supprimés`);

    return deletedCount;
  }

  // === MÉTHODES PRIVÉES ===

  private compressContent(content: string, level: string): string {
    // Compression basique pour les navigateurs
    logger.debug(`🗜️ Compression niveau ${level}...`);

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

  private enhanceReportQuality(report: ReportPayload): ReportPayload {
    logger.debug('Enhancing report quality');

    try {
      const enhanced = JSON.parse(JSON.stringify(report)) as ReportPayload;

      if (enhanced.recommendations && Array.isArray(enhanced.recommendations)) {
        enhanced.recommendations = (enhanced.recommendations as RecommendationLike[]).map(
          (rec) => ({
            ...rec,
            title: rec.title ? this.enhanceTextQuality(rec.title) : rec.title,
            description: rec.description
              ? this.enhanceTextQuality(rec.description)
              : rec.description,
          }),
        );
      }

      if (enhanced.swotMetrics) {
        const swot = enhanced.swotMetrics as Record<string, unknown>;
        (['strengths', 'weaknesses', 'opportunities', 'threats'] as const).forEach((key) => {
          const arr = swot[key];
          if (Array.isArray(arr)) {
            swot[key] = (arr as SwotItemLike[]).map((item) => {
              if (typeof item === 'string') {
                return this.enhanceTextQuality(item);
              }
              if (
                item &&
                typeof item === 'object' &&
                'item' in item &&
                typeof item.item === 'string'
              ) {
                return { ...item, item: this.enhanceTextQuality(item.item) };
              }
              return item;
            });
          }
        });
      }

      return enhanced;
    } catch (error) {
      logger.warn('Report quality enhancement failed', { error });
      return report;
    }
  }

  private enhanceTextQuality(text: string): string {
    if (!text || typeof text !== 'string') return text;

    return (
      text
        // Capitaliser la première lettre
        .replace(/^[a-z]/, (char) => char.toUpperCase())
        // Corriger les espaces multiples
        .replace(/\s+/g, ' ')
        // Nettoyer les caractères spéciaux en début/fin
        .replace(/^[^\w]+|[^\w.!?]+$/g, '')
        // S'assurer qu'il y a une ponctuation finale
        .replace(/([^.!?])$/, '$1.')
        .trim()
    );
  }

  private generateEnhancedMetadata(
    report: ReportPayload,
    options: ExportOptions,
    startTime: number,
  ): Record<string, unknown> {
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
        recommendationsCount: Array.isArray(report.recommendations)
          ? report.recommendations.length
          : 0,
        confidenceScore: report.confidenceScore || 0,
      },
      qualityScore: this.calculateOverallQualityScore(report),
      version: '2.0',
    };
  }

  private calculateOverallQualityScore(report: ReportPayload): number {
    let score = 0;
    let maxScore = 0;

    // Score basé sur la complétude
    const sections = [
      'objectiveAnalysis',
      'swotMetrics',
      'competitiveMetrics',
      'reputationKPIs',
      'recommendations',
    ];
    sections.forEach((section) => {
      maxScore += 20;
      if ((report as Record<string, unknown>)[section]) {
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
        this.exportHistory = (JSON.parse(stored) as ExportHistoryItem[]).map((item) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
    } catch (error) {
      logger.warn('Erreur chargement historique export:', error);
      this.exportHistory = [];
    }
  }

  private saveHistoryToStorage(): void {
    try {
      localStorage.setItem('kora-export-history', JSON.stringify(this.exportHistory));
    } catch (error) {
      logger.warn('Erreur sauvegarde historique export:', error);
    }
  }
}

// Factory function pour créer une instance configurée
export function createReportExportService(): ReportExportOrchestrator {
  return new ReportExportOrchestrator();
}

// Export par défaut
export default ReportExportOrchestrator;
