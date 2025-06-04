/**
 * 🛑 STATUT BLOQUEUR GLOBAL - MONITORING TEMPS RÉEL
 * Affiche l'état du bloqueur global d'API et permet le contrôle manuel
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff, RotateCcw, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { globalApiBlocker } from '@/lib/global-api-blocker';

export const GlobalApiBlockerStatus: React.FC = () => {
  const [stats, setStats] = useState(globalApiBlocker.getStats());
  const [refreshCount, setRefreshCount] = useState(0);

  // Actualiser les stats automatiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(globalApiBlocker.getStats());
    }, 1000); // Refresh chaque seconde

    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    globalApiBlocker.reset();
    setStats(globalApiBlocker.getStats());
    setRefreshCount(prev => prev + 1);
  };

  const handleForceBlock = () => {
    globalApiBlocker.forceBlock();
    setStats(globalApiBlocker.getStats());
    setRefreshCount(prev => prev + 1);
  };

  const getStatusIcon = () => {
    if (stats.isBlocked) {
      return <ShieldOff className="h-5 w-5 text-red-500" />;
    }
    return <Shield className="h-5 w-5 text-green-500" />;
  };

  const getStatusBadge = () => {
    if (stats.isBlocked) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <ShieldOff className="h-3 w-3" />
        BLOCKED
      </Badge>;
    }
    if (stats.errorCount > 0) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        MONITORING
      </Badge>;
    }
    return <Badge variant="default" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      ACTIVE
    </Badge>;
  };

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  const getBlockedDuration = () => {
    if (!stats.blockedSince) return null;
    const start = new Date(stats.blockedSince);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <CardTitle className="text-base font-medium">
              🛑 Global API Blocker
            </CardTitle>
            <CardDescription>
              Real-time protection against API spam
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
            disabled={!stats.isBlocked && stats.errorCount === 0}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className={`p-3 rounded-lg ${stats.isBlocked ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className={`text-sm font-medium ${stats.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
              Status
            </div>
            <div className={`text-2xl font-bold ${stats.isBlocked ? 'text-red-900' : 'text-green-900'}`}>
              {stats.isBlocked ? 'BLOCKED' : 'ACTIVE'}
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Errors</div>
            <div className="text-2xl font-bold text-blue-900">{stats.errorCount}/3</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">Total Blocked</div>
            <div className="text-2xl font-bold text-orange-900">{stats.totalBlocked}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">
              {stats.isBlocked ? 'Blocked Since' : 'Last Check'}
            </div>
            <div className="text-sm font-bold text-purple-900">
              {stats.isBlocked && stats.blockedSince ? getBlockedDuration() : 'Active'}
            </div>
          </div>
        </div>

        {stats.isBlocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
              <ShieldOff className="h-4 w-4" />
              <span>API Protection Active</span>
            </div>
            <div className="text-sm text-red-600 space-y-1">
              <div>🛑 All fetch() calls to /api/* are being blocked</div>
              <div>💡 Start backend server to automatically unblock</div>
              <div>🔧 Or use the Reset button to unblock manually</div>
              <div>⏰ Blocked for: {getBlockedDuration()}</div>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm">
          <h4 className="font-medium text-gray-900">Protection Details</h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <strong>Last Error:</strong> {formatTimestamp(stats.lastError)}
            </div>
            <div>
              <strong>Blocked Since:</strong> {formatTimestamp(stats.blockedSince)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <Activity className="h-4 w-4 inline mr-1" />
              Auto-refresh: 1s
            </div>
            <div className="flex space-x-2">
              {!stats.isBlocked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleForceBlock}
                  className="text-xs"
                >
                  Force Block (Test)
                </Button>
              )}
              <div className="text-xs text-gray-500">
                Refresh #{refreshCount}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalApiBlockerStatus; 