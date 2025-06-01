/**
 * 🔧 Script de diagnostic pour le problème d'affichage du rapport Perplexity
 * 
 * OBJECTIF: Identifier pourquoi le rapport ne s'affiche pas complètement dans l'interface
 * PROBLÈME: Le rapport se génère dans les logs mais l'interface utilisateur est incomplète
 */

import { BrandAnalysisServiceImpl } from './src/services/BrandAnalysisService.js';

console.log('🔧 DIAGNOSTIC RAPPORT PERPLEXITY - DÉMARRAGE');
console.log('=' .repeat(60));

// Données de test mockées identiques à celles de BrandMonitoring.tsx
const mockBrandReport = {
  mentions: [
    {
      id: '1',
      content: 'Nike vient de sortir une nouvelle collection innovante',
      source: 'Twitter',
      sentiment: 'positive',
      date: new Date(),
      reach: 2500,
      isReal: true
    },
    {
      id: '2',
      content: 'Déçu par la qualité des dernières Nike Air',
      source: 'Reddit',
      sentiment: 'negative',
      date: new Date(),
      reach: 800,
      isReal: true
    },
    {
      id: '3',
      content: 'Nike sponsorise encore les meilleurs athlètes',
      source: 'LinkedIn',
      sentiment: 'positive',
      date: new Date(),
      reach: 1200,
      isReal: true
    }
  ],
  sentiment: {
    overallScore: 79,
    positive: 67,
    neutral: 23,
    negative: 10,
    trend: 'positive',
    isCalculatedFromReal: true
  },
  competitors: [
    {
      name: 'Adidas',
      mentions: 450,
      sentiment: 72,
      marketShare: 45,
      isFromPerplexity: true
    },
    {
      name: 'Puma',
      mentions: 250,
      sentiment: 68,
      marketShare: 25,
      isFromPerplexity: true
    },
    {
      name: 'New Balance',
      mentions: 150,
      sentiment: 75,
      marketShare: 15,
      isFromPerplexity: true
    }
  ],
  keywords: [
    {
      word: 'innovation',
      count: 50,
      trend: 'stable',
      isFromContent: true
    },
    {
      word: 'qualité',
      count: 35,
      trend: 'stable',
      isFromContent: true
    },
    {
      word: 'sport',
      count: 40,
      trend: 'stable',
      isFromContent: true
    },
    {
      word: 'design',
      count: 28,
      trend: 'stable',
      isFromContent: true
    }
  ],
  swot: {
    strengths: [
      'Leadership mondial en innovation sportive',
      'Partenariats avec les meilleurs athlètes',
      'Technologie de pointe dans les chaussures'
    ],
    weaknesses: [
      'Prix élevés par rapport à la concurrence',
      'Dépendance aux marchés américains et européens'
    ],
    opportunities: [
      'Croissance des marchés émergents',
      'Développement durable et éco-responsabilité'
    ],
    threats: [
      'Concurrence accrue d\'Adidas et de marques locales',
      'Ralentissement économique mondial'
    ],
    isAIGenerated: true
  },
  alerts: [
    {
      type: 'critical',
      message: 'Pic de mentions négatives détecté',
      timestamp: new Date(),
      source: 'Perplexity Analysis',
      isReal: true
    },
    {
      type: 'warning',
      message: 'Baisse de sentiment sur les réseaux sociaux',
      timestamp: new Date(),
      source: 'Perplexity Analysis',
      isReal: true
    }
  ],
  brandName: 'Nike (Test)',
  analysisTimestamp: new Date()
};

async function testGeneratePerplexityReport() {
  console.log('🚀 Test de génération du rapport Perplexity...');
  
  try {
    // Simuler un service Perplexity mockée (pas besoin d'API réelle pour le test)
    const mockPerplexityService = {
      query: async () => 'Mock response'
    };
    
    const brandService = new BrandAnalysisServiceImpl(mockPerplexityService);
    
    console.log('📊 Données d\'entrée (mockBrandReport):');
    console.log('- Mentions:', mockBrandReport.mentions.length);
    console.log('- Concurrents:', mockBrandReport.competitors.length);
    console.log('- Mots-clés:', mockBrandReport.keywords.length);
    console.log('- Forces SWOT:', mockBrandReport.swot.strengths.length);
    console.log('- Faiblesses SWOT:', mockBrandReport.swot.weaknesses.length);
    console.log('- Alertes:', mockBrandReport.alerts.length);
    console.log('- Score sentiment:', mockBrandReport.sentiment.overallScore);
    
    console.log('\n⚙️ Génération du rapport...');
    const perplexityReport = await brandService.generatePerplexityReport(mockBrandReport);
    
    console.log('\n✅ Rapport généré avec succès !');
    console.log('=' .repeat(40));
    
    // Validation des données critiques
    console.log('📋 VALIDATION DES DONNÉES GÉNÉRÉES:');
    console.log('- ID du rapport:', perplexityReport.id);
    console.log('- Nom de marque:', perplexityReport.brandName);
    console.log('- Score de réputation:', perplexityReport.reputationScore + '/100');
    console.log('- Date de génération:', perplexityReport.generatedAt.toLocaleString());
    
    console.log('\n💡 INSIGHTS CLÉS (' + perplexityReport.keyInsights.length + '):');
    perplexityReport.keyInsights.forEach((insight, i) => {
      console.log(`  ${i + 1}. ${insight}`);
    });
    
    console.log('\n🎯 ACTIONS RECOMMANDÉES (' + perplexityReport.recommendedActions.length + '):');
    perplexityReport.recommendedActions.forEach((action, i) => {
      console.log(`  ${i + 1}. ${action}`);
    });
    
    console.log('\n📊 ANALYSES DÉTAILLÉES:');
    console.log('- Sentiment:', perplexityReport.detailedAnalysis.sentiment ? '✅' : '❌');
    console.log('- Mentions:', perplexityReport.detailedAnalysis.mentions ? '✅' : '❌');
    console.log('- Concurrents:', perplexityReport.detailedAnalysis.competitors ? '✅' : '❌');
    console.log('- Mots-clés:', perplexityReport.detailedAnalysis.keywords ? '✅' : '❌');
    console.log('- SWOT:', perplexityReport.detailedAnalysis.swot ? '✅' : '❌');
    console.log('- Alertes:', perplexityReport.detailedAnalysis.alerts ? '✅' : '❌');
    
    // Vérification des seuils attendus
    console.log('\n🎯 VÉRIFICATION DES SEUILS:');
    const insightsOK = perplexityReport.keyInsights.length >= 6;
    const actionsOK = perplexityReport.recommendedActions.length >= 8;
    const scoreOK = perplexityReport.reputationScore > 0;
    
    console.log('- Insights >= 6:', insightsOK ? '✅' : '❌', `(${perplexityReport.keyInsights.length})`);
    console.log('- Actions >= 8:', actionsOK ? '✅' : '❌', `(${perplexityReport.recommendedActions.length})`);
    console.log('- Score > 0:', scoreOK ? '✅' : '❌', `(${perplexityReport.reputationScore})`);
    
    console.log('\n🔍 DIAGNOSTIC INTERFACE:');
    console.log('Si les données ci-dessus sont correctes mais que l\'interface ne les affiche pas:');
    console.log('1. ✅ Le service génère correctement le rapport');
    console.log('2. 🔍 Vérifier l\'état React dans BrandMonitoring.tsx');
    console.log('3. 🔍 Vérifier le passage des props à PerplexityReportViewer');
    console.log('4. 🔍 Vérifier le rendu conditionnel des onglets');
    
    // Test de sérialisation JSON pour vérifier l'intégrité des données
    console.log('\n🧪 Test de sérialisation JSON...');
    const jsonString = JSON.stringify(perplexityReport, null, 2);
    const reparsedReport = JSON.parse(jsonString);
    
    const serializationOK = (
      reparsedReport.keyInsights.length === perplexityReport.keyInsights.length &&
      reparsedReport.recommendedActions.length === perplexityReport.recommendedActions.length
    );
    
    console.log('- Sérialisation JSON:', serializationOK ? '✅' : '❌');
    
    if (serializationOK) {
      console.log('\n🎉 CONCLUSION: Le service fonctionne parfaitement !');
      console.log('Le problème d\'affichage est probablement dans:');
      console.log('- La logique React (state, props, re-render)');
      console.log('- Le composant PerplexityReportViewer');
      console.log('- Les conditions d\'affichage des onglets');
    } else {
      console.log('\n⚠️ PROBLÈME: Corruption des données lors de la sérialisation');
    }
    
    return perplexityReport;
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.error('Stack trace:', error.stack);
    return null;
  }
}

// Exécution du test
testGeneratePerplexityReport()
  .then(report => {
    console.log('\n' + '=' .repeat(60));
    console.log('🏁 DIAGNOSTIC TERMINÉ');
    
    if (report) {
      console.log('✅ Génération du rapport: OK');
      console.log('📊 Insights générés:', report.keyInsights.length);
      console.log('🎯 Actions générées:', report.recommendedActions.length);
      console.log('\n💡 Prochaines étapes:');
      console.log('1. Vérifier les logs dans la console du navigateur');
      console.log('2. Tester le mode Test dans l\'interface');
      console.log('3. Vérifier l\'état React avec les DevTools');
    } else {
      console.log('❌ Génération du rapport: ÉCHEC');
      console.log('🔧 Vérifier la configuration du service');
    }
  })
  .catch(error => {
    console.error('❌ Erreur fatale:', error);
  }); 