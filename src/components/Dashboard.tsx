
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const stats = [
    { label: 'Posts cette semaine', value: '12', trend: '+8%', color: 'text-korev-blue' },
    { label: 'Engagement moyen', value: '4.8%', trend: '+0.3%', color: 'text-korev-gold' },
    { label: 'Portée totale', value: '89.2K', trend: '+12%', color: 'text-emerald-500' },
    { label: 'Clics générés', value: '2.1K', trend: '+5%', color: 'text-violet-500' }
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
          <h2 className="text-3xl font-bold text-korev-dark mb-2">
            Bonjour Franck 👋
          </h2>
          <p className="text-korev-gray-600">
            Voici un aperçu de vos performances cette semaine
          </p>
        </div>
        <Button className="bg-gradient-blue text-white hover:shadow-lg hover:shadow-korev-blue/30 transition-all duration-300">
          ✨ Nouveau post avec Kora
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
            <div className="absolute inset-0 bg-digital-wave opacity-5 bg-[length:20px_20px]"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-korev-gray-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-korev-dark mt-2">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-12 h-12 bg-gradient-to-br from-korev-azure to-korev-blue/20 rounded-xl flex items-center justify-center mb-2">
                    <div className="w-6 h-6 bg-korev-blue rounded-md animate-wave"></div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-korev-azure">
            <CardTitle className="text-korev-dark flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
              <span>Publications récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentPosts.map((post, index) => (
              <div key={index} className="p-4 rounded-xl border border-korev-azure bg-gradient-azure hover:border-korev-blue/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-korev-blue text-sm font-semibold px-3 py-1 bg-korev-blue/10 rounded-full">
                    {post.platform}
                  </span>
                  <span className="text-korev-gray-500 text-xs">{post.time}</span>
                </div>
                <p className="text-korev-dark text-sm mb-3 font-medium">{post.content}</p>
                <p className="text-korev-gray-500 text-xs">{post.engagement}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-korev-azure">
            <CardTitle className="text-korev-dark flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🤖</span>
              </div>
              <span>Suggestions de Kora</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 rounded-xl border border-korev-blue/20 bg-korev-blue/5 hover:border-korev-blue/40 transition-all duration-300">
              <h4 className="text-korev-blue font-semibold text-sm mb-2">
                Moment optimal de publication
              </h4>
              <p className="text-korev-dark text-sm mb-3">
                Publiez sur LinkedIn entre 9h-11h pour +23% d'engagement
              </p>
              <Button size="sm" className="bg-korev-blue/10 text-korev-blue hover:bg-korev-blue hover:text-white border-0">
                Planifier maintenant
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-korev-gold/20 bg-korev-gold/5 hover:border-korev-gold/40 transition-all duration-300">
              <h4 className="text-korev-gold font-semibold text-sm mb-2">
                Contenu tendance
              </h4>
              <p className="text-korev-dark text-sm mb-3">
                Les sujets "IA et productivité" génèrent +40% d'engagement
              </p>
              <Button size="sm" className="bg-korev-gold/10 text-korev-gold hover:bg-korev-gold hover:text-white border-0">
                Créer du contenu
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40 transition-all duration-300">
              <h4 className="text-violet-600 font-semibold text-sm mb-2">
                Amélioration suggérée
              </h4>
              <p className="text-korev-dark text-sm mb-3">
                Ajoutez plus de visuels pour +30% d'engagement Instagram
              </p>
              <Button size="sm" className="bg-violet-500/10 text-violet-600 hover:bg-violet-500 hover:text-white border-0">
                Générer des visuels
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-korev-azure">
          <CardTitle className="text-korev-dark flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">⚡</span>
            </div>
            <span>Actions rapides</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-azure border border-korev-blue/20 hover:border-korev-blue hover:shadow-lg hover:shadow-korev-blue/20 text-korev-dark hover:text-korev-blue transition-all duration-300">
              <span className="text-3xl">✨</span>
              <span className="font-semibold">Générer avec Kora</span>
            </Button>
            <Button className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-azure border border-korev-gold/20 hover:border-korev-gold hover:shadow-lg hover:shadow-korev-gold/20 text-korev-dark hover:text-korev-gold transition-all duration-300">
              <span className="text-3xl">📅</span>
              <span className="font-semibold">Planifier la semaine</span>
            </Button>
            <Button className="h-24 flex flex-col items-center justify-center space-y-3 bg-gradient-azure border border-violet-500/20 hover:border-violet-500 hover:shadow-lg hover:shadow-violet-500/20 text-korev-dark hover:text-violet-600 transition-all duration-300">
              <span className="text-3xl">📊</span>
              <span className="font-semibold">Analyser les performances</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
