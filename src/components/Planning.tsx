import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Zap,
  TrendingUp,
  Plus,
  Edit,
  Filter,
  Download,
  Brain,
  Lightbulb,
} from 'lucide-react';
import { usePlanning } from '@/hooks/usePlanning';
import { usePerplexity } from '@/hooks/usePerplexity';
import { ScheduledPost } from '@/lib/planning-service';
// import PostModal from './PostModal';
// import FilterPanel from './FilterPanel';
import { PerplexityInsights } from './PerplexityInsights';

const Planning = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  // Simulation de chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Version simplifiée pour test
  if (isLoading) {
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
            <p className="text-slate-600">Chargement en cours...</p>
          </div>
        </div>
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nouveau post</span>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Posts programmés</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">12</p>
                <p className="text-green-600 text-sm mt-1">+3 cette semaine</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Brouillons</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">5</p>
                <p className="text-amber-600 text-sm mt-1">À finaliser</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Edit className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Publiés</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">28</p>
                <p className="text-green-600 text-sm mt-1">Ce mois-ci</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Engagement</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">94%</p>
                <p className="text-green-600 text-sm mt-1">+12% vs mois dernier</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning hebdomadaire */}
      <Card className="premium-card">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900">Planning de la semaine</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-purple-500">
                <Brain className="w-4 h-4 mr-2" />
                Générer avec IA
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
              <div key={day} className="space-y-4">
                <div className="text-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-25">
                  <p className="text-slate-600 text-sm font-semibold">{day}</p>
                  <p className="text-xl font-bold text-slate-900">
                    {new Date().getDate() + index - new Date().getDay() + 1}
                  </p>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {index < 3 && (
                    <div className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-200"
                        >
                          LinkedIn
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          Programmé
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 font-medium mb-2">
                        {index === 0 && 'Les tendances IA en 2025'}
                        {index === 1 && 'Marketing digital : nouvelles stratégies'}
                        {index === 2 && 'Automatisation des processus'}
                      </p>
                      <p className="text-xs text-slate-500">09:00</p>
                    </div>
                  )}

                  <button className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Ajouter un post</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions IA */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>Suggestions intelligentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-25 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">Optimiser les horaires</h4>
              <p className="text-blue-700 text-sm mb-3">
                Vos posts LinkedIn performent mieux entre 8h-10h et 17h-19h
              </p>
              <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                Appliquer
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-25 border border-green-100">
              <h4 className="font-semibold text-green-900 mb-2">Contenu tendance</h4>
              <p className="text-green-700 text-sm mb-3">
                L'IA générative est très recherchée cette semaine
              </p>
              <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                Créer un post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Planning;
