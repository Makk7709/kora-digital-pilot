import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import { AlertCircle, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InspirationAI = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('Professionnel & stratégique');
  const [connectionStatus, setConnectionStatus] = useState<{
    openai: boolean;
    anthropic: boolean;
    corsIssue?: boolean;
  } | null>(null);

  const { generateContent, isGenerating, lastResponse, error, history, testConnection } = useAI();
  const { toast } = useToast();

  const platforms = [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600', icon: '💼' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-600', icon: '📸' },
    { id: 'twitter', name: 'X (Twitter)', color: 'bg-black', icon: '𝕏' },
  ];

  const contentTypes = [
    { id: 'post', name: 'Post simple', icon: '📝' },
    { id: 'thread', name: 'Thread/Carrousel', icon: '🧵' },
    { id: 'story', name: 'Story/Réels', icon: '📱' },
    { id: 'article', name: 'Article long', icon: '📄' },
  ];

  const tones = [
    'Professionnel & stratégique',
    'Innovant & futuriste',
    'Educatif & expert',
    'Inspirant & visionnaire',
  ];

  // Test de connexion au chargement
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const status = await testConnection();
        setConnectionStatus(status);
      } catch (error) {
        console.warn('Test de connexion échoué:', error);
      }
    };

    checkConnection();
  }, [testConnection]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt requis',
        description: 'Veuillez décrire votre idée de contenu',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Générer pour chaque plateforme sélectionnée
      const results = [];
      for (const platform of selectedPlatforms) {
        console.log(`🚀 Génération pour ${platform} - Type: ${contentType} - Ton: ${tone}`);
        const response = await generateContent({
          prompt: prompt.trim(),
          platform,
          contentType,
          tone,
          maxTokens: 4000,
        });
        results.push(response);
      }

      toast({
        title: 'Contenu généré avec succès !',
        description: `${results.length} contenu(s) créé(s) par Kora`,
      });
    } catch (error) {
      toast({
        title: 'Erreur de génération',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleTestGeneration = async () => {
    const testCases = [
      {
        prompt: "créer un post sur l'IA à l'école",
        platform: 'linkedin',
        contentType: 'article',
        tone: 'Educatif & expert',
        description: 'Test article long éducatif',
      },
      {
        prompt: 'thread sur les innovations IA 2024',
        platform: 'linkedin',
        contentType: 'thread',
        tone: 'Innovant & futuriste',
        description: 'Test thread futuriste',
      },
      {
        prompt: "post motivant sur l'entrepreneuriat",
        platform: 'instagram',
        contentType: 'post',
        tone: 'Inspirant & visionnaire',
        description: 'Test post inspirant',
      },
    ];

    toast({
      title: 'Test en cours...',
      description: 'Génération de 3 contenus de test',
    });

    try {
      for (const testCase of testCases) {
        console.log(`🧪 Test: ${testCase.description}`);
        const response = await generateContent({
          prompt: testCase.prompt,
          platform: testCase.platform,
          contentType: testCase.contentType,
          tone: testCase.tone,
          maxTokens: 4000,
        });
        console.log(`✅ ${testCase.description} - ${response.content.length} caractères`);
      }

      toast({
        title: 'Tests terminés !',
        description: 'Vérifiez la console pour les détails',
      });
    } catch (error) {
      toast({
        title: 'Erreur de test',
        description: error instanceof Error ? error.message : 'Erreur lors des tests',
        variant: 'destructive',
      });
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    );
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copié !',
        description: 'Le contenu a été copié dans le presse-papiers',
      });
    } catch (_error) {
      toast({
        title: 'Erreur de copie',
        description: 'Impossible de copier le contenu',
        variant: 'destructive',
      });
    }
  };

  const getConnectionStatusIcon = () => {
    if (!connectionStatus) return <RefreshCw className="w-4 h-4 animate-spin" />;

    const hasConnection = connectionStatus.openai || connectionStatus.anthropic;
    return hasConnection ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getConnectionStatusText = () => {
    if (!connectionStatus) return 'Test en cours...';

    // Affichage Kora uniformisé
    if (connectionStatus.anthropic && connectionStatus.openai) {
      return connectionStatus.corsIssue ? 'Kora IA Premium actif' : 'Kora IA connectée';
    }

    if (connectionStatus.anthropic) {
      return connectionStatus.corsIssue ? 'Kora IA (mode alternatif)' : 'Kora IA connectée';
    }

    if (connectionStatus.openai) {
      return 'Kora IA connectée';
    }

    return 'Kora IA déconnectée';
  };

  // Marque produit unique exposée à l'utilisateur, quel que soit le provider
  // technique réellement utilisé en coulisses. La séparation entre logique
  // de routage IA (anthropic/openai/CORS) et libellé affiché est volontaire.
  const PRIMARY_AI_BADGE = 'Kora IA';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex items-center space-x-2">
            <span>✨</span>
            <span>Inspiration IA avec Kora</span>
          </h2>
          <p className="text-slate-600">
            Créez du contenu adapté à chaque plateforme avec l'intelligence artificielle
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-slate-800 text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Plateformes */}
              <div>
                <label className="text-slate-600 text-sm font-medium mb-2 block">
                  Plateformes cibles
                </label>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        selectedPlatforms.includes(platform.id)
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <span className="text-slate-700 text-sm">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type de contenu */}
              <div>
                <label className="text-slate-600 text-sm font-medium mb-2 block">
                  Type de contenu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        contentType === type.id
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      <span className="text-lg mb-1">{type.icon}</span>
                      <span className="text-slate-700 text-xs text-center">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ton */}
              <div>
                <label className="text-slate-600 text-sm font-medium mb-2 block">
                  Ton de communication
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {tones.map((toneOption) => (
                    <option key={toneOption} value={toneOption}>
                      {toneOption}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Kora Status */}
          <Card className="premium-card border-blue-200 bg-gradient-to-r from-blue-50/50 to-sky-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div className="flex-1">
                  <p className="text-blue-600 font-medium text-sm">Kora</p>
                  <div className="flex items-center space-x-2">
                    {getConnectionStatusIcon()}
                    <p className="text-slate-500 text-xs">{getConnectionStatusText()}</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Je suis prête à créer du contenu premium pour Korev AI. Décrivez-moi votre idée et
                je l'adapterai à chaque plateforme.
              </p>
              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Génération */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-slate-800">Décrivez votre idée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ex: Créer un post sur les dernières innovations en IA générative, mettre l'accent sur l'impact business et les opportunités pour les entreprises..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="border-blue-300 text-blue-600">
                    {PRIMARY_AI_BADGE}
                  </Badge>
                  <Badge variant="outline" className="border-slate-300 text-slate-500">
                    {prompt.length}/1000 caractères
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleTestGeneration}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    ✨ Kora Test
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>✨ Générer avec Kora</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultats */}
          {(isGenerating || lastResponse || history.length > 0) && (
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Contenu généré</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isGenerating && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-600">Kora travaille sur votre contenu...</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Cela peut prendre quelques secondes
                      </p>
                    </div>
                  </div>
                )}

                {history.slice(0, 3).map((response, index) => (
                  <div
                    key={`row-${index}`}
                    className="border border-slate-200 rounded-lg p-4 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-blue-300 text-blue-600">
                          {response.platform}
                        </Badge>
                        <Badge variant="outline" className="border-green-300 text-green-600">
                          {response.model}
                        </Badge>
                        <span className="text-slate-400 text-xs">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(response.content)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <pre className="text-slate-700 text-sm whitespace-pre-wrap font-sans">
                        {response.content}
                      </pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspirationAI;
