import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinkedInIntegrationTester } from '@/test/linkedin-integration-test';
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw } from 'lucide-react';

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const LinkedInTestComplete: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [authCode, setAuthCode] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [tester] = useState(() => new LinkedInIntegrationTester());

  // Récupération automatique du code d'autorisation depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setAuthCode(code);
      console.log('🔑 Code d\'autorisation détecté:', code);
    }
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const results = await tester.runAllTests(authCode, accessToken);
      setTestResults(results);
    } catch (error) {
      console.error('Erreur lors des tests:', error);
      setTestResults([{
        step: 'Erreur Système',
        status: 'error',
        message: 'Erreur inattendue lors de l\'exécution des tests',
        details: { error: error.message }
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const startLinkedInAuth = () => {
    const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
    const state = Math.random().toString(36).substring(7);
    const scope = 'openid profile email';

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', scope);

    window.location.href = authUrl.toString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Test Complet LinkedIn OAuth</h1>
        <p className="text-muted-foreground">
          Validation complète de l'intégration LinkedIn selon les bonnes pratiques
        </p>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tests">Tests Automatiques</TabsTrigger>
          <TabsTrigger value="manual">Test Manuel</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          {/* Résumé des tests */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Résumé des Tests
                  <Badge variant={successRate === 100 ? 'default' : errorCount > 0 ? 'destructive' : 'secondary'}>
                    {successRate}% Réussite
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{successCount}</div>
                    <div className="text-sm text-muted-foreground">Succès</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    <div className="text-sm text-muted-foreground">Erreurs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                    <div className="text-sm text-muted-foreground">Avertissements</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalTests}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
                
                {errorCount === 0 && totalTests > 0 && (
                  <Alert className="mt-4 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      🎉 Tous les tests critiques sont passés ! L'intégration LinkedIn est prête pour la production.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bouton de lancement des tests */}
          <Card>
            <CardHeader>
              <CardTitle>Lancer les Tests</CardTitle>
              <CardDescription>
                Exécute une suite complète de tests pour valider l'intégration LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Tests en cours...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Lancer tous les tests
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats des tests */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Résultats Détaillés</h3>
              {testResults.map((result, index) => (
                <Card key={index} className={`border-l-4 ${
                  result.status === 'success' ? 'border-l-green-500' :
                  result.status === 'error' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(result.status)}
                        {result.step}
                      </CardTitle>
                      {getStatusBadge(result.status)}
                    </div>
                    <CardDescription>{result.message}</CardDescription>
                  </CardHeader>
                  {result.details && (
                    <CardContent className="pt-0">
                      <details className="cursor-pointer">
                        <summary className="text-sm font-medium text-muted-foreground hover:text-foreground">
                          Voir les détails
                        </summary>
                        <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Manuel LinkedIn OAuth</CardTitle>
              <CardDescription>
                Testez manuellement le processus d'authentification LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Étape 1: Authentification</h4>
                <Button onClick={startLinkedInAuth} className="w-full">
                  🔗 Se connecter avec LinkedIn
                </Button>
                {authCode && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Code d'autorisation reçu: {authCode.substring(0, 20)}...
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Étape 2: Test avec Code</h4>
                <p className="text-sm text-muted-foreground">
                  Une fois connecté, relancez les tests pour valider l'échange de token
                </p>
                <Button 
                  onClick={runTests} 
                  disabled={!authCode || isRunning}
                  variant="outline"
                  className="w-full"
                >
                  Tester avec le code d'autorisation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Actuelle</CardTitle>
              <CardDescription>
                Vérifiez votre configuration LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client ID</label>
                  <div className="p-2 bg-muted rounded text-sm font-mono">
                    {import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'Non configuré'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Client Secret</label>
                  <div className="p-2 bg-muted rounded text-sm font-mono">
                    {import.meta.env.VITE_LINKEDIN_CLIENT_SECRET ? 
                      `${import.meta.env.VITE_LINKEDIN_CLIENT_SECRET.substring(0, 10)}...` : 
                      'Non configuré'
                    }
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Redirect URI</label>
                  <div className="p-2 bg-muted rounded text-sm font-mono">
                    {import.meta.env.VITE_LINKEDIN_REDIRECT_URI || 'Non configuré'}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Assurez-vous que ces valeurs correspondent exactement 
                  à celles configurées dans votre app LinkedIn Developer.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkedInTestComplete; 