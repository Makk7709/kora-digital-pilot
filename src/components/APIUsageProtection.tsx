/**
 * 🛡️ API USAGE PROTECTION COMPONENT
 * Composant de protection et monitoring des appels API Perplexity
 * Évite la sur-consommation de crédits
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { AlertTriangle, Shield, Activity, DollarSign, Clock, Zap } from 'lucide-react';

interface APICall {
  timestamp: Date;
  endpoint: string;
  cost: number;
  status: 'success' | 'error' | 'pending';
}

interface UsageStats {
  totalCalls: number;
  totalCost: number;
  callsLast24h: number;
  costLast24h: number;
  recentCalls: APICall[];
}

interface ProtectionSettings {
  maxCallsPerHour: number;
  maxCostPerDay: number;
  autoScanEnabled: boolean;
  warningThreshold: number;
}

export const APIUsageProtection: React.FC = () => {
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalCalls: 0,
    totalCost: 0,
    callsLast24h: 0,
    costLast24h: 0,
    recentCalls: []
  });

  const [protectionSettings, setProtectionSettings] = useState<ProtectionSettings>({
    maxCallsPerHour: 10, // Limite de sécurité
    maxCostPerDay: 5.00, // 5$ par jour maximum
    autoScanEnabled: false,
    warningThreshold: 0.8 // Alerte à 80% des limites
  });

  const [isProtectionActive, setIsProtectionActive] = useState(true);

  // Charger les stats depuis localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('perplexity_usage_stats');
    const savedSettings = localStorage.getItem('perplexity_protection_settings');
    
    if (savedStats) {
      try {
        setUsageStats(JSON.parse(savedStats));
      } catch (error) {
        console.warn('Erreur chargement stats usage:', error);
      }
    }
    
    if (savedSettings) {
      try {
        setProtectionSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.warn('Erreur chargement settings protection:', error);
      }
    }
  }, []);

  // Sauvegarder les settings
  useEffect(() => {
    localStorage.setItem('perplexity_protection_settings', JSON.stringify(protectionSettings));
  }, [protectionSettings]);

  // Enregistrer un appel API
  const recordAPICall = useCallback((endpoint: string, status: 'success' | 'error', cost: number = 0.01) => {
    const newCall: APICall = {
      timestamp: new Date(),
      endpoint,
      cost,
      status
    };

    setUsageStats(prev => {
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const updatedCalls = [newCall, ...prev.recentCalls].slice(0, 50); // Garder 50 derniers
      const callsLast24h = updatedCalls.filter(call => call.timestamp > last24h).length;
      const costLast24h = updatedCalls
        .filter(call => call.timestamp > last24h)
        .reduce((sum, call) => sum + call.cost, 0);

      const newStats = {
        totalCalls: prev.totalCalls + 1,
        totalCost: prev.totalCost + cost,
        callsLast24h,
        costLast24h,
        recentCalls: updatedCalls
      };

      // Sauvegarder
      localStorage.setItem('perplexity_usage_stats', JSON.stringify(newStats));
      
      return newStats;
    });
  }, []);

  // Vérifier si on peut faire un appel
  const canMakeAPICall = useCallback((): { allowed: boolean; reason?: string } => {
    if (!isProtectionActive) return { allowed: true };

    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Vérifier les appels de la dernière heure
    const callsLastHour = usageStats.recentCalls.filter(call => call.timestamp > lastHour).length;
    if (callsLastHour >= protectionSettings.maxCallsPerHour) {
      return { 
        allowed: false, 
        reason: `Limite horaire atteinte (${callsLastHour}/${protectionSettings.maxCallsPerHour})` 
      };
    }

    // Vérifier le coût quotidien
    if (usageStats.costLast24h >= protectionSettings.maxCostPerDay) {
      return { 
        allowed: false, 
        reason: `Budget quotidien épuisé ($${usageStats.costLast24h.toFixed(2)}/$${protectionSettings.maxCostPerDay})` 
      };
    }

    return { allowed: true };
  }, [isProtectionActive, usageStats, protectionSettings]);

  // Réinitialiser les stats
  const resetStats = useCallback(() => {
    const emptyStats: UsageStats = {
      totalCalls: 0,
      totalCost: 0,
      callsLast24h: 0,
      costLast24h: 0,
      recentCalls: []
    };
    setUsageStats(emptyStats);
    localStorage.setItem('perplexity_usage_stats', JSON.stringify(emptyStats));
  }, []);

  // Status de protection
  const getProtectionStatus = () => {
    const { allowed, reason } = canMakeAPICall();
    
    if (!isProtectionActive) {
      return { status: 'warning' as const, message: 'Protection désactivée' };
    }
    
    if (!allowed) {
      return { status: 'error' as const, message: reason || 'Limite atteinte' };
    }
    
    // Vérifier les seuils d'alerte
    const hourlyUsage = usageStats.recentCalls.filter(call => 
      call.timestamp > new Date(Date.now() - 60 * 60 * 1000)
    ).length / protectionSettings.maxCallsPerHour;
    
    const dailyUsage = usageStats.costLast24h / protectionSettings.maxCostPerDay;
    
    if (hourlyUsage > protectionSettings.warningThreshold || dailyUsage > protectionSettings.warningThreshold) {
      return { status: 'warning' as const, message: 'Attention aux limites' };
    }
    
    return { status: 'success' as const, message: 'Protection active' };
  };

  const protectionStatus = getProtectionStatus();

  // Exposer les fonctions globalement pour les autres composants
  useEffect(() => {
    (window as any).perplexityProtection = {
      recordAPICall,
      canMakeAPICall,
      isProtectionActive
    };
  }, [recordAPICall, canMakeAPICall, isProtectionActive]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Protection API Perplexity
          <Badge 
            variant={protectionStatus.status === 'success' ? 'default' : 
                    protectionStatus.status === 'warning' ? 'secondary' : 'destructive'}
          >
            {protectionStatus.message}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats d'usage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{usageStats.callsLast24h}</div>
            <div className="text-sm text-gray-600">Appels 24h</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${usageStats.costLast24h.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Coût 24h</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{usageStats.totalCalls}</div>
            <div className="text-sm text-gray-600">Total appels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">${usageStats.totalCost.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Coût total</div>
          </div>
        </div>

        {/* Limites */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Protection active</span>
            <Switch 
              checked={isProtectionActive}
              onCheckedChange={setIsProtectionActive}
            />
          </div>
          
          <div className="text-xs text-gray-600">
            Limites: {protectionSettings.maxCallsPerHour} appels/h • ${protectionSettings.maxCostPerDay}/jour
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={resetStats}
            className="flex items-center gap-1"
          >
            <Activity className="w-3 h-3" />
            Réinitialiser
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setProtectionSettings(prev => ({ 
              ...prev, 
              autoScanEnabled: !prev.autoScanEnabled 
            }))}
            className="flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Auto-scan: {protectionSettings.autoScanEnabled ? 'ON' : 'OFF'}
          </Button>
        </div>

        {/* Alertes */}
        {protectionStatus.status === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700">{protectionStatus.message}</span>
          </div>
        )}

        {protectionStatus.status === 'warning' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">{protectionStatus.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default APIUsageProtection; 