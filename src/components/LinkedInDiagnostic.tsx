import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLinkedInStats } from '@/hooks/useLinkedInStats';
import { useErrorHandler } from '@/lib/error-handler';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ExternalLink,
  RefreshCw,
  Database,
  Wifi
} from 'lucide-react';

interface LinkedInDiagnosticProps {
  className?: string;
  compact?: boolean;
}

const LinkedInDiagnostic: React.FC<LinkedInDiagnosticProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const { 
    connectionStatus, 
    isAuthenticated, 
    metrics, 
    cacheInfo,
    error 
  } = useLinkedInStats(false);
  
  const { getHealthStatus } = useErrorHandler();
  const healthStatus = getHealthStatus();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connecté - Données réelles';
      case 'disconnected':
        return 'Non connecté - Données de démonstration';
      case 'error':
        return 'Erreur de connexion';
      default:
        return 'Vérification en cours...';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon(connectionStatus)}
        <span className="text-sm text-slate-600">
          {connectionStatus === 'connected' ? 'LinkedIn connecté' : 'Mode démo'}
        </span>
        {cacheInfo.isFromCache && (
          <Badge variant="secondary" className="text-xs">
            Cache {cacheInfo.cacheAge}min
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Diagnostic LinkedIn
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Statut de connexion */}
        <div className="space-y-2">
          <h4 className="font-medium text-slate-700">Statut de connexion</h4>
          <div className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(connectionStatus)}`}>
            <div className="flex items-center space-x-2">
              {getStatusIcon(connectionStatus)}
              <span className="font-medium">{getStatusText(connectionStatus)}</span>
            </div>
            {connectionStatus === 'disconnected' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open('/linkedin-test', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Connecter
              </Button>
            )}
          </div>
        </div>

        {/* Informations sur les données */}
        <div className="space-y-2">
          <h4 className="font-medium text-slate-700">Source des données</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
              <Wifi className="w-4 h-4 text-slate-500" />
              <div>
                <div className="text-sm font-medium">
                  {isAuthenticated ? 'API LinkedIn' : 'Simulation'}
                </div>
                <div className="text-xs text-slate-500">
                  {isAuthenticated ? 'Données réelles' : 'Données de démo'}
                </div>
              </div>
            </div>
            
            {cacheInfo.isFromCache && (
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                <Database className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Cache</div>
                  <div className="text-xs text-slate-500">
                    {cacheInfo.cacheAge} min
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Erreurs */}
        {error && (
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700">Erreur</h4>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-800">
                    Erreur de connexion
                  </div>
                  <div className="text-xs text-red-600 mt-1">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Santé de l'application */}
        {healthStatus.status !== 'healthy' && (
          <div className="space-y-2">
            <h4 className="font-medium text-slate-700">État de l'application</h4>
            <div className={`p-3 rounded-lg border ${
              healthStatus.status === 'warning' 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-2">
                <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                  healthStatus.status === 'warning' ? 'text-orange-500' : 'text-red-500'
                }`} />
                <div>
                  <div className={`text-sm font-medium ${
                    healthStatus.status === 'warning' ? 'text-orange-800' : 'text-red-800'
                  }`}>
                    {healthStatus.status === 'warning' ? 'Avertissements' : 'Erreurs détectées'}
                  </div>
                  <ul className={`text-xs mt-1 space-y-1 ${
                    healthStatus.status === 'warning' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {healthStatus.issues.slice(0, 3).map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informations utiles */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-800">
                Mode démonstration actif
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {isAuthenticated 
                  ? 'Vous voyez vos vraies données LinkedIn'
                  : 'Connectez LinkedIn pour voir vos vraies statistiques. Les données actuelles sont simulées pour la démonstration.'
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInDiagnostic; 