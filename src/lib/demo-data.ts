/**
 * Données simulées à des fins de démonstration.
 *
 * AVERTISSEMENT : ce module centralise toutes les valeurs hardcodées
 * (Instagram, X/Twitter, Facebook, agrégats multi-plateformes) qui étaient
 * auparavant éparpillées dans les composants Dashboard/Analytics/Library.
 *
 * Aucune de ces valeurs ne provient d'une API tierce ou d'une base de données
 * réelle. Elles ne doivent JAMAIS être présentées à un utilisateur final
 * sans indication explicite (banner, badge « Données simulées », etc.).
 *
 * En production, ces exports ne doivent être consommés que lorsque
 * `getDataMode() === 'demo'` (voir `src/lib/data-mode.ts`). En mode `'real'`,
 * les composants doivent afficher un EmptyState et inviter l'utilisateur à
 * connecter la source de données correspondante (Instagram Graph API,
 * X API, Meta Business, etc.).
 *
 * Périmètre :
 *   - LinkedIn  -> données RÉELLES via OAuth + proxy `/api/linkedin/*`
 *                  (NE PAS extraire ici, voir `src/lib/linkedin-api.ts`)
 *   - Perplexity -> données RÉELLES via API
 *   - OpenAI / Anthropic -> données RÉELLES via API
 *   - Instagram / X / Facebook -> SIMULÉES (ce module)
 */

export type AnalyticsPeriod = '7d' | '30d' | '90d';

export interface DemoPlatformStats {
  posts: number;
  reach: string;
  reachNum: number;
  engagement: string;
  engagementNum: number;
  clicks: string;
  clicksNum: number;
  trend: string;
  chartData: number[];
}

export interface DemoPlatformSnapshot {
  name: 'LinkedIn' | 'Instagram' | 'X (Twitter)' | 'Facebook';
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  stats: DemoPlatformStats;
}

export interface DemoDashboardPlatform {
  name: 'LinkedIn' | 'Instagram' | 'X (Twitter)';
  reach: number;
  engagement: number;
  clicks: number;
  posts: number;
}

export interface DemoTopPost {
  platform: 'LinkedIn' | 'Instagram' | 'X (Twitter)';
  content: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
  };
  performance: 'Excellent' | 'Bon' | 'Moyen';
  color: string;
}

export interface DemoInsight {
  title: string;
  description: string;
  impact: string;
  type: 'timing' | 'content' | 'audience';
  color: string;
}

export interface DemoLibraryItem {
  id: number;
  type: 'post' | 'thread' | 'visual' | 'template';
  platform: 'LinkedIn' | 'Instagram' | 'X (Twitter)' | 'Multi';
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  performance: { likes: number; shares: number } | null;
  status: 'published' | 'draft' | 'scheduled' | 'template';
}

/**
 * Plateformes utilisées par `Dashboard.calculateDashboardMetrics`.
 *
 * Source : valeurs historiquement codées en dur dans `Dashboard.tsx`
 * (commit antérieur, fonction `calculateDashboardMetrics`).
 */
export const DEMO_DASHBOARD_PLATFORMS: readonly DemoDashboardPlatform[] = [
  { name: 'LinkedIn', reach: 45200, engagement: 0.068, clicks: 892, posts: 12 },
  { name: 'Instagram', reach: 28700, engagement: 0.042, clicks: 445, posts: 8 },
  { name: 'X (Twitter)', reach: 15300, engagement: 0.031, clicks: 234, posts: 15 },
] as const;

/**
 * Snapshots Analytics par période. Source : `Analytics.getAnalyticsData`.
 */
export const DEMO_ANALYTICS_BY_PERIOD: Readonly<
  Record<AnalyticsPeriod, readonly DemoPlatformSnapshot[]>
> = {
  '7d': [
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/5',
      textColor: 'text-blue-600',
      stats: {
        posts: 12,
        reach: '45.2K',
        reachNum: 45200,
        engagement: '6.8%',
        engagementNum: 3074,
        clicks: '892',
        clicksNum: 892,
        trend: '+15%',
        chartData: [65, 78, 82, 91, 88, 95, 102],
      },
    },
    {
      name: 'Instagram',
      icon: '📸',
      color: 'border-pink-500',
      bgColor: 'bg-pink-500/5',
      textColor: 'text-pink-500',
      stats: {
        posts: 8,
        reach: '28.7K',
        reachNum: 28700,
        engagement: '4.2%',
        engagementNum: 1205,
        clicks: '445',
        clicksNum: 445,
        trend: '+8%',
        chartData: [45, 52, 48, 61, 58, 67, 72],
      },
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'border-gray-500',
      bgColor: 'bg-gray-500/5',
      textColor: 'text-gray-600',
      stats: {
        posts: 15,
        reach: '15.3K',
        reachNum: 15300,
        engagement: '3.1%',
        engagementNum: 474,
        clicks: '234',
        clicksNum: 234,
        trend: '+12%',
        chartData: [28, 32, 35, 29, 41, 38, 45],
      },
    },
  ],
  '30d': [
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/5',
      textColor: 'text-blue-600',
      stats: {
        posts: 48,
        reach: '178.4K',
        reachNum: 178400,
        engagement: '7.1%',
        engagementNum: Math.round(178400 * 0.071),
        clicks: '3.2K',
        clicksNum: 3200,
        trend: '+22%',
        chartData: [1200, 1350, 1180, 1420, 1580, 1650, 1780],
      },
    },
    {
      name: 'Instagram',
      icon: '📸',
      color: 'border-pink-500',
      bgColor: 'bg-pink-500/5',
      textColor: 'text-pink-500',
      stats: {
        posts: 32,
        reach: '112.6K',
        reachNum: 112600,
        engagement: '5.3%',
        engagementNum: Math.round(112600 * 0.053),
        clicks: '2.1K',
        clicksNum: 2100,
        trend: '+18%',
        chartData: [890, 920, 1050, 1180, 1120, 1260, 1340],
      },
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'border-gray-500',
      bgColor: 'bg-gray-500/5',
      textColor: 'text-gray-600',
      stats: {
        posts: 62,
        reach: '51.8K',
        reachNum: 51800,
        engagement: '3.6%',
        engagementNum: Math.round(51800 * 0.036),
        clicks: '1.5K',
        clicksNum: 1500,
        trend: '+28%',
        chartData: [420, 380, 450, 520, 480, 580, 620],
      },
    },
  ],
  '90d': [
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/5',
      textColor: 'text-blue-600',
      stats: {
        posts: 144,
        reach: '624K',
        reachNum: 624000,
        engagement: '7.8%',
        engagementNum: Math.round(624000 * 0.078),
        clicks: '9.8K',
        clicksNum: 9800,
        trend: '+35%',
        chartData: [3200, 3800, 4200, 4600, 5100, 5400, 5800],
      },
    },
    {
      name: 'Instagram',
      icon: '📸',
      color: 'border-pink-500',
      bgColor: 'bg-pink-500/5',
      textColor: 'text-pink-500',
      stats: {
        posts: 96,
        reach: '398K',
        reachNum: 398000,
        engagement: '5.2%',
        engagementNum: Math.round(398000 * 0.052),
        clicks: '6.2K',
        clicksNum: 6200,
        trend: '+28%',
        chartData: [2100, 2400, 2800, 3200, 3600, 3800, 4100],
      },
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'border-gray-500',
      bgColor: 'bg-gray-500/5',
      textColor: 'text-gray-600',
      stats: {
        posts: 186,
        reach: '178K',
        reachNum: 178000,
        engagement: '4.1%',
        engagementNum: Math.round(178000 * 0.041),
        clicks: '2.4K',
        clicksNum: 2400,
        trend: '+42%',
        chartData: [980, 1200, 1400, 1600, 1800, 2000, 2200],
      },
    },
  ],
} as const;

/**
 * Vue agrégée par défaut (utilisée par Dashboard et Analytics).
 *
 * Volontairement dérivée des données ci-dessus pour rester cohérente
 * avec la philosophie "une seule source de vérité démo".
 */
export const DEMO_AGGREGATE_KPIS = {
  postsThisWeek: 12,
  globalGrowth: '+12%',
  engagementDelta: '+0.3%',
  clicksDelta: '+8%',
  growthDelta: '+2.1%',
  comparisonPreviousReach: {
    '7d': '76.8K',
    '30d': '276.4K',
    '90d': '920K',
  } satisfies Record<AnalyticsPeriod, string>,
} as const;

/**
 * Top posts par défaut affichés sur Analytics si LinkedIn n'est pas connecté.
 * Source : `Analytics.getTopPosts.defaultPosts`.
 */
export const DEMO_TOP_POSTS: readonly DemoTopPost[] = [
  {
    platform: 'LinkedIn',
    content: 'Thread : 5 tendances IA qui transforment le business',
    metrics: { likes: 333, comments: 42, shares: 67, clicks: 125 },
    performance: 'Excellent',
    color: 'text-green-600',
  },
  {
    platform: 'Instagram',
    content: "Carrousel : Guide productivité avec l'IA",
    metrics: { likes: 136, comments: 18, shares: 12, clicks: 49 },
    performance: 'Bon',
    color: 'text-blue-600',
  },
  {
    platform: 'X (Twitter)',
    content: 'Quick tip : Optimiser ses prompts GPT-4',
    metrics: { likes: 84, comments: 11, shares: 28, clicks: 52 },
    performance: 'Moyen',
    color: 'text-yellow-500',
  },
] as const;

/**
 * Insights par défaut. Source : `Analytics.getInsights.defaultInsights`.
 */
export const DEMO_INSIGHTS: readonly DemoInsight[] = [
  {
    title: 'Meilleur moment de publication',
    description: 'LinkedIn : 9h-11h (lundi-mercredi)',
    impact: '+11% engagement',
    type: 'timing',
    color: 'border-blue-500/30 bg-blue-500/5',
  },
  {
    title: 'Contenu le plus performant',
    description: "Threads éducatifs sur l'IA",
    impact: '+18% partages',
    type: 'content',
    color: 'border-amber-500/30 bg-amber-500/5',
  },
  {
    title: 'Audience engagement',
    description: "Pics d'activité : 9h, 14h, 17h",
    impact: '+10% interactions',
    type: 'audience',
    color: 'border-purple-500/30 bg-purple-500/5',
  },
] as const;

/**
 * Bibliothèque éditoriale de démonstration. Source : `Library.savedContent`.
 */
export const DEMO_LIBRARY_ITEMS: readonly DemoLibraryItem[] = [
  {
    id: 1,
    type: 'post',
    platform: 'LinkedIn',
    title: "Innovation IA dans l'entreprise",
    content: "🚀 L'IA générative redéfinit notre approche business...",
    tags: ['IA', 'Business', 'Innovation'],
    createdAt: '2024-01-15',
    performance: { likes: 333, shares: 67 },
    status: 'published',
  },
  {
    id: 2,
    type: 'thread',
    platform: 'X (Twitter)',
    title: 'Thread GPT-4o vs Claude',
    content: '🧵 Comparaison détaillée entre GPT-4o et Claude 3.5...',
    tags: ['GPT-4o', 'Claude', 'Comparaison'],
    createdAt: '2024-01-14',
    performance: { likes: 84, shares: 28 },
    status: 'draft',
  },
  {
    id: 3,
    type: 'visual',
    platform: 'Instagram',
    title: 'Infographie productivité IA',
    content: 'Carrousel : 5 tips pour booster sa productivité...',
    tags: ['Productivité', 'Tips', 'Carrousel'],
    createdAt: '2024-01-13',
    performance: { likes: 136, shares: 12 },
    status: 'scheduled',
  },
  {
    id: 4,
    type: 'template',
    platform: 'Multi',
    title: 'Template annonce produit',
    content: 'Structure réutilisable pour annoncer un nouveau...',
    tags: ['Template', 'Produit', 'Annonce'],
    createdAt: '2024-01-12',
    performance: null,
    status: 'template',
  },
] as const;

export const DEMO_LIBRARY_CATEGORIES = [
  { id: 'all', name: 'Tout', count: 24 },
  { id: 'posts', name: 'Posts', count: 12 },
  { id: 'threads', name: 'Threads', count: 6 },
  { id: 'visuals', name: 'Visuels', count: 4 },
  { id: 'templates', name: 'Templates', count: 2 },
] as const;

export const DEMO_LIBRARY_STATS = {
  total: 24,
  published: 18,
  drafts: 4,
  templates: 2,
} as const;

/**
 * Vues plateforme exposées séparément pour usage ciblé.
 * Permet par exemple d'afficher un EmptyState distinct par plateforme.
 */
export const DEMO_INSTAGRAM_METRICS = {
  '7d': DEMO_ANALYTICS_BY_PERIOD['7d'].find((p) => p.name === 'Instagram')!,
  '30d': DEMO_ANALYTICS_BY_PERIOD['30d'].find((p) => p.name === 'Instagram')!,
  '90d': DEMO_ANALYTICS_BY_PERIOD['90d'].find((p) => p.name === 'Instagram')!,
} as const;

export const DEMO_X_METRICS = {
  '7d': DEMO_ANALYTICS_BY_PERIOD['7d'].find((p) => p.name === 'X (Twitter)')!,
  '30d': DEMO_ANALYTICS_BY_PERIOD['30d'].find((p) => p.name === 'X (Twitter)')!,
  '90d': DEMO_ANALYTICS_BY_PERIOD['90d'].find((p) => p.name === 'X (Twitter)')!,
} as const;

/**
 * Stub Facebook (la plateforme n'est pas encore exploitée dans l'UI mais
 * documentée comme cible future). Reste un export typé pour permettre
 * un branchement EmptyState cohérent.
 */
export const DEMO_FACEBOOK_METRICS: Record<AnalyticsPeriod, DemoPlatformSnapshot | null> = {
  '7d': null,
  '30d': null,
  '90d': null,
};
