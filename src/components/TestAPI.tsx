import React, { useEffect, useState } from 'react';
import { aiService } from '../lib/ai-service';
import { PerplexityDebug } from './PerplexityDebug';

type LogLevel = 'LOG' | 'ERROR' | 'WARN';

// Helper hissé pour éviter une imbrication trop profonde (Sonar S2004).
// Renvoie une fonction unique à brancher sur `console.{log,error,warn}`.
const buildLogCapture =
  (
    level: LogLevel,
    originals: { log: typeof console.log; error: typeof console.error; warn: typeof console.warn },
    appendLog: (message: string) => void,
  ) =>
  (...args: unknown[]): void => {
    const message = `[${level}] ${args.map(String).join(' ')}`;
    appendLog(message);
    if (level === 'LOG') originals.log(...args);
    else if (level === 'ERROR') originals.error(...args);
    else originals.warn(...args);
  };

export const TestAPI: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originals = { log: console.log, error: console.error, warn: console.warn };
    const appendLog = (message: string) => setLogs((prev) => [...prev.slice(-20), message]);
    console.log = buildLogCapture('LOG', originals, appendLog);
    console.error = buildLogCapture('ERROR', originals, appendLog);
    console.warn = buildLogCapture('WARN', originals, appendLog);
    return () => {
      console.log = originals.log;
      console.error = originals.error;
      console.warn = originals.warn;
    };
  }, []);

  const testAPI = async () => {
    setIsLoading(true);
    setResult('');
    setLogs([]);

    try {
      console.log('🧪 Début du test API...');

      const response = await aiService.generateContent({
        prompt: "je veux un article sur les enfants et l'IA",
        platform: 'linkedin',
        contentType: 'article',
        tone: 'Educatif & expert',
        maxTokens: 2000,
      });

      console.log('✅ Réponse reçue:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      setResult(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setLogs([]);

    try {
      console.log('🔗 Test de connexion aux APIs...');
      const connectionTest = await aiService.testConnection();
      console.log('📊 Résultat du test de connexion:', connectionTest);
      setResult(JSON.stringify(connectionTest, null, 2));
    } catch (error) {
      console.error('❌ Erreur lors du test de connexion:', error);
      setResult(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Test des APIs IA</h2>

      {/* Debug Perplexity */}
      <div className="mb-8">
        <PerplexityDebug />
      </div>

      <div className="space-y-4 mb-6">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Test en cours...' : 'Tester la connexion'}
        </button>

        <button
          onClick={testAPI}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {isLoading ? 'Génération en cours...' : 'Tester la génération'}
        </button>
      </div>

      {/* Logs en temps réel */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">📋 Logs en temps réel:</h3>
        <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">Aucun log pour le moment...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Résultat */}
      {result && (
        <div>
          <h3 className="text-lg font-semibold mb-2">📊 Résultat:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">{result}</pre>
        </div>
      )}

      {/* Informations sur l'environnement */}
      <div className="mt-6 p-4 bg-yellow-50 rounded">
        <h3 className="text-lg font-semibold mb-2">🔧 Informations d'environnement:</h3>
        <div className="text-sm space-y-1">
          <p>
            <strong>Mode:</strong> {import.meta.env.MODE}
          </p>
          <p>
            <strong>Variables API disponibles:</strong>{' '}
            {Object.keys(import.meta.env)
              .filter((key) => key.includes('API'))
              .join(', ') || 'Aucune'}
          </p>
          <p>
            <strong>OpenAI Key présente:</strong>{' '}
            {import.meta.env.VITE_OPENAI_API_KEY ? '✅ Oui' : '❌ Non'}
          </p>
          <p>
            <strong>Anthropic Key présente:</strong>{' '}
            {import.meta.env.VITE_ANTHROPIC_API_KEY ? '✅ Oui' : '❌ Non'}
          </p>
        </div>
      </div>
    </div>
  );
};
