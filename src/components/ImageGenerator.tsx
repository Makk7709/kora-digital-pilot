import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';
import { ImageRequest } from '@/lib/ai-service';
import {
  RefreshCw,
  Download,
  Copy,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Briefcase,
  Users,
  Lightbulb,
  Building,
  TrendingUp,
  Heart,
  GraduationCap,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  optimizePromptForBrand,
  validateBrandConsistency,
  INDUSTRY_TEMPLATES,
} from '@/lib/brand-prompts';

// Templates de prompts premium pour Kora
const PREMIUM_PROMPT_TEMPLATES = {
  business: {
    icon: <Briefcase className="w-4 h-4" />,
    label: 'Business Premium',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    prompts: [
      "Réunion d'affaires professionnelle dans une salle de conférence moderne en verre, équipe diversifiée de dirigeants discutant de stratégie IA, éclairage naturel, photographie ultra-réaliste, prise avec Canon EOS R5, objectif 85mm, faible profondeur de champ, élégance corporative",
      'Espace de bureau de startup sophistiqué avec baies vitrées du sol au plafond, design minimaliste, jeunes professionnels travaillant sur ordinateurs portables, lumière naturelle du jour, style photographie architecturale, lignes épurées, matériaux premium, ultra-haute résolution',
      "Portrait exécutif d'un leader d'entreprise confiant dans un bureau moderne, tenue professionnelle, éclairage naturel, prise avec appareil moyen format, faible profondeur de champ, style portrait corporatif, qualité premium",
      'Espace de coworking moderne avec design innovant, professionnels collaborant, lumière naturelle traversant de grandes fenêtres, photographie architecturale, esthétique épurée, détail ultra-réaliste, atmosphère professionnelle',
    ],
  },
  tech: {
    icon: <Lightbulb className="w-4 h-4" />,
    label: 'Innovation Tech',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    prompts: [
      'Laboratoire de recherche IA futuriste avec écrans holographiques, scientifiques travaillant avec technologie avancée, éclairage cinématographique, photographie sci-fi ultra-réaliste, prise avec Sony A7R IV, objectif grand angle, atmosphère high-tech',
      'Centre de données moderne avec serveurs et éclairage LED bleu, environnement technologique propre, photographie professionnelle, ultra-haute résolution, esthétique design industriel, atmosphère tech premium',
      "Atelier d'innovation avec prototypes et écrans numériques, professionnels créatifs en brainstorming, mélange éclairage naturel et artificiel, style photographie documentaire, détail ultra-réaliste, technologie de pointe",
      "Bureau de startup tech élégant avec plusieurs moniteurs, environnement de codage, mobilier moderne, éclairage naturel, photographie d'espace de travail professionnel, qualité ultra-réaliste, atmosphère innovante",
    ],
  },
  lifestyle: {
    icon: <Users className="w-4 h-4" />,
    label: 'Lifestyle Premium',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    prompts: [
      'Professionnel élégant travaillant depuis un bureau à domicile de luxe, éclairage naturel, photographie lifestyle, prise avec Leica Q2, design intérieur premium, détail ultra-réaliste, atmosphère sophistiquée',
      'Café moderne avec professionnels en networking, éclairage naturel, photographie documentaire lifestyle, interactions authentiques, qualité ultra-haute, environnement social premium',
      "Déjeuner d'affaires haut de gamme dans un restaurant moderne, professionnels discutant d'affaires, éclairage naturel, photographie lifestyle, détail ultra-réaliste, atmosphère de restauration sophistiquée",
      'Espace de coworking premium avec professionnels diversifiés, design moderne, éclairage naturel, photographie lifestyle, environnement de travail authentique, ultra-haute résolution',
    ],
  },
  creative: {
    icon: <Palette className="w-4 h-4" />,
    label: 'Créatif Premium',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    prompts: [
      "Session de brainstorming d'agence créative, espace studio moderne, éclairage naturel, style photographie documentaire, processus créatif authentique, détail ultra-réaliste, atmosphère artistique",
      "Designer travaillant sur projets numériques, plusieurs écrans, espace de travail moderne, éclairage naturel et d'écran, photographie professionnelle, qualité ultra-haute, environnement créatif",
      'Directeur artistique présentant concepts dans studio moderne, configuration de présentation professionnelle, éclairage naturel, style photographie corporative, détail ultra-réaliste, leadership créatif',
      "Laboratoire d'innovation avec prototypes créatifs, espace de design thinking moderne, éclairage naturel, photographie architecturale, ultra-haute résolution, environnement créatif premium",
    ],
  },
};

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024');
  const [quality, setQuality] = useState<'standard' | 'hd'>('hd'); // HD par défaut pour premium
  const [style, setStyle] = useState<'vivid' | 'natural'>('natural'); // Natural par défaut pour réalisme
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [, setSelectedIndustry] = useState<string>('');

  const { toast } = useToast();
  const {
    generateImage,
    isGeneratingImage,
    lastImageResponse,
    imageError,
    imageHistory,
    clearImageHistory,
  } = useAI();

  // Validation de la cohérence de marque en temps réel
  const brandValidation = validateBrandConsistency(prompt);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Description requise',
        description: "Veuillez décrire l'image que vous souhaitez créer",
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log("🎨 Génération d'image demandée:", { prompt, size, quality, style });

      const request: ImageRequest = {
        prompt: prompt.trim(),
        size,
        quality,
        style,
      };

      await generateImage(request);

      toast({
        title: 'Image générée avec succès !',
        description: 'Votre image premium a été créée par DALL-E 3',
      });
    } catch (error) {
      toast({
        title: 'Erreur de génération',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (imageUrl: string, filename?: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `kora-premium-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      globalThis.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Image téléchargée',
        description: "L'image premium a été sauvegardée sur votre appareil",
      });
    } catch (_error) {
      toast({
        title: 'Erreur de téléchargement',
        description: "Impossible de télécharger l'image",
        variant: 'destructive',
      });
    }
  };

  const handleCopyUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    toast({
      title: 'URL copiée',
      description: "L'URL de l'image a été copiée dans le presse-papiers",
    });
  };

  const handleUseTemplate = (templatePrompt: string, category: string) => {
    setPrompt(templatePrompt);
    setSelectedCategory(category);

    toast({
      title: 'Modèle appliqué',
      description: `Prompt premium ${PREMIUM_PROMPT_TEMPLATES[category as keyof typeof PREMIUM_PROMPT_TEMPLATES].label} chargé`,
    });
  };

  const handleUseIndustryTemplate = (industryPrompt: string, industry: string) => {
    setPrompt(industryPrompt);
    setSelectedIndustry(industry);

    toast({
      title: 'Modèle secteur appliqué',
      description: `Prompt ${INDUSTRY_TEMPLATES[industry as keyof typeof INDUSTRY_TEMPLATES].name} chargé`,
    });
  };

  const handleOptimizeForBrand = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Description requise',
        description: "Ajoutez d'abord une description de base",
        variant: 'destructive',
      });
      return;
    }

    const optimizedPrompt = optimizePromptForBrand(prompt, selectedCategory as any);
    setPrompt(optimizedPrompt);
    setQuality('hd');
    setStyle('natural');

    toast({
      title: 'Prompt optimisé pour Kora',
      description: 'Paramètres premium appliqués pour un rendu professionnel',
    });
  };

  return (
    <div className="space-y-6">
      {/* Interface de génération */}
      <Card className="premium-card border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            <span>Générateur d'Images Premium</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              DALL-E 3 Ultra-Réaliste
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Kora Avatar */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <div className="flex-1">
              <p className="text-purple-600 font-medium text-sm">
                Kora - Créatrice d'Images Premium
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Je crée des visuels ultra-réalistes qui reflètent l'excellence de votre marque.
                Utilisez nos modèles premium ou décrivez votre vision !
              </p>
              {imageError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-xs">{imageError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Templates par Secteur d'Activité */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Modèles par Secteur</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(INDUSTRY_TEMPLATES).map(([key, industry]) => (
                <div
                  key={key}
                  className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {key === 'consulting' && <Briefcase className="w-4 h-4" />}
                    {key === 'fintech' && <TrendingUp className="w-4 h-4" />}
                    {key === 'healthcare' && <Heart className="w-4 h-4" />}
                    {key === 'education' && <GraduationCap className="w-4 h-4" />}
                    {key === 'retail' && <ShoppingCart className="w-4 h-4" />}
                    <span className="font-medium text-sm">{industry.name}</span>
                  </div>
                  <div className="space-y-1">
                    {industry.prompts.slice(0, 1).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleUseIndustryTemplate(prompt, key)}
                        className="w-full text-left text-xs p-2 rounded bg-white/50 hover:bg-white/80 transition-colors"
                      >
                        {prompt.substring(0, 60)}...
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates Premium */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Modèles Premium Kora</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(PREMIUM_PROMPT_TEMPLATES).map(([key, category]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg border ${category.color} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {category.icon}
                    <span className="font-medium text-sm">{category.label}</span>
                  </div>
                  <div className="space-y-1">
                    {category.prompts.slice(0, 2).map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleUseTemplate(prompt, key)}
                        className="w-full text-left text-xs p-2 rounded bg-white/50 hover:bg-white/80 transition-colors"
                      >
                        {prompt.substring(0, 80)}...
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Description de l'image premium
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Réunion d'affaires professionnelle dans une salle de conférence moderne en verre, équipe diversifiée discutant de stratégie IA, éclairage naturel, photographie ultra-réaliste..."
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />

            {/* Validation de la cohérence de marque */}
            {prompt && (
              <div className="flex items-center space-x-2 text-xs">
                {brandValidation.isValid ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Cohérence de marque: {brandValidation.score.toFixed(0)}%</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      Cohérence: {brandValidation.score.toFixed(0)}% - Optimisation recommandée
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>{prompt.length}/1000 caractères</span>
              <div className="flex space-x-2">
                <Button
                  onClick={handleOptimizeForBrand}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Optimiser pour Kora
                </Button>
              </div>
            </div>
          </div>

          {/* Paramètres Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Format</label>
              <Select value={size} onValueChange={(value: any) => setSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">Carré Premium (1024×1024)</SelectItem>
                  <SelectItem value="1792x1024">Paysage Ultra (1792×1024)</SelectItem>
                  <SelectItem value="1024x1792">Portrait Pro (1024×1792)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Qualité</label>
              <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd">Ultra HD (Recommandé)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Style</label>
              <Select value={style} onValueChange={(value: any) => setStyle(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="natural">Ultra-Réaliste (Recommandé)</SelectItem>
                  <SelectItem value="vivid">Créatif Vivide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerate}
              disabled={isGeneratingImage || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 flex-1"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Création Premium...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Créer l'Image Premium
                </>
              )}
            </Button>

            {imageHistory.length > 0 && (
              <Button onClick={clearImageHistory} variant="outline" className="border-slate-300">
                Effacer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résultat de génération */}
      {(isGeneratingImage || lastImageResponse) && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center space-x-2">
              <span>🎨</span>
              <span>Image générée</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGeneratingImage && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">DALL-E 3 crée votre image...</p>
                  <p className="text-slate-400 text-sm mt-1">Cela peut prendre 10-30 secondes</p>
                </div>
              </div>
            )}

            {lastImageResponse && (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={lastImageResponse.imageUrl}
                    alt="Image générée par IA"
                    className="w-full rounded-lg shadow-lg"
                    style={{ maxHeight: '512px', objectFit: 'contain' }}
                  />

                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDownload(lastImageResponse.imageUrl)}
                        size="sm"
                        className="bg-white text-slate-700 hover:bg-slate-100"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                      <Button
                        onClick={() => handleCopyUrl(lastImageResponse.imageUrl)}
                        size="sm"
                        variant="outline"
                        className="bg-white border-white text-slate-700 hover:bg-slate-100"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copier URL
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Informations sur l'image */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Modèle:</span>
                    <Badge variant="secondary">{lastImageResponse.model}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Taille:</span>
                    <span className="text-slate-800">{lastImageResponse.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Généré le:</span>
                    <span className="text-slate-800">
                      {new Date(lastImageResponse.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>

                  {lastImageResponse.revisedPrompt && (
                    <div className="space-y-1">
                      <span className="text-slate-600 text-sm">
                        Description optimisée par DALL-E 3:
                      </span>
                      <p className="text-slate-800 text-sm bg-white p-2 rounded border">
                        {lastImageResponse.revisedPrompt}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Historique des images */}
      {imageHistory.length > 0 && (
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center space-x-2">
              <span>📚</span>
              <span>Historique des Images</span>
              <Badge variant="outline">{imageHistory.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageHistory.map((image, index) => (
                <div key={image.timestamp} className="relative group">
                  <img
                    src={image.imageUrl}
                    alt={`Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-1">
                      <Button
                        onClick={() =>
                          handleDownload(image.imageUrl, `kora-image-${index + 1}.png`)
                        }
                        size="sm"
                        className="bg-white text-slate-700 hover:bg-slate-100"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleCopyUrl(image.imageUrl)}
                        size="sm"
                        variant="outline"
                        className="bg-white border-white text-slate-700 hover:bg-slate-100"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black bg-opacity-60 text-white text-xs p-1 rounded">
                      {new Date(image.timestamp).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;
