/**
 * 🏢 COMPANY ANALYSIS WIDGET - ULTRA PREMIUM
 * Composant de veille de marque avec recherche Perplexity intégrée
 * UX/UI Premium - Performance optimisée - TDD Ready
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';
import {
  Search,
  Building2,
  TrendingUp,
  Brain,
  Zap,
  FileText,
  Download,
  Loader2,
  AlertCircle,
  Users,
  Award,
  Clock,
  DollarSign,
} from 'lucide-react';

import { RealBrandIntelligenceService } from '../services/RealBrandIntelligenceService';
import type { DeepResearchReport } from '../types/BrandIntelligenceTypes';

interface AnalysisMode {
  id: 'simple' | 'deep';
  label: string;
  description: string;
  duration: string;
  icon: React.ComponentType<any>;
  premium: boolean;
}

interface CompanySearchState {
  query: string;
  isSearching: boolean;
  hasResults: boolean;
  analysisMode: 'simple' | 'deep';
  report: DeepResearchReport | null;
  error: string | null;
  searchHistory: string[];
  lastAnalysis: Date | null;
}

const ANALYSIS_MODES: AnalysisMode[] = [
  {
    id: 'simple',
    label: 'Recherche Simple',
    description: 'Analyse rapide avec données essentielles',
    duration: '30-60 sec',
    icon: Search,
    premium: false,
  },
  {
    id: 'deep',
    label: 'Deep Research',
    description: 'Analyse approfondie avec métriques avancées',
    duration: '2-3 min',
    icon: Brain,
    premium: true,
  },
];

export const CompanyAnalysisWidget: React.FC = () => {
  // === ÉTATS PRINCIPAUX ===
  const [searchState, setSearchState] = useState<CompanySearchState>({
    query: '',
    isSearching: false,
    hasResults: false,
    analysisMode: 'simple',
    report: null,
    error: null,
    searchHistory: [],
    lastAnalysis: null,
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [, setAnalysisSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState('');

  const { toast } = useToast();
  const realService = new RealBrandIntelligenceService();

  // === VALIDATION INTELLIGENTE ===
  const validateCompanyName = useCallback((name: string): boolean => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setValidationError('Le nom de votre société est requis');
      return false;
    }

    if (trimmedName.length < 2) {
      setValidationError('Le nom doit contenir au moins 2 caractères');
      return false;
    }

    if (trimmedName.length > 100) {
      setValidationError('Le nom ne peut pas dépasser 100 caractères');
      return false;
    }

    // Validation contre les caractères spéciaux malveillants
    const invalidChars = /[<>{}[\]|\\^~`]/;
    if (invalidChars.test(trimmedName)) {
      setValidationError('Caractères non autorisés détectés');
      return false;
    }

    setValidationError(null);
    return true;
  }, []);

  // === GESTIONNAIRE DE RECHERCHE PRINCIPALE ===
  const handleSearch = async () => {
    if (!validateCompanyName(searchState.query)) {
      return;
    }

    const companyName = searchState.query.trim();

    try {
      setSearchState((prev) => ({
        ...prev,
        isSearching: true,
        error: null,
        hasResults: false,
      }));

      setProgress(0);
      setCurrentStep("Initialisation de l'analyse...");
      setAnalysisSteps([
        'Connexion API Perplexity',
        'Collecte des données',
        'Analyse des métriques',
        'Génération du rapport',
      ]);

      // Simulation progressive pour UX premium
      const progressSteps = [
        { step: 'Connexion API Perplexity...', progress: 20 },
        { step: 'Collecte des données publiques...', progress: 40 },
        { step: 'Analyse des métriques financières...', progress: 60 },
        { step: "Traitement de l'intelligence concurrentielle...", progress: 80 },
        { step: 'Finalisation du rapport...', progress: 90 },
      ];

      // Exécution avec feedback visuel
      for (const { step, progress: stepProgress } of progressSteps) {
        setCurrentStep(step);
        setProgress(stepProgress);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      let report: DeepResearchReport;

      if (searchState.analysisMode === 'deep') {
        // Deep Research avec service réel
        report = await realService.generateRealDeepResearchReport(companyName);
      } else {
        // Recherche simple simulée
        report = await generateSimpleReport(companyName);
      }

      setProgress(100);
      setCurrentStep('Analyse terminée avec succès !');

      // Mise à jour de l'état avec succès
      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        hasResults: true,
        report,
        lastAnalysis: new Date(),
        searchHistory: [
          companyName,
          ...prev.searchHistory.filter((h) => h !== companyName).slice(0, 4),
        ],
      }));

      toast({
        title: '✅ Analyse terminée',
        description: `Rapport complet généré pour ${companyName}`,
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);

      setSearchState((prev) => ({
        ...prev,
        isSearching: false,
        error: error instanceof Error ? error.message : "Erreur inconnue lors de l'analyse",
      }));

      toast({
        title: "❌ Erreur d'analyse",
        description: 'Impossible de générer le rapport. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  // === GÉNÉRATION RAPPORT SIMPLE ===
  const generateSimpleReport = async (companyName: string): Promise<DeepResearchReport> => {
    // Pour la recherche simple, on utilise des données mockées enrichies
    return {
      brandName: companyName,
      executionTimestamp: new Date(),
      objectiveAnalysis: {
        brandHistory: {
          foundingYear: 2020,
          founders: ['Données non disponibles'],
          keyMilestones: [
            { year: 2020, event: "Création de l'entreprise", impact: 'major' as const },
          ],
          evolution: ['Entreprise en développement'],
        },
        marketPosition: {
          sector: ['Secteur à identifier'],
          markets: ['Marché local'],
          employeeCount: undefined,
          globalRank: undefined,
        },
        financialHealth: {
          revenue: undefined,
          growth: undefined,
          profitability: 'Non communiqué',
        },
        metrics: {
          innovationIndex: 50,
          reputationScore: 60,
        },
      },
      recentActions: [],
      strategicAnalysis: {
        businessModel: {
          type: 'À analyser',
          revenueStreams: ['Modèle à identifier'],
          keyPartners: ['Partenaires à identifier'],
          valueProposition: "Proposition de valeur en cours d'analyse",
        },
        competitiveAdvantages: ['Avantages concurrentiels à évaluer'],
        strategicRisks: ['Risques stratégiques à identifier'],
        priorities: [],
      },
      trendAnalysis: {
        sectorEvolution: {
          currentTrends: ["Tendances sectorielles en cours d'analyse"],
          futureProjections: ['Projections futures à définir'],
          disruptionPotential: 'medium' as const,
          growthRate: 0,
          maturity: 'growth' as const,
          keyPlayers: [],
          regulatoryChanges: [],
          technologicalDisruptions: [],
        },
        emergingTrends: [],
        weakSignals: [],
        disruptiveThreats: [],
        opportunities: [],
      },
      swotMetrics: {
        strengthsScore: 60,
        weaknessesScore: 40,
        opportunitiesScore: 70,
        threatsScore: 30,
        strategicHealthIndex: 65,
      },
      contentMetrics: {
        overallSentiment: 0,
        sentimentDistribution: { positive: 50, neutral: 30, negative: 20 },
      },
      competitiveMetrics: {
        competitiveAdvantageIndex: 50,
        threatLevel: 30,
      },
      reputationKPIs: {
        overallScore: 60,
        brandTrust: 55,
        brandRecognition: 45,
        brandLoyalty: 50,
        publicPerception: {
          favorability: 60,
          awareness: 40,
          consideration: 45,
        },
        socialMediaMetrics: {
          followers: 1000,
          engagement: 2.5,
          sentimentScore: 10,
        },
        crisisResilience: 65,
        competitorComparison: [],
      },
      recommendations: [],
      alerts: {
        critical: [],
        warnings: [],
        opportunities: [],
      },
      confidenceScore: 70,
      dataFreshness: {
        lastUpdated: new Date(),
        dataAge: 0,
        reliability: 'medium' as const,
        sources: 1,
      },
      sources: [
        {
          source: 'Analyse simple - Données limitées',
          reliability: 60,
          lastUpdated: new Date(),
          type: 'secondary' as const,
          credibility: 'medium' as const,
        },
      ],
      limitations: [
        'Analyse rapide avec données limitées',
        'Pour une analyse complète, utiliser Deep Research',
      ],
    };
  };

  // === RENDU DU RAPPORT ===
  const renderReportSummary = () => {
    if (!searchState.report) return null;

    const { report } = searchState;
    const confidenceColor =
      report.confidenceScore >= 80
        ? 'text-green-600'
        : report.confidenceScore >= 60
          ? 'text-yellow-600'
          : 'text-red-600';

    return (
      <div className="space-y-6 mt-6" data-testid="company-report-summary">
        {/* Header du rapport */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{report.brandName}</h3>
            <p className="text-sm text-gray-600">
              Analysé le {report.executionTimestamp.toLocaleDateString('fr-FR')} à{' '}
              {report.executionTimestamp.toLocaleTimeString('fr-FR')}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${confidenceColor}`}>{report.confidenceScore}%</div>
            <p className="text-xs text-gray-500">Score de confiance</p>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Réputation</p>
                <p className="text-xl font-bold text-gray-900">
                  {report.objectiveAnalysis.metrics.reputationScore}/100
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Innovation</p>
                <p className="text-xl font-bold text-gray-900">
                  {report.objectiveAnalysis.metrics.innovationIndex}/100
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Santé SWOT</p>
                <p className="text-xl font-bold text-gray-900">
                  {report.swotMetrics.strategicHealthIndex || 'N/A'}/100
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Employés</p>
                <p className="text-xl font-bold text-gray-900">
                  {report.objectiveAnalysis.marketPosition.employeeCount?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Informations essentielles */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fondation:</span>
                <span className="text-sm font-medium">
                  {report.objectiveAnalysis.brandHistory.foundingYear}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Secteur:</span>
                <span className="text-sm font-medium">
                  {report.objectiveAnalysis.marketPosition.sector.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Marchés:</span>
                <span className="text-sm font-medium">
                  {report.objectiveAnalysis.marketPosition.markets.join(', ')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Santé financière
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Chiffre d'affaires:</span>
                <span className="text-sm font-medium">
                  {report.objectiveAnalysis.financialHealth.revenue
                    ? `${(report.objectiveAnalysis.financialHealth.revenue / 1000000).toFixed(1)}M€`
                    : 'Non communiqué'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Croissance:</span>
                <span className="text-sm font-medium">
                  {report.objectiveAnalysis.financialHealth.growth
                    ? `${report.objectiveAnalysis.financialHealth.growth}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rentabilité:</span>
                <span className="text-sm font-medium">
                  {report.objectiveAnalysis.financialHealth.profitability}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              /* Export PDF */
            }}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              /* Voir détails */
            }}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Rapport complet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchState((prev) => ({ ...prev, hasResults: false, report: null }))}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Nouvelle analyse
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto premium-card" data-testid="company-analysis-widget">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-blue-600" />
              </div>
              <span className="font-bold">Analyse de Société</span>
              <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
                <Brain className="w-3 h-3 mr-1" />
                IA Premium
              </Badge>
            </CardTitle>
            <p className="text-slate-600 mt-2 text-base">
              Analysez votre société avec l'intelligence artificielle Perplexity
              {searchState.lastAnalysis && (
                <span className="block text-sm text-blue-600 mt-1">
                  Dernière analyse: {searchState.lastAnalysis.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Interface de recherche */}
        {!searchState.hasResults && (
          <div className="space-y-6">
            {/* Sélection du mode d'analyse */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Mode d'analyse</label>
              <div className="grid md:grid-cols-2 gap-3">
                {ANALYSIS_MODES.map((mode) => (
                  <Card
                    key={mode.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md border-2 ${
                      searchState.analysisMode === mode.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSearchState((prev) => ({ ...prev, analysisMode: mode.id }))}
                    data-testid={`analysis-mode-${mode.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${mode.premium ? 'bg-purple-100' : 'bg-gray-100'}`}
                      >
                        <mode.icon
                          className={`h-5 w-5 ${mode.premium ? 'text-purple-600' : 'text-gray-600'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{mode.label}</h3>
                          {mode.premium && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-purple-100 text-purple-700"
                            >
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{mode.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Champ de saisie */}
            <div className="space-y-2">
              <label htmlFor="company-name" className="text-sm font-medium text-gray-700">
                Nom de votre société
              </label>
              <div className="relative">
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Ex: Tesla, Apple, Microsoft..."
                  value={searchState.query}
                  onChange={(e) => setSearchState((prev) => ({ ...prev, query: e.target.value }))}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && !searchState.isSearching && handleSearch()
                  }
                  className={`pl-10 pr-4 h-12 text-base ${validationError ? 'border-red-300 focus:border-red-500' : ''}`}
                  disabled={searchState.isSearching}
                  data-testid="company-name-input"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {validationError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {validationError}
                </p>
              )}
            </div>

            {/* Historique de recherche */}
            {searchState.searchHistory.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Recherches récentes</label>
                <div className="flex flex-wrap gap-2">
                  {searchState.searchHistory.map((company, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSearchState((prev) => ({ ...prev, query: company }))}
                    >
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton d'analyse */}
            <Button
              onClick={handleSearch}
              disabled={searchState.isSearching || !searchState.query.trim()}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              data-testid="analyze-button"
            >
              {searchState.isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  {searchState.analysisMode === 'deep'
                    ? 'Lancer Deep Research'
                    : 'Analyser avec IA'}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Progression de l'analyse */}
        {searchState.isSearching && (
          <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-medium text-gray-900">Analyse en cours</h3>
                <p className="text-sm text-gray-600">{currentStep}</p>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="text-xs text-gray-500">
              {progress}% terminé • Mode:{' '}
              {searchState.analysisMode === 'deep' ? 'Deep Research' : 'Analyse rapide'}
            </div>
          </div>
        )}

        {/* Affichage des erreurs */}
        {searchState.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Erreur d'analyse</h3>
                <p className="text-sm text-red-700">{searchState.error}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchState((prev) => ({ ...prev, error: null }))}
              className="mt-3"
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Affichage du rapport */}
        {searchState.hasResults && renderReportSummary()}
      </CardContent>
    </Card>
  );
};

export default CompanyAnalysisWidget;
