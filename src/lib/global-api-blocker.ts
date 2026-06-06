/**
 * 🛑 BLOQUEUR GLOBAL D'API - SOLUTION DÉFINITIVE
 * Intercepte TOUS les appels fetch vers /api et les bloque quand serveur down
 * Empêche complètement les appels intempestifs à la source
 */

interface ApiBlockerState {
  isBlocked: boolean;
  errorCount: number;
  lastErrorTime: Date | null;
  blockedSince: Date | null;
  totalBlocked: number;
}

class GlobalApiBlocker {
  private static instance: GlobalApiBlocker;
  private originalFetch: typeof fetch;
  private state: ApiBlockerState = {
    isBlocked: false,
    errorCount: 0,
    lastErrorTime: null,
    blockedSince: null,
    totalBlocked: 0,
  };

  private constructor() {
    this.originalFetch = globalThis.fetch;
    this.interceptFetch();
  }

  static getInstance(): GlobalApiBlocker {
    if (!GlobalApiBlocker.instance) {
      GlobalApiBlocker.instance = new GlobalApiBlocker();
    }
    return GlobalApiBlocker.instance;
  }

  /**
   * Intercepter tous les appels fetch
   */
  private interceptFetch(): void {
    // 🔧 FIX: Préserver le bon contexte pour éviter "Illegal invocation"
    const originalFetch = this.originalFetch.bind(globalThis);

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString();

      // Bloquer seulement les appels vers /api
      if (url.includes('/api/')) {
        if (this.state.isBlocked) {
          this.state.totalBlocked++;
          console.log(
            `🛑 [Global Blocker] BLOCKED fetch to ${url} (Total blocked: ${this.state.totalBlocked})`,
          );

          // Retourner une réponse 503 simulée
          return new Response(
            JSON.stringify({
              error: 'API calls blocked - Server permanently down',
              code: 'GLOBALLY_BLOCKED',
              message: 'All API calls are blocked. Please start backend server.',
              timestamp: new Date().toISOString(),
              blocked: true,
              totalBlocked: this.state.totalBlocked,
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: {
                'Content-Type': 'application/json',
                'X-Api-Blocked': 'true',
              },
            },
          );
        }
      }

      // 🔧 FIX: Utiliser originalFetch avec le bon contexte
      try {
        const response = await originalFetch(input, init);

        // Si l'appel vers /api réussit, reset le bloqueur
        if (url.includes('/api/') && response.ok) {
          this.reset();
        }

        // Si l'appel vers /api échoue, compter l'erreur
        if (url.includes('/api/') && !response.ok) {
          this.recordError();
        }

        return response;
      } catch (error) {
        // Si erreur réseau vers /api, compter l'erreur
        if (url.includes('/api/')) {
          this.recordError();
        }
        throw error;
      }
    };

    // 🔧 FIX CRITIQUE: Préserver le binding correct pour window.fetch
    Object.defineProperty(globalThis.fetch, 'bind', {
      value: function (thisArg: any) {
        return globalThis.fetch;
      },
      writable: false,
      configurable: false,
    });
  }

  /**
   * Enregistrer une erreur et bloquer si nécessaire
   */
  private recordError(): void {
    this.state.errorCount++;
    this.state.lastErrorTime = new Date();

    console.log(`⚠️ [Global Blocker] API Error ${this.state.errorCount}/3`);

    // Bloquer après 3 erreurs
    if (this.state.errorCount >= 3 && !this.state.isBlocked) {
      this.state.isBlocked = true;
      this.state.blockedSince = new Date();

      console.log(`🛑 [Global Blocker] ===== ALL API CALLS NOW BLOCKED =====`);
      console.log(`🛑 [Global Blocker] Blocking ALL fetch() calls to /api/* endpoints`);
      console.log(
        `💡 [Global Blocker] To unblock: Start backend server or call globalApiBlocker.reset()`,
      );
      console.log(`🛑 [Global Blocker] ============================================`);
    }
  }

  /**
   * Reset le bloqueur (quand serveur revient)
   */
  reset(): void {
    const wasBlocked = this.state.isBlocked;

    this.state = {
      isBlocked: false,
      errorCount: 0,
      lastErrorTime: null,
      blockedSince: null,
      totalBlocked: this.state.totalBlocked, // Garder le compteur
    };

    if (wasBlocked) {
      console.log(`✅ [Global Blocker] API calls UNBLOCKED - Server is back online!`);
    }
  }

  /**
   * Forcer le blocage manuellement
   */
  forceBlock(): void {
    this.state.isBlocked = true;
    this.state.blockedSince = new Date();
    console.log(`🛑 [Global Blocker] API calls MANUALLY BLOCKED`);
  }

  /**
   * Obtenir l'état actuel
   */
  getState(): ApiBlockerState {
    return { ...this.state };
  }

  /**
   * Statistiques pour debugging
   */
  getStats(): {
    isBlocked: boolean;
    errorCount: number;
    totalBlocked: number;
    blockedSince: string | null;
    lastError: string | null;
  } {
    return {
      isBlocked: this.state.isBlocked,
      errorCount: this.state.errorCount,
      totalBlocked: this.state.totalBlocked,
      blockedSince: this.state.blockedSince?.toISOString() || null,
      lastError: this.state.lastErrorTime?.toISOString() || null,
    };
  }
}

// Instance singleton
const globalApiBlocker = GlobalApiBlocker.getInstance();

// Exposer globalement pour debugging
if (typeof globalThis !== 'undefined') {
  (globalThis as any).globalApiBlocker = globalApiBlocker;
}

// Export pour utilisation dans l'app
export { globalApiBlocker };
export type { ApiBlockerState };
