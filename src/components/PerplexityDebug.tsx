import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePerplexity } from '@/hooks/usePerplexity';

export const PerplexityDebug: React.FC = () => {
  const perplexity = usePerplexity();
  const [envInfo, setEnvInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // Collecter les informations d'environnement
    const info = {
      apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
      apiKeyLength: import.meta.env.VITE_PERPLEXITY_API_KEY?.length || 0,
      apiKeyPrefix: import.meta.env.VITE_PERPLEXITY_API_KEY?.substring(0, 10) || '',
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
    };
    setEnvInfo(info);
  }, []);

  const testPerplexityCall = async () => {
    setTestResult('Test en cours...');
    try {
      const result = await perplexity.generateContentWithResearch('Test IA', 'post');
      if (result) {
        setTestResult(`✅ Succès: ${result.content.substring(0, 100)}...`);
      } else {
        setTestResult('❌ Aucun résultat retourné');
      }
    } catch (error) {
      setTestResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Perplexity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* État du hook */}
          <div>
            <h3 className="font-semibold mb-2">État du Hook usePerplexity</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                Initialisé:{' '}
                <Badge variant={perplexity.isInitialized ? 'default' : 'destructive'}>
                  {perplexity.isInitialized ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div>
                Mode Simulation:{' '}
                <Badge variant={perplexity.isSimulationMode ? 'secondary' : 'default'}>
                  {perplexity.isSimulationMode ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div>
                En cours:{' '}
                <Badge variant={perplexity.isLoading ? 'secondary' : 'outline'}>
                  {perplexity.isLoading ? 'Oui' : 'Non'}
                </Badge>
              </div>
              <div>
                Erreur:{' '}
                <Badge variant={perplexity.error ? 'destructive' : 'outline'}>
                  {perplexity.error || 'Aucune'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Variables d'environnement */}
          <div>
            <h3 className="font-semibold mb-2">Variables d'Environnement</h3>
            <div className="text-sm space-y-1">
              <div>
                Mode: <code>{envInfo.mode}</code>
              </div>
              <div>
                Dev: <code>{envInfo.dev?.toString()}</code>
              </div>
              <div>
                Clé API: <code>{envInfo.apiKeyPrefix}...</code>
              </div>
              <div>
                Longueur: <code>{envInfo.apiKeyLength} caractères</code>
              </div>
            </div>
          </div>

          {/* Test de validation */}
          <div>
            <h3 className="font-semibold mb-2">Test de Validation</h3>
            <div className="text-sm space-y-1">
              {(() => {
                const apiKey = envInfo.apiKey;
                const checks = [
                  { name: 'Clé existe', result: !!apiKey },
                  { name: 'Pas de démo', result: apiKey !== 'demo_key_for_testing' },
                  { name: 'Pas de placeholder', result: apiKey !== 'your_perplexity_api_key_here' },
                  { name: 'Longueur > 10', result: apiKey && apiKey.length > 10 },
                ];

                return checks.map((check, index) => (
                  <div key={`row-${index}`}>
                    {check.name}:{' '}
                    <Badge variant={check.result ? 'default' : 'destructive'}>
                      {check.result ? 'OK' : 'KO'}
                    </Badge>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Cache */}
          <div>
            <h3 className="font-semibold mb-2">Cache</h3>
            <div className="text-sm">
              Taille: <Badge variant="outline">{perplexity.cacheStats.size}</Badge>
            </div>
          </div>

          {/* Test d'appel */}
          <div>
            <h3 className="font-semibold mb-2">Test d'Appel API</h3>
            <Button onClick={testPerplexityCall} disabled={perplexity.isLoading} className="mb-2">
              Tester un Appel
            </Button>
            {testResult && <div className="p-2 bg-gray-100 rounded text-sm">{testResult}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
