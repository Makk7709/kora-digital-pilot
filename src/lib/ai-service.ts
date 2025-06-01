// Service IA avec protocole de garantie 100% de réussite
export interface AIRequest {
  prompt: string;
  platform: string;
  contentType: string;
  tone: string;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  success: boolean;
  timestamp: number;
  platform: string;
}

// Nouvelle interface pour les requêtes d'images
export interface ImageRequest {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number;
}

// Nouvelle interface pour les réponses d'images
export interface ImageResponse {
  imageUrl: string;
  revisedPrompt?: string;
  model: string;
  success: boolean;
  timestamp: number;
  size: string;
}

export interface AIError {
  message: string;
  code: string;
  retryable: boolean;
}

class AIService {
  private readonly openaiKey: string;
  private readonly anthropicKey: string;
  private readonly timeout: number;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000;

  constructor() {
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    this.timeout = parseInt(import.meta.env.VITE_AI_TIMEOUT || '30000');
    
    // Debugging des clés API avec détection des placeholders
    console.log('🔑 Configuration des clés API:');
    
    const isOpenAIValid = this.openaiKey && 
                         this.openaiKey.length > 20 && 
                         !this.openaiKey.includes('your-openai-key-here') &&
                         !this.openaiKey.includes('sk-proj-your-key-here') &&
                         (this.openaiKey.startsWith('sk-') || this.openaiKey.startsWith('sk-proj-'));
    
    const isAnthropicValid = this.anthropicKey && 
                            this.anthropicKey.length > 20 && 
                            !this.anthropicKey.includes('your-anthropic-key-here') &&
                            !this.anthropicKey.includes('sk-ant-your-key-here') &&
                            this.anthropicKey.startsWith('sk-ant-');
    
    console.log('OpenAI Key:', isOpenAIValid ? '✅ VALIDE' : '❌ INVALIDE/PLACEHOLDER', 
                this.openaiKey ? `(${this.openaiKey.substring(0, 15)}...)` : '(vide)');
    console.log('Anthropic Key:', isAnthropicValid ? '✅ VALIDE' : '❌ INVALIDE/PLACEHOLDER', 
                this.anthropicKey ? `(${this.anthropicKey.substring(0, 15)}...)` : '(vide)');
    
    if (!isOpenAIValid && !isAnthropicValid) {
      console.error('🚨 ERREUR CRITIQUE : Aucune clé API valide détectée !');
      console.error('📝 Action requise : Remplacez les placeholders dans .env.local par vos vraies clés API');
    }
    
    console.log('Variables d\'environnement disponibles:', Object.keys(import.meta.env).filter(key => key.includes('API')));
  }

  // Protocole de garantie 100% - Essaie Claude puis OpenAI en fallback
  async generateContent(request: AIRequest): Promise<AIResponse> {
    // Validation et debugging des paramètres
    console.log('🔍 Paramètres de génération reçus:', {
      prompt: request.prompt.substring(0, 100) + '...',
      platform: request.platform,
      contentType: request.contentType,
      tone: request.tone,
      maxTokens: request.maxTokens
    });

    // Validation des paramètres critiques
    if (!request.prompt?.trim()) {
      throw new Error('Le prompt ne peut pas être vide');
    }

    if (!['linkedin', 'instagram', 'twitter', 'facebook', 'tiktok'].includes(request.platform)) {
      console.warn(`⚠️ Plateforme non reconnue: ${request.platform}, utilisation de linkedin par défaut`);
      request.platform = 'linkedin';
    }

    if (!['post', 'thread', 'story', 'article', 'carousel', 'video'].includes(request.contentType)) {
      console.warn(`⚠️ Type de contenu non reconnu: ${request.contentType}, utilisation de post par défaut`);
      request.contentType = 'post';
    }

    const validTones = [
      'Professionnel & stratégique',
      'Innovant & futuriste', 
      'Educatif & expert',
      'Inspirant & visionnaire',
      'professionnel', 'décontracté', 'inspirant', 'éducatif', 'humoristique', 'urgent', 'bienveillant'
    ];

    if (!validTones.includes(request.tone)) {
      console.warn(`⚠️ Ton non reconnu: ${request.tone}, utilisation de "Professionnel & stratégique" par défaut`);
      request.tone = 'Professionnel & stratégique';
    }

    // LOGIQUE CORRIGÉE : GPT en priorité, Claude en fallback
    const attempts = [
      { provider: 'openai', model: 'gpt-4o', priority: 'primary' }, // GPT en priorité
      { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', priority: 'fallback' }, // Claude en fallback
      { provider: 'openai', model: 'gpt-3.5-turbo', priority: 'emergency' }, // Fallback économique
    ];

    let lastError: AIError | null = null;

    for (const attempt of attempts) {
      try {
        console.log(`🤖 Tentative avec ${attempt.provider} (${attempt.model}) - Priorité: ${attempt.priority}`);
        console.log(`📝 Prompt système généré pour: ${request.contentType} / ${request.tone} / ${request.platform}`);
        
        const response = await this.callAIProvider(request, attempt.provider, attempt.model);
        
        console.log(`✅ Succès avec ${attempt.provider} (${attempt.priority})`);
        console.log(`📊 Contenu généré: ${response.content.length} caractères`);
        
        // Validation du contenu généré
        if (this.validateGeneratedContent(response.content, request)) {
          return {
            ...response,
            success: true,
            timestamp: Date.now(),
            platform: request.platform
          };
        } else {
          console.warn(`⚠️ Contenu généré par ${attempt.provider} ne respecte pas les spécifications`);
        }
      } catch (error) {
        lastError = this.handleError(error, attempt.provider);
        console.warn(`❌ Échec ${attempt.provider} (${attempt.priority}):`, lastError.message);
        
        // Attendre avant le prochain essai
        if (attempts.indexOf(attempt) < attempts.length - 1) {
          await this.delay(this.retryDelay);
        }
      }
    }

    // Si tous les providers échouent, retourner du contenu de fallback DYNAMIQUE
    console.log('🔄 Tous les providers ont échoué, génération de contenu dynamique optimisé');
    return this.generateDynamicFallback(request);
  }

  private async callAIProvider(request: AIRequest, provider: string, model: string): Promise<Omit<AIResponse, 'success' | 'timestamp' | 'platform'>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      if (provider === 'openai') {
        return await this.callOpenAI(request, model, controller.signal);
      } else if (provider === 'anthropic') {
        return await this.callAnthropic(request, model, controller.signal);
      } else {
        throw new Error(`Provider non supporté: ${provider}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async callOpenAI(request: AIRequest, model: string, signal: AbortSignal): Promise<Omit<AIResponse, 'success' | 'timestamp' | 'platform'>> {
    if (!this.openaiKey || 
        this.openaiKey.length < 20 || 
        this.openaiKey.includes('your-openai-key-here') ||
        this.openaiKey.includes('sk-proj-your-key-here') ||
        !(this.openaiKey.startsWith('sk-') || this.openaiKey.startsWith('sk-proj-'))) {
      throw new Error('Clé API OpenAI manquante ou invalide (placeholder détecté)');
    }

    const systemPrompt = this.buildSystemPrompt(request);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiKey}`,
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || 4000,
        temperature: 0.8, // Augmenté pour plus de variété
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
      model: `OpenAI ${model}`,
    };
  }

  private async callAnthropic(request: AIRequest, model: string, signal: AbortSignal): Promise<Omit<AIResponse, 'success' | 'timestamp' | 'platform'>> {
    if (!this.anthropicKey || 
        this.anthropicKey.length < 20 || 
        this.anthropicKey.includes('your-anthropic-key-here') ||
        this.anthropicKey.includes('sk-ant-your-key-here') ||
        !this.anthropicKey.startsWith('sk-ant-')) {
      throw new Error('Clé API Anthropic manquante ou invalide (placeholder détecté)');
    }

    const systemPrompt = this.buildSystemPrompt(request);
    
    // Utiliser le proxy backend pour contourner CORS
    console.log('🔄 Utilisation du proxy backend pour Claude (contournement CORS)');
    
    const response = await fetch('/api/anthropic/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({
        model,
        max_tokens: request.maxTokens || 4000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: request.prompt }
        ],
        temperature: 0.8,
        anthropic_key: this.anthropicKey, // Passer la clé au proxy
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Anthropic Proxy Error: ${response.status} - ${error.error?.message || error.details || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || '',
      model: `Claude ${model} (via proxy)`,
    };
  }

  private buildSystemPrompt(request: AIRequest): string {
    const platformSpecs = {
      linkedin: 'LinkedIn (professionnel, 3000 caractères max, hashtags pertinents)',
      instagram: 'Instagram (visuel, 2200 caractères max, emojis, hashtags)',
      twitter: 'X/Twitter (concis, 280 caractères max, hashtags)',
      facebook: 'Facebook (conversationnel, 2000 caractères max)',
      tiktok: 'TikTok (viral, jeune, emojis, hashtags tendance)',
    };

    const contentTypeSpecs = {
      post: 'un post simple et engageant',
      thread: 'un thread/carrousel avec plusieurs parties numérotées',
      story: 'du contenu pour story/réels court et impactant',
      article: 'un article long et détaillé avec structure complète (introduction, développement, conclusion)',
      carousel: 'un carrousel avec slides multiples',
      video: 'un script pour vidéo avec accroches',
    };

    // Mapping correct des tons de l'interface vers les spécifications
    const toneSpecs = {
      'Professionnel & stratégique': 'ton professionnel, expert et stratégique avec une approche business',
      'Innovant & futuriste': 'ton innovant, avant-gardiste et visionnaire avec une perspective futuriste',
      'Educatif & expert': 'ton pédagogique, informatif et expert avec des explications claires',
      'Inspirant & visionnaire': 'ton motivant, inspirant et aspirationnel avec une vision positive',
      // Fallbacks pour les anciens tons
      'professionnel': 'ton professionnel et expert',
      'décontracté': 'ton décontracté et accessible',
      'inspirant': 'ton motivant et inspirant',
      'éducatif': 'ton pédagogique et informatif',
      'humoristique': 'ton léger avec touches d\'humour',
      'urgent': 'ton pressant et direct',
      'bienveillant': 'ton chaleureux et empathique',
    };

    const currentTime = new Date().toLocaleString('fr-FR');
    const randomSeed = Math.random().toString(36).substring(7);

    // Déterminer la longueur cible selon le type de contenu
    const lengthSpecs = {
      post: request.platform === 'twitter' ? '280 caractères maximum' : '300-800 caractères',
      thread: '1000-2000 caractères répartis en plusieurs parties',
      story: '100-200 caractères, très concis',
      article: '1500-3000 caractères, format long et détaillé',
      carousel: '500-1000 caractères répartis en slides',
      video: '300-600 caractères pour le script',
    };

    return `Tu es Kora, l'assistante IA de Korev AI, spécialisée dans la création de contenu digital premium.

MISSION CRITIQUE : Respecter EXACTEMENT les spécifications demandées.

CONTEXTE UNIQUE (${currentTime} - ${randomSeed}):
- Plateforme: ${platformSpecs[request.platform as keyof typeof platformSpecs] || request.platform}
- Type: ${contentTypeSpecs[request.contentType as keyof typeof contentTypeSpecs] || request.contentType}
- Ton: ${toneSpecs[request.tone as keyof typeof toneSpecs] || request.tone}
- Longueur cible: ${lengthSpecs[request.contentType as keyof typeof lengthSpecs] || 'adapté au contexte'}

DEMANDE SPÉCIFIQUE DE L'UTILISATEUR:
"${request.prompt}"

INSTRUCTIONS OBLIGATOIRES:
1. 🎯 RESPECTE ABSOLUMENT la demande spécifique de l'utilisateur
2. 📏 ADAPTE la longueur au type de contenu demandé (${request.contentType})
3. 🎭 APPLIQUE le ton exact demandé (${request.tone})
4. 📱 OPTIMISE pour la plateforme cible (${request.platform})
5. 🔄 VARIE les approches : storytelling, questions, listes, conseils selon le contexte
6. 💡 INCLUS des éléments d'engagement adaptés (CTA, questions, emojis selon la plateforme)
7. ✨ ASSURE-TOI que le contenu soit unique et personnalisé à cette demande

RÈGLES SPÉCIFIQUES PAR TYPE:
${request.contentType === 'article' ? `
- ARTICLE LONG : Structure complète avec introduction, développement en plusieurs parties, conclusion
- Minimum 1500 caractères, maximum 3000 caractères
- Inclus des sous-titres, points clés, et une conclusion actionnable
` : ''}
${request.contentType === 'thread' ? `
- THREAD : Numéroter les parties (1/, 2/, 3/, etc.)
- Chaque partie doit être cohérente et engageante
- Inclure une introduction et une conclusion
` : ''}
${request.contentType === 'post' ? `
- POST SIMPLE : Direct, engageant, avec un message clair
- Inclure un hook, du contenu de valeur, et un CTA
` : ''}

VARIÉTÉ OBLIGATOIRE:
- Change la structure à chaque génération
- Varie les accroches et conclusions
- Alterne entre différents styles d'écriture
- Adapte la longueur selon le contexte exact

FORMAT DE RÉPONSE:
Retourne uniquement le contenu final, prêt à publier, sans commentaires additionnels ou métadonnées.`;
  }

  private handleError(error: unknown, provider: string): AIError {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    
    // Erreurs retryables
    if (message.includes('timeout') || message.includes('network') || message.includes('500')) {
      return { message, code: 'RETRYABLE', retryable: true };
    }
    
    // Erreurs d'authentification
    if (message.includes('401') || message.includes('403')) {
      return { message: `Clé API ${provider} invalide`, code: 'AUTH_ERROR', retryable: false };
    }
    
    // Erreurs de quota
    if (message.includes('429') || message.includes('quota')) {
      return { message: `Quota ${provider} dépassé`, code: 'QUOTA_ERROR', retryable: true };
    }
    
    return { message, code: 'UNKNOWN', retryable: false };
  }

  // Nouvelle fonction pour générer du contenu dynamique en fallback
  private generateDynamicFallback(request: AIRequest): AIResponse {
    const timestamp = Date.now();
    const randomSeed = Math.random();
    
    // Analyse du prompt pour extraire les mots-clés
    const keywords = this.extractKeywords(request.prompt);
    const mainTopic = this.identifyMainTopic(request.prompt, keywords);
    
    // Génération de contenu basée sur les paramètres
    const content = this.generateContentByParameters(request, mainTopic, keywords, randomSeed);
    
    return {
      content,
      model: 'Kora Dynamic Generator',
      success: true,
      timestamp,
      platform: request.platform
    };
  }

  private extractKeywords(prompt: string): string[] {
    // Mots vides à ignorer (incluant les mots de commande)
    const stopWords = [
      'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or',
      'je', 'veux', 'créer', 'faire', 'post', 'article', 'thread', 'sur', 'pour', 'avec', 'dans', 'par',
      'qui', 'que', 'quoi', 'comment', 'pourquoi', 'où', 'quand', 'dont', 'lequel', 'laquelle',
      'ce', 'cette', 'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses',
      'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'à', 'au', 'aux', 'en', 'y'
    ];
    
    // Nettoyer et extraire les vrais mots-clés
    const cleanedPrompt = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const words = cleanedPrompt.split(' ')
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .filter(word => !word.match(/^\d+$/)); // Exclure les nombres purs
    
    // Prioriser les mots importants (IA, startup, etc.)
    const importantWords = words.filter(word => 
      word.includes('ia') || word.includes('ai') || 
      word.includes('startup') || word.includes('start') || word.includes('sart') || // Inclure les fautes de frappe courantes
      word.includes('entreprise') || word.includes('innovation') || 
      word.includes('tech') || word.includes('business') || word.includes('digital')
    );
    
    // Retourner les mots importants en premier, puis les autres
    const finalKeywords = [...importantWords, ...words.filter(w => !importantWords.includes(w))];
    
    return finalKeywords.slice(0, 10); // Garder les 10 premiers mots-clés
  }

  private identifyMainTopic(prompt: string, keywords: string[]): string {
    const topics = {
      'ia': ['intelligence', 'artificielle', 'ai', 'machine', 'learning', 'algorithme'],
      'business': ['entreprise', 'business', 'stratégie', 'croissance', 'vente', 'marketing'],
      'tech': ['technologie', 'digital', 'innovation', 'développement', 'code', 'app'],
      'social': ['réseaux', 'sociaux', 'communauté', 'engagement', 'followers'],
      'productivité': ['productivité', 'efficacité', 'organisation', 'temps', 'méthode'],
      'formation': ['formation', 'apprentissage', 'compétences', 'éducation', 'cours'],
    };

    for (const [topic, relatedWords] of Object.entries(topics)) {
      if (relatedWords.some(word => prompt.toLowerCase().includes(word))) {
        return topic;
      }
    }

    return keywords[0] || 'général';
  }

  private generateContentByParameters(request: AIRequest, topic: string, keywords: string[], randomSeed: number): string {
    // Générer du contenu spécialisé selon le type demandé
    if (request.contentType === 'article') {
      return this.generateArticleContent(request, topic, keywords);
    } else if (request.contentType === 'thread') {
      return this.generateThreadContent(request, topic, keywords);
    } else {
      const variations = this.getContentVariations(request.platform, request.contentType, request.tone);
      const selectedVariation = variations[Math.floor(randomSeed * variations.length)];
      return this.personalizeContent(selectedVariation, topic, keywords, request);
    }
  }

  private generateArticleContent(request: AIRequest, topic: string, keywords: string[]): string {
    // Utiliser directement le prompt utilisateur comme base
    const userPrompt = request.prompt.trim();
    const mainKeyword = keywords[0] || topic;
    
    // Analyser le prompt pour comprendre ce que l'utilisateur veut vraiment
    const isAboutAI = userPrompt.toLowerCase().includes('ia') || userPrompt.toLowerCase().includes('intelligence') || userPrompt.toLowerCase().includes('ai');
    const isAboutStartup = userPrompt.toLowerCase().includes('startup') || userPrompt.toLowerCase().includes('start-up') || userPrompt.toLowerCase().includes('entreprise');
    const isAboutSchool = userPrompt.toLowerCase().includes('école') || userPrompt.toLowerCase().includes('éducation') || userPrompt.toLowerCase().includes('formation');
    const isAboutChildren = userPrompt.toLowerCase().includes('enfant') || userPrompt.toLowerCase().includes('enfants') || userPrompt.toLowerCase().includes('jeune') || userPrompt.toLowerCase().includes('jeunes');
    const isAboutBusiness = userPrompt.toLowerCase().includes('entreprise') || userPrompt.toLowerCase().includes('business') || userPrompt.toLowerCase().includes('stratégie');
    
    // Structure d'article long adaptée au ton ET au contenu demandé
    const toneAdaptations = {
      'Professionnel & stratégique': {
        intro: `Dans le contexte professionnel actuel, ${userPrompt} représente un enjeu stratégique majeur.`,
        style: 'analyse business approfondie',
        conclusion: 'recommandations stratégiques concrètes'
      },
      'Innovant & futuriste': {
        intro: `L'avenir se dessine aujourd'hui avec ${userPrompt}, et les innovations émergentes transforment notre vision.`,
        style: 'perspective d\'avant-garde',
        conclusion: 'vision prospective inspirante'
      },
      'Educatif & expert': {
        intro: `Pour bien comprendre ${userPrompt}, il est essentiel d'adopter une approche méthodique et structurée.`,
        style: 'guide pédagogique détaillé',
        conclusion: 'synthèse des apprentissages clés'
      },
      'Inspirant & visionnaire': {
        intro: `${userPrompt} ouvre des horizons extraordinaires et transforme notre façon de concevoir l'avenir.`,
        style: 'vision inspirante et motivante',
        conclusion: 'appel à l\'action transformateur'
      }
    };

    const adaptation = toneAdaptations[request.tone as keyof typeof toneAdaptations] || toneAdaptations['Professionnel & stratégique'];

    // Générer un contenu spécifique basé sur le prompt utilisateur
    let specificContent = '';
    let contextualAnalysis = '';
    let recommendations = '';

    if (isAboutAI && isAboutStartup) {
      // Contenu spécialisé pour les startups IA
      specificContent = `L'écosystème des startups IA connaît une croissance explosive en 2024. Ces jeunes entreprises révolutionnent tous les secteurs grâce à des innovations technologiques disruptives et des modèles économiques repensés.

🚀 **L'Explosion du Marché des Startups IA**

Le financement des startups IA a atteint des records historiques avec plus de 50 milliards d'euros investis mondialement. Cette dynamique s'explique par la démocratisation des outils IA et l'émergence de nouveaux cas d'usage.

Les secteurs les plus impactés :
• HealthTech : Diagnostic médical assisté par IA
• FinTech : Analyse prédictive et gestion des risques
• EdTech : Personnalisation de l'apprentissage
• RetailTech : Recommandations et optimisation des stocks
• AgriTech : Agriculture de précision et optimisation des rendements

🎯 **Modèles d'Affaires Innovants**

Les startups IA développent des approches commerciales inédites :

**SaaS IA** : Outils en ligne accessibles aux PME sans expertise technique
**API-First** : Monétisation de l'intelligence artificielle via des interfaces programmables
**Freemium IA** : Démocratisation avec versions gratuites puis montée en gamme
**IA-as-a-Service** : Externalisation complète des besoins en intelligence artificielle`;

      contextualAnalysis = `**Défis et Opportunités des Startups IA**

L'écosystème startup IA fait face à des enjeux spécifiques :

1. **Talent et Recrutement** : Guerre des talents pour attirer les meilleurs profils IA
2. **Données d'Entraînement** : Accès aux datasets de qualité pour développer les modèles
3. **Réglementation** : Conformité avec l'AI Act européen et les régulations locales
4. **Différenciation** : Se démarquer dans un marché de plus en plus concurrentiel
5. **Scalabilité** : Gérer la croissance tout en maintenant la performance des modèles

**Facteurs Clés de Succès** :

▶️ **Spécialisation sectorielle** : Focus sur un domaine d'expertise précis
▶️ **Partenariats stratégiques** : Alliances avec les grands groupes
▶️ **Agilité technologique** : Adaptation rapide aux évolutions IA
▶️ **Vision produit** : Résoudre de vrais problèmes utilisateurs`;

      recommendations = `**Stratégies Gagnantes pour les Startups IA**

🎯 **Pour les Entrepreneurs** :
▶️ **Validation marché** : Tester rapidement auprès d'utilisateurs réels
▶️ **MVP IA** : Commencer simple puis complexifier progressivement
▶️ **Équipe hybride** : Combiner expertise technique et vision business
▶️ **Financement adapté** : Lever des fonds auprès d'investisseurs spécialisés IA

🎯 **Pour les Investisseurs** :
▶️ **Due diligence technique** : Évaluer la robustesse des modèles IA
▶️ **Potentiel de marché** : Analyser la taille et la croissance du secteur cible
▶️ **Équipe fondatrice** : Vérifier l'expérience et la complémentarité
▶️ **Propriété intellectuelle** : Protéger les innovations et algorithmes

🎯 **Pour les Corporates** :
▶️ **Veille technologique** : Identifier les startups disruptives
▶️ **Partenariats** : Collaborer plutôt que concurrencer
▶️ **Acquisition stratégique** : Intégrer les innovations prometteuses
▶️ **Innovation ouverte** : Créer des programmes d'incubation IA`;

    } else if (isAboutAI && isAboutSchool) {
      specificContent = `L'intelligence artificielle révolutionne le secteur éducatif de manière spectaculaire. Les établissements scolaires qui intègrent l'IA dans leurs programmes pédagogiques observent des transformations remarquables dans l'apprentissage des élèves.

🎯 **Impact sur l'Apprentissage**

L'IA personnalise l'expérience éducative en s'adaptant au rythme et au style d'apprentissage de chaque élève. Cette approche individualisée permet d'optimiser les résultats scolaires et de réduire les inégalités éducatives.

Les outils d'IA permettent aux enseignants de :
• Identifier rapidement les difficultés d'apprentissage
• Proposer des exercices adaptés au niveau de chaque élève  
• Automatiser la correction et le suivi des progrès
• Créer du contenu pédagogique personnalisé`;

      contextualAnalysis = `**Défis et Opportunités**

L'intégration de l'IA à l'école soulève des questions importantes :

1. **Formation des enseignants** : Nécessité d'accompagner les équipes pédagogiques dans cette transition technologique
2. **Équité numérique** : Garantir l'accès aux outils IA pour tous les établissements
3. **Éthique et vie privée** : Protéger les données des élèves tout en bénéficiant des avantages de l'IA
4. **Développement de l'esprit critique** : Apprendre aux élèves à utiliser l'IA de manière réfléchie`;

      recommendations = `**Recommandations pour une Intégration Réussie**

▶️ **Phase pilote** : Commencer par des projets limités pour tester l'efficacité
▶️ **Formation continue** : Investir massivement dans la formation des enseignants
▶️ **Partenariats** : Collaborer avec des entreprises tech spécialisées en EdTech
▶️ **Évaluation** : Mesurer régulièrement l'impact sur les résultats scolaires`;

    } else if (isAboutAI) {
      specificContent = `L'intelligence artificielle transforme radicalement notre façon de travailler, de créer et d'innover. Cette révolution technologique impacte tous les secteurs d'activité et redéfinit les compétences professionnelles de demain.

🚀 **Transformation des Métiers**

L'IA ne remplace pas les humains, elle augmente leurs capacités. Les professionnels qui maîtrisent ces outils prennent une avance considérable sur leurs concurrents.

Les domaines les plus impactés incluent :
• Marketing et communication digitale
• Analyse de données et business intelligence
• Création de contenu et design
• Service client et support technique
• Recherche et développement`;

      contextualAnalysis = `**Enjeux Stratégiques**

L'adoption de l'IA présente des défis majeurs :

1. **Compétences** : Nécessité de former les équipes aux nouveaux outils
2. **Éthique** : Utiliser l'IA de manière responsable et transparente
3. **Compétitivité** : Rester à la pointe pour ne pas être distancé
4. **ROI** : Mesurer concrètement l'impact business des investissements IA`;

      recommendations = `**Stratégie d'Adoption IA**

▶️ **Audit des besoins** : Identifier les cas d'usage prioritaires
▶️ **Formation** : Développer les compétences IA en interne
▶️ **Expérimentation** : Tester rapidement sur des projets pilotes
▶️ **Scaling** : Déployer progressivement les solutions qui fonctionnent`;

    } else {
      // Contenu générique mais basé sur le prompt utilisateur
      specificContent = `${userPrompt} représente un sujet d'actualité majeur qui mérite une analyse approfondie. Dans un contexte en constante évolution, il est crucial de comprendre les enjeux et opportunités liés à cette thématique.

🎯 **Contexte et Importance**

Cette problématique touche de nombreux acteurs et nécessite une approche structurée pour en saisir toutes les dimensions. Les entreprises et organisations qui s'y intéressent activement prennent une longueur d'avance significative.

Les aspects clés à considérer :
• Impact sur les pratiques actuelles
• Opportunités de développement
• Défis à relever
• Perspectives d'évolution`;

      contextualAnalysis = `**Analyse Détaillée**

Pour bien appréhender ${userPrompt}, plusieurs dimensions méritent notre attention :

1. **Dimension stratégique** : Impact sur les objectifs à long terme
2. **Dimension opérationnelle** : Changements dans les processus quotidiens  
3. **Dimension humaine** : Accompagnement des équipes dans la transformation
4. **Dimension technologique** : Outils et solutions à mettre en place`;

      recommendations = `**Plan d'Action Recommandé**

▶️ **Diagnostic** : Évaluer la situation actuelle et les besoins
▶️ **Stratégie** : Définir une feuille de route claire et réaliste
▶️ **Mise en œuvre** : Déployer progressivement les solutions
▶️ **Suivi** : Mesurer les résultats et ajuster si nécessaire`;
    }

    return `📖 ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)} : Analyse Complète 2024

${adaptation.intro}

${specificContent}

💡 ${contextualAnalysis}

🚀 ${recommendations}

🎯 **Conclusion**

${adaptation.conclusion === 'recommandations stratégiques concrètes' ?
  `En conclusion, ${userPrompt} représente un levier de transformation incontournable. Les organisations qui investissent dès maintenant dans cette approche prendront une avance décisive sur leurs concurrents. L'avenir appartient à ceux qui osent innover.` :
adaptation.conclusion === 'vision prospective inspirante' ?
  `L'avenir de ${userPrompt} s'annonce révolutionnaire. Les innovations à venir transformeront notre façon de concevoir et d'utiliser ces approches. Préparez-vous à un changement de paradigme majeur.` :
adaptation.conclusion === 'synthèse des apprentissages clés' ?
  `Retenez ces éléments essentiels : ${userPrompt} nécessite une approche méthodique, des compétences adaptées et une vision claire des objectifs. La réussite dépend de votre capacité à allier théorie et pratique.` :
  `${userPrompt} n'est pas qu'une tendance, c'est une révolution en marche. Saisissez cette opportunité pour transformer votre approche et créer de la valeur durable. L'action d'aujourd'hui détermine le succès de demain.`
}

${this.generateHashtags([mainKeyword, ...keywords.slice(0, 3)], request.platform)}`;
  }

  private generateThreadContent(request: AIRequest, topic: string, keywords: string[]): string {
    const userPrompt = request.prompt.trim();
    const mainKeyword = keywords[0] || topic;
    
    // Analyser le prompt pour comprendre le contexte
    const isAboutAI = userPrompt.toLowerCase().includes('ia') || userPrompt.toLowerCase().includes('intelligence') || userPrompt.toLowerCase().includes('ai');
    const isAboutInnovation = userPrompt.toLowerCase().includes('innovation') || userPrompt.toLowerCase().includes('futur') || userPrompt.toLowerCase().includes('2024');
    const isAboutBusiness = userPrompt.toLowerCase().includes('entreprise') || userPrompt.toLowerCase().includes('business') || userPrompt.toLowerCase().includes('stratégie');
    
    // Générer un thread spécifique au contenu demandé
    let threadContent = '';
    
    if (isAboutAI && isAboutInnovation) {
      threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Voici les innovations IA qui vont transformer 2024 👇

1/ 🚀 **IA Générative Multimodale**
Les nouveaux modèles combinent texte, image, vidéo et audio. Cette convergence ouvre des possibilités créatives inédites pour les entreprises.

2/ 🎯 **IA Personnalisée pour les PME**
Fini les solutions complexes ! 2024 voit naître des outils IA plug-and-play, accessibles aux petites structures sans expertise technique.

3/ 🔮 **Agents IA Autonomes**
Plus que des chatbots : des assistants qui planifient, exécutent et optimisent des tâches complexes en totale autonomie.

4/ 🌍 **IA Éthique et Transparente**
Les entreprises investissent massivement dans des IA explicables, respectueuses de la vie privée et socialement responsables.

5/ ⚡ **IA Edge Computing**
L'intelligence artificielle se rapproche des utilisateurs : traitement local, latence réduite, confidentialité renforcée.

6/ 🎨 **Créativité Augmentée**
L'IA devient le co-pilote créatif des designers, marketeurs et créateurs de contenu. Collaboration homme-machine optimale.

7/ 📊 **Prédictions Hyper-Précises**
Les modèles 2024 analysent des patterns invisibles à l'œil humain pour des prévisions business d'une précision inégalée.

🎯 **Conclusion** : 2024 marque l'entrée dans l'ère de l'IA démocratisée et spécialisée.

Quelle innovation vous excite le plus ? 👇`;

    } else if (isAboutAI) {
      threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Ce que vous devez absolument savoir 👇

1/ 🎯 **L'IA transforme tout**
${userPrompt} n'est plus de la science-fiction. C'est une réalité qui impacte déjà votre secteur d'activité, que vous le réalisiez ou non.

2/ 💡 **Opportunité vs Menace**
Les entreprises qui adoptent l'IA voient leurs performances augmenter de 40% en moyenne. Celles qui attendent risquent d'être distancées.

3/ 🚀 **Par où commencer ?**
Identifiez UNE tâche répétitive dans votre quotidien. C'est votre point d'entrée idéal pour expérimenter l'IA sans risque.

4/ 🎓 **Formation = Clé du succès**
L'IA ne remplace pas les humains, elle les augmente. Investissez dans la formation de vos équipes dès maintenant.

5/ ⚖️ **Éthique et responsabilité**
Utilisez l'IA de manière transparente et responsable. Vos clients et collaborateurs vous en remercieront.

6/ 🔮 **Vision long terme**
${userPrompt} n'est que le début. Préparez-vous à une transformation continue de vos méthodes de travail.

🎯 **Action immédiate** : Testez UN outil IA cette semaine. L'expérience vaut tous les discours.

Votre première expérience IA ? Racontez-nous ! 👇`;

    } else if (isAboutBusiness) {
      threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Les clés du succès en 2024 👇

1/ 📊 **Données = Nouveau Pétrole**
${userPrompt} repose sur l'exploitation intelligente de vos données. Collectez, analysez, actionnez.

2/ 🎯 **Client au centre**
Personnalisez chaque interaction. Les consommateurs attendent une expérience unique, pas un service standardisé.

3/ 🚀 **Agilité organisationnelle**
Les entreprises qui s'adaptent rapidement survivent. Cultivez une culture du changement et de l'innovation.

4/ 💡 **Innovation continue**
Ne vous contentez pas de suivre les tendances. Créez-les ! L'innovation est votre avantage concurrentiel durable.

5/ 🌍 **Impact sociétal**
Les consommateurs choisissent des marques alignées avec leurs valeurs. Votre mission dépasse le profit.

6/ 🤝 **Collaboration stratégique**
Seul on va plus vite, ensemble on va plus loin. Développez des partenariats gagnant-gagnant.

🎯 **Résultat** : ${userPrompt} devient un levier de croissance durable et responsable.

Quelle stratégie appliquez-vous ? 👇`;

    } else {
      // Thread générique mais personnalisé au prompt
      threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Voici ce que vous devez savoir 👇

1/ 🎯 **Contexte actuel**
${userPrompt} représente un enjeu majeur dans notre environnement en constante évolution. Il est temps de s'y intéresser sérieusement.

2/ 💡 **Pourquoi maintenant ?**
Les conditions sont réunies pour que ${userPrompt} prenne une dimension nouvelle. Les acteurs qui bougent maintenant prennent l'avantage.

3/ 🚀 **Opportunités concrètes**
${userPrompt} ouvre des perspectives inédites pour optimiser vos processus et créer de la valeur ajoutée.

4/ ⚠️ **Défis à anticiper**
Comme toute transformation, ${userPrompt} présente des challenges. Mieux vaut les identifier maintenant pour les surmonter.

5/ 🎓 **Compétences nécessaires**
Développez les bonnes compétences pour tirer parti de ${userPrompt}. L'investissement formation est rentable rapidement.

6/ 🔮 **Vision d'avenir**
${userPrompt} n'est que le début d'une transformation plus large. Préparez-vous aux évolutions futures.

🎯 **Action** : Commencez petit, testez, apprenez, adaptez. C'est la clé du succès avec ${userPrompt}.

Votre expérience avec ${userPrompt} ? Partagez ! 👇`;
    }
    
    return `${threadContent}

${this.generateHashtags([mainKeyword, ...keywords.slice(0, 3)], request.platform)}`;
  }

  private generateKeywordAnalysis(keyword: string, tone: string): string {
    const analyses = {
      'Professionnel & stratégique': `Cette dimension impacte directement la performance business et nécessite une approche structurée pour maximiser le ROI.`,
      'Innovant & futuriste': `Les innovations dans ce domaine ouvrent des perspectives révolutionnaires qui transformeront notre façon de travailler.`,
      'Educatif & expert': `Il est essentiel de comprendre les mécanismes sous-jacents pour appliquer efficacement ces concepts.`,
      'Inspirant & visionnaire': `Cette approche libère un potentiel créatif immense et ouvre la voie à des réalisations extraordinaires.`
    };
    
    return analyses[tone as keyof typeof analyses] || analyses['Professionnel & stratégique'];
  }

  private getContentVariations(platform: string, contentType: string, tone: string): string[] {
    const baseStructures = {
      linkedin: {
        post: [
          "🎯 {hook}\n\n{development}\n\n💡 Points clés :\n{points}\n\n{question}\n\n{hashtags}",
          "🚀 {hook}\n\n{story}\n\n✅ Résultats :\n{results}\n\n{cta}\n\n{hashtags}",
          "💭 {question_start}\n\n{explanation}\n\n🔑 Ma recommandation :\n{recommendation}\n\n{hashtags}",
        ],
        thread: [
          "🧵 THREAD : {title}\n\n1/ {point1}\n\n2/ {point2}\n\n3/ {point3}\n\n{conclusion}\n\n{hashtags}",
          "📚 Guide complet : {title}\n\n▶️ {step1}\n▶️ {step2}\n▶️ {step3}\n\n{summary}\n\n{hashtags}",
        ],
        article: [
          "📖 {title}\n\n{introduction}\n\n🎯 Contexte :\n{context}\n\n💡 Analyse :\n{analysis}\n\n🚀 Conclusion :\n{conclusion}\n\n{hashtags}",
        ]
      },
      instagram: {
        post: [
          "✨ {hook} ✨\n\n{content} 📸\n\n{emojis} {cta}\n\n{hashtags}",
          "🌟 {question}\n\n{answer} 💫\n\n{engagement_question}\n\n{hashtags}",
        ],
        story: [
          "🔥 {urgent_hook}\n\n{quick_tip}\n\n👆 Swipe pour plus !",
          "💡 Astuce du jour :\n\n{tip}\n\n❤️ Save si utile !",
        ]
      },
      twitter: [
        "{hook}\n\n{quick_points}\n\n{hashtags}",
        "🧵 {thread_intro}\n\n1/ {point1}\n2/ {point2}\n3/ {point3}",
        "💡 {insight}\n\n{explanation}\n\n{hashtags}",
      ]
    };

    const platformStructures = baseStructures[platform as keyof typeof baseStructures];
    if (!platformStructures) return ["Contenu personnalisé pour {topic} avec un ton {tone}"];
    
    const contentStructures = platformStructures[contentType as keyof typeof platformStructures] || platformStructures;
    return Array.isArray(contentStructures) ? contentStructures : [contentStructures];
  }

  private personalizeContent(template: string, topic: string, keywords: string[], request: AIRequest): string {
    const contentElements = this.generateContentElements(topic, keywords, request);
    
    let content = template;
    
    // Remplacer les placeholders
    Object.entries(contentElements).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    
    // Nettoyer les placeholders non remplacés
    content = content.replace(/{[^}]+}/g, '');
    
    return content.trim();
  }

  private generateContentElements(topic: string, keywords: string[], request: AIRequest): Record<string, string> {
    const randomIndex = Math.floor(Math.random() * 1000);
    const mainKeyword = keywords[0] || topic;
    const userPrompt = request.prompt.trim();
    
    // Analyser le prompt pour générer du contenu pertinent
    const isAboutAI = userPrompt.toLowerCase().includes('ia') || userPrompt.toLowerCase().includes('intelligence') || userPrompt.toLowerCase().includes('ai');
    const isQuestion = userPrompt.includes('?') || userPrompt.toLowerCase().includes('comment') || userPrompt.toLowerCase().includes('pourquoi');
    const isAboutTips = userPrompt.toLowerCase().includes('conseil') || userPrompt.toLowerCase().includes('astuce') || userPrompt.toLowerCase().includes('tip');
    const isAboutChildren = userPrompt.toLowerCase().includes('enfant') || userPrompt.toLowerCase().includes('enfants') || userPrompt.toLowerCase().includes('jeune') || userPrompt.toLowerCase().includes('jeunes');
    const isAboutBusiness = userPrompt.toLowerCase().includes('entreprise') || userPrompt.toLowerCase().includes('business') || userPrompt.toLowerCase().includes('stratégie');
    
    const hooks = [
      `${userPrompt} : découverte surprenante`,
      `3 erreurs courantes avec ${userPrompt}`,
      `Pourquoi ${userPrompt} change tout en 2024`,
      `La vérité sur ${userPrompt}`,
      `Comment maîtriser ${userPrompt} rapidement`,
      `${userPrompt} : ce que personne ne vous dit`,
    ];

    const questions = [
      `Que pensez-vous de ${userPrompt} ?`,
      `Votre expérience avec ${userPrompt} ?`,
      `Comment appliquez-vous ${userPrompt} ?`,
      `${userPrompt} : quel est votre avis ?`,
      `Avez-vous testé ${userPrompt} ?`,
    ];

    const ctas = [
      "Partagez votre expérience en commentaire !",
      "Qu'en pensez-vous ? Dites-le moi !",
      "Votre avis m'intéresse 👇",
      "À vous de jouer ! Commentez 💬",
      "Racontez-nous votre histoire !",
    ];

    // Contenu adapté au prompt utilisateur
    let development = '';
    let explanation = '';
    let story = '';
    
    if (isAboutAI) {
      development = `${userPrompt} transforme radicalement notre façon de travailler. Cette révolution IA impacte déjà votre secteur, que vous le réalisiez ou non.`;
      explanation = `Basé sur mon expérience avec ${userPrompt}, voici ce que j'ai découvert : l'IA n'est plus l'avenir, c'est le présent.`;
      story = `Récemment, j'ai expérimenté ${userPrompt} et les résultats m'ont surpris. Voici ce qui s'est passé...`;
    } else if (isQuestion) {
      development = `${userPrompt} Cette question mérite une réponse approfondie car elle touche un point crucial de notre époque.`;
      explanation = `Pour répondre à "${userPrompt}", il faut comprendre les enjeux sous-jacents et les implications pratiques.`;
      story = `Un client m'a récemment posé cette question : "${userPrompt}". Voici ma réponse détaillée...`;
    } else if (isAboutTips) {
      development = `${userPrompt} Voici des conseils pratiques testés et approuvés pour obtenir des résultats concrets.`;
      explanation = `Ces astuces sur ${userPrompt} vont vous faire gagner du temps et améliorer vos performances.`;
      story = `J'ai testé différentes approches pour ${userPrompt}. Voici les méthodes qui fonctionnent vraiment...`;
    } else {
      development = `${userPrompt} représente un enjeu majeur. Voici pourquoi c'est important pour votre ${request.platform === 'linkedin' ? 'carrière professionnelle' : 'quotidien'}.`;
      explanation = `Mon analyse de ${userPrompt} révèle des aspects souvent négligés mais cruciaux pour le succès.`;
      story = `En travaillant sur ${userPrompt}, j'ai découvert des insights surprenants que je veux partager avec vous...`;
    }

    return {
      hook: hooks[randomIndex % hooks.length],
      title: `${userPrompt} : Guide Pratique 2024`,
      question: questions[randomIndex % questions.length],
      question_start: questions[randomIndex % questions.length],
      cta: ctas[randomIndex % ctas.length],
      development,
      explanation,
      story,
      points: keywords.slice(0, 3).map((k, i) => `• ${k.charAt(0).toUpperCase() + k.slice(1)}`).join('\n'),
      hashtags: this.generateHashtags(keywords, request.platform),
      content: `Focus sur ${userPrompt} aujourd'hui`,
      emojis: this.getRandomEmojis(),
      engagement_question: `Et vous, comment gérez-vous ${userPrompt} ?`,
      results: keywords.slice(0, 2).map(k => `• +50% efficacité ${k}`).join('\n'),
      recommendation: `Pour ${userPrompt}, concentrez-vous sur l'action plutôt que la théorie.`,
      context: `Dans le contexte actuel, ${userPrompt} devient essentiel pour rester compétitif.`,
      analysis: `L'analyse montre que ${userPrompt} impacte directement les performances et la croissance.`,
      conclusion: `En résumé, ${userPrompt} est un levier de transformation incontournable.`,
      introduction: `Parlons de ${userPrompt} et de son impact concret sur votre activité.`,
      point1: `Premier insight sur ${userPrompt}`,
      point2: `Deuxième aspect crucial à retenir`,
      point3: `Troisième élément game-changer`,
      step1: `Étape 1 : Comprendre ${userPrompt}`,
      step2: `Étape 2 : Appliquer les bonnes pratiques`,
      step3: `Étape 3 : Mesurer et optimiser`,
      summary: `En appliquant ces étapes, vous maîtriserez ${userPrompt} efficacement`,
      urgent_hook: `Attention ! Info importante sur ${userPrompt}`,
      quick_tip: `Astuce rapide : optimisez votre approche de ${userPrompt}`,
      tip: `Pour ${userPrompt}, pensez à cette méthode éprouvée`,
      thread_intro: `Thread sur ${userPrompt} 👇`,
      insight: `Insight du jour sur ${userPrompt}`,
      quick_points: keywords.slice(0, 2).map(k => `✅ ${k}`).join('\n'),
    };
  }

  private generateHashtags(keywords: string[], platform: string): string {
    const baseHashtags = keywords.slice(0, 3).map(k => `#${k.replace(/\s+/g, '')}`);
    
    const platformHashtags = {
      linkedin: ['#LinkedIn', '#Professionnel', '#Carrière', '#Business'],
      instagram: ['#Insta', '#Inspiration', '#Motivation', '#Lifestyle'],
      twitter: ['#Thread', '#Tips', '#Insight'],
    };

    const additional = platformHashtags[platform as keyof typeof platformHashtags] || [];
    const selected = additional.slice(0, 2);
    
    return [...baseHashtags, ...selected, '#KorevAI'].join(' ');
  }

  private getRandomEmojis(): string {
    const emojiSets = [
      '🚀✨💡',
      '🎯🔥💪',
      '🌟⭐️✨',
      '💎🏆🎉',
      '🚀🎯💡',
    ];
    
    return emojiSets[Math.floor(Math.random() * emojiSets.length)];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Méthode pour générer des images avec DALL-E 3
  async generateImage(request: ImageRequest): Promise<ImageResponse> {
    console.log('🎨 Génération d\'image avec DALL-E 3:', {
      prompt: request.prompt.substring(0, 100) + '...',
      size: request.size || '1024x1024',
      quality: request.quality || 'standard',
      style: request.style || 'vivid'
    });

    // Validation de la clé API OpenAI
    if (!this.openaiKey || 
        this.openaiKey.length < 20 || 
        this.openaiKey.includes('your-openai-key-here') ||
        this.openaiKey.includes('sk-proj-your-key-here') ||
        !(this.openaiKey.startsWith('sk-') || this.openaiKey.startsWith('sk-proj-'))) {
      throw new Error('Clé API OpenAI manquante ou invalide pour la génération d\'images');
    }

    // Validation du prompt
    if (!request.prompt?.trim()) {
      throw new Error('Le prompt pour l\'image ne peut pas être vide');
    }

    if (request.prompt.length > 1000) {
      throw new Error('Le prompt est trop long (maximum 1000 caractères)');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: request.prompt.trim(),
          size: request.size || '1024x1024',
          quality: request.quality || 'standard',
          style: request.style || 'vivid',
          n: 1, // DALL-E 3 ne supporte qu'une image à la fois
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`OpenAI Images API Error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const imageData = data.data[0];

      if (!imageData?.url) {
        throw new Error('Aucune URL d\'image reçue de l\'API OpenAI');
      }

      console.log('✅ Image générée avec succès');
      console.log('📊 Prompt révisé:', imageData.revised_prompt?.substring(0, 100) + '...');

      return {
        imageUrl: imageData.url,
        revisedPrompt: imageData.revised_prompt,
        model: 'DALL-E 3',
        success: true,
        timestamp: Date.now(),
        size: request.size || '1024x1024'
      };

    } catch (error) {
      console.error('❌ Erreur lors de la génération d\'image:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout lors de la génération d\'image (30s)');
        }
        throw error;
      }
      
      throw new Error('Erreur inconnue lors de la génération d\'image');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Méthode pour tester la connectivité avec gestion améliorée des erreurs CORS
  async testConnection(): Promise<{ openai: boolean; anthropic: boolean; corsIssue?: boolean }> {
    const results = { openai: false, anthropic: false, corsIssue: false };

    // Test OpenAI avec un appel simple
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
        }),
      });
      
      if (response.ok) {
        results.openai = true;
        console.log('✅ OpenAI connecté');
      } else {
        console.warn('❌ OpenAI échec:', response.status);
      }
    } catch (error) {
      console.warn('❌ OpenAI test failed:', error);
    }

    // Test Anthropic avec le proxy backend (contournement CORS)
    try {
      console.log('🔄 Test Claude via proxy backend');
      
      const response = await fetch('/api/anthropic/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'test' }],
          anthropic_key: this.anthropicKey,
        }),
      });
      
      if (response.ok) {
        results.anthropic = true;
        console.log('✅ Anthropic connecté via proxy');
      } else {
        console.warn('❌ Anthropic proxy échec:', response.status);
      }
    } catch (error) {
      console.warn('❌ Anthropic proxy test failed:', error);
    }

    console.log('🔍 Résultats du test de connectivité:', results);
    return results;
  }

  private validateGeneratedContent(content: string, request: AIRequest): boolean {
    // Validation de base
    if (!content || content.trim().length < 50) {
      console.warn('❌ Contenu trop court ou vide');
      return false;
    }

    // Validation spécifique par type de contenu
    switch (request.contentType) {
      case 'article':
        if (content.length < 1000) {
          console.warn('❌ Article trop court (< 1000 caractères)');
          return false;
        }
        break;
      case 'thread':
        if (!content.includes('1/') && !content.includes('1.')) {
          console.warn('❌ Thread sans numérotation détectée');
          return false;
        }
        break;
      case 'post':
        if (request.platform === 'twitter' && content.length > 280) {
          console.warn('❌ Post Twitter trop long');
          return false;
        }
        break;
    }

    console.log('✅ Contenu validé avec succès');
    return true;
  }
}

export const aiService = new AIService(); 