import React, { useState } from 'react';
import { handleActivateKey } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  TrendingUp,
  Eye,
  Users,
  FileText,
  ExternalLink,
  RefreshCw,
  Zap,
  Brain,
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { usePerplexity, useMarketingInsights, useTechWatch } from '@/hooks/usePerplexity';
import { InsightRequest, MarketInsight, PerplexityResponse } from '@/lib/perplexity-service';

interface PerplexityInsightsProps {
  className?: string;
}

// S3358 : helper extrait pour la variant d'impact (sinon ternaire imbriqué).
const impactVariant = (
  impact: MarketInsight['impact'],
): 'destructive' | 'default' | 'secondary' => {
  if (impact === 'high') return 'destructive';
  if (impact === 'medium') return 'default';
  return 'secondary';
};

// S6478 : composants purs hissés au module — pas de closure sur l'état parent.
const ResponseDisplay: React.FC<{ response: PerplexityResponse }> = ({ response }) => (
  <Card className="mt-4">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Insights Perplexity
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{response.model}</Badge>
          <Badge variant="secondary">{response.usage.total_tokens} tokens</Badge>
        </div>
      </div>
      <CardDescription>Généré le {response.timestamp.toLocaleString('fr-FR')}</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-96 w-full">
        <div className="prose prose-sm max-w-none">
          {response.content.split('\n').map((paragraph, index) => (
            <p key={`row-${index}`} className="mb-3 text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </ScrollArea>

      {response.sources.length > 0 && (
        <>
          <Separator className="my-4" />
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Sources ({response.sources.length})
            </h4>
            <div className="space-y-2">
              {response.sources.map((source, index) => (
                <Card key={`row-${index}`} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{source.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{source.snippet}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const InsightsDisplay: React.FC<{ insights: MarketInsight[] }> = ({ insights }) => (
  <div className="space-y-4 mt-4">
    {insights.map((insight, index) => (
      <Card key={`row-${index}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{insight.trend}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={impactVariant(insight.impact)}>Impact {insight.impact}</Badge>
              <Badge variant="outline">Score: {Math.round(insight.confidence_score * 100)}%</Badge>
            </div>
          </div>
          <CardDescription>Délai: {insight.timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          {insight.actionable_insights.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Actions recommandées:</h4>
              <ul className="space-y-1">
                {insight.actionable_insights.map((action, actionIndex) => (
                  <li key={`row-${actionIndex}`} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export const PerplexityInsights: React.FC<PerplexityInsightsProps> = ({ className }) => {
  const perplexity = usePerplexity();
  const marketingInsights = useMarketingInsights();
  const techWatch = useTechWatch();

  const [activeTab, setActiveTab] = useState('insights');
  const [query, setQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('digital-marketing');
  const [selectedDepth, setSelectedDepth] = useState<string>('detailed');
  const [competitors, setCompetitors] = useState('');
  const [market, setMarket] = useState('');
  const [contentTopic, setContentTopic] = useState('');
  const [contentType, setContentType] = useState<'article' | 'post' | 'thread'>('post');

  // État pour les résultats
  const [currentResponse, setCurrentResponse] = useState<PerplexityResponse | null>(null);
  const [insights, setInsights] = useState<MarketInsight[]>([]);

  // Recherche d'insights business
  const handleBusinessInsights = async () => {
    if (!query.trim()) return;

    const request: InsightRequest = {
      query,
      industry: selectedIndustry as any,
      depth: selectedDepth as any,
      language: 'fr',
      context: 'Analyse pour Kora Digital - Agence spécialisée en IA et marketing digital',
    };

    const response = await perplexity.getBusinessInsights(request);
    if (response) {
      setCurrentResponse(response);
    }
  };

  // Recherche de tendances marketing
  const handleMarketingTrends = async () => {
    if (!query.trim()) return;

    const trends = await marketingInsights.getMarketingTrends(query, '7d');
    setInsights(trends);
  };

  // Analyse concurrentielle
  const handleCompetitorAnalysis = async () => {
    if (!competitors.trim() || !market.trim()) return;

    const competitorList = competitors.split(',').map((c) => c.trim());
    const response = await perplexity.getCompetitorAnalysis(competitorList, market);
    if (response) {
      setCurrentResponse(response);
    }
  };

  // Génération de contenu avec recherche
  const handleContentGeneration = async () => {
    if (!contentTopic.trim()) return;

    const response = await perplexity.generateContentWithResearch(contentTopic, contentType);
    if (response) {
      setCurrentResponse(response);
    }
  };

  // Veille technologique
  const handleTechWatch = async () => {
    if (!query.trim()) return;

    const response = await techWatch.getAITechWatch(query);
    if (response) {
      setCurrentResponse(response);
    }
  };

  // ResponseDisplay et InsightsDisplay sont déclarés au module scope (S6478).

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            Perplexity AI Insights
          </CardTitle>
          <CardDescription>
            Intelligence économique et veille technologique en temps réel
          </CardDescription>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${perplexity.isInitialized ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span className="text-sm">
                {perplexity.isInitialized ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
            <Badge variant="outline">Cache: {perplexity.cacheStats.size} entrées</Badge>
            {perplexity.isLoading && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyse en cours...</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendances
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Concurrence
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contenu
          </TabsTrigger>
          <TabsTrigger value="tech" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Tech Watch
          </TabsTrigger>
        </TabsList>

        {/* Onglet Insights Business */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recherche d'Insights Business</CardTitle>
              <CardDescription>
                Obtenez des analyses précises et sourcées sur votre marché
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span id="pi-industry-label" className="text-sm font-medium">
                    Secteur d'activité
                  </span>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger aria-labelledby="pi-industry-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital-marketing">Marketing Digital</SelectItem>
                      <SelectItem value="ai">Intelligence Artificielle</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="tech">Technologie</SelectItem>
                      <SelectItem value="productivity">Productivité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <span id="pi-depth-label" className="text-sm font-medium">
                    Niveau de détail
                  </span>
                  <Select value={selectedDepth} onValueChange={setSelectedDepth}>
                    <SelectTrigger aria-labelledby="pi-depth-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Rapide</SelectItem>
                      <SelectItem value="detailed">Détaillé</SelectItem>
                      <SelectItem value="comprehensive">Complet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <label className="block">
                <span className="text-sm font-medium">Votre question</span>
                <Textarea
                  placeholder="Ex: Quelles sont les dernières tendances en IA pour le marketing digital ?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                />
              </label>
              <Button
                onClick={handleBusinessInsights}
                disabled={!query.trim() || perplexity.isLoading}
                className="w-full"
              >
                {perplexity.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Analyser
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tendances Marketing */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances Marketing Digital</CardTitle>
              <CardDescription>Découvrez les dernières tendances de votre secteur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Sujet d'analyse</span>
                <Input
                  placeholder="Ex: Marketing d'influence, SEO, publicité programmatique..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <Button
                onClick={handleMarketingTrends}
                disabled={!query.trim() || marketingInsights.isLoading}
                className="w-full"
              >
                {marketingInsights.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-2" />
                )}
                Analyser les tendances
              </Button>
            </CardContent>
          </Card>

          {insights.length > 0 && <InsightsDisplay insights={insights} />}
        </TabsContent>

        {/* Onglet Analyse Concurrentielle */}
        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Concurrentielle</CardTitle>
              <CardDescription>
                Analysez vos concurrents et identifiez les opportunités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Concurrents (séparés par des virgules)</span>
                <Input
                  placeholder="Ex: HubSpot, Salesforce, Mailchimp"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Marché d'analyse</span>
                <Input
                  placeholder="Ex: Marketing automation, CRM, Email marketing"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                />
              </label>
              <Button
                onClick={handleCompetitorAnalysis}
                disabled={!competitors.trim() || !market.trim() || perplexity.isLoading}
                className="w-full"
              >
                {perplexity.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                Analyser la concurrence
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Génération de Contenu */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Génération de Contenu avec Recherche</CardTitle>
              <CardDescription>
                Créez du contenu basé sur les dernières informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Sujet du contenu</span>
                  <Input
                    placeholder="Ex: L'impact de l'IA sur le marketing digital"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                  />
                </label>
                <div>
                  <span id="pi-content-type-label" className="text-sm font-medium">
                    Type de contenu
                  </span>
                  <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                    <SelectTrigger aria-labelledby="pi-content-type-label">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article de blog</SelectItem>
                      <SelectItem value="post">Post social media</SelectItem>
                      <SelectItem value="thread">Thread Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleContentGeneration}
                disabled={!contentTopic.trim() || perplexity.isLoading}
                className="w-full"
              >
                {perplexity.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Générer le contenu
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Veille Technologique */}
        <TabsContent value="tech" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Veille Technologique IA</CardTitle>
              <CardDescription>Restez à jour sur les innovations technologiques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Domaine technologique</span>
                <Input
                  placeholder="Ex: Machine Learning, NLP, Computer Vision, GPT..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={handleTechWatch}
                  disabled={!query.trim() || techWatch.isLoading}
                  className="flex-1"
                >
                  {techWatch.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Analyser
                </Button>
                <Button
                  variant="outline"
                  onClick={() => techWatch.addToWatchlist(query)}
                  disabled={!query.trim()}
                >
                  Ajouter à la veille
                </Button>
              </div>

              {techWatch.watchlist.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Liste de veille:</h4>
                  <div className="flex flex-wrap gap-2">
                    {techWatch.watchlist.map((domain, index) => (
                      <Badge
                        key={`row-${index}`}
                        role="button"
                        tabIndex={0}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => techWatch.removeFromWatchlist(domain)}
                        onKeyDown={handleActivateKey(() => techWatch.removeFromWatchlist(domain))}
                      >
                        {domain} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Affichage des résultats */}
      {currentResponse && <ResponseDisplay response={currentResponse} />}

      {/* Affichage des insights marketing */}
      {insights.length > 0 && <InsightsDisplay insights={insights} />}

      {/* Erreurs */}
      {perplexity.error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Erreur:</span>
              <span>{perplexity.error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => perplexity.clearCache()}
              disabled={perplexity.cacheStats.size === 0}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Vider le cache ({perplexity.cacheStats.size})
            </Button>
            <Button variant="outline" size="sm" onClick={() => perplexity.refreshCacheStats()}>
              <BarChart3 className="h-3 w-3 mr-1" />
              Stats cache
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuery('Dernières tendances en IA pour 2025')}
            >
              <Target className="h-3 w-3 mr-1" />
              Tendances IA 2025
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
