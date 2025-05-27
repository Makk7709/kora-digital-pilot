import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLinkedInStats } from '@/hooks/useLinkedInStats';
import { useLinkedInAnalytics } from '@/hooks/useLinkedInAnalytics';
import { useToast } from '@/hooks/use-toast';
import StatsCard from './StatsCard';
import LinkedInAuth from './LinkedInAuth';
import { 
  TestTube, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Wifi,
  Clock,
  Activity
} from 'lucide-react';

const LinkedInStatsTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    authentication: 'pending' | 'success' | 'error';
    connectivity: 'pending' | 'success' | 'error';
    dataFetch: 'pending' | 'success' | 'error';
    lastTest: Date | null;
  }>({
    authentication: 'pending',
    connectivity: 'pending',
    dataFetch: 'pending',
    lastTest: null
  });

  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showStatsCard, setShowStatsCard] = useState(false);

  const { 
    isAuthenticated: isLinkedInConnected,
    testConnection,
    fetchMetrics
  } = useLinkedInAnalytics();

  const {
    connectionStatus,
    metrics,
    refreshStats,
    error
  } = useLinkedInStats(false); // Pas d'auto-refresh pour les tests

  const { toast } = useToast();

  // Exécuter tous les tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults({
      authentication: 'pending',
      connectivity: 'pending',
      dataFetch: 'pending',
      lastTest: null
    });

    try {
      // Test 1: Authentification
      console.log('🔍 Test 1: Vérification authentification...');
      const authResult = isLinkedInConnected;
      setTestResults(prev => ({
        ...prev,
        authentication: authResult ? 'success' : 'error'
      }));

      if (!authResult) {
        toast({
          title: "Test d'authentification échoué",
          description: "Veuillez vous connecter à LinkedIn d'abord",
          variant: "destructive",
        });
        setIsRunningTests(false);
        return;
      }

      // Test 2: Connectivité
      console.log('🔍 Test 2: Test de connectivité...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Délai pour l'UX
      
      const connectivityResult = await testConnection();
      setTestResults(prev => ({
        ...prev,
        connectivity: connectivityResult ? 'success' : 'error'
      }));

      if (!connectivityResult) {
        toast({
          title: "Test de connectivité échoué",
          description: "Impossible de se connecter à l'API LinkedIn",
          variant: "destructive",
        });
      }

      // Test 3: Récupération des données
      console.log('🔍 Test 3: Récupération des métriques...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Délai pour l'UX
      
      try {
        await fetchMetrics('7d');
        setTestResults(prev => ({
          ...prev,
          dataFetch: 'success',
          lastTest: new Date()
        }));

        toast({
          title: "Tests réussis !",
          description: "Toutes les fonctionnalités LinkedIn sont opérationnelles",
        });

        // Afficher automatiquement le StatsCard après des tests réussis
        setShowStatsCard(true);

      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          dataFetch: 'error',
          lastTest: new Date()
        }));

        toast({
          title: "Test de récupération échoué",
          description: "Erreur lors de la récupération des métriques",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erreur lors des tests:', error);
      toast({
        title: "Erreur de test",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // Test individuel de récupération des stats
  const testStatsRefresh = async () => {
    try {
      await refreshStats('7d');
      toast({
        title: "Test de rafraîchissement réussi",
        description: "Les statistiques ont été mises à jour",
      });
    } catch (error) {
      toast({
        title: "Test de rafraîchissement échoué",
        description: "Erreur lors de la mise à jour des statistiques",
        variant: "destructive",
      });
    }
  };

  // Composant d'indicateur de test
  const TestIndicator = ({ 
    status, 
    label 
  }: { 
    status: 'pending' | 'success' | 'error'; 
    label: string; 
  }) => {
    const getConfig = () => {
      switch (status) {
        case 'success':
          return {
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
          };
        case 'error':
          return {
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          };
        default:
          return {
            icon: AlertTriangle,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
          };
      }
    };

    const config = getConfig();
    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
        <span className={`font-medium ${config.color}`}>{label}</span>
        {isRunningTests && status === 'pending' && (
          <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Panel de test principal */}
      <Card className="premium-card">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <TestTube className="w-4 h-4 text-white" />
            </div>
            <span>Test de Connectivité LinkedIn</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Statut de connexion actuel */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Statut actuel</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Wifi className={`w-4 h-4 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">
                    Connexion: <strong>{connectionStatus === 'connected' ? 'Active' : 'Inactive'}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className={`w-4 h-4 ${metrics ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className="text-sm">
                    Données: <strong>{metrics ? 'Disponibles' : 'Non disponibles'}</strong>
                  </span>
                </div>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Erreur:</strong> {error}
                  </p>
                </div>
              )}
            </div>

            {/* Résultats des tests */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Résultats des tests</h4>
              <TestIndicator status={testResults.authentication} label="Authentification LinkedIn" />
              <TestIndicator status={testResults.connectivity} label="Connectivité API" />
              <TestIndicator status={testResults.dataFetch} label="Récupération des données" />
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button
                onClick={runAllTests}
                disabled={isRunningTests}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Tests en cours...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Lancer tous les tests
                  </>
                )}
              </Button>

              <Button
                onClick={testStatsRefresh}
                disabled={!isLinkedInConnected || isRunningTests}
                variant="outline"
              >
                <Activity className="w-4 h-4 mr-2" />
                Test rafraîchissement
              </Button>

              <Button
                onClick={() => setShowStatsCard(!showStatsCard)}
                variant="outline"
              >
                {showStatsCard ? 'Masquer' : 'Afficher'} StatsCard
              </Button>
            </div>

            {/* Informations de debug */}
            {testResults.lastTest && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Dernier test</span>
                </div>
                <p className="text-sm text-blue-700">
                  {testResults.lastTest.toLocaleString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Authentification LinkedIn si nécessaire */}
      {!isLinkedInConnected && (
        <LinkedInAuth onAuthSuccess={() => {
          toast({
            title: "Connexion réussie !",
            description: "Vous pouvez maintenant lancer les tests",
          });
        }} />
      )}

      {/* StatsCard de démonstration */}
      {showStatsCard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Démonstration StatsCard
            </h3>
            <Badge variant="secondary">
              Mode {isLinkedInConnected ? 'Données réelles' : 'Simulation'}
            </Badge>
          </div>
          
          <StatsCard 
            period="7d"
            autoRefresh={false} // Pas d'auto-refresh en mode test
            showPosts={true}
            className="border-2 border-purple-200"
          />
        </div>
      )}

      {/* Logs de debug */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-slate-900 text-sm">Logs de Debug</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs space-y-1">
            <div>🔍 LinkedIn API Status: {connectionStatus}</div>
            <div>📊 Metrics Available: {metrics ? 'Yes' : 'No'}</div>
            <div>🔐 Authenticated: {isLinkedInConnected ? 'Yes' : 'No'}</div>
            <div>⚠️ Error: {error || 'None'}</div>
            <div>🕒 Last Update: {testResults.lastTest?.toISOString() || 'Never'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkedInStatsTest; 