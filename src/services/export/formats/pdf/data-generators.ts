// Générateurs de données factices/illustratives pour les sections analytiques
// du PDFExporter (radar concurrentiel, SWOT avancé, scénarios, sensibilité).
// Extraits du module principal pour réduire sa taille; ces fonctions sont
// pures et faciles à tester unitairement.

interface ReportLike {
  brandName?: string;
}

export interface CompetitiveRadarEntry {
  name: string;
  scores: number[];
}

export function generateCompetitiveRadar(report: ReportLike): CompetitiveRadarEntry[] {
  const brandName = (report.brandName || '').toLowerCase();

  if (brandName.includes('tesla')) {
    return [
      { name: 'Tesla', scores: [9, 8, 8, 9, 9] },
      { name: 'BMW', scores: [7, 9, 9, 6, 7] },
      { name: 'Toyota', scores: [6, 8, 9, 5, 8] },
    ];
  }

  if (brandName.includes('apple')) {
    return [
      { name: 'Apple', scores: [9, 9, 9, 8, 8] },
      { name: 'Samsung', scores: [8, 8, 8, 7, 6] },
      { name: 'Google', scores: [8, 7, 7, 9, 7] },
    ];
  }

  return [
    { name: report.brandName || 'Brand', scores: [7, 8, 7, 8, 7] },
    { name: 'Concurrent A', scores: [8, 7, 8, 7, 8] },
    { name: 'Concurrent B', scores: [6, 9, 6, 6, 6] },
  ];
}

export function generateCompetitiveGaps(_report: ReportLike) {
  return [
    { area: 'Innovation Technology', gap: '-12%', impact: 'HIGH', action: 'R&D Investment +25%' },
    { area: 'Digital Marketing', gap: '+8%', impact: 'MEDIUM', action: 'Maintain Leadership' },
    { area: 'Sustainability', gap: '-5%', impact: 'MEDIUM', action: 'ESG Enhancement' },
    { area: 'Brand Awareness', gap: '+15%', impact: 'LOW', action: 'Leverage Advantage' },
    { area: 'Customer Experience', gap: '-3%', impact: 'HIGH', action: 'UX Transformation' },
  ];
}

export function generateSWOTAdvanced(_report: ReportLike) {
  return {
    strengths: [
      { score: 9, text: 'Leadership technologique reconnu' },
      { score: 8, text: 'Écosystème produits intégré' },
      { score: 8, text: 'Capital marque exceptionnel' },
      { score: 7, text: 'Innovation R&D continue' },
      { score: 7, text: 'Fidélité client premium' },
      { score: 6, text: 'Distribution multi-canal' },
    ],
    weaknesses: [
      { score: 7, text: 'Prix premium vs concurrence' },
      { score: 6, text: 'Dépendance géographique' },
      { score: 6, text: 'Cycles produits longs' },
      { score: 5, text: 'Complexité organisationnelle' },
      { score: 4, text: 'Segments marché restreints' },
    ],
    opportunities: [
      { score: 9, text: 'Marchés émergents croissance' },
      { score: 8, text: 'Transformation digitale' },
      { score: 7, text: 'Durabilité & ESG trends' },
      { score: 7, text: 'Partnerships stratégiques' },
      { score: 6, text: 'Nouveaux segments clients' },
    ],
    threats: [
      { score: 8, text: 'Intensification concurrence' },
      { score: 7, text: 'Disruption technologique' },
      { score: 6, text: 'Réglementations changantes' },
      { score: 6, text: 'Volatilité économique' },
      { score: 5, text: 'Commoditisation produits' },
    ],
  };
}

export function generateSWOTPriorities(_report: ReportLike) {
  return [
    { level: 'HIGH', strategy: 'Leverage tech leadership for market expansion' },
    { level: 'HIGH', strategy: 'Accelerate digital transformation initiatives' },
    { level: 'MEDIUM', strategy: 'Address pricing strategy vs competition' },
    { level: 'MEDIUM', strategy: 'Strengthen supply chain resilience' },
    { level: 'LOW', strategy: 'Monitor regulatory changes impact' },
    { level: 'LOW', strategy: 'Develop contingency competitive responses' },
  ];
}

export function generateScenarios(_report: ReportLike) {
  return [
    {
      name: 'Optimiste',
      probability: 25,
      impact: 180,
      timeline: '12-18M',
      action: 'Aggressive expansion',
    },
    { name: 'Probable', probability: 60, impact: 85, timeline: '6-12M', action: 'Steady growth' },
    {
      name: 'Conservateur',
      probability: 35,
      impact: 35,
      timeline: '18-24M',
      action: 'Risk mitigation',
    },
    {
      name: 'Pessimiste',
      probability: 15,
      impact: -45,
      timeline: '3-6M',
      action: 'Defensive strategy',
    },
    {
      name: 'Disruption',
      probability: 10,
      impact: -120,
      timeline: '6-18M',
      action: 'Emergency pivots',
    },
  ];
}

export function generateSensitivityAnalysis(_report: ReportLike) {
  return [
    {
      name: 'Market Demand Volatility',
      impact: 'CRITICAL',
      variance: '±15%',
      monitoring: 'Weekly',
    },
    { name: 'Competitive Response', impact: 'HIGH', variance: '±12%', monitoring: 'Monthly' },
    { name: 'Technology Adoption Rate', impact: 'HIGH', variance: '±18%', monitoring: 'Quarterly' },
    { name: 'Regulatory Changes', impact: 'MEDIUM', variance: '±8%', monitoring: 'Monthly' },
    { name: 'Economic Indicators', impact: 'MEDIUM', variance: '±10%', monitoring: 'Monthly' },
    { name: 'Consumer Preferences', impact: 'LOW', variance: '±5%', monitoring: 'Quarterly' },
  ];
}
