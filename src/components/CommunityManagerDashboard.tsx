import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Loader2,
  Bell,
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

// S6478 : palettes, styles d'impact et composant `AxisCard` hissés au module.
const AXIS_COLOR_CLASSES: Record<string, { gradient: string; badge: string }> = {
  blue: {
    gradient: 'from-blue-50 to-blue-100',
    badge: 'border-blue-200 text-blue-700 bg-blue-50',
  },
  purple: {
    gradient: 'from-purple-50 to-purple-100',
    badge: 'border-purple-200 text-purple-700 bg-purple-50',
  },
  green: {
    gradient: 'from-green-50 to-green-100',
    badge: 'border-green-200 text-green-700 bg-green-50',
  },
  orange: {
    gradient: 'from-orange-50 to-orange-100',
    badge: 'border-orange-200 text-orange-700 bg-orange-50',
  },
};

const IMPACT_STYLES: Record<
  TrendInsight['impact'],
  { variant: 'destructive' | 'default' | 'secondary'; className: string; label: string }
> = {
  high: {
    variant: 'destructive',
    className: 'bg-red-50 text-red-700 border-red-200',
    label: 'Élevé',
  },
  medium: {
    variant: 'default',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Moyen',
  },
  low: {
    variant: 'secondary',
    className: 'bg-slate-50 text-slate-700 border-slate-200',
    label: 'Faible',
  },
};

const AxisCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  insights: TrendInsight[];
  color: string;
}> = ({ title, icon, insights, color }) => {
  const palette = AXIS_COLOR_CLASSES[color] ?? AXIS_COLOR_CLASSES.orange;
  return (
    <Card className="premium-card h-full hover-glow">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${palette.gradient}`}
          >
            {icon}
          </div>
          <span className="font-semibold">{title}</span>
          <Badge variant="outline" className={`ml-auto font-medium ${palette.badge}`}>
            {insights.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br ${palette.gradient}`}
                >
                  <Brain className="h-8 w-8 text-slate-400" />
                </div>
                <p className="font-medium text-slate-900 mb-2">Aucun insight disponible</p>
                <p className="text-sm text-slate-500">Lancez un scan pour obtenir des données</p>
              </div>
            ) : (
              insights.map((insight) => {
                const impactStyle = IMPACT_STYLES[insight.impact] ?? IMPACT_STYLES.low;
                return (
                  <div
                    key={insight.id}
                    data-testid="insight-card"
                    className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-white to-slate-50/50 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 text-sm leading-snug pr-3">
                        {insight.title}
                      </h4>
                      <Badge
                        variant={impactStyle.variant}
                        className={`text-xs font-medium shrink-0 ${impactStyle.className}`}
                      >
                        {impactStyle.label}
                      </Badge>
                    </div>
                    {insight.description && (
                      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        {insight.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">
                        {insight.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {insight.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-3 text-xs hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Source
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

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

  const [autoScanEnabled, setAutoScanEnabled] = useState(false);

  // 🛡️ PROTECTION CRÉDIT API - Scan automatique désactivé par défaut
  useEffect(() => {
    if (!autoScanEnabled || !perplexity.isInitialized) return;

    console.warn('⚠️ Auto-scan Community Manager activé - Consommation crédits API en cours');

    const performAutoScan = async () => {
      console.log('🔄 [Auto-scan] Démarrage scan automatique des 4 axes');
      await scanAllAxes();
    };

    // ✅ RETIRÉ: Plus de scan initial automatique
    // L'utilisateur doit déclencher manuellement

    // Programmer les scans suivants (12h = 43200000ms)
    const interval = setInterval(
      () => {
        console.log('🔄 [Auto-scan] Scan programmé toutes les 12h');
        performAutoScan();
      },
      12 * 60 * 60 * 1000,
    );

    return () => {
      console.log('🛑 Auto-scan Community Manager arrêté');
      clearInterval(interval);
    };
  }, [autoScanEnabled, perplexity.isInitialized]);

  // Fonction principale de scan des 4 axes
  const scanAllAxes = async () => {
    if (!perplexity.isInitialized) {
      toast({
        title: 'Service non disponible',
        description: "Perplexity n'est pas configuré",
        variant: 'destructive',
      });
      return;
    }

    setScanStatus((prev) => ({
      ...prev,
      isScanning: true,
      scanCount: prev.scanCount + 1,
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
      setScanStatus((prev) => ({
        ...prev,
        isScanning: false,
        lastScan: now,
        nextScan: new Date(now.getTime() + 12 * 60 * 60 * 1000),
      }));

      toast({
        title: 'Veille mise à jour',
        description: 'Tous les axes ont été analysés avec succès',
      });
    } catch (error) {
      console.error('[CommunityManagerDashboard] scan failed:', error);
      setScanStatus((prev) => ({ ...prev, isScanning: false }));
      toast({
        title: 'Erreur de scan',
        description: 'Impossible de mettre à jour la veille',
        variant: 'destructive',
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
      context: 'Analyse pour Kora Digital - Agence spécialisée en IA et marketing digital',
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
      context: 'Optimisation de contenu pour community manager',
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
      context: 'Identification de contenus viraux pour réseaux sociaux',
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
      context: 'Veille de réputation et monitoring concurrentiel',
    });

    return parseResponseToInsights(response, 'brand-monitoring');
  };

  // Parser les réponses Perplexity en insights structurés
  const parseResponseToInsights = (
    response: any,
    category: TrendInsight['category'],
  ): TrendInsight[] => {
    if (!response?.content) return [];

    const lines = response.content.split('\n').filter((line: string) => line.trim());
    const insights: TrendInsight[] = [];

    let currentInsight: Partial<TrendInsight> = {};

    for (const line of lines) {
      if (/^\d+\.|^-|^•/.test(line) || line.includes(':')) {
        if (currentInsight.title) {
          insights.push({
            id: Math.random().toString(36).slice(2, 11),
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
          low: ['mineur', 'léger', 'optionnel', 'secondaire'],
        };

        const lowerLine = line.toLowerCase();
        if (impactKeywords.high.some((keyword) => lowerLine.includes(keyword))) {
          currentInsight.impact = 'high';
        } else if (impactKeywords.low.some((keyword) => lowerLine.includes(keyword))) {
          currentInsight.impact = 'low';
        } else {
          currentInsight.impact = 'medium';
        }
      }
    }

    // Ajouter le dernier insight s'il existe
    if (currentInsight.title) {
      insights.push({
        id: Math.random().toString(36).slice(2, 11),
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

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <Card className="premium-card">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-blue-600" />
                </div>
                <span className="font-bold">Dashboard Community Manager</span>
              </CardTitle>
              <p className="text-slate-600 mt-2 text-base">
                Veille intelligente automatisée - 4 axes stratégiques
              </p>
            </div>
            <div className="flex items-center gap-6">
              {/* Statut du scan */}
              <div className="flex items-center gap-3">
                {scanStatus.isScanning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">Scan en cours...</span>
                  </>
                ) : (
                  <>
                    <div
                      className={`h-3 w-3 rounded-full ${perplexity.isInitialized ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {perplexity.isInitialized ? 'Connecté' : 'Déconnecté'}
                    </span>
                  </>
                )}
              </div>

              {/* Informations de scan */}
              {scanStatus.lastScan && (
                <div className="text-sm text-slate-500 font-medium">
                  Dernier scan:{' '}
                  {scanStatus.lastScan.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}

              {/* Contrôles */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                className={`flex items-center gap-2 border-2 font-medium transition-all duration-300 ${
                  autoScanEnabled
                    ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bell
                  className={`h-4 w-4 ${autoScanEnabled ? 'text-green-600' : 'text-slate-400'}`}
                />
                Auto-scan {autoScanEnabled ? 'ON' : 'OFF'}
              </Button>

              <Button
                onClick={scanAllAxes}
                disabled={scanStatus.isScanning || !perplexity.isInitialized}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <RefreshCw className={`h-4 w-4 ${scanStatus.isScanning ? 'animate-spin' : ''}`} />
                Scanner maintenant
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="premium-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">Tendances IA</p>
                <p className="text-3xl font-bold text-slate-900">{aiTrends.length}</p>
                <p className="text-xs text-blue-600 font-medium">Insights disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">Améliorations</p>
                <p className="text-3xl font-bold text-slate-900">{contentImprovements.length}</p>
                <p className="text-xs text-purple-600 font-medium">Conseils actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">Trending</p>
                <p className="text-3xl font-bold text-slate-900">{trendingContent.length}</p>
                <p className="text-xs text-green-600 font-medium">Sujets populaires</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-1">Veille marque</p>
                <p className="text-3xl font-bold text-slate-900">{brandMonitoring.length}</p>
                <p className="text-xs text-orange-600 font-medium">Mentions trouvées</p>
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
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>
                <span className="text-sm text-slate-700 font-medium">
                  Prochain scan automatique: {scanStatus.nextScan.toLocaleString('fr-FR')}
                </span>
              </div>
              <Badge
                variant="outline"
                className="border-slate-200 text-slate-700 bg-slate-50 font-medium"
              >
                Scan #{scanStatus.scanCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
