
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const InspirationAI = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
  const [contentType, setContentType] = useState('post');

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600', icon: '💼' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-600', icon: '📸' },
    { id: 'twitter', name: 'X (Twitter)', color: 'bg-black', icon: '𝕏' }
  ];

  const contentTypes = [
    { id: 'post', name: 'Post simple', icon: '📝' },
    { id: 'thread', name: 'Thread/Carrousel', icon: '🧵' },
    { id: 'story', name: 'Story/Réels', icon: '📱' },
    { id: 'article', name: 'Article long', icon: '📄' }
  ];

  const tones = [
    'Professionnel & stratégique',
    'Innovant & futuriste',
    'Educatif & expert',
    'Inspirant & visionnaire'
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulation de génération IA
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2 flex items-center space-x-2">
            <span>✨</span>
            <span>Inspiration IA avec Kora</span>
          </h2>
          <p className="text-korev-gray-400">
            Créez du contenu adapté à chaque plateforme avec l'intelligence artificielle
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plateformes */}
              <div>
                <label className="text-korev-gray-300 text-sm font-medium mb-2 block">
                  Plateformes cibles
                </label>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-korev-blue bg-korev-blue/10'
                          : 'border-white/20 hover:border-white/30'
                      }`}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <span className="text-white text-sm">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type de contenu */}
              <div>
                <label className="text-korev-gray-300 text-sm font-medium mb-2 block">
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        contentType === type.id
                          ? 'border-korev-gold bg-korev-gold/10'
                          : 'border-white/20 hover:border-white/30'
                      }`}
                    >
                      <span className="text-lg mb-1">{type.icon}</span>
                      <span className="text-white text-xs text-center">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ton */}
              <div>
                <label className="text-korev-gray-300 text-sm font-medium mb-2 block">
                  Ton de communication
                </label>
                <select className="w-full bg-white/5 border border-white/20 rounded-lg p-2 text-white text-sm">
                  {tones.map((tone) => (
                    <option key={tone} value={tone} className="bg-korev-dark">
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Kora Status */}
          <Card className="glass-effect border-korev-gold/20 bg-gradient-to-r from-korev-gold/5 to-korev-gold/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                  <span className="text-korev-dark font-bold text-sm">K</span>
                </div>
                <div>
                  <p className="text-korev-gold font-medium text-sm">Kora</p>
                  <p className="text-korev-gray-400 text-xs">Assistante IA</p>
                </div>
              </div>
              <p className="text-korev-gray-300 text-sm leading-relaxed">
                Je suis prête à créer du contenu premium pour Korev AI. 
                Décrivez-moi votre idée et je l'adapterai à chaque plateforme.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Génération */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Décrivez votre idée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ex: Créer un post sur les dernières innovations en IA générative, mettre l'accent sur l'impact business et les opportunités pour les entreprises..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-korev-gray-400"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-korev-blue/30 text-korev-blue">
                    GPT-4o
                  </Badge>
                  <Badge variant="outline" className="border-korev-gray-400/30 text-korev-gray-400">
                    {prompt.length}/1000 caractères
                  </Badge>
                </div>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt || isGenerating}
                  className="korev-gradient hover-glow"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Kora génère...
                    </>
                  ) : (
                    <>
                      ✨ Générer avec Kora
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          {isGenerating && (
            <Card className="glass-effect border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 border-2 border-korev-gold/20 border-t-korev-gold rounded-full animate-spin"></div>
                  <span className="text-korev-gold font-medium">Kora travaille sur votre contenu...</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isGenerating && prompt && (
            <div className="space-y-4">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find(p => p.id === platformId);
                return (
                  <Card key={platformId} className="glass-effect border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <span>{platform?.icon}</span>
                        <span>Contenu pour {platform?.name}</span>
                        <Badge className={`${platform?.color} text-white`}>
                          Optimisé
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-white text-sm leading-relaxed">
                          {platformId === 'linkedin' && "🚀 L'IA générative redéfinit notre approche business\n\nLes entreprises qui intègrent l'intelligence artificielle générative dans leur stratégie observent des gains de productivité exceptionnels :\n\n✅ +40% d'efficacité opérationnelle\n✅ Innovation accélérée\n✅ Personnalisation à grande échelle\n\nChez Korev AI, nous accompagnons cette transformation digitale avec des solutions sur-mesure.\n\nComment votre entreprise tire-t-elle parti de l'IA générative ?\n\n#IA #Innovation #Business #KorevAI"}
                          
                          {platformId === 'instagram' && "✨ L'IA transforme nos façons de travailler\n\nSwipe pour découvrir comment l'intelligence artificielle générative révolutionne le business ➡️\n\n📊 +40% de productivité\n🎯 Personnalisation poussée  \n⚡ Innovation continue\n\n#IA #Innovation #Tech #Future #KorevAI #AIGenerative"}
                          
                          {platformId === 'twitter' && "🧵 Thread : L'IA générative transforme le business\n\n1/5 Les entreprises leaders intègrent massivement l'IA générative dans leurs processus\n\n2/5 Résultats observés :\n• +40% productivité\n• Innovation accélérée\n• Personnalisation à l'échelle\n\n3/5 Les secteurs les plus impactés..."}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-green-500/30 text-green-400">
                            Ton : Premium
                          </Badge>
                          <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                            SEO optimisé
                          </Badge>
                          <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                            Hashtags inclus
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                            ✏️ Modifier
                          </Button>
                          <Button size="sm" className="korev-gradient">
                            📋 Copier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspirationAI;
