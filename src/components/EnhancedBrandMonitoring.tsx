/**
 * 🚀 ENHANCED BRAND MONITORING - ULTRA PREMIUM
 * Composant de veille de marque nouvelle génération avec analyse de société
 * UX/UI Premium - Performance optimisée - TDD Ready
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';
import { 
  Eye, 
  Building2, 
  TrendingUp, 
  Search, 
  Brain,
  Shield,
  Zap,
  Target,
  Users,
  Globe,
  BarChart3,
  Activity,
  Settings,
  ChevronRight,
  Star,
  Award
} from 'lucide-react';

import { CompanyAnalysisWidget } from './CompanyAnalysisWidget';
import { BrandMonitoring } from './BrandMonitoring';
import { APIUsageProtection } from './APIUsageProtection';

interface EnhancedBrandMonitoringProps {
  className?: string;
}

interface AnalysisMode {
  id: 'overview' | 'company-analysis' | 'competitive-monitoring' | 'reputation-tracking';
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  premium?: boolean;
  badge?: string;
}

const ANALYSIS_MODES: AnalysisMode[] = [
  {
    id: 'overview',
    label: 'Vue d\'ensemble',
    description: 'Dashboard principal avec métriques clés',
    icon: BarChart3,
    badge: 'Essentiel'
  },
  {
    id: 'company-analysis',
    label: 'Analyse de Société',
    description: 'Analyse approfondie de votre entreprise',
    icon: Building2,
    premium: true,
    badge: 'Nouveau'
  },
  {
    id: 'competitive-monitoring',
    label: 'Surveillance Concurrentielle',
    description: 'Monitoring et benchmarking concurrents',
    icon: Target,
    premium: true
  },
  {
    id: 'reputation-tracking',
    label: 'Suivi de Réputation',
    description: 'Analyse sentiment et e-réputation',
    icon: Shield
  }
];

const FEATURE_HIGHLIGHTS = [
  {
    icon: Brain,
    title: 'IA Perplexity Intégrée',
    description: 'Analyses alimentées par l\'intelligence artificielle',
    color: 'purple'
  },
  {
    icon: Zap,
    title: 'Temps Réel',
    description: 'Données actualisées en continu',
    color: 'blue'
  },
  {
    icon: Shield,
    title: 'Sécurisé & Fiable',
    description: 'Protection et validation des données',
    color: 'green'
  },
  {
    icon: Award,
    title: 'Qualité Premium',
    description: 'Méthodologie McKinsey & TDD',
    color: 'orange'
  }
];

export const EnhancedBrandMonitoring: React.FC<EnhancedBrandMonitoringProps> = ({ 
  className = '' 
}) => {
  const [activeMode, setActiveMode] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // === GESTIONNAIRES D'ÉVÉNEMENTS ===
  const handleModeChange = useCallback((mode: string) => {
    setActiveMode(mode);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'brand_monitoring_mode_change', {
        mode,
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  const handleGetStarted = useCallback(() => {
    setActiveMode('company-analysis');
    toast({
      title: "🚀 Analyse de Société Activée",
      description: "Commencez par analyser votre entreprise",
    });
  }, [toast]);

  // === RENDU MODE OVERVIEW ===
  const renderOverview = () => (
    <div className="space-y-8" data-testid="overview-section">
      {/* Hero Section */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Veille de Marque Premium</h1>
                  <p className="text-lg text-gray-600">Intelligence artificielle pour votre succès</p>
                </div>
              </div>
              
              <p className="text-gray-700 max-w-2xl">
                Analysez votre société, surveillez vos concurrents et protégez votre réputation 
                avec notre plateforme alimentée par l'IA Perplexity.
              </p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                  size="lg"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Analyser ma Société
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveMode('competitive-monitoring')}
                  size="lg"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Surveiller Concurrents
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                <Brain className="w-24 h-24 text-blue-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURE_HIGHLIGHTS.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modes d'Analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Modes d'Analyse Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {ANALYSIS_MODES.map((mode) => (
              <Card 
                key={mode.id}
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  mode.premium ? 'border-purple-200 bg-purple-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleModeChange(mode.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-lg ${mode.premium ? 'bg-purple-100' : 'bg-gray-100'}`}>
                      <mode.icon className={`h-6 w-6 ${mode.premium ? 'text-purple-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{mode.label}</h3>
                        {mode.badge && (
                          <Badge 
                            variant={mode.premium ? "default" : "secondary"} 
                            className={`text-xs ${
                              mode.premium 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {mode.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{mode.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-blue-600">
                        <span className="text-xs">Accéder</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Analyses Réalisées</p>
                <p className="text-2xl font-bold text-green-900">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Entreprises Analysées</p>
                <p className="text-2xl font-bold text-blue-900">1,205</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Pays Couverts</p>
                <p className="text-2xl font-bold text-purple-900">45+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Usage Protection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Protection API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <APIUsageProtection />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`} data-testid="enhanced-brand-monitoring">
      {/* Navigation Principale */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-2">
          <Tabs value={activeMode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1">
              {ANALYSIS_MODES.map((mode) => (
                <TabsTrigger 
                  key={mode.id} 
                  value={mode.id}
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  data-testid={`tab-${mode.id}`}
                >
                  <div className="flex items-center gap-2">
                    <mode.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{mode.label}</span>
                    {mode.premium && (
                      <Star className="w-3 h-3 text-purple-600" />
                    )}
                  </div>
                  {mode.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {mode.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Contenu des Onglets */}
            <div className="mt-6">
              <TabsContent value="overview" className="mt-0">
                {renderOverview()}
              </TabsContent>

              <TabsContent value="company-analysis" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Analyse de Société</h2>
                      <p className="text-gray-600">Analysez votre entreprise avec l'IA Perplexity</p>
                    </div>
                  </div>
                  <CompanyAnalysisWidget />
                </div>
              </TabsContent>

              <TabsContent value="competitive-monitoring" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-6 h-6 text-purple-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Surveillance Concurrentielle</h2>
                      <p className="text-gray-600">Monitoring avancé de vos concurrents</p>
                    </div>
                  </div>
                  <BrandMonitoring />
                </div>
              </TabsContent>

              <TabsContent value="reputation-tracking" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-green-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Suivi de Réputation</h2>
                      <p className="text-gray-600">Surveillance de votre e-réputation</p>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Module en Développement
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Le module de suivi de réputation sera bientôt disponible avec :
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                        <div className="flex items-start gap-2">
                          <Activity className="w-4 h-4 text-green-600 mt-1" />
                          <span className="text-sm">Monitoring des réseaux sociaux</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Search className="w-4 h-4 text-green-600 mt-1" />
                          <span className="text-sm">Analyse des mentions web</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <BarChart3 className="w-4 h-4 text-green-600 mt-1" />
                          <span className="text-sm">Scores de sentiment</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-green-600 mt-1" />
                          <span className="text-sm">Alertes IA intelligentes</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-6"
                        onClick={() => setActiveMode('company-analysis')}
                      >
                        Commencer par l'Analyse de Société
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBrandMonitoring; 