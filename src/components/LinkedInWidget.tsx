import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkedInAnalytics } from '@/hooks/useLinkedInAnalytics';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  Users,
  Eye,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const LinkedInWidget: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    isConfigured,
    isProxyReady,
    metrics,
    lastSync,
    authenticate,
    fetchMetrics,
  } = useLinkedInAnalytics();

  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showInitializing, setShowInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitializing(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleConnect = () => {
    if (!isConfigured) {
      toast({
        title: 'Configuration manquante',
        description: "LinkedIn n'est pas configuré",
        variant: 'destructive',
      });
      return;
    }

    if (!isProxyReady) {
      toast({
        title: 'Serveur non prêt',
        description: "Le serveur proxy n'est pas encore disponible",
        variant: 'destructive',
      });
      return;
    }

    authenticate();
  };

  const handleRefresh = async () => {
    if (!isAuthenticated || !isProxyReady) return;

    try {
      setIsRefreshing(true);
      await fetchMetrics('30d');
      toast({
        title: '✅ Données actualisées',
        description: 'Les métriques LinkedIn ont été mises à jour',
      });
    } catch (error) {
      console.error('[components/LinkedInWidget] catch:', error);
      toast({
        title: '❌ Erreur de synchronisation',
        description: 'Impossible de récupérer les données LinkedIn',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Jamais';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  if (!isProxyReady && showInitializing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span>LinkedIn Analytics</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-1"></div>
              Initialisation...
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-sm mb-2">Démarrage du serveur LinkedIn...</p>
            <p className="text-xs text-gray-500">Veuillez patienter quelques secondes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isProxyReady && !showInitializing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span>LinkedIn Analytics</span>
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30"
            >
              Mode Démo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-900">12.5K</div>
              <div className="text-xs text-blue-600">Impressions</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-900">8.9K</div>
              <div className="text-xs text-green-600">Portée</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-purple-900">567</div>
              <div className="text-xs text-purple-600">Engagement</div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-orange-900">89</div>
              <div className="text-xs text-orange-600">Clics</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-xs text-blue-600 mb-2">💡 Données de démonstration</p>
            <p className="text-xs text-gray-500">
              Connectez LinkedIn pour voir vos vraies métriques
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConfigured) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span>LinkedIn Analytics</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              Non configuré
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-sm mb-4">
              LinkedIn n'est pas configuré dans les variables d'environnement
            </p>
            <p className="text-xs text-gray-500">
              Contactez l'administrateur pour configurer l'intégration
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span>LinkedIn Analytics</span>
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Déconnecté
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Connectez votre compte LinkedIn pour voir vos analytics
            </p>
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Se connecter
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">in</span>
            </div>
            <span>LinkedIn Analytics</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connecté
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-7 px-2"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500">Dernière sync : {formatLastSync(lastSync)}</p>
      </CardHeader>
      <CardContent>
        {metrics ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-900">
                {metrics.posts
                  ?.reduce((sum, post) => sum + (post.metrics?.impressions || 0), 0)
                  .toLocaleString() || '0'}
              </div>
              <div className="text-xs text-blue-600">Impressions</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-900">
                {metrics.totalReach || '0'}
              </div>
              <div className="text-xs text-green-600">Portée</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-purple-900">
                {metrics.totalEngagement || '0'}
              </div>
              <div className="text-xs text-purple-600">Engagement</div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-orange-900">
                {metrics.totalClicks || '0'}
              </div>
              <div className="text-xs text-orange-600">Clics</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            {isLoading ? (
              <div className="space-y-2">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-600">Chargement des métriques...</p>
                <p className="text-xs text-gray-500">Cela peut prendre quelques secondes</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Aucune donnée disponible</p>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInWidget;
