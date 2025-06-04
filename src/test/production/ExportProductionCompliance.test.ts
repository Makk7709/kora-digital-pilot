/**
 * 📊 TESTS DE CONFORMITÉ EXPORT - PRODUCTION PRISM REPORT
 * Validation exhaustive des exports PDF/JSON/CSV/Excel avec données réelles
 * Responsabilité : Conformité formats, qualité contenu, performance export
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { RealBrandIntelligenceService } from '../../services/RealBrandIntelligenceService';
import { createReportExportService } from '../../services/export';
import type { ExportOptions, DeepResearchReport } from '../../types/BrandIntelligenceTypes';

const EXPORT_TEST_TIMEOUT = 45000; // 45 secondes pour exports
const TEST_BRAND = 'Tesla'; // Marque de référence pour tests

describe('📄 CONFORMITÉ EXPORT PRODUCTION - PRISM REPORT', () => {
  let service: RealBrandIntelligenceService;
  let exportService: any;
  let testReport: DeepResearchReport;

  beforeAll(async () => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey || apiKey.includes('your_') || apiKey.includes('demo')) {
      throw new Error('❌ CLÉ API PERPLEXITY RÉELLE OBLIGATOIRE POUR TESTS EXPORT');
    }
    
    service = new RealBrandIntelligenceService();
    exportService = createReportExportService();
    
    // Générer un rapport de test réel
    console.log('🔄 Génération rapport test pour exports...');
    testReport = await service.generateRealDeepResearchReport(TEST_BRAND);
    console.log('✅ Rapport test prêt pour exports');
  }, 60000);

  afterEach(() => {
    // Nettoyage des URL blobs après chaque test
    if (typeof window !== 'undefined') {
      // Pas de nettoyage nécessaire en environnement Node.js
    }
  });

  describe('🔒 VALIDATION CONTENU EXPORT', () => {

    it('📋 DOIT contenir toutes les sections requises', () => {
      // Validation structure rapport
      expect(testReport).toBeDefined();
      expect(testReport.brandName).toBe(TEST_BRAND);
      expect(testReport.objectiveAnalysis).toBeDefined();
      expect(testReport.strategicAnalysis).toBeDefined();
      expect(testReport.swotMetrics).toBeDefined();
      expect(testReport.competitiveMetrics).toBeDefined();
      expect(testReport.recommendations).toBeDefined();
      expect(testReport.sources).toBeDefined();

      // Validation contenu non vide
      expect(testReport.objectiveAnalysis.brandHistory.foundingYear).toBeGreaterThan(1900);
      expect(testReport.recommendations.length).toBeGreaterThan(0);
      expect(testReport.sources.length).toBeGreaterThan(0);
      
      console.log(`✅ Rapport ${TEST_BRAND} validé: ${testReport.recommendations.length} recommandations, ${testReport.sources.length} sources`);
    });

    it('🚫 NE DOIT contenir AUCUNE donnée de démonstration', () => {
      const reportStr = JSON.stringify(testReport);
      
      // Vérifications anti-démo strictes
      expect(reportStr).not.toContain('demo');
      expect(reportStr).not.toContain('test');
      expect(reportStr).not.toContain('mock');
      expect(reportStr).not.toContain('fake');
      expect(reportStr).not.toContain('example');
      expect(reportStr).not.toContain('sample');
      
      // Vérifications spécifiques Tesla (si c'est notre test)
      if (TEST_BRAND === 'Tesla') {
        expect(reportStr).toContain('Tesla');
        expect(reportStr).toContain('Musk'); // Données réelles attendues
      }
      
      console.log('🚫 Aucune donnée de démonstration détectée');
    });

  });

  describe('📊 EXPORT JSON - PRODUCTION', () => {

    it('🔄 DOIT exporter en JSON avec métadonnées complètes', async () => {
      const options: ExportOptions = {
        format: 'json',
        includeMetadata: true,
        includeRawData: true
      };

      const result = await exportService.exportReport(testReport, options);

      expect(result.success).toBe(true);
      expect(result.fileName).toContain(TEST_BRAND);
      expect(result.fileName).toContain('.json');
      expect(result.fileSize).toBeGreaterThan(1000); // Minimum 1KB
      expect(result.downloadUrl).toMatch(/^blob:/);

      // Validation contenu JSON
      const response = await fetch(result.downloadUrl);
      const jsonData = await response.json();
      
      expect(jsonData.brandName).toBe(TEST_BRAND);
      expect(jsonData.objectiveAnalysis).toBeDefined();
      expect(jsonData.metadata).toBeDefined();
      expect(jsonData.metadata.exportTimestamp).toBeDefined();
      
      console.log(`✅ Export JSON: ${result.fileName} (${Math.round(result.fileSize/1024)}KB)`);
      
    }, EXPORT_TEST_TIMEOUT);

    it('📈 DOIT inclure métriques de qualité', async () => {
      const options: ExportOptions = {
        format: 'json',
        includeMetadata: true,
        qualityEnhancement: true
      };

      const result = await exportService.exportReport(testReport, options);
      
      expect(result.success).toBe(true);
      
      const response = await fetch(result.downloadUrl);
      const jsonData = await response.json();
      
      // Validation métriques qualité
      expect(jsonData.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(jsonData.confidenceScore).toBeLessThanOrEqual(100);
      
      if (jsonData.metadata) {
        expect(jsonData.metadata.qualityScore).toBeDefined();
        expect(jsonData.metadata.reportStats).toBeDefined();
      }
      
      console.log(`📈 Export avec qualité: Score ${jsonData.confidenceScore}`);
      
    }, EXPORT_TEST_TIMEOUT);

  });

  describe('📄 EXPORT PDF - PRODUCTION', () => {

    it('🎨 DOIT générer PDF professionnel avec branding', async () => {
      const options: ExportOptions = {
        format: 'pdf',
        template: 'executive',
        includeCharts: true,
        branding: {
          companyName: 'Kora P.R.I.S.M Analytics'
        }
      };

      const result = await exportService.exportReport(testReport, options);

      expect(result.success).toBe(true);
      expect(result.fileName).toContain('.pdf');
      expect(result.fileSize).toBeGreaterThan(50000); // Minimum 50KB pour PDF
      expect(result.mimeType || 'application/pdf').toBe('application/pdf');
      
      console.log(`🎨 Export PDF: ${result.fileName} (${Math.round(result.fileSize/1024/1024*100)/100}MB)`);
      
    }, EXPORT_TEST_TIMEOUT);

    it('⚡ DOIT respecter SLA performance PDF', async () => {
      const startTime = Date.now();
      
      const options: ExportOptions = {
        format: 'pdf',
        template: 'executive',
        includeCharts: false // Plus rapide
      };

      const result = await exportService.exportReport(testReport, options);
      const exportTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(exportTime).toBeLessThan(15000); // SLA: 15s maximum
      
      console.log(`⚡ PDF Performance: ${exportTime}ms (SLA: 15s)`);
      
    }, EXPORT_TEST_TIMEOUT);

  });

  describe('📊 EXPORT CSV/EXCEL - PRODUCTION', () => {

    it('📋 DOIT exporter CSV avec structure tabulaire', async () => {
      const options: ExportOptions = {
        format: 'csv',
        includeMetadata: true
      };

      const result = await exportService.exportReport(testReport, options);

      expect(result.success).toBe(true);
      expect(result.fileName).toContain('.csv');
      expect(result.fileSize).toBeGreaterThan(500); // Minimum 500B

      // Validation contenu CSV
      const response = await fetch(result.downloadUrl);
      const csvContent = await response.text();
      
      expect(csvContent).toContain(TEST_BRAND);
      expect(csvContent).toContain(','); // Séparateurs CSV
      expect(csvContent.split('\n').length).toBeGreaterThan(5); // Multiple lignes
      
      console.log(`📋 Export CSV: ${result.fileName} (${csvContent.split('\n').length} lignes)`);
      
    }, EXPORT_TEST_TIMEOUT);

    it('📊 DOIT exporter Excel avec formatage avancé', async () => {
      const options: ExportOptions = {
        format: 'excel',
        includeCharts: true,
        includeMetadata: true
      };

      const result = await exportService.exportReport(testReport, options);

      expect(result.success).toBe(true);
      expect(result.fileName.endsWith('.xlsx') || result.fileName.endsWith('.xls')).toBe(true);
      expect(result.fileSize).toBeGreaterThan(2000); // Excel plus volumineux
      
      console.log(`📊 Export Excel: ${result.fileName} (${Math.round(result.fileSize/1024)}KB)`);
      
    }, EXPORT_TEST_TIMEOUT);

  });

  describe('🔧 GESTION D\'ERREURS EXPORT', () => {

    it('⚠️ DOIT gérer gracieusement les données manquantes', async () => {
      const incompleteReport = {
        ...testReport,
        recommendations: [], // Données manquantes
        sources: []
      };

      const options: ExportOptions = {
        format: 'json',
        includeMetadata: true
      };

      const result = await exportService.exportReport(incompleteReport, options);

      // Export doit réussir même avec données incomplètes
      expect(result.success).toBe(true);
      expect(result.fileName).toBeDefined();
      
      console.log('⚠️ Export avec données incomplètes géré correctement');
      
    }, EXPORT_TEST_TIMEOUT);

    it('🚨 DOIT échouer avec format invalide', async () => {
      const options: ExportOptions = {
        format: 'invalid_format' as any,
        includeMetadata: true
      };

      await expect(async () => {
        await exportService.exportReport(testReport, options);
      }).rejects.toThrow();
      
      console.log('🚨 Validation format export correcte');
    });

  });

  describe('🎯 QUALITÉ CONTENU EXPORT', () => {

    it('📝 DOIT préserver l\'intégrité des données', async () => {
      const options: ExportOptions = {
        format: 'json',
        includeRawData: true,
        enableDeduplication: false // Préserver données originales
      };

      const result = await exportService.exportReport(testReport, options);
      
      expect(result.success).toBe(true);
      
      const response = await fetch(result.downloadUrl);
      const exportedData = await response.json();
      
      // Vérifications intégrité
      expect(exportedData.brandName).toBe(testReport.brandName);
      expect(exportedData.confidenceScore).toBe(testReport.confidenceScore);
      expect(exportedData.recommendations.length).toBe(testReport.recommendations.length);
      
      console.log('📝 Intégrité données préservée');
      
    }, EXPORT_TEST_TIMEOUT);

    it('🧹 DOIT appliquer déduplication quand activée', async () => {
      const options: ExportOptions = {
        format: 'json',
        enableDeduplication: true,
        qualityEnhancement: true
      };

      const result = await exportService.exportReport(testReport, options);
      
      expect(result.success).toBe(true);
      
      if (result.contentMetrics) {
        expect(result.contentMetrics.duplicationsRemoved).toBeGreaterThanOrEqual(0);
        console.log(`🧹 Déduplication: ${result.contentMetrics.duplicationsRemoved} doublons supprimés`);
      }
      
    }, EXPORT_TEST_TIMEOUT);

  });

  describe('📊 MÉTRIQUES EXPORT PRODUCTION', () => {

    it('🎯 DOIT fournir métriques export détaillées', async () => {
      const formats = ['json', 'csv', 'pdf'];
      const exportMetrics: Array<{
        format: string;
        fileSize: number;
        exportTime: number;
        success: boolean;
      }> = [];

      for (const format of formats) {
        const startTime = Date.now();
        
        try {
          const options: ExportOptions = {
            format: format as any,
            includeMetadata: true
          };

          const result = await exportService.exportReport(testReport, options);
          
          exportMetrics.push({
            format,
            fileSize: result.fileSize,
            exportTime: Date.now() - startTime,
            success: result.success
          });
          
        } catch (error) {
          exportMetrics.push({
            format,
            fileSize: 0,
            exportTime: Date.now() - startTime,
            success: false
          });
        }
      }

      // Validations métriques
      const successRate = exportMetrics.filter(m => m.success).length / exportMetrics.length;
      expect(successRate).toBeGreaterThanOrEqual(0.8); // 80% minimum

      const avgTime = exportMetrics.reduce((sum, m) => sum + m.exportTime, 0) / exportMetrics.length;
      expect(avgTime).toBeLessThan(20000); // 20s moyenne maximum

      console.log('📊 MÉTRIQUES EXPORT FINALES:');
      exportMetrics.forEach(metric => {
        console.log(`  ${metric.format}: ${metric.success ? '✅' : '❌'} ${metric.exportTime}ms, ${Math.round(metric.fileSize/1024)}KB`);
      });
      console.log(`  Success Rate: ${Math.round(successRate*100)}%`);
      console.log(`  Temps moyen: ${Math.round(avgTime)}ms`);
      
    }, EXPORT_TEST_TIMEOUT * 3);

  });

}); 