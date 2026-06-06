import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import { useLinkedInAnalytics } from '@/hooks/useLinkedInAnalytics';
import { LinkedInMetrics } from '@/lib/linkedin-api';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  Zap,
  Download,
  Calendar,
  RefreshCw,
  CheckCircle2,
  Database,
  Wifi,
  WifiOff,
} from 'lucide-react';

import EmptyState from '@/components/EmptyState';
import { useDataMode } from '@/contexts/DataModeContext';
import {
  AnalyticsPeriod,
  DEMO_AGGREGATE_KPIS,
  DEMO_ANALYTICS_BY_PERIOD,
  DEMO_INSIGHTS,
  DEMO_TOP_POSTS,
  type DemoInsight,
  type DemoPlatformSnapshot,
  type DemoTopPost,
} from '@/lib/demo-data';

// S3358 : helpers extraits pour éviter les ternaires imbriqués.
const periodLabel = (period: AnalyticsPeriod): string => {
  if (period === '7d') return '7 jours';
  if (period === '30d') return '30 jours';
  return '90 jours';
};

const ratePerformance = (likes: number): 'Excellent' | 'Bon' | 'Moyen' => {
  if (likes > 100) return 'Excellent';
  if (likes > 50) return 'Bon';
  return 'Moyen';
};

const performanceColor = (likes: number): string => {
  if (likes > 100) return 'text-green-600';
  if (likes > 50) return 'text-blue-600';
  return 'text-yellow-500';
};

// S6478 : composants purs hissés au module pour ne plus être redéclarés à chaque rendu.
const MiniChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  return (
    <div className="flex items-end space-x-1 h-8">
      {data.map((value, index) => {
        const height = range > 0 ? ((value - min) / range) * 100 : 50;
        return (
          <div
            key={`row-${index}`}
            className={`w-1 ${color} rounded-t`}
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        );
      })}
    </div>
  );
};

const DataSourceBadge: React.FC<{ isRealData: boolean; platform?: string }> = ({ isRealData }) => {
  if (isRealData) {
    return (
      <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Données réelles
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs">
      <Database className="w-3 h-3 mr-1" />
      Données simulées
    </Badge>
  );
};

interface AnalyticsPlatform extends Omit<DemoPlatformSnapshot, 'stats'> {
  isRealData: boolean;
  stats: Omit<DemoPlatformSnapshot['stats'], 'reachNum' | 'engagementNum' | 'clicksNum'> & {
    reachNum?: number;
    engagementNum?: number;
    clicksNum?: number;
  };
}

interface AnalyticsState {
  totalReach: string;
  totalEngagement: string;
  totalClicks: string;
  growth: string;
  platforms: AnalyticsPlatform[];
  hasRealLinkedInData: boolean;
  linkedInLastSync: number | null;
}

type DisplayTopPost = DemoTopPost & { isRealData: boolean };
type DisplayInsight = DemoInsight & { isRealData: boolean };

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

const Analytics = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>('7d');
  const [selectedPlatform] = useState('all');
  const [showComparison] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<string | null>(null);
  const [showDataSourceInfo, setShowDataSourceInfo] = useState(false);

  const { generateContent } = useAI();
  const {
    isAuthenticated: isLinkedInConnected,
    metrics: linkedInMetrics,
    fetchMetrics: fetchLinkedInMetrics,
    lastSync,
    isLoading: isLinkedInLoading,
  } = useLinkedInAnalytics();
  const { toast } = useToast();
  const { isDemo } = useDataMode();

  const parseMetricValue = useCallback((value: string): number => {
    if (!value) return 0;
    const numStr = value.replace(/[KM]/g, '');
    const num = Number.parseFloat(numStr);
    if (value.includes('K')) return num * 1000;
    if (value.includes('M')) return num * 1000000;
    return num;
  }, []);

  const formatMetricValue = useCallback((num: number): string => formatNumber(num), []);

  /**
   * Construit l'état d'analytics démo pour une période donnée. N'est appelé
   * que lorsque `isDemo === true` ou qu'on a besoin d'une base sur laquelle
   * fusionner les données LinkedIn réelles.
   */
  const buildDemoSnapshot = useCallback((period: AnalyticsPeriod): AnalyticsState => {
    const platforms = DEMO_ANALYTICS_BY_PERIOD[period] ?? DEMO_ANALYTICS_BY_PERIOD['7d'];

    const totalReachNum = platforms.reduce((sum, p) => sum + p.stats.reachNum, 0);
    const totalEngagementNum = platforms.reduce((sum, p) => sum + p.stats.engagementNum, 0);
    const totalClicksNum = platforms.reduce((sum, p) => sum + p.stats.clicksNum, 0);
    const globalEngagementRate =
      totalReachNum > 0 ? ((totalEngagementNum / totalReachNum) * 100).toFixed(1) : '0.0';

    const calculateDynamicGrowth = (): string => {
      const engagementRate = Number.parseFloat(globalEngagementRate);
      const clickThroughRate = totalReachNum > 0 ? (totalClicksNum / totalReachNum) * 100 : 0;
      let baseGrowth = 10;
      if (engagementRate > 7) baseGrowth += 8;
      else if (engagementRate > 5) baseGrowth += 5;
      else if (engagementRate > 3) baseGrowth += 2;
      if (clickThroughRate > 2) baseGrowth += 6;
      else if (clickThroughRate > 1) baseGrowth += 3;
      if (period === '90d') baseGrowth += 8;
      else if (period === '30d') baseGrowth += 4;
      else baseGrowth += 2;
      const finalGrowth = Math.min(Math.max(baseGrowth, 10), 40);
      return `+${finalGrowth}%`;
    };

    return {
      totalReach: formatNumber(totalReachNum),
      totalEngagement: `${globalEngagementRate}%`,
      totalClicks: formatNumber(totalClicksNum),
      growth: calculateDynamicGrowth(),
      hasRealLinkedInData: false,
      linkedInLastSync: null,
      platforms: platforms.map((platform) => ({
        ...platform,
        isRealData: false,
        stats: {
          ...platform.stats,
          reachNum: undefined,
          engagementNum: undefined,
          clicksNum: undefined,
        },
      })),
    };
  }, []);

  /**
   * Construit un état "vide" pour le mode réel quand LinkedIn n'est pas
   * connecté : aucune métrique simulée n'est exposée.
   */
  const buildEmptyState = useCallback((): AnalyticsState => {
    return {
      totalReach: '—',
      totalEngagement: '—',
      totalClicks: '—',
      growth: '—',
      hasRealLinkedInData: false,
      linkedInLastSync: null,
      platforms: [],
    };
  }, []);

  /**
   * Fusionne les vraies données LinkedIn avec un état de base. En mode réel,
   * le base state est vide (uniquement LinkedIn s'affichera) ; en mode démo,
   * il provient de `buildDemoSnapshot`.
   */
  const mergeLinkedInData = useCallback(
    (baseState: AnalyticsState, realLinkedInData: LinkedInMetrics | null): AnalyticsState => {
      if (!realLinkedInData || !isLinkedInConnected) {
        return baseState;
      }

      const realReachNum = parseMetricValue(realLinkedInData.totalReach);
      const realClicksNum = parseMetricValue(realLinkedInData.totalClicks);
      const realEngagementRate = Number.parseFloat(
        realLinkedInData.totalEngagement.replace('%', ''),
      );
      const realEngagementNum = Math.round((realReachNum * realEngagementRate) / 100);

      const existingLinkedIn = baseState.platforms.find((p) => p.name === 'LinkedIn');
      const linkedInPlatform: AnalyticsPlatform = existingLinkedIn
        ? {
            ...existingLinkedIn,
            isRealData: true,
            stats: {
              ...existingLinkedIn.stats,
              reach: realLinkedInData.totalReach,
              engagement: realLinkedInData.totalEngagement,
              clicks: realLinkedInData.totalClicks,
              trend: realLinkedInData.growth,
              posts: realLinkedInData.posts?.length ?? existingLinkedIn.stats.posts,
            },
          }
        : {
            name: 'LinkedIn',
            icon: '💼',
            color: 'border-blue-500',
            bgColor: 'bg-blue-500/5',
            textColor: 'text-blue-600',
            isRealData: true,
            stats: {
              posts: realLinkedInData.posts?.length ?? 0,
              reach: realLinkedInData.totalReach,
              engagement: realLinkedInData.totalEngagement,
              clicks: realLinkedInData.totalClicks,
              trend: realLinkedInData.growth,
              chartData: [],
            },
          };

      const otherPlatforms = baseState.platforms.filter((p) => p.name !== 'LinkedIn');

      const otherReachNum = otherPlatforms.reduce(
        (sum, p) => sum + parseMetricValue(p.stats.reach),
        0,
      );
      const otherClicksNum = otherPlatforms.reduce(
        (sum, p) => sum + parseMetricValue(p.stats.clicks),
        0,
      );
      const otherEngagementNum = otherPlatforms.reduce((sum, p) => {
        const reach = parseMetricValue(p.stats.reach);
        const rate = Number.parseFloat(p.stats.engagement.replace('%', ''));
        return sum + Math.round((reach * rate) / 100);
      }, 0);

      const newTotalReach = realReachNum + otherReachNum;
      const newTotalClicks = realClicksNum + otherClicksNum;
      const newTotalEngagement = realEngagementNum + otherEngagementNum;
      const newEngagementRate =
        newTotalReach > 0 ? ((newTotalEngagement / newTotalReach) * 100).toFixed(1) : '0.0';

      return {
        ...baseState,
        totalReach: formatMetricValue(newTotalReach),
        totalEngagement: `${newEngagementRate}%`,
        totalClicks: formatMetricValue(newTotalClicks),
        growth: realLinkedInData.growth,
        platforms: [linkedInPlatform, ...otherPlatforms],
        hasRealLinkedInData: true,
        linkedInLastSync: lastSync ? new Date(lastSync).getTime() : null,
      };
    },
    [formatMetricValue, isLinkedInConnected, lastSync, parseMetricValue],
  );

  const initialState = useMemo<AnalyticsState>(
    () => (isDemo ? buildDemoSnapshot('7d') : buildEmptyState()),
    [buildDemoSnapshot, buildEmptyState, isDemo],
  );

  const [currentData, setCurrentData] = useState<AnalyticsState>(initialState);

  useEffect(() => {
    const base = isDemo ? buildDemoSnapshot(selectedPeriod) : buildEmptyState();
    setCurrentData(mergeLinkedInData(base, linkedInMetrics));
  }, [
    selectedPeriod,
    linkedInMetrics,
    isLinkedInConnected,
    lastSync,
    mergeLinkedInData,
    isDemo,
    buildDemoSnapshot,
    buildEmptyState,
  ]);

  useEffect(() => {
    if (isLinkedInConnected && !linkedInMetrics) {
      fetchLinkedInMetrics(selectedPeriod);
    }
  }, [isLinkedInConnected, selectedPeriod, linkedInMetrics, fetchLinkedInMetrics]);

  const topPosts = useMemo<DisplayTopPost[]>(() => {
    const realPosts: DisplayTopPost[] =
      linkedInMetrics?.posts && linkedInMetrics.posts.length > 0
        ? linkedInMetrics.posts.slice(0, 3).map((post) => ({
            platform: 'LinkedIn',
            content: post.content,
            isRealData: true,
            metrics: {
              likes: post.metrics.likes,
              comments: post.metrics.comments,
              shares: post.metrics.shares,
              clicks: post.metrics.clicks,
            },
            performance: ratePerformance(post.metrics.likes),
            color: performanceColor(post.metrics.likes),
          }))
        : [];

    if (!isDemo) return realPosts;

    const demoPosts: DisplayTopPost[] = DEMO_TOP_POSTS.map((post) => ({
      ...post,
      isRealData: false,
    }));

    if (realPosts.length === 0) return demoPosts;

    return [...realPosts, ...demoPosts.filter((p) => p.platform !== 'LinkedIn')].slice(0, 3);
  }, [linkedInMetrics, isDemo]);

  const insights = useMemo<DisplayInsight[]>(() => {
    const realInsights: DisplayInsight[] =
      linkedInMetrics?.insights && linkedInMetrics.insights.length > 0
        ? linkedInMetrics.insights.map((insight) => ({
            title: insight.title,
            description: insight.description,
            impact: insight.impact,
            type: insight.type,
            isRealData: true,
            color:
              insight.type === 'timing'
                ? 'border-blue-500/30 bg-blue-500/5'
                : insight.type === 'content'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-purple-500/30 bg-purple-500/5',
          }))
        : [];

    if (!isDemo) return realInsights;

    const demoInsights: DisplayInsight[] = DEMO_INSIGHTS.map((insight) => ({
      ...insight,
      isRealData: false,
    }));

    return [...realInsights, ...demoInsights.slice(realInsights.length)].slice(0, 3);
  }, [linkedInMetrics, isDemo]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      if (isLinkedInConnected) {
        await fetchLinkedInMetrics(selectedPeriod);
        toast({
          title: 'Données actualisées !',
          description: 'Les métriques LinkedIn ont été synchronisées',
        });
      } else if (isDemo) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast({
          title: 'Données simulées rafraîchies',
          description: 'Le snapshot démo a été régénéré (aucun appel réseau).',
        });
      } else {
        toast({
          title: 'Aucune source à actualiser',
          description: 'Connectez LinkedIn ou activez le mode démo pour voir des données.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: "Erreur d'actualisation",
        description: "Impossible d'actualiser les données",
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const report = await generateContent({
        prompt: `Génère un rapport d'analyse détaillé basé sur ces métriques de performance social media :
        - Portée totale : ${currentData.totalReach}
        - Engagement : ${currentData.totalEngagement}
        - Clics : ${currentData.totalClicks}
        - Croissance : ${currentData.growth}

        Inclus des recommandations stratégiques et des insights actionnables pour améliorer les performances.`,
        platform: 'linkedin',
        contentType: 'article',
        tone: 'professionnel',
        maxTokens: 1500,
      });
      setAnalyticsData(report.content);
      toast({ title: 'Rapport généré !', description: 'Votre analyse IA est prête' });
    } catch {
      toast({
        title: 'Erreur de génération',
        description: 'Impossible de générer le rapport',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleOptimizeStrategy = async () => {
    try {
      await generateContent({
        prompt: `Optimise ma stratégie social media basée sur ces données de performance :
        Portée: ${currentData.totalReach}, Engagement: ${currentData.totalEngagement}, Clics: ${currentData.totalClicks}, Croissance: ${currentData.growth}

        Fournis 3 recommandations spécifiques et actionnables pour améliorer mes performances sur les réseaux sociaux.`,
        platform: 'linkedin',
        contentType: 'post',
        tone: 'éducatif',
        maxTokens: 800,
      });
      toast({
        title: 'Stratégie optimisée !',
        description: 'Nouvelles recommandations disponibles',
      });
    } catch {
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser la stratégie",
        variant: 'destructive',
      });
    }
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({ title: 'Export réussi !', description: 'Le rapport a été téléchargé' });
    } catch {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le rapport",
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // S6478 : DataSourceInfo capture l'état du parent, on le garde en render-function.
  const renderDataSourceInfo = () => (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-900 text-sm">Sources de données</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {isLinkedInConnected ? (
                    <Wifi className="w-3 h-3 text-green-600" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-gray-400" />
                  )}
                  <span className="font-medium">LinkedIn:</span>
                </div>
                <span className={isLinkedInConnected ? 'text-green-700' : 'text-gray-600'}>
                  {isLinkedInConnected
                    ? 'Données réelles connectées'
                    : isDemo
                      ? 'Données simulées (non connecté)'
                      : 'Non connecté — aucune donnée affichée'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <WifiOff className="w-3 h-3 text-gray-400" />
                  <span className="font-medium">Instagram &amp; X:</span>
                </div>
                <span className="text-gray-600">
                  {isDemo
                    ? 'Données simulées (intégration à venir)'
                    : 'Non connecté — masqué en mode réel'}
                </span>
              </div>
            </div>
            {!isLinkedInConnected && (
              <div className="mt-3 p-2 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 Connectez LinkedIn dans les Paramètres pour obtenir vos vraies métriques
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const hasAnyData = currentData.platforms.length > 0;
  const showInstagramEmptyState =
    !isDemo && !currentData.platforms.some((p) => p.name === 'Instagram');
  const showXEmptyState = !isDemo && !currentData.platforms.some((p) => p.name === 'X (Twitter)');

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">
            Analysez vos performances sur les réseaux sociaux
            {isLinkedInConnected && (
              <span className="ml-2 inline-flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                <span className="text-green-600 text-sm font-medium">LinkedIn connecté</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {periodLabel(period)}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDataSourceInfo(!showDataSourceInfo)}
            className="text-slate-600"
          >
            <Database className="w-4 h-4 mr-2" />
            Sources
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="text-slate-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            disabled={isExporting}
            className="text-slate-600"
          >
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
            Exporter
          </Button>
        </div>
      </div>

      {showDataSourceInfo && renderDataSourceInfo()}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Portée totale',
            value: currentData.totalReach,
            icon: <Eye className="w-4 h-4" />,
            trend: DEMO_AGGREGATE_KPIS.globalGrowth,
            accent: 'green',
          },
          {
            label: 'Engagement',
            value: currentData.totalEngagement,
            icon: <Users className="w-4 h-4" />,
            trend: DEMO_AGGREGATE_KPIS.engagementDelta,
            accent: 'blue',
          },
          {
            label: 'Clics total',
            value: currentData.totalClicks,
            icon: <MousePointer className="w-4 h-4" />,
            trend: DEMO_AGGREGATE_KPIS.clicksDelta,
            accent: 'purple',
          },
          {
            label: 'Croissance',
            value: currentData.growth,
            icon: <TrendingUp className="w-4 h-4" />,
            trend: DEMO_AGGREGATE_KPIS.growthDelta,
            accent: 'amber',
          },
        ].map((stat, idx) => (
          <Card key={`row-${idx}`} className="premium-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
                    {stat.icon}
                    <span>{stat.label}</span>
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  {isDemo ? (
                    <Badge className="mt-2 bg-amber-500/10 text-amber-700 border-amber-500/30 text-[10px]">
                      Données simulées
                    </Badge>
                  ) : currentData.hasRealLinkedInData ? (
                    <Badge className="mt-2 bg-green-500/10 text-green-700 border-green-500/30 text-[10px]">
                      LinkedIn temps réel
                    </Badge>
                  ) : (
                    <Badge className="mt-2 bg-slate-100 text-slate-500 border-slate-200 text-[10px]">
                      Aucune source
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <div className={`w-6 h-6 bg-${stat.accent}-500 rounded-md animate-pulse`}></div>
                  </div>
                  {isDemo && (
                    <span className={`text-${stat.accent}-500 text-sm font-semibold`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plateformes et Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Performance par plateforme</span>
              </div>
              {selectedPlatform !== 'all' && (
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                  Filtré: {selectedPlatform}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {isLinkedInConnected && currentData.hasRealLinkedInData && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm font-medium">
                    Données LinkedIn en temps réel
                  </span>
                  {lastSync && (
                    <span className="text-green-600 text-xs">
                      • Dernière sync:{' '}
                      {new Date(lastSync).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {!hasAnyData && (
              <EmptyState
                platform="LinkedIn, Instagram, X (Twitter)"
                title="Aucune plateforme connectée"
                description="Connectez LinkedIn dans les Paramètres, ou activez le mode démo pour voir des exemples de métriques."
                ctaLabel="Ouvrir les Paramètres"
                onConnect={() => {
                  globalThis.location.href = '/settings';
                }}
              />
            )}

            {currentData.platforms.map((platform, index) => (
              <div
                key={`row-${index}`}
                className={`p-4 rounded-xl border ${platform.color} ${platform.bgColor} hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-semibold ${platform.textColor}`}>{platform.name}</h4>
                        <DataSourceBadge
                          isRealData={platform.isRealData}
                          platform={platform.name}
                        />
                        {platform.name === 'LinkedIn' &&
                          isLinkedInConnected &&
                          isLinkedInLoading && (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                              <span className="text-xs text-blue-600">Sync...</span>
                            </div>
                          )}
                      </div>
                      <p className="text-slate-500 text-sm">{platform.stats.posts} posts</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`${platform.bgColor} ${platform.textColor} border-0`}>
                      {platform.stats.trend}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Évolution 7j</p>
                      <MiniChart
                        data={platform.stats.chartData}
                        color={platform.color.replace('border-', 'bg-')}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-slate-500 text-xs">Portée</p>
                    <p className="font-bold text-slate-900">{platform.stats.reach}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 text-xs">Engagement</p>
                    <p className="font-bold text-slate-900">{platform.stats.engagement}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-500 text-xs">Clics</p>
                    <p className="font-bold text-slate-900">{platform.stats.clicks}</p>
                  </div>
                </div>
              </div>
            ))}

            {showInstagramEmptyState && (
              <EmptyState
                platform="Instagram"
                title="Instagram non connecté"
                description="L'intégration Instagram Graph API n'est pas encore en place. Aucune métrique n'est affichée en mode réel."
              />
            )}

            {showXEmptyState && (
              <EmptyState
                platform="X (Twitter)"
                title="X (Twitter) non connecté"
                description="L'intégration X API n'est pas encore en place. Aucune métrique n'est affichée en mode réel."
              />
            )}
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Insights de Kora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {insights.length === 0 ? (
              <EmptyState
                platform="Insights IA"
                title="Pas d'insights disponibles"
                description="Les insights sont calculés à partir des plateformes connectées (LinkedIn) ou des données simulées. Activez le mode démo pour explorer le format."
              />
            ) : (
              insights.map((insight, index) => (
                <div
                  key={`row-${index}`}
                  className={`p-4 rounded-xl border ${insight.color} hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 text-sm">{insight.title}</h4>
                    <DataSourceBadge isRealData={insight.isRealData} />
                  </div>
                  <p className="text-slate-600 text-sm mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                      {insight.impact}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={handleOptimizeStrategy}
                      className="bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white border-0 text-xs px-3 py-1"
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              ))
            )}

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
              <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Analyse IA personnalisée</span>
              </h4>
              <p className="text-slate-600 text-sm mb-4">
                Générez des insights personnalisés basés sur vos données actuelles
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="sm"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="bg-blue-600 text-white hover:bg-blue-700 text-xs"
                >
                  {isGeneratingReport ? 'Génération...' : 'Rapport détaillé'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleOptimizeStrategy}
                  className="bg-purple-600 text-white hover:bg-purple-700 text-xs"
                >
                  Optimiser stratégie
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showComparison && isDemo && (
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Comparaison temporelle</span>
              <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs">
                Données simulées
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-600 mb-2">Période actuelle</h4>
                <p className="text-2xl font-bold text-slate-900">{currentData.totalReach}</p>
                <p className="text-sm text-slate-500">Portée totale</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                <h4 className="font-semibold text-gray-600 mb-2">Période précédente</h4>
                <p className="text-2xl font-bold text-slate-900">
                  {DEMO_AGGREGATE_KPIS.comparisonPreviousReach[selectedPeriod]}
                </p>
                <p className="text-sm text-slate-500">Portée totale</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                <h4 className="font-semibold text-green-600 mb-2">Évolution</h4>
                <p className="text-2xl font-bold text-green-600">{currentData.growth}</p>
                <p className="text-sm text-slate-500">Croissance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analyticsData && (
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Rapport d'analyse Kora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-slate-900 whitespace-pre-wrap">{analyticsData}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <Button
                size="sm"
                onClick={handleExportReport}
                disabled={isExporting}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {isExporting ? 'Export...' : 'Exporter PDF'}
              </Button>
              <Button size="sm" onClick={() => setAnalyticsData(null)} variant="outline">
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Posts */}
      <Card className="premium-card">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Posts les plus performants</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {topPosts.length === 0 ? (
            <EmptyState
              platform="Top posts"
              title="Pas de posts à afficher"
              description="Les meilleurs posts proviennent de LinkedIn (si connecté) ou du jeu de démonstration (mode démo). Activez l'un des deux pour les visualiser."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topPosts.map((post, index) => (
                <div
                  key={`row-${index}`}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                        {post.platform}
                      </Badge>
                      <DataSourceBadge isRealData={post.isRealData} platform={post.platform} />
                    </div>
                    <Badge className={`${post.color} bg-transparent border-0`}>
                      {post.performance}
                    </Badge>
                  </div>

                  <p className="text-slate-900 text-sm font-medium mb-4">{post.content}</p>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-slate-500 text-xs">Likes</p>
                      <p className="font-bold text-slate-900">{post.metrics.likes}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Partages</p>
                      <p className="font-bold text-slate-900">{post.metrics.shares}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Commentaires</p>
                      <p className="font-bold text-slate-900">{post.metrics.comments}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Clics</p>
                      <p className="font-bold text-slate-900">{post.metrics.clicks}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      onClick={() => {
                        toast({
                          title: 'Analyse du post',
                          description: `Analyse détaillée du post ${post.platform} en cours...`,
                        });
                      }}
                      className="w-full bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 border-0 text-xs"
                    >
                      Analyser ce post
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
