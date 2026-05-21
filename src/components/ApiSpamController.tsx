/**
 * 🛑 CONTRÔLEUR ANTI-SPAM API 
 * Composant pour gérer et arrêter les appels API intempestifs
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  StopCircle, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Server, 
  Shield,
  CheckCircle,
  XCircle 
} from 'lucide-react';
import { useServerDetector } from '@/lib/server-detection';

export const ApiSpamController: React.FC = () => {
  const serverStatus = useServerDetector();
  const [isApiMonitoringStopped, setIsApiMonitoringStopped] = useState(false);

  const stopAllApiSpam = () => {
    if (typeof window !== 'undefined' && (window as any).stopApiSpam) {
      (window as any).stopApiSpam();
      setIsApiMonitoringStopped(true);
    }
  };

  const restartApiMonitoring = () => {
    if (typeof window !== 'undefined' && (window as any).restartApiMonitoring) {
      (window as any).restartApiMonitoring();
      setIsApiMonitoringStopped(false);
    }
  };

  const resetProxyState = () => {
    if (typeof window !== 'undefined' && (window as any).resetProxyState) {
      (window as any).resetProxyState();
    }
  };

  const getServerStatusBadge = () => {
    if (serverStatus.isOnline) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Online</Badge>;
    }
    if (serverStatus.consecutiveFailures >= 3) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Permanently Down</Badge>;
    }
    return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Offline</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            🛑 Contrôleur Anti-Spam API
          </CardTitle>
          <CardDescription>
            Gérez les appels API répétés et protégez votre application contre le spam d'API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Statut du serveur */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                Statut Backend Server
              </h4>
              {getServerStatusBadge()}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>Échecs consécutifs:</strong> {serverStatus.consecutiveFailures}/3
              </div>
              <div>
                <strong>Dernière vérification:</strong> {serverStatus.lastCheck.toLocaleTimeString()}
              </div>
            </div>

            {serverStatus.consecutiveFailures >= 3 && (
              <Alert className="mt-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Le serveur backend sur le port 3001 n'est pas accessible. 
                  Les appels API automatiques ont été arrêtés pour éviter le spam.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Actions de contrôle */}
          <div className="space-y-3">
            <h4 className="font-medium">Actions de Contrôle</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={stopAllApiSpam}
                disabled={isApiMonitoringStopped}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <StopCircle className="h-4 w-4" />
                Arrêter Tout Spam
              </Button>

              <Button
                onClick={restartApiMonitoring}
                disabled={!isApiMonitoringStopped}
                variant="default"
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Redémarrer Surveillance
              </Button>

              <Button
                onClick={resetProxyState}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Proxy Vite
              </Button>
            </div>
          </div>

          {/* Instructions pour démarrer le serveur */}
          <Alert>
            <Server className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="font-medium">Pour arrêter définitivement les appels API intempestifs :</div>
              <div className="space-y-1 text-sm">
                <div>1. <strong>Démarrer le serveur backend :</strong></div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">npm run proxy</code>
                
                <div className="mt-2">2. <strong>Ou utiliser le script complet :</strong></div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">npm run dev:full</code>
                
                <div className="mt-2">3. <strong>En cas d'urgence, dans la console du navigateur :</strong></div>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">window.stopApiSpam()</code>
              </div>
            </AlertDescription>
          </Alert>

          {/* Statut des protections */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">🛡️ Protections Actives</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>✅ Détection automatique de serveur down</li>
              <li>✅ Arrêt automatique après 3 échecs</li>
              <li>✅ Cache intelligent pour éviter les doublons</li>
              <li>✅ Timeout configuré à 3-5 secondes</li>
              <li>✅ Système de backoff exponentiel</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSpamController; 