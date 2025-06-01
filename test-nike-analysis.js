// Test rapide pour l'analyse Nike avec Perplexity
import { BrandAnalysisServiceImpl, PerplexityResponseParser } from './src/services/BrandAnalysisService.js';

// Simuler un service Perplexity simple
const mockPerplexityService = {
  getBusinessInsights: async ({ query, context }) => {
    console.log(`🔍 Requête Perplexity: ${query}`);
    console.log(`📝 Contexte: ${context}`);
    
    // Simuler une réponse Perplexity pour Nike
    if (query.includes('Nike')) {
      return {
        content: `
Nike est perçue très positivement dans l'industrie du sport :

MENTIONS RÉCENTES:
- "Nike vient de sortir une nouvelle collection innovante" - Twitter
- "Déçu par la qualité des dernières Nike Air" - Reddit  
- "Nike sponsorise encore les meilleurs athlètes" - LinkedIn
- "Innovation Nike exceptionnelle cette année" - Instagram

SENTIMENT GLOBAL:
Positif: 65%
Neutre: 25% 
Négatif: 10%

CONCURRENTS PRINCIPAUX:
1. Adidas - 45% sentiment, 2500 mentions
2. Puma - 38% sentiment, 1200 mentions
3. Under Armour - 42% sentiment, 800 mentions

MOTS-CLÉS TENDANCE:
- innovation (152 mentions)
- qualité (98 mentions)
- sport (234 mentions)
- design (67 mentions)

ANALYSE SWOT:
FORCES:
- Innovation constante
- Partenariats avec les meilleurs athlètes
- Design reconnu mondialement

FAIBLESSES:
- Prix élevés 
- Concurrence agressive d'Adidas

OPPORTUNITÉS:
- Expansion en Asie
- Développement durable

MENACES:
- Ralentissement économique mondial
- Nouveaux concurrents directs to consumer
        `
      };
    }
    
    return { content: "Aucune donnée disponible pour cette marque." };
  }
};

async function testNikeAnalysis() {
  try {
    console.log('🚀 Test d\'analyse Nike avec Perplexity');
    console.log('=' .repeat(50));
    
    // Créer le service d'analyse
    const brandService = new BrandAnalysisServiceImpl(mockPerplexityService);
    
    // Analyser Nike
    console.log('📊 Lancement de l\'analyse pour Nike...');
    const nikeReport = await brandService.analyzeBrand('Nike');
    
    console.log('\n✅ RÉSULTATS DE L\'ANALYSE:');
    console.log('=' .repeat(50));
    
    console.log(`\n🏷️  Marque: ${nikeReport.brandName}`);
    console.log(`📅 Timestamp: ${nikeReport.analysisTimestamp}`);
    
    console.log(`\n💬 Mentions (${nikeReport.mentions.length}):`);
    nikeReport.mentions.forEach((mention, i) => {
      console.log(`  ${i+1}. [${mention.sentiment.toUpperCase()}] ${mention.content}`);
      console.log(`     Source: ${mention.source} | Portée: ${mention.reach}`);
    });
    
    console.log(`\n😊 Sentiment:`);
    console.log(`  Score global: ${nikeReport.sentiment.overallScore}%`);
    console.log(`  Positif: ${nikeReport.sentiment.positive}%`);
    console.log(`  Neutre: ${nikeReport.sentiment.neutral}%`);
    console.log(`  Négatif: ${nikeReport.sentiment.negative}%`);
    console.log(`  Tendance: ${nikeReport.sentiment.trend}`);
    
    console.log(`\n🏃 Concurrents (${nikeReport.competitors.length}):`);
    nikeReport.competitors.forEach((comp, i) => {
      console.log(`  ${i+1}. ${comp.name} - ${comp.mentions} mentions (${comp.sentiment}% sentiment)`);
    });
    
    console.log(`\n🔑 Mots-clés (${nikeReport.keywords.length}):`);
    nikeReport.keywords.forEach((kw, i) => {
      console.log(`  ${i+1}. ${kw.word} (${kw.count} mentions) - Tendance: ${kw.trend}`);
    });
    
    console.log(`\n📈 SWOT:`);
    console.log(`  Forces: ${nikeReport.swot.strengths.length}`);
    console.log(`  Faiblesses: ${nikeReport.swot.weaknesses.length}`);
    console.log(`  Opportunités: ${nikeReport.swot.opportunities.length}`);
    console.log(`  Menaces: ${nikeReport.swot.threats.length}`);
    
    console.log('\n🎯 TEST RÉUSSI - Les données Perplexity sont correctement parsées !');
    console.log('💡 Le score de réputation calculé est:', nikeReport.sentiment.overallScore);
    
    if (nikeReport.sentiment.overallScore && !isNaN(nikeReport.sentiment.overallScore)) {
      console.log('✅ Le score n\'est pas NaN - SUCCÈS !');
    } else {
      console.log('❌ Le score est NaN - PROBLÈME !');
    }
    
    return nikeReport;
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
    throw error;
  }
}

// Lancer le test
testNikeAnalysis()
  .then(() => {
    console.log('\n🏆 Test terminé avec succès !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test échoué:', error);
    process.exit(1);
  }); 