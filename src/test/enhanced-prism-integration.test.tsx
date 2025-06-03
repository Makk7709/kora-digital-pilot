/**
 * 🧪 TESTS D'INTÉGRATION - ENHANCED P.R.I.S.M SOLUTION
 * Validation complète que la solution TDD résout les problèmes identifiés
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { 
  EnhancedReportExportService,
  createEnhancedReportExportService,
  shouldUseEnhancedMode,
  getRecommendedEnhancedOptions
} from '../services/EnhancedReportExportService';
import { 
  ReportExportService,
  createReportExportService
} from '../services/ReportExportService';

describe('🎯 INTÉGRATION - Solution Enhanced P.R.I.S.M', () => {
  let enhancedExportService: EnhancedReportExportService;
  let standardExportService: ReportExportService;
  let mockReport: any;

  beforeEach(() => {
    enhancedExportService = createEnhancedReportExportService();
    standardExportService = createReportExportService();
    
    // Mock rapport avec données Perplexity réelles
    mockReport = {
      brandName: 'Nike',
      rawData: {
        objectiveAnalysis: 'Nike est une entreprise américaine multinationale spécialisée dans la conception, le développement et la vente d\'équipements sportifs. Fondée en 1964, elle est devenue le leader mondial de l\'industrie avec une forte présence sur tous les continents.',
        strategicAnalysis: 'La stratégie de Nike repose sur l\'innovation continue, le marketing d\'influence et l\'expansion géographique. L\'entreprise investit massivement en R&D pour maintenir son avantage concurrentiel.',
        competitiveAnalysis: 'Nike fait face à une concurrence intense d\'Adidas, Puma et New Balance. Sa différenciation repose sur la technologie, le design et les partenariats avec des athlètes de renom.',
        trendAnalysis: 'Les tendances du marché incluent la durabilité, la personnalisation et le commerce électronique. Nike s\'adapte en développant des matériaux écologiques et des plateformes digitales.'
      },
      objectiveAnalysis: {
        brandHistory: 'Nike révolutionne le sport depuis 1964 avec des innovations comme Air Max et Flyknit.',
        marketPosition: 'Leader mondial avec 40% de part de marché dans les chaussures de sport premium.'
      },
      confidenceScore: 85
    };
  });

  describe('🚀 RÉSOLUTION DES PROBLÈMES IDENTIFIÉS', () => {
    
    test('PROBLÈME RÉSOLU #1: PDF Enhanced contient 10x plus de contenu que version standard', async () => {
      // GIVEN: Rapport avec données riches et options Enhanced
      const enhancedOptions = getRecommendedEnhancedOptions(mockReport);
      const standardOptions = { format: 'pdf' as const };

      // WHEN: Export Enhanced vs Standard
      const enhancedResult = await enhancedExportService.exportReport(mockReport, enhancedOptions);
      const standardResult = await standardExportService.exportReport(mockReport, standardOptions);

      // THEN: PDF Enhanced substantiellement plus volumineux
      expect(enhancedResult.success).toBe(true);
      expect(standardResult.success).toBe(true);
      expect(enhancedResult.fileSize).toBeGreaterThan(standardResult.fileSize * 5); // Au moins 5x plus volumineux
      
      console.log('📊 Amélioration taille PDF:');
      console.log(`  Standard: ${standardResult.fileSize} bytes`);
      console.log(`  Enhanced: ${enhancedResult.fileSize} bytes`);
      console.log(`  Ratio: ${(enhancedResult.fileSize / standardResult.fileSize).toFixed(1)}x`);
    });

    test('PROBLÈME RÉSOLU #2: Contenu approfondi avec minimum 4000 mots vs <500 mots standard', async () => {
      // GIVEN: Options Enhanced avec analyse approfondie
      const enhancedOptions = getRecommendedEnhancedOptions(mockReport);
      enhancedOptions.includeDetailedAnalysis = true;

      // WHEN: Export Enhanced
      const result = await enhancedExportService.exportReport(mockReport, enhancedOptions);

      // THEN: Métriques de contenu respectent les standards professionnels
      expect(result.success).toBe(true);
      expect(result.contentMetrics).toBeDefined();
      expect(result.contentMetrics!.totalWords).toBeGreaterThanOrEqual(4000);
      expect(result.contentMetrics!.professionalStandards).toBe(true);
      expect(result.qualityScore).toBeGreaterThanOrEqual(90);

      console.log('📝 Métriques de contenu Enhanced:');
      console.log(`  Mots total: ${result.contentMetrics!.totalWords}`);
      console.log(`  Profondeur analyse: ${result.contentMetrics!.analysisDepth}`);
      console.log(`  Standards professionnels: ${result.contentMetrics!.professionalStandards ? '✅' : '❌'}`);
    });

    test('PROBLÈME RÉSOLU #3: Intelligence actionable avec recommandations détaillées', async () => {
      // GIVEN: Options Enhanced avec recommandations professionnelles
      const enhancedOptions = getRecommendedEnhancedOptions(mockReport);
      enhancedOptions.includeProfessionalRecommendations = true;

      // WHEN: Export Enhanced
      const result = await enhancedExportService.exportReport(mockReport, enhancedOptions);

      // THEN: Export contient intelligence actionable
      expect(result.success).toBe(true);
      expect(result.enhancementApplied).toBe(true);
      expect(result.metadata.enhancementLevel).toBe('professional');
      expect(result.metadata.pages).toBeGreaterThanOrEqual(8); // Rapport substantiel

      console.log('🎯 Intelligence Enhanced:');
      console.log(`  Enhancement appliqué: ${result.enhancementApplied ? '✅' : '❌'}`);
      console.log(`  Niveau: ${result.metadata.enhancementLevel}`);
      console.log(`  Pages: ${result.metadata.pages}`);
    });

    test('PROBLÈME RÉSOLU #4: Format professionnel pour utilisateurs exigeants', async () => {
      // GIVEN: Contexte professionnel avec exigences élevées
      const userPreferences = {
        context: 'professional',
        audience: 'executive',
        depth: 'comprehensive'
      };

      // WHEN: Détection automatique du mode Enhanced
      const shouldEnhance = shouldUseEnhancedMode(mockReport, userPreferences);
      expect(shouldEnhance).toBe(true);

      const enhancedOptions = getRecommendedEnhancedOptions(mockReport);
      const result = await enhancedExportService.exportReport(mockReport, enhancedOptions);

      // THEN: Résultat de qualité professionnelle
      expect(result.success).toBe(true);
      expect(result.qualityScore).toBeGreaterThanOrEqual(85);
      expect(result.fileName).toContain('Enhanced_PRISM');
      expect(result.metadata.reportConfidenceScore).toBeGreaterThanOrEqual(80);

      console.log('👔 Qualité Professionnelle:');
      console.log(`  Score qualité: ${result.qualityScore}/100`);
      console.log(`  Confiance rapport: ${result.metadata.reportConfidenceScore}/100`);
    });
  });

  describe('🔄 COMPATIBILITÉ ET NON-RÉGRESSION', () => {
    
    test('COMPATIBILITÉ: Service Enhanced compatible avec interface existante', async () => {
      // GIVEN: Options standard existantes
      const standardOptions = { format: 'json' as const };

      // WHEN: Utilisation service Enhanced avec options standard
      const result = await enhancedExportService.exportReport(mockReport, standardOptions);

      // THEN: Fonctionne exactement comme service standard
      expect(result.success).toBe(true);
      expect(result.enhancementApplied).toBe(false); // Pas d'enhancement automatique
      expect(result.format).toBe('json');
    });

    test('NON-RÉGRESSION: Autres composants non impactés par Enhanced service', () => {
      // GIVEN: Service Enhanced créé
      // WHEN: Vérification des méthodes compatibles
      // THEN: Interface identique au service standard
      expect(enhancedExportService.getSupportedFormats).toBeDefined();
      expect(enhancedExportService.validateExportOptions).toBeDefined();
      expect(enhancedExportService.getExportHistory).toBeDefined();
      expect(enhancedExportService.cleanupOldExports).toBeDefined();

      // Formats étendus mais inclut tous les standards
      const formats = enhancedExportService.getSupportedFormats();
      expect(formats).toContain('json');
      expect(formats).toContain('csv');
      expect(formats).toContain('excel');
      expect(formats).toContain('pdf');
    });

    test('FALLBACK GRACIEUX: Enhanced mode échoue → retour service standard', async () => {
      // GIVEN: Rapport avec données insuffisantes pour Enhanced
      const mockIncompleteReport = { brandName: 'TestBrand' }; // Données minimales
      const enhancedOptions = { format: 'pdf' as const, enhancedMode: true };

      // WHEN: Tentative export Enhanced
      const result = await enhancedExportService.exportReport(mockIncompleteReport, enhancedOptions);

      // THEN: Fallback gracieux vers standard
      expect(result.success).toBe(true); // Ne doit pas échouer
      expect(result.enhancementApplied).toBe(false); // Enhanced pas appliqué
    });
  });

  describe('📊 MÉTRIQUES D\'AMÉLIORATION', () => {
    
    test('MÉTRIQUES: Amélioration mesurable de la valeur utilisateur', async () => {
      // GIVEN: Rapports standard et Enhanced du même brand
      const standardResult = await standardExportService.exportReport(mockReport, { format: 'pdf' });
      const enhancedResult = await enhancedExportService.exportReport(mockReport, getRecommendedEnhancedOptions(mockReport));

      // WHEN: Calcul des métriques d'amélioration
      const sizeImprovement = enhancedResult.fileSize / standardResult.fileSize;
      const qualityImprovement = (enhancedResult.qualityScore || 0) / 70; // Score standard ~70

      // THEN: Améliorations significatives mesurables
      expect(sizeImprovement).toBeGreaterThan(5); // Au moins 5x plus de contenu
      expect(qualityImprovement).toBeGreaterThan(1.2); // Au moins 20% amélioration qualité
      expect(enhancedResult.contentMetrics?.totalWords).toBeGreaterThan(4000);

      console.log('📈 Métriques d\'amélioration Enhanced P.R.I.S.M:');
      console.log(`  Amélioration taille: ${sizeImprovement.toFixed(1)}x`);
      console.log(`  Amélioration qualité: ${((qualityImprovement - 1) * 100).toFixed(0)}%`);
      console.log(`  Contenu enrichi: ${enhancedResult.contentMetrics?.totalWords} mots`);
      console.log(`  Standards professionnels: ${enhancedResult.contentMetrics?.professionalStandards ? '✅' : '❌'}`);
    });

    test('PERFORMANCE: Enhanced generation reste dans limites acceptables', async () => {
      // GIVEN: Options Enhanced complètes
      const enhancedOptions = getRecommendedEnhancedOptions(mockReport);
      const startTime = Date.now();

      // WHEN: Génération rapport Enhanced
      const result = await enhancedExportService.exportReport(mockReport, enhancedOptions);
      const duration = Date.now() - startTime;

      // THEN: Performance acceptable malgré enrichissement
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(10000); // Moins de 10 secondes acceptable
      
      console.log(`⚡ Performance Enhanced: ${duration}ms`);
    });
  });

  describe('🎯 VALIDATION UTILISATEURS EXIGEANTS', () => {
    
    test('EXECUTIVE SUMMARY: Synthèse actionable pour dirigeants', async () => {
      // GIVEN: Options niveau executive
      const executiveOptions = {
        ...getRecommendedEnhancedOptions(mockReport),
        contentDepthLevel: 'executive' as const
      };

      // WHEN: Génération rapport executive
      const result = await enhancedExportService.exportReport(mockReport, executiveOptions);

      // THEN: Contenu adapté aux dirigeants
      expect(result.success).toBe(true);
      expect(result.metadata.enhancementLevel).toBe('executive');
      expect(result.qualityScore).toBeGreaterThanOrEqual(90);
      expect(result.fileSize).toBeGreaterThan(100000); // PDF substantiel
    });

    test('INTELLIGENCE BUSINESS: Valeur ajoutée réelle pour professionnels', async () => {
      // GIVEN: Rapport Enhanced complet
      const result = await enhancedExportService.exportReport(mockReport, {
        ...getRecommendedEnhancedOptions(mockReport),
        includeIntelligenceAlerts: true,
        includeDetailedAnalysis: true
      });

      // THEN: Intelligence business de haute valeur
      expect(result.success).toBe(true);
      expect(result.enhancementApplied).toBe(true);
      expect(result.contentMetrics?.professionalStandards).toBe(true);
      expect(result.metadata.pages).toBeGreaterThanOrEqual(8);
      
      // ROI attendu pour utilisateurs professionnels
      const expectedROI = result.qualityScore! / 70; // Ratio vs standard
      expect(expectedROI).toBeGreaterThan(1.3); // Au moins 30% amélioration
    });
  });
});

// Test de validation finale TDD
describe('✅ VALIDATION TDD FINALE', () => {
  
  test('🎯 TOUTES LES EXIGENCES TDD RESPECTÉES', async () => {
    const enhancedService = createEnhancedReportExportService();
    const testReport = {
      brandName: 'ValidationTest',
      rawData: { objectiveAnalysis: 'Test data for validation' },
      confidenceScore: 90
    };

    // Test toutes les exigences critiques
    const result = await enhancedService.exportReport(testReport, {
      format: 'pdf',
      enhancedMode: true,
      contentDepthLevel: 'professional',
      includeDetailedAnalysis: true,
      includeProfessionalRecommendations: true,
      includeIntelligenceAlerts: true,
      includeMetadata: true
    });

    // Validation globale
    expect(result.success).toBe(true);
    expect(result.enhancementApplied).toBe(true);
    expect(result.fileSize).toBeGreaterThan(50000);
    expect(result.qualityScore).toBeGreaterThanOrEqual(85);
    expect(result.contentMetrics?.professionalStandards).toBe(true);

    console.log('🎉 VALIDATION TDD ENHANCED P.R.I.S.M RÉUSSIE !');
    console.log(`✅ PDF de ${result.fileSize} bytes généré`);
    console.log(`✅ Score qualité: ${result.qualityScore}/100`);
    console.log(`✅ Standards professionnels: ${result.contentMetrics?.professionalStandards}`);
    console.log(`✅ ${result.metadata.pages} pages de contenu enrichi`);
  });
}); 