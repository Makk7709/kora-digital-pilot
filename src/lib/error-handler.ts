/**
 * Gestionnaire d'erreurs global pour l'application
 * Gère les erreurs communes comme les conflits d'extensions de navigateur
 */

interface ErrorInfo {
  message: string;
  stack?: string;
  source?: string;
  type: 'extension' | 'network' | 'api' | 'unknown';
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private maxErrors = 10;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Gérer les erreurs JavaScript non capturées
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        source: event.filename,
        type: this.categorizeError(event.message)
      });
    });

    // Gérer les promesses rejetées non capturées
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Promise rejection',
        stack: event.reason?.stack,
        type: this.categorizeError(event.reason?.message || '')
      });
    });
  }

  private categorizeError(message: string): ErrorInfo['type'] {
    const lowerMessage = message.toLowerCase();
    
    // Erreurs d'extensions de navigateur
    if (
      lowerMessage.includes('extension') ||
      lowerMessage.includes('chrome-extension') ||
      lowerMessage.includes('message channel closed') ||
      lowerMessage.includes('listener indicated an asynchronous response') ||
      lowerMessage.includes('deprecated api for given entry type')
    ) {
      return 'extension';
    }
    
    // Erreurs réseau
    if (
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('network') ||
      lowerMessage.includes('cors') ||
      lowerMessage.includes('timeout')
    ) {
      return 'network';
    }
    
    // Erreurs API
    if (
      lowerMessage.includes('api') ||
      lowerMessage.includes('unauthorized') ||
      lowerMessage.includes('forbidden')
    ) {
      return 'api';
    }
    
    return 'unknown';
  }

  private handleError(errorInfo: ErrorInfo) {
    // Ignorer les erreurs d'extensions de navigateur courantes
    if (errorInfo.type === 'extension') {
      console.debug('🔧 Erreur d\'extension de navigateur ignorée:', errorInfo.message);
      return;
    }

    // Ajouter à la queue d'erreurs
    this.errorQueue.push(errorInfo);
    
    // Limiter la taille de la queue
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }

    // Logger l'erreur selon son type
    switch (errorInfo.type) {
      case 'network':
        console.warn('🌐 Erreur réseau:', errorInfo.message);
        break;
      case 'api':
        console.error('🔌 Erreur API:', errorInfo.message);
        break;
      default:
        console.error('❌ Erreur:', errorInfo.message);
    }
  }

  /**
   * Obtenir les erreurs récentes
   */
  getRecentErrors(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  /**
   * Vider la queue d'erreurs
   */
  clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Vérifier si l'application fonctionne correctement
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'error';
    issues: string[];
  } {
    const recentErrors = this.errorQueue.filter(
      error => error.type !== 'extension'
    );

    if (recentErrors.length === 0) {
      return { status: 'healthy', issues: [] };
    }

    if (recentErrors.length < 3) {
      return { 
        status: 'warning', 
        issues: recentErrors.map(e => e.message) 
      };
    }

    return { 
      status: 'error', 
      issues: recentErrors.map(e => e.message) 
    };
  }
}

// Initialiser le gestionnaire d'erreurs
export const errorHandler = ErrorHandler.getInstance();

// Utilitaires pour les composants React
export const useErrorHandler = () => {
  return {
    getRecentErrors: () => errorHandler.getRecentErrors(),
    clearErrors: () => errorHandler.clearErrors(),
    getHealthStatus: () => errorHandler.getHealthStatus()
  };
};

export default ErrorHandler; 