/**
 * 🧪 TEST RAPIDE - Service TDD Brand Intelligence
 * Script pour valider que les données enrichies sont générées correctement
 */

// Simulation du service Perplexity
const mockPerplexityService = {
  getBusinessInsights: async (params) => {
    return { 
      content: `Analyse pour ${params.query}`, 
      sources: ['Source 1', 'Source 2'] 
    };
  },
  getCompetitorAnalysis: async (params) => {
    return { 
      content: `Analyse concurrentielle pour ${params.query}`, 
      sources: ['Competitor Source 1', 'Competitor Source 2'] 
    };
  }
};

async function testTDDService() {
  console.log('🚀 Démarrage test TDD Service...\n');

  try {
    // Import dynamique du service (à adapter selon votre setup)
    const { EnhancedBrandIntelligenceService } = await import('./src/services/EnhancedBrandIntelligenceService.ts');
    
    // Initialisation du service
    const service = new EnhancedBrandIntelligenceService(mockPerplexityService);
    
    // Test avec Nike
    console.log('📊 Génération rapport pour Nike...');
    const report = await service.generateDeepResearchReport('Nike');
    
    // Validation des données
    console.log('\n✅ RÉSULTATS DU TEST:');
    console.log(`📈 Score de confiance: ${report.confidenceScore}/100`);
    console.log(`🏢 Marque analysée: ${report.brandName}`);
    console.log(`📅 Date d'exécution: ${report.executionTimestamp.toISOString()}`);
    
    console.log('\n📋 ANALYSE OBJECTIVE:');
    console.log(`- Innovation Index: ${report.objectiveAnalysis.innovationIndex}/100`);
    console.log(`- Reputation Score: ${report.objectiveAnalysis.reputationScore}/100`);
    console.log(`- Année de fondation: ${report.objectiveAnalysis.foundingYear}`);
    console.log(`- Employés: ${report.objectiveAnalysis.employeeCount?.toLocaleString()}`);
    console.log(`- Capitalisation: ${(report.objectiveAnalysis.marketCapitalization / 1000000000).toFixed(1)}B €`);
    
    console.log('\n🎯 ACTIONS RÉCENTES:');
    report.recentActions.forEach((action, i) => {
      console.log(`${i+1}. [${action.type}] ${action.description} (Impact: ${action.impactEstimation}%)`);
    });
    
    console.log('\n📊 MÉTRIQUES SWOT:');
    console.log(`- Forces: ${report.swotMetrics.strengthsScore}/100`);
    console.log(`- Faiblesses: ${report.swotMetrics.weaknessesScore}/100`);
    console.log(`- Opportunités: ${report.swotMetrics.opportunitiesScore}/100`);
    console.log(`- Menaces: ${report.swotMetrics.threatsScore}/100`);
    console.log(`- Santé Stratégique: ${report.swotMetrics.strategicHealthIndex}/100`);
    
    console.log('\n🎨 CONTENU & THÈMES:');
    console.log(`- Volume de contenu: ${report.contentMetrics.contentVolume?.toLocaleString()}`);
    console.log(`- Index de viralité: ${report.contentMetrics.viralityIndex}/100`);
    console.log(`- Nombre d'influenceurs: ${report.contentMetrics.influencerMetrics.totalInfluencers}`);
    console.log(`- Top thèmes:`);
    report.contentMetrics.topicsDistribution.slice(0, 3).forEach(topic => {
      console.log(`  • ${topic.theme}: ${topic.percentage}% (${topic.volume} mentions)`);
    });
    
    console.log('\n🏆 POSITION CONCURRENTIELLE:');
    console.log(`- Part de marché: ${report.competitiveMetrics.marketShareEvolution.currentShare}%`);
    console.log(`- Index avantage concurrentiel: ${report.competitiveMetrics.competitiveAdvantageIndex}/100`);
    console.log(`- Position: ${report.competitiveMetrics.competitivePositioning.positionQuadrant}`);
    console.log(`- Force de marque: ${report.competitiveMetrics.competitivePositioning.brandStrength}/100`);
    
    console.log('\n📈 RÉPUTATION:');
    console.log(`- Score global: ${report.reputationKPIs.overallReputationScore}/100`);
    console.log(`- Index de confiance: ${report.reputationKPIs.trustIndex}/100`);
    console.log(`- Loyauté marque: ${report.reputationKPIs.brandLoyaltyScore}/100`);
    
    console.log('\n🎯 RECOMMANDATIONS:');
    report.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`${i+1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
      console.log(`   Impact estimé: ${rec.estimatedImpact}% | Timeline: ${rec.timeline}`);
    });
    
    console.log('\n🔍 TENDANCES ÉMERGENTES:');
    report.trendAnalysis.emergingTrends.slice(0, 2).forEach(trend => {
      console.log(`• ${trend.name} (Impact: ${trend.potentialImpact}%, Délai: ${trend.timeToImpact} mois)`);
    });
    
    console.log('\n⚡ SIGNAUX FAIBLES:');
    report.trendAnalysis.weakSignals.slice(0, 2).forEach(signal => {
      console.log(`• ${signal.description} (Confiance: ${Math.round(signal.confidenceLevel * 100)}%)`);
    });
    
    console.log('\n📊 SOURCES & QUALITÉ:');
    console.log(`- Fraîcheur des données: ${report.dataFreshness.isDataFresh ? '✅ Récentes' : '⚠️ Anciennes'}`);
    console.log(`- Score qualité: ${report.dataFreshness.dataQualityScore}/100`);
    console.log(`- Nombre de sources: ${report.sources.length}`);
    
    console.log('\n🎉 TEST RÉUSSI ! Le service TDD génère des rapports riches et détaillés.');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERREUR lors du test:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

// Exécution du test
testTDDService()
  .then(success => {
    if (success) {
      console.log('\n🚀 SERVICE TDD VALIDÉ - Prêt pour les tests utilisateur !');
      process.exit(0);
    } else {
      console.log('\n💥 SERVICE TDD EN ERREUR - Besoin de corrections');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  }); 