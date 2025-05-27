import React from 'react';
import LinkedInDebugButton from '@/components/LinkedInDebugButton';

const LinkedInDebug: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            🔍 Debug LinkedIn
          </h1>
          <p className="text-slate-600">
            Page de diagnostic pour résoudre les problèmes de bouton LinkedIn
          </p>
        </div>

        <LinkedInDebugButton />

        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            🛠️ Diagnostic Rapide
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Si vous voyez le bouton "Se connecter à LinkedIn", la configuration est OK</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Si le bouton n'apparaît pas, vérifiez les variables d'environnement</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Ouvrez la console (F12) pour voir les logs détaillés</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex space-x-4 text-sm text-slate-600">
            <a href="/linkedin-test-simple" className="hover:text-blue-600 underline">
              → Test Simple
            </a>
            <a href="/linkedin-test-complete" className="hover:text-blue-600 underline">
              → Test Complet
            </a>
            <a href="/" className="hover:text-blue-600 underline">
              → Accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInDebug; 