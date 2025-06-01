#!/usr/bin/env node

/**
 * 🔍 AUDIT DE DEBUG - VEILLE DE MARQUE
 * Test du parsing et de l'affichage des données Perplexity
 */

console.log('🔍 DEBUT AUDIT - Veille de Marque\n');

// Simuler une réponse Perplexity typique
const mockPerplexityResponse = {
  content: `
ANALYSE MENTIONS NIKE:

Mentions récentes:
- "Nike vient de sortir une nouvelle collection innovante" - Twitter - Sentiment: positive - Portée: 2500
- "Déçu par la qualité des dernières Nike Air" - Reddit - Sentiment: negative - Portée: 800
- "Nike sponsorise encore les meilleurs athlètes" - LinkedIn - Sentiment: positive - Portée: 1200

ANALYSE SENTIMENT:
- Positif: 67%
- Neutre: 23%
- Négatif: 10%

CONCURRENTS PRINCIPAUX:
1. Adidas - 45% part de voix - Sentiment: 72%
2. Puma - 25% part de voix - Sentiment: 68%
3. New Balance - 15% part de voix - Sentiment: 75%

MOTS-CLÉS ASSOCIÉS:
innovation (50), qualité (35), sport (40), design (28), technologie (32)

ANALYSE SWOT:

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
  `,
  sources: []
};

// Test du parser intelligent
class TestPerplexityResponseParser {
  
  parseMentions(response, brandName) {
    console.log('📝 TEST PARSING MENTIONS\n');
    
    const mentions = [];
    
    // Regex pour extraire les mentions du format standard
    const mentionRegex = /"([^"]+)"\s*-\s*(\w+)\s*-\s*Sentiment:\s*(\w+)\s*-\s*Portée:\s*(\d+)/gi;
    let match;
    let id = 1;
    
    while ((match = mentionRegex.exec(response)) !== null) {
      const [, content, source, sentiment, reach] = match;
      
      mentions.push({
        id: id.toString(),
        content,
        source,
        sentiment: sentiment.toLowerCase(),
        date: new Date(),
        reach: parseInt(reach),
        isReal: true
      });
      id++;
    }

    console.log(`✅ Mentions extraites: ${mentions.length}`);
    mentions.forEach((mention, i) => {
      console.log(`   ${i + 1}. [${mention.sentiment.toUpperCase()}] ${mention.content} (${mention.source})`);
    });
    
    return mentions;
  }

  parseSentiment(response) {
    console.log('\n📊 TEST PARSING SENTIMENT\n');
    
    // Regex pour extraire les pourcentages de sentiment
    const positiveMatch = response.match(/Positif:\s*(\d+)%/i);
    const negativeMatch = response.match(/Négatif:\s*(\d+)%/i);
    const neutralMatch = response.match(/Neutre:\s*(\d+)%/i);
    
    const positive = positiveMatch ? parseInt(positiveMatch[1]) : 0;
    const negative = negativeMatch ? parseInt(negativeMatch[1]) : 0;
    const neutral = neutralMatch ? parseInt(neutralMatch[1]) : 0;
    
    console.log(`✅ Sentiment extrait:`);
    console.log(`   Positif: ${positive}%`);
    console.log(`   Neutre: ${neutral}%`);
    console.log(`   Négatif: ${negative}%`);
    
    // Calcul du score global
    const overallScore = Math.round((positive * 1 + neutral * 0.5 + negative * 0) / (positive + neutral + negative) * 100);
    
    console.log(`   Score global: ${overallScore}/100`);
    
    return {
      overallScore,
      positive,
      neutral,
      negative,
      trend: positive > negative + 10 ? 'positive' : negative > positive + 10 ? 'negative' : 'stable',
      isCalculatedFromReal: true
    };
  }

  parseCompetitors(response) {
    console.log('\n🏢 TEST PARSING CONCURRENTS\n');
    
    const competitors = [];
    
    // Regex pour extraire les concurrents - format principal
    const competitorRegex = /(\w+[\w\s]*)\s*-\s*(\d+)%\s*part de voix\s*-\s*Sentiment:\s*(\d+)%/gi;
    let match;
    
    while ((match = competitorRegex.exec(response)) !== null) {
      const [, name, marketShare, sentiment] = match;
      
      competitors.push({
        name: name.trim(),
        mentions: Math.round(parseInt(marketShare) * 10),
        sentiment: parseInt(sentiment),
        marketShare: parseInt(marketShare),
        isFromPerplexity: true
      });
    }

    console.log(`✅ Concurrents extraits: ${competitors.length}`);
    competitors.forEach((comp, i) => {
      console.log(`   ${i + 1}. ${comp.name} - ${comp.marketShare}% part de voix (${comp.sentiment}% sentiment)`);
    });
    
    return competitors;
  }

  parseKeywords(response) {
    console.log('\n🔑 TEST PARSING MOTS-CLÉS\n');
    
    const keywords = [];
    
    // Regex pour extraire les mots-clés avec leur nombre de mentions
    const keywordRegex = /(\w+[\w\s]*)\s*\((\d+)\)/gi;
    let match;
    
    while ((match = keywordRegex.exec(response)) !== null) {
      const [, word, count] = match;
      
      keywords.push({
        word: word.trim(),
        count: parseInt(count),
        trend: 'stable',
        isFromContent: true
      });
    }

    console.log(`✅ Mots-clés extraits: ${keywords.length}`);
    keywords.forEach((keyword, i) => {
      console.log(`   ${i + 1}. ${keyword.word} (${keyword.count} mentions)`);
    });
    
    return keywords;
  }

  parseSWOT(response) {
    console.log('\n🎯 TEST PARSING SWOT\n');
    
    const swot = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      isAIGenerated: true
    };
    
    // Extraction des forces
    const strengthsMatch = response.match(/FORCES?:(.*?)(?=FAIBLESSES?:|OPPORTUNITÉS?:|MENACES?:|$)/si);
    if (strengthsMatch) {
      const strengthsText = strengthsMatch[1];
      const strengthsList = strengthsText.match(/[-•]\s*([^\n\r]+)/g);
      if (strengthsList) {
        swot.strengths = strengthsList.map(item => item.replace(/[-•]\s*/, '').trim());
      }
    }
    
    // Extraction des faiblesses
    const weaknessesMatch = response.match(/FAIBLESSES?:(.*?)(?=OPPORTUNITÉS?:|MENACES?:|$)/si);
    if (weaknessesMatch) {
      const weaknessesText = weaknessesMatch[1];
      const weaknessesList = weaknessesText.match(/[-•]\s*([^\n\r]+)/g);
      if (weaknessesList) {
        swot.weaknesses = weaknessesList.map(item => item.replace(/[-•]\s*/, '').trim());
      }
    }
    
    // Extraction des opportunités
    const opportunitiesMatch = response.match(/OPPORTUNITÉS?:(.*?)(?=MENACES?:|$)/si);
    if (opportunitiesMatch) {
      const opportunitiesText = opportunitiesMatch[1];
      const opportunitiesList = opportunitiesText.match(/[-•]\s*([^\n\r]+)/g);
      if (opportunitiesList) {
        swot.opportunities = opportunitiesList.map(item => item.replace(/[-•]\s*/, '').trim());
      }
    }
    
    // Extraction des menaces
    const threatsMatch = response.match(/MENACES?:(.*?)$/si);
    if (threatsMatch) {
      const threatsText = threatsMatch[1];
      const threatsList = threatsText.match(/[-•]\s*([^\n\r]+)/g);
      if (threatsList) {
        swot.threats = threatsList.map(item => item.replace(/[-•]\s*/, '').trim());
      }
    }
    
    console.log(`✅ SWOT extrait:`);
    console.log(`   Forces: ${swot.strengths.length} éléments`);
    console.log(`   Faiblesses: ${swot.weaknesses.length} éléments`);
    console.log(`   Opportunités: ${swot.opportunities.length} éléments`);
    console.log(`   Menaces: ${swot.threats.length} éléments`);
    
    return swot;
  }
}

// Tests complets
async function runTests() {
  const parser = new TestPerplexityResponseParser();
  const brandName = 'Nike';
  
  console.log(`🎯 Test d'analyse pour: ${brandName}\n`);
  console.log('=' * 50);
  
  try {
    // Test parsing mentions
    const mentions = parser.parseMentions(mockPerplexityResponse.content, brandName);
    
    // Test parsing sentiment
    const sentiment = parser.parseSentiment(mockPerplexityResponse.content);
    
    // Test parsing concurrents
    const competitors = parser.parseCompetitors(mockPerplexityResponse.content);
    
    // Test parsing mots-clés
    const keywords = parser.parseKeywords(mockPerplexityResponse.content);
    
    // Test parsing SWOT
    const swot = parser.parseSWOT(mockPerplexityResponse.content);
    
    // Rapport final
    console.log('\n🎉 RAPPORT FINAL D\'AUDIT\n');
    console.log('=' * 50);
    
    const report = {
      mentions,
      sentiment,
      competitors,
      keywords,
      swot,
      brandName,
      analysisTimestamp: new Date()
    };
    
    console.log(`✅ Rapport généré avec succès pour ${brandName}`);
    console.log(`📊 ${mentions.length} mentions | ${competitors.length} concurrents | ${keywords.length} mots-clés`);
    console.log(`🎯 Score sentiment: ${sentiment.overallScore}/100 (${sentiment.trend})`);
    
    // Vérifier les problèmes potentiels
    console.log('\n🔍 DIAGNOSTIC DES PROBLÈMES POTENTIELS\n');
    
    const issues = [];
    
    if (mentions.length === 0) issues.push('❌ Aucune mention extraite - Problème de regex');
    if (sentiment.positive + sentiment.neutral + sentiment.negative === 0) issues.push('❌ Sentiment non parsé');
    if (competitors.length === 0) issues.push('❌ Aucun concurrent extrait');
    if (keywords.length === 0) issues.push('❌ Aucun mot-clé extrait');
    if (swot.strengths.length === 0 && swot.weaknesses.length === 0) issues.push('❌ SWOT non parsé');
    
    if (issues.length === 0) {
      console.log('✅ Aucun problème détecté - Le parsing fonctionne correctement !');
    } else {
      console.log('🚨 Problèmes détectés:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    return report;
    
  } catch (error) {
    console.error('❌ ERREUR LORS DU TEST:', error.message);
    console.error(error.stack);
  }
}

// Lancer les tests
runTests()
  .then(() => {
    console.log('\n🏁 Audit terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Audit échoué:', error);
    process.exit(1);
  }); 