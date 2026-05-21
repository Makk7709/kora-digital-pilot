/**
 * 🧪 PERPLEXITY TEST WIDGET
 * Widget de test simple pour vérifier les appels API Perplexity
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Loader2, CheckCircle, AlertCircle, Brain, Zap } from 'lucide-react';
import { createPerplexityService } from '../lib/perplexity-service';

interface TestResult {
  success: boolean;
  response?: any;
  error?: string;
  duration: number;
  timestamp: Date;
}

export const PerplexityTestWidget: React.FC = () => {
  const [query, setQuery] = useState("Qu'est-ce que Tesla ?");
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  // Vérification de la clé API au chargement
  React.useEffect(() => {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (apiKey && apiKey.startsWith('pplx-') && apiKey.length > 20) {
      setApiKeyStatus('valid');
    } else {
      setApiKeyStatus('invalid');
    }
  }, []);

  const testPerplexityCall = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setTestResult(null);

    const startTime = Date.now();

    try {
      console.log('🧪 [TEST] Démarrage test Perplexity avec query:', query);

      // Créer le service avec configuration de test
      const perplexityService = createPerplexityService({
        apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
        model: 'sonar-pro',
        maxTokens: 1000,
        temperature: 0.2,
      });

      console.log('🔧 [TEST] Service créé, appel API...');

      const response = await perplexityService.getBusinessInsights({
        query,
        context: 'Test direct API Perplexity',
        depth: 'quick',
        language: 'fr',
      });

      const duration = Date.now() - startTime;

      console.log('✅ [TEST] Réponse reçue:', {
        contentLength: response.content.length,
        duration,
        model: response.model,
        sources: response.sources.length,
      });

      setTestResult({
        success: true,
        response,
        duration,
        timestamp: new Date(),
      });
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error('❌ [TEST] Erreur Perplexity:', error);

      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        duration,
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (apiKeyStatus === 'checking') {
      return (
        <Badge variant="secondary">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Vérification...
        </Badge>
      );
    }
    if (apiKeyStatus === 'valid') {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          API Configurée
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <AlertCircle className="w-3 h-3 mr-1" />
        API Non Configurée
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Test API Perplexity
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Configuration API */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Configuration API</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Clé API:</span>
              <span className="ml-2 font-mono">
                {import.meta.env.VITE_PERPLEXITY_API_KEY
                  ? `${import.meta.env.VITE_PERPLEXITY_API_KEY.substring(0, 8)}...`
                  : 'Non configurée'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Modèle:</span>
              <span className="ml-2 font-mono">sonar-pro</span>
            </div>
          </div>
        </div>

        {/* Test d'appel */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Test d'Appel API</label>

          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Votre question de test..."
              disabled={isLoading || apiKeyStatus !== 'valid'}
            />
            <Button
              onClick={testPerplexityCall}
              disabled={isLoading || !query.trim() || apiKeyStatus !== 'valid'}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Test...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Tester
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Résultat du test */}
        {testResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Succès
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Échec
                </Badge>
              )}
              <span className="text-sm text-gray-500">
                {testResult.duration}ms - {testResult.timestamp.toLocaleTimeString()}
              </span>
            </div>

            {testResult.success && testResult.response ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Contenu:</span>
                    <span className="ml-2 font-mono">
                      {testResult.response.content.length} chars
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Sources:</span>
                    <span className="ml-2 font-mono">{testResult.response.sources.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tokens:</span>
                    <span className="ml-2 font-mono">{testResult.response.usage.total_tokens}</span>
                  </div>
                </div>

                <ScrollArea className="h-32 w-full border rounded p-3">
                  <div className="text-sm whitespace-pre-wrap">{testResult.response.content}</div>
                </ScrollArea>
              </div>
            ) : (
              testResult.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="text-sm text-red-700">
                    <strong>Erreur:</strong> {testResult.error}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Suggestions */}
        <div className="flex gap-2 flex-wrap">
          {[
            "Qu'est-ce que Tesla ?",
            'Dernières nouvelles Apple',
            'Tendances IA 2024',
            'Innovation Microsoft',
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setQuery(suggestion)}
              disabled={isLoading}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerplexityTestWidget;
