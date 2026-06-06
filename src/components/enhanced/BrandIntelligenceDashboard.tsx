/**
 * 🎯 BRAND INTELLIGENCE DASHBOARD - Enhanced
 * Dashboard avancé avec métriques quantifiées et actions concrètes
 * Respect total des exigences TDD - Interface optimisée pour l'utilité
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Users,
  MessageSquare,
  Lightbulb,
  Shield,
  Clock,
  DollarSign,
  Eye,
  Brain,
  Activity,
  Award,
  Briefcase,
  FileText,
  Sparkles,
  Star,
  Globe,
  TrendingDown as Download,
  Loader2,
} from 'lucide-react';

import { RealBrandIntelligenceService } from '../../services/RealBrandIntelligenceService';
import type {
  DeepResearchReport,
  SWOTMetrics,
  ContentMetrics,
  CompetitiveMetrics,
  ActionableRecommendation,
  SmartAlerts,
  ExportOptions,
} from '../../types/BrandIntelligenceTypes';

// ✅ SERVICES D'EXPORT - Version réelle
import { createReportExportService } from '../../services/export';

interface Props {
  brandName: string;
  perplexityService: any;
}

// Interface pour capturer les réponses Perplexity brutes
interface PerplexityRawData {
  objectiveAnalysis: string;
  strategicAnalysis: string;
  competitiveAnalysis: string;
  trendAnalysis: string;
  sources: Array<{ title: string; url: string; snippet: string }>;
}

export const BrandIntelligenceDashboard: React.FC<Props> = ({ brandName, perplexityService }) => {
  // === ÉTATS ===
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [report, setReport] = useState<DeepResearchReport | null>(null);
  const [rawPerplexityData, setRawPerplexityData] = useState<PerplexityRawData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('rapport-kora');

  // 🔧 FIX: Utiliser le service Perplexity configuré au lieu de créer un nouveau
  const [service] = useState(() =>
    RealBrandIntelligenceService.withPerplexityService(perplexityService),
  );
  const [exportService] = useState(() => createReportExportService());

  // === GÉNÉRATION DU RAPPORT ===
  const generateReport = async () => {
    if (!brandName.trim()) {
      setError('Nom de marque requis');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Appels directs à Perplexity pour capturer le contenu brut
      console.log('🚀 Génération Rapport Kora pour:', brandName);

      const [objectiveResponse, strategicResponse, competitiveResponse, trendResponse] =
        await Promise.all([
          perplexityService.getBusinessInsights({
            query: `Analyse objective complète de ${brandName}: histoire de l'entreprise, position sur le marché, santé financière récente, indices d'innovation, réputation. Incluez des données factuelles avec sources vérifiables.`,
            context: 'Analyse factuelle et objective',
          }),
          perplexityService.getBusinessInsights({
            query: `Analyse stratégique approfondie de ${brandName}: stratégie principale, marchés cibles, avantages concurrentiels, direction future, risques majeurs, priorités stratégiques, modèle économique.`,
            context: 'Analyse stratégique approfondie',
          }),
          perplexityService.getCompetitorAnalysis([brandName], `marché de ${brandName}`),
          perplexityService.getBusinessInsights({
            query: `Tendances émergentes et signaux faibles affectant ${brandName}: disruptions sectorielles, nouvelles opportunités, menaces émergentes, évolutions technologiques, changements réglementaires.`,
            context: 'Détection tendances et signaux',
          }),
        ]);

      // 2. Stocker les données brutes pour le Rapport Kora
      const rawData: PerplexityRawData = {
        objectiveAnalysis: objectiveResponse?.content || '',
        strategicAnalysis: strategicResponse?.content || '',
        competitiveAnalysis: competitiveResponse?.content || '',
        trendAnalysis: trendResponse?.content || '',
        sources: [
          ...(objectiveResponse?.sources || []),
          ...(strategicResponse?.sources || []),
          ...(competitiveResponse?.sources || []),
          ...(trendResponse?.sources || []),
        ],
      };

      setRawPerplexityData(rawData);

      // 3. Générer le rapport structuré pour les autres onglets
      const newReport = await service.generateRealDeepResearchReport(brandName);
      setReport(newReport);

      console.log('✅ Rapport Kora généré avec succès:', { report: newReport, rawData });
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Erreur génération Rapport Kora:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildExportPayload = (dataToExport: any) => {
    if (rawPerplexityData && !report) {
      return {
        brandName,
        executionTimestamp: new Date(),
        rawData: rawPerplexityData,
        type: 'Kora P.R.I.S.M Analysis',
        objectiveAnalysis: rawPerplexityData.objectiveAnalysis,
        strategicAnalysis: rawPerplexityData.strategicAnalysis,
        competitiveAnalysis: rawPerplexityData.competitiveAnalysis,
        trendAnalysis: rawPerplexityData.trendAnalysis,
        sources: rawPerplexityData.sources,
      };
    }
    return dataToExport;
  };

  const runPdfExport = async (exportData: any) => {
    try {
      const productionExportService = createReportExportService();
      const enrichedData = {
        ...exportData,
        brandName: brandName || 'Marque analysée',
        fullContent: rawPerplexityData
          ? {
              objectiveAnalysis: rawPerplexityData.objectiveAnalysis,
              strategicAnalysis: rawPerplexityData.strategicAnalysis,
              competitiveAnalysis: rawPerplexityData.competitiveAnalysis,
              trendAnalysis: rawPerplexityData.trendAnalysis,
            }
          : null,
        metadata: {
          generatedBy: 'Kora P.R.I.S.M Production',
          analysisDepth: 'Professional',
          dataSource: 'Perplexity AI + Kora Processing',
          timestamp: new Date().toISOString(),
          qualityAssurance: 'Production Grade',
        },
      };
      const productionOptions: ExportOptions = {
        format: 'pdf',
        template: 'executive',
        includeCharts: true,
        includeRawData: true,
        branding: { companyName: 'Kora P.R.I.S.M Analysis' },
      };
      const result = await productionExportService.exportReport(enrichedData, productionOptions);
      if (!result.success) {
        throw new Error('Export Production échoué');
      }
      return result;
    } catch (productionError) {
      console.warn(
        '⚠️ Export Production indisponible, utilisation export basique:',
        productionError instanceof Error ? productionError.message : productionError,
      );
      return exportSimplePDF(exportData, brandName);
    }
  };

  const runStandardExport = (format: 'json' | 'csv' | 'excel', exportData: any) => {
    const exportOptions: ExportOptions = {
      format,
      includeMetadata: true,
      compressionLevel: 'medium',
      customization: {
        includeCharts: false,
        includeRawData: true,
        includeExecutiveSummary: true,
        includeRecommendations: true,
        includeAlerts: true,
      },
    };
    return exportService.exportReport(exportData, exportOptions);
  };

  const triggerDownload = (result: { downloadUrl?: string; fileName?: string }) => {
    if (!result.downloadUrl || !result.fileName) {
      throw new Error("Résultat d'export incomplet (URL ou nom de fichier manquant)");
    }
    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = result.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === EXPORT DU RAPPORT PREMIUM ===
  const exportReport = async (format: 'json' | 'csv' | 'excel' | 'pdf') => {
    const dataToExport = report || rawPerplexityData;
    if (!dataToExport) {
      setError("Aucun rapport à exporter. Générez d'abord un rapport.");
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const exportData = buildExportPayload(dataToExport);
      const result =
        format === 'pdf'
          ? await runPdfExport(exportData)
          : await runStandardExport(format, exportData);

      if (!result?.success) {
        throw new Error("Erreur lors de l'export");
      }
      triggerDownload(result);
    } catch (err: any) {
      setError(`Erreur export ${format.toUpperCase()}: ${err.message}`);
      console.error(`❌ Erreur export ${format.toUpperCase()}:`, err);
    } finally {
      setIsExporting(false);
    }
  };

  // === FONCTION PDF SIMPLE GARANTIE ===
  const exportSimplePDF = async (data: any, brandName: string) => {
    console.log('📄 Génération PDF simple...');

    try {
      // Import local de jsPDF
      const { default: jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // En-tête
      doc.setFontSize(20);
      doc.text(`Rapport Kora - ${brandName}`, margin, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, margin, yPosition);
      yPosition += 20;

      // Contenu des analyses
      const sections = [
        { title: 'Analyse Objective', content: data.objectiveAnalysis },
        { title: 'Analyse Stratégique', content: data.strategicAnalysis },
        { title: 'Analyse Concurrentielle', content: data.competitiveAnalysis },
        { title: 'Tendances & Signaux', content: data.trendAnalysis },
      ];

      sections.forEach((section) => {
        if (section.content) {
          // Titre de section
          doc.setFontSize(14);
          doc.text(section.title, margin, yPosition);
          yPosition += 10;

          // Contenu (limité pour éviter overflow)
          doc.setFontSize(10);
          const text =
            typeof section.content === 'string'
              ? section.content.substring(0, 500) + '...'
              : JSON.stringify(section.content).substring(0, 500) + '...';

          const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
          doc.text(splitText, margin, yPosition);
          yPosition += splitText.length * 5 + 10;

          // Nouvelle page si nécessaire
          if (yPosition > 250) {
            doc.addPage();
            yPosition = margin;
          }
        }
      });

      // Génération du blob
      const pdfBlob = doc.output('blob');
      const fileName = `${brandName.replace(/[^a-zA-Z0-9]/g, '_')}_Kora_Report_${new Date().toISOString().slice(0, 16).replace(/[:]/g, '-')}.pdf`;
      const downloadUrl = URL.createObjectURL(pdfBlob);

      return {
        success: true,
        fileName,
        filePath: downloadUrl,
        fileSize: pdfBlob.size,
        format: 'pdf',
        downloadUrl,
        enhancementApplied: false,
        metadata: {
          exportedBy: 'Kora Simple PDF Export',
          version: '1.0.0',
          generationTime: Date.now(),
        },
      };
    } catch (error) {
      console.error('❌ Erreur PDF simple:', error);
      throw new Error(`Impossible de générer le PDF: ${error.message}`);
    }
  };

  // === RENDU ===
  return (
    <div className="space-y-6" data-testid="brand-intelligence-dashboard">
      {/* En-tête avec contrôles */}
      <Card className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold" data-testid="dashboard-title">
                  ⟨⟩ P.R.I.S.M Report
                </CardTitle>
                <p className="text-blue-100 mt-2 text-lg">
                  Rapport Kora Premium • Analyse approfondie pour {brandName || 'votre marque'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Bouton Export avec dropdown */}
              {(report || rawPerplexityData) && (
                <div className="relative group">
                  <Button
                    disabled={isExporting}
                    className="bg-green-600 hover:bg-green-700 text-white border-0 backdrop-blur-sm px-6 py-3"
                    data-testid="export-dropdown-button"
                  >
                    {isExporting ? (
                      <>
                        <Activity className="w-5 h-5 mr-2 animate-spin" />
                        Export...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Exporter
                      </>
                    )}
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-3 px-4">
                      <div className="space-y-3">
                        {/* Export Standard */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            Export Standard
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => exportReport('json')}
                              disabled={isExporting || (!report && !rawPerplexityData)}
                              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 text-sm disabled:opacity-50"
                            >
                              <Download className="w-4 h-4" />
                              JSON
                            </button>
                            <button
                              onClick={() => exportReport('csv')}
                              disabled={isExporting || (!report && !rawPerplexityData)}
                              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 text-sm disabled:opacity-50"
                            >
                              <Download className="w-4 h-4" />
                              CSV
                            </button>
                            <button
                              onClick={() => exportReport('excel')}
                              disabled={isExporting || (!report && !rawPerplexityData)}
                              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 text-sm disabled:opacity-50"
                            >
                              <Download className="w-4 h-4" />
                              Excel
                            </button>
                            <button
                              onClick={() => exportReport('pdf')}
                              disabled={isExporting || (!report && !rawPerplexityData)}
                              className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2 text-sm disabled:opacity-50"
                            >
                              <Download className="w-4 h-4" />
                              PDF Standard
                            </button>
                          </div>
                        </div>

                        {/* Séparateur */}
                        <div className="border-t border-gray-200"></div>

                        {/* Export Premium */}
                        <div>
                          <h4 className="text-sm font-semibold text-purple-700 mb-2">
                            Export Premium ✨
                          </h4>
                          <button
                            onClick={() => exportReport('pdf')}
                            disabled={isExporting}
                            className="w-full px-3 py-3 text-left bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            PDF Bureau d'Études Demo
                          </button>
                          <p className="text-xs text-gray-500 mt-1 px-1">
                            Rapport premium avec données Tesla-style enrichies
                          </p>
                        </div>

                        {/* Indicateur d'export */}
                        {isExporting && (
                          <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center gap-2 text-blue-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Génération en cours...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton Générer Rapport */}
              <Button
                onClick={generateReport}
                disabled={isGenerating || !brandName}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm px-8 py-3"
                data-testid="generate-report-button"
              >
                {isGenerating ? (
                  <>
                    <Activity className="w-5 h-5 mr-3 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-3" />
                    Générer Rapport Kora
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50" data-testid="error-message">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard principal */}
      {(report || rawPerplexityData) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-gradient-to-r from-slate-100 to-slate-200">
            <TabsTrigger value="rapport-kora" className="font-semibold">
              <FileText className="w-4 h-4 mr-2" />
              Rapport Kora
            </TabsTrigger>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="swot">SWOT Quantifié</TabsTrigger>
            <TabsTrigger value="competitive">Concurrentiel</TabsTrigger>
            <TabsTrigger value="content">Contenu & Thèmes</TabsTrigger>
            <TabsTrigger value="actions">Actions & Alertes</TabsTrigger>
          </TabsList>

          {/* Onglet Rapport Kora Premium */}
          <TabsContent value="rapport-kora" className="space-y-6">
            {rawPerplexityData && (
              <KoraReportDisplay brandName={brandName} data={rawPerplexityData} />
            )}
          </TabsContent>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {report && <OverviewCards report={report} />}
          </TabsContent>

          {/* Onglet SWOT Quantifié */}
          <TabsContent value="swot" className="space-y-6">
            {report && <SWOTDashboard swotMetrics={report.swotMetrics} />}
          </TabsContent>

          {/* Onglet Concurrentiel */}
          <TabsContent value="competitive" className="space-y-6">
            {report && <CompetitiveDashboard competitiveMetrics={report.competitiveMetrics} />}
          </TabsContent>

          {/* Onglet Contenu & Thèmes */}
          <TabsContent value="content" className="space-y-6">
            {report && <ContentDashboard contentMetrics={report.contentMetrics} />}
          </TabsContent>

          {/* Onglet Actions & Alertes */}
          <TabsContent value="actions" className="space-y-6">
            {report && (
              <ActionsDashboard recommendations={report.recommendations} alerts={report.alerts} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// === NOUVEAU COMPOSANT RAPPORT KORA PREMIUM ===

const KoraReportDisplay: React.FC<{ brandName: string; data: PerplexityRawData }> = ({
  brandName,
  data,
}) => (
  <div className="space-y-8">
    {/* En-tête du rapport */}
    <Card className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white border-0">
      <CardHeader className="pb-8">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Rapport Kora</h1>
                <p className="text-xl text-blue-200">P.R.I.S.M Report Premium</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-2">Analyse de {brandName}</h2>
              <p className="text-blue-100">
                Rapport d'intelligence économique généré par Kora Digital
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-blue-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Données temps réel
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>

    {/* Section Analyse Objective */}
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl flex items-center gap-3 text-blue-900">
          <Eye className="w-7 h-7" />
          Analyse Objective
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <ScrollArea className="h-96 pr-4">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {data.objectiveAnalysis || 'Analyse en cours de génération...'}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    {/* Section Analyse Stratégique */}
    <Card className="border-purple-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="text-2xl flex items-center gap-3 text-purple-900">
          <Target className="w-7 h-7" />
          Analyse Stratégique
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <ScrollArea className="h-96 pr-4">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {data.strategicAnalysis || 'Analyse en cours de génération...'}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    {/* Section Analyse Concurrentielle */}
    <Card className="border-orange-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardTitle className="text-2xl flex items-center gap-3 text-orange-900">
          <BarChart3 className="w-7 h-7" />
          Analyse Concurrentielle
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <ScrollArea className="h-96 pr-4">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {data.competitiveAnalysis || 'Analyse en cours de génération...'}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    {/* Section Tendances & Signaux */}
    <Card className="border-green-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardTitle className="text-2xl flex items-center gap-3 text-green-900">
          <TrendingUp className="w-7 h-7" />
          Tendances & Signaux Faibles
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <ScrollArea className="h-96 pr-4">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {data.trendAnalysis || 'Analyse en cours de génération...'}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>

    {/* Section Sources */}
    {data.sources && data.sources.length > 0 && (
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50">
          <CardTitle className="text-xl flex items-center gap-3 text-slate-900">
            <Shield className="w-6 h-6" />
            Sources & Références
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {data.sources.slice(0, 6).map((source, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{source.title}</h4>
                  <p className="text-slate-600 text-sm mb-2">{source.snippet}</p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      Voir la source
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )}

    {/* Footer du rapport */}
    <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold">Rapport généré par Kora Digital</span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        <p className="text-slate-300 text-sm">
          P.R.I.S.M Report • Données en temps réel • Analyse approfondie
        </p>
      </CardContent>
    </Card>
  </div>
);

// === COMPOSANTS SPÉCIALISÉS ===

const OverviewCards: React.FC<{ report: DeepResearchReport }> = ({ report }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Score de confiance */}
    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-green-700">Score de Confiance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-green-900">{report.confidenceScore}/100</span>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <Progress value={report.confidenceScore} className="mt-3 h-2" />
      </CardContent>
    </Card>

    {/* Score de réputation */}
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-700">Réputation Globale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-blue-900">
            {report.reputationKPIs.overallReputationScore}/100
          </span>
          <Award className="w-8 h-8 text-blue-500" />
        </div>
        <Progress value={report.reputationKPIs.overallReputationScore} className="mt-3 h-2" />
      </CardContent>
    </Card>

    {/* Santé stratégique */}
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-purple-700">Santé Stratégique</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-purple-900">
            {report.swotMetrics.strategicHealthIndex}/100
          </span>
          <Target className="w-8 h-8 text-purple-500" />
        </div>
        <Progress value={report.swotMetrics.strategicHealthIndex} className="mt-3 h-2" />
      </CardContent>
    </Card>

    {/* Position concurrentielle */}
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-orange-700">
          Avantage Concurrentiel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-orange-900">
            {report.competitiveMetrics.competitiveAdvantageIndex}/100
          </span>
          <Briefcase className="w-8 h-8 text-orange-500" />
        </div>
        <Progress
          value={report.competitiveMetrics.competitiveAdvantageIndex}
          className="mt-3 h-2"
        />
      </CardContent>
    </Card>

    {/* Données temps réel */}
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Fraîcheur des Données
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Dernière mise à jour</p>
            <p className="font-semibold">
              {new Date(report.dataFreshness.lastUpdateTime).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Qualité des données</p>
            <div className="flex items-center gap-2">
              <Progress value={report.dataFreshness.dataQualityScore} className="flex-1 h-2" />
              <span className="text-sm font-medium">{report.dataFreshness.dataQualityScore}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Actions recommandées */}
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Actions Prioritaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {report.recommendations.slice(0, 3).map((action, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-slate-600">{action.timeline}</p>
              </div>
              <Badge
                variant={
                  action.priority === 'high'
                    ? 'destructive'
                    : action.priority === 'medium'
                      ? 'default'
                      : 'secondary'
                }
              >
                {action.priority}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const SWOTDashboard: React.FC<{ swotMetrics: SWOTMetrics }> = ({ swotMetrics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Forces */}
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <TrendingUp className="w-5 h-5" />
          Forces ({swotMetrics.strengthsScore}/100)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={swotMetrics.strengthsScore} className="mb-4 h-3" />
        <div className="space-y-3">
          {swotMetrics.detailedBreakdown.strengths.map((strength, index) => (
            <div key={index} className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{strength.area}</span>
                <Badge variant="outline" className="border-green-300 text-green-700">
                  {strength.score}/100
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-green-600">
                <span>Impact: {strength.impact}</span>
                <span>Durabilité: {strength.sustainability}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Faiblesses */}
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <TrendingDown className="w-5 h-5" />
          Faiblesses ({swotMetrics.weaknessesScore}/100)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={swotMetrics.weaknessesScore} className="mb-4 h-3" />
        <div className="space-y-3">
          {swotMetrics.detailedBreakdown.weaknesses.map((weakness, index) => (
            <div key={index} className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{weakness.area}</span>
                <Badge variant="outline" className="border-red-300 text-red-700">
                  Sévérité: {weakness.severity}/100
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-red-600">
                <span>Urgence: {weakness.urgency}</span>
                <span>Amélioration: {weakness.improvability}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Opportunités */}
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Eye className="w-5 h-5" />
          Opportunités ({swotMetrics.opportunitiesScore}/100)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={swotMetrics.opportunitiesScore} className="mb-4 h-3" />
        <div className="space-y-3">
          {swotMetrics.detailedBreakdown.opportunities.map((opportunity, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{opportunity.area}</span>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {opportunity.attractiveness}/100
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-blue-600">
                <span>Faisabilité: {opportunity.feasibility}/100</span>
                <span>Délai: {opportunity.timeToCapture} mois</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Menaces */}
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <AlertTriangle className="w-5 h-5" />
          Menaces ({swotMetrics.threatsScore}/100)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={swotMetrics.threatsScore} className="mb-4 h-3" />
        <div className="space-y-3">
          {swotMetrics.detailedBreakdown.threats.map((threat, index) => (
            <div key={index} className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{threat.area}</span>
                <Badge variant="outline" className="border-orange-300 text-orange-700">
                  {threat.probability}/100
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-orange-600">
                <span>Impact: {threat.impact}/100</span>
                <span>Délai: {threat.timeToMaterialization} mois</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const CompetitiveDashboard: React.FC<{ competitiveMetrics: CompetitiveMetrics }> = ({
  competitiveMetrics,
}) => (
  <div className="space-y-6">
    {/* Évolution parts de marché */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Évolution Part de Marché
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {competitiveMetrics.marketShareEvolution.currentShare}%
            </p>
            <p className="text-sm text-slate-600">Part Actuelle</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {competitiveMetrics.marketShareEvolution.projectedShare}%
            </p>
            <p className="text-sm text-slate-600">Projection</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-xl font-bold text-green-600">
                #{competitiveMetrics.marketShareEvolution.benchmarkPosition.rank}
              </span>
            </div>
            <p className="text-sm text-slate-600">Position</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Benchmark concurrents */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Benchmark Concurrentiel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {competitiveMetrics.competitorBenchmark.map((competitor, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{competitor.name}</h4>
                <Badge
                  variant={
                    competitor.threatLevel > 7
                      ? 'destructive'
                      : competitor.threatLevel > 4
                        ? 'default'
                        : 'secondary'
                  }
                >
                  Menace: {competitor.threatLevel}/10
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-600">Part de marché</p>
                  <p className="font-medium">{competitor.marketShare}%</p>
                </div>
                <div>
                  <p className="text-slate-600">Forces clés</p>
                  <p className="font-medium">{competitor.strengthAreas.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const ContentDashboard: React.FC<{ contentMetrics: ContentMetrics }> = ({ contentMetrics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Métriques d'engagement */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Engagement & Viralité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Index de Viralité</span>
              <span className="font-bold">{contentMetrics.viralityIndex}/100</span>
            </div>
            <Progress value={contentMetrics.viralityIndex} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Volume Total</p>
              <p className="text-xl font-bold">{contentMetrics.contentVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-600">Taux Conversion</p>
              <p className="text-xl font-bold">
                {contentMetrics.engagementMetrics.conversionRate}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="font-bold text-blue-600">
                {contentMetrics.engagementMetrics.likes.toLocaleString()}
              </p>
              <p className="text-slate-600">Likes</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="font-bold text-green-600">
                {contentMetrics.engagementMetrics.shares.toLocaleString()}
              </p>
              <p className="text-slate-600">Partages</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <p className="font-bold text-purple-600">
                {contentMetrics.engagementMetrics.comments.toLocaleString()}
              </p>
              <p className="text-slate-600">Commentaires</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Qualité du contenu */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Qualité & Crédibilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              label: "Score d'Autorité",
              value: contentMetrics.contentQuality.authorityScore,
              color: 'blue',
            },
            {
              label: 'Index Crédibilité',
              value: contentMetrics.contentQuality.credibilityIndex,
              color: 'green',
            },
            {
              label: 'Précision Factuelle',
              value: contentMetrics.contentQuality.factualAccuracy,
              color: 'purple',
            },
            {
              label: 'Fiabilité Sources',
              value: contentMetrics.contentQuality.sourceReliability,
              color: 'orange',
            },
          ].map((metric, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{metric.label}</span>
                <span className="font-bold">{metric.value}/100</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const ActionsDashboard: React.FC<{
  recommendations: ActionableRecommendation[];
  alerts: SmartAlerts;
}> = ({ recommendations, alerts }) => (
  <div className="space-y-6">
    {/* Actions recommandées */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Actions Recommandées ({recommendations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((action, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{action.title}</h4>
                  <p className="text-slate-600 text-sm mt-1">{action.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant={
                      action.priority === 'critical'
                        ? 'destructive'
                        : action.priority === 'high'
                          ? 'default'
                          : 'secondary'
                    }
                  >
                    {action.priority}
                  </Badge>
                  <Badge variant="outline">{action.category}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Timeline
                  </p>
                  <p className="font-medium">{action.timeline}</p>
                </div>
                <div>
                  <p className="text-slate-600 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Impact Estimé
                  </p>
                  <p className="font-medium">{action.estimatedImpact}/100</p>
                </div>
                <div>
                  <p className="text-slate-600 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Budget
                  </p>
                  <p className="font-medium">
                    {action.budget.min.toLocaleString()} - {action.budget.max.toLocaleString()}{' '}
                    {action.budget.currency}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-slate-600 mb-1">Métriques de succès:</p>
                <div className="flex flex-wrap gap-1">
                  {action.successMetrics.map((metric, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Alertes intelligentes */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Alertes Intelligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-700 mb-2">Critiques</h4>
            <p className="text-2xl font-bold text-red-600">{alerts.critical.length}</p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-700 mb-2">Avertissements</h4>
            <p className="text-2xl font-bold text-orange-600">{alerts.warning.length}</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-700 mb-2">Informations</h4>
            <p className="text-2xl font-bold text-blue-600">{alerts.info.length}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-700 mb-2">Opportunités</h4>
            <p className="text-2xl font-bold text-green-600">{alerts.opportunities.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
