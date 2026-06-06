// Helpers de classification & génération de recommandations stratégiques.
// Extraits depuis `RealBrandIntelligenceService.ts` pour permettre au module
// principal de descendre sous 800 lignes.

interface RecommendationBudget {
  min: number;
  max: number;
  currency: string;
  confidence: number;
}

export interface DraftRecommendation {
  title: string;
  description: string;
  category: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedImpact: number;
  resourcesRequired: string[];
  timeline: string;
  successMetrics: string[];
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[];
  budget: RecommendationBudget;
  ownerDepartment: string;
}

export interface AlertRecord {
  type: 'critical' | 'warning' | 'opportunity';
  message: string;
  urgency: string;
  context: string;
  timeline: string;
  recommendedAction: string;
  affectedMetrics: Array<{
    metric: string;
    currentValue: string;
    threshold: number;
    deviation: number;
    historicalComparison: string;
  }>;
}

export function classifyRecommendationCategory(
  description: string,
): 'immediate' | 'short-term' | 'medium-term' | 'long-term' {
  const lowerDesc = description.toLowerCase();

  if (
    lowerDesc.includes('urgent') ||
    lowerDesc.includes('immédiat') ||
    lowerDesc.includes('critique')
  ) {
    return 'immediate';
  }
  if (
    lowerDesc.includes('court terme') ||
    lowerDesc.includes('rapidement') ||
    (lowerDesc.includes('prochaine') && lowerDesc.includes('semaine'))
  ) {
    return 'short-term';
  }
  if (
    lowerDesc.includes('moyen terme') ||
    lowerDesc.includes('trimestre') ||
    lowerDesc.includes('6 mois')
  ) {
    return 'medium-term';
  }

  return 'long-term';
}

export function assessRecommendationPriority(
  description: string,
): 'critical' | 'high' | 'medium' | 'low' {
  const lower = description.toLowerCase();
  if (lower.includes('critique') || lower.includes('essentiel')) return 'critical';
  if (lower.includes('priorité') || lower.includes('important')) return 'high';
  if (lower.includes('modéré') || lower.includes('secondaire')) return 'medium';
  return 'medium';
}

export function estimateRecommendationImpact(description: string): number {
  const lower = description.toLowerCase();
  if (lower.includes('révolutionnaire') || lower.includes('transformateur')) return 95;
  if (lower.includes('majeur') || lower.includes('significatif')) return 85;
  if (lower.includes('important') || lower.includes('notable')) return 75;
  if (lower.includes('modéré') || lower.includes('limité')) return 60;
  return 70;
}

export function extractRecommendationTimeline(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('3 mois')) return '3 mois';
  if (lower.includes('6 mois')) return '6 mois';
  if (lower.includes('1 an')) return '12 mois';
  if (lower.includes('2 ans')) return '24 mois';
  if (lower.includes('court terme')) return '6-12 mois';
  if (lower.includes('moyen terme')) return '12-18 mois';
  if (lower.includes('long terme')) return '18-36 mois';
  return '6-12 mois';
}

export function estimateRecommendationBudget(description: string): RecommendationBudget {
  let min = 100_000;
  let max = 500_000;

  const lower = description.toLowerCase();
  if (lower.includes('digital') || lower.includes('technolog')) {
    min = 500_000;
    max = 2_000_000;
  }
  if (lower.includes('acquisition') || lower.includes('fusion')) {
    min = 5_000_000;
    max = 50_000_000;
  }
  if (lower.includes('marketing') || lower.includes('campagne')) {
    min = 200_000;
    max = 1_000_000;
  }
  if (lower.includes('formation') || lower.includes('talent')) {
    min = 50_000;
    max = 300_000;
  }

  return { min, max, currency: 'EUR', confidence: 60 };
}

export function identifyResponsibleDepartment(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('it') || lower.includes('digital') || lower.includes('technolog'))
    return 'DSI & Innovation';
  if (lower.includes('marketing') || lower.includes('communication'))
    return 'Marketing & Communication';
  if (lower.includes('finance') || lower.includes('budget')) return 'Finance & Contrôle';
  if (lower.includes('talent') || lower.includes('formation') || lower.includes('rh'))
    return 'Ressources Humaines';
  if (lower.includes('vente') || lower.includes('commercial')) return 'Commercial & Ventes';
  if (lower.includes('opération') || lower.includes('production')) return 'Opérations';
  return 'Direction Générale';
}

export function generateRecommendationTitle(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('digital')) return 'Transformation digitale';
  if (lower.includes('innovation')) return 'Renforcement innovation';
  if (lower.includes('marché')) return 'Expansion marché';
  if (lower.includes('client')) return 'Amélioration expérience client';
  if (lower.includes('coût')) return 'Optimisation coûts';
  if (lower.includes('talent')) return 'Développement talents';
  if (lower.includes('partenariat')) return 'Stratégie partenariats';

  const words = description
    .split(' ')
    .filter((w) => w.length > 3)
    .slice(0, 3);
  return words.join(' ').substring(0, 50);
}

export function extractRequiredResources(description: string): string[] {
  const resources: string[] = [];
  const lower = description.toLowerCase();

  if (lower.includes('budget') || lower.includes('financement')) resources.push('Budget');
  if (lower.includes('talent') || lower.includes('compétence'))
    resources.push('Talents spécialisés');
  if (lower.includes('technolog') || lower.includes('système')) resources.push('Technologies');
  if (lower.includes('formation') || lower.includes('apprentissage'))
    resources.push('Formation équipes');
  if (lower.includes('partenaire') || lower.includes('externe'))
    resources.push('Partenaires externes');
  if (lower.includes('temps') || lower.includes('délai')) resources.push("Temps d'exécution");

  return resources.length > 0 ? resources : ['Budget', 'Équipe projet'];
}

export function extractSuccessMetrics(description: string): string[] {
  const metrics: string[] = [];
  const lower = description.toLowerCase();

  if (lower.includes('roi') || lower.includes('rentabilité')) metrics.push('ROI');
  if (lower.includes('client') || lower.includes('satisfaction')) metrics.push('NPS');
  if (lower.includes('marché') || lower.includes('part')) metrics.push('Part de marché');
  if (lower.includes('efficacité') || lower.includes('productivité'))
    metrics.push('Efficacité opérationnelle');
  if (lower.includes('chiffre') || lower.includes('revenus')) metrics.push('Croissance revenus');
  if (lower.includes('coût') || lower.includes('économie')) metrics.push('Réduction coûts');

  return metrics.length > 0 ? metrics : ['ROI', 'KPIs métier'];
}

export function assessRecommendationRisk(description: string): 'low' | 'medium' | 'high' {
  const lower = description.toLowerCase();
  if (lower.includes('risque élevé') || lower.includes('complexe')) return 'high';
  if (lower.includes('risque modéré') || lower.includes('standard')) return 'medium';
  if (lower.includes('risque faible') || lower.includes('simple')) return 'low';
  return 'medium';
}

export function extractDependencies(description: string): string[] {
  const dependencies: string[] = [];
  const lower = description.toLowerCase();

  if (lower.includes('direction') || lower.includes('sponsor'))
    dependencies.push('Sponsoring direction');
  if (lower.includes('budget') || lower.includes('financement')) dependencies.push('Budget validé');
  if (lower.includes('équipe') || lower.includes('resource'))
    dependencies.push('Ressources disponibles');
  if (lower.includes('système') || lower.includes('infrastructure'))
    dependencies.push('Infrastructure technique');
  if (lower.includes('partenaire') || lower.includes('externe'))
    dependencies.push('Partenaires alignés');
  if (lower.includes('réglementation') || lower.includes('compliance'))
    dependencies.push('Validation réglementaire');

  return dependencies.length > 0 ? dependencies : ['Validation direction'];
}

export function generateRecommendationsFromContent(content: string): DraftRecommendation[] {
  const recommendations: DraftRecommendation[] = [];
  const lower = content.toLowerCase();

  if (lower.includes('digital') || lower.includes('numérique')) {
    recommendations.push({
      title: 'Accélération transformation digitale',
      description: 'Renforcer les capacités numériques pour rester compétitif',
      category: 'short-term',
      priority: 'high',
      estimatedImpact: 80,
      resourcesRequired: ['Budget IT', 'Talents tech'],
      timeline: '12-18 mois',
      successMetrics: ['ROI digital', 'Efficacité'],
      riskLevel: 'medium',
      dependencies: ['Budget validé', 'Sponsoring direction'],
      budget: { min: 1_000_000, max: 3_000_000, currency: 'EUR', confidence: 70 },
      ownerDepartment: 'DSI & Innovation',
    });
  }

  if (lower.includes('concurrence') || lower.includes('competitor')) {
    recommendations.push({
      title: 'Renforcement différenciation concurrentielle',
      description: 'Développer des avantages concurrentiels durables',
      category: 'medium-term',
      priority: 'high',
      estimatedImpact: 75,
      resourcesRequired: ['Innovation', 'Marketing'],
      timeline: '6-12 mois',
      successMetrics: ['Part de marché', 'NPS'],
      riskLevel: 'medium',
      dependencies: ['Stratégie validée'],
      budget: { min: 500_000, max: 1_500_000, currency: 'EUR', confidence: 65 },
      ownerDepartment: 'Stratégie & Marketing',
    });
  }

  return recommendations;
}

export function extractAlertContext(description: string): string {
  return description.substring(0, 100) + '...';
}

export function extractAlertTimeline(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('immédiat')) return 'Immédiat';
  if (lower.includes('court')) return '1-3 mois';
  if (lower.includes('moyen')) return '3-6 mois';
  return '6+ mois';
}

export function generateAlertAction(
  _description: string,
  type: 'critical' | 'warning' | 'opportunity',
): string {
  const actions: Record<typeof type, string[]> = {
    critical: [
      'Investigation immédiate requise',
      'Mise en place plan de contingence',
      'Escalade management senior',
    ],
    warning: [
      'Surveillance renforcée',
      'Analyse approfondie recommandée',
      "Préparation plan d'action",
    ],
    opportunity: ['Évaluation opportunité', 'Développement business case', 'Allocation ressources'],
  };

  const list = actions[type];
  return list[Math.floor(Math.random() * list.length)];
}

export function extractMetricFromDescription(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('chiffre')) return "Chiffre d'affaires";
  if (lower.includes('part')) return 'Part de marché';
  if (lower.includes('croissance')) return 'Taux de croissance';
  return 'Métrique générale';
}

export function extractCurrentValue(description: string): string {
  const match = description.match(/(\d+(?:\.\d+)?)\s*(?:%|€|M€|milliards?)/);
  return match ? match[0] : 'N/A';
}

export function extractThreshold(description: string): number {
  const match = description.match(/seuil.*?(\d+)/i);
  return match ? Number.parseInt(match[1]) : 70;
}

export function calculateDeviation(description: string): number {
  const lower = description.toLowerCase();
  if (lower.includes('forte baisse')) return -25;
  if (lower.includes('baisse')) return -10;
  if (lower.includes('hausse')) return 10;
  if (lower.includes('forte hausse')) return 25;
  return 0;
}

export function extractHistoricalComparison(description: string): string {
  if (description.toLowerCase().includes('historique')) {
    return 'Comparaison avec données historiques disponible';
  }
  return 'Données de référence limitées';
}

export function generateAlertsFromMetrics(content: string): {
  critical: AlertRecord[];
  warning: AlertRecord[];
  info: AlertRecord[];
  opportunities: AlertRecord[];
} {
  return {
    critical: [
      {
        type: 'critical',
        message: 'Surveillance requise',
        urgency: 'immediate',
        context: extractAlertContext(content),
        timeline: extractAlertTimeline(content),
        recommendedAction: generateAlertAction(content, 'critical'),
        affectedMetrics: [
          {
            metric: extractMetricFromDescription(content),
            currentValue: extractCurrentValue(content),
            threshold: extractThreshold(content),
            deviation: calculateDeviation(content),
            historicalComparison: extractHistoricalComparison(content),
          },
        ],
      },
    ],
    warning: [],
    info: [],
    opportunities: [],
  };
}
