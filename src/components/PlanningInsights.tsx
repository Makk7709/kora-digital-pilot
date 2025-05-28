import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Calendar, Lightbulb, Target, Clock, Users } from 'lucide-react';
import { usePerplexity } from '@/hooks/usePerplexity';

interface PlanningInsightsProps {
  currentWeek: Date[];
  weeklyStats?: {
    scheduledPosts: number;
    draftPosts: number;
    publishedPosts: number;
    totalPosts: number;
  };
  onInsightApplied?: (insight: any) => void;
}

export const PlanningInsights: React.FC<PlanningInsightsProps> = ({
  currentWeek,
  weeklyStats,
  onInsightApplied
}) => {
  const { 
    getMarketingTrends, 
    generateContentWithResearch,
    getBusinessInsights,
    isLoading,
    error 
  } = usePerplexity();

  const [activeInsight, setActiveInsight] = useState<'trends' | 'content' | 'timing' | null>(null);
  const [insights, setInsights] = useState<any>(null);

  const handleGetTrends = async () => {
    setActiveInsight('trends');
    try {
      const result = await getMarketingTrends('Marketing digital et réseaux sociaux 2024', '7d');
      setInsights({ insights: result });
    } catch (err) {
      console.error('Erreur récupération tendances:', err);
    }
  };

  const handleGenerateContent = async () => {
    setActiveInsight('content');
    try {
      const weekStart = currentWeek[0].toLocaleDateString('fr-FR');
      const weekEnd = currentWeek[6].toLocaleDateString('fr-FR');
      
      const result = await generateContentWithResearch(
        `Contenu marketing digital pour la semaine du ${weekStart} au ${weekEnd}`,
        'post'
      );
      setInsights(result);
    } catch (err) {
      console.error('Erreur génération contenu:', err);
    }
  };

  const handleGetTimingInsights = async () => {
    setActiveInsight('timing');
    try {
      const result = await getBusinessInsights({
        query: 'Meilleurs moments pour publier sur les réseaux sociaux en 2024 - horaires optimaux par plateforme',
        industry: 'digital-marketing',
        depth: 'detailed',
        language: 'fr'
      });
      setInsights(result);
    } catch (err) {
      console.error('Erreur insights timing:', err);
    }
  };

  const renderInsightContent = () => {
    if (!insights) return null;

    switch (activeInsight) {
      case 'trends':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Tendances Marketing</h3>
            </div>
            
            {insights.insights && insights.insights.map((insight: any, index: number) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">{insight.trend}</h4>
                <p className="text-blue-800 text-sm mb-3">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-100 text-blue-700">
                    Impact: {insight.impact}
                  </Badge>
                  <Button 
                    size="sm" 
                    onClick={() => onInsightApplied?.(insight)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            ))}
            
            {insights.sources && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">Sources:</p>
                {insights.sources.slice(0, 3).map((source: any, index: number) => (
                  <a 
                    key={index}
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-600 hover:underline mb-1"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-slate-900">Idées de Contenu</h3>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="prose prose-sm max-w-none">
                <div className="text-purple-900 text-sm whitespace-pre-wrap">
                  {insights.content}
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onInsightApplied?.(insights)}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  Utiliser ce contenu
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleGenerateContent}
                  disabled={isLoading}
                >
                  Régénérer
                </Button>
              </div>
            </div>
            
            {insights.sources && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">Recherche basée sur:</p>
                {insights.sources.slice(0, 3).map((source: any, index: number) => (
                  <a 
                    key={index}
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-600 hover:underline mb-1"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );

      case 'timing':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-900">Optimisation Horaires</h3>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-green-900 text-sm whitespace-pre-wrap">
                {insights.content}
              </div>
              
              <div className="mt-4">
                <Button 
                  size="sm" 
                  onClick={() => onInsightApplied?.(insights)}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Optimiser le planning
                </Button>
              </div>
            </div>
            
            {insights.sources && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">Données basées sur:</p>
                {insights.sources.slice(0, 3).map((source: any, index: number) => (
                  <a 
                    key={index}
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-600 hover:underline mb-1"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions rapides */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={handleGetTrends}
          disabled={isLoading}
          className="w-full bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white border-0 justify-start"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isLoading && activeInsight === 'trends' ? 'Analyse...' : 'Analyser les tendances'}
        </Button>
        
        <Button
          onClick={handleGenerateContent}
          disabled={isLoading}
          className="w-full bg-purple-500/10 text-purple-600 hover:bg-purple-600 hover:text-white border-0 justify-start"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          {isLoading && activeInsight === 'content' ? 'Génération...' : 'Générer du contenu'}
        </Button>
        
        <Button
          onClick={handleGetTimingInsights}
          disabled={isLoading}
          className="w-full bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white border-0 justify-start"
        >
          <Clock className="w-4 h-4 mr-2" />
          {isLoading && activeInsight === 'timing' ? 'Analyse...' : 'Optimiser les horaires'}
        </Button>
      </div>

      {/* Statistiques contextuelles */}
      {weeklyStats && (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-900">Contexte de la semaine</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Posts programmés:</span>
                <span className="font-medium">{weeklyStats.scheduledPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Brouillons:</span>
                <span className="font-medium">{weeklyStats.draftPosts}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erreur */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Contenu des insights */}
      {insights && (
        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            {renderInsightContent()}
          </CardContent>
        </Card>
      )}

      {/* Message d'aide */}
      {!activeInsight && !insights && (
        <div className="text-center py-6 text-slate-500">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Utilisez les insights IA pour optimiser votre planning</p>
          <p className="text-xs">Cliquez sur une action pour commencer</p>
        </div>
      )}
    </div>
  );
}; 