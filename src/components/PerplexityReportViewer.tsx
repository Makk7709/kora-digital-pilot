import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Share2, 
  TrendingUp, 
  Target, 
  AlertTriangle,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { PerplexityReport } from '@/services/BrandAnalysisService';

interface PerplexityReportViewerProps {
  report: PerplexityReport;
  className?: string;
}

export const PerplexityReportViewer: React.FC<PerplexityReportViewerProps> = ({ 
  report, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('summary');

  // === LOGS DE DIAGNOSTIC ===
  console.log('🎨 [PerplexityReportViewer] Rendu avec données:', {
    reportId: report?.id,
    brandName: report?.brandName,
    reputationScore: report?.reputationScore,
    keyInsightsCount: report?.keyInsights?.length,
    recommendedActionsCount: report?.recommendedActions?.length,
    hasDetailedAnalysis: !!report?.detailedAnalysis,
    activeTab
  });

  React.useEffect(() => {
    console.log('🔄 [PerplexityReportViewer] Changement d\'onglet:', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    console.log('🔄 [PerplexityReportViewer] Nouveau rapport reçu:', {
      id: report?.id,
      insights: report?.keyInsights?.length,
      actions: report?.recommendedActions?.length
    });
  }, [report]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellente';
    if (score >= 60) return 'Bonne';
    if (score >= 40) return 'Moyenne';
    return 'À améliorer';
  };

  const handleDownload = () => {
    const content = generateReportText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${report.brandName}-${report.generatedAt.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportText = () => {
    return `
RAPPORT D'ANALYSE DE MARQUE - ${report.brandName.toUpperCase()}
${'='.repeat(60)}

Généré le: ${report.generatedAt.toLocaleString('fr-FR')}
ID du rapport: ${report.id}
Score de réputation: ${report.reputationScore}/100 (${getScoreLabel(report.reputationScore)})

RÉSUMÉ EXÉCUTIF
${'='.repeat(60)}
${report.executiveSummary}

POSITION CONCURRENTIELLE
${'='.repeat(60)}
${report.competitivePosition}

INSIGHTS CLÉS
${'='.repeat(60)}
${report.keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join('\n')}

RECOMMANDATIONS D'ACTIONS
${'='.repeat(60)}
${report.recommendedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

ANALYSE DÉTAILLÉE
${'='.repeat(60)}

SENTIMENT
${'-'.repeat(30)}
${report.detailedAnalysis.sentiment}

MENTIONS
${'-'.repeat(30)}
${report.detailedAnalysis.mentions}

CONCURRENTS
${'-'.repeat(30)}
${report.detailedAnalysis.competitors}

MOTS-CLÉS
${'-'.repeat(30)}
${report.detailedAnalysis.keywords}

ANALYSE SWOT
${'-'.repeat(30)}
${report.detailedAnalysis.swot}

ALERTES
${'-'.repeat(30)}
${report.detailedAnalysis.alerts}

${'='.repeat(60)}
Rapport généré par Kora Digital - Solution de veille de marque IA
    `.trim();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête du rapport */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Rapport Perplexity - {report.brandName}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <span>Généré le {report.generatedAt.toLocaleString('fr-FR')}</span>
                  <Badge variant="outline" className="ml-2">
                    <Eye className="h-3 w-3 mr-1" />
                    Lecture optimisée
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-4 py-2 rounded-lg font-semibold ${getScoreColor(report.reputationScore)}`}>
                {report.reputationScore}/100
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Score de réputation proéminent */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Score de Réputation</h3>
              <p className="text-sm text-gray-600">
                Évaluation globale basée sur l'analyse des mentions, sentiment et position concurrentielle
              </p>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-1 ${getScoreColor(report.reputationScore).split(' ')[0]}`}>
                {report.reputationScore}
              </div>
              <div className="text-sm text-gray-500">/ 100</div>
              <Badge variant="secondary" className="mt-2">
                {getScoreLabel(report.reputationScore)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenu du rapport avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="analysis">Analyse</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        {/* Onglet Résumé */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                Résumé Exécutif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: report.executiveSummary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Position Concurrentielle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: report.competitivePosition.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Insights */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Insights Clés ({report.keyInsights.length})
              </CardTitle>
              <CardDescription>
                Points saillants et tendances identifiés dans l'analyse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.keyInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-sm">
                      {insight}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyse */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse du Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <pre className="text-sm whitespace-pre-wrap">
                    {report.detailedAnalysis.sentiment}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse des Mentions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <pre className="text-sm whitespace-pre-wrap">
                    {report.detailedAnalysis.mentions}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Concurrents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse Concurrentielle</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <pre className="text-sm whitespace-pre-wrap">
                    {report.detailedAnalysis.competitors}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Mots-clés */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse des Mots-clés</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <pre className="text-sm whitespace-pre-wrap">
                    {report.detailedAnalysis.keywords}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* SWOT et Alertes en pleine largeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse SWOT</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <pre className="text-sm whitespace-pre-wrap">
                    {report.detailedAnalysis.swot}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <pre className="text-sm whitespace-pre-wrap">
                    {report.detailedAnalysis.alerts}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Actions */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Recommandations d'Actions ({report.recommendedActions.length})
              </CardTitle>
              <CardDescription>
                Actions prioritaires basées sur l'analyse de votre marque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-900 mb-1">
                        Action recommandée
                      </div>
                      <div className="text-sm text-green-700">
                        {action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer avec métadonnées */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>ID: {report.id}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Marque: {report.brandName}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Score: {report.reputationScore}/100</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <FileText className="h-3 w-3 mr-1" />
                Rapport Perplexity
              </Badge>
              <Badge variant="secondary">
                Optimisé pour lecture
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 