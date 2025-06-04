import { useState, useEffect, useCallback, useRef } from 'react';
import { linkedinAPI } from '@/lib/linkedin-api';
import { useApiCallManager } from '@/lib/api-call-manager';
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
  
  const { makeCall, getStats, markServerAsUp } = useApiCallManager();
  
  // Refs pour éviter les re-renders inutiles et gérer le backoff
  const proxyCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const retryCountRef = useRef(0);

  // ✅ NOUVELLE FONCTION: Chargement des métriques en cache
  const loadCachedMetrics = useCallback(() => {
    try {
      const cachedMetrics = localStorage.getItem('linkedin_cached_metrics');
      if (cachedMetrics && !metrics) {
        const { data: cachedData, timestamp } = JSON.parse(cachedMetrics);
        const cacheAge = Date.now() - new Date(timestamp).getTime();
        
        // Utiliser le cache si moins de 24 heures
        if (cacheAge < 86400000) {
          console.log('🔄 [LinkedIn] Loading cached metrics');
          setMetrics(cachedData);
          setLastSync(new Date(timestamp));
        }
      }
    } catch (error) {
      console.warn('⚠️ [LinkedIn] Error loading cache:', error);
    }
  }, [metrics]);

  // ✅ AMÉLIORATION: Vérifier la disponibilité du proxy avec le gestionnaire d'API
  const checkProxyHealth = useCallback(async (): Promise<boolean> => {
    try {
      const healthData = await makeCall({
        endpoint: '/api/health',
        timeout: 2000,
        cacheDuration: 5000 // Cache 5 secondes pour éviter les appels répétés
      });
      
      const isReady = healthData && (healthData as any).status !== 'DOWN';
      
      if (isReady !== isProxyReady) {
        setIsProxyReady(isReady);
        console.log(`🔄 [LinkedIn] Proxy state changed: ${isReady ? 'READY' : 'NOT READY'}`);
      }
      
      return isReady;
    } catch (error) {
      console.debug('🔄 [LinkedIn] Health check failed:', (error as Error).message);
      
      if (isProxyReady) {
        setIsProxyReady(false);
      }
      return false;
    }
  }, [makeCall, isProxyReady]);

  // ✅ AMÉLIORATION: Surveillance proxy simplifiée avec le gestionnaire d'API
  const startProxyMonitoring = useCallback(() => {
    // Arrêter la surveillance existante
    if (proxyCheckIntervalRef.current) {
      clearInterval(proxyCheckIntervalRef.current);
    }
    
    console.log('🔄 [LinkedIn] Starting smart proxy monitoring...');
    
    const maxRetries = 8; // Réduit à 8 tentatives
    
    const scheduleNextCheck = () => {
      if (retryCountRef.current >= maxRetries) {
        console.warn('⚠️ [LinkedIn] Proxy monitoring stopped after maximum retries');
        return;
      }
      
      // Utiliser un intervalle fixe plus long grâce au cache du gestionnaire d'API
      const interval = 10000; // 10s fixe
      
      proxyCheckIntervalRef.current = setTimeout(async () => {
        const isReady = await checkProxyHealth();
        retryCountRef.current++;
        
        if (isReady) {
          console.log('✅ [LinkedIn] Proxy ready, stopping monitoring');
          
          // Continuer l'initialisation
          const authenticated = linkedinAPI.isAuthenticated();
          setIsAuthenticated(authenticated);
          
          if (authenticated) {
            loadCachedMetrics();
          }
        } else {
          // Programmer la prochaine vérification
          scheduleNextCheck();
        }
      }, interval);
      
      console.log(`🔄 [LinkedIn] Next check in ${interval/1000}s (retry ${retryCountRef.current + 1}/${maxRetries})`);
    };
    
    scheduleNextCheck();
  }, [checkProxyHealth, loadCachedMetrics]);

  // ✅ CORRECTION: Initialisation optimisée avec nettoyage
  useEffect(() => {
    // Éviter les initialisations multiples
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initializeLinkedIn = async () => {
      console.log('🚀 [LinkedIn] Initializing analytics...');
      
      // 1. Vérification configuration
      const clientSecret = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET;
      const configured = !!clientSecret;
      setIsConfigured(configured);
      
      if (!configured) {
        console.info('🔧 [LinkedIn] Demo mode - Credentials not configured');
        return;
      }
      
      // 2. Vérification proxy (une seule fois au démarrage)
      const proxyReady = await checkProxyHealth();
      
      if (proxyReady) {
        // 3. Vérification authentification
        const authenticated = linkedinAPI.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        // 4. Chargement cache si authentifié
        if (authenticated) {
          const lastSyncStr = localStorage.getItem('linkedin_last_sync');
          if (lastSyncStr) {
            setLastSync(new Date(lastSyncStr));
          }
          
          // Charger métriques en cache
          loadCachedMetrics();
        }
      } else {
        // 5. Surveillance proxy périodique uniquement si nécessaire
        startProxyMonitoring();
      }
    };

    initializeLinkedIn();

    // Nettoyage à la destruction du composant
    return () => {
      if (proxyCheckIntervalRef.current) {
        clearInterval(proxyCheckIntervalRef.current);
        proxyCheckIntervalRef.current = null;
      }
    };
  }, []); // ✅ CORRECTION: Dépendances vides pour éviter les re-exécutions

  // Démarrer l'authentification OAuth
  const authenticate = useCallback(() => {
    if (!isConfigured) {
      console.warn('⚠️ [LinkedIn] Attempting LinkedIn authentication without configured credentials');
      throw new Error('LinkedIn not configured. Please add VITE_LINKEDIN_CLIENT_SECRET to your .env file');
    }
    
    const authURL = linkedinAPI.getAuthURL();
    window.location.href = authURL;
  }, [isConfigured]);

  // ✅ CORRECTION: Récupérer les métriques avec gestion d'erreur améliorée
  const fetchMetrics = useCallback(async (period: '7d' | '30d' | '90d') => {
    setIsLoading(true);
    
    try {
      console.log(`🔄 [LinkedIn] Starting metrics retrieval (${period})`);
      
      const data = await linkedinAPI.getMetrics(period);
      
      console.log('✅ [LinkedIn] Metrics retrieved successfully');
      
      // Synchronisation avec cache
      setMetrics(data);
      const syncTime = new Date();
      setLastSync(syncTime);
      
      // Sauvegarder
      localStorage.setItem('linkedin_last_sync', syncTime.toISOString());
      localStorage.setItem('linkedin_cached_metrics', JSON.stringify({
        data,
        period,
        timestamp: syncTime.toISOString()
      }));
      
      console.log('💾 [LinkedIn] Metrics synchronized and saved');
      
    } catch (error) {
      console.error('❌ [LinkedIn] Error retrieving metrics:', error);
      
      // Garder les métriques existantes si disponibles
      if (!metrics) {
        loadCachedMetrics();
      }
    } finally {
      setIsLoading(false);
    }
  }, [metrics, loadCachedMetrics]);

  // Gérer le callback OAuth
  const handleOAuthCallback = useCallback(async (code: string): Promise<boolean> => {
    if (!isConfigured) {
      console.warn('⚠️ [LinkedIn] Attempting OAuth callback without configured credentials');
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
    localStorage.removeItem('linkedin_cached_metrics');
  }, []);

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