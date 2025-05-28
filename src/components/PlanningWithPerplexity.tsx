import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Brain, 
  TrendingUp, 
  Zap, 
  Eye, 
  Target,
  Lightbulb,
  BarChart3,
  Clock,
  Plus,
  Sparkles
} from 'lucide-react';
import { usePlanning } from '@/hooks/usePlanning';
import { usePerplexity } from '@/hooks/usePerplexity';
import { PerplexityInsights } from './PerplexityInsights';
import Planning from './Planning';

interface SmartSuggestion {
  id: string;
  type: 'content' | 'timing' | 'platform' | 'trend';
  title: string;
  description: string;
  confidence: number;
  source: 'perplexity' | 'ai' | 'analytics';
  actionable: boolean;
  data?: any;
}

export const PlanningWithPerplexity: React.FC = () => {
  const planning = usePlanning();
  const perplexity = usePerplexity();
  
  const [activeTab, setActiveTab] = useState('planning');
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  // Analyser le planning avec Perplexity
  const analyzeCurrentPlanning = async () => {
    if (!perplexity.isInitialized || planning.posts.length === 0) return;

    setIsAnalyzing(true);
    try {
      // Analyser les tendances actuelles
      const trendsResponse = await perplexity.getBusinessInsights({
        query: `Tendances marketing digital actuelles pour optimiser un planning éditorial`,
        industry: 'digital-marketing',
        depth: 'detailed',
        language: 'fr',
        context: `Planning actuel: ${planning.posts.length} posts programmés. 
                  Plateformes utilisées: ${[...new Set(planning.posts.map(p => p.platform))].join(', ')}.
                  Analyse pour optimisation et suggestions d'amélioration.`
      });

      // Analyser les horaires optimaux
      const timingResponse = await perplexity.getBusinessInsights({
        query: `Meilleurs horaires de publication sur réseaux sociaux 2025`,
        industry: 'digital-marketing',
        depth: 'quick',
        language: 'fr',
        context: 'Optimisation des horaires de publication pour maximiser l\'engagement'
      });

      // Générer des suggestions intelligentes
      const suggestions: SmartSuggestion[] = [];

      if (trendsResponse) {
        suggestions.push({
          id: 'trend-analysis',
          type: 'trend',
          title: 'Tendances détectées',
          description: 'Nouvelles opportunités de contenu basées sur les tendances actuelles',
          confidence: 0.85,
          source: 'perplexity',
          actionable: true,
          data: trendsResponse
        });
      }

      if (timingResponse) {
        suggestions.push({
          id: 'timing-optimization',
          type: 'timing',
          title: 'Optimisation des horaires',
          description: 'Suggestions d\'horaires pour améliorer l\'engagement',
          confidence: 0.78,
          source: 'perplexity',
          actionable: true,
          data: timingResponse
        });
      }

      // Analyser la distribution des plateformes
      const platformDistribution = planning.posts.reduce((acc, post) => {
        acc[post.platform] = (acc[post.platform] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalPosts = planning.posts.length;
      const platformAnalysis = Object.entries(platformDistribution).map(([platform, count]) => ({
        platform,
        percentage: (count / totalPosts) * 100,
        count
      }));

      suggestions.push({
        id: 'platform-balance',
        type: 'platform',
        title: 'Équilibrage des plateformes',
        description: `Répartition actuelle: ${platformAnalysis.map(p => `${p.platform} (${p.percentage.toFixed(1)}%)`).join(', ')}`,
        confidence: 0.9,
        source: 'analytics',
        actionable: true,
        data: platformAnalysis
      });

      setSmartSuggestions(suggestions);
      setLastAnalysis(new Date());
    } catch (error) {
      console.error('Erreur analyse planning:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Générer du contenu intelligent basé sur les insights
  const generateSmartContent = async (topic: string) => {
    if (!perplexity.isInitialized) return;

    try {
      const response = await perplexity.generateContentWithResearch(topic, 'post');
      if (response) {
        // Ajouter le contenu généré au planning
        await planning.addPost({
          content: response.content,
          platform: 'LinkedIn', // Par défaut
          scheduledDate: new Date(),
          scheduledTime: '09:00',
          status: 'draft',
          aiGenerated: true,
          title: `Contenu généré: ${topic}`,
          contentType: 'post',
          tone: 'Professionnel',
          tags: ['IA', 'Tendances'],
          originalPrompt: topic
        });
      }
    } catch (error) {
      console.error('Erreur génération contenu intelligent:', error);
    }
  };

  // Auto-analyse périodique
  useEffect(() => {
    if (perplexity.isInitialized && planning.posts.length > 0 && !lastAnalysis) {
      analyzeCurrentPlanning();
    }
  }, [perplexity.isInitialized, planning.posts.length]);

  // Composant pour afficher les suggestions intelligentes
  const SmartSuggestionsPanel = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Suggestions Intelligentes
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeCurrentPlanning}
            disabled={isAnalyzing || !perplexity.isInitialized}
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                Analyse...
              </div>
            ) : (
              <>
                <Brain className="h-3 w-3 mr-1" />
                Analyser
              </>
            )}
          </Button>
        </div>
        {lastAnalysis && (
          <p className="text-sm text-muted-foreground">
            Dernière analyse: {lastAnalysis.toLocaleString('fr-FR')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {smartSuggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune suggestion disponible</p>
            <p className="text-sm">Lancez une analyse pour obtenir des insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {smartSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {suggestion.type === 'trend' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {suggestion.type === 'timing' && <Clock className="h-4 w-4 text-blue-500" />}
                    {suggestion.type === 'platform' && <BarChart3 className="h-4 w-4 text-purple-500" />}
                    {suggestion.type === 'content' && <Target className="h-4 w-4 text-orange-500" />}
                    <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                    <Badge variant={suggestion.source === 'perplexity' ? 'default' : 'secondary'}>
                      {suggestion.source}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.description}
                </p>
                {suggestion.actionable && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Appliquer
                    </Button>
                    <Button size="sm" variant="ghost">
                      Voir détails
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Composant pour les actions rapides IA
  const QuickAIActions = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Actions IA Rapides
          {perplexity.isSimulationMode && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
              Actif
            </Badge>
          )}
        </CardTitle>
        {perplexity.isSimulationMode && (
          <p className="text-xs text-muted-foreground">
            Mode simulation - Contenu généré par Kora IA
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start hover:bg-blue-50 hover:border-blue-300"
            onClick={() => generateSmartContent('Tendances IA 2025')}
            disabled={!perplexity.isInitialized || perplexity.isLoading}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Contenu Tendance</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {perplexity.isSimulationMode 
                ? 'Générer du contenu sur les dernières tendances (démo)'
                : 'Générer du contenu sur les dernières tendances'
              }
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start hover:bg-green-50 hover:border-green-300"
            onClick={() => planning.optimizeSchedule()}
            disabled={planning.isLoading}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4" />
              <span className="font-medium">Optimiser Planning</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Optimiser les horaires automatiquement
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start hover:bg-purple-50 hover:border-purple-300"
            onClick={() => perplexity.getMarketingTrends('marketing digital', '7d')}
            disabled={!perplexity.isInitialized || perplexity.isLoading}
          >
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4" />
              <span className="font-medium">Veille Concurrence</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {perplexity.isSimulationMode 
                ? 'Analyser la concurrence (simulation)'
                : 'Analyser la concurrence en temps réel'
              }
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start hover:bg-orange-50 hover:border-orange-300"
            onClick={() => planning.generateWeeklyPlan()}
            disabled={planning.isGenerating}
          >
            <div className="flex items-center gap-2 mb-1">
              <Plus className="h-4 w-4" />
              <span className="font-medium">Plan Hebdomadaire</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Générer un planning complet avec IA
            </span>
          </Button>
        </div>
        
        {perplexity.isLoading && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">
                {perplexity.isSimulationMode ? 'Génération en cours...' : 'Analyse Perplexity en cours...'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Statistiques enrichies
  const EnhancedStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Posts Programmés</p>
              <p className="text-2xl font-bold">{planning.weeklyStats.totalPosts}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contenu IA</p>
              <p className="text-2xl font-bold">
                {planning.posts.filter(p => p.aiGenerated).length}
              </p>
            </div>
            <Brain className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Insights Actifs</p>
              <p className="text-2xl font-bold">{smartSuggestions.length}</p>
            </div>
            <Lightbulb className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cache Perplexity</p>
              <p className="text-2xl font-bold">{perplexity.cacheStats.size}</p>
            </div>
            <Zap className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec statut */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-500" />
                Planning Éditorial Intelligent
              </CardTitle>
              <p className="text-muted-foreground">
                Planning éditorial enrichi par l'intelligence artificielle Perplexity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${perplexity.isInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {perplexity.isInitialized 
                    ? (perplexity.isSimulationMode ? 'Mode Simulation' : 'Perplexity Connecté')
                    : 'Déconnecté'
                  }
                </span>
                {perplexity.isSimulationMode && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                    Démo
                  </Badge>
                )}
              </div>
              <Badge variant="outline">
                {planning.posts.length} posts
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques enrichies */}
      <EnhancedStats />

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planning
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights IA
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Onglet Planning */}
        <TabsContent value="planning" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Planning />
            </div>
            <div className="space-y-4">
              <QuickAIActions />
              {smartSuggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Suggestions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {smartSuggestions.slice(0, 3).map((suggestion) => (
                        <div key={suggestion.id} className="p-2 rounded border">
                          <p className="text-xs font-medium">{suggestion.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.description.substring(0, 60)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Onglet Insights IA */}
        <TabsContent value="insights">
          <PerplexityInsights />
        </TabsContent>

        {/* Onglet Suggestions */}
        <TabsContent value="suggestions">
          <SmartSuggestionsPanel />
        </TabsContent>

        {/* Onglet Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance du Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Posts programmés</span>
                    <span className="font-semibold">{planning.weeklyStats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brouillons</span>
                    <span className="font-semibold">{planning.weeklyStats.drafts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Publiés</span>
                    <span className="font-semibold">{planning.weeklyStats.published}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contenu IA</span>
                    <span className="font-semibold">
                      {planning.posts.filter(p => p.aiGenerated).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilisation Perplexity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Cache actif</span>
                    <span className="font-semibold">{perplexity.cacheStats.size} entrées</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière analyse</span>
                    <span className="font-semibold">
                      {lastAnalysis ? lastAnalysis.toLocaleDateString('fr-FR') : 'Jamais'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suggestions actives</span>
                    <span className="font-semibold">{smartSuggestions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut connexion</span>
                    <Badge variant={perplexity.isInitialized ? 'default' : 'destructive'}>
                      {perplexity.isInitialized ? 'Connecté' : 'Déconnecté'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 