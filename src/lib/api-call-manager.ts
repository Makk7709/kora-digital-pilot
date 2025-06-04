/**
 * 🚀 GESTIONNAIRE D'APPELS API - PROTECTION ANTI-SPAM
 * Centralise la gestion des appels API pour éviter les appels intempestifs
 * et implémenter des stratégies de retry intelligentes
 */

interface ApiCallConfig {
  endpoint: string;
  timeout?: number;
  retries?: number;
  backoffMultiplier?: number;
  cacheDuration?: number;
}

interface ApiCallStatus {
  isServerDown: boolean;
  lastError: Date | null;
  errorCount: number;
  nextRetryTime: Date | null;
}

interface CachedResponse {
  data: any;
  timestamp: Date;
  expiry: Date;
}

class ApiCallManager {
  private static instance: ApiCallManager;
  private endpointStatus = new Map<string, ApiCallStatus>();
  private cache = new Map<string, CachedResponse>();
  private activeRequests = new Map<string, Promise<any>>();

  private constructor() {}

  static getInstance(): ApiCallManager {
    if (!ApiCallManager.instance) {
      ApiCallManager.instance = new ApiCallManager();
    }
    return ApiCallManager.instance;
  }

  /**
   * Effectuer un appel API avec protection anti-spam
   */
  async makeCall<T>(
    config: ApiCallConfig,
    options: RequestInit = {}
  ): Promise<T> {
    const { endpoint, timeout = 5000, retries = 3, backoffMultiplier = 2, cacheDuration = 0 } = config;
    
    // Vérifier le cache d'abord
    if (cacheDuration > 0) {
      const cached = this.getFromCache<T>(endpoint);
      if (cached) {
        console.log(`🎯 [API] Cache hit for ${endpoint}`);
        return cached;
      }
    }

    // Vérifier si on peut faire l'appel
    const canMakeCall = this.canMakeCall(endpoint);
    if (!canMakeCall.allowed) {
      throw new Error(`API call blocked: ${canMakeCall.reason}`);
    }

    // Vérifier si un appel est déjà en cours pour cette endpoint
    if (this.activeRequests.has(endpoint)) {
      console.log(`🔄 [API] Reusing active request for ${endpoint}`);
      return this.activeRequests.get(endpoint)!;
    }

    // Créer la promesse d'appel
    const callPromise = this.executeCall<T>(endpoint, options, timeout);
    this.activeRequests.set(endpoint, callPromise);

    try {
      const result = await callPromise;
      
      // Mettre en cache si configuré
      if (cacheDuration > 0) {
        this.setCache(endpoint, result, cacheDuration);
      }
      
      // Marquer comme succès
      this.recordSuccess(endpoint);
      
      return result;
    } catch (error) {
      // Enregistrer l'erreur
      this.recordError(endpoint, error as Error);
      throw error;
    } finally {
      // Nettoyer la requête active
      this.activeRequests.delete(endpoint);
    }
  }

  /**
   * Vérifier si un appel peut être effectué
   */
  private canMakeCall(endpoint: string): { allowed: boolean; reason?: string } {
    const status = this.getStatus(endpoint);
    
    // Si le serveur est marqué comme down, vérifier si c'est encore valide
    if (status.isServerDown) {
      if (status.nextRetryTime && new Date() < status.nextRetryTime) {
        const remainingTime = Math.ceil((status.nextRetryTime.getTime() - Date.now()) / 1000);
        return {
          allowed: false,
          reason: `Server marked as down. Retry in ${remainingTime}s`
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Exécuter l'appel API avec timeout
   */
  private async executeCall<T>(
    endpoint: string,
    options: RequestInit,
    timeout: number
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(endpoint, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Gérer les réponses de fallback
      if (response.status === 503) {
        const data = await response.json().catch(() => ({}));
        if (data.code === 'SERVER_DOWN' || data.fallback) {
          throw new Error('Backend server unavailable');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Enregistrer un succès
   */
  private recordSuccess(endpoint: string): void {
    const status = this.getStatus(endpoint);
    status.isServerDown = false;
    status.errorCount = 0;
    status.lastError = null;
    status.nextRetryTime = null;
    
    console.log(`✅ [API] Success recorded for ${endpoint}`);
  }

  /**
   * Enregistrer une erreur
   */
  private recordError(endpoint: string, error: Error): void {
    const status = this.getStatus(endpoint);
    status.errorCount++;
    status.lastError = new Date();

    // Marquer le serveur comme down après 3 erreurs consécutives
    if (status.errorCount >= 3) {
      status.isServerDown = true;
      
      // Calculer le temps de retry avec backoff exponentiel
      const backoffTime = Math.min(1000 * Math.pow(2, status.errorCount - 3), 300000); // Max 5 minutes
      status.nextRetryTime = new Date(Date.now() + backoffTime);
      
      console.warn(`🚨 [API] Server marked as down for ${endpoint}. Next retry: ${status.nextRetryTime.toLocaleTimeString()}`);
    } else {
      console.warn(`⚠️ [API] Error ${status.errorCount}/3 for ${endpoint}:`, error.message);
    }
  }

  /**
   * Obtenir le statut d'un endpoint
   */
  private getStatus(endpoint: string): ApiCallStatus {
    if (!this.endpointStatus.has(endpoint)) {
      this.endpointStatus.set(endpoint, {
        isServerDown: false,
        lastError: null,
        errorCount: 0,
        nextRetryTime: null
      });
    }
    return this.endpointStatus.get(endpoint)!;
  }

  /**
   * Gestion du cache
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && new Date() < cached.expiry) {
      return cached.data;
    }
    
    // Nettoyer le cache expiré
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  private setCache(key: string, data: any, durationMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      expiry: new Date(Date.now() + durationMs)
    });
  }

  /**
   * Statistiques pour debugging
   */
  getStats(): {
    endpoints: Array<{
      endpoint: string;
      status: ApiCallStatus;
    }>;
    cacheSize: number;
    activeRequests: number;
  } {
    return {
      endpoints: Array.from(this.endpointStatus.entries()).map(([endpoint, status]) => ({
        endpoint,
        status
      })),
      cacheSize: this.cache.size,
      activeRequests: this.activeRequests.size
    };
  }

  /**
   * Reset pour testing
   */
  reset(): void {
    this.endpointStatus.clear();
    this.cache.clear();
    this.activeRequests.clear();
  }

  /**
   * Marquer manuellement un serveur comme opérationnel
   */
  markServerAsUp(endpoint: string): void {
    const status = this.getStatus(endpoint);
    status.isServerDown = false;
    status.errorCount = 0;
    status.nextRetryTime = null;
    console.log(`✅ [API] Manually marked ${endpoint} as operational`);
  }
}

// Instance singleton
export const apiCallManager = ApiCallManager.getInstance();

// Hook React pour utiliser le gestionnaire d'API
export const useApiCallManager = () => {
  return {
    makeCall: <T>(config: ApiCallConfig, options?: RequestInit) => 
      apiCallManager.makeCall<T>(config, options),
    getStats: () => apiCallManager.getStats(),
    reset: () => apiCallManager.reset(),
    markServerAsUp: (endpoint: string) => apiCallManager.markServerAsUp(endpoint)
  };
};

// Types d'export
export type { ApiCallConfig, ApiCallStatus }; 