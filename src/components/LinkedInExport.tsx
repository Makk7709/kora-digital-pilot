import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLinkedInStats } from '@/hooks/useLinkedInStats';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  FileText, 
  Database, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface LinkedInExportProps {
  className?: string;
}

const LinkedInExport: React.FC<LinkedInExportProps> = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  
  const { metrics, topPosts, connectionStatus } = useLinkedInStats(false);
  const { toast } = useToast();

  const generateCSV = () => {
    if (!metrics) return '';

    const headers = ['Métrique', 'Valeur', 'Période', 'Date Export'];
    const rows = [
      ['Portée Totale', metrics.totalReach, '7 jours', new Date().toLocaleDateString('fr-FR')],
      ['Engagement Total', metrics.totalEngagement, '7 jours', new Date().toLocaleDateString('fr-FR')],
      ['Clics Totaux', metrics.totalClicks, '7 jours', new Date().toLocaleDateString('fr-FR')],
      ['Croissance', metrics.growth, '7 jours', new Date().toLocaleDateString('fr-FR')]
    ];

    // Ajouter les posts
    if (topPosts.length > 0) {
      rows.push(['', '', '', '']); // Ligne vide
      rows.push(['Posts les plus performants', '', '', '']);
      rows.push(['Contenu', 'Impressions', 'Likes', 'Commentaires', 'Partages', 'Date Publication']);
      
      topPosts.forEach(post => {
        rows.push([
          post.content.substring(0, 50) + '...',
          post.metrics.impressions.toString(),
          post.metrics.likes.toString(),
          post.metrics.comments.toString(),
          post.metrics.shares.toString(),
          new Date(post.publishedAt).toLocaleDateString('fr-FR')
        ]);
      });
    }

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const generateJSON = () => {
    if (!metrics) return '';

    const exportData = {
      exportDate: new Date().toISOString(),
      period: '7d',
      metrics: {
        totalReach: metrics.totalReach,
        totalEngagement: metrics.totalEngagement,
        totalClicks: metrics.totalClicks,
        growth: metrics.growth
      },
      posts: topPosts.map(post => ({
        id: post.id,
        content: post.content,
        publishedAt: post.publishedAt,
        metrics: post.metrics
      })),
      insights: metrics.insights || []
    };

    return JSON.stringify(exportData, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (!metrics) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Connectez-vous à LinkedIn et récupérez vos métriques d'abord",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (exportFormat === 'csv') {
        const csvContent = generateCSV();
        downloadFile(csvContent, `linkedin-metrics-${timestamp}.csv`, 'text/csv');
      } else {
        const jsonContent = generateJSON();
        downloadFile(jsonContent, `linkedin-metrics-${timestamp}.json`, 'application/json');
      }

      toast({
        title: "Export réussi !",
        description: `Vos données LinkedIn ont été exportées en ${exportFormat.toUpperCase()}`,
      });

    } catch (error) {
      console.error('Erreur export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getDataSummary = () => {
    if (!metrics) return null;

    const postsCount = topPosts.length;
    const insightsCount = metrics.insights?.length || 0;
    
    return {
      metricsCount: 4, // reach, engagement, clicks, growth
      postsCount,
      insightsCount
    };
  };

  const summary = getDataSummary();

  return (
    <Card className={`premium-card ${className}`}>
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-slate-900 flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Download className="w-4 h-4 text-white" />
          </div>
          <span>Export des Données</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Statut de connexion */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium text-slate-900">
                {connectionStatus === 'connected' ? 'LinkedIn connecté' : 'LinkedIn non connecté'}
              </span>
            </div>
            {connectionStatus === 'connected' && (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
          </div>

          {/* Résumé des données */}
          {summary && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Données disponibles</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{summary.metricsCount}</div>
                  <div className="text-xs text-blue-700">Métriques</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{summary.postsCount}</div>
                  <div className="text-xs text-green-700">Posts</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{summary.insightsCount}</div>
                  <div className="text-xs text-purple-700">Insights</div>
                </div>
              </div>
            </div>
          )}

          {/* Sélection du format */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Format d'export</h4>
            <div className="flex space-x-3">
              <Button
                onClick={() => setExportFormat('csv')}
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                CSV
                {exportFormat === 'csv' && (
                  <Badge variant="secondary" className="ml-2">
                    Sélectionné
                  </Badge>
                )}
              </Button>
              
              <Button
                onClick={() => setExportFormat('json')}
                variant={exportFormat === 'json' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <Database className="w-4 h-4 mr-2" />
                JSON
                {exportFormat === 'json' && (
                  <Badge variant="secondary" className="ml-2">
                    Sélectionné
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Informations sur l'export */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">
              Contenu de l'export {exportFormat.toUpperCase()}
            </h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Métriques principales (portée, engagement, clics)</li>
              <li>• Posts les plus performants avec détails</li>
              <li>• Insights et recommandations</li>
              <li>• Horodatage de l'export</li>
              {exportFormat === 'csv' && (
                <li>• Format compatible Excel/Google Sheets</li>
              )}
              {exportFormat === 'json' && (
                <li>• Structure de données complète pour développeurs</li>
              )}
            </ul>
          </div>

          {/* Bouton d'export */}
          <Button
            onClick={handleExport}
            disabled={isExporting || !metrics}
            className="w-full bg-green-600 text-white hover:bg-green-700"
            size="lg"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exporter en {exportFormat.toUpperCase()}
              </>
            )}
          </Button>

          {/* Note sur la période */}
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>Export basé sur les données des 7 derniers jours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInExport; 