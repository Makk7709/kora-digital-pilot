/**
 * 🔍 TABLEAU DE BORD SANTÉ API - DIAGNOSTIC EN TEMPS RÉEL
 * Composant pour surveiller et diagnostiquer l'état des appels API
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useApiCallManager } from '@/lib/api-call-manager';

export const ApiHealthDashboard: React.FC = () => {
  const { getStats, markServerAsUp, reset } = useApiCallManager();
  const [stats, setStats] = useState(getStats());
  const [refreshCount, setRefreshCount] = useState(0);

  // Actualiser les stats automatiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats());
    }, 3000); // Refresh toutes les 3 secondes

    return () => clearInterval(interval);
  }, [getStats]);

  const refreshStats = () => {
    setStats(getStats());
    setRefreshCount(prev => prev + 1);
  };

  const resetAllStats = () => {
    reset();
    setStats(getStats());
    setRefreshCount(0);
  };

  const getStatusIcon = (endpoint: any) => {
    if (endpoint.status.isServerDown) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (endpoint.status.errorCount > 0) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = (endpoint: any) => {
    if (endpoint.status.isServerDown) {
      return <Badge variant="destructive">DOWN</Badge>;
    }
    if (endpoint.status.errorCount > 0) {
      return <Badge variant="secondary">DEGRADED</Badge>;
    }
    return <Badge variant="default">HEALTHY</Badge>;
  };

  const formatNextRetry = (nextRetryTime: Date | null) => {
    if (!nextRetryTime) return 'N/A';
    const now = new Date();
    const diff = nextRetryTime.getTime() - now.getTime();
    if (diff <= 0) return 'Ready to retry';
    return `${Math.ceil(diff / 1000)}s`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium">
              🔍 API Health Dashboard
            </CardTitle>
            <CardDescription>
              Monitor API endpoints and prevent excessive calls
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshStats}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh ({refreshCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllStats}
              className="flex items-center gap-2"
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Endpoints Monitored</div>
              <div className="text-2xl font-bold text-blue-900">{stats.endpoints.length}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Cache Entries</div>
              <div className="text-2xl font-bold text-green-900">{stats.cacheSize}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-sm text-orange-600 font-medium">Active Requests</div>
              <div className="text-2xl font-bold text-orange-900">{stats.activeRequests}</div>
            </div>
          </div>

          {stats.endpoints.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No API endpoints have been accessed yet.</p>
              <p className="text-sm">API calls will appear here once made.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Endpoint Status</h4>
              {stats.endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(endpoint)}
                      <div>
                        <div className="font-medium text-sm">{endpoint.endpoint}</div>
                        <div className="text-xs text-gray-500">
                          Errors: {endpoint.status.errorCount}/3
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(endpoint)}
                      {endpoint.status.isServerDown && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markServerAsUp(endpoint.endpoint)}
                          className="text-xs"
                        >
                          Mark as Up
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <strong>Last Error:</strong>{' '}
                      {endpoint.status.lastError 
                        ? new Date(endpoint.status.lastError).toLocaleTimeString()
                        : 'None'
                      }
                    </div>
                    <div>
                      <strong>Next Retry:</strong>{' '}
                      {formatNextRetry(endpoint.status.nextRetryTime)}
                    </div>
                  </div>
                  
                  {endpoint.status.isServerDown && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        <strong>Server marked as down</strong>
                      </div>
                      <div>API calls to this endpoint are being throttled to prevent spam.</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Protection Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium text-green-700">✅ Active Protections</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Request deduplication</li>
                <li>• Exponential backoff retry</li>
                <li>• Automatic server down detection</li>
                <li>• Response caching</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-blue-700">🔧 Configuration</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Timeout: 5s default</li>
                <li>• Max errors before down: 3</li>
                <li>• Max backoff: 5 minutes</li>
                <li>• Cache TTL: Configurable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiHealthDashboard; 