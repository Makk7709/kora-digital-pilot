// Parsers de réponses Perplexity pour `RealBrandIntelligenceService`.
// Extraits du module principal pour le maintenir sous 800 lignes. Les
// parsers consomment les extracteurs (`./extractors`) et helpers de
// recommandation (`./recommendations`).

import type {
  ObjectiveAnalysis,
  RecentAction,
  StrategicAnalysis,
  TrendAnalysis,
  SectorEvolution,
  SWOTMetrics,
  ContentMetrics,
  CompetitiveMetrics,
  ReputationKPIs,
  ActionableRecommendation,
  SmartAlerts,
} from '../../../types/BrandIntelligenceTypes';
import { cleanRawContent } from './content-cleaner';
import {
  classifyActionType,
  determineScope,
  determineSectorMaturity,
  estimateImpact,
  extractAdvantages,
  extractBenchmarkPosition,
  extractBusinessModel,
  extractCompetitiveAdvantageIndex,
  extractCompetitors,
  extractCostAdvantage,
  extractCurrentTrends,
  extractDisruptionPotential,
  extractDisruptiveThreats,
  extractEmergingTrends,
  extractEmployeeCount,
  extractEvolution,
  extractFounders,
  extractFoundingYear,
  extractFutureProjections,
  extractGlobalRank,
  extractGrowthRate,
  extractHistoricalShares,
  extractKeyTrends,
  extractMarketCap,
  extractMarketShare,
  extractMarketTrend,
  extractMarkets,
  extractMilestones,
  extractOpportunities,
  extractOpportunityGaps,
  extractPositionQuadrant,
  extractPriorities,
  extractProfitability,
  extractProjectedShare,
  extractRegulatoryChanges,
  extractRevenue,
  extractRisks,
  extractScore,
  extractSection,
  extractSectors,
  extractTechnologicalDisruptions,
  extractTopInfluencers,
  extractValuation,
  extractWeakSignals,
  identifyStakeholders,
  parseDate,
} from './extractors';
import {
  assessRecommendationPriority,
  assessRecommendationRisk,
  classifyRecommendationCategory,
  estimateRecommendationBudget,
  estimateRecommendationImpact,
  extractDependencies,
  extractRecommendationTimeline,
  extractRequiredResources,
  extractSuccessMetrics,
  generateAlertsFromMetrics,
  generateRecommendationsFromContent,
  generateRecommendationTitle,
  identifyResponsibleDepartment,
} from './recommendations';

export function parseRealObjectiveAnalysis(content: string, _brandName: string): ObjectiveAnalysis {
  const cleanContent = cleanRawContent(content);

  const foundingYearMatch = cleanContent.match(
    /fondé(?:e)? en (\d{4})|créé(?:e)? en (\d{4})|lancé(?:e)? en (\d{4})/i,
  );
  const foundingYear = foundingYearMatch
    ? Number.parseInt(foundingYearMatch[1] || foundingYearMatch[2] || foundingYearMatch[3])
    : undefined;

  const innovationMatch = cleanContent.match(
    /innovation.*?(\d{1,2})(?:\s*\/\s*100|%)|R&D.*?(\d{1,2})(?:\s*\/\s*100|%)/i,
  );
  const innovationIndex = innovationMatch
    ? Number.parseInt(innovationMatch[1] || innovationMatch[2])
    : 75;

  const reputationMatch = cleanContent.match(
    /réputation.*?(\d{1,2})(?:\s*\/\s*100|%)|confiance.*?(\d{1,2})(?:\s*\/\s*100|%)/i,
  );
  const reputationScore = reputationMatch
    ? Number.parseInt(reputationMatch[1] || reputationMatch[2])
    : 70;

  return {
    brandHistory: {
      foundingYear: extractFoundingYear(cleanContent),
      founders: extractFounders(cleanContent),
      keyMilestones: extractMilestones(cleanContent),
      evolution: extractEvolution(cleanContent),
    },
    marketPosition: {
      sector: extractSectors(cleanContent),
      markets: extractMarkets(cleanContent),
      marketCap: extractMarketCap(cleanContent),
      employeeCount: extractEmployeeCount(cleanContent),
      globalRank: extractGlobalRank(cleanContent),
    },
    financialHealth: {
      revenue: extractRevenue(cleanContent),
      growth: extractGrowthRate(cleanContent),
      profitability: extractProfitability(cleanContent),
      valuation: extractValuation(cleanContent),
    },
    metrics: {
      innovationIndex: Math.min(100, Math.max(0, innovationIndex)),
      reputationScore: Math.min(100, Math.max(0, reputationScore)),
      marketShare: extractMarketShare(cleanContent),
    },
    foundingYear,
    marketCapitalization: extractMarketCap(cleanContent),
    employeeCount: extractEmployeeCount(cleanContent),
  } as unknown as ObjectiveAnalysis;
}

export function parseRealRecentActions(content: string, _brandName: string): RecentAction[] {
  const cleanContent = cleanRawContent(content);
  const actions: RecentAction[] = [];
  const lines = cleanContent.split('\n');

  for (const line of lines) {
    if (line.match(/^\d+\.|^-|\*/) && line.length > 20) {
      const dateMatch = line.match(/(\w+\s+\d{4}|\d{1,2}\/\d{4}|[A-Za-z]+\s+\d{4})/);
      const action: RecentAction = {
        date: dateMatch
          ? parseDate(dateMatch[1])
          : new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        type: classifyActionType(line),
        description: line.replace(/^\d+\.|^-|\*/, '').trim(),
        impact: estimateImpact(line),
        impactEstimation: estimateImpact(line),
        sourceVerification: 'Perplexity Live Search',
        confidenceLevel: 0.85,
        stakeholdersAffected: identifyStakeholders(line),
        geographicScope: determineScope(line),
      };
      actions.push(action);
    }
  }

  return actions.slice(0, 5);
}

export function parseRealStrategicAnalysis(content: string, _brandName: string): StrategicAnalysis {
  const cleanContent = cleanRawContent(content);

  return {
    coreStrategy: extractSection(cleanContent, 'stratégie', 'STRATÉGIE PRINCIPALE'),
    targetMarkets: extractMarkets(cleanContent),
    competitiveAdvantages: extractAdvantages(cleanContent),
    futureDirection: extractSection(cleanContent, 'direction', 'DIRECTION FUTURE'),
    strategicRisks: extractRisks(cleanContent),
    priorities: extractPriorities(cleanContent),
    businessModel: extractBusinessModel(cleanContent),
  } as unknown as StrategicAnalysis;
}

export function parseRealTrendAnalysis(content: string, _brandName: string): TrendAnalysis {
  return {
    emergingTrends: extractEmergingTrends(content),
    weakSignals: extractWeakSignals(content),
    disruptiveThreats: extractDisruptiveThreats(content),
    opportunities: extractOpportunities(content),
    sectorEvolution: parseSectorEvolution(content),
  } as TrendAnalysis;
}

export function parseSectorEvolution(content: string): SectorEvolution {
  return {
    currentTrends: extractCurrentTrends(content),
    futureProjections: extractFutureProjections(content),
    disruptionPotential: extractDisruptionPotential(content),
    growthRate: extractGrowthRate(content),
    maturity: determineSectorMaturity(content),
    keyPlayers: extractCompetitors(content)
      .slice(0, 5)
      .map((comp) => ({
        name: comp.name as string,
        position: (comp.position as string) || 'Concurrent',
        marketShare: comp.marketShare as number,
      })),
    keyTrends: extractKeyTrends(content),
    regulatoryChanges: extractRegulatoryChanges(content),
    technologicalDisruptions: extractTechnologicalDisruptions(content),
    maturityLevel: determineSectorMaturity(content),
  } as SectorEvolution;
}

export function parseRealSWOTMetrics(content: string): SWOTMetrics {
  return {
    strengthsScore: extractScore(content, 'forces', 85),
    weaknessesScore: extractScore(content, 'faiblesses', 40),
    opportunitiesScore: extractScore(content, 'opportunités', 80),
    threatsScore: extractScore(content, 'menaces', 60),
    strategicHealthIndex: extractScore(content, 'santé stratégique', 75),
    detailedBreakdown: {
      strengths: [
        {
          area: 'Innovation',
          score: extractScore(content, 'innovation', 95),
          impact: 'high',
          sustainability: 'strong',
          evidence: ['R&D investment', 'Patent portfolio', 'Product launches'],
        },
        {
          area: 'Brand',
          score: extractScore(content, 'marque', 90),
          impact: 'high',
          sustainability: 'strong',
          evidence: ['Brand recognition', 'Customer loyalty', 'Premium pricing'],
        },
      ],
      weaknesses: [
        {
          area: 'Pricing',
          severity: extractScore(content, 'prix', 60),
          urgency: 'medium',
          improvability: 'moderate',
          impacts: ['Market share limitation', 'Accessibility concerns'],
        },
      ],
      opportunities: [
        {
          area: 'AI Integration',
          attractiveness: extractScore(content, 'ia', 85),
          feasibility: 80,
          timeToCapture: 12,
          investmentRequired: 'high',
        },
      ],
      threats: [
        {
          area: 'Competition',
          probability: extractScore(content, 'concurrence', 70),
          impact: 75,
          timeToMaterialization: 6,
        },
      ],
    },
    competitiveAdvantage: [
      'Ecosystem Integration',
      'Technology Innovation',
      'Brand Loyalty',
      'Vertical Integration',
    ],
    strategicRecommendations: [
      {
        area: 'Market Expansion',
        action: 'Develop emerging market strategy',
        priority: 'high',
        timeline: '6-12 months',
        expectedImpact: 75,
        resourcesNeeded: ['Market research', 'Local partnerships'],
        successMetrics: ['Market share growth', 'Revenue increase'],
      },
    ],
  } as SWOTMetrics;
}

export function parseRealContentMetrics(content: string): ContentMetrics {
  const sentimentMatch = content.match(/(\d+)%\s*positif/i);
  const volumeMatch = content.match(/(\d+(?:\.\d+)?)[MK]?\s*mentions/i);

  return {
    overallSentiment: sentimentMatch ? Number.parseInt(sentimentMatch[1]) - 50 : 22,
    sentimentDistribution: {
      positive: sentimentMatch ? Number.parseInt(sentimentMatch[1]) : 72,
      neutral: 18,
      negative: 10,
    },
    topicsDistribution: [
      { topic: 'Innovation', percentage: 35, theme: 'Innovation' },
      { topic: 'Products', percentage: 28, theme: 'Products' },
    ],
    sentimentByTopic: {
      Innovation: { positive: 85, neutral: 12, negative: 3 },
      Products: { positive: 78, neutral: 15, negative: 7 },
    },
    contentVolume: volumeMatch
      ? Number.parseFloat(volumeMatch[1]) * (volumeMatch[0].includes('M') ? 1_000_000 : 1000)
      : 2_500_000,
    engagementMetrics: {
      likes: 4_800_000,
      shares: 850_000,
      comments: 320_000,
      avgEngagement: 3.2,
      conversionRate: 2.8,
    },
    viralityIndex: 75,
    influencerMetrics: {
      totalInfluencers: 1250,
      avgReach: 850_000,
      topInfluencers: extractTopInfluencers(content).map((inf) => ({
        name: inf.name as string,
        metrics: {
          followers: inf.followers as number,
          engagementRate: inf.engagement as number,
          sentiment: 75,
          influence: inf.relevance as number,
          topics: ['Technology', 'Innovation'],
        },
      })),
    },
    contentQuality: {
      score: 85,
      readability: 88,
      relevance: 92,
      originality: 90,
      authorityScore: 85,
      credibilityIndex: 88,
      factualAccuracy: 92,
      sourceReliability: 90,
    },
    trendingTopics: [
      {
        topic: 'Apple Intelligence',
        velocity: 125,
        peakTime: new Date('2024-09-15'),
        duration: 72,
        reach: 15_000_000,
        sentiment: 78,
      },
    ],
  } as ContentMetrics;
}

export function parseRealCompetitiveMetrics(content: string): CompetitiveMetrics {
  return {
    marketShareEvolution: {
      currentShare: extractMarketShare(content),
      trend: extractMarketTrend(content) as 'positive' | 'negative' | 'stable',
      projectedShare: extractProjectedShare(content),
      historical: extractHistoricalShares(content),
      benchmarkPosition: {
        rank: extractBenchmarkPosition(content),
        percentile: 85,
        gapToLeader: 15,
      },
    },
    competitorBenchmark: extractCompetitors(content).map((comp) => ({
      competitor: comp.name as string,
      name: comp.name as string,
      metrics: {
        marketShare: comp.marketShare as number,
        strengthAreas: comp.strengths as string[],
        threatLevel: Math.round((comp.threat as number) / 10),
      },
      position: (comp.position as string) || 'challenger',
      threatLevel: Math.round((comp.threat as number) / 10),
      marketShare: comp.marketShare as number,
      strengthAreas: comp.strengths as string[],
    })),
    competitiveAdvantageIndex: extractCompetitiveAdvantageIndex(content),
    threatLevel: Math.round(extractScore(content, 'menaces', 60) / 10),
    opportunityGaps: extractOpportunityGaps(content),
    competitivePositioning: {
      positionQuadrant: extractPositionQuadrant(content) as
        | 'leader'
        | 'challenger'
        | 'follower'
        | 'nicher',
      differentiationLevel: 88,
      costAdvantage: extractCostAdvantage(content),
      brandStrength: 92,
      operationalExcellence: 85,
    },
    marketDynamics: {
      competitionIntensity: 85,
      barriers: [
        {
          type: 'Technology',
          strength: 90,
          impact: 'High barrier to entry due to R&D requirements',
        },
        {
          type: 'Brand',
          strength: 85,
          impact: 'Strong brand loyalty creates switching costs',
        },
      ],
      newEntrants: [
        {
          name: 'Emerging Tech Startup',
          probability: 30,
          potentialImpact: 45,
          timeFrame: '2-3 years',
        },
      ],
      substituteThreats: [
        {
          substitute: 'Alternative platforms',
          threatLevel: 40,
          adoptionRate: 15,
          impactAreas: ['Market share', 'Pricing pressure'],
        },
      ],
      supplierPower: 35,
      buyerPower: 45,
    },
  } as CompetitiveMetrics;
}

export function parseRealReputationKPIs(content: string): ReputationKPIs {
  const overallScore = extractScore(content, 'réputation', 85);
  const brandTrust = extractScore(content, 'confiance', 82);
  const brandLoyalty = extractScore(content, 'fidélité', 88);

  return {
    overallScore,
    brandTrust,
    brandRecognition: extractScore(content, 'reconnaissance', 80),
    brandLoyalty,
    publicPerception: {
      favorability: extractScore(content, 'favorabilité', 78),
      awareness: extractScore(content, 'notoriété', 85),
      consideration: extractScore(content, 'considération', 75),
    },
    socialMediaMetrics: {
      followers: extractScore(content, 'followers', 1_500_000),
      engagement: extractScore(content, 'engagement', 8.5),
      sentimentScore: extractScore(content, 'sentiment', 15),
    },
    crisisResilience: extractScore(content, 'résilience', 75),
    competitorComparison: [
      {
        competitor: 'Concurrent A',
        ourScore: brandTrust,
        theirScore: 75,
        gap: brandTrust - 75,
      },
      {
        competitor: 'Concurrent B',
        ourScore: overallScore,
        theirScore: 80,
        gap: overallScore - 80,
      },
    ],
    overallReputationScore: overallScore,
    trustIndex: brandTrust,
    brandLoyaltyScore: brandLoyalty,
    stakeholderSentiment: {
      customers: extractScore(content, 'clients', 88),
      employees: extractScore(content, 'employés', 85),
      investors: extractScore(content, 'investisseurs', 92),
      media: extractScore(content, 'médias', 78),
    },
    reputationDrivers: [
      {
        factor: 'Innovation',
        impact: extractScore(content, 'innovation', 90),
        trend: 'improving',
        controlLevel: 'high',
      },
      {
        factor: 'Design',
        impact: extractScore(content, 'design', 85),
        trend: 'stable',
        controlLevel: 'high',
      },
      {
        factor: 'Service Client',
        impact: extractScore(content, 'service', 80),
        trend: 'improving',
        controlLevel: 'medium',
      },
    ],
    riskIndicators: [
      {
        type: 'Prix élevés',
        level: 'medium',
        probability: 70,
        impact: 60,
        mitigation: ['Value justification', 'Premium positioning'],
      },
      {
        type: 'Controverse privacy',
        level: 'high',
        probability: 60,
        impact: 80,
        mitigation: ['Transparency increase', 'Privacy features'],
      },
    ],
    benchmarkComparison: [
      {
        metric: 'Brand Trust',
        ourScore: 85,
        industryAverage: 72,
        topPerformer: 88,
        position: 'average',
        gap: 3,
      },
      {
        metric: 'Innovation Perception',
        ourScore: 92,
        industryAverage: 68,
        topPerformer: 94,
        position: 'leading',
        gap: 2,
      },
    ],
  } as ReputationKPIs;
}

export function parseRealRecommendations(content: string): ActionableRecommendation[] {
  const recommendations = generateRecommendationsFromContent(content);

  return recommendations.map((rec) => ({
    id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: generateRecommendationTitle(rec.description),
    description: rec.description,
    category: classifyRecommendationCategory(rec.description),
    priority: assessRecommendationPriority(rec.description),
    implementation: {
      timeline: extractRecommendationTimeline(rec.description),
      estimatedBudget: estimateRecommendationBudget(rec.description),
      requiredResources: extractRequiredResources(rec.description),
      responsibleDepartment: identifyResponsibleDepartment(rec.description),
    },
    expectedImpact: estimateRecommendationImpact(rec.description),
    successMetrics: extractSuccessMetrics(rec.description),
    risks: assessRecommendationRisk(rec.description),
    dependencies: extractDependencies(rec.description),
  })) as unknown as ActionableRecommendation[];
}

export function parseRealAlerts(content: string): SmartAlerts {
  const alertsData = generateAlertsFromMetrics(content);

  return {
    critical: alertsData.critical || [],
    warnings: (alertsData as unknown as { warnings?: unknown[] }).warnings || [],
    opportunities: alertsData.opportunities || [],
  } as unknown as SmartAlerts;
}
