
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Analytics = () => {
  const platformsData = [
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'border-korev-blue',
      bgColor: 'bg-korev-blue/5',
      textColor: 'text-korev-blue',
      stats: {
        posts: 12,
        reach: '45.2K',
        engagement: '6.8%',
        clicks: '892',
        trend: '+15%'
      }
    },
    {
      name: 'Instagram',
      icon: '📸',
      color: 'border-pink-500',
      bgColor: 'bg-pink-500/5',
      textColor: 'text-pink-500',
      stats: {
        posts: 8,
        reach: '28.7K',
        engagement: '4.2%',
        clicks: '445',
        trend: '+8%'
      }
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'border-gray-500',
      bgColor: 'bg-gray-500/5',
      textColor: 'text-gray-600',
      stats: {
        posts: 15,
        reach: '15.3K',
        engagement: '3.1%',
        clicks: '234',
        trend: '+12%'
      }
    }
  ];

  const topPosts = [
    {
      platform: 'LinkedIn',
      content: 'Thread : 5 tendances IA qui transforment le business',
      metrics: {
        likes: 156,
        comments: 23,
        shares: 45,
        clicks: 89
      },
      performance: 'Excellent',
      color: 'text-green-600'
    },
    {
      platform: 'Instagram',
      content: 'Carrousel : Guide productivité avec l\'IA',
      metrics: {
        likes: 89,
        comments: 12,
        shares: 8,
        clicks: 34
      },
      performance: 'Bon',
      color: 'text-korev-blue'
    },
    {
      platform: 'X (Twitter)',
      content: 'Quick tip : Optimiser ses prompts GPT-4',
      metrics: {
        likes: 67,
        comments: 8,
        shares: 23,
        clicks: 45
      },
      performance: 'Moyen',
      color: 'text-yellow-500'
    }
  ];

  const insights = [
    {
      title: 'Meilleur moment de publication',
      description: 'LinkedIn : 9h-11h (lundi-mercredi)',
      impact: '+23% engagement',
      type: 'timing',
      color: 'border-korev-blue/30 bg-korev-blue/5'
    },
    {
      title: 'Contenu le plus performant',
      description: 'Threads éducatifs sur l\'IA',
      impact: '+45% partages',
      type: 'content',
      color: 'border-korev-gold/30 bg-korev-gold/5'
    },
    {
      title: 'Audience engagement',
      description: 'Pics d\'activité : 9h, 14h, 17h',
      impact: '+18% interactions',
      type: 'audience',
      color: 'border-purple-500/30 bg-purple-500/5'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-korev-dark mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <span>Analyse de performance</span>
          </h2>
          <p className="text-korev-gray-600">
            Suivez vos KPIs et optimisez votre stratégie avec les insights de Kora
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select className="bg-white border border-korev-azure rounded-xl px-4 py-3 text-korev-dark text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300">
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
          <Button className="bg-white border border-korev-azure text-korev-dark hover:bg-korev-azure hover:border-korev-blue transition-all duration-300">
            📊 Rapport complet
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-digital-wave opacity-5 bg-[length:20px_20px]"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-500 text-sm font-medium">Portée totale</p>
                <p className="text-3xl font-bold text-korev-dark mt-2">89.2K</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-korev-azure to-green-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-md animate-wave"></div>
                </div>
                <span className="text-green-500 text-sm font-semibold">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-digital-wave opacity-5 bg-[length:20px_20px]"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-500 text-sm font-medium">Engagement</p>
                <p className="text-3xl font-bold text-korev-dark mt-2">4.8%</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-korev-azure to-korev-blue/20 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-korev-blue rounded-md animate-wave"></div>
                </div>
                <span className="text-korev-blue text-sm font-semibold">+0.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-digital-wave opacity-5 bg-[length:20px_20px]"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-500 text-sm font-medium">Clics total</p>
                <p className="text-3xl font-bold text-korev-dark mt-2">1.6K</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-korev-azure to-purple-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-md animate-wave"></div>
                </div>
                <span className="text-purple-500 text-sm font-semibold">+8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-digital-wave opacity-5 bg-[length:20px_20px]"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-500 text-sm font-medium">CTR moyen</p>
                <p className="text-3xl font-bold text-korev-dark mt-2">1.8%</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-gradient-to-br from-korev-azure to-yellow-100 rounded-xl flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-md animate-wave"></div>
                </div>
                <span className="text-yellow-500 text-sm font-semibold">-0.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par plateforme */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-korev-azure">
            <CardTitle className="text-korev-dark">Performance par plateforme</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {platformsData.map((platform) => (
              <div key={platform.name} className={`p-5 rounded-xl border ${platform.color} ${platform.bgColor} hover:shadow-md transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl">{platform.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-korev-dark font-semibold">{platform.name}</h4>
                      <p className="text-korev-gray-500 text-sm">{platform.stats.posts} posts</p>
                    </div>
                  </div>
                  <Badge className={`${platform.textColor} bg-white border-current shadow-sm`}>
                    {platform.stats.trend}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-korev-dark font-bold text-lg">{platform.stats.reach}</p>
                    <p className="text-korev-gray-500 text-xs">Portée</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-korev-dark font-bold text-lg">{platform.stats.engagement}</p>
                    <p className="text-korev-gray-500 text-xs">Engagement</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-korev-dark font-bold text-lg">{platform.stats.clicks}</p>
                    <p className="text-korev-gray-500 text-xs">Clics</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top posts */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-korev-azure">
            <CardTitle className="text-korev-dark">Publications les plus performantes</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {topPosts.map((post, index) => (
              <div key={index} className="p-5 rounded-xl bg-gradient-azure border border-korev-azure hover:border-korev-blue/30 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {post.platform === 'LinkedIn' && '💼'}
                      {post.platform === 'Instagram' && '📸'}
                      {post.platform === 'X (Twitter)' && '𝕏'}
                    </span>
                    <span className="text-korev-dark font-semibold">{post.platform}</span>
                  </div>
                  <Badge className={`${post.color} bg-white border-current shadow-sm`}>
                    {post.performance}
                  </Badge>
                </div>
                
                <p className="text-korev-dark font-medium mb-4">{post.content}</p>
                
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-white/70 rounded-lg p-2">
                    <p className="text-korev-dark font-bold">{post.metrics.likes}</p>
                    <p className="text-korev-gray-500 text-xs">Likes</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2">
                    <p className="text-korev-dark font-bold">{post.metrics.comments}</p>
                    <p className="text-korev-gray-500 text-xs">Com.</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2">
                    <p className="text-korev-dark font-bold">{post.metrics.shares}</p>
                    <p className="text-korev-gray-500 text-xs">Part.</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2">
                    <p className="text-korev-dark font-bold">{post.metrics.clicks}</p>
                    <p className="text-korev-gray-500 text-xs">Clics</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights Kora */}
      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-korev-azure">
          <CardTitle className="text-korev-dark flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span>Insights IA de Kora</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className={`p-5 rounded-xl border ${insight.color} hover:shadow-md transition-all duration-300`}>
                <h4 className="text-korev-dark font-semibold mb-3">{insight.title}</h4>
                <p className="text-korev-gray-600 text-sm mb-4">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-korev-blue text-sm font-semibold bg-korev-blue/10 px-2 py-1 rounded-full">{insight.impact}</span>
                  <Button size="sm" className="bg-korev-blue/10 text-korev-blue hover:bg-korev-blue hover:text-white border-0 text-xs px-3 py-1">
                    Appliquer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique de performance */}
      <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-korev-azure">
          <CardTitle className="text-korev-dark">Évolution de l'engagement</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center border border-korev-azure rounded-xl bg-gradient-azure">
            <div className="text-center">
              <div className="w-20 h-20 bg-korev-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-korev-blue text-3xl">📊</span>
              </div>
              <p className="text-korev-dark font-bold text-lg mb-2">Graphique d'engagement</p>
              <p className="text-korev-gray-600">Intégration Recharts à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
