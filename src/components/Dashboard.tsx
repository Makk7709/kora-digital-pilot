import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  Calendar, 
  Sparkles,
  Tv,
  Monitor
} from 'lucide-react';
import LinkedInWidget from '@/components/LinkedInWidget';

interface DashboardProps {
  onSectionChange?: (section: string) => void;
}

const Dashboard = ({ onSectionChange }: DashboardProps) => {
  const [isTvMode, setIsTvMode] = useState(false);

  const stats = [
    { label: 'Posts cette semaine', value: '12', trend: '+8%', color: 'text-blue-600' },
    { label: 'Engagement moyen', value: '4.8%', trend: '+0.3%', color: 'text-emerald-600' },
    { label: 'Portée totale', value: '89.2K', trend: '+12%', color: 'text-purple-600' },
    { label: 'Clics générés', value: '2.1K', trend: '+5%', color: 'text-amber-600' }
  ];

  const recentPosts = [
    {
      platform: 'LinkedIn',
      content: 'L\'IA transforme notre approche du marketing digital...',
      engagement: '156 interactions',
      time: 'Il y a 2h'
    },
    {
      platform: 'Instagram',
      content: 'Découvrez les coulisses de notre nouveau produit IA',
      engagement: '89 likes',
      time: 'Il y a 4h'
    },
    {
      platform: 'X (Twitter)',
      content: 'Thread : 5 tendances IA à suivre en 2024',
      engagement: '34 retweets',
      time: 'Il y a 6h'
    }
  ];

  // Fonctions de navigation
  const handleGenerateWithKora = () => {
    if (onSectionChange) {
      onSectionChange('inspiration');
    }
  };

  const handlePlanWeek = () => {
    if (onSectionChange) {
      onSectionChange('planning');
    }
  };

  const handleAnalyzePerformance = () => {
    if (onSectionChange) {
      onSectionChange('analytics');
    }
  };

  const toggleTvMode = () => {
    setIsTvMode(!isTvMode);
    if (!isTvMode) {
      document.body.classList.add('tv-presentation-mode');
    } else {
      document.body.classList.remove('tv-presentation-mode');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Bonjour Franck 👋
          </h2>
          <p className="text-slate-600">
            Voici un aperçu de vos performances cette semaine
          </p>
        </div>
        <Button 
          onClick={handleGenerateWithKora}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
        >
          ✨ Nouveau post avec Kora
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="premium-card overflow-hidden relative">
            <div className="absolute inset-0 digital-wave-pattern opacity-5"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-md animate-wave"></div>
                  </div>
                  <span className={`text-sm font-semibold ${stat.color}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
              <span>Publications récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentPosts.map((post, index) => (
              <div key={index} className="p-4 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-600 text-sm font-semibold px-3 py-1 bg-blue-100 rounded-full">
                    {post.platform}
                  </span>
                  <span className="text-slate-500 text-xs">{post.time}</span>
                </div>
                <p className="text-slate-900 text-sm mb-3 font-medium">{post.content}</p>
                <p className="text-slate-500 text-xs">{post.engagement}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* LinkedIn Analytics Widget */}
        <LinkedInWidget />

        {/* AI Suggestions */}
        <Card className="premium-card">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-slate-900 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <span>Suggestions de Kora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 hover:border-blue-400 transition-all duration-300">
              <h4 className="text-blue-600 font-semibold text-sm mb-2">
                Moment optimal de publication
              </h4>
              <p className="text-slate-900 text-sm mb-3">
                Publiez sur LinkedIn entre 9h-11h pour +23% d'engagement
              </p>
              <Button 
                size="sm" 
                onClick={handlePlanWeek}
                className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white border-0"
              >
                Planifier maintenant
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 hover:border-emerald-400 transition-all duration-300">
              <h4 className="text-emerald-600 font-semibold text-sm mb-2">
                Contenu tendance
              </h4>
              <p className="text-slate-900 text-sm mb-3">
                Les sujets "IA et productivité" génèrent +40% d'engagement
              </p>
              <Button 
                size="sm" 
                onClick={handleGenerateWithKora}
                className="bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white border-0"
              >
                Créer du contenu
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 hover:border-purple-400 transition-all duration-300">
              <h4 className="text-purple-600 font-semibold text-sm mb-2">
                Amélioration suggérée
              </h4>
              <p className="text-slate-900 text-sm mb-3">
                Ajoutez plus de visuels pour +30% d'engagement Instagram
              </p>
              <Button 
                size="sm" 
                onClick={handleGenerateWithKora}
                className="bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white border-0"
              >
                Générer des visuels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="premium-card">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-slate-900 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button 
              onClick={handleGenerateWithKora}
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-blue-50 to-white border border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20 text-slate-900 hover:text-blue-600 transition-all duration-300"
            >
              <span className="text-3xl">✨</span>
              <span className="font-semibold">Générer avec Kora</span>
            </Button>
            <Button 
              onClick={handlePlanWeek}
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 text-slate-900 hover:text-emerald-600 transition-all duration-300"
            >
              <span className="text-3xl">📅</span>
              <span className="font-semibold">Planifier la semaine</span>
            </Button>
            <Button 
              onClick={handleAnalyzePerformance}
              className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br from-purple-50 to-white border border-purple-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 text-slate-900 hover:text-purple-600 transition-all duration-300"
            >
              <span className="text-3xl">📊</span>
              <span className="font-semibold">Analyser les performances</span>
            </Button>
            <Button 
              onClick={toggleTvMode}
              className={`h-24 flex flex-col items-center justify-center space-y-3 transition-all duration-300 ${
                isTvMode 
                  ? 'bg-gradient-to-br from-orange-50 to-white border border-orange-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/20 text-orange-600' 
                  : 'bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-500/20 text-slate-900 hover:text-slate-600'
              }`}
            >
              {isTvMode ? <Tv className="w-8 h-8" /> : <Monitor className="w-8 h-8" />}
              <span className="font-semibold text-sm text-center">
                {isTvMode ? 'Mode TV Activé' : 'Mode TV'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
