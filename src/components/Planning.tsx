
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const scheduledPosts = [
    {
      id: 1,
      platform: 'LinkedIn',
      time: '09:00',
      content: 'Thread sur les innovations IA en 2024',
      status: 'scheduled',
      engagement: '~180 interactions',
      color: 'border-blue-500'
    },
    {
      id: 2,
      platform: 'Instagram',
      time: '14:30',
      content: 'Carrousel : 5 tips productivité avec l\'IA',
      status: 'draft',
      engagement: '~95 likes',
      color: 'border-pink-500'
    },
    {
      id: 3,
      platform: 'X (Twitter)',
      time: '17:15',
      content: 'Quick insight sur GPT-4o',
      status: 'published',
      engagement: '47 retweets',
      color: 'border-gray-500'
    }
  ];

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    const monday = date.getDate() - date.getDay() + 1;
    return new Date(date.setDate(monday + i));
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-korev-blue/20 text-korev-blue border-korev-blue/30';
      case 'draft': return 'bg-korev-gold/20 text-korev-gold border-korev-gold/30';
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmé';
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2 flex items-center space-x-2">
            <span>📅</span>
            <span>Planning éditorial</span>
          </h2>
          <p className="text-korev-gray-400">
            Organisez et planifiez vos publications sur tous les réseaux
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm transition-colors ${
                viewMode === 'week' 
                  ? 'bg-korev-blue text-white' 
                  : 'text-korev-gray-400 hover:text-white'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm transition-colors ${
                viewMode === 'month' 
                  ? 'bg-korev-blue text-white' 
                  : 'text-korev-gray-400 hover:text-white'
              }`}
            >
              Mois
            </button>
          </div>
          
          <Button className="korev-gradient hover-glow">
            ✨ Planifier avec Kora
          </Button>
        </div>
      </div>

      {/* Vue semaine */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-3">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  Semaine du {currentWeek[0].getDate()}-{currentWeek[6].getDate()} 
                  {' '}
                  {currentWeek[0].toLocaleDateString('fr-FR', { month: 'long' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-korev-gray-400">
                    ← Précédent
                  </Button>
                  <Button size="sm" variant="ghost" className="text-korev-gray-400">
                    Suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => (
                  <div key={day} className="space-y-3">
                    <div className="text-center">
                      <p className="text-korev-gray-400 text-sm font-medium">{day}</p>
                      <p className="text-white text-lg font-semibold">
                        {currentWeek[index].getDate()}
                      </p>
                    </div>
                    
                    <div className="space-y-2 min-h-[200px]">
                      {index === 1 && (
                        <div className="p-2 rounded-lg bg-korev-blue/10 border border-korev-blue/30 cursor-pointer hover:bg-korev-blue/20 transition-colors">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs">💼</span>
                            <span className="text-korev-blue text-xs font-medium">09:00</span>
                          </div>
                          <p className="text-white text-xs">Thread innovations IA</p>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <>
                          <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30 cursor-pointer hover:bg-pink-500/20 transition-colors">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs">📸</span>
                              <span className="text-pink-400 text-xs font-medium">14:30</span>
                            </div>
                            <p className="text-white text-xs">Carrousel productivité</p>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/30 cursor-pointer hover:bg-gray-500/20 transition-colors">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs">𝕏</span>
                              <span className="text-gray-400 text-xs font-medium">17:15</span>
                            </div>
                            <p className="text-white text-xs">Insight GPT-4o</p>
                          </div>
                        </>
                      )}
                      
                      <button className="w-full p-2 border-2 border-dashed border-white/20 rounded-lg text-korev-gray-400 hover:border-korev-blue/50 hover:text-korev-blue transition-colors">
                        <span className="text-xs">+ Ajouter</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel latéral */}
        <div className="space-y-4">
          {/* Publications programmées */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Publications du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className={`p-3 rounded-lg border ${post.color} bg-white/5`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">
                        {post.platform === 'LinkedIn' && '💼'}
                        {post.platform === 'Instagram' && '📸'}
                        {post.platform === 'X (Twitter)' && '𝕏'}
                      </span>
                      <span className="text-white text-sm font-medium">{post.time}</span>
                    </div>
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                  </div>
                  <p className="text-white text-sm mb-2">{post.content}</p>
                  <p className="text-korev-gray-400 text-xs">{post.engagement}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions Kora */}
          <Card className="glass-effect border-korev-gold/20 bg-gradient-to-r from-korev-gold/5 to-korev-gold/10">
            <CardHeader>
              <CardTitle className="text-korev-gold flex items-center space-x-2">
                <span>🤖</span>
                <span>Suggestions Kora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium text-sm mb-2">
                  Optimisation planning
                </h4>
                <p className="text-korev-gray-300 text-xs mb-2">
                  Décaler le post Instagram à 15h pour +12% d'engagement
                </p>
                <Button size="sm" variant="ghost" className="text-korev-gold hover:bg-korev-gold/10 h-6 px-2 text-xs">
                  Appliquer
                </Button>
              </div>
              
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <h4 className="text-white font-medium text-sm mb-2">
                  Contenu manquant
                </h4>
                <p className="text-korev-gray-300 text-xs mb-2">
                  Vendredi semble vide. Ajouter un post de fin de semaine ?
                </p>
                <Button size="sm" variant="ghost" className="text-korev-gold hover:bg-korev-gold/10 h-6 px-2 text-xs">
                  Générer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Posts programmés</span>
                <span className="text-white font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Brouillons</span>
                <span className="text-korev-gold font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-400 text-sm">Engagement prévu</span>
                <span className="text-korev-blue font-semibold">~1.2K</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planning;
