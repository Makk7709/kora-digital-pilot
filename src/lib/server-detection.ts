/**
 * 🔍 DÉTECTEUR DE SERVEUR BACKEND - AUTO-RECOVERY
 * Détecte automatiquement quand le serveur backend redémarre
 * et met à jour l'état de l'application en conséquence
 */

import React from 'react';
import { logger } from './logger';

interface ServerStatus {
  isOnline: boolean;
  lastCheck: Date;
  consecutiveFailures: number;
  lastOnlineTime: Date | null;
}

// Type partagé pour la propriété exposée sur l'objet global du runtime
type ApiCallManagerGlobal = {
  markServerAsUp: (endpoint: string) => void;
  reset?: () => void;
};

declare global {
  interface Window {
    apiCallManager?: ApiCallManagerGlobal;
  }
  // eslint-disable-next-line no-var
  var apiCallManager: ApiCallManagerGlobal | undefined;
}

class ServerDetector {
  private static instance: ServerDetector;
  private status: ServerStatus = {
    isOnline: false,
    lastCheck: new Date(),
    consecutiveFailures: 0,
    lastOnlineTime: null,
  };
  private listeners = new Set<(status: ServerStatus) => void>();
  private checkInterval: NodeJS.Timeout | null = null;
  private isChecking = false;

  private constructor() {}

  static getInstance(): ServerDetector {
    if (!ServerDetector.instance) {
      ServerDetector.instance = new ServerDetector();
    }
    return ServerDetector.instance;
  }

  /**
   * Démarrer la surveillance du serveur
   */
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      this.stopMonitoring();
    }

    logger.debug('🔍 [Server Detector] Starting backend monitoring...');

    // Check initial
    this.checkServerStatus();

    // Check périodique avec protection anti-spam
    this.checkInterval = setInterval(() => {
      // Arrêter le monitoring automatique après trop d'échecs
      if (!this.status.isOnline && this.status.consecutiveFailures >= 3) {
        logger.debug(
          '🔇 [Server Detector] Auto-monitoring paused - server marked as permanently down',
        );
        this.stopMonitoring();
        return;
      }

      this.checkServerStatus();
    }, intervalMs);
  }

  /**
   * Arrêter la surveillance du serveur
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      logger.debug('🔍 [Server Detector] Stopped backend monitoring');
    }
  }

  private async probeHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
        cache: 'no-cache',
      });
      return response.ok && response.status !== 503;
    } catch {
      return false;
    }
  }

  private handleTransitionToOnline(): void {
    logger.debug('✅ [Server Detector] Backend server is now ONLINE!');
    if (typeof globalThis !== 'undefined' && globalThis.apiCallManager) {
      globalThis.apiCallManager.markServerAsUp('/api/health');
    }
  }

  private handleTransitionToOffline(): void {
    logger.debug('🚨 [Server Detector] Backend server is now OFFLINE');
    if (this.status.consecutiveFailures >= 3) {
      logger.debug(
        '🛑 [Server Detector] Server marked as permanently down - stopping automatic checks',
      );
    }
  }

  /**
   * Vérifier le statut du serveur
   */
  private async checkServerStatus(): Promise<void> {
    if (this.isChecking) return;
    if (!this.status.isOnline && this.status.consecutiveFailures >= 3) {
      logger.debug('🔇 [Server Detector] Server marked as permanently down, skipping check');
      return;
    }

    this.isChecking = true;
    const wasOnline = this.status.isOnline;

    try {
      const isOnline = await this.probeHealth();
      this.status = {
        isOnline,
        lastCheck: new Date(),
        consecutiveFailures: isOnline ? 0 : this.status.consecutiveFailures + 1,
        lastOnlineTime: isOnline ? new Date() : this.status.lastOnlineTime,
      };

      if (wasOnline !== isOnline) {
        if (isOnline) {
          this.handleTransitionToOnline();
        } else {
          this.handleTransitionToOffline();
        }
        this.notifyListeners();
      }
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * S'abonner aux changements de statut
   */
  subscribe(callback: (status: ServerStatus) => void): () => void {
    this.listeners.add(callback);

    // Envoyer le statut actuel immédiatement
    callback(this.status);

    // Retourner une fonction de désabonnement
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notifier tous les listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.status);
      } catch (error) {
        logger.error('Error in server detector listener:', error);
      }
    });
  }

  /**
   * Obtenir le statut actuel
   */
  getStatus(): ServerStatus {
    return { ...this.status };
  }

  /**
   * Forcer une vérification immédiate
   */
  async checkNow(): Promise<ServerStatus> {
    await this.checkServerStatus();
    return this.getStatus();
  }

  /**
   * Reset l'état du serveur et redémarrer la surveillance
   */
  reset(): void {
    logger.debug('🔄 [Server Detector] Resetting server status...');
    this.status = {
      isOnline: false,
      lastCheck: new Date(),
      consecutiveFailures: 0,
      lastOnlineTime: null,
    };

    // Redémarrer la surveillance si elle était active
    if (this.checkInterval) {
      this.stopMonitoring();
      this.startMonitoring();
    }

    logger.debug('✅ [Server Detector] Status reset complete');
  }
}

// Instance singleton
export const serverDetector = ServerDetector.getInstance();

// Hook React pour utiliser le détecteur de serveur
export const useServerDetector = () => {
  const [status, setStatus] = React.useState<ServerStatus>(serverDetector.getStatus());

  React.useEffect(() => {
    const unsubscribe = serverDetector.subscribe(setStatus);

    // Démarrer la surveillance si pas déjà active
    serverDetector.startMonitoring();

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...status,
    checkNow: () => serverDetector.checkNow(),
    startMonitoring: (interval?: number) => serverDetector.startMonitoring(interval),
    stopMonitoring: () => serverDetector.stopMonitoring(),
    reset: () => serverDetector.reset(),
  };
};

// Utilitaire pour exposer le gestionnaire d'API globalement
if (typeof window !== 'undefined') {
  import('./api-call-manager').then(({ apiCallManager }) => {
    (globalThis as any).apiCallManager = apiCallManager;
  });

  // Fonction globale pour arrêter tous les appels API intempestifs
  (globalThis as any).stopApiSpam = () => {
    logger.debug('🛑 [Global] Stopping all API spam...');

    // Arrêter le server detector
    serverDetector.stopMonitoring();

    // Reset le proxy state dans Vite
    if ((globalThis as any).resetProxyState) {
      (globalThis as any).resetProxyState();
    }

    // Reset le gestionnaire d'API
    if ((globalThis as any).apiCallManager) {
      (globalThis as any).apiCallManager.reset?.();
    }

    logger.debug(
      '✅ [Global] All API monitoring stopped. To restart, use: globalThis.restartApiMonitoring()',
    );
  };

  // Fonction globale pour redémarrer la surveillance
  (globalThis as any).restartApiMonitoring = () => {
    logger.debug('🔄 [Global] Restarting API monitoring...');

    // Reset le server detector
    serverDetector.reset();

    logger.debug('✅ [Global] API monitoring restarted');
  };
}

export type { ServerStatus };
