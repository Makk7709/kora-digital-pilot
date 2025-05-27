import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkedInStats } from '@/hooks/useLinkedInStats';
import { useNavigate } from 'react-router-dom';
import LinkedInDiagnostic from './LinkedInDiagnostic';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Users, 
  ExternalLink,
  Settings,
  BarChart3,
  Info
} from 'lucide-react';

interface LinkedInDashboardWidgetProps {
  className?: string;
  compact?: boolean;
}

const LinkedInDashboardWidget: React.FC<LinkedInDashboardWidgetProps> = ({
  className = '',
  compact = false
}) => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  
  const {
    formattedMetrics,
    isLoading,
    connectionStatus,
    cacheInfo,
    refreshStats
  } = useLinkedInStats(true, 300000);

  const handleViewDetails = () => {
    navigate('/linkedin-test');
  };

  const handlePeriodChange = async (period: '7d' | '30d' | '90d') => {
    setSelectedPeriod(period);
    await refreshStats(period);
  };

  // Version compacte pour sidebar ou widgets
  if (compact) {
    return (
      <Card className={`premium-card ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-700">
              LinkedIn
            </CardTitle>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'error' ? 'bg-red-500' : 'bg-orange-500'
              }`}></div>
              {cacheInfo.isFromCache && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Cache
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            </div>
          ) : formattedMetrics ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Portée</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold">{formattedMetrics.reach.value}</span>
                  {formattedMetrics.reach.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Engagement</span>
                <span className="text-sm font-semibold">{formattedMetrics.engagement.value}</span>
              </div>
              
              <Button 
                onClick={handleViewDetails}
                variant="ghost" 
                size="sm" 
                className="w-full text-xs h-7"
              >
                Voir détails
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-slate-500 mb-2">Non connecté</p>
              <Button 
                onClick={handleViewDetails}
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
              >
                Configurer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Version complète pour dashboard principal
  return (
    <Card className={`premium-card ${className}`}>
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💼</span>
            </div>
            <span>LinkedIn Analytics</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'error' ? 'bg-red-500' : 'bg-orange-500'
            }`}></div>
            
            <Button
              onClick={handleViewDetails}
              variant="ghost"
              size="sm"
              className="text-slate-600"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Sélecteur de période */}
        <div className="flex space-x-2 mb-4">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <Button
              key={p}
              onClick={() => handlePeriodChange(p)}
              variant={selectedPeriod === p ? "default" : "outline"}
              size="sm"
              disabled={isLoading}
              className={`text-xs ${selectedPeriod === p ? "bg-blue-600 text-white" : ""}`}
            >
              {p === '7d' ? '7j' : p === '30d' ? '30j' : '90j'}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-2 bg-slate-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : formattedMetrics ? (
          <div className="space-y-4">
            {/* Métriques principales */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-slate-600">Portée</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{formattedMetrics.reach.value}</div>
                <div className="flex items-center justify-center space-x-1">
                  {formattedMetrics.reach.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${formattedMetrics.reach.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formattedMetrics.reach.trend}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-slate-600">Engagement</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{formattedMetrics.engagement.value}</div>
                <div className="flex items-center justify-center space-x-1">
                  {formattedMetrics.engagement.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${formattedMetrics.engagement.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formattedMetrics.engagement.trend}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <MousePointer className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-slate-600">Clics</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{formattedMetrics.clicks.value}</div>
                <div className="flex items-center justify-center space-x-1">
                  {formattedMetrics.clicks.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs ${formattedMetrics.clicks.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formattedMetrics.clicks.trend}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <Button 
                onClick={handleViewDetails}
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyse complète
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-medium text-slate-900 mb-1">LinkedIn non connecté</h4>
            <p className="text-sm text-slate-600 mb-3">
              Connectez votre compte pour voir vos métriques
            </p>
            <Button 
              onClick={handleViewDetails}
              variant="outline" 
              size="sm"
            >
              Configurer LinkedIn
            </Button>
          </div>
        )}
        
        {/* Indicateur de cache */}
        {cacheInfo.isFromCache && (
          <div className="mt-3 text-center">
            <Badge variant="secondary" className="text-xs">
              Données en cache ({cacheInfo.cacheAge}min)
            </Badge>
          </div>
        )}
        
        {/* Indicateur de mode démonstration */}
        {connectionStatus !== 'connected' && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium text-blue-800">
                  Mode démonstration
                </div>
                <div className="text-xs text-blue-600">
                  Ces données sont simulées. Connectez LinkedIn pour voir vos vraies statistiques.
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInDashboardWidget; 