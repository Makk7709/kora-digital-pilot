/**
 * 🧪 TEST SCRIPT - SERVICE TDD RÉEL PERPLEXITY
 * Validation complète du service sans mocks
 */

import { RealBrandIntelligenceService } from './src/services/RealBrandIntelligenceService.js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

console.log('🔥 =================');
console.log('🚀 TEST SERVICE TDD RÉEL');
console.log('🔥 =================\n');

async function testRealTDDService() {
  try {
    // Vérification clé API
    const apiKey = process.env.VITE_PERPLEXITY_API_KEY;
    if (!apiKey) {
      throw new Error('❌ VITE_PERPLEXITY_API_KEY manquante dans .env');
    }
    
    console.log('✅ Clé API Perplexity configurée');
    
    // Initialisation service
    console.log('📡 Initialisation RealBrandIntelligenceService...');
    const service = new RealBrandIntelligenceService();
    
    // Test avec marque connue
    const testBrand = 'Tesla';
    console.log(`\n🎯 Test deep research pour: ${testBrand}`);
    console.log('⏱️  Début analyse...\n');
    
    const startTime = Date.now();
    
    // APPEL SERVICE RÉEL
    const report = await service.generateRealDeepResearchReport(testBrand);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`\n✅ RAPPORT GÉNÉRÉ avec succès !`);
    console.log(`⏱️  Durée: ${duration}ms\n`);
    
    // Validation structure rapport
    console.log('🔍 VALIDATION STRUCTURE RAPPORT:');
    
    const validations = [
      { test: 'brandName présent', result: !!report.brandName },
      { test: 'objectiveAnalysis présent', result: !!report.objectiveAnalysis },
      { test: 'recentActions présent', result: Array.isArray(report.recentActions) },
      { test: 'strategicAnalysis présent', result: !!report.strategicAnalysis },
      { test: 'swotMetrics présent', result: !!report.swotMetrics },
      { test: 'contentMetrics présent', result: !!report.contentMetrics },
      { test: 'competitiveMetrics présent', result: !!report.competitiveMetrics },
      { test: 'reputationKPIs présent', result: !!report.reputationKPIs },
      { test: 'recommendations présent', result: Array.isArray(report.recommendations) },
      { test: 'alerts présent', result: !!report.alerts },
      { test: 'confidenceScore valide', result: typeof report.confidenceScore === 'number' && report.confidenceScore >= 0 && report.confidenceScore <= 100 },
      { test: 'sources présentes', result: Array.isArray(report.sources) && report.sources.length > 0 }
    ];
    
    validations.forEach(({ test, result }) => {
      console.log(`${result ? '✅' : '❌'} ${test}`);
    });
    
    const successCount = validations.filter(v => v.result).length;
    const successRate = (successCount / validations.length * 100).toFixed(1);
    
    console.log(`\n📊 Taux de réussite: ${successRate}% (${successCount}/${validations.length})`);
    
    // Affichage données clés
    console.log('\n📋 DONNÉES EXTRAITES:');
    console.log(`🏢 Marque: ${report.brandName}`);
    console.log(`📈 Score confiance: ${report.confidenceScore}/100`);
    console.log(`💡 Recommandations: ${report.recommendations.length}`);
    console.log(`⚠️  Alertes: ${Object.keys(report.alerts).length} catégories`);
    console.log(`📊 Innovation Index: ${report.objectiveAnalysis.innovationIndex}`);
    console.log(`🎯 Réputation Score: ${report.objectiveAnalysis.reputationScore}`);
    
    // Validation métriques spécifiques
    console.log('\n🎯 VALIDATION MÉTRIQUES BUSINESS:');
    
    const businessValidations = [
      { 
        metric: 'SWOT Scores', 
        test: report.swotMetrics.strengthsScore >= 0 && report.swotMetrics.weaknessesScore >= 0,
        value: `Forces: ${report.swotMetrics.strengthsScore}, Faiblesses: ${report.swotMetrics.weaknessesScore}`
      },
      { 
        metric: 'Content Volume', 
        test: report.contentMetrics.contentVolume > 0,
        value: `${report.contentMetrics.contentVolume} mentions`
      },
      { 
        metric: 'Market Share', 
        test: report.competitiveMetrics.marketShareEvolution.currentShare > 0,
        value: `${report.competitiveMetrics.marketShareEvolution.currentShare}%`
      },
      { 
        metric: 'Reputation Score', 
        test: report.reputationKPIs.overallReputationScore >= 0 && report.reputationKPIs.overallReputationScore <= 100,
        value: `${report.reputationKPIs.overallReputationScore}/100`
      }
    ];
    
    businessValidations.forEach(({ metric, test, value }) => {
      console.log(`${test ? '✅' : '❌'} ${metric}: ${value}`);
    });
    
    // Test JSON serialization
    console.log('\n🔄 TEST SERIALIZATION:');
    try {
      const jsonReport = JSON.stringify(report, null, 2);
      console.log(`✅ Sérialisation JSON réussie (${(jsonReport.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.log(`❌ Erreur sérialisation: ${err.message}`);
    }
    
    console.log('\n🎉 =================');
    console.log('✅ TEST COMPLÉTÉ AVEC SUCCÈS !');
    console.log('🎉 =================');
    
    return {
      success: true,
      duration,
      report,
      validationRate: successRate
    };
    
  } catch (error) {
    console.error('\n❌ =================');
    console.error('💥 ERREUR LORS DU TEST');
    console.error('❌ =================');
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Test multiple marques
async function testMultipleBrands() {
  const brands = ['Nike', 'Apple', 'Google'];
  const results = [];
  
  console.log('\n🚀 TEST MULTIPLE MARQUES:');
  
  for (const brand of brands) {
    console.log(`\n--- Test ${brand} ---`);
    try {
      const service = new RealBrandIntelligenceService();
      const startTime = Date.now();
      
      const report = await service.generateRealDeepResearchReport(brand);
      const duration = Date.now() - startTime;
      
      results.push({
        brand,
        success: true,
        duration,
        confidenceScore: report.confidenceScore
      });
      
      console.log(`✅ ${brand}: ${duration}ms, Score: ${report.confidenceScore}/100`);
      
    } catch (error) {
      results.push({
        brand,
        success: false,
        error: error.message
      });
      
      console.log(`❌ ${brand}: ${error.message}`);
    }
  }
  
  console.log('\n📊 RÉSUMÉ TESTS MULTIPLES:');
  const successCount = results.filter(r => r.success).length;
  console.log(`Réussite: ${successCount}/${brands.length} (${(successCount/brands.length*100).toFixed(1)}%)`);
  
  return results;
}

// Exécution principale
async function main() {
  // Test simple
  const singleResult = await testRealTDDService();
  
  if (singleResult.success) {
    // Test multiple si simple OK
    console.log('\n🔥 Lancement tests multiples...');
    await testMultipleBrands();
  }
  
  console.log('\n🏁 Tests terminés !');
}

// Lancer les tests
main().catch(console.error); 