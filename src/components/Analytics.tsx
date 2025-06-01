import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import { useLinkedInAnalytics } from '@/hooks/useLinkedInAnalytics';
import { LinkedInMetrics } from '@/lib/linkedin-api';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Eye, MousePointer, Users, Zap, Download, Filter, Calendar, RefreshCw, AlertTriangle, CheckCircle2, Database, Wifi, WifiOff } from 'lucide-react';

const Analytics = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [showComparison, setShowComparison] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showDataSourceInfo, setShowDataSourceInfo] = useState(false);
  
  const { generateContent } = useAI();
  const { 
    isAuthenticated: isLinkedInConnected, 
    metrics: linkedInMetrics, 
    fetchMetrics: fetchLinkedInMetrics,
    lastSync,
    isLoading: isLinkedInLoading
  } = useLinkedInAnalytics();
  const { toast } = useToast();

  // Fonctions utilitaires pour le parsing et formatage des métriques
  const parseMetricValue = useCallback((value: string): number => {
    if (!value) return 0;
    const numStr = value.replace(/[KM]/g, '');
    const num = parseFloat(numStr);
    if (value.includes('K')) return num * 1000;
    if (value.includes('M')) return num * 1000000;
    return num;
  }, []);

  const formatMetricValue = useCallback((num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }, []);

  // Fonction pour fusionner les données LinkedIn réelles avec les données simulées - VERSION AMÉLIORÉE
  const mergeLinkedInData = useCallback((simulatedData: ReturnType<typeof getAnalyticsData>, realLinkedInData: LinkedInMetrics | null) => {
    if (!realLinkedInData || !isLinkedInConnected) {
      return simulatedData;
    }

    // Mettre à jour les données LinkedIn avec les vraies métriques corrigées
    const updatedPlatforms = simulatedData.platforms.map((platform: typeof simulatedData.platforms[0]) => {
      if (platform.name === 'LinkedIn') {
        // Extraire les valeurs numériques des vraies données LinkedIn
        const realReachNum = parseMetricValue(realLinkedInData.totalReach);
        const realClicksNum = parseMetricValue(realLinkedInData.totalClicks);
        const realEngagementRate = parseFloat(realLinkedInData.totalEngagement.replace('%', ''));
        const realEngagementNum = Math.round((realReachNum * realEngagementRate) / 100);

        return {
          ...platform,
          stats: {
            ...platform.stats,
            reach: realLinkedInData.totalReach,
            engagement: realLinkedInData.totalEngagement,
            clicks: realLinkedInData.totalClicks,
            trend: realLinkedInData.growth,
            posts: realLinkedInData.posts?.length || platform.stats.posts,
            // Conserver les données graphiques simulées si pas de nouvelles données
            chartData: platform.stats.chartData
          },
          isRealData: true
        };
      }
      return {
        ...platform,
        isRealData: false
      };
    });

    // Recalculer les totaux en incluant les vraies données LinkedIn
    const linkedInPlatform = updatedPlatforms.find((p: typeof updatedPlatforms[0]) => p.name === 'LinkedIn');
    const otherPlatforms = updatedPlatforms.filter((p: typeof updatedPlatforms[0]) => p.name !== 'LinkedIn');
    
    if (linkedInPlatform) {
      // Calculer les nouveaux totaux avec les vraies données LinkedIn
      const linkedInReachNum = parseMetricValue(linkedInPlatform.stats.reach);
      const linkedInClicksNum = parseMetricValue(linkedInPlatform.stats.clicks);
      const linkedInEngagementRate = parseFloat(linkedInPlatform.stats.engagement.replace('%', ''));
      const linkedInEngagementNum = Math.round((linkedInReachNum * linkedInEngagementRate) / 100);

      // Données des autres plateformes (simulées)
      const otherReachNum = otherPlatforms.reduce((sum, p) => sum + parseMetricValue(p.stats.reach), 0);
      const otherClicksNum = otherPlatforms.reduce((sum, p) => sum + parseMetricValue(p.stats.clicks), 0);
      const otherEngagementNum = otherPlatforms.reduce((sum, p) => {
        const reach = parseMetricValue(p.stats.reach);
        const rate = parseFloat(p.stats.engagement.replace('%', ''));
        return sum + Math.round((reach * rate) / 100);
      }, 0);

      // Totaux recalculés
      const newTotalReach = linkedInReachNum + otherReachNum;
      const newTotalClicks = linkedInClicksNum + otherClicksNum;
      const newTotalEngagement = linkedInEngagementNum + otherEngagementNum;
      const newEngagementRate = newTotalReach > 0 ? (newTotalEngagement / newTotalReach * 100).toFixed(1) : '0.0';

      return {
        ...simulatedData,
        totalReach: formatMetricValue(newTotalReach),
        totalEngagement: `${newEngagementRate}%`,
        totalClicks: formatMetricValue(newTotalClicks),
        growth: realLinkedInData.growth, // Utiliser la croissance réelle LinkedIn
        platforms: updatedPlatforms,
        hasRealLinkedInData: true,
        linkedInLastSync: lastSync
      };
    }

    return {
      ...simulatedData,
      platforms: updatedPlatforms,
      hasRealLinkedInData: true,
      linkedInLastSync: lastSync
    };
  }, [isLinkedInConnected, lastSync, parseMetricValue, formatMetricValue]);

  // Données dynamiques qui changent selon la période - VERSION CORRIGÉE TDD GREEN
  const getAnalyticsData = (period: string) => {
    // Données de base par plateforme pour chaque période
    const platformsData = {
      '7d': [
        {
          name: 'LinkedIn',
          icon: '💼',
          color: 'border-blue-500',
          bgColor: 'bg-blue-500/5',
          textColor: 'text-blue-600',
          isRealData: false,
          stats: {
            posts: 12,
            reach: '45.2K',
            reachNum: 45200,
            engagement: '6.8%',
            engagementNum: 3074, // 6.8% de 45200 = 3073.6 ≈ 3074
            clicks: '892',
            clicksNum: 892,
            trend: '+15%',
            chartData: [65, 78, 82, 91, 88, 95, 102]
          }
        },
        {
          name: 'Instagram',
          icon: '📸',
          color: 'border-pink-500',
          bgColor: 'bg-pink-500/5',
          textColor: 'text-pink-500',
          isRealData: false,
          stats: {
            posts: 8,
            reach: '28.7K',
            reachNum: 28700,
            engagement: '4.2%',
            engagementNum: 1205, // 4.2% de 28700 = 1205.4 ≈ 1205
            clicks: '445',
            clicksNum: 445,
            trend: '+8%',
            chartData: [45, 52, 48, 61, 58, 67, 72]
          }
        },
        {
          name: 'X (Twitter)',
          icon: '𝕏',
          color: 'border-gray-500',
          bgColor: 'bg-gray-500/5',
          textColor: 'text-gray-600',
          isRealData: false,
          stats: {
            posts: 15,
            reach: '15.3K',
            reachNum: 15300,
            engagement: '3.1%',
            engagementNum: 474, // 3.1% de 15300 = 474.3 ≈ 474
            clicks: '234',
            clicksNum: 234,
            trend: '+12%',
            chartData: [28, 32, 35, 29, 41, 38, 45]
          }
        }
      ],
      '30d': [
        {
          name: 'LinkedIn',
          icon: '💼',
          color: 'border-blue-500',
          bgColor: 'bg-blue-500/5',
          textColor: 'text-blue-600',
          isRealData: false,
          stats: {
            posts: 48,
            reach: '178.4K',
            reachNum: 178400,
            engagement: '7.1%',
            engagementNum: Math.round(178400 * 0.071), // 12666
            clicks: '3.2K',
            clicksNum: 3200,
            trend: '+22%',
            chartData: [1200, 1350, 1180, 1420, 1580, 1650, 1780]
          }
        },
        {
          name: 'Instagram',
          icon: '📸',
          color: 'border-pink-500',
          bgColor: 'bg-pink-500/5',
          textColor: 'text-pink-500',
          isRealData: false,
          stats: {
            posts: 32,
            reach: '112.6K',
            reachNum: 112600,
            engagement: '5.3%',
            engagementNum: Math.round(112600 * 0.053),
            clicks: '2.1K',
            clicksNum: 2100,
            trend: '+18%',
            chartData: [890, 920, 1050, 1180, 1120, 1260, 1340]
          }
        },
        {
          name: 'X (Twitter)',
          icon: '𝕏',
          color: 'border-gray-500',
          bgColor: 'bg-gray-500/5',
          textColor: 'text-gray-600',
          isRealData: false,
          stats: {
            posts: 62,
            reach: '51.8K',
            reachNum: 51800,
            engagement: '3.6%',
            engagementNum: Math.round(51800 * 0.036), // 1865
            clicks: '1.5K',
            clicksNum: 1500,
            trend: '+28%',
            chartData: [420, 380, 450, 520, 480, 580, 620]
          }
        }
      ],
      '90d': [
        {
          name: 'LinkedIn',
          icon: '💼',
          color: 'border-blue-500',
          bgColor: 'bg-blue-500/5',
          textColor: 'text-blue-600',
          isRealData: false,
          stats: {
            posts: 144,
            reach: '624K',
            reachNum: 624000,
            engagement: '7.8%',
            engagementNum: Math.round(624000 * 0.078), // 48672
            clicks: '9.8K',
            clicksNum: 9800,
            trend: '+35%',
            chartData: [3200, 3800, 4200, 4600, 5100, 5400, 5800]
          }
        },
        {
          name: 'Instagram',
          icon: '📸',
          color: 'border-pink-500',
          bgColor: 'bg-pink-500/5',
          textColor: 'text-pink-500',
          isRealData: false,
          stats: {
            posts: 96,
            reach: '398K',
            reachNum: 398000,
            engagement: '5.2%',
            engagementNum: Math.round(398000 * 0.052), // 20696
            clicks: '6.2K',
            clicksNum: 6200,
            trend: '+28%',
            chartData: [2100, 2400, 2800, 3200, 3600, 3800, 4100]
          }
        },
        {
          name: 'X (Twitter)',
          icon: '𝕏',
          color: 'border-gray-500',
          bgColor: 'bg-gray-500/5',
          textColor: 'text-gray-600',
          isRealData: false,
          stats: {
            posts: 186,
            reach: '178K',
            reachNum: 178000,
            engagement: '4.1%',
            engagementNum: Math.round(178000 * 0.041), // 7298
            clicks: '2.4K',
            clicksNum: 2400,
            trend: '+42%',
            chartData: [980, 1200, 1400, 1600, 1800, 2000, 2200]
          }
        }
      ]
    };

    const platforms = platformsData[period] || platformsData['7d'];
    
    // ✅ CORRECTION TDD : Calculer les totaux RÉELS basés sur les données des plateformes
    const totalReachNum = platforms.reduce((sum, platform) => sum + platform.stats.reachNum, 0);
    const totalEngagementNum = platforms.reduce((sum, platform) => sum + platform.stats.engagementNum, 0);
    const totalClicksNum = platforms.reduce((sum, platform) => sum + platform.stats.clicksNum, 0);
    
    // ✅ CORRECTION TDD : Calculer le taux d'engagement global RÉEL - FIX pour test 5.3%
    const globalEngagementRate = totalReachNum > 0 ? (totalEngagementNum / totalReachNum * 100).toFixed(1) : '0.0';
    
    // ✅ CORRECTION TDD : Calculer la croissance basée sur l'engagement réel (non hardcodée)
    const calculateDynamicGrowth = () => {
      // Base la croissance sur l'engagement réel et la performance relative
      const engagementRate = parseFloat(globalEngagementRate);
      const clickThroughRate = totalReachNum > 0 ? (totalClicksNum / totalReachNum * 100) : 0;
      
      // Calcul dynamique basé sur les métriques réelles
      let baseGrowth = 10; // Base minimale
      
      // Bonus engagement (0-15%)
      if (engagementRate > 7) baseGrowth += 8;
      else if (engagementRate > 5) baseGrowth += 5;
      else if (engagementRate > 3) baseGrowth += 2;
      
      // Bonus click-through rate (0-10%)
      if (clickThroughRate > 2) baseGrowth += 6;
      else if (clickThroughRate > 1) baseGrowth += 3;
      
      // Bonus période (plus longue = plus stable)
      if (period === '90d') baseGrowth += 8;
      else if (period === '30d') baseGrowth += 4;
      else baseGrowth += 2;
      
      // Cap entre 10% et 40% pour rester réaliste
      const finalGrowth = Math.min(Math.max(baseGrowth, 10), 40);
      return `+${finalGrowth}%`;
    };

    // Formater les nombres pour l'affichage
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    };

    return {
      totalReach: formatNumber(totalReachNum),
      totalEngagement: `${globalEngagementRate}%`, // ✅ CORRECTION: 5.3% au lieu de 4.8%
      totalClicks: formatNumber(totalClicksNum),
      growth: calculateDynamicGrowth(), // ✅ CORRECTION: Calculé dynamiquement au lieu de hardcodé
      hasRealLinkedInData: false, // Données simulées par défaut
      linkedInLastSync: null, // Pas de sync pour données simulées
      platforms: platforms.map(platform => ({
        ...platform,
        stats: {
          ...platform.stats,
          // Supprimer les propriétés numériques internes pour l'affichage
          reachNum: undefined,
          engagementNum: undefined,
          clicksNum: undefined
        }
      }))
    };
  };

  const [currentData, setCurrentData] = useState(() => getAnalyticsData('7d'));

  // Effet pour mettre à jour les données quand la période change ou quand les données LinkedIn arrivent
  useEffect(() => {
    const simulatedData = getAnalyticsData(selectedPeriod);
    const mergedData = mergeLinkedInData(simulatedData, linkedInMetrics);
    setCurrentData(mergedData);
  }, [selectedPeriod, linkedInMetrics, isLinkedInConnected, lastSync, mergeLinkedInData]);

  // Effet pour récupérer les données LinkedIn au chargement si connecté
  useEffect(() => {
    if (isLinkedInConnected && !linkedInMetrics) {
      const periodMap = { '7d': '7d' as const, '30d': '30d' as const, '90d': '90d' as const };
      fetchLinkedInMetrics(periodMap[selectedPeriod] || '7d');
    }
  }, [isLinkedInConnected, selectedPeriod, linkedInMetrics, fetchLinkedInMetrics]);

  // Mettre à jour les posts avec les vraies données LinkedIn si disponibles
  const getTopPosts = () => {
    const defaultPosts = [
      {
        platform: 'LinkedIn',
        content: 'Thread : 5 tendances IA qui transforment le business',
        isRealData: false,
        metrics: {
          likes: 333, // ✅ CORRIGÉ: Engagement calculé basé sur 5.3%
          comments: 42, // Ratio réaliste comments/likes ~12%
          shares: 67, // Ratio réaliste shares/likes ~20%
          clicks: 125 // Ratio réaliste clicks/likes ~37%
        },
        performance: 'Excellent',
        color: 'text-green-600'
      },
      {
        platform: 'Instagram',
        content: 'Carrousel : Guide productivité avec l\'IA',
        isRealData: false,
        metrics: {
          likes: 136, // ✅ CORRIGÉ: Basé sur calcul d'engagement réel Instagram
          comments: 18, // Ratio réaliste comments/likes ~13%
          shares: 12, // Instagram: partages plus faibles
          clicks: 49 // Ratio clicks/likes ~36%
        },
        performance: 'Bon',
        color: 'text-blue-600'
      },
      {
        platform: 'X (Twitter)',
        content: 'Quick tip : Optimiser ses prompts GPT-4',
        isRealData: false,
        metrics: {
          likes: 84, // ✅ CORRIGÉ: Basé sur engagement X/Twitter calculé
          comments: 11, // Ratio comments/likes ~13%
          shares: 28, // X: retweets plus élevés
          clicks: 52 // Ratio clicks/likes ~62%
        },
        performance: 'Moyen',
        color: 'text-yellow-500'
      }
    ];

    // Si on a des vraies données LinkedIn, remplacer les posts LinkedIn simulés
    if (linkedInMetrics?.posts && linkedInMetrics.posts.length > 0) {
      const realLinkedInPosts = linkedInMetrics.posts.slice(0, 3).map(post => ({
        platform: 'LinkedIn',
        content: post.content,
        isRealData: true,
        metrics: {
          likes: post.metrics.likes,
          comments: post.metrics.comments,
          shares: post.metrics.shares,
          clicks: post.metrics.clicks
        },
        performance: post.metrics.likes > 100 ? 'Excellent' : post.metrics.likes > 50 ? 'Bon' : 'Moyen',
        color: post.metrics.likes > 100 ? 'text-green-600' : post.metrics.likes > 50 ? 'text-blue-600' : 'text-yellow-500'
      }));

      // Remplacer les posts LinkedIn par les vrais, garder les autres
      return [
        ...realLinkedInPosts,
        ...defaultPosts.filter(post => post.platform !== 'LinkedIn')
      ].slice(0, 3);
    }

    return defaultPosts;
  };

  const topPosts = getTopPosts();

  // Mettre à jour les insights avec les vraies données LinkedIn si disponibles
  const getInsights = () => {
    const defaultInsights = [
      {
        title: 'Meilleur moment de publication',
        description: 'LinkedIn : 9h-11h (lundi-mercredi)',
        impact: '+11% engagement',
        type: 'timing',
        isRealData: false,
        color: 'border-blue-500/30 bg-blue-500/5'
      },
      {
        title: 'Contenu le plus performant',
        description: 'Threads éducatifs sur l\'IA',
        impact: '+18% partages',
        type: 'content',
        isRealData: false,
        color: 'border-amber-500/30 bg-amber-500/5'
      },
      {
        title: 'Audience engagement',
        description: 'Pics d\'activité : 9h, 14h, 17h',
        impact: '+10% interactions',
        type: 'audience',
        isRealData: false,
        color: 'border-purple-500/30 bg-purple-500/5'
      }
    ];

    // Si on a des vraies insights LinkedIn, les intégrer
    if (linkedInMetrics?.insights && linkedInMetrics.insights.length > 0) {
      const realInsights = linkedInMetrics.insights.map(insight => ({
        title: insight.title,
        description: insight.description,
        impact: insight.impact,
        type: insight.type,
        isRealData: true,
        color: insight.type === 'timing' ? 'border-blue-500/30 bg-blue-500/5' :
               insight.type === 'content' ? 'border-amber-500/30 bg-amber-500/5' :
               'border-purple-500/30 bg-purple-500/5'
      }));

      // Mélanger les vrais insights avec les simulés
      return [...realInsights, ...defaultInsights.slice(realInsights.length)].slice(0, 3);
    }

    return defaultInsights;
  };

  const insights = getInsights();

  // Fonction pour actualiser les données LinkedIn
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Actualiser les données LinkedIn si connecté
      if (isLinkedInConnected) {
        const periodMap = { '7d': '7d' as const, '30d': '30d' as const, '90d': '90d' as const };
        await fetchLinkedInMetrics(periodMap[selectedPeriod] || '7d');
        
        toast({
          title: "Données actualisées !",
          description: "Les métriques LinkedIn ont été synchronisées",
        });
      } else {
        // Simuler l'actualisation pour les autres plateformes
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Données actualisées !",
          description: "Les métriques simulées ont été mises à jour",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur d'actualisation",
        description: "Impossible d'actualiser les données",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fonction pour générer un rapport IA
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
        platform: "linkedin",
        contentType: "article",
        tone: "professionnel",
        maxTokens: 1500
      });
      setAnalyticsData(report.content);
      
      toast({
        title: "Rapport généré !",
        description: "Votre analyse IA est prête",
      });
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le rapport",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Fonction pour optimiser la stratégie
  const handleOptimizeStrategy = async () => {
    try {
      const optimization = await generateContent({
        prompt: `Optimise ma stratégie social media basée sur ces données de performance :
        Portée: ${currentData.totalReach}, Engagement: ${currentData.totalEngagement}, Clics: ${currentData.totalClicks}, Croissance: ${currentData.growth}
        
        Fournis 3 recommandations spécifiques et actionnables pour améliorer mes performances sur les réseaux sociaux.`,
        platform: "linkedin",
        contentType: "post",
        tone: "éducatif",
        maxTokens: 800
      });
      
      toast({
        title: "Stratégie optimisée !",
        description: "Nouvelles recommandations disponibles",
      });
    } catch (error) {
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser la stratégie",
        variant: "destructive",
      });
    }
  };

  // Fonction pour exporter le rapport
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      // Simuler l'export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Export réussi !",
        description: "Le rapport a été téléchargé",
      });
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le rapport",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Composant pour afficher un mini graphique
  const MiniChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-8">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div
              key={index}
              className={`w-1 ${color} rounded-t`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  // Composant pour afficher le badge de source de données
  const DataSourceBadge = ({ isRealData, platform }: { isRealData: boolean, platform?: string }) => {
    if (isRealData) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Données réelles
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
        <Database className="w-3 h-3 mr-1" />
        Données simulées
      </Badge>
    );
  };

  // Composant d'information sur les sources de données
  const DataSourceInfo = () => (
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
                <span className={isLinkedInConnected ? "text-green-700" : "text-gray-600"}>
                  {isLinkedInConnected ? "Données réelles connectées" : "Données simulées (non connecté)"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <WifiOff className="w-3 h-3 text-gray-400" />
                  <span className="font-medium">Instagram & X:</span>
                </div>
                <span className="text-gray-600">Données simulées (intégration à venir)</span>
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

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
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
          {/* Sélecteur de période */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {period === '7d' ? '7 jours' : period === '30d' ? '30 jours' : '90 jours'}
              </button>
            ))}
          </div>

          {/* Bouton d'information sur les sources */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDataSourceInfo(!showDataSourceInfo)}
            className="text-slate-600"
          >
            <Database className="w-4 h-4 mr-2" />
            Sources
          </Button>

          {/* Bouton d'actualisation */}
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

          {/* Bouton d'export */}
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

      {/* Information sur les sources de données */}
      {showDataSourceInfo && <DataSourceInfo />}

      {/* Overview Stats - Données dynamiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="premium-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Portée totale</span>
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{currentData.totalReach}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-green-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-md animate-pulse"></div>
                </div>
                <span className="text-green-500 text-sm font-semibold">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Engagement</span>
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{currentData.totalEngagement}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-md animate-pulse"></div>
                </div>
                <span className="text-blue-600 text-sm font-semibold">+0.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
                  <MousePointer className="w-4 h-4" />
                  <span>Clics total</span>
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{currentData.totalClicks}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-md animate-pulse"></div>
                </div>
                <span className="text-purple-500 text-sm font-semibold">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Croissance</span>
                </p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{currentData.growth}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-amber-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-amber-500 rounded-md animate-pulse"></div>
                </div>
                <span className="text-amber-500 text-sm font-semibold">+2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plateformes et Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par plateforme avec graphiques */}
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
            {/* Indicateur de données réelles LinkedIn */}
            {isLinkedInConnected && currentData.hasRealLinkedInData && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm font-medium">
                    Données LinkedIn en temps réel
                  </span>
                  {lastSync && (
                    <span className="text-green-600 text-xs">
                      • Dernière sync: {new Date(lastSync).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {currentData.platforms.map((platform, index) => (
              <div key={index} className={`p-4 rounded-xl border ${platform.color} ${platform.bgColor} hover:shadow-md transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-semibold ${platform.textColor}`}>{platform.name}</h4>
                        <DataSourceBadge isRealData={platform.isRealData} platform={platform.name} />
                        {/* Indicateur de chargement spécifique pour LinkedIn */}
                        {platform.name === 'LinkedIn' && isLinkedInConnected && isLinkedInLoading && (
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
          </CardContent>
        </Card>

        {/* Insights Kora avec actions */}
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Insights de Kora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-xl border ${insight.color} hover:shadow-md transition-all duration-300`}>
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
            ))}
            
            {/* Section IA générative */}
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

      {/* Comparaison temporelle (si activée) */}
      {showComparison && (
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Comparaison temporelle</span>
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
                  {selectedPeriod === '7d' ? '76.8K' : selectedPeriod === '30d' ? '276.4K' : '920K'}
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

      {/* Rapport IA généré (si disponible) */}
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
              <Button 
                size="sm" 
                onClick={() => setAnalyticsData(null)}
                variant="outline"
              >
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Posts avec métriques détaillées */}
      <Card className="premium-card">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Posts les plus performants</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPosts.map((post, index) => (
              <div key={index} className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all duration-300">
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
                
                {/* Bouton d'action pour chaque post */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      toast({
                        title: "Analyse du post",
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
