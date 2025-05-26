
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
      color: 'border-korev-blue'
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
      color: 'border-green-500'
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
      case 'scheduled': return 'bg-korev-blue/10 text-korev-blue border-korev-blue/30';
      case 'draft': return 'bg-korev-gold/10 text-korev-gold border-korev-gold/30';
      case 'published': return 'bg-green-500/10 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
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
          <h2 className="text-3xl font-bold text-korev-dark mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-blue rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📅</span>
            </div>
            <span>Planning éditorial</span>
          </h2>
          <p className="text-korev-gray-600">
            Organisez et planifiez vos publications sur tous les réseaux
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-white border border-korev-azure rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                viewMode === 'week' 
                  ? 'bg-korev-blue text-white shadow-sm' 
                  : 'text-korev-gray-600 hover:text-korev-blue hover:bg-korev-azure'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                viewMode === 'month' 
                  ? 'bg-korev-blue text-white shadow-sm' 
                  : 'text-korev-gray-600 hover:text-korev-blue hover:bg-korev-azure'
              }`}
            >
              Mois
            </button>
          </div>
          
          <Button className="bg-gradient-blue text-white hover:shadow-lg hover:shadow-korev-blue/30 transition-all duration-300">
            ✨ Planifier avec Kora
          </Button>
        </div>
      </div>

      {/* Vue semaine */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-3">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-korev-azure">
              <div className="flex items-center justify-between">
                <CardTitle className="text-korev-dark">
                  Semaine du {currentWeek[0].getDate()}-{currentWeek[6].getDate()} 
                  {' '}
                  {currentWeek[0].toLocaleDateString('fr-FR', { month: 'long' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-korev-gray-600 hover:text-korev-blue hover:bg-korev-azure">
                    ← Précédent
                  </Button>
                  <Button size="sm" variant="ghost" className="text-korev-gray-600 hover:text-korev-blue hover:bg-korev-azure">
                    Suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => (
                  <div key={day} className="space-y-4">
                    <div className="text-center p-3 bg-gradient-azure rounded-xl">
                      <p className="text-korev-gray-600 text-sm font-semibold">{day}</p>
                      <p className="text-korev-dark text-xl font-bold">
                        {currentWeek[index].getDate()}
                      </p>
                    </div>
                    
                    <div className="space-y-3 min-h-[200px]">
                      {index === 1 && (
                        <div className="p-3 rounded-xl bg-korev-blue/10 border border-korev-blue/30 cursor-pointer hover:bg-korev-blue/20 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm">💼</span>
                            <span className="text-korev-blue text-xs font-semibold">09:00</span>
                          </div>
                          <p className="text-korev-dark text-xs font-medium">Thread innovations IA</p>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <>
                          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 cursor-pointer hover:bg-pink-500/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm">📸</span>
                              <span className="text-pink-500 text-xs font-semibold">14:30</span>
                            </div>
                            <p className="text-korev-dark text-xs font-medium">Carrousel productivité</p>
                          </div>
                          <div className="p-3 rounded-xl bg-gray-500/10 border border-gray-500/30 cursor-pointer hover:bg-gray-500/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm">𝕏</span>
                              <span className="text-gray-600 text-xs font-semibold">17:15</span>
                            </div>
                            <p className="text-korev-dark text-xs font-medium">Insight GPT-4o</p>
                          </div>
                        </>
                      )}
                      
                      <button className="w-full p-4 border-2 border-dashed border-korev-azure rounded-xl text-korev-gray-500 hover:border-korev-blue hover:text-korev-blue hover:bg-korev-azure transition-all duration-300">
                        <span className="text-sm font-medium">+ Ajouter</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel latéral */}
        <div className="space-y-6">
          {/* Publications programmées */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-korev-azure">
              <CardTitle className="text-korev-dark text-lg">Publications du jour</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {scheduledPosts.map((post) => (
                <div key={post.id} className={`p-4 rounded-xl border ${post.color} bg-white hover:shadow-md transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        {post.platform === 'LinkedIn' && '💼'}
                        {post.platform === 'Instagram' && '📸'}
                        {post.platform === 'X (Twitter)' && '𝕏'}
                      </span>
                      <span className="text-korev-dark text-sm font-semibold">{post.time}</span>
                    </div>
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                  </div>
                  <p className="text-korev-dark text-sm mb-3 font-medium">{post.content}</p>
                  <p className="text-korev-gray-500 text-xs">{post.engagement}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions Kora */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-korev-azure">
              <CardTitle className="text-korev-dark flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-blue rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <span>Suggestions Kora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-korev-blue/5 border border-korev-blue/20 hover:border-korev-blue/40 transition-all duration-300">
                <h4 className="text-korev-blue font-semibold text-sm mb-2">
                  Optimisation planning
                </h4>
                <p className="text-korev-dark text-xs mb-3">
                  Décaler le post Instagram à 15h pour +12% d'engagement
                </p>
                <Button size="sm" className="bg-korev-blue/10 text-korev-blue hover:bg-korev-blue hover:text-white border-0 text-xs px-3 py-1">
                  Appliquer
                </Button>
              </div>
              
              <div className="p-4 rounded-xl bg-korev-gold/5 border border-korev-gold/20 hover:border-korev-gold/40 transition-all duration-300">
                <h4 className="text-korev-gold font-semibold text-sm mb-2">
                  Contenu manquant
                </h4>
                <p className="text-korev-dark text-xs mb-3">
                  Vendredi semble vide. Ajouter un post de fin de semaine ?
                </p>
                <Button size="sm" className="bg-korev-gold/10 text-korev-gold hover:bg-korev-gold hover:text-white border-0 text-xs px-3 py-1">
                  Générer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-korev-azure">
              <CardTitle className="text-korev-dark text-lg">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-600 text-sm">Posts programmés</span>
                <span className="text-korev-dark font-bold text-lg">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-600 text-sm">Brouillons</span>
                <span className="text-korev-gold font-bold text-lg">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-korev-gray-600 text-sm">Engagement prévu</span>
                <span className="text-korev-blue font-bold text-lg">~1.2K</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planning;
