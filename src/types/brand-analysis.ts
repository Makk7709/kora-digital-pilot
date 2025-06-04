// Brand Analysis Types and Interfaces
// Extracted from monolithic BrandAnalysisService.ts for better organization

export interface RealMention {
  id: string;
  content: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: Date;
  reach: number;
  isReal: true;
}

export interface RealSentiment {
  overallScore: number;
  positive: number;
  neutral: number;
  negative: number;
  trend: 'positive' | 'negative' | 'stable';
  isCalculatedFromReal: true;
}

export interface RealCompetitor {
  name: string;
  mentions: number;
  sentiment: number;
  marketShare: number;
  isFromPerplexity: true;
}

export interface RealKeyword {
  word: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  isFromContent: true;
}

export interface RealSWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  isAIGenerated: true;
}

export interface RealAlert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  source: string;
  isReal: true;
}

export interface BrandReport {
  mentions: RealMention[];
  sentiment: RealSentiment;
  competitors: RealCompetitor[];
  keywords: RealKeyword[];
  swot: RealSWOT;
  alerts: RealAlert[];
  brandName: string;
  analysisTimestamp: Date;
}

export interface PerplexityReport {
  id: string;
  brandName: string;
  executiveSummary: string;
  reputationScore: number;
  keyInsights: string[];
  competitivePosition: string;
  recommendedActions: string[];
  detailedAnalysis: {
    sentiment: string;
    mentions: string;
    competitors: string;
    keywords: string;
    swot: string;
    alerts: string;
  };
  generatedAt: Date;
  isForReading: true;
}

export interface BrandAnalysisService {
  analyzeBrand(brandName: string): Promise<BrandReport>;
  getMentions(brandName: string): Promise<RealMention[]>;
  getCompetitors(brandName: string): Promise<RealCompetitor[]>;
  getSentiment(mentions: RealMention[]): Promise<RealSentiment>;
  getKeywords(content: string[]): Promise<RealKeyword[]>;
  generatePerplexityReport(brandReport: BrandReport): Promise<PerplexityReport>;
}

// Analysis context types
export interface AnalysisContext {
  brandName: string;
  analysisType: 'mentions' | 'sentiment' | 'competitors' | 'keywords' | 'swot' | 'alerts';
  timestamp: Date;
}

export interface ParsedResponse<T> {
  data: T;
  confidence: number;
  source: string;
  timestamp: Date;
} 