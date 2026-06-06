/**
 * 🛡️ PERPLEXITY API PROTECTION MIDDLEWARE
 * Middleware de protection automatique pour tous les appels API Perplexity
 * Évite la sur-consommation et les appels en boucle
 */

interface APICallRecord {
  timestamp: number;
  endpoint: string;
  cost: number;
}

class PerplexityProtectionMiddleware {
  private static instance: PerplexityProtectionMiddleware;
  private callHistory: APICallRecord[] = [];
  private isProtectionActive: boolean = true;

  // Limites de sécurité par défaut
  private readonly DEFAULT_LIMITS = {
    maxCallsPerHour: 10,
    maxCostPerDay: 5,
    maxCallsPerMinute: 2,
    costPerCall: 0.02, // Estimation moyenne
  };

  private constructor() {
    this.loadSettings();
  }

  public static getInstance(): PerplexityProtectionMiddleware {
    if (!PerplexityProtectionMiddleware.instance) {
      PerplexityProtectionMiddleware.instance = new PerplexityProtectionMiddleware();
    }
    return PerplexityProtectionMiddleware.instance;
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('perplexity_protection_history');
      if (saved) {
        this.callHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Erreur chargement historique protection:', error);
      this.callHistory = [];
    }
  }

  private saveSettings() {
    try {
      // Ne garder que les 100 derniers appels
      const recentCalls = this.callHistory.slice(-100);
      localStorage.setItem('perplexity_protection_history', JSON.stringify(recentCalls));
      this.callHistory = recentCalls;
    } catch (error) {
      console.warn('Erreur sauvegarde protection:', error);
    }
  }

  // Vérifier si un appel peut être effectué
  public canMakeCall(endpoint: string = 'perplexity'): {
    allowed: boolean;
    reason?: string;
    retryAfter?: number;
  } {
    if (!this.isProtectionActive) {
      return { allowed: true };
    }

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    const oneMinute = 60 * 1000;

    // Nettoyer l'historique (supprimer > 24h)
    this.callHistory = this.callHistory.filter((call) => now - call.timestamp < oneDay);

    // Vérifications par minute (protection contre les boucles)
    const callsLastMinute = this.callHistory.filter(
      (call) => now - call.timestamp < oneMinute,
    ).length;

    if (callsLastMinute >= this.DEFAULT_LIMITS.maxCallsPerMinute) {
      return {
        allowed: false,
        reason: `Trop d'appels récents (${callsLastMinute}/${this.DEFAULT_LIMITS.maxCallsPerMinute} par minute)`,
        retryAfter: oneMinute,
      };
    }

    // Vérifications par heure
    const callsLastHour = this.callHistory.filter((call) => now - call.timestamp < oneHour).length;

    if (callsLastHour >= this.DEFAULT_LIMITS.maxCallsPerHour) {
      return {
        allowed: false,
        reason: `Limite horaire atteinte (${callsLastHour}/${this.DEFAULT_LIMITS.maxCallsPerHour})`,
        retryAfter: oneHour,
      };
    }

    // Vérifications par jour (coût)
    const costLastDay = this.callHistory
      .filter((call) => now - call.timestamp < oneDay)
      .reduce((sum, call) => sum + call.cost, 0);

    if (costLastDay >= this.DEFAULT_LIMITS.maxCostPerDay) {
      return {
        allowed: false,
        reason: `Budget quotidien épuisé ($${costLastDay.toFixed(2)}/$${this.DEFAULT_LIMITS.maxCostPerDay})`,
        retryAfter: oneDay,
      };
    }

    return { allowed: true };
  }

  // Enregistrer un appel effectué
  public recordCall(
    endpoint: string = 'perplexity',
    cost: number = this.DEFAULT_LIMITS.costPerCall,
  ) {
    const record: APICallRecord = {
      timestamp: Date.now(),
      endpoint,
      cost,
    };

    this.callHistory.push(record);
    this.saveSettings();

    // Log pour debugging
    console.log(`🛡️ [Protection] Appel enregistré: ${endpoint} ($${cost.toFixed(2)})`);

    // Notifier le composant UI si disponible
    if (typeof globalThis !== 'undefined' && (globalThis as any).perplexityProtection) {
      (globalThis as any).perplexityProtection.recordAPICall(endpoint, 'success', cost);
    }
  }

  // Wrapper pour fetch avec protection
  public async protectedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const endpoint = url.includes('perplexity') ? 'perplexity' : 'api';

    // Vérifier avant l'appel
    const { allowed, reason, retryAfter } = this.canMakeCall(endpoint);

    if (!allowed) {
      console.error(`🚫 [Protection] Appel bloqué: ${reason}`);
      throw new Error(
        `API call blocked: ${reason}. Retry after ${retryAfter ? Math.round(retryAfter / 1000) : 60}s`,
      );
    }

    try {
      console.log(`🔐 [Protection] Appel autorisé: ${endpoint}`);
      const response = await fetch(url, options);

      // Enregistrer seulement si succès
      if (response.ok) {
        this.recordCall(endpoint);
      }

      return response;
    } catch (error) {
      console.error(`❌ [Protection] Erreur appel ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtenir les statistiques actuelles
  public getStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    const callsLastHour = this.callHistory.filter((call) => now - call.timestamp < oneHour).length;

    const callsLastDay = this.callHistory.filter((call) => now - call.timestamp < oneDay).length;

    const costLastDay = this.callHistory
      .filter((call) => now - call.timestamp < oneDay)
      .reduce((sum, call) => sum + call.cost, 0);

    const totalCost = this.callHistory.reduce((sum, call) => sum + call.cost, 0);

    return {
      callsLastHour,
      callsLastDay,
      costLastDay,
      totalCalls: this.callHistory.length,
      totalCost,
      isProtectionActive: this.isProtectionActive,
      limits: this.DEFAULT_LIMITS,
    };
  }

  // Activer/désactiver la protection
  public setProtectionActive(active: boolean) {
    this.isProtectionActive = active;
    console.log(`🛡️ [Protection] ${active ? 'Activée' : 'Désactivée'}`);
  }

  // Réinitialiser l'historique
  public reset() {
    this.callHistory = [];
    this.saveSettings();
    console.log('🛡️ [Protection] Historique réinitialisé');
  }
}

// Instance singleton
export const perplexityProtection = PerplexityProtectionMiddleware.getInstance();

// Hook pour intégration React
export const usePerplexityProtection = () => {
  return {
    canMakeCall: (endpoint?: string) => perplexityProtection.canMakeCall(endpoint),
    recordCall: (endpoint?: string, cost?: number) =>
      perplexityProtection.recordCall(endpoint, cost),
    protectedFetch: (url: string, options?: RequestInit) =>
      perplexityProtection.protectedFetch(url, options),
    getStats: () => perplexityProtection.getStats(),
    setProtectionActive: (active: boolean) => perplexityProtection.setProtectionActive(active),
    reset: () => perplexityProtection.reset(),
  };
};

// Auto-initialisation globale
if (typeof globalThis !== 'undefined') {
  (globalThis as any).perplexityProtectionMiddleware = perplexityProtection;
}
