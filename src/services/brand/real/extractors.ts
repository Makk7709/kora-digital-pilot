// Extracteurs purs pour le contenu Perplexity. Extraits depuis
// `RealBrandIntelligenceService.ts` (>2300 lignes) afin que le module
// principal puisse rester sous 800 lignes. Toutes les fonctions sont sans
// effet de bord et peuvent être consommées par d'autres parsers.

interface BrandKeyMilestone {
  date: Date;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'business' | 'product' | 'leadership';
}

interface StrategicPriority {
  area: string;
  priority: 'high' | 'medium' | 'low';
  timeline: 'short-term' | 'medium-term' | 'long-term';
  investmentLevel: number;
  expectedROI: number;
}

interface BusinessModel {
  revenueStreams: Array<{
    name: string;
    percentage: number;
    trend: 'growing' | 'stable' | 'declining';
    predictability: 'high' | 'medium' | 'low';
  }>;
  costStructure: string[];
  valueProposition: string;
  customerSegments: string[];
  channels: string[];
  keyPartners: string[];
}

type GenericRecord = Record<string, unknown>;

export function extractSectorKeywords(content: string): string[] {
  const keywords: string[] = [];

  const sectorPatterns = [
    /secteur\s+([a-zA-ZÀ-ÿ\s]+)/gi,
    /domaine\s+([a-zA-ZÀ-ÿ\s]+)/gi,
    /industrie\s+([a-zA-ZÀ-ÿ\s]+)/gi,
    /marché\s+([a-zA-ZÀ-ÿ\s]+)/gi,
    /spécialisé\s+dans\s+([a-zA-ZÀ-ÿ\s]+)/gi,
    /actif\s+dans\s+([a-zA-ZÀ-ÿ\s]+)/gi,
  ];

  sectorPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const keyword = match[1].trim();
      if (keyword.length > 3 && keyword.length < 30) {
        keywords.push(keyword);
      }
    }
  });

  const commonSectors = [
    'automobile',
    'technologie',
    'pharmaceutique',
    'finance',
    'retail',
    'énergie',
    'télécommunications',
    'aéronautique',
    'construction',
    'alimentaire',
    'logistique',
    'santé',
    'éducation',
    'immobilier',
    'luxe',
  ];

  commonSectors.forEach((sector) => {
    if (content.toLowerCase().includes(sector)) {
      keywords.push(sector);
    }
  });

  return [...new Set(keywords)].slice(0, 3);
}

export function extractSection(content: string, keyword: string, fallback: string): string {
  const lines = content.split('\n');
  const startIndex = lines.findIndex(
    (line) =>
      line.toLowerCase().includes(keyword.toLowerCase()) ||
      line.toLowerCase().includes(fallback.toLowerCase()),
  );

  if (startIndex === -1)
    return `Analyse ${keyword} de la marque basée sur les données disponibles.`;

  const section = lines
    .slice(startIndex, startIndex + 5)
    .join(' ')
    .trim();
  return section || fallback;
}

export function extractMilestones(_content: string): BrandKeyMilestone[] {
  return [
    {
      date: new Date('2020-01-01'),
      title: 'Expansion digitale',
      description: 'Accélération transformation numérique',
      impact: 'high',
      category: 'business',
    },
  ];
}

export function extractMarketCap(content: string): number | undefined {
  const match = content.match(
    /capitalisation.*?(\d+(?:\.\d+)?)\s*(?:milliards?|billions?|B\$|\$B)/i,
  );
  return match ? parseFloat(match[1]) * 1_000_000_000 : undefined;
}

export function extractEmployeeCount(content: string): number | undefined {
  const match = content.match(/(\d{1,3}(?:\s?\d{3})*)\s*(?:employés?|salariés?|workers?)/i);
  return match ? parseInt(match[1].replace(/\s/g, '')) : undefined;
}

export function extractMarkets(_content: string): string[] {
  return ['B2B', 'B2C', 'Enterprise'];
}

export function extractAdvantages(_content: string): string[] {
  return ['Innovation technologique', 'Position de marché', 'Excellence opérationnelle'];
}

export function extractRisks(_content: string): string[] {
  return ['Concurrence accrue', 'Transformation digitale', 'Réglementations'];
}

export function extractPriorities(_content: string): StrategicPriority[] {
  return [
    {
      area: 'Innovation',
      priority: 'high',
      timeline: 'short-term',
      investmentLevel: 85,
      expectedROI: 120,
    },
  ];
}

export function extractBusinessModel(_content: string): BusinessModel {
  return {
    revenueStreams: [
      { name: 'Ventes produits', percentage: 70, trend: 'stable', predictability: 'high' },
    ],
    costStructure: ['R&D', 'Marketing', 'Operations'],
    valueProposition: 'Innovation et qualité premium',
    customerSegments: ['Enterprise', 'SMB'],
    channels: ['Direct', 'Partners'],
    keyPartners: ['Tech providers', 'Distributors'],
  };
}

export function extractEmergingTrends(_content: string): GenericRecord[] {
  return [
    {
      name: 'Transformation digitale',
      description: 'Accélération digitalisation',
      maturityLevel: 'growing',
      timeToImpact: 12,
      potentialImpact: 85,
      relevanceScore: 90,
      keyDrivers: ['Technology', 'Customer demands'],
    },
  ];
}

export function extractWeakSignals(_content: string): GenericRecord[] {
  return [
    {
      description: 'Émergence nouveaux acteurs',
      confidenceLevel: 0.7,
      potentialImpact: 60,
      timeHorizon: 18,
      sources: ['Industry reports'],
      relatedTrends: ['Digital transformation'],
      monitoringRecommendations: ['Veille concurrentielle'],
    },
  ];
}

export function extractDisruptiveThreats(_content: string): GenericRecord[] {
  return [
    {
      name: 'Disruption technologique',
      description: 'Nouvelles technologies disruptives',
      probabilityScore: 65,
      impactScore: 80,
      timeToMaterialization: 24,
      preparednessLevel: 'medium',
      mitigationStrategies: ['Innovation continue', 'Partenariats stratégiques'],
    },
  ];
}

export function extractOpportunities(_content: string): GenericRecord[] {
  return [
    {
      name: 'Expansion internationale',
      description: 'Nouvelles opportunités marchés',
      marketSize: 500,
      attractivenessScore: 85,
      competitionLevel: 'medium',
      barriers: ['Regulatory'],
      successFactors: ['Local partnerships'],
      timeline: '12-18 mois',
    },
  ];
}

export function extractSectors(_content: string): string[] {
  return ['Technology', 'Finance', 'Healthcare'];
}

export function extractTechnologies(_content: string): string[] {
  return ['AI', 'Blockchain', 'IoT'];
}

export function extractScore(content: string, keyword: string, fallback: number): number {
  const match = content.match(new RegExp(`${keyword}.*?(\\d+)`, 'i'));
  return match ? parseInt(match[1]) : fallback;
}

export function extractMarketShare(content: string): number {
  const match = content.match(/part.*?marché.*?(\d+(?:\.\d+)?)/i);
  return match ? parseFloat(match[1]) : 15;
}

export function extractMarketTrend(content: string): string {
  if (content.toLowerCase().includes('croissance') || content.toLowerCase().includes('expansion'))
    return 'growth';
  if (content.toLowerCase().includes('déclin') || content.toLowerCase().includes('baisse'))
    return 'decline';
  if (content.toLowerCase().includes('volatile') || content.toLowerCase().includes('instable'))
    return 'volatile';
  if (content.toLowerCase().includes('stable') || content.toLowerCase().includes('constant'))
    return 'stable';

  const growthMatch = content.match(/croissance.*?(\d+(?:\.\d+)?)%/i);
  if (growthMatch) {
    const rate = parseFloat(growthMatch[1]);
    if (rate > 5) return 'growth';
    if (rate < -2) return 'decline';
  }

  return 'stable';
}

export function extractProjectedShare(content: string): number {
  const projectedMatch = content.match(
    /prévision.*?(\d+(?:\.\d+)?)%|projection.*?(\d+(?:\.\d+)?)%/i,
  );
  if (projectedMatch) {
    return parseFloat(projectedMatch[1] || projectedMatch[2]);
  }

  const currentShare = extractMarketShare(content);
  const trend = extractMarketTrend(content);

  switch (trend) {
    case 'growth':
      return Math.min(100, currentShare + 2);
    case 'decline':
      return Math.max(0, currentShare - 1.5);
    case 'volatile':
      return currentShare + (Math.random() - 0.5) * 2;
    default:
      return currentShare + 0.5;
  }
}

export function extractHistoricalShares(content: string): GenericRecord[] {
  const historical: GenericRecord[] = [];

  const historicalPatterns = [
    /(\w+\s+\d{4}).*?(\d+(?:\.\d+)?)%/g,
    /(Q[1-4]\s+\d{4}).*?(\d+(?:\.\d+)?)%/g,
    /(\d{4}).*?(\d+(?:\.\d+)?)%/g,
  ];

  historicalPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const period = match[1];
      const share = parseFloat(match[2]);

      if (share > 0 && share <= 100) {
        historical.push({
          period,
          share,
          volume: Math.round(share * 20_000_000),
          value: Math.round(share * 15_000_000_000),
        });
      }
    }
  });

  if (historical.length === 0) {
    const currentShare = extractMarketShare(content);
    const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024'];

    quarters.forEach((quarter) => {
      const variation = (Math.random() - 0.5) * 2;
      const share = Math.max(0, currentShare + variation);
      historical.push({
        period: quarter,
        share: Math.round(share * 10) / 10,
        volume: Math.round(share * 20_000_000),
        value: Math.round(share * 15_000_000_000),
      });
    });
  }

  return historical.slice(0, 4);
}

export function extractBenchmarkPosition(content: string): number {
  const positionMatch = content.match(/position.*?(\d+)|rang.*?(\d+)|place.*?(\d+)/i);
  if (positionMatch) {
    return parseInt(positionMatch[1] || positionMatch[2] || positionMatch[3]);
  }

  const marketShare = extractMarketShare(content);
  if (marketShare > 30) return 1;
  if (marketShare > 20) return 2;
  if (marketShare > 15) return 3;
  if (marketShare > 10) return 4;
  return 5;
}

export function extractCompetitiveAdvantageIndex(content: string): number {
  const indicators = {
    innovation: content.toLowerCase().includes('innovation') ? 20 : 0,
    quality: content.toLowerCase().includes('qualité') ? 15 : 0,
    price: content.toLowerCase().includes('prix compétitif') ? 15 : 0,
    brand: content.toLowerCase().includes('marque forte') ? 20 : 0,
    distribution: content.toLowerCase().includes('distribution') ? 10 : 0,
    technology: content.toLowerCase().includes('technologie avancée') ? 20 : 0,
  };

  const totalScore = Object.values(indicators).reduce((sum, score) => sum + score, 0);
  return Math.min(100, totalScore + 40);
}

export function extractThreatLevel(content: string): number {
  let threatLevel = 5;

  if (
    content.toLowerCase().includes('menace élevée') ||
    content.toLowerCase().includes('risque majeur')
  ) {
    threatLevel += 3;
  }
  if (content.toLowerCase().includes('concurrence intense')) threatLevel += 2;
  if (content.toLowerCase().includes('nouveaux entrants')) threatLevel += 2;
  if (content.toLowerCase().includes('disruption')) threatLevel += 3;
  if (content.toLowerCase().includes('crise')) threatLevel += 4;

  if (
    content.toLowerCase().includes('leader') ||
    content.toLowerCase().includes('position dominante')
  ) {
    threatLevel -= 2;
  }

  return Math.min(10, Math.max(1, threatLevel));
}

export function extractOpportunityGaps(content: string): string[] {
  const opportunities: string[] = [];

  if (
    content.toLowerCase().includes('marché émergent') ||
    content.toLowerCase().includes('nouveau marché')
  ) {
    opportunities.push('Marchés émergents');
  }
  if (
    content.toLowerCase().includes('segment premium') ||
    content.toLowerCase().includes('haut de gamme')
  ) {
    opportunities.push('Segments premium');
  }
  if (content.toLowerCase().includes('b2b') || content.toLowerCase().includes('entreprise')) {
    opportunities.push('Solutions B2B');
  }
  if (content.toLowerCase().includes('digital') || content.toLowerCase().includes('numérique')) {
    opportunities.push('Transformation digitale');
  }
  if (content.toLowerCase().includes('international') || content.toLowerCase().includes('export')) {
    opportunities.push('Expansion internationale');
  }
  if (
    content.toLowerCase().includes('innovation') ||
    content.toLowerCase().includes('nouveau produit')
  ) {
    opportunities.push('Innovation produit');
  }
  if (content.toLowerCase().includes('partenariat') || content.toLowerCase().includes('alliance')) {
    opportunities.push('Partenariats stratégiques');
  }

  return opportunities.length > 0
    ? opportunities
    : ['Nouveaux segments', 'Innovation', 'Efficacité'];
}

export function extractPositionQuadrant(content: string): string {
  if (content.toLowerCase().includes('leader') || content.toLowerCase().includes('dominant'))
    return 'leader';
  if (
    content.toLowerCase().includes('challenger') ||
    content.toLowerCase().includes('concurrent principal')
  )
    return 'challenger';
  if (content.toLowerCase().includes('suiveur') || content.toLowerCase().includes('follower'))
    return 'follower';
  if (content.toLowerCase().includes('niche') || content.toLowerCase().includes('spécialisé'))
    return 'niche-player';

  const marketShare = extractMarketShare(content);
  if (marketShare > 25) return 'leader';
  if (marketShare > 15) return 'challenger';
  if (marketShare > 5) return 'follower';
  return 'niche-player';
}

export function extractCostAdvantage(content: string): number {
  if (
    content.toLowerCase().includes('coût avantageux') ||
    content.toLowerCase().includes('prix compétitif')
  ) {
    return 5;
  }
  if (
    content.toLowerCase().includes('coût élevé') ||
    content.toLowerCase().includes('prix premium')
  ) {
    return -5;
  }
  if (content.toLowerCase().includes('efficacité coût')) return 3;
  if (
    content.toLowerCase().includes('surcoût') ||
    content.toLowerCase().includes('coût supérieur')
  ) {
    return -3;
  }

  return 0;
}

export function extractFoundingYear(content: string): number {
  const yearMatch = content.match(/fondé[e]?\s+en\s+(\d{4})|créé[e]?\s+en\s+(\d{4})|(\d{4})/i);
  return yearMatch
    ? parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3])
    : new Date().getFullYear() - 20;
}

export function extractFounders(content: string): string[] {
  const founderMatch = content.match(/fondateur[s]?[:\s]+([^.]+)/i);
  return founderMatch ? founderMatch[1].split(',').map((f) => f.trim()) : ['Non spécifié'];
}

export function extractEvolution(content: string): string[] {
  const evolutionMatch = content.match(/évolution[:\s]+([^.]+)/i);
  return evolutionMatch
    ? evolutionMatch[1].split(',').map((e) => e.trim())
    : ['Croissance continue'];
}

export function extractGlobalRank(content: string): number | undefined {
  const rankMatch = content.match(/rang[:\s]+(\d+)|position[:\s]+(\d+)/i);
  return rankMatch ? parseInt(rankMatch[1] || rankMatch[2]) : undefined;
}

export function extractRevenue(content: string): number | undefined {
  const revenueMatch = content.match(
    /chiffre d'affaires[:\s]+(\d+(?:\.\d+)?)\s*(?:milliards?|millions?)/i,
  );
  return revenueMatch ? parseFloat(revenueMatch[1]) : undefined;
}

export function extractProfitability(content: string): string {
  const profitMatch = content.match(/rentabilité[:\s]+([^.]+)/i);
  return profitMatch ? profitMatch[1].trim() : 'Non spécifié';
}

export function extractValuation(content: string): number | undefined {
  const valuationMatch = content.match(
    /valorisation[:\s]+(\d+(?:\.\d+)?)\s*(?:milliards?|millions?)/i,
  );
  return valuationMatch ? parseFloat(valuationMatch[1]) : undefined;
}

export function extractGrowthRate(content: string): number {
  const percentMatch = content.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]);
  }
  return 5.5;
}

export function determineSectorMaturity(
  content: string,
): 'emerging' | 'growth' | 'mature' | 'declining' {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('émergent') || lowerContent.includes('nouveau')) return 'emerging';
  if (lowerContent.includes('croissance') || lowerContent.includes('expansion')) return 'growth';
  if (lowerContent.includes('déclin') || lowerContent.includes('baisse')) return 'declining';
  return 'mature';
}

export function extractCompetitors(content: string): GenericRecord[] {
  const competitors: GenericRecord[] = [];
  const lowerContent = content.toLowerCase();

  const commonCompanies = [
    'microsoft',
    'google',
    'amazon',
    'apple',
    'facebook',
    'meta',
    'tesla',
    'netflix',
  ];

  commonCompanies.forEach((company) => {
    if (lowerContent.includes(company)) {
      competitors.push({
        name: company.charAt(0).toUpperCase() + company.slice(1),
        marketShare: Math.random() * 20 + 5,
        threat: Math.random() * 100,
        strengths: [`Leadership en ${company}`, 'Innovation continue'],
      });
    }
  });

  if (competitors.length === 0) {
    competitors.push({
      name: 'Concurrent Principal A',
      marketShare: 15.5,
      threat: 75,
      strengths: ['Position établie', 'Ressources importantes'],
    });
  }

  return competitors;
}

export function extractCurrentTrends(content: string): string[] {
  const trends: string[] = [];

  if (content.toLowerCase().includes('digital')) trends.push('Transformation digitale');
  if (content.toLowerCase().includes('durable')) trends.push('Développement durable');
  if (
    content.toLowerCase().includes('ia') ||
    content.toLowerCase().includes('intelligence artificielle')
  )
    trends.push('Intelligence artificielle');
  if (content.toLowerCase().includes('cloud')) trends.push('Cloud computing');

  return trends.length > 0 ? trends : ['Transformation numérique', 'Innovation continue'];
}

export function extractFutureProjections(_content: string): string[] {
  return [
    "Accélération de l'innovation technologique",
    'Évolution des attentes clients',
    'Consolidation du marché',
    'Émergence de nouveaux acteurs',
  ];
}

export function extractDisruptionPotential(content: string): 'low' | 'medium' | 'high' {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('disruptif') || lowerContent.includes('révolution')) return 'high';
  if (lowerContent.includes('évolution') || lowerContent.includes('transformation'))
    return 'medium';
  return 'low';
}

export function extractKeyTrends(content: string): string[] {
  const trends: string[] = [];

  if (content.toLowerCase().includes('digital')) trends.push('Transformation digitale');
  if (
    content.toLowerCase().includes('ia') ||
    content.toLowerCase().includes('intelligence artificielle')
  )
    trends.push('Intelligence artificielle');
  if (content.toLowerCase().includes('durable') || content.toLowerCase().includes('environnement'))
    trends.push('Durabilité');
  if (content.toLowerCase().includes('cloud')) trends.push('Cloud computing');
  if (content.toLowerCase().includes('blockchain')) trends.push('Blockchain');

  if (trends.length === 0) {
    trends.push('Innovation technologique', 'Évolution du marché', 'Transformation digitale');
  }

  return trends.slice(0, 5);
}

export function extractRegulatoryChanges(content: string): string[] {
  const changes: string[] = [];

  if (content.toLowerCase().includes('rgpd') || content.toLowerCase().includes('gdpr'))
    changes.push('RGPD');
  if (content.toLowerCase().includes('directive européenne')) changes.push('Directive européenne');
  if (content.toLowerCase().includes('loi') && content.toLowerCase().includes('digital'))
    changes.push('Loi sur le numérique');
  if (
    content.toLowerCase().includes('environnement') &&
    content.toLowerCase().includes('réglementation')
  )
    changes.push('Réglementation environnementale');
  if (content.toLowerCase().includes('compliance'))
    changes.push('Nouvelles exigences de conformité');

  if (changes.length === 0) {
    changes.push('Évolution réglementaire sectorielle', 'Nouvelles normes de conformité');
  }

  return changes.slice(0, 5);
}

export function extractTechnologicalDisruptions(content: string): string[] {
  const disruptions: string[] = [];
  const lines = content.split('\n');

  const disruptionKeywords = [
    'blockchain',
    'intelligence artificielle',
    'machine learning',
    'iot',
    'réalité virtuelle',
    'réalité augmentée',
    'quantum',
    'nanotechnologie',
    'biotechnologie',
    'robotique',
    'automation',
    'cloud computing',
    '5g',
    '6g',
    'edge computing',
    'cybersécurité',
  ];

  for (const line of lines) {
    for (const keyword of disruptionKeywords) {
      if (line.toLowerCase().includes(keyword.toLowerCase()) && line.length > 20) {
        const disruption = line.trim();
        if (disruption.length > 10 && disruption.length < 150) {
          disruptions.push(disruption);
          break;
        }
      }
    }
  }

  return [...new Set(disruptions)].slice(0, 8);
}

export function parseDate(dateStr: string): Date {
  const frenchMonths = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];
  const englishMonths = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  let normalizedDate = dateStr.toLowerCase();
  frenchMonths.forEach((month, index) => {
    normalizedDate = normalizedDate.replace(month, (index + 1).toString().padStart(2, '0'));
  });
  englishMonths.forEach((month, index) => {
    normalizedDate = normalizedDate.replace(month, (index + 1).toString().padStart(2, '0'));
  });

  const parsed = new Date(normalizedDate);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function classifyActionType(
  text: string,
): 'product' | 'partnership' | 'acquisition' | 'strategy' | 'marketing' | 'crisis' | 'regulation' {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('produit') || lowerText.includes('lancement')) return 'product';
  if (lowerText.includes('partenariat') || lowerText.includes('alliance')) return 'partnership';
  if (lowerText.includes('acquisition') || lowerText.includes('rachat')) return 'acquisition';
  if (lowerText.includes('crise') || lowerText.includes('problème')) return 'crisis';
  if (lowerText.includes('réglementation') || lowerText.includes('légal')) return 'regulation';
  if (lowerText.includes('marketing') || lowerText.includes('communication')) return 'marketing';
  return 'strategy';
}

export function estimateImpact(text: string): number {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('majeur') || lowerText.includes('révolutionnaire')) return 90;
  if (lowerText.includes('important') || lowerText.includes('significatif')) return 75;
  if (lowerText.includes('modéré') || lowerText.includes('moyen')) return 60;
  if (lowerText.includes('faible') || lowerText.includes('limité')) return 40;
  return 65;
}

export function identifyStakeholders(text: string): string[] {
  const stakeholders: string[] = [];
  const lowerText = text.toLowerCase();

  if (lowerText.includes('client') || lowerText.includes('consommateur'))
    stakeholders.push('Clients');
  if (lowerText.includes('employé') || lowerText.includes('personnel'))
    stakeholders.push('Employés');
  if (lowerText.includes('investisseur') || lowerText.includes('actionnaire'))
    stakeholders.push('Investisseurs');
  if (lowerText.includes('partenaire') || lowerText.includes('fournisseur'))
    stakeholders.push('Partenaires');
  if (lowerText.includes('régulateur') || lowerText.includes('gouvernement'))
    stakeholders.push('Régulateurs');

  return stakeholders.length > 0 ? stakeholders : ['Stakeholders généraux'];
}

export function determineScope(text: string): 'local' | 'national' | 'regional' | 'global' {
  const lowerText = text.toLowerCase();
  if (
    lowerText.includes('global') ||
    lowerText.includes('mondial') ||
    lowerText.includes('international')
  )
    return 'global';
  if (lowerText.includes('européen') || lowerText.includes('régional')) return 'regional';
  if (lowerText.includes('national') || lowerText.includes('france')) return 'national';
  return 'local';
}

export function extractTopInfluencers(content: string): GenericRecord[] {
  const influencers: GenericRecord[] = [];

  if (content.includes('MKBHD')) {
    influencers.push({ name: 'MKBHD', followers: 15_000_000, engagement: 8.5, relevance: 95 });
  }
  if (content.includes('Unbox Therapy')) {
    influencers.push({
      name: 'Unbox Therapy',
      followers: 18_000_000,
      engagement: 7.2,
      relevance: 90,
    });
  }

  if (influencers.length === 0) {
    influencers.push(
      { name: 'Tech Reviewer A', followers: 12_000_000, engagement: 8.0, relevance: 85 },
      { name: 'Industry Expert B', followers: 8_000_000, engagement: 9.2, relevance: 90 },
    );
  }

  return influencers;
}
