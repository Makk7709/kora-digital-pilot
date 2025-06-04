/**
 * 🎯 COMMUNITY MANAGER DOMAIN DASHBOARD
 * Dashboard intelligent de recherche par domaine d'activité
 * UX Premium - Recherche Perplexity masquée - Ready Production
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Search,
  TrendingUp,
  Lightbulb,
  Target,
  Users,
  Eye,
  Brain,
  Zap,
  Star,
  Clock,
  ArrowRight,
  Download,
  Calendar,
  BarChart3,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle,
  Heart,
  BookOpen,
  Sparkles,
  Filter,
  SortDesc,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

import { useBusinessIntelligence, DomainSearchResult, DomainTrend } from '../hooks/useBusinessIntelligence';
import { useToast } from '../hooks/use-toast';

// === SUGGESTIONS DE DOMAINES POPULAIRES ===
const POPULAR_DOMAINS = [
  { name: 'Intelligence Artificielle', icon: Brain, color: 'from-purple-500 to-blue-500' },
  { name: 'E-commerce', icon: Globe, color: 'from-green-500 to-teal-500' },
  { name: 'FinTech', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { name: 'HealthTech', icon: Heart, color: 'from-red-500 to-pink-500' },
  { name: 'EdTech', icon: BookOpen, color: 'from-orange-500 to-yellow-500' },
  { name: 'FoodTech', icon: Sparkles, color: 'from-green-500 to-lime-500' },
  { name: 'PropTech', icon: Target, color: 'from-indigo-500 to-purple-500' },
  { name: 'GreenTech', icon: Eye, color: 'from-emerald-500 to-green-500' }
];

export const CommunityManagerDomainDashboard: React.FC = () => {
  const businessIntel = useBusinessIntelligence();
  const { toast } = useToast();

  // === ÉTATS ===
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrend, setSelectedTrend] = useState<DomainTrend | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // === VALIDATION RECHERCHE ===
  const validateSearch = (query: string): boolean => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setValidationError('Le domaine d\'activité est requis');
      return false;
    }
    
    if (trimmedQuery.length < 3) {
      setValidationError('Le domaine doit contenir au moins 3 caractères');
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  // === GESTION DE LA RECHERCHE ===
  const handleSearch = async () => {
    if (!validateSearch(searchQuery)) return;

    try {
      setSearchProgress(0);
      const progressInterval = setInterval(() => {
        setSearchProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await businessIntel.searchByDomain(searchQuery);
      
      clearInterval(progressInterval);
      setSearchProgress(100);
      
      setTimeout(() => setSearchProgress(0), 1000);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    }
  };

  // === RECHERCHE PAR SUGGESTION ===
  const handleSuggestionClick = (domainName: string) => {
    setSearchQuery(domainName);
    handleSearch();
  };

  // === GESTION DES FAVORIS ===
  const handleAddToFavorites = () => {
    if (businessIntel.currentResult) {
      businessIntel.addToFavorites(businessIntel.currentResult.domain);
    }
  };

  // === FILTRAGE DES TENDANCES ===
  const getFilteredTrends = () => {
    if (!businessIntel.currentResult) return [];
    
    const trends = businessIntel.currentResult.trends;
    if (filterType === 'all') return trends;
    return trends.filter(trend => trend.impact === filterType);
  };

  // === COMPOSANTS UI ===
  const LoaderOverlay = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" data-testid="search-loader" />
        <p className="text-sm font-medium text-slate-700">Analyse en cours...</p>
        <p className="text-xs text-slate-500 mt-1">Recherche d'insights sectoriels</p>
        {searchProgress > 0 && (
          <div className="mt-3 w-32 mx-auto">
            <Progress value={searchProgress} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );

  const SearchSection = () => (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-white shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <span className="font-bold">Recherche par Domaine</span>
            <p className="text-sm font-normal text-slate-600 mt-1">
              Analysez n'importe quel secteur d'activité en temps réel
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Zone de recherche principale */}
        <div className="space-y-3">
          <div className="relative">
            <Input
              data-testid="domain-search-input"
              type="text"
              placeholder="Ex: Intelligence Artificielle, E-commerce, FinTech..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (validationError) validateSearch(e.target.value);
              }}
              onKeyPress={(e) => e.key === 'Enter' && !businessIntel.isLoading && handleSearch()}
              className={`pl-12 pr-4 h-14 text-base bg-white border-2 transition-all duration-300 mobile-optimized ${
                validationError 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
              }`}
              disabled={businessIntel.isLoading}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Button
              data-testid="search-button"
              onClick={handleSearch}
              disabled={businessIntel.isLoading || !searchQuery.trim()}
              className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium"
            >
              {businessIntel.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyser
                </>
              )}
            </Button>
          </div>
          
          {validationError && (
            <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4" />
              {validationError}
            </p>
          )}
        </div>

        {/* Suggestions de domaines */}
        <div data-testid="domain-suggestions">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Domaines populaires</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR_DOMAINS.map((domain) => {
              const IconComponent = domain.icon;
              return (
                <Button
                  key={domain.name}
                  variant="outline"
                  onClick={() => handleSuggestionClick(domain.name)}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all duration-300 border-2 hover:border-blue-200"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${domain.color} flex items-center justify-center`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{domain.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Historique de recherche */}
        {businessIntel.searchHistory.length > 0 && (
          <div data-testid="recent-searches">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Recherches récentes</h3>
            <div className="flex flex-wrap gap-2">
              {businessIntel.searchHistory.slice(0, 5).map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick(search)}
                  className="h-8 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {search}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={businessIntel.clearSearchHistory}
                className="h-8 px-2 text-xs text-slate-500 hover:text-red-600"
              >
                <span>Effacer</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {businessIntel.isLoading && <LoaderOverlay />}
    </Card>
  );

  const ResultsSection = () => {
    if (!businessIntel.currentResult) return null;

    const result = businessIntel.currentResult;
    const filteredTrends = getFilteredTrends();

    return (
      <div className="space-y-6" data-testid="cards-container">
        {/* Actions contextuelles */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-slate-900">
                  Analyse de "{result.domain}" terminée
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  data-testid="add-to-favorites"
                  variant="outline"
                  size="sm"
                  onClick={handleAddToFavorites}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Favoris
                </Button>
                <Button
                  data-testid="action-export-report"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
                <Button
                  data-testid="action-schedule-monitoring"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Surveiller
                </Button>
                <Button
                  data-testid="action-competitor-analysis"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Concurrence
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grille de cartes principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 grid-cols-1">
          {/* Carte Vue d'ensemble */}
          <Card data-testid="domain-overview-card" className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <span>Vue d'ensemble</span>
                <Badge variant="outline" className="ml-auto border-blue-200 text-blue-700 bg-blue-50">
                  Marché
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border">
                  <p className="text-2xl font-bold text-slate-900">{result.overview.marketSize}</p>
                  <p className="text-sm text-slate-600">Taille du marché</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border">
                  <p className="text-2xl font-bold text-green-700">{result.overview.growth}</p>
                  <p className="text-sm text-slate-600">Croissance</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Acteurs principaux</p>
                <div className="flex flex-wrap gap-2">
                  {result.overview.keyPlayers.slice(0, 4).map((player, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {player}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Maturité du secteur</p>
                <Badge 
                  variant={result.overview.maturity === 'growth' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {result.overview.maturity}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Carte Tendances */}
          <Card data-testid="trends-card" className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <span>Tendances</span>
                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="all">Toutes</option>
                    <option value="high">Impact élevé</option>
                    <option value="medium">Impact moyen</option>
                    <option value="low">Impact faible</option>
                  </select>
                  <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                    {filteredTrends.length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {filteredTrends.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-sm">Aucune tendance trouvée</p>
                      <p className="text-xs text-slate-400">Essayez un autre filtre</p>
                    </div>
                  ) : (
                    filteredTrends.map((trend) => (
                      <div
                        key={trend.id}
                        data-testid={`trend-card-${trend.id.split('-')[1]}`}
                        onClick={() => {
                          setSelectedTrend(trend);
                          setIsDetailModalOpen(true);
                        }}
                        className="border border-slate-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-slate-50/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 text-sm leading-snug pr-3">
                            {trend.title}
                          </h4>
                          <Badge
                            variant={trend.impact === 'high' ? 'destructive' : trend.impact === 'medium' ? 'default' : 'secondary'}
                            className="text-xs shrink-0"
                          >
                            {trend.impact === 'high' ? 'Élevé' : trend.impact === 'medium' ? 'Moyen' : 'Faible'}
                          </Badge>
                        </div>
                        {trend.description && (
                          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                            {trend.description.substring(0, 100)}...
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{trend.timeline}</span>
                          <div className="flex items-center gap-1">
                            <span>Confiance: {trend.confidence}%</span>
                            <ArrowRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Carte Opportunités */}
          <Card data-testid="opportunities-card" className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <span>Opportunités</span>
                <Badge variant="outline" className="ml-auto border-green-200 text-green-700 bg-green-50">
                  {result.opportunities.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {result.opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="border border-slate-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {opportunity.title}
                        </h4>
                        <Badge
                          variant={opportunity.difficulty === 'easy' ? 'default' : opportunity.difficulty === 'medium' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {opportunity.difficulty === 'easy' ? 'Facile' : opportunity.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {opportunity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Potentiel:</span>
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${opportunity.potential}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">{opportunity.potential}%</span>
                        </div>
                        <span className="text-xs text-slate-500">{opportunity.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Carte Insights */}
          <Card data-testid="insights-card" className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-orange-600" />
                </div>
                <span>Insights</span>
                <Badge variant="outline" className="ml-auto border-orange-200 text-orange-700 bg-orange-50">
                  {result.insights.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {result.insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="border border-slate-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {insight.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            insight.type === 'market' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            insight.type === 'technology' ? 'border-purple-200 text-purple-700 bg-purple-50' :
                            insight.type === 'regulation' ? 'border-red-200 text-red-700 bg-red-50' :
                            'border-green-200 text-green-700 bg-green-50'
                          }`}
                        >
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                        {insight.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Confiance: {insight.confidence}%</span>
                        <span>{insight.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const ErrorState = () => {
    if (!businessIntel.error) return null;

    return (
      <Card data-testid="error-message" className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-red-900 mb-2">Erreur d'analyse</h3>
          <p className="text-red-700 mb-4">Impossible d'analyser ce domaine</p>
          
          {/* Suggestions de domaines similaires */}
          <div data-testid="similar-domains">
            <p className="text-sm text-red-600 mb-3">Domaines similaires suggérés:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {POPULAR_DOMAINS.slice(0, 4).map((domain) => (
                <Button
                  key={domain.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(domain.name)}
                  className="text-xs border-red-200 text-red-700 hover:bg-red-100"
                >
                  {domain.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // === MODAL DE DÉTAIL ===
  const TrendDetailModal = () => (
    <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
      <DialogContent data-testid="trend-detail-modal" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Détail de la tendance
          </DialogTitle>
        </DialogHeader>
        {selectedTrend && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                {selectedTrend.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {selectedTrend.description}
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Impact</p>
                <Badge
                  variant={selectedTrend.impact === 'high' ? 'destructive' : selectedTrend.impact === 'medium' ? 'default' : 'secondary'}
                >
                  {selectedTrend.impact === 'high' ? 'Élevé' : selectedTrend.impact === 'medium' ? 'Moyen' : 'Faible'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Timeline</p>
                <p className="text-sm text-slate-600">{selectedTrend.timeline}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Confiance</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${selectedTrend.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{selectedTrend.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // === RENDER PRINCIPAL ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header avec branding Kora */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kora Digital
            </span>{' '}
            Intelligence Sectorielle
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Analysez n'importe quel domaine d'activité et découvrez les tendances, 
            opportunités et insights qui comptent pour votre stratégie.
          </p>
        </div>

        {/* Section de recherche */}
        <SearchSection />

        {/* Gestion des états */}
        {businessIntel.error && <ErrorState />}
        {businessIntel.currentResult && <ResultsSection />}

        {/* Modal de détail */}
        <TrendDetailModal />
      </div>
    </div>
  );
}; 