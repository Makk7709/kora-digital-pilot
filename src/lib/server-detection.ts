/**
 * 🔍 DÉTECTEUR DE SERVEUR BACKEND - AUTO-RECOVERY
 * Détecte automatiquement quand le serveur backend redémarre
 * et met à jour l'état de l'application en conséquence
 */

import React from 'react';

interface ServerStatus {
  isOnline: boolean;
  lastCheck: Date;
  consecutiveFailures: number;
  lastOnlineTime: Date | null;
}

// Type pour la propriété window
declare global {
  interface Window {
    apiCallManager?: {
      markServerAsUp: (endpoint: string) => void;
    };
  }
}

class ServerDetector {
  private static instance: ServerDetector;
  private status: ServerStatus = {
    isOnline: false,
    lastCheck: new Date(),
    consecutiveFailures: 0,
    lastOnlineTime: null
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

    console.log('🔍 [Server Detector] Starting backend monitoring...');
    
    // Check initial
    this.checkServerStatus();

    // Check périodique
    this.checkInterval = setInterval(() => {
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
      console.log('🔍 [Server Detector] Stopped backend monitoring');
    }
  }

  /**
   * Vérifier le statut du serveur
   */
  private async checkServerStatus(): Promise<void> {
    if (this.isChecking) return;
    
    this.isChecking = true;
    const wasOnline = this.status.isOnline;

    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
        cache: 'no-cache'
      });

      const isOnline = response.ok && response.status !== 503;
      
      this.status = {
        isOnline,
        lastCheck: new Date(),
        consecutiveFailures: isOnline ? 0 : this.status.consecutiveFailures + 1,
        lastOnlineTime: isOnline ? new Date() : this.status.lastOnlineTime
      };

      // Notifier les changements d'état
      if (wasOnline !== isOnline) {
        if (isOnline) {
          console.log('✅ [Server Detector] Backend server is now ONLINE!');
          // Notifier le gestionnaire d'API que le serveur est revenu
          if (typeof window !== 'undefined' && window.apiCallManager) {
            window.apiCallManager.markServerAsUp('/api/health');
          }
        } else {
          console.log('🚨 [Server Detector] Backend server is now OFFLINE');
        }
        
        this.notifyListeners();
      }

    } catch (error) {
      this.status = {
        isOnline: false,
        lastCheck: new Date(),
        consecutiveFailures: this.status.consecutiveFailures + 1,
        lastOnlineTime: this.status.lastOnlineTime
      };

      if (wasOnline) {
        console.log('🚨 [Server Detector] Backend server is now OFFLINE');
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
    this.listeners.forEach(callback => {
      try {
        callback(this.status);
      } catch (error) {
        console.error('Error in server detector listener:', error);
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
    stopMonitoring: () => serverDetector.stopMonitoring()
  };
};

// Utilitaire pour exposer le gestionnaire d'API globalement
if (typeof window !== 'undefined') {
  import('./api-call-manager').then(({ apiCallManager }) => {
    (window as any).apiCallManager = apiCallManager;
  });
}

export type { ServerStatus }; 