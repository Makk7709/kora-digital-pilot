
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, BarChart3, Calendar, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-korev">
      {/* Header */}
      <header className="flex items-center justify-between p-6 glass-effect border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 korev-gradient rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Korev AI</h1>
            <p className="text-xs text-korev-gray-400">Social Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-korev-gray-300 hover:text-white">
            Connexion
          </Button>
          <Button className="korev-gradient hover-glow">
            Commencer
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-korev-blue/10 border border-korev-blue/20 mb-8">
            <Sparkles className="w-4 h-4 text-korev-blue" />
            <span className="text-korev-blue text-sm font-medium">Propulsé par l'IA de nouvelle génération</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            L'intelligence sociale
            <span className="block bg-gradient-to-r from-korev-blue to-korev-gold bg-clip-text text-transparent">
              réinventée
            </span>
          </h1>
          
          <p className="text-xl text-korev-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transformez votre communication digitale avec Kora, votre assistante IA qui génère, planifie et optimise vos contenus sur tous les réseaux sociaux.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="korev-gradient hover-glow px-8 py-4 text-lg">
              Découvrir Kora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="ghost" size="lg" className="text-korev-gray-300 hover:text-white px-8 py-4 text-lg border border-white/20">
              Voir la démo
            </Button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-korev-blue/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-korev-gold/20 rounded-full blur-xl animate-pulse"></div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Une suite complète pour votre succès digital
            </h2>
            <p className="text-lg text-korev-gray-300 max-w-2xl mx-auto">
              De la création à l'analyse, Kora vous accompagne à chaque étape de votre stratégie de communication.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-korev-blue" />}
              title="Génération IA"
              description="Créez des contenus engageants adaptés à chaque plateforme avec l'IA la plus avancée"
              gradient="from-korev-blue/10 to-korev-blue/5"
            />
            
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-korev-gold" />}
              title="Planification intelligente"
              description="Optimisez vos publications avec des suggestions de timing basées sur vos performances"
              gradient="from-korev-gold/10 to-korev-gold/5"
            />
            
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-korev-blue" />}
              title="Analytics avancées"
              description="Analysez vos performances et recevez des recommandations personnalisées"
              gradient="from-korev-blue/10 to-korev-blue/5"
            />
            
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-korev-gold" />}
              title="Automatisation"
              description="Connectez vos réseaux et automatisez vos publications en toute simplicité"
              gradient="from-korev-gold/10 to-korev-gold/5"
            />
            
            <FeatureCard 
              icon={<Sparkles className="w-8 h-8 text-korev-blue" />}
              title="Multi-plateformes"
              description="LinkedIn, Instagram, X - adaptez votre contenu à chaque audience"
              gradient="from-korev-blue/10 to-korev-blue/5"
            />
            
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-korev-gold" />}
              title="ROI optimisé"
              description="Maximisez l'impact de votre communication avec des insights actionnables"
              gradient="from-korev-gold/10 to-korev-gold/5"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect p-12 rounded-3xl border border-white/10">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-korev-dark">K</span>
              </div>
              <span className="text-korev-gold font-medium text-lg">Kora</span>
              <span className="text-korev-gray-400 text-lg">vous attend</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à révolutionner votre communication ?
            </h2>
            <p className="text-lg text-korev-gray-300 mb-8">
              Rejoignez les leaders qui font confiance à Korev AI pour leur stratégie digitale.
            </p>
            
            <Button size="lg" className="korev-gradient hover-glow px-10 py-4 text-lg">
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 korev-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-korev-gray-400">© 2024 Korev AI. Tous droits réservés.</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-korev-gray-400 hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="text-korev-gray-400 hover:text-white transition-colors">Conditions</a>
            <a href="#" className="text-korev-gray-400 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) => {
  return (
    <div className={`p-6 rounded-2xl glass-effect border border-white/10 hover:border-white/20 transition-all duration-300 hover-glow bg-gradient-to-br ${gradient}`}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-korev-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default Landing;
