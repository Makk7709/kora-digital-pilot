
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const stats = [
    { label: 'Posts cette semaine', value: '12', trend: '+8%', color: 'text-korev-blue' },
    { label: 'Engagement moyen', value: '4.8%', trend: '+0.3%', color: 'text-korev-gold' },
    { label: 'Portée totale', value: '89.2K', trend: '+12%', color: 'text-emerald-400' },
    { label: 'Clics générés', value: '2.1K', trend: '+5%', color: 'text-violet-400' }
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Bonjour Franck 👋
          </h2>
          <p className="text-korev-gray-400">
            Voici un aperçu de vos performances cette semaine
          </p>
        </div>
        <Button className="korev-gradient hover-glow">
          ✨ Nouveau post avec Kora
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-effect border-white/20 hover:border-korev-blue/30 hover-glow bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-korev-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <span className={`text-sm font-medium ${stat.color}`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="glass-effect border-white/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>📝</span>
              <span>Publications récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.map((post, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-slate-700/30 to-slate-800/30 border border-slate-600/30 hover:border-korev-blue/30 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-korev-blue text-sm font-medium">
                    {post.platform}
                  </span>
                  <span className="text-korev-gray-400 text-xs">{post.time}</span>
                </div>
                <p className="text-white text-sm mb-2">{post.content}</p>
                <p className="text-korev-gray-400 text-xs">{post.engagement}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="glass-effect border-white/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>🤖</span>
              <span>Suggestions de Kora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-korev-blue/15 to-korev-blue/5 border border-korev-blue/30 hover:border-korev-blue/50 transition-all duration-200">
              <h4 className="text-korev-blue font-medium text-sm mb-2">
                Moment optimal de publication
              </h4>
              <p className="text-white text-sm mb-2">
                Publiez sur LinkedIn entre 9h-11h pour +23% d'engagement
              </p>
              <Button size="sm" variant="ghost" className="text-korev-blue hover:bg-korev-blue/10">
                Planifier maintenant
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-korev-gold/15 to-korev-gold/5 border border-korev-gold/30 hover:border-korev-gold/50 transition-all duration-200">
              <h4 className="text-korev-gold font-medium text-sm mb-2">
                Contenu tendance
              </h4>
              <p className="text-white text-sm mb-2">
                Les sujets "IA et productivité" génèrent +40% d'engagement
              </p>
              <Button size="sm" variant="ghost" className="text-korev-gold hover:bg-korev-gold/10">
                Créer du contenu
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-violet-500/15 to-violet-500/5 border border-violet-500/30 hover:border-violet-500/50 transition-all duration-200">
              <h4 className="text-violet-400 font-medium text-sm mb-2">
                Amélioration suggérée
              </h4>
              <p className="text-white text-sm mb-2">
                Ajoutez plus de visuels pour +30% d'engagement Instagram
              </p>
              <Button size="sm" variant="ghost" className="text-violet-400 hover:bg-violet-500/10">
                Générer des visuels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-white/20 bg-gradient-to-br from-slate-800/30 to-slate-900/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>⚡</span>
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-korev-blue/40 hover:bg-korev-blue/10 bg-gradient-to-br from-korev-blue/5 to-transparent">
              <span className="text-2xl">✨</span>
              <span className="text-sm">Générer avec Kora</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-korev-gold/40 hover:bg-korev-gold/10 bg-gradient-to-br from-korev-gold/5 to-transparent">
              <span className="text-2xl">📅</span>
              <span className="text-sm">Planifier la semaine</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2 border-violet-500/40 hover:bg-violet-500/10 bg-gradient-to-br from-violet-500/5 to-transparent">
              <span className="text-2xl">📊</span>
              <span className="text-sm">Analyser les performances</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
