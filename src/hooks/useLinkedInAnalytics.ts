import { useState, useEffect, useCallback } from 'react';
import { linkedinAPI } from '@/lib/linkedin-api';
import type { LinkedInMetrics } from '@/lib/linkedin-api';

interface UseLinkedInAnalyticsReturn {
  // État d'authentification
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  
  // Métriques
  metrics: LinkedInMetrics | null;
  lastSync: Date | null;
  
  // Actions
  authenticate: () => void;
  logout: () => void;
  fetchMetrics: (period: '7d' | '30d' | '90d') => Promise<void>;
  testConnection: () => Promise<boolean>;
  
  // Gestion OAuth callback
  handleOAuthCallback: (code: string) => Promise<boolean>;
}

export const useLinkedInAnalytics = (): UseLinkedInAnalyticsReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [metrics, setMetrics] = useState<LinkedInMetrics | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Vérifier l'authentification et la configuration au chargement
  useEffect(() => {
    const checkAuth = () => {
      // Vérifier si les credentials sont configurés
      const clientSecret = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;
      const configured = !!clientSecret;
      setIsConfigured(configured);
      
      if (!configured) {
        console.info('🔧 LinkedIn: Credentials non configurés - Mode démonstration actif');
        setIsAuthenticated(false);
        return;
      }
      
      const authenticated = linkedinAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      // Récupérer la dernière synchronisation
      const lastSyncStr = localStorage.getItem('linkedin_last_sync');
      if (lastSyncStr) {
        setLastSync(new Date(lastSyncStr));
      }
    };

    checkAuth();

    // Vérifier périodiquement l'expiration du token
    const interval = setInterval(checkAuth, 60000); // Toutes les minutes
    
    return () => clearInterval(interval);
  }, []);

  // Démarrer l'authentification OAuth
  const authenticate = useCallback(() => {
    if (!isConfigured) {
      console.warn('⚠️ Tentative d\'authentification LinkedIn sans credentials configurés');
      throw new Error('LinkedIn non configuré. Veuillez ajouter VITE_LINKEDIN_CLIENT_SECRET dans votre fichier .env');
    }
    
    const authURL = linkedinAPI.getAuthURL();
    window.location.href = authURL;
  }, [isConfigured]);

  // Récupérer les métriques
  const fetchMetrics = useCallback(async (period: '7d' | '30d' | '90d') => {
    setIsLoading(true);
    try {
      const data = await linkedinAPI.getMetrics(period);
      setMetrics(data);
      setLastSync(new Date());
      
      // Sauvegarder la dernière synchronisation
      localStorage.setItem('linkedin_last_sync', new Date().toISOString());
      
    } catch (error) {
      console.error('Erreur récupération métriques LinkedIn:', error);
      // En cas d'erreur, on garde les métriques précédentes
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gérer le callback OAuth
  const handleOAuthCallback = useCallback(async (code: string): Promise<boolean> => {
    if (!isConfigured) {
      console.warn('⚠️ Tentative de callback OAuth sans credentials configurés');
      return false;
    }
    
    setIsLoading(true);
    try {
      await linkedinAPI.exchangeCodeForToken(code);
      setIsAuthenticated(true);
      
      // Récupérer immédiatement les métriques après authentification
      await fetchMetrics('7d');
      
      return true;
    } catch (error) {
      console.error('Erreur authentification LinkedIn:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchMetrics, isConfigured]);

  // Tester la connexion
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const isConnected = await linkedinAPI.testConnection();
      setIsAuthenticated(isConnected);
      return isConnected;
    } catch (error) {
      console.error('Test connexion LinkedIn échoué:', error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // Déconnexion
  const logout = useCallback(() => {
    linkedinAPI.logout();
    setIsAuthenticated(false);
    setMetrics(null);
    setLastSync(null);
    localStorage.removeItem('linkedin_last_sync');
  }, []);

  return {
    isAuthenticated,
    isLoading,
    isConfigured,
    metrics,
    lastSync,
    authenticate,
    logout,
    fetchMetrics,
    testConnection,
    handleOAuthCallback
  };
}; 