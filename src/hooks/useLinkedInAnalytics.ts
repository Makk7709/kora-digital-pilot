import { useState, useEffect, useCallback } from 'react';
import { linkedinAPI } from '@/lib/linkedin-api';
import type { LinkedInMetrics } from '@/lib/linkedin-api';

interface UseLinkedInAnalyticsReturn {
  // État d'authentification
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  isProxyReady: boolean;
  
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
  const [isProxyReady, setIsProxyReady] = useState(false);
  const [metrics, setMetrics] = useState<LinkedInMetrics | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Vérifier la disponibilité du proxy
  const checkProxyHealth = useCallback(async () => {
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        timeout: 5000 
      } as RequestInit);
      const isReady = response.ok;
      setIsProxyReady(isReady);
      return isReady;
    } catch (error) {
      console.debug('🔄 Proxy pas encore prêt, nouvelle tentative...');
      setIsProxyReady(false);
      return false;
    }
  }, []);

  // Vérifier l'authentification et la configuration au chargement
  useEffect(() => {
    const checkAuth = async () => {
      // D'abord vérifier si le proxy est prêt
      const proxyReady = await checkProxyHealth();
      if (!proxyReady) {
        console.info('⏳ En attente du serveur proxy...');
        return;
      }

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

    // 🛡️ PROTECTION CRÉDIT API - Vérification réduite à 5 minutes au lieu de 10 secondes
    const interval = setInterval(async () => {
      // Seulement vérifier si nécessaire
      if (!isProxyReady) {
        await checkProxyHealth();
      }
      // Plus de vérification auth automatique - seulement si utilisateur interagit
    }, 5 * 60 * 1000); // ✅ CHANGÉ: 5 minutes au lieu de 10 secondes
    
    return () => clearInterval(interval);
  }, [checkProxyHealth]); // ✅ RETIRÉ isProxyReady de dependencies pour éviter boucle

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
    
    // Timeout de 10 secondes pour éviter le blocage
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: Récupération des métriques trop longue')), 10000);
    });
    
    try {
      console.log(`🔄 Début récupération métriques LinkedIn (${period})`);
      
      // Course entre la récupération des données et le timeout
      const data = await Promise.race([
        linkedinAPI.getMetrics(period),
        timeoutPromise
      ]) as LinkedInMetrics;
      
      console.log('✅ Métriques LinkedIn récupérées avec succès:', {
        totalReach: data.totalReach,
        totalEngagement: data.totalEngagement,
        postsCount: data.posts?.length || 0,
        insightsCount: data.insights?.length || 0
      });
      
      // CORRECTION: Synchronisation améliorée
      setMetrics(data);
      const syncTime = new Date();
      setLastSync(syncTime);
      
      // Sauvegarder la dernière synchronisation ET les métriques
      localStorage.setItem('linkedin_last_sync', syncTime.toISOString());
      localStorage.setItem('linkedin_cached_metrics', JSON.stringify({
        data,
        period,
        timestamp: syncTime.toISOString()
      }));
      
      console.log('💾 Métriques synchronisées et sauvegardées');
      
    } catch (error) {
      console.error('❌ Erreur récupération métriques LinkedIn:', error);
      
      // CORRECTION: Tentative de récupération des métriques en cache
      try {
        const cachedMetrics = localStorage.getItem('linkedin_cached_metrics');
        if (cachedMetrics) {
          const { data: cachedData, timestamp } = JSON.parse(cachedMetrics);
          const cacheAge = Date.now() - new Date(timestamp).getTime();
          
          // Utiliser le cache si moins de 1 heure
          if (cacheAge < 3600000) {
            console.log('🔄 Utilisation des métriques en cache...');
            setMetrics(cachedData);
            setLastSync(new Date(timestamp));
            return;
          }
        }
      } catch (cacheError) {
        console.warn('⚠️ Erreur lecture cache:', cacheError);
      }
      
      // En cas d'erreur ou timeout, utiliser les données de fallback
      try {
        console.log('🔄 Utilisation des données de fallback...');
        const fallbackData = await linkedinAPI.getMetrics(period);
        setMetrics(fallbackData);
        const fallbackTime = new Date();
        setLastSync(fallbackTime);
        localStorage.setItem('linkedin_last_sync', fallbackTime.toISOString());
        console.log('✅ Données de fallback chargées');
      } catch (fallbackError) {
        console.error('❌ Erreur même avec les données de fallback:', fallbackError);
        // CORRECTION: Garder les métriques précédentes si elles existent
        // Ne pas réinitialiser setMetrics(null) en cas d'erreur
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 Fin du chargement des métriques LinkedIn');
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

  // CORRECTION: Récupération automatique des métriques en cache au démarrage
  useEffect(() => {
    const loadCachedMetrics = () => {
      try {
        const cachedMetrics = localStorage.getItem('linkedin_cached_metrics');
        if (cachedMetrics && !metrics) {
          const { data: cachedData, timestamp } = JSON.parse(cachedMetrics);
          const cacheAge = Date.now() - new Date(timestamp).getTime();
          
          // Utiliser le cache si moins de 24 heures
          if (cacheAge < 86400000) {
            console.log('🔄 Chargement des métriques en cache au démarrage');
            setMetrics(cachedData);
            setLastSync(new Date(timestamp));
          }
        }
      } catch (error) {
        console.warn('⚠️ Erreur chargement cache au démarrage:', error);
      }
    };

    if (isAuthenticated && !metrics) {
      loadCachedMetrics();
    }
  }, [isAuthenticated, metrics]);

  return {
    isAuthenticated,
    isLoading,
    isConfigured,
    isProxyReady,
    metrics,
    lastSync,
    authenticate,
    logout,
    fetchMetrics,
    testConnection,
    handleOAuthCallback,
  };
}; 