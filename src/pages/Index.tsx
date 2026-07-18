import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { CommunityManagerDashboard } from '../components/CommunityManagerDashboard';
import { CommunityManagerDomainDashboard } from '../components/CommunityManagerDomainDashboard';
import InspirationAI from '../components/InspirationAI';
import ImageGenerator from '../components/ImageGenerator';
import { PlanningWithPerplexity } from '../components/PlanningWithPerplexity';
import Analytics from '../components/Analytics';
import Library from '../components/Library';
import { BrandMonitoring } from '../components/BrandMonitoring';
import { BrandIntelligenceDashboard } from '../components/enhanced/BrandIntelligenceDashboard';
import DataModeBanner from '../components/DataModeBanner';
import { usePerplexity } from '../hooks/usePerplexity';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [brandNameForTDD, setBrandNameForTDD] = useState('');

  const { isInitialized, initializeService, getBusinessInsights, getCompetitorAnalysis } =
    usePerplexity();

  // === INITIALISATION DU SERVICE PERPLEXITY ===
  React.useEffect(() => {
    if (!isInitialized) {
      const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
      if (apiKey && apiKey !== 'your_perplexity_api_key_here') {
        initializeService({
          apiKey,
          model: import.meta.env.VITE_PERPLEXITY_MODEL || 'llama-3.1-sonar-small-128k-online',
          maxTokens: parseInt(import.meta.env.VITE_PERPLEXITY_MAX_TOKENS) || 1000,
          temperature: parseFloat(import.meta.env.VITE_PERPLEXITY_TEMPERATURE) || 0.2,
        });
      }
    }
  }, [isInitialized, initializeService]);

  // === LISTENER POUR NAVIGATION TDD ===
  React.useEffect(() => {
    const handleNavigateToTDD = (event: any) => {
      setActiveSection(event.detail.section);
    };

    window.addEventListener('navigate-to-tdd', handleNavigateToTDD);
    return () => window.removeEventListener('navigate-to-tdd', handleNavigateToTDD);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'cm-dashboard':
        return <CommunityManagerDashboard />;
      case 'cm-domain-search':
        return <CommunityManagerDomainDashboard />;
      case 'brand-monitoring':
        return <BrandMonitoring />;
      case 'brand-intelligence-tdd':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold mb-4">🧠 Brand Intelligence TDD Enhanced</h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la marque à analyser
                  </label>
                  <input
                    type="text"
                    value={brandNameForTDD}
                    onChange={(e) => setBrandNameForTDD(e.target.value)}
                    placeholder="Ex: Nike, Apple, Tesla..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {!isInitialized && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Service Perplexity en cours d'initialisation... Assurez-vous que votre clé
                    API est configurée.
                  </p>
                </div>
              )}
            </div>

            {brandNameForTDD && isInitialized && (
              <BrandIntelligenceDashboard
                brandName={brandNameForTDD}
                perplexityService={{
                  getBusinessInsights,
                  getCompetitorAnalysis,
                }}
              />
            )}
          </div>
        );
      case 'inspiration':
        return <InspirationAI />;
      case 'images':
        return <ImageGenerator />;
      case 'planning':
        return <PlanningWithPerplexity />;
      case 'analytics':
        return <Analytics />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DataModeBanner />
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Index;
