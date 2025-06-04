/**
 * 🏗️ BRAND INTELLIGENCE TYPES - DÉFINITIONS COMPLÈTES
 * Types TypeScript pour l'écosystème Brand Intelligence
 * TDD Compatible - Zéro mock, données réelles uniquement
 */

// ===== TYPES DE BASE =====
export interface DataFreshness {
  lastUpdated: Date;
  dataAge: number; // en heures
  reliability: 'high' | 'medium' | 'low';
  sources: number;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  lastUpdateTime?: Date; // Alias pour lastUpdated
  dataQualityScore?: number; // 0-100
  isDataFresh?: boolean;
  averageDataAge?: number;
  oldestDataAge?: number;
}

export interface SourceVerification {
  source: string;
  reliability: number; // 0-100
  lastUpdated: Date;
  type: 'primary' | 'secondary' | 'tertiary';
  credibility: 'high' | 'medium' | 'low';
}

// ===== ANALYSES PRINCIPALES =====
export interface ObjectiveAnalysis {
  brandHistory: {
    foundingYear: number;
    founders: string[];
    keyMilestones: Array<{
      year: number;
      event: string;
      impact: 'major' | 'moderate' | 'minor';
    }>;
    evolution: string[];
  };
  
  marketPosition: {
    sector: string[];
    markets: string[];
    marketCap?: number;
    employeeCount?: number;
    globalRank?: number;
  };
  
  financialHealth: {
    revenue?: number;
    growth?: number;
    profitability?: string;
    valuation?: number;
  };
  
  metrics: {
    innovationIndex: number; // 0-100
    reputationScore: number; // 0-100
    marketShare?: number;
  };
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  foundingYear?: number;
  marketCapitalization?: number;
  employeeCount?: number;
}

export interface RecentAction {
  date: Date;
  type: 'product' | 'partnership' | 'acquisition' | 'strategy' | 'marketing' | 'crisis' | 'regulation';
  title?: string;
  description: string;
  impact: number; // 1-10
  stakeholders?: string[];
  scope?: 'local' | 'national' | 'regional' | 'global';
  source?: string;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  impactEstimation?: number;
  confidenceLevel?: number;
  sourceVerification?: string;
  stakeholdersAffected?: string[];
  geographicScope?: 'local' | 'national' | 'regional' | 'global';
}

export interface StrategicAnalysis {
  businessModel: {
    type: string;
    revenueStreams: string[];
    keyPartners: string[];
    valueProposition: string;
    costStructure?: string; // Ajout pour cohérence
  };
  
  competitiveAdvantages: string[];
  strategicRisks: string[];
  priorities: Array<{
    priority: string;
    timeline: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
  }>;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  coreStrategy?: string;
  targetMarkets?: string[];
  competitiveAdvantage?: string[]; // Alias pour competitiveAdvantages
  risksAndChallenges?: string[];
  futureDirection?: string;
  strategicPriorities?: any[];
}

export interface TrendAnalysis {
  sectorEvolution: SectorEvolution;
  emergingTrends: Array<{
    trend: string;
    relevance: number; // 0-100
    timeline: string;
    impact: 'disruptive' | 'evolutionary' | 'minor';
  }>;
  
  weakSignals: Array<{
    signal: string;
    strength: number; // 0-100
    implications: string[];
  }>;
  
  disruptiveThreats: Array<{
    threat: string;
    probability: number; // 0-100
    timeframe: string;
    mitigation: string[];
  }>;
  
  opportunities: Array<{
    opportunity: string;
    potential: number; // 0-100
    requirements: string[];
    risks: string[];
  }>;
}

export interface SectorEvolution {
  currentTrends: string[];
  futureProjections: string[];
  disruptionPotential: 'low' | 'medium' | 'high';
  growthRate: number;
  maturity: 'emerging' | 'growth' | 'mature' | 'declining';
  keyPlayers: Array<{
    name: string;
    position: string;
    marketShare?: number;
  }>;
  regulatoryChanges: string[];
  technologicalDisruptions: string[];
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  maturityLevel?: 'emerging' | 'growth' | 'mature' | 'declining'; // Alias pour maturity
  keyTrends?: string[];
}

// ===== MÉTRIQUES ET KPIS =====
export interface SWOTMetrics {
  // === STRUCTURE PRINCIPALE ATTENDUE PAR RealBrandIntelligenceService ===
  strengthsScore?: number; // 0-100
  weaknessesScore?: number; // 0-100
  opportunitiesScore?: number; // 0-100
  threatsScore?: number; // 0-100
  strategicHealthIndex?: number; // 0-100
  overallScore?: number; // 0-100 (optionnel pour rétrocompatibilité)
  
  // === STRUCTURE DÉTAILLÉE ===
  detailedBreakdown?: {
    strengths?: Array<{
      area: string;
      score: number;
      impact: string;
      sustainability: string;
      evidence: string[];
    }>;
    weaknesses?: Array<{
      area: string;
      severity: number;
      urgency: string;
      improvability: string;
      impacts: string[];
    }>;
    opportunities?: Array<{
      area: string;
      attractiveness: number;
      feasibility: number;
      timeToCapture: number;
      investmentRequired: string;
    }>;
    threats?: Array<{
      area: string;
      probability: number;
      impact: number;
      timeToMaterialization: number;
    }>;
  };
  
  competitiveAdvantage?: string[];
  
  // === RÉTROCOMPATIBILITÉ AVEC STRUCTURE LEGACY ===
  strengths?: Array<{
    item: string;
    score: number; // 0-100
    evidence: string[];
  }>;
  
  weaknesses?: Array<{
    item: string;
    severity: number; // 0-100
    impact: string[];
  }>;
  
  opportunities?: Array<{
    item: string;
    potential: number; // 0-100
    timeline: string;
  }>;
  
  threats?: Array<{
    item: string;
    risk: number; // 0-100
    urgency: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  }>;
  
  // *** PROPRIÉTÉ CRITIQUE POUR RealBrandIntelligenceService - AJOUTÉE ***
  strategicRecommendations?: Array<{
    area: string;
    action: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    timeline: string;
    expectedImpact: number;
    resourcesNeeded: string[];
    successMetrics: string[];
  }>;
}

export interface ContentMetrics {
  // === STRUCTURE PRINCIPALE ATTENDUE PAR RealBrandIntelligenceService ===
  overallSentiment?: number; // -100 à +100
  
  // *** PROPRIÉTÉ CRITIQUE POUR RealBrandIntelligenceService - AJOUTÉE ***
  sentimentDistribution?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  
  topicsDistribution?: Array<{
    topic: string;
    percentage: number;
    theme?: string;
  }>;
  
  // *** PROPRIÉTÉ CRITIQUE POUR RealBrandIntelligenceService ***
  sentimentByTopic?: {
    [topic: string]: {
      positive: number;
      neutral: number;
      negative: number;
    };
  };
  
  contentVolume?: number | {
    totalPosts: number;
    weeklyGrowth: number;
  };
  
  engagementMetrics?: {
    likes: number;
    shares: number;
    comments: number;
    avgEngagement: number;
    conversionRate?: number;
  };
  
  viralityIndex?: number; // 0-100
  
  influencerMetrics?: {
    totalInfluencers: number;
    avgReach: number;
    topInfluencers: Array<{
      name: string;
      metrics: any;
    }>;
  };
  
  contentQuality?: {
    score: number;
    readability: number;
    relevance: number;
    originality: number;
    authorityScore?: number;
    credibilityIndex?: number;
    factualAccuracy?: number;
    sourceReliability?: number;
  };
  
  // *** PROPRIÉTÉ CRITIQUE POUR RealBrandIntelligenceService ***
  trendingTopics?: Array<{
    topic: string;
    velocity: number;
    peakTime: Date;
    duration: number;
    reach: number;
    sentiment: number;
  }>;
  
  // === RÉTROCOMPATIBILITÉ AVEC STRUCTURE LEGACY ===
  volume?: {
    totalMentions: number;
    weeklyAverage: number;
    monthlyGrowth: number;
  };
  
  sentiment?: {
    positive: number; // pourcentage
    neutral: number;
    negative: number;
    overallSentiment: number; // -100 à +100
  };
  
  reach?: {
    totalReach: number;
    avgEngagement: number;
    viralityScore: number; // 0-100
  };
  
  topics?: Array<{
    topic: string;
    frequency: number;
    sentiment: number;
  }>;
  
  influencers?: Array<{
    name: string;
    reach: number;
    engagement: number;
    credibility: number; // 0-100
  }>;
}

export interface CompetitiveMetrics {
  // === STRUCTURE PRINCIPALE ATTENDUE PAR RealBrandIntelligenceService ===
  marketShareEvolution?: {
    currentShare?: number;
    trend: 'positive' | 'negative' | 'stable' | 'growing' | 'declining';
    projectedShare?: number;
    historical?: Array<{
      period: string;
      value: number;
    }>;
    benchmarkPosition?: {
      rank: number;
      percentile: number;
      gapToLeader: number;
    };
  };
  
  competitorBenchmark?: Array<{
    competitor: string;
    name?: string;
    metrics: any;
    position: string;
    threatLevel?: number;
    marketShare?: number;
    strengthAreas?: string[];
  }>;
  
  competitiveAdvantageIndex?: number; // 0-100
  threatLevel?: number; // 0-100
  opportunityGaps?: string[];
  
  // *** PROPRIÉTÉ CRITIQUE POUR RealBrandIntelligenceService - AJOUTÉE ***
  competitivePositioning?: {
    positionQuadrant: 'leader' | 'challenger' | 'follower' | 'nicher';
    differentiationLevel: number;
    costAdvantage: number;
    brandStrength: number;
    operationalExcellence: number;
  };
  
  // *** PROPRIÉTÉ CRITIQUE POUR RealBrandIntelligenceService ***
  marketDynamics?: {
    competitionIntensity: number;
    barriers: Array<{
      type: string;
      strength: number;
      impact: string;
    }>;
    newEntrants: Array<{
      name: string;
      probability: number;
      potentialImpact: number;
      timeFrame: string;
    }>;
    substituteThreats: Array<{
      substitute: string;
      threatLevel: number;
      adoptionRate: number;
      impactAreas: string[];
    }>;
    supplierPower: number;
    buyerPower: number;
  };
  
  // === RÉTROCOMPATIBILITÉ AVEC STRUCTURE LEGACY ===
  marketShare?: {
    current: number;
    trend: 'growing' | 'stable' | 'declining';
    projectedShare: number;
    historicalData: Array<{
      period: string;
      share: number;
    }>;
  };
  
  benchmarkPosition?: {
    rank: number; // position dans le secteur
    percentile: number; // 0-100
    gapToLeader: number;
  };
  
  positionQuadrant?: 'leader' | 'challenger' | 'follower' | 'niche';
  costAdvantage?: number; // pourcentage vs concurrents
}

export interface ReputationKPIs {
  overallScore: number; // 0-100
  
  brandTrust: number; // 0-100
  brandRecognition: number; // 0-100
  brandLoyalty: number; // 0-100
  
  publicPerception: {
    favorability: number; // 0-100
    awareness: number; // 0-100
    consideration: number; // 0-100
  };
  
  socialMediaMetrics: {
    followers: number;
    engagement: number;
    sentimentScore: number; // -100 à +100
  };
  
  crisisResilience: number; // 0-100
  
  competitorComparison: Array<{
    competitor: string;
    ourScore: number;
    theirScore: number;
    gap: number;
  }>;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  overallReputationScore?: number; // Alias pour overallScore
  trustIndex?: number; // Alias pour brandTrust
  brandLoyaltyScore?: number; // Alias pour brandLoyalty
  stakeholderSentiment?: {
    customers: number;
    employees: number;
    investors: number;
    media: number;
  };
  
  // *** AJOUT CRITIQUE : Propriétés manquantes dans RealBrandIntelligenceService ***
  reputationDrivers?: Array<{
    factor: string;
    impact: number;
    trend: 'improving' | 'stable' | 'declining';
    controlLevel: 'high' | 'medium' | 'low';
  }>;
  
  riskIndicators?: Array<{
    type: string;
    level: 'low' | 'medium' | 'high';
    probability: number;
    impact: number;
    mitigation: string[];
  }>;
  
  benchmarkComparison?: Array<{
    metric: string;
    ourScore: number;
    industryAverage: number;
    topPerformer: number;
    position: 'leading' | 'average' | 'lagging';
    brandScore?: number;
    gap?: number;
  }>;
}

// ===== RECOMMANDATIONS ET ALERTES =====
export interface ActionableRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  priority: 'critical' | 'high' | 'medium' | 'low';
  
  implementation: {
    timeline: string;
    estimatedBudget: {
      min: number;
      max: number;
      currency: string;
    };
    requiredResources: string[];
    responsibleDepartment: string;
  };
  
  expectedImpact: number; // 0-100
  successMetrics: string[];
  risks: 'low' | 'medium' | 'high';
  dependencies: string[];
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  timeline?: string;
  estimatedImpact?: number;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface SmartAlerts {
  critical: Array<{
    id: string;
    message: string;
    context: string;
    timeline: string;
    suggestedAction: string;
    metrics?: {
      metric: string;
      currentValue: string;
      threshold: number;
      deviation: number;
    };
    historicalComparison?: string;
  }>;
  
  warnings: Array<{
    id: string;
    message: string;
    context: string;
    timeline: string;
    suggestedAction: string;
  }>;
  
  opportunities: Array<{
    id: string;
    message: string;
    context: string;
    timeline: string;
    suggestedAction: string;
  }>;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  warning?: Array<{
    id: string;
    message: string;
    context: string;
    timeline: string;
    suggestedAction: string;
  }>; // Alias pour warnings
  info?: Array<{
    id: string;
    message: string;
    context: string;
    timeline: string;
    suggestedAction: string;
  }>;
}

// ===== RAPPORT PRINCIPAL =====
export interface DeepResearchReport {
  // Métadonnées
  brandName: string;
  executionTimestamp: Date;
  
  // Analyses principales
  objectiveAnalysis: ObjectiveAnalysis;
  recentActions: RecentAction[];
  strategicAnalysis: StrategicAnalysis;
  trendAnalysis: TrendAnalysis;
  
  // Métriques
  swotMetrics: SWOTMetrics;
  contentMetrics: ContentMetrics;
  competitiveMetrics: CompetitiveMetrics;
  reputationKPIs: ReputationKPIs;
  
  // Actions
  recommendations: ActionableRecommendation[];
  alerts: SmartAlerts;
  
  // Qualité et fiabilité
  confidenceScore: number; // 0-100
  dataFreshness: DataFreshness;
  sources: SourceVerification[];
  limitations: string[];
}

// ===== TYPES POUR SERVICES =====
export interface PerplexityServiceConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface BusinessInsightsQuery {
  query: string;
  context: string;
  industry: string;
  depth: 'basic' | 'comprehensive' | 'deep';
  language: string;
}

export interface BusinessInsightsResponse {
  content: string;
  sources: string[];
  confidence: number;
  timestamp: Date;
}

// ===== TYPES POUR EXPORT =====
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'xlsx' | 'json' | 'csv' | 'excel';
  template?: 'executive' | 'detailed' | 'technical' | 'presentation';
  includeCharts?: boolean;
  includeRawData?: boolean;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  includeMetadata?: boolean;
  sections?: string[];
  compressionLevel?: 'none' | 'low' | 'medium' | 'high';
  enableDeduplication?: boolean;
  qualityEnhancement?: boolean;
  
  customization?: {
    includeCharts?: boolean;
    includeRawData?: boolean;
    includeExecutiveSummary?: boolean;
    includeRecommendations?: boolean;
    includeAlerts?: boolean;
  };
  
  branding?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    companyName?: string;
  };
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  size?: number;
  fileSize?: number;
  error?: string;
  errors?: string[];
  downloadUrl?: string;
  format?: string;
  
  // === PROPRIÉTÉS ÉTENDUES POUR COHÉRENCE COMPLÈTE ===
  enhancementApplied?: boolean;
  contentMetrics?: {
    totalWords?: number;
    [key: string]: any;
  };
  metadata?: {
    exportedBy?: string;
    version?: string;
    generationTime?: number;
    [key: string]: any;
  };
}

// ===== TYPES POUR DÉDUPLICATION =====
export interface DeduplicationStats {
  totalItems: number;
  duplications: number;
  uniqueItems: number;
  uniqueWords: number;
  repetitionRate: number;
}

export interface DeduplicationOptions {
  threshold: number; // seuil de similarité 0-1
  preserveStructure: boolean;
  aggressiveMode: boolean;
}

// ===== TYPES POUR TESTS =====
export interface MockDataOptions {
  realistic: boolean;
  completeness: 'minimal' | 'standard' | 'comprehensive';
  includeSensitiveData: boolean;
}

export interface TestValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

// ===== EXPORTS PAR DÉFAUT =====
export default DeepResearchReport; 