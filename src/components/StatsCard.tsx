import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkedInStats } from '@/hooks/useLinkedInStats';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  WifiOff,
  Clock,
  Zap,
} from 'lucide-react';

interface StatsCardProps {
  period?: '7d' | '30d' | '90d';
  autoRefresh?: boolean;
  refreshInterval?: number;
  showPosts?: boolean;
  className?: string;
}

type ConnectionStatus = 'connected' | 'disconnected' | 'error' | string;

// S3358 : helper extrait pour éviter le ternaire imbriqué de label de période.
const formatPeriodLabel = (period: '7d' | '30d' | '90d'): string => {
  if (period === '7d') return '7 jours';
  if (period === '30d') return '30 jours';
  return '90 jours';
};

const formatLastUpdate = (date: Date | null): string => {
  if (!date) return 'Jamais';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={`row-${i}`} className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-8 bg-slate-200 rounded"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
    <div className="h-32 bg-slate-200 rounded"></div>
  </div>
);

const STATUS_CONFIGS = {
  connected: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    text: 'Connecté',
  },
  disconnected: {
    icon: WifiOff,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    text: 'Déconnecté',
    description: 'Données simulées',
  },
  error: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    text: 'Erreur',
    description: 'Problème de connexion',
  },
  unknown: {
    icon: Wifi,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    text: 'Vérification...',
    description: 'Test de connexion',
  },
} as const;

const StatusIndicator: React.FC<{
  connectionStatus: ConnectionStatus;
  cacheInfo: { isFromCache: boolean; cacheAge?: number };
}> = ({ connectionStatus, cacheInfo }) => {
  const baseKey = (['connected', 'disconnected', 'error'] as const).includes(
    connectionStatus as 'connected',
  )
    ? (connectionStatus as 'connected' | 'disconnected' | 'error')
    : 'unknown';
  const base = STATUS_CONFIGS[baseKey];
  const description =
    baseKey === 'connected'
      ? cacheInfo.isFromCache
        ? `Cache (${cacheInfo.cacheAge}min)`
        : 'Données en temps réel'
      : ((base as { description?: string }).description ?? '');
  const Icon = base.icon;
  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${base.bgColor} ${base.borderColor}`}
    >
      <Icon className={`w-4 h-4 ${base.color}`} />
      <div>
        <span className={`text-sm font-medium ${base.color}`}>{base.text}</span>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {cacheInfo.isFromCache && (
        <Badge variant="secondary" className="text-xs">
          Cache
        </Badge>
      )}
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, trend, isPositive, icon: Icon, color }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-medium text-slate-600">{title}</span>
    </div>
    <div className="space-y-1">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="flex items-center space-x-1">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-green-500" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-500" />
        )}
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  </div>
);

const StatsCard: React.FC<StatsCardProps> = ({
  period = '7d',
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
  showPosts = true,
  className = '',
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [showDetails, setShowDetails] = useState(false);
  const [previousMetrics, setPreviousMetrics] = useState<any>(null);

  const {
    metrics,
    isLoading,
    isRefreshing,
    error,
    lastUpdate,
    refreshStats,
    clearError,
    clearCache,
    formattedMetrics,
    topPosts,
    connectionStatus,
    cacheInfo,
  } = useLinkedInStats(autoRefresh, refreshInterval);

  const { toast } = useToast();

  // Gestion du changement de période
  const handlePeriodChange = async (newPeriod: '7d' | '30d' | '90d') => {
    setSelectedPeriod(newPeriod);
    await refreshStats(newPeriod);
  };

  // Gestion du rafraîchissement manuel
  const handleRefresh = async () => {
    try {
      await refreshStats(selectedPeriod);
      toast({
        title: 'Données mises à jour',
        description: 'Les statistiques LinkedIn ont été actualisées',
      });
    } catch (_error) {
      toast({
        title: 'Erreur de mise à jour',
        description: 'Impossible de récupérer les dernières données',
        variant: 'destructive',
      });
    }
  };

  // Gestion des erreurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Erreur LinkedIn',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Détecter les changements significatifs
  useEffect(() => {
    if (metrics && previousMetrics && formattedMetrics) {
      const currentReach = Number.parseInt(formattedMetrics.reach.value.replace(/[^\d]/g, ''));
      const previousReach = Number.parseInt(
        previousMetrics.reach?.value?.replace(/[^\d]/g, '') || '0',
      );

      const reachIncrease = ((currentReach - previousReach) / previousReach) * 100;

      if (reachIncrease > 20) {
        toast({
          title: '🚀 Forte croissance détectée !',
          description: `Votre portée a augmenté de ${reachIncrease.toFixed(0)}%`,
          duration: 5000,
        });
      }
    }

    if (metrics) {
      setPreviousMetrics(formattedMetrics);
    }
  }, [metrics, formattedMetrics, toast]);

  return (
    <Card className={`premium-card ${className}`}>
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💼</span>
            </div>
            <span>Statistiques LinkedIn</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              variant="outline"
              size="sm"
              className="border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Mise à jour...' : 'Actualiser'}
            </Button>

            {cacheInfo.isFromCache && (
              <Button
                onClick={clearCache}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700"
              >
                Vider cache
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <StatusIndicator connectionStatus={connectionStatus} cacheInfo={cacheInfo} />

          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Dernière MAJ : {formatLastUpdate(lastUpdate)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Sélecteur de période */}
        <div className="flex space-x-2 mb-6">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <Button
              key={p}
              onClick={() => handlePeriodChange(p)}
              variant={selectedPeriod === p ? 'default' : 'outline'}
              size="sm"
              disabled={isLoading}
              className={selectedPeriod === p ? 'bg-blue-600 text-white' : ''}
            >
              {formatPeriodLabel(p)}
            </Button>
          ))}
        </div>

        {/* Contenu principal */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Erreur de chargement</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={clearError} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : formattedMetrics ? (
          <div className="space-y-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-3 gap-6">
              <MetricCard
                title="Portée"
                value={formattedMetrics.reach.value}
                trend={formattedMetrics.reach.trend}
                isPositive={formattedMetrics.reach.isPositive}
                icon={Eye}
                color="text-blue-600"
              />
              <MetricCard
                title="Engagement"
                value={formattedMetrics.engagement.value}
                trend={formattedMetrics.engagement.trend}
                isPositive={formattedMetrics.engagement.isPositive}
                icon={Users}
                color="text-green-600"
              />
              <MetricCard
                title="Clics"
                value={formattedMetrics.clicks.value}
                trend={formattedMetrics.clicks.trend}
                isPositive={formattedMetrics.clicks.isPositive}
                icon={MousePointer}
                color="text-purple-600"
              />
            </div>

            {/* Croissance globale */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Croissance globale</h4>
                    <p className="text-sm text-slate-600">Performance sur {selectedPeriod}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formattedMetrics.growth.value}
                  </div>
                  <div className="flex items-center space-x-1">
                    {formattedMetrics.growth.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-slate-600">vs période précédente</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts les plus performants */}
            {showPosts && topPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Posts les plus performants</h4>
                  <Button onClick={() => setShowDetails(!showDetails)} variant="ghost" size="sm">
                    {showDetails ? 'Masquer' : 'Voir détails'}
                  </Button>
                </div>

                {showDetails && (
                  <div className="space-y-3">
                    {topPosts.slice(0, 3).map((post, index) => (
                      <div key={post.id} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 line-clamp-2">{post.content}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium text-slate-900">
                              {post.metrics.impressions.toLocaleString()}
                            </div>
                            <div className="text-slate-500">Vues</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-slate-900">{post.metrics.likes}</div>
                            <div className="text-slate-500">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-slate-900">
                              {post.metrics.comments}
                            </div>
                            <div className="text-slate-500">Commentaires</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-slate-900">{post.metrics.shares}</div>
                            <div className="text-slate-500">Partages</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Insights */}
            {metrics?.insights && metrics.insights.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Insights</h4>
                {metrics.insights.slice(0, 2).map((insight, index) => (
                  <div
                    key={`row-${index}`}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">💡</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-900 mb-1">{insight.title}</h5>
                        <p className="text-sm text-blue-700 mb-2">{insight.description}</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {insight.impact}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune donnée</h3>
            <p className="text-slate-600">Connectez-vous à LinkedIn pour voir vos statistiques</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
