import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkedInStats } from '@/hooks/useLinkedInStats';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  ExternalLink,
  Settings,
  BarChart3,
  Info,
} from 'lucide-react';

interface LinkedInDashboardWidgetProps {
  className?: string;
  compact?: boolean;
}

type ConnectionStatus = 'connected' | 'error' | string;
type FormattedMetric = { value: string; trend: string; isPositive: boolean };

const statusDotClass = (status: ConnectionStatus): string => {
  if (status === 'connected') return 'bg-green-500';
  if (status === 'error') return 'bg-red-500';
  return 'bg-orange-500';
};

const TrendArrow: React.FC<{ isPositive: boolean; className?: string }> = ({
  isPositive,
  className = 'w-3 h-3',
}) =>
  isPositive ? (
    <TrendingUp className={`${className} text-green-500`} />
  ) : (
    <TrendingDown className={`${className} text-red-500`} />
  );

const MetricBlock: React.FC<{
  icon: React.ReactNode;
  label: string;
  metric: FormattedMetric;
}> = ({ icon, label, metric }) => (
  <div className="text-center">
    <div className="flex items-center justify-center space-x-1 mb-1">
      {icon}
      <span className="text-xs text-slate-600">{label}</span>
    </div>
    <div className="text-lg font-bold text-slate-900">{metric.value}</div>
    <div className="flex items-center justify-center space-x-1">
      <TrendArrow isPositive={metric.isPositive} />
      <span className={`text-xs ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {metric.trend}
      </span>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-2 bg-slate-200 rounded w-2/3 animate-pulse"></div>
      </div>
    ))}
  </div>
);

const CompactWidget: React.FC<{
  className: string;
  connectionStatus: ConnectionStatus;
  cacheInfo: { isFromCache: boolean; cacheAge?: number };
  isLoading: boolean;
  formattedMetrics: { reach: FormattedMetric; engagement: FormattedMetric } | null;
  onViewDetails: () => void;
}> = ({ className, connectionStatus, cacheInfo, isLoading, formattedMetrics, onViewDetails }) => (
  <Card className={`premium-card ${className}`}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-700">LinkedIn</CardTitle>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${statusDotClass(connectionStatus)}`}></div>
          {cacheInfo.isFromCache && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              Cache
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>

    <CardContent className="pt-0">
      {isLoading && (
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
        </div>
      )}

      {!isLoading && formattedMetrics && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Portée</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold">{formattedMetrics.reach.value}</span>
              <TrendArrow isPositive={formattedMetrics.reach.isPositive} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Engagement</span>
            <span className="text-sm font-semibold">{formattedMetrics.engagement.value}</span>
          </div>

          <Button onClick={onViewDetails} variant="ghost" size="sm" className="w-full text-xs h-7">
            Voir détails
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {!isLoading && !formattedMetrics && (
        <div className="text-center py-2">
          <p className="text-xs text-slate-500 mb-2">Non connecté</p>
          <Button onClick={onViewDetails} variant="outline" size="sm" className="text-xs h-7">
            Configurer
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
);

const PERIOD_LABELS: Record<'7d' | '30d' | '90d', string> = {
  '7d': '7j',
  '30d': '30j',
  '90d': '90j',
};

const FullWidget: React.FC<{
  className: string;
  connectionStatus: ConnectionStatus;
  cacheInfo: { isFromCache: boolean; cacheAge?: number };
  isLoading: boolean;
  formattedMetrics: {
    reach: FormattedMetric;
    engagement: FormattedMetric;
    clicks: FormattedMetric;
  } | null;
  selectedPeriod: '7d' | '30d' | '90d';
  onPeriodChange: (p: '7d' | '30d' | '90d') => void;
  onViewDetails: () => void;
}> = ({
  className,
  connectionStatus,
  cacheInfo,
  isLoading,
  formattedMetrics,
  selectedPeriod,
  onPeriodChange,
  onViewDetails,
}) => (
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
          <div className={`w-2 h-2 rounded-full ${statusDotClass(connectionStatus)}`}></div>
          <Button onClick={onViewDetails} variant="ghost" size="sm" className="text-slate-600">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent className="p-6">
      <div className="flex space-x-2 mb-4">
        {(['7d', '30d', '90d'] as const).map((p) => (
          <Button
            key={p}
            onClick={() => onPeriodChange(p)}
            variant={selectedPeriod === p ? 'default' : 'outline'}
            size="sm"
            disabled={isLoading}
            className={`text-xs ${selectedPeriod === p ? 'bg-blue-600 text-white' : ''}`}
          >
            {PERIOD_LABELS[p]}
          </Button>
        ))}
      </div>

      {isLoading && <LoadingSkeleton />}

      {!isLoading && formattedMetrics && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <MetricBlock
              icon={<Eye className="w-4 h-4 text-blue-600" />}
              label="Portée"
              metric={formattedMetrics.reach}
            />
            <MetricBlock
              icon={<Users className="w-4 h-4 text-green-600" />}
              label="Engagement"
              metric={formattedMetrics.engagement}
            />
            <MetricBlock
              icon={<MousePointer className="w-4 h-4 text-purple-600" />}
              label="Clics"
              metric={formattedMetrics.clicks}
            />
          </div>

          <div className="flex space-x-2 pt-2 border-t border-slate-100">
            <Button onClick={onViewDetails} variant="outline" size="sm" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analyse complète
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !formattedMetrics && (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Eye className="w-6 h-6 text-slate-400" />
          </div>
          <h4 className="font-medium text-slate-900 mb-1">LinkedIn non connecté</h4>
          <p className="text-sm text-slate-600 mb-3">
            Connectez votre compte pour voir vos métriques
          </p>
          <Button onClick={onViewDetails} variant="outline" size="sm">
            Configurer LinkedIn
          </Button>
        </div>
      )}

      {cacheInfo.isFromCache && (
        <div className="mt-3 text-center">
          <Badge variant="secondary" className="text-xs">
            Données en cache ({cacheInfo.cacheAge}min)
          </Badge>
        </div>
      )}

      {connectionStatus !== 'connected' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-blue-800">Mode démonstration</div>
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

const LinkedInDashboardWidget: React.FC<LinkedInDashboardWidgetProps> = ({
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const { formattedMetrics, isLoading, connectionStatus, cacheInfo, refreshStats } =
    useLinkedInStats(true, 300000);

  const handleViewDetails = () => navigate('/linkedin-test');

  const handlePeriodChange = async (period: '7d' | '30d' | '90d') => {
    setSelectedPeriod(period);
    await refreshStats(period);
  };

  if (compact) {
    return (
      <CompactWidget
        className={className}
        connectionStatus={connectionStatus}
        cacheInfo={cacheInfo}
        isLoading={isLoading}
        formattedMetrics={formattedMetrics}
        onViewDetails={handleViewDetails}
      />
    );
  }

  return (
    <FullWidget
      className={className}
      connectionStatus={connectionStatus}
      cacheInfo={cacheInfo}
      isLoading={isLoading}
      formattedMetrics={formattedMetrics}
      selectedPeriod={selectedPeriod}
      onPeriodChange={handlePeriodChange}
      onViewDetails={handleViewDetails}
    />
  );
};

export default LinkedInDashboardWidget;
