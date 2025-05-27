import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Zap, TrendingUp } from 'lucide-react';

const Planning = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  
  const { generateContent } = useAI();
  const { toast } = useToast();

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
      case 'scheduled': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'draft': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
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

  const handleGenerateWeeklyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await generateContent({
        prompt: "Créer un planning éditorial pour la semaine avec 5 idées de posts sur l'IA et la productivité, adaptés pour LinkedIn, Instagram et Twitter. Inclure les meilleurs moments de publication.",
        platform: "linkedin",
        contentType: "article",
        tone: "Professionnel & stratégique",
        maxTokens: 1000,
      });

      toast({
        title: "Planning généré avec succès !",
        description: "Kora a créé votre planning éditorial de la semaine",
      });

      console.log('Planning généré:', response.content);
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le planning",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleOptimizeSchedule = async () => {
    try {
      const response = await generateContent({
        prompt: "Analyser et optimiser les horaires de publication pour maximiser l'engagement sur LinkedIn, Instagram et Twitter. Donner des recommandations précises.",
        platform: "linkedin",
        contentType: "post",
        tone: "Professionnel & stratégique",
        maxTokens: 500,
      });

      toast({
        title: "Optimisation terminée !",
        description: "Kora a analysé vos horaires de publication",
      });
    } catch (error) {
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser le planning",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <span>Planning éditorial</span>
          </h2>
          <p className="text-slate-600">
            Organisez et planifiez vos publications sur tous les réseaux
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Mois
            </button>
          </div>
          
          <Button 
            onClick={handleGenerateWeeklyPlan}
            disabled={isGeneratingPlan}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            {isGeneratingPlan ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                ✨ Planifier avec Kora
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Vue semaine */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-3">
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-900">
                  Semaine du {currentWeek[0].getDate()}-{currentWeek[6].getDate()} 
                  {' '}
                  {currentWeek[0].toLocaleDateString('fr-FR', { month: 'long' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                    ← Précédent
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                    Suivant →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => (
                  <div key={day} className="space-y-4">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl">
                      <p className="text-slate-600 text-sm font-semibold">{day}</p>
                      <p className="text-slate-900 text-xl font-bold">
                        {currentWeek[index].getDate()}
                      </p>
                    </div>
                    
                    <div className="space-y-3 min-h-[200px]">
                      {index === 1 && (
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 cursor-pointer hover:bg-blue-500/20 hover:shadow-md transition-all duration-300">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm">💼</span>
                            <span className="text-blue-600 text-xs font-semibold">09:00</span>
                          </div>
                          <p className="text-slate-900 text-xs font-medium">Thread innovations IA</p>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <>
                          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 cursor-pointer hover:bg-pink-500/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm">📸</span>
                              <span className="text-pink-500 text-xs font-semibold">14:30</span>
                            </div>
                            <p className="text-slate-900 text-xs font-medium">Carrousel productivité</p>
                          </div>
                          <div className="p-3 rounded-xl bg-gray-500/10 border border-gray-500/30 cursor-pointer hover:bg-gray-500/20 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm">𝕏</span>
                              <span className="text-gray-600 text-xs font-semibold">17:15</span>
                            </div>
                            <p className="text-slate-900 text-xs font-medium">Insight GPT-4o</p>
                          </div>
                        </>
                      )}
                      
                      <button className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
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
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Publications du jour</span>
              </CardTitle>
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
                      <span className="text-slate-900 text-sm font-semibold">{post.time}</span>
                    </div>
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                  </div>
                  <p className="text-slate-900 text-sm mb-3 font-medium">{post.content}</p>
                  <p className="text-slate-500 text-xs">{post.engagement}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggestions Kora */}
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <span>Suggestions Kora</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <h4 className="text-blue-600 font-semibold text-sm mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Optimisation planning</span>
                </h4>
                <p className="text-slate-900 text-xs mb-3">
                  Décaler le post Instagram à 15h pour +12% d'engagement
                </p>
                <Button 
                  size="sm" 
                  onClick={handleOptimizeSchedule}
                  className="bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white border-0 text-xs px-3 py-1"
                >
                  Appliquer
                </Button>
              </div>
              
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
                <h4 className="text-amber-600 font-semibold text-sm mb-2 flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Contenu manquant</span>
                </h4>
                <p className="text-slate-900 text-xs mb-3">
                  Vendredi semble vide. Ajouter un post de fin de semaine ?
                </p>
                <Button 
                  size="sm" 
                  onClick={handleGenerateWeeklyPlan}
                  className="bg-amber-500/10 text-amber-600 hover:bg-amber-600 hover:text-white border-0 text-xs px-3 py-1"
                >
                  Générer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="premium-card">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900 text-lg">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Posts programmés</span>
                <span className="text-slate-900 font-bold text-lg">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Brouillons</span>
                <span className="text-amber-600 font-bold text-lg">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 text-sm">Engagement prévu</span>
                <span className="text-blue-600 font-bold text-lg">~1.2K</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Planning;
