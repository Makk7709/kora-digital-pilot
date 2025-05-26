
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Analytics = () => {
  const platformsData = [
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
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
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
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
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-400',
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
      color: 'text-green-400'
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
      color: 'text-blue-400'
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
      color: 'text-yellow-400'
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
          <h2 className="text-2xl font-semibold text-white mb-2 flex items-center space-x-2">
            <span>📈</span>
            <span>Analyse de performance</span>
          </h2>
          <p className="text-korev-gray-400">
            Suivez vos KPIs et optimisez votre stratégie avec les insights de Kora
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
            📊 Rapport complet
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/10 hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-400 text-sm">Portée totale</p>
                <p className="text-2xl font-bold text-white mt-1">89.2K</p>
              </div>
              <span className="text-green-400 text-sm font-medium">+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-400 text-sm">Engagement</p>
                <p className="text-2xl font-bold text-white mt-1">4.8%</p>
              </div>
              <span className="text-green-400 text-sm font-medium">+0.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-400 text-sm">Clics total</p>
                <p className="text-2xl font-bold text-white mt-1">1.6K</p>
              </div>
              <span className="text-green-400 text-sm font-medium">+8%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/10 hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-korev-gray-400 text-sm">CTR moyen</p>
                <p className="text-2xl font-bold text-white mt-1">1.8%</p>
              </div>
              <span className="text-yellow-400 text-sm font-medium">-0.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par plateforme */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Performance par plateforme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformsData.map((platform) => (
              <div key={platform.name} className={`p-4 rounded-lg border ${platform.color} ${platform.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{platform.icon}</span>
                    <div>
                      <h4 className="text-white font-medium">{platform.name}</h4>
                      <p className="text-korev-gray-400 text-xs">{platform.stats.posts} posts</p>
                    </div>
                  </div>
                  <Badge className={`${platform.textColor} bg-transparent border-current`}>
                    {platform.stats.trend}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-white font-semibold">{platform.stats.reach}</p>
                    <p className="text-korev-gray-400 text-xs">Portée</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{platform.stats.engagement}</p>
                    <p className="text-korev-gray-400 text-xs">Engagement</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{platform.stats.clicks}</p>
                    <p className="text-korev-gray-400 text-xs">Clics</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top posts */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Publications les plus performantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {post.platform === 'LinkedIn' && '💼'}
                      {post.platform === 'Instagram' && '📸'}
                      {post.platform === 'X (Twitter)' && '𝕏'}
                    </span>
                    <span className="text-white text-sm font-medium">{post.platform}</span>
                  </div>
                  <Badge className={`${post.color} bg-transparent border-current`}>
                    {post.performance}
                  </Badge>
                </div>
                
                <p className="text-white text-sm mb-3">{post.content}</p>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-white text-sm font-semibold">{post.metrics.likes}</p>
                    <p className="text-korev-gray-400 text-xs">Likes</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{post.metrics.comments}</p>
                    <p className="text-korev-gray-400 text-xs">Com.</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{post.metrics.shares}</p>
                    <p className="text-korev-gray-400 text-xs">Part.</p>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{post.metrics.clicks}</p>
                    <p className="text-korev-gray-400 text-xs">Clics</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights Kora */}
      <Card className="glass-effect border-korev-gold/20 bg-gradient-to-r from-korev-gold/5 to-korev-gold/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <div className="w-6 h-6 gold-gradient rounded-full flex items-center justify-center">
              <span className="text-korev-dark font-bold text-xs">K</span>
            </div>
            <span>Insights IA de Kora</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${insight.color}`}>
                <h4 className="text-white font-medium text-sm mb-2">{insight.title}</h4>
                <p className="text-korev-gray-300 text-sm mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-korev-gold text-xs font-medium">{insight.impact}</span>
                  <Button size="sm" variant="ghost" className="text-korev-gold hover:bg-korev-gold/10 h-6 px-2 text-xs">
                    Appliquer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique de performance (placeholder) */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Évolution de l'engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-white/5">
            <div className="text-center">
              <div className="w-16 h-16 bg-korev-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-korev-blue text-2xl">📊</span>
              </div>
              <p className="text-white font-medium mb-1">Graphique d'engagement</p>
              <p className="text-korev-gray-400 text-sm">Intégration Recharts à venir</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
