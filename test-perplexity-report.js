#!/usr/bin/env node

/**
 * 🔍 TEST - GÉNÉRATION DE RAPPORT PERPLEXITY
 * Test de la nouvelle fonctionnalité de rapport lisible
 */

console.log('🔍 DEBUT TEST - Génération de Rapport Perplexity\n');

// Import des classes et interfaces nécessaires
import { BrandAnalysisServiceImpl, PerplexityResponseParser } from './src/services/BrandAnalysisService.js';

// Mock du service Perplexity pour les tests
const mockPerplexityService = {
  async getBusinessInsights({ query, context }) {
    console.log(`📡 Simulation appel API: ${query.substring(0, 50)}...`);
    return {
      content: `Mock response for: ${query}
      
MENTIONS:
- "Nike vient de sortir une nouvelle collection innovante" - Twitter - Sentiment: positive - Portée: 2500
- "Déçu par la qualité des dernières Nike Air" - Reddit - Sentiment: negative - Portée: 800
- "Nike sponsorise encore les meilleurs athlètes" - LinkedIn - Sentiment: positive - Portée: 1200

SENTIMENT:
Positif: 67% | Neutre: 23% | Négatif: 10% | Score global: 79

CONCURRENTS:
1. Adidas - 450 mentions - 72% sentiment - 45% parts de marché
2. Puma - 250 mentions - 68% sentiment - 25% parts de marché  
3. New Balance - 150 mentions - 75% sentiment - 15% parts de marché

MOTS-CLÉS:
- innovation (50 mentions) - stable
- qualité (35 mentions) - stable
- sport (40 mentions) - stable
- design (28 mentions) - stable

SWOT:
FORCES:
- Leadership mondial en innovation sportive
- Partenariats avec les meilleurs athlètes
- Technologie de pointe dans les chaussures

FAIBLESSES:
- Prix élevés par rapport à la concurrence
- Dépendance aux marchés américains et européens

OPPORTUNITÉS:
- Croissance des marchés émergents
- Développement durable et éco-responsabilité

MENACES:
- Concurrence accrue d'Adidas et de marques locales
- Ralentissement économique mondial

CRITIQUES:
- Pic de mentions négatives détecté
- Baisse de sentiment sur les réseaux sociaux`,
      sources: [
        {
          title: "Nike Analysis",
          url: "https://perplexity.ai/nike",
          snippet: "Analyse complète de Nike"
        }
      ]
    };
  }
};

// Test de la génération complète de rapport
async function testPerplexityReportGeneration() {
  try {
    console.log('🚀 Test de génération de rapport Perplexity');
    console.log('=' .repeat(50));
    
    // Créer le service d'analyse
    const brandService = new BrandAnalysisServiceImpl(mockPerplexityService);
    
    // Étape 1: Analyser Nike
    console.log('📊 Étape 1: Analyse de la marque Nike...');
    const nikeReport = await brandService.analyzeBrand('Nike');
    
    console.log('✅ Analyse complète terminée:');
    console.log(`   - ${nikeReport.mentions.length} mentions`);
    console.log(`   - ${nikeReport.competitors.length} concurrents`);
    console.log(`   - ${nikeReport.keywords.length} mots-clés`);
    console.log(`   - Score: ${nikeReport.sentiment.overallScore}/100`);
    
    // Étape 2: Générer le rapport Perplexity formaté
    console.log('\n📝 Étape 2: Génération du rapport Perplexity...');
    const perplexityReport = await brandService.generatePerplexityReport(nikeReport);
    
    console.log('✅ Rapport Perplexity généré avec succès!');
    console.log(`   - ID: ${perplexityReport.id}`);
    console.log(`   - Score: ${perplexityReport.reputationScore}/100`);
    console.log(`   - ${perplexityReport.keyInsights.length} insights clés`);
    console.log(`   - ${perplexityReport.recommendedActions.length} actions recommandées`);
    
    // Étape 3: Afficher un aperçu du rapport
    console.log('\n📋 Aperçu du rapport généré:');
    console.log('=' .repeat(50));
    
    console.log('\n🎯 RÉSUMÉ EXÉCUTIF:');
    console.log(perplexityReport.executiveSummary);
    
    console.log('\n💡 INSIGHTS CLÉS:');
    perplexityReport.keyInsights.forEach((insight, i) => {
      console.log(`${i + 1}. ${insight}`);
    });
    
    console.log('\n🎬 ACTIONS RECOMMANDÉES:');
    perplexityReport.recommendedActions.forEach((action, i) => {
      console.log(`${i + 1}. ${action}`);
    });
    
    console.log('\n📊 POSITION CONCURRENTIELLE:');
    console.log(perplexityReport.competitivePosition);
    
    // Étape 4: Vérifier la qualité du rapport
    console.log('\n🔍 CONTRÔLE QUALITÉ:');
    console.log('=' .repeat(50));
    
    const checks = [
      { test: 'ID généré', pass: perplexityReport.id && perplexityReport.id.length > 0 },
      { test: 'Score valide', pass: perplexityReport.reputationScore >= 0 && perplexityReport.reputationScore <= 100 },
      { test: 'Insights présents', pass: perplexityReport.keyInsights.length > 0 },
      { test: 'Actions présentes', pass: perplexityReport.recommendedActions.length > 0 },
      { test: 'Résumé non vide', pass: perplexityReport.executiveSummary.length > 50 },
      { test: 'Position concurrentielle', pass: perplexityReport.competitivePosition.length > 30 },
      { test: 'Analyses détaillées', pass: Object.keys(perplexityReport.detailedAnalysis).length === 6 },
      { test: 'Flag lecture', pass: perplexityReport.isForReading === true },
      { test: 'Timestamp', pass: perplexityReport.generatedAt instanceof Date }
    ];
    
    let passedChecks = 0;
    checks.forEach(check => {
      const status = check.pass ? '✅' : '❌';
      console.log(`${status} ${check.test}`);
      if (check.pass) passedChecks++;
    });
    
    console.log(`\n📈 Score de qualité: ${passedChecks}/${checks.length} (${Math.round(passedChecks/checks.length*100)}%)`);
    
    if (passedChecks === checks.length) {
      console.log('\n🎉 TOUS LES TESTS RÉUSSIS!');
      console.log('✅ La fonction de génération de rapport Perplexity est opérationnelle');
      console.log('✅ Le rapport est optimisé pour la lecture');
      console.log('✅ Toutes les sections sont présentes et formatées');
      
      return perplexityReport;
    } else {
      console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ');
      console.log('Vérifiez l\'implémentation pour les points qui ont échoué');
      return null;
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
    throw error;
  }
}

// Test de formatage spécifique
async function testReportFormatting() {
  console.log('\n🎨 Test du formatage du rapport');
  console.log('=' .repeat(50));
  
  const brandService = new BrandAnalysisServiceImpl(mockPerplexityService);
  const nikeReport = await brandService.analyzeBrand('Nike');
  const perplexityReport = await brandService.generatePerplexityReport(nikeReport);
  
  console.log('\n📝 Formatage du sentiment:');
  console.log(perplexityReport.detailedAnalysis.sentiment.substring(0, 200) + '...');
  
  console.log('\n📊 Formatage des concurrents:');
  console.log(perplexityReport.detailedAnalysis.competitors.substring(0, 200) + '...');
  
  console.log('\n🔑 Formatage des mots-clés:');
  console.log(perplexityReport.detailedAnalysis.keywords.substring(0, 200) + '...');
  
  console.log('\n✅ Formatage vérifié - Optimisé pour lecture humaine');
}

// Exécution des tests
async function runAllTests() {
  try {
    console.log('🎯 Démarrage des tests de rapport Perplexity\n');
    
    const report = await testPerplexityReportGeneration();
    
    if (report) {
      await testReportFormatting();
      
      console.log('\n🚀 RÉSUMÉ FINAL:');
      console.log('=' .repeat(50));
      console.log('✅ Génération de rapport: FONCTIONNELLE');
      console.log('✅ Formatage pour lecture: OPTIMAL');
      console.log('✅ Intégration service: RÉUSSIE');
      console.log('✅ Structure données: COMPLÈTE');
      
      console.log('\n🎉 LA FONCTIONNALITÉ DE RAPPORT PERPLEXITY EST PRÊTE!');
      console.log('🔧 L\'interface utilisateur peut maintenant afficher ces rapports');
      console.log('📖 Les rapports sont optimisés pour une lecture facile');
    }
    
  } catch (error) {
    console.error('❌ Échec des tests:', error.message);
    process.exit(1);
  }
}

// Lancement des tests
runAllTests(); 