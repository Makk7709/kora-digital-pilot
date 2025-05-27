
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Azure Wave */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <svg 
          className="h-full w-full" 
          viewBox="0 0 400 800" 
          preserveAspectRatio="none"
        >
          <path
            d="M400,0 Q300,100 400,200 T400,400 Q300,500 400,600 T400,800 L400,0 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Korev AI</h1>
            <p className="text-sm text-slate-600">Intelligence Sociale Digitale</p>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate('/app')}
          className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Accéder à l'application
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 mb-8">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-sky-700 text-sm font-medium">Plateforme interne Korev AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            Votre hub de
            <span className="block bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
              communication digitale
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-light">
            Créez, planifiez et analysez vos contenus avec l'intelligence artificielle. 
            Une plateforme complète pour optimiser votre présence digitale.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              size="lg" 
              onClick={() => navigate('/app')}
              className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-24 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Tout ce dont vous avez besoin
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureItem 
              title="Génération IA avancée"
              description="Créez des contenus engageants adaptés à chaque plateforme"
            />
            
            <FeatureItem 
              title="Planification intelligente"
              description="Organisez vos publications avec des suggestions optimisées"
            />
            
            <FeatureItem 
              title="Analytics en temps réel"
              description="Suivez vos performances et optimisez votre stratégie"
            />
            
            <FeatureItem 
              title="Bibliothèque centralisée"
              description="Gérez tous vos contenus dans un espace unifié"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 px-8 py-8 mt-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-slate-500">© 2024 Korev AI. Usage interne.</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
            <span className="text-sky-600 text-sm font-medium">Kora en ligne</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ title, description }: {
  title: string;
  description: string;
}) => {
  return (
    <div className="group">
      <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default Landing;
