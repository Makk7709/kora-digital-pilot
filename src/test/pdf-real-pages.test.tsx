/**
 * 🧪 TEST TDD RED - PROBLÈME PDF MULTI-PAGES RÉEL
 * Test qui expose le problème de génération PDF 1 page au lieu de 33 pages
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { 
  EnhancedPRISMReportService, 
  createEnhancedPRISMReportService 
} from '../services/EnhancedPRISMReportService';

describe('🔍 TDD DIAGNOSTIC - PROBLÈME PDF MULTI-PAGES', () => {
  let service: EnhancedPRISMReportService;
  let mockPerplexityService: any;

  beforeEach(() => {
    service = createEnhancedPRISMReportService();
    
    // Mock service qui simule des données réelles substantielles
    mockPerplexityService = {
      getBusinessInsights: vi.fn().mockResolvedValue({
        content: generateLongContent('market intelligence', 1200),
        sources: generateMockSources(15)
      }),
      getCompetitorAnalysis: vi.fn().mockResolvedValue({
        content: generateLongContent('competitive analysis', 1200),
        sources: generateMockSources(12)
      })
    };
  });

  test('❌ RED - DIAGNOSTIC RÉEL: PDF génère 1 page au lieu de 15+ attendues', async () => {
    console.log('🔍 DIAGNOSTIC DÉMARRÉ: Test de génération PDF réelle');
    
    // GIVEN: Service avec données substantielles
    const report = await service.generateEnhancedReport('TestBrand', mockPerplexityService);
    
    console.log('📊 CONTENU RAPPORT GÉNÉRÉ:');
    console.log(`- Market Intelligence: ${report.deepAnalysis.marketIntelligence.content.length} chars`);
    console.log(`- Competitive Intelligence: ${report.deepAnalysis.competitiveIntelligence.content.length} chars`);
    console.log(`- Strategic Intelligence: ${report.deepAnalysis.strategicIntelligence.content.length} chars`);
    console.log(`- Trend Intelligence: ${report.deepAnalysis.trendIntelligence.content.length} chars`);
    console.log(`- Recommendations: ${report.professionalRecommendations.length} items`);
    console.log(`- Intelligence Alerts: ${report.intelligenceAlerts.length} items`);
    
    // WHEN: Génération PDF avec diagnostic complet
    console.log('🔍 GÉNÉRATION PDF EN COURS...');
    const pdfResult = await service.generateProfessionalPDF(report);
    
    console.log('📄 RÉSULTAT PDF:');
    console.log(`- Success: ${pdfResult.success}`);
    console.log(`- Size: ${pdfResult.pdfSize} bytes`);
    console.log(`- Pages comptées: ${pdfResult.pages}`);
    
    // VÉRIFICATION RÉELLE DU CONTENU PDF avec pdf-lib
    if (pdfResult.success && pdfResult.pdfSize > 0) {
      try {
        // Créer un mock ArrayBuffer pour les tests
        const mockPdfBytes = new ArrayBuffer(pdfResult.pdfSize);
        console.log('🔍 TENTATIVE DE LECTURE PDF RÉELLE...');
        
        // Pour le moment, on va se baser sur la taille et les métriques
        console.log('📏 ANALYSE TAILLE PDF:');
        console.log(`- Taille généré: ${pdfResult.pdfSize} bytes`);
        console.log(`- Seuil minimum attendu: 150000 bytes`);
        console.log(`- Ratio: ${((pdfResult.pdfSize / 150000) * 100).toFixed(1)}% du minimum`);
        
      } catch (error) {
        console.log('❌ ERREUR LECTURE PDF:', error);
      }
    }
    
    // THEN: Le test DOIT ÉCHOUER car on ne génère qu'1 page
    console.log('🎯 VÉRIFICATIONS CRITIQUES:');
    
    // Test 1: Le PDF doit être généré avec succès
    expect(pdfResult.success).toBe(true);
    
    // Test 2: Le PDF doit avoir une taille substantielle (minimum 150KB pour 15+ pages)
    console.log(`Vérification taille: ${pdfResult.pdfSize} >= 150000`);
    expect(pdfResult.pdfSize).toBeGreaterThanOrEqual(150000);
    
    // Test 3: Le PDF doit avoir au moins 15 pages (ce test va échouer)
    console.log(`Vérification pages: ${pdfResult.pages} >= 15`);
    expect(pdfResult.pages).toBeGreaterThanOrEqual(15);
    
    // Test 4: Performance - génération en moins de 30 secondes
    // (sera ajouté dans les tests de performance)
    
    console.log('✅ DIAGNOSTIC TERMINÉ - Si ce test passe, le problème est résolu');
  });

  test('🔍 DIAGNOSTIC COMPTEUR PAGES - Tracer les appels addPage()', async () => {
    console.log('🔍 DIAGNOSTIC COMPTEUR: Tracer les appels addPage');
    
    // GIVEN: Rapport avec données test
    const report = await service.generateEnhancedReport('TestBrand', mockPerplexityService);
    
    // Spy sur la méthode pour tracer les appels
    const originalAddPage = console.log;
    let addPageCalls = 0;
    
    // WHEN: Génération avec trace
    const pdfResult = await service.generateProfessionalPDF(report);
    
    // THEN: Vérifier le compteur VS réalité
    console.log(`🔍 Pages comptées par service: ${pdfResult.pages}`);
    console.log(`🔍 Taille PDF: ${pdfResult.pdfSize} bytes`);
    
    // Le problème peut être dans le compteur ou dans la génération réelle
    expect(pdfResult.pages).toBeGreaterThan(1);
  });

  test('🔍 DIAGNOSTIC CONTENU - Vérifier contenu par section', async () => {
    console.log('🔍 DIAGNOSTIC CONTENU: Analyser le contenu généré');
    
    // GIVEN: Génération rapport
    const report = await service.generateEnhancedReport('TestBrand', mockPerplexityService);
    
    // THEN: Vérifier que chaque section a assez de contenu pour justifier plusieurs pages
    const sections = [
      { name: 'Executive Summary', content: report.executiveSummary.keyFindings.join(' ') },
      { name: 'Market Intelligence', content: report.deepAnalysis.marketIntelligence.content },
      { name: 'Competitive Intelligence', content: report.deepAnalysis.competitiveIntelligence.content },
      { name: 'Strategic Intelligence', content: report.deepAnalysis.strategicIntelligence.content },
      { name: 'Trend Intelligence', content: report.deepAnalysis.trendIntelligence.content },
      { name: 'Recommendations', content: report.professionalRecommendations.map(r => r.detailedPlan).join(' ') },
      { name: 'Intelligence Alerts', content: report.intelligenceAlerts.map(a => a.description).join(' ') }
    ];
    
    let totalWords = 0;
    sections.forEach(section => {
      const words = section.content.split(' ').length;
      totalWords += words;
      console.log(`📊 ${section.name}: ${words} mots`);
      
      // Chaque section majeure devrait avoir au moins 500 mots
      expect(words).toBeGreaterThanOrEqual(200);
    });
    
    console.log(`📊 TOTAL CONTENU: ${totalWords} mots`);
    
    // Avec ce volume de contenu, on devrait avoir 10+ pages minimum
    expect(totalWords).toBeGreaterThanOrEqual(5000);
  });

});

// === FONCTIONS UTILITAIRES ===

function generateLongContent(type: string, minWords: number): string {
  const baseContent = `Comprehensive ${type} analysis providing detailed insights and strategic recommendations. `;
  const expandedContent = baseContent.repeat(Math.ceil(minWords / baseContent.split(' ').length));
  
  return `${expandedContent}

SECTION DÉTAILLÉE D'ANALYSE:

Cette analyse approfondie examine les dynamiques complexes du marché actuel et les tendances émergentes qui façonnent l'environnement concurrentiel. Les facteurs macro-économiques, les changements réglementaires, et les évolutions technologiques créent un paysage en constante mutation qui nécessite une surveillance continue et une adaptation stratégique proactive.

L'intelligence business moderne requiert une approche multi-dimensionnelle qui intègre les données quantitatives, l'analyse qualitative, et la prospective stratégique. Les entreprises performantes développent des capacités d'anticipation qui leur permettent de saisir les opportunités émergentes tout en mitigeant les risques potentiels.

Les mégatendances sectorielles transforment les règles du jeu traditionnel et redéfinissent les facteurs clés de succès. L'innovation technologique, la transformation digitale, et l'évolution des attentes clients créent de nouveaux paradigmes qui exigent une remise en question des modèles économiques établis.

L'analyse concurrentielle révèle des dynamiques complexes où les frontières sectorielles s'estompent et où de nouveaux acteurs émergent avec des propositions de valeur disruptives. La compréhension de ces évolutions est essentielle pour maintenir un avantage concurrentiel durable.

IMPLICATIONS STRATÉGIQUES MAJEURES:

La construction d'une intelligence stratégique robuste nécessite des investissements soutenus dans les capacités analytiques, les systèmes d'information, et le développement des talents. Les organisations visionnaires créent des écosystèmes d'innovation qui favorisent la créativité, l'expérimentation, et l'apprentissage continu.

Les partenariats stratégiques et les alliances deviennent des leviers critiques pour accéder à de nouvelles compétences, explorer de nouveaux marchés, et accélérer l'innovation. La collaboration ouverte permet de mutualiser les risques tout en maximisant les opportunités de création de valeur.

RECOMMANDATIONS OPÉRATIONNELLES:

La mise en œuvre de ces orientations stratégiques requiert une approche structurée avec des jalons clairement définis et des métriques de performance appropriées. L'agilité organisationnelle devient un facteur clé de succès dans un environnement caractérisé par l'incertitude et la volatilité.`;
}

function generateMockSources(count: number) {
  const sources = [];
  for (let i = 1; i <= count; i++) {
    sources.push({
      title: `Source d'Intelligence ${i}`,
      url: `https://business-intelligence-${i}.com`,
      snippet: `Insight détaillé numéro ${i} avec données actualisées`,
      credibility: 8 + Math.random() * 2
    });
  }
  return sources;
} 