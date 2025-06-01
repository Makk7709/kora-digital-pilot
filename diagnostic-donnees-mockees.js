// Diagnostic approfondi des données encore mockées dans RealBrandIntelligenceService
console.log('🔍 DIAGNOSTIC APPROFONDI - DONNÉES ENCORE MOCKÉES');
console.log('=================================================\n');

// Simulation des méthodes actuelles du service
class DiagnosticService {
  
  // ==================== DONNÉES MOCKÉES IDENTIFIÉES ====================
  
  // 1. parseRealRecommendations - COMPLÈTEMENT MOCKÉ
  parseRealRecommendations_PROBLEME(content) {
    return [
      {
        title: 'Accélération transformation digitale', // ❌ HARDCODÉ !
        description: 'Investissement massif dans les capacités numériques et data analytics', // ❌ HARDCODÉ !
        category: 'short-term', // ❌ HARDCODÉ !
        priority: 'high', // ❌ HARDCODÉ !
        estimatedImpact: 85, // ❌ HARDCODÉ !
        resourcesRequired: ['Budget IT', 'Talents data', 'Formation équipes'], // ❌ HARDCODÉ !
        timeline: '6-12 mois', // ❌ HARDCODÉ !
        successMetrics: ['ROI digital', 'NPS', 'Efficacité opérationnelle'], // ❌ HARDCODÉ !
        riskLevel: 'medium', // ❌ HARDCODÉ !
        dependencies: ['Sponsoring direction', 'Budget validé'], // ❌ HARDCODÉ !
        budget: { min: 2500000, max: 4000000, currency: 'EUR', confidence: 78 }, // ❌ HARDCODÉ !
        ownerDepartment: 'DSI & Innovation' // ❌ HARDCODÉ !
      }
    ];
  }

  // 2. parseRealAlerts - COMPLÈTEMENT MOCKÉ
  parseRealAlerts_PROBLEME(content) {
    return {
      critical: [],
      warning: [
        {
          metric: 'Part de marché', // ❌ HARDCODÉ !
          currentValue: 22.5, // ❌ HARDCODÉ !
          threshold: 25, // ❌ HARDCODÉ !
          deviation: -2.5, // ❌ HARDCODÉ !
          recommendedAction: 'Renforcer stratégie acquisition clients', // ❌ HARDCODÉ !
          urgency: 'medium', // ❌ HARDCODÉ !
          context: 'Érosion progressive face à nouveaux entrants', // ❌ HARDCODÉ !
          historicalComparison: -0.8 // ❌ HARDCODÉ !
        }
      ],
      info: [],
      opportunities: [
        {
          metric: 'Marchés émergents', // ❌ HARDCODÉ !
          currentValue: 5, // ❌ HARDCODÉ !
          threshold: 15, // ❌ HARDCODÉ !
          deviation: 10, // ❌ HARDCODÉ !
          recommendedAction: 'Expansion géographique ciblée', // ❌ HARDCODÉ !
          urgency: 'low', // ❌ HARDCODÉ !
          context: 'Potentiel croissance Asie-Pacifique', // ❌ HARDCODÉ !
          historicalComparison: 0 // ❌ HARDCODÉ !
        }
      ]
    };
  }

  // 3. Méthodes de fallback avec données mockées
  extractMarketShare_PROBLEME(content) {
    // ❌ Retourne toujours 22.5 si pas trouvé !
    const match = content.match(/part.*?marché.*?(\d{1,2}(?:\.\d+)?)%/i);
    return match ? parseFloat(match[1]) : 22.5; // ❌ HARDCODÉ !
  }

  extractMarketTrend_PROBLEME(content) {
    // ❌ Retourne toujours 'stable' !
    return 'stable'; // ❌ HARDCODÉ !
  }

  extractProjectedShare_PROBLEME(content) {
    // ❌ Formule simpliste hardcodée !
    return this.extractMarketShare_PROBLEME(content) + 2; // ❌ HARDCODÉ !
  }

  extractHistoricalShares_PROBLEME(content) {
    // ❌ Données complètement fictives !
    return [
      { period: 'Q1 2024', share: 22.1, volume: 1200000, value: 850000000 }, // ❌ HARDCODÉ !
      { period: 'Q2 2024', share: 22.8, volume: 1250000, value: 920000000 }, // ❌ HARDCODÉ !
      { period: 'Q3 2024', share: 22.5, volume: 1180000, value: 890000000 }  // ❌ HARDCODÉ !
    ];
  }

  extractBenchmarkPosition_PROBLEME(content) {
    // ❌ Retourne toujours 2 !
    return 2; // ❌ HARDCODÉ !
  }

  extractCompetitiveAdvantageIndex_PROBLEME(content) {
    // ❌ Retourne toujours 74 !
    return 74; // ❌ HARDCODÉ !
  }

  extractThreatLevel_PROBLEME(content) {
    // ❌ Retourne toujours 6 !
    return 6; // ❌ HARDCODÉ !
  }

  extractOpportunityGaps_PROBLEME(content) {
    // ❌ Toujours les mêmes opportunités !
    return ['Marchés émergents', 'Segments premium', 'Solutions B2B']; // ❌ HARDCODÉ !
  }

  extractPositionQuadrant_PROBLEME(content) {
    // ❌ Retourne toujours 'challenger' !
    return 'challenger'; // ❌ HARDCODÉ !
  }

  extractCostAdvantage_PROBLEME(content) {
    // ❌ Retourne toujours -5 !
    return -5; // ❌ HARDCODÉ !
  }

  // 4. extractMilestones - DONNÉES MOCKÉES
  extractMilestones_PROBLEME(content) {
    return [
      {
        date: new Date('2020-01-01'), // ❌ HARDCODÉ !
        title: 'Expansion digitale', // ❌ HARDCODÉ !
        description: 'Accélération transformation numérique', // ❌ HARDCODÉ !
        impact: 'high', // ❌ HARDCODÉ !
        category: 'business' // ❌ HARDCODÉ !
      }
    ];
  }

  // 5. extractMarkets, extractAdvantages, extractRisks - DONNÉES MOCKÉES
  extractMarkets_PROBLEME(content) {
    return ['B2B', 'B2C', 'Enterprise']; // ❌ HARDCODÉ !
  }

  extractAdvantages_PROBLEME(content) {
    return ['Innovation technologique', 'Position de marché', 'Excellence opérationnelle']; // ❌ HARDCODÉ !
  }

  extractRisks_PROBLEME(content) {
    return ['Concurrence accrue', 'Transformation digitale', 'Réglementations']; // ❌ HARDCODÉ !
  }

  // 6. extractPriorities - DONNÉES MOCKÉES
  extractPriorities_PROBLEME(content) {
    return [
      {
        area: 'Innovation', // ❌ HARDCODÉ !
        priority: 'high', // ❌ HARDCODÉ !
        timeline: 'short-term', // ❌ HARDCODÉ !
        investmentLevel: 85, // ❌ HARDCODÉ !
        expectedROI: 120 // ❌ HARDCODÉ !
      }
    ];
  }

  // 7. extractBusinessModel - DONNÉES MOCKÉES
  extractBusinessModel_PROBLEME(content) {
    return {
      revenueStreams: [
        { name: 'Ventes produits', percentage: 70, trend: 'stable', predictability: 'high' } // ❌ HARDCODÉ !
      ],
      costStructure: ['R&D', 'Marketing', 'Operations'], // ❌ HARDCODÉ !
      valueProposition: 'Innovation et qualité premium', // ❌ HARDCODÉ !
      customerSegments: ['Enterprise', 'SMB'], // ❌ HARDCODÉ !
      channels: ['Direct', 'Partners'], // ❌ HARDCODÉ !
      keyPartners: ['Tech providers', 'Distributors'] // ❌ HARDCODÉ !
    };
  }

  // ==================== PROBLÈMES PATTERNS REGEX ====================
  
  testPatternProblems() {
    const testContent = `
    Analyse concurrentielle de Tesla:
    
    Les principaux concurrents de Tesla incluent:
    - BMW avec 12.3% de part de marché, fort sur le premium
    - Mercedes-Benz avec 15.7% de part de marché, leader en luxe  
    - Ford avec 8.9% de part de marché, pionnier électrique
    `;

    // Test extraction concurrents avec patterns actuels
    const patterns = [
      /concurrent[s]?\s*:?\s*([A-Z][a-zA-ZÀ-ÿ\s&\.'-]+)/gi,
      /rival[s]?\s*:?\s*([A-Z][a-zA-ZÀ-ÿ\s&\.'-]+)/gi,
      /-\s+([A-Z][a-zA-ZÀ-ÿ\s&\.'-]+)\s+.*?(\d+(?:\.\d+)?)%/gi
    ];

    console.log('🧪 TEST PATTERNS REGEX:');
    console.log('=======================');
    console.log('Contenu test:', testContent.substring(0, 150) + '...\n');

    const competitors = [];
    patterns.forEach((pattern, i) => {
      console.log(`Pattern ${i+1}: ${pattern.toString()}`);
      let match;
      const matches = [];
      while ((match = pattern.exec(testContent)) !== null) {
        matches.push(match[1].trim());
      }
      console.log(`Résultats: ${matches.length > 0 ? matches.join(', ') : 'Aucun'}\n`);
      
      matches.forEach(m => {
        if (m.length > 2 && m.length < 50) {
          competitors.push(m);
        }
      });
    });

    return competitors;
  }
}

function runDiagnostic() {
  const service = new DiagnosticService();
  
  console.log('❌ PROBLÈME 1: RECOMMANDATIONS HARDCODÉES');
  console.log('==========================================');
  const reco = service.parseRealRecommendations_PROBLEME('any content');
  console.log('Retourne toujours la même recommandation:');
  console.log(`- Titre: "${reco[0].title}"`);
  console.log(`- Budget: ${reco[0].budget.min}-${reco[0].budget.max} EUR`);
  console.log(`- Département: ${reco[0].ownerDepartment}\n`);

  console.log('❌ PROBLÈME 2: ALERTES HARDCODÉES');
  console.log('==================================');
  const alerts = service.parseRealAlerts_PROBLEME('any content');
  console.log('Retourne toujours les mêmes alertes:');
  console.log(`- Warning: ${alerts.warning[0].metric} = ${alerts.warning[0].currentValue}%`);
  console.log(`- Opportunité: ${alerts.opportunities[0].metric} = ${alerts.opportunities[0].currentValue}%\n`);

  console.log('❌ PROBLÈME 3: MÉTRIQUES CONCURRENTIELLES HARDCODÉES');
  console.log('====================================================');
  console.log(`- Part de marché fallback: ${service.extractMarketShare_PROBLEME('no content')}%`);
  console.log(`- Tendance marché: ${service.extractMarketTrend_PROBLEME('any content')}`);
  console.log(`- Index avantage concurrentiel: ${service.extractCompetitiveAdvantageIndex_PROBLEME('any content')}`);
  console.log(`- Niveau de menace: ${service.extractThreatLevel_PROBLEME('any content')}/10`);
  console.log(`- Position quadrant: ${service.extractPositionQuadrant_PROBLEME('any content')}`);
  console.log(`- Avantage coût: ${service.extractCostAdvantage_PROBLEME('any content')}\n`);

  console.log('❌ PROBLÈME 4: DONNÉES HISTORIQUES FICTIVES');
  console.log('============================================');
  const historical = service.extractHistoricalShares_PROBLEME('any content');
  console.log('Données historiques toujours identiques:');
  historical.forEach(h => {
    console.log(`- ${h.period}: ${h.share}% (volume: ${h.volume}, valeur: ${h.value})`);
  });
  console.log();

  console.log('❌ PROBLÈME 5: FALLBACKS GÉNÉRIQUES');
  console.log('====================================');
  console.log(`- Marchés: ${service.extractMarkets_PROBLEME('any').join(', ')}`);
  console.log(`- Avantages: ${service.extractAdvantages_PROBLEME('any').join(', ')}`);
  console.log(`- Risques: ${service.extractRisks_PROBLEME('any').join(', ')}`);
  console.log(`- Opportunités gaps: ${service.extractOpportunityGaps_PROBLEME('any').join(', ')}\n`);

  console.log('🧪 PROBLÈME 6: TEST PATTERNS REGEX');
  console.log('===================================');
  const competitors = service.testPatternProblems();
  console.log(`Concurrents extraits: ${competitors.length > 0 ? competitors.join(', ') : 'Aucun concurrent extrait !'}\n`);

  console.log('📊 RÉSUMÉ DES PROBLÈMES IDENTIFIÉS:');
  console.log('====================================');
  console.log('1. ❌ parseRealRecommendations() → 100% hardcodé');
  console.log('2. ❌ parseRealAlerts() → 100% hardcodé');
  console.log('3. ❌ extractMarketShare() → Fallback 22.5% hardcodé');
  console.log('4. ❌ extractMarketTrend() → Toujours "stable"');
  console.log('5. ❌ extractHistoricalShares() → Données Q1-Q3 2024 fictives');
  console.log('6. ❌ extractCompetitiveAdvantageIndex() → Toujours 74');
  console.log('7. ❌ extractThreatLevel() → Toujours 6');
  console.log('8. ❌ extractOpportunityGaps() → Toujours ["Marchés émergents", ...]');
  console.log('9. ❌ extractPositionQuadrant() → Toujours "challenger"');
  console.log('10. ❌ extractCostAdvantage() → Toujours -5');
  console.log('11. ❌ extractMilestones() → Données 2020 hardcodées');
  console.log('12. ❌ extractMarkets/Advantages/Risks/Priorities → Listes hardcodées');
  console.log('13. ❌ extractBusinessModel() → Structure complètement mockée');
  console.log('14. ❌ Patterns regex → Extractions défaillantes\n');

  console.log('🚨 CONCLUSION: LA MAJORITÉ DES DONNÉES SONT ENCORE MOCKÉES !');
  console.log('=============================================================');
  console.log('Le problème ne se limite pas aux concurrents, mais touche:');
  console.log('- Toutes les recommandations');
  console.log('- Toutes les alertes'); 
  console.log('- Toutes les métriques concurrentielles');
  console.log('- Toutes les données historiques');
  console.log('- Tous les modèles business');
  console.log('- La plupart des extractions de contenu\n');

  console.log('🎯 ACTIONS REQUISES:');
  console.log('=====================');
  console.log('1. Réécrire parseRealRecommendations() pour extraire du contenu');
  console.log('2. Réécrire parseRealAlerts() pour analyser le contenu');
  console.log('3. Implémenter vraies extractions pour toutes les métriques');
  console.log('4. Corriger les patterns regex défaillants');
  console.log('5. Supprimer tous les fallbacks hardcodés');
  console.log('6. Tester avec du vrai contenu Perplexity');
}

runDiagnostic(); 