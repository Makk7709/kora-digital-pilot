import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LinkedInStatsTest from '@/components/LinkedInStatsTest';
import LinkedInDashboardWidget from '@/components/LinkedInDashboardWidget';
import LinkedInExport from '@/components/LinkedInExport';

const LinkedInTest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/app')}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Test LinkedIn Integration</h1>
                <p className="text-sm text-slate-600">Vérification et test des fonctionnalités LinkedIn</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Mode Test
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🔗</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">
                  Test d'Intégration LinkedIn
                </h2>
                <p className="text-slate-600 mb-4">
                  Cette page permet de tester et vérifier toutes les fonctionnalités de l'intégration LinkedIn :
                  authentification, récupération des métriques, affichage des statistiques et gestion des erreurs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-700">Authentification OAuth 2.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700">Récupération des métriques</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-700">Affichage temps réel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-700">Export de données</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Composant de test principal */}
          <LinkedInStatsTest />

          {/* Démonstration des widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Widget Dashboard */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Widget Dashboard
              </h3>
              <LinkedInDashboardWidget />
            </div>

            {/* Widget Compact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Widget Compact
              </h3>
              <div className="max-w-sm">
                <LinkedInDashboardWidget compact={true} />
              </div>
            </div>
          </div>

          {/* Export de données */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Export de Données
            </h3>
            <LinkedInExport />
          </div>

          {/* Instructions et documentation */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Instructions de Test
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Étapes de Test</h4>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                    <span>Cliquez sur "Se connecter avec LinkedIn" si pas encore connecté</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                    <span>Lancez les tests automatiques pour vérifier la connectivité</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                    <span>Affichez le StatsCard pour voir les métriques en action</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                    <span>Testez le rafraîchissement manuel des données</span>
                  </li>
                </ol>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Fonctionnalités Testées</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Authentification et gestion des tokens</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Test de connectivité API</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Récupération des métriques (portée, engagement, clics)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Affichage des posts les plus performants</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Gestion des erreurs et fallback</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Animations de chargement et indicateurs visuels</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Informations techniques */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Informations Techniques
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Hooks Utilisés</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• <code className="bg-slate-200 px-1 rounded">useLinkedInStats</code></li>
                  <li>• <code className="bg-slate-200 px-1 rounded">useLinkedInAnalytics</code></li>
                  <li>• <code className="bg-slate-200 px-1 rounded">useToast</code></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Composants</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• <code className="bg-slate-200 px-1 rounded">StatsCard</code></li>
                  <li>• <code className="bg-slate-200 px-1 rounded">LinkedInAuth</code></li>
                  <li>• <code className="bg-slate-200 px-1 rounded">LinkedInStatsTest</code></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 mb-2">API & Services</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• <code className="bg-slate-200 px-1 rounded">linkedinAPI</code></li>
                  <li>• OAuth 2.0 Flow</li>
                  <li>• Fallback Data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInTest; 