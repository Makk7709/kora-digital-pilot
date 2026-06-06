import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tv, Monitor } from 'lucide-react';

import LinkedInWidget from '@/components/LinkedInWidget';
import EmptyState from '@/components/EmptyState';
import { useHybridAI } from '@/hooks/useHybridAI';
import { useDataMode } from '@/contexts/DataModeContext';
import {
  DEMO_AGGREGATE_KPIS,
  DEMO_DASHBOARD_PLATFORMS,
  type DemoDashboardPlatform,
} from '@/lib/demo-data';

interface DashboardProps {
  onSectionChange?: (section: string) => void;
}

interface RecentDemoPost {
  platform: 'LinkedIn' | 'Instagram' | 'X (Twitter)';
  content: string;
  engagement: string;
  time: string;
}

interface SmartSuggestion {
  title: string;
  description: string;
  impact: string;
  category: 'timing' | 'content' | 'visual';
}

const formatEngagementLabel = (
  engagement: number,
  platform: RecentDemoPost['platform'],
): string => {
  switch (platform) {
    case 'LinkedIn':
      return `${engagement} interactions`;
    case 'Instagram':
      return `${engagement} likes`;
    case 'X (Twitter)':
      return `${Math.round(engagement * 0.3)} retweets`;
    default:
      return `${engagement} interactions`;
  }
};

const formatTimeAgo = (hours: number): string => {
  if (hours === 1) return 'Il y a 1h';
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
};

const calculateDashboardMetrics = (platforms: readonly DemoDashboardPlatform[]) => {
  const totalReach = platforms.reduce((sum, p) => sum + p.reach, 0);
  const totalEngagement = platforms.reduce((sum, p) => sum + p.reach * p.engagement, 0);
  const totalClicks = platforms.reduce((sum, p) => sum + p.clicks, 0);
  const globalEngagementRate =
    totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(1) : '0.0';

  return {
    totalReach: `${(totalReach / 1000).toFixed(1)}K`,
    globalEngagement: `${globalEngagementRate}%`,
    totalClicks: `${(totalClicks / 1000).toFixed(1)}K`,
  };
};

const generateRecentPosts = (platforms: readonly DemoDashboardPlatform[]): RecentDemoPost[] => {
  const postsData: Array<{
    platform: RecentDemoPost['platform'];
    content: string;
    variance: number;
  }> = [
    {
      platform: 'LinkedIn',
      content: "Retour d'expérience : 3 mois d'automation marketing avec l'IA",
      variance: 1.3,
    },
    {
      platform: 'Instagram',
      content: 'Behind the scenes : Comment notre équipe utilise Notion + IA',
      variance: 0.9,
    },
    {
      platform: 'X (Twitter)',
      content: 'Thread: Les 7 erreurs à éviter en prompt engineering',
      variance: 1.1,
    },
  ];

  const timeOffsets = [
    Math.floor(Math.random() * 3) + 1,
    Math.floor(Math.random() * 4) + 3,
    Math.floor(Math.random() * 5) + 6,
  ].sort();

  return postsData
    .map((postInfo, index): RecentDemoPost | null => {
      const platformData = platforms.find((p) => p.name === postInfo.platform);
      if (!platformData) return null;

      const baseEngagement = Math.round(
        (platformData.reach * platformData.engagement) / platformData.posts,
      );
      const realEngagement = Math.round(baseEngagement * postInfo.variance);

      return {
        platform: postInfo.platform,
        content: postInfo.content,
        engagement: formatEngagementLabel(realEngagement, postInfo.platform),
        time: formatTimeAgo(timeOffsets[index]),
      };
    })
    .filter((post): post is RecentDemoPost => post !== null);
};

const generateSmartSuggestions = (
  platforms: readonly DemoDashboardPlatform[],
  globalEngagement: string,
): SmartSuggestion[] => {
  const suggestions: SmartSuggestion[] = [];
  const linkedIn = platforms.find((p) => p.name === 'LinkedIn');

  if (linkedIn) {
    const linkedInEngagement = (linkedIn.engagement * 100).toFixed(1);
    const linkedInEngagementNum = Number.parseFloat(linkedInEngagement);
    const potentialImprovement =
      linkedInEngagementNum > 6 ? Math.round((linkedInEngagementNum - 6) * 2 + 8) : 15;

    suggestions.push({
      title: 'Optimisation horaire LinkedIn',
      description: `Vos posts LinkedIn (${linkedInEngagement}% engagement) performent mieux entre 9h-11h`,
      impact: `+${potentialImprovement}%`,
      category: 'timing',
    });
  }

  const bestPlatform = platforms.reduce((best, current) =>
    current.engagement > best.engagement ? current : best,
  );
  const improvement = Math.round(
    (bestPlatform.engagement - Math.min(...platforms.map((p) => p.engagement))) * 100 * 3,
  );
  suggestions.push({
    title: 'Stratégie cross-platform',
    description: `${bestPlatform.name} performe mieux (${(bestPlatform.engagement * 100).toFixed(1)}%). Adapter cette approche aux autres`,
    impact: `+${improvement}%`,
    category: 'content',
  });

  const globalRate = Number.parseFloat(globalEngagement.replace('%', ''));
  const visualImprovement = globalRate < 5 ? 25 : globalRate < 7 ? 18 : 12;
  suggestions.push({
    title: 'Amélioration visuelle',
    description: `Engagement global à ${globalEngagement}. Carrousels + visuels personnalisés recommandés`,
    impact: `+${visualImprovement}%`,
    category: 'visual',
  });

  return suggestions;
};

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const [isTvMode, setIsTvMode] = useState(false);
  useHybridAI();
  const { isDemo } = useDataMode();

  const platforms = DEMO_DASHBOARD_PLATFORMS;
  const metrics = calculateDashboardMetrics(platforms);
  const recentPosts = generateRecentPosts(platforms);
  const smartSuggestions = generateSmartSuggestions(platforms, metrics.globalEngagement);

  const stats = isDemo
    ? [
        {
          label: 'Posts cette semaine',
          value: String(DEMO_AGGREGATE_KPIS.postsThisWeek),
          trend: '+8%',
          color: 'text-blue-600',
        },
        {
          label: 'Engagement moyen',
          value: metrics.globalEngagement,
          trend: DEMO_AGGREGATE_KPIS.engagementDelta,
          color: 'text-emerald-600',
        },
        {
          label: 'Portée totale',
          value: metrics.totalReach,
          trend: DEMO_AGGREGATE_KPIS.globalGrowth,
          color: 'text-purple-600',
        },
        {
          label: 'Clics générés',
          value: metrics.totalClicks,
          trend: DEMO_AGGREGATE_KPIS.clicksDelta,
          color: 'text-amber-600',
        },
      ]
    : [
        {
          label: 'Posts cette semaine',
          value: '—',
          trend: 'Source non connectée',
          color: 'text-slate-500',
        },
        {
          label: 'Engagement moyen',
          value: '—',
          trend: 'Source non connectée',
          color: 'text-slate-500',
        },
        {
          label: 'Portée totale',
          value: '—',
          trend: 'Source non connectée',
          color: 'text-slate-500',
        },
        {
          label: 'Clics générés',
          value: '—',
          trend: 'Source non connectée',
          color: 'text-slate-500',
        },
      ];

  const handleGenerateWithKora = () => {
    onSectionChange?.('inspiration');
  };

  const handlePlanWeek = () => {
    onSectionChange?.('planning');
  };

  const handleAnalyzePerformance = () => {
    onSectionChange?.('analytics');
  };

  const handleConnectSource = () => {
    onSectionChange?.('analytics');
  };

  const toggleTvMode = () => {
    setIsTvMode(!isTvMode);
    if (!isTvMode) {
      document.body.classList.add('tv-presentation-mode');
    } else {
      document.body.classList.remove('tv-presentation-mode');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord 👋</h2>
          <p className="text-slate-600">
            {isDemo
              ? 'Voici un aperçu de vos performances cette semaine'
              : 'Connectez vos sources pour afficher vos performances réelles'}
          </p>
        </div>
        <Button
          onClick={handleGenerateWithKora}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
        >
          ✨ Nouveau post avec Kora
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="premium-card overflow-hidden relative">
            <div className="absolute inset-0 digital-wave-pattern opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  {isDemo && (
                    <Badge className="mt-2 bg-amber-500/10 text-amber-700 border-amber-500/30 text-[10px]">
                      Données simulées
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-md animate-wave"></div>
                  </div>
                  <span className={`text-sm font-semibold ${stat.color}`}>{stat.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        {isDemo ? (
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <span>Publications récentes</span>
                <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs">
                  Données simulées
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {recentPosts.map((post, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 text-sm font-semibold px-3 py-1 bg-blue-100 rounded-full">
                      {post.platform}
                    </span>
                    <span className="text-slate-500 text-xs">{post.time}</span>
                  </div>
                  <p className="text-slate-900 text-sm mb-3 font-medium">{post.content}</p>
                  <p className="text-slate-500 text-xs">{post.engagement}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            platform="Instagram / X (Twitter)"
            title="Publications récentes non disponibles"
            description="Instagram et X (Twitter) ne sont pas encore branchés sur une source réelle. Connectez les APIs ou activez le mode démo pour visualiser un aperçu."
            ctaLabel="Voir Analytics"
            onConnect={handleConnectSource}
          />
        )}

        {/* LinkedIn Analytics Widget - real data via OAuth */}
        <LinkedInWidget />

        {/* AI Suggestions */}
        {isDemo ? (
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <span>Suggestions de Kora</span>
                <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30 text-xs">
                  Basé sur données simulées
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {smartSuggestions.map((suggestion, index) => {
                const colors = {
                  timing: {
                    border: 'border-blue-200',
                    bg: 'bg-blue-50',
                    text: 'text-blue-600',
                    buttonBg: 'bg-blue-100',
                    buttonText: 'text-blue-600',
                    buttonHover: 'hover:bg-blue-600 hover:text-white',
                  },
                  content: {
                    border: 'border-emerald-200',
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-600',
                    buttonBg: 'bg-emerald-100',
                    buttonText: 'text-emerald-600',
                    buttonHover: 'hover:bg-emerald-600 hover:text-white',
                  },
                  visual: {
                    border: 'border-purple-200',
                    bg: 'bg-purple-50',
                    text: 'text-purple-600',
                    buttonBg: 'bg-purple-100',
                    buttonText: 'text-purple-600',
                    buttonHover: 'hover:bg-purple-600 hover:text-white',
                  },
                };

                const color = colors[suggestion.category] || colors.content;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${color.border} ${color.bg} transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`${color.text} font-semibold text-sm`}>{suggestion.title}</h4>
                    </div>
                    <p className="text-slate-900 text-sm mb-3">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500/10 text-amber-700 border-amber-500/30">
                        {suggestion.impact}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={
                          suggestion.category === 'timing' ? handlePlanWeek : handleGenerateWithKora
                        }
                        className={`${color.buttonBg} ${color.buttonText} ${color.buttonHover} border-0`}
                      >
                        {suggestion.category === 'timing' ? 'Planifier' : 'Appliquer'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            platform="Suggestions IA cross-plateforme"
            title="Suggestions indisponibles sans sources connectées"
            description="Les suggestions Kora s'appuient sur vos performances réelles. Connectez Instagram et X (Twitter), ou activez le mode démo pour explorer le format."
            ctaLabel="Configurer les sources"
            onConnect={handleConnectSource}
          />
        )}
      </div>

      {/* Quick Actions */}
      <Card className="premium-card">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button
              onClick={handleGenerateWithKora}
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 text-slate-900 hover:text-blue-600 transition-all duration-300"
            >
              <span className="text-3xl">✨</span>
              <span className="font-semibold">Inspiration Kora</span>
            </Button>
            <Button
              onClick={handlePlanWeek}
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 text-slate-900 hover:text-emerald-600 transition-all duration-300"
            >
              <span className="text-3xl">📅</span>
              <span className="font-semibold">Planifier la semaine</span>
            </Button>
            <Button
              onClick={handleAnalyzePerformance}
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 text-slate-900 hover:text-purple-600 transition-all duration-300"
            >
              <span className="text-3xl">📊</span>
              <span className="font-semibold">Analyser les performances</span>
            </Button>
            <Button
              onClick={toggleTvMode}
              className={`h-24 flex flex-col items-center justify-center space-y-3 transition-all duration-300 ${
                isTvMode
                  ? 'bg-gradient-to-br from-orange-50 to-white border border-orange-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 text-orange-600'
                  : 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-500/20 text-slate-900 hover:text-slate-600'
              }`}
            >
              {isTvMode ? <Tv className="w-8 h-8" /> : <Monitor className="w-8 h-8" />}
              <span className="font-semibold text-sm text-center">
                {isTvMode ? 'Mode TV Activé' : 'Mode TV'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
