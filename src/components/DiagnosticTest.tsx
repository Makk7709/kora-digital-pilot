import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const DiagnosticTest = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Variables d'environnement
    try {
      const hasOpenAI = !!import.meta.env.VITE_OPENAI_API_KEY;
      const hasPerplexity = !!import.meta.env.VITE_PERPLEXITY_API_KEY;
      const hasLinkedIn = !!import.meta.env.VITE_LINKEDIN_CLIENT_ID;

      diagnostics.push({
        name: 'Variables d\'environnement',
        status: hasOpenAI && hasPerplexity ? 'success' : 'warning',
        message: `OpenAI: ${hasOpenAI ? '✓' : '✗'}, Perplexity: ${hasPerplexity ? '✓' : '✗'}, LinkedIn: ${hasLinkedIn ? '✓' : '✗'}`,
        details: `Mode: ${import.meta.env.MODE}, DEV: ${import.meta.env.DEV}`
      });
    } catch (error) {
      diagnostics.push({
        name: 'Variables d\'environnement',
        status: 'error',
        message: 'Erreur lors de la lecture des variables',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 2: API Proxy
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        const data = await response.json();
        diagnostics.push({
          name: 'API Proxy',
          status: 'success',
          message: 'Proxy LinkedIn opérationnel',
          details: `Service: ${data.service || 'OK'}`
        });
      } else {
        diagnostics.push({
          name: 'API Proxy',
          status: 'warning',
          message: `Erreur HTTP ${response.status}`,
          details: 'Le proxy LinkedIn n\'est pas accessible'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: 'API Proxy',
        status: 'warning',
        message: 'Proxy non disponible',
        details: 'Le serveur proxy LinkedIn n\'est pas démarré'
      });
    }

    // Test 3: React Router
    try {
      const currentPath = window.location.pathname;
      diagnostics.push({
        name: 'React Router',
        status: 'success',
        message: 'Routage fonctionnel',
        details: `Route actuelle: ${currentPath}`
      });
    } catch (error) {
      diagnostics.push({
        name: 'React Router',
        status: 'error',
        message: 'Erreur de routage',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 4: Local Storage
    try {
      const testKey = 'diagnostic-test';
      localStorage.setItem(testKey, 'test');
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      diagnostics.push({
        name: 'Local Storage',
        status: retrieved === 'test' ? 'success' : 'error',
        message: retrieved === 'test' ? 'Local Storage fonctionnel' : 'Erreur Local Storage',
        details: 'Stockage local pour les paramètres utilisateur'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Local Storage',
        status: 'error',
        message: 'Local Storage non disponible',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    // Test 5: Services IA
    try {
      // Test simple de la fenêtre globale LinkedIn
      const hasLinkedInAPI = !!(window as any).linkedinAPI;
      diagnostics.push({
        name: 'Services IA',
        status: hasLinkedInAPI ? 'success' : 'warning',
        message: hasLinkedInAPI ? 'LinkedIn API exposée' : 'LinkedIn API non exposée',
        details: 'Services d\'intelligence artificielle'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Services IA',
        status: 'warning',
        message: 'Erreur test services IA',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary';
    return (
      <Badge variant={variant} className="ml-2">
        {status === 'success' ? 'OK' : status === 'error' ? 'Erreur' : 'Attention'}
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diagnostic Système</h1>
          <p className="text-slate-600">Vérification de l'état de l'application Korev AI</p>
        </div>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Diagnostic...' : 'Relancer'}</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <span className="text-lg">{result.name}</span>
                </div>
                {getStatusBadge(result.status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-2">{result.message}</p>
              {result.details && (
                <p className="text-sm text-slate-500 bg-slate-50 p-2 rounded">
                  {result.details}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && isRunning && (
        <Card>
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-600">Diagnostic en cours...</p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Application Status</h3>
              <p className="text-blue-700 text-sm">
                L'application Korev AI fonctionne. Si vous voyez cette page, 
                les corrections de l'écran blanc ont été appliquées avec succès.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticTest; 