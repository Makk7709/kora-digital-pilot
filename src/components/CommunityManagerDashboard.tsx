import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Eye, 
  RefreshCw, 
  Clock, 
  ExternalLink,
  Brain,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
  Settings,
  Bell
} from 'lucide-react';
import { usePerplexity } from '@/hooks/usePerplexity';
import { useToast } from '@/hooks/use-toast';

interface TrendInsight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  source: string;
  url: string;
  timestamp: Date;
  category: 'ai-trends' | 'content-improvement' | 'trending-content' | 'brand-monitoring';
}

interface ScanStatus {
  isScanning: boolean;
  lastScan: Date | null;
  nextScan: Date | null;
  scanCount: number;
}

export const CommunityManagerDashboard: React.FC = () => {
  const perplexity = usePerplexity();
  const { toast } = useToast();

  // États pour les 4 axes
  const [aiTrends, setAiTrends] = useState<TrendInsight[]>([]);
  const [contentImprovements, setContentImprovements] = useState<TrendInsight[]>([]);
  const [trendingContent, setTrendingContent] = useState<TrendInsight[]>([]);
  const [brandMonitoring, setBrandMonitoring] = useState<TrendInsight[]>([]);

  // État du scan automatique
  const [scanStatus, setScanStatus] = useState<ScanStatus>({
    isScanning: false,
    lastScan: null,
    nextScan: null,
    scanCount: 0,
  });

  const [autoScanEnabled, setAutoScanEnabled] = useState(true);

  // Scan automatique toutes les 12 heures (2x par jour)
  useEffect(() => {
    if (!autoScanEnabled || !perplexity.isInitialized) return;

    const performAutoScan = async () => {
      await scanAllAxes();
    };

    // Scan initial
    performAutoScan();

    // Programmer les scans suivants (12h = 43200000ms)
    const interval = setInterval(performAutoScan, 12 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoScanEnabled, perplexity.isInitialized]);

  // Fonction principale de scan des 4 axes
  const scanAllAxes = async () => {
    if (!perplexity.isInitialized) {
      toast({
        title: "Service non disponible",
        description: "Perplexity n'est pas configuré",
        variant: "destructive",
      });
      return;
    }

    setScanStatus(prev => ({ 
      ...prev, 
      isScanning: true,
      scanCount: prev.scanCount + 1 
    }));

    try {
      // Scan parallèle des 4 axes
      const [trends, improvements, trending, monitoring] = await Promise.all([
        scanAITrends(),
        scanContentImprovements(),
        scanTrendingContent(),
        scanBrandMonitoring(),
      ]);

      setAiTrends(trends);
      setContentImprovements(improvements);
      setTrendingContent(trending);
      setBrandMonitoring(monitoring);

      const now = new Date();
      setScanStatus(prev => ({
        ...prev,
        isScanning: false,
        lastScan: now,
        nextScan: new Date(now.getTime() + 12 * 60 * 60 * 1000),
      }));

      toast({
        title: "Veille mise à jour",
        description: "Tous les axes ont été analysés avec succès",
      });

    } catch (error) {
      setScanStatus(prev => ({ ...prev, isScanning: false }));
      toast({
        title: "Erreur de scan",
        description: "Impossible de mettre à jour la veille",
        variant: "destructive",
      });
    }
  };

  // 1. Tendances IA
  const scanAITrends = async (): Promise<TrendInsight[]> => {
    const response = await perplexity.getBusinessInsights({
      query: `Quelles sont les 5 principales tendances en intelligence artificielle pour les entreprises en ${new Date().getFullYear()} ? 
              Focus sur l'IA générative, l'automatisation, et les nouvelles technologies émergentes. 
              Inclure l'impact business et les opportunités pour les agences marketing.`,
      industry: 'ai',
      depth: 'comprehensive',
      language: 'fr',
      context: 'Analyse pour Kora Digital - Agence spécialisée en IA et marketing digital'
    });

    return parseResponseToInsights(response, 'ai-trends');
  };

  // 2. Améliorations de contenu
  const scanContentImprovements = async (): Promise<TrendInsight[]> => {
    const response = await perplexity.getBusinessInsights({
      query: `Quelles sont les meilleures pratiques actuelles pour optimiser le contenu marketing digital ? 
              Focus sur l'engagement, les nouveaux formats, les algorithmes des réseaux sociaux, 
              et les techniques de storytelling qui fonctionnent en ${new Date().getFullYear()}.`,
      industry: 'digital-marketing',
      depth: 'detailed',
      language: 'fr',
      context: 'Optimisation de contenu pour community manager'
    });

    return parseResponseToInsights(response, 'content-improvement');
  };

  // 3. Contenus tendances du jour (Top 10)
  const scanTrendingContent = async (): Promise<TrendInsight[]> => {
    const response = await perplexity.getBusinessInsights({
      query: `Quels sont les 10 sujets les plus tendances aujourd'hui dans le domaine de l'IA, 
              du marketing digital et de l'innovation technologique ? 
              Inclure les hashtags populaires et les angles d'approche pour du contenu viral.`,
      industry: 'digital-marketing',
      depth: 'quick',
      language: 'fr',
      context: 'Identification de contenus viraux pour réseaux sociaux'
    });

    return parseResponseToInsights(response, 'trending-content');
  };

  // 4. Veille d'entreprise (ce qu'on dit de nous)
  const scanBrandMonitoring = async (): Promise<TrendInsight[]> => {
    const response = await perplexity.getBusinessInsights({
      query: `Rechercher les mentions récentes de "Kora Digital", "agence IA", "marketing automation", 
              et "intelligence artificielle marketing" dans les actualités et discussions professionnelles. 
              Inclure les tendances du secteur des agences digitales spécialisées en IA.`,
      industry: 'digital-marketing',
      depth: 'comprehensive',
      language: 'fr',
      context: 'Veille de réputation et monitoring concurrentiel'
    });

    return parseResponseToInsights(response, 'brand-monitoring');
  };

  // Parser les réponses Perplexity en insights structurés
  const parseResponseToInsights = (response: any, category: TrendInsight['category']): TrendInsight[] => {
    if (!response?.content) return [];

    const lines = response.content.split('\n').filter((line: string) => line.trim());
    const insights: TrendInsight[] = [];

    let currentInsight: Partial<TrendInsight> = {};
    
    for (const line of lines) {
      if (line.match(/^\d+\.|^-|^•/) || line.includes(':')) {
        if (currentInsight.title) {
          insights.push({
            id: Math.random().toString(36).substr(2, 9),
            title: currentInsight.title || '',
            description: currentInsight.description || '',
            impact: currentInsight.impact || 'medium',
            source: response.sources?.[0]?.title || 'Perplexity AI',
            url: response.sources?.[0]?.url || '',
            timestamp: new Date(),
            category,
            ...currentInsight,
          });
          currentInsight = {};
        }
        
        const cleanLine = line.replace(/^\d+\.|^-|^•/, '').trim();
        const [title, ...descParts] = cleanLine.split(':');
        currentInsight.title = title.trim();
        currentInsight.description = descParts.join(':').trim();
        
        // Déterminer l'impact basé sur des mots-clés
        const impactKeywords = {
          high: ['révolutionnaire', 'majeur', 'crucial', 'essentiel', 'breakthrough'],
          low: ['mineur', 'léger', 'optionnel', 'secondaire']
        };
        
        const lowerLine = line.toLowerCase();
        if (impactKeywords.high.some(keyword => lowerLine.includes(keyword))) {
          currentInsight.impact = 'high';
        } else if (impactKeywords.low.some(keyword => lowerLine.includes(keyword))) {
          currentInsight.impact = 'low';
        } else {
          currentInsight.impact = 'medium';
        }
      }
    }

    // Ajouter le dernier insight s'il existe
    if (currentInsight.title) {
      insights.push({
        id: Math.random().toString(36).substr(2, 9),
        title: currentInsight.title || '',
        description: currentInsight.description || '',
        impact: currentInsight.impact || 'medium',
        source: response.sources?.[0]?.title || 'Perplexity AI',
        url: response.sources?.[0]?.url || '',
        timestamp: new Date(),
        category,
        ...currentInsight,
      });
    }

    return insights.slice(0, category === 'trending-content' ? 10 : 5);
  };

  // Composant pour afficher une carte d'axe
  const AxisCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    insights: TrendInsight[];
    color: string;
  }> = ({ title, icon, insights, color }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          <span>{title}</span>
          <Badge variant="outline" className="ml-auto">
            {insights.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucun insight disponible</p>
                <p className="text-sm">Lancez un scan pour obtenir des données</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm leading-tight">{insight.title}</h4>
                    <Badge 
                      variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {insight.impact}
                    </Badge>
                  </div>
                  {insight.description && (
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                      {insight.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {insight.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {insight.url && (
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-500" />
                Dashboard Community Manager
              </CardTitle>
              <p className="text-muted-foreground">
                Veille intelligente automatisée - 4 axes stratégiques
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Statut du scan */}
              <div className="flex items-center gap-2">
                {scanStatus.isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm">Scan en cours...</span>
                  </>
                ) : (
                  <>
                    <div className={`h-2 w-2 rounded-full ${perplexity.isInitialized ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm">
                      {perplexity.isInitialized ? 'Connecté' : 'Déconnecté'}
                    </span>
                  </>
                )}
              </div>

              {/* Informations de scan */}
              {scanStatus.lastScan && (
                <div className="text-sm text-muted-foreground">
                  Dernier scan: {scanStatus.lastScan.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}

              {/* Contrôles */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                className="flex items-center gap-2"
              >
                <Bell className={`h-4 w-4 ${autoScanEnabled ? 'text-green-500' : 'text-gray-400'}`} />
                Auto-scan {autoScanEnabled ? 'ON' : 'OFF'}
              </Button>

              <Button
                onClick={scanAllAxes}
                disabled={scanStatus.isScanning || !perplexity.isInitialized}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${scanStatus.isScanning ? 'animate-spin' : ''}`} />
                Scanner maintenant
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Tendances IA</p>
                <p className="text-2xl font-bold">{aiTrends.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Améliorations</p>
                <p className="text-2xl font-bold">{contentImprovements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Trending</p>
                <p className="text-2xl font-bold">{trendingContent.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Veille marque</p>
                <p className="text-2xl font-bold">{brandMonitoring.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Les 4 cartes principales */}
      <div className="grid grid-cols-2 gap-6">
        <AxisCard
          title="Tendances IA"
          icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
          insights={aiTrends}
          color="blue"
        />

        <AxisCard
          title="Améliorations Contenu"
          icon={<Sparkles className="h-5 w-5 text-purple-500" />}
          insights={contentImprovements}
          color="purple"
        />

        <AxisCard
          title="Contenus Tendances (Top 10)"
          icon={<Calendar className="h-5 w-5 text-green-500" />}
          insights={trendingContent}
          color="green"
        />

        <AxisCard
          title="Veille d'Entreprise"
          icon={<Eye className="h-5 w-5 text-orange-500" />}
          insights={brandMonitoring}
          color="orange"
        />
      </div>

      {/* Informations sur le prochain scan */}
      {scanStatus.nextScan && autoScanEnabled && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Prochain scan automatique: {scanStatus.nextScan.toLocaleString('fr-FR')}
                </span>
              </div>
              <Badge variant="outline">
                Scan #{scanStatus.scanCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 