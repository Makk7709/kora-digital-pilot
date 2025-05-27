import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import { CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';

const AIConnectionTest = () => {
  const [testResults, setTestResults] = useState<{ openai: boolean; anthropic: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { testConnection, generateContent } = useAI();

  const runConnectionTest = async () => {
    setIsTesting(true);
    try {
      const results = await testConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Test de connexion échoué:', error);
      setTestResults({ openai: false, anthropic: false });
    } finally {
      setIsTesting(false);
    }
  };

  const runQuickGeneration = async () => {
    setIsTesting(true);
    try {
      const response = await generateContent({
        prompt: "Créer un court message de test pour vérifier que l'IA fonctionne",
        platform: "linkedin",
        contentType: "post",
        tone: "Professionnel & stratégique",
        maxTokens: 100,
      });
      
      console.log('Test de génération réussi:', response);
      alert(`Test réussi avec ${response.model}!\n\nContenu généré:\n${response.content.substring(0, 100)}...`);
    } catch (error) {
      console.error('Test de génération échoué:', error);
      alert('Test de génération échoué. Vérifiez vos clés API.');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <RefreshCw className="w-4 h-4 text-gray-400" />;
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return "Non testé";
    return status ? "Connecté" : "Échec";
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return "border-gray-300 text-gray-600";
    return status ? "border-green-300 text-green-600" : "border-red-300 text-red-600";
  };

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-slate-800 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span>Test de Connectivité IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OpenAI Status */}
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">AI</span>
              </div>
              <div>
                <p className="font-medium text-slate-700">OpenAI</p>
                <p className="text-xs text-slate-500">GPT-4o, GPT-3.5</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(testResults?.openai ?? null)}
              <Badge variant="outline" className={getStatusColor(testResults?.openai ?? null)}>
                {getStatusText(testResults?.openai ?? null)}
              </Badge>
            </div>
          </div>

          {/* Anthropic Status */}
          <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">C</span>
              </div>
              <div>
                <p className="font-medium text-slate-700">Anthropic</p>
                <p className="text-xs text-slate-500">Claude-3 Sonnet</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(testResults?.anthropic ?? null)}
              <Badge variant="outline" className={getStatusColor(testResults?.anthropic ?? null)}>
                {getStatusText(testResults?.anthropic ?? null)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={runConnectionTest}
            disabled={isTesting}
            variant="outline"
            className="flex-1"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tester la connexion
              </>
            )}
          </Button>

          <Button 
            onClick={runQuickGeneration}
            disabled={isTesting}
            className="flex-1 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Test génération
              </>
            )}
          </Button>
        </div>

        {testResults && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Résultats du test :</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">
                • OpenAI : {testResults.openai ? '✅ Fonctionnel' : '❌ Échec'}
              </p>
              <p className="text-xs text-slate-500">
                • Anthropic : {testResults.anthropic ? '✅ Fonctionnel' : '❌ Échec'}
              </p>
              {!testResults.openai && !testResults.anthropic && (
                <p className="text-xs text-amber-600 mt-2">
                  ⚠️ Aucune API connectée. Vérifiez vos clés dans .env.local
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-medium mb-1">💡 Configuration requise :</p>
          <p className="text-xs text-blue-600">
            Ajoutez vos clés API dans le fichier .env.local :
          </p>
          <code className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded mt-1 block">
            VITE_OPENAI_API_KEY=sk-proj-...
            <br />
            VITE_ANTHROPIC_API_KEY=sk-ant-...
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIConnectionTest; 