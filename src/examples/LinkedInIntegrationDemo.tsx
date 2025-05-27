import React from 'react';
import LinkedInDashboardWidget from '@/components/LinkedInDashboardWidget';
import LinkedInExport from '@/components/LinkedInExport';
import StatsCard from '@/components/StatsCard';
import LinkedInAuth from '@/components/LinkedInAuth';

/**
 * 🚀 Démonstration de l'Intégration LinkedIn Enhanced
 * 
 * Ce fichier montre comment utiliser tous les composants de l'intégration LinkedIn
 * dans différents contextes d'application.
 */

const LinkedInIntegrationDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">
          🔗 LinkedIn Integration Demo
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Démonstration complète de l'intégration LinkedIn avec cache intelligent, 
          widgets dashboard, export de données et notifications automatiques.
        </p>
      </div>

      {/* 1. Authentification LinkedIn */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          1. 🔐 Authentification LinkedIn
        </h2>
        <div className="max-w-md">
          <LinkedInAuth onAuthSuccess={() => console.log('Auth success!')} />
        </div>
      </section>

      {/* 2. Widget Dashboard Complet */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          2. 📊 Widget Dashboard Complet
        </h2>
        <p className="text-slate-600">
          Widget principal avec métriques, sélecteur de période et navigation.
        </p>
        <LinkedInDashboardWidget />
      </section>

      {/* 3. Widget Compact */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          3. 📱 Widget Compact (Sidebar)
        </h2>
        <p className="text-slate-600">
          Version compacte pour sidebars et espaces restreints.
        </p>
        <div className="max-w-sm">
          <LinkedInDashboardWidget compact={true} />
        </div>
      </section>

      {/* 4. Carte de Statistiques Avancée */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          4. 📈 Carte de Statistiques Avancée
        </h2>
        <p className="text-slate-600">
          Affichage détaillé avec cache intelligent et notifications automatiques.
        </p>
        <StatsCard 
          period="30d"
          autoRefresh={true}
          refreshInterval={300000}
          showPosts={true}
        />
      </section>

      {/* 5. Export de Données */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          5. 📤 Export de Données
        </h2>
        <p className="text-slate-600">
          Export des métriques en CSV ou JSON avec validation automatique.
        </p>
        <div className="max-w-md">
          <LinkedInExport />
        </div>
      </section>

      {/* 6. Exemples d'Intégration */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          6. 💻 Exemples d'Intégration
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dashboard Principal */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Dashboard Principal</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 overflow-x-auto">
{`// Dashboard.tsx
import LinkedInDashboardWidget from '@/components/LinkedInDashboardWidget';

export const Dashboard = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <LinkedInDashboardWidget />
    {/* Autres widgets */}
  </div>
);`}
              </pre>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Sidebar Compacte</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 overflow-x-auto">
{`// Sidebar.tsx
import LinkedInDashboardWidget from '@/components/LinkedInDashboardWidget';

export const Sidebar = () => (
  <div className="space-y-4">
    <LinkedInDashboardWidget compact={true} />
    {/* Autres widgets compacts */}
  </div>
);`}
              </pre>
            </div>
          </div>

          {/* Hook Personnalisé */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Hook avec Cache</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 overflow-x-auto">
{`// CustomComponent.tsx
import { useLinkedInStats } from '@/hooks/useLinkedInStats';

export const CustomComponent = () => {
  const {
    metrics,
    cacheInfo,
    clearCache,
    refreshStats
  } = useLinkedInStats(
    true,    // autoRefresh
    300000,  // 5min refresh
    120000   // 2min cache
  );

  return (
    <div>
      {cacheInfo.isFromCache && (
        <p>Cache: {cacheInfo.cacheAge}min</p>
      )}
      {/* Affichage des métriques */}
    </div>
  );
};`}
              </pre>
            </div>
          </div>

          {/* Export Personnalisé */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Export Personnalisé</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 overflow-x-auto">
{`// ExportPage.tsx
import LinkedInExport from '@/components/LinkedInExport';

export const ExportPage = () => (
  <div className="max-w-2xl mx-auto">
    <h1>Export des Données</h1>
    <LinkedInExport className="mt-6" />
  </div>
);`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Configuration Avancée */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          7. ⚙️ Configuration Avancée
        </h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">Variables d'Environnement</h3>
          <pre className="text-sm text-blue-800 bg-blue-100 rounded p-3 overflow-x-auto">
{`# .env.local
VITE_LINKEDIN_CLIENT_ID=your_client_id
VITE_LINKEDIN_CLIENT_SECRET=your_client_secret
VITE_LINKEDIN_REDIRECT_URI=http://localhost:5173/auth/linkedin/callback`}
          </pre>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-900 mb-3">Configuration du Cache</h3>
          <pre className="text-sm text-green-800 bg-green-100 rounded p-3 overflow-x-auto">
{`// Configuration personnalisée du cache
const {
  metrics,
  cacheInfo,
  clearCache
} = useLinkedInStats(
  true,      // autoRefresh activé
  180000,    // refresh toutes les 3 minutes
  60000      // cache pendant 1 minute
);

// Vider le cache manuellement
const handleClearCache = () => {
  clearCache();
  console.log('Cache vidé, nouvelles données en cours de récupération...');
};`}
          </pre>
        </div>
      </section>

      {/* 8. Fonctionnalités Avancées */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          8. 🚀 Fonctionnalités Avancées
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🧠 Cache Intelligent</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Cache automatique 2min</li>
              <li>• Indicateurs visuels</li>
              <li>• Vidage manuel</li>
              <li>• Performance optimisée</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-2">🔔 Notifications</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Détection auto des pics</li>
              <li>• Seuil configurable</li>
              <li>• Toasts informatifs</li>
              <li>• Feedback temps réel</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📊 Widgets Flexibles</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mode normal/compact</li>
              <li>• Sélecteur de période</li>
              <li>• Navigation intégrée</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">📤 Export Avancé</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Formats CSV/JSON</li>
              <li>• Données complètes</li>
              <li>• Validation auto</li>
              <li>• Horodatage inclus</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 border-t border-slate-200">
        <p className="text-slate-500 text-sm">
          🔗 LinkedIn Integration Enhanced v2.0.0 - Korev Digital Pilot
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Développé avec ❤️ et ⚡ pour une expérience utilisateur optimale
        </p>
      </div>
    </div>
  );
};

export default LinkedInIntegrationDemo; 