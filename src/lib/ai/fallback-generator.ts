// Générateur de contenu de fallback IA (contenu déterministe quand les
// providers OpenAI/Anthropic sont indisponibles). Extrait depuis
// `ai-service.ts` pour réduire la taille du module principal.

import type { AIRequest, AIResponse } from './types';

const STOP_WORDS = [
  'le',
  'la',
  'les',
  'un',
  'une',
  'des',
  'de',
  'du',
  'et',
  'ou',
  'mais',
  'donc',
  'car',
  'ni',
  'or',
  'je',
  'veux',
  'créer',
  'faire',
  'post',
  'article',
  'thread',
  'sur',
  'pour',
  'avec',
  'dans',
  'par',
  'qui',
  'que',
  'quoi',
  'comment',
  'pourquoi',
  'où',
  'quand',
  'dont',
  'lequel',
  'laquelle',
  'ce',
  'cette',
  'ces',
  'mon',
  'ma',
  'mes',
  'ton',
  'ta',
  'tes',
  'son',
  'sa',
  'ses',
  'notre',
  'nos',
  'votre',
  'vos',
  'leur',
  'leurs',
  'à',
  'au',
  'aux',
  'en',
  'y',
];

export function extractKeywords(prompt: string): string[] {
  const cleaned = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned
    .split(' ')
    .filter((word) => word.length > 2 && !STOP_WORDS.includes(word))
    .filter((word) => !word.match(/^\d+$/));

  const importantWords = words.filter(
    (word) =>
      word.includes('ia') ||
      word.includes('ai') ||
      word.includes('startup') ||
      word.includes('start') ||
      word.includes('sart') ||
      word.includes('entreprise') ||
      word.includes('innovation') ||
      word.includes('tech') ||
      word.includes('business') ||
      word.includes('digital'),
  );

  const finalKeywords = [...importantWords, ...words.filter((w) => !importantWords.includes(w))];

  return finalKeywords.slice(0, 10);
}

export function identifyMainTopic(prompt: string, keywords: string[]): string {
  const topics: Record<string, string[]> = {
    ia: ['intelligence', 'artificielle', 'ai', 'machine', 'learning', 'algorithme'],
    business: ['entreprise', 'business', 'stratégie', 'croissance', 'vente', 'marketing'],
    tech: ['technologie', 'digital', 'innovation', 'développement', 'code', 'app'],
    social: ['réseaux', 'sociaux', 'communauté', 'engagement', 'followers'],
    productivité: ['productivité', 'efficacité', 'organisation', 'temps', 'méthode'],
    formation: ['formation', 'apprentissage', 'compétences', 'éducation', 'cours'],
  };

  for (const [topic, relatedWords] of Object.entries(topics)) {
    if (relatedWords.some((word) => prompt.toLowerCase().includes(word))) {
      return topic;
    }
  }

  return keywords[0] || 'général';
}

export function generateHashtags(keywords: string[], platform: string): string {
  const baseHashtags = keywords.slice(0, 3).map((k) => `#${k.replace(/\s+/g, '')}`);

  const platformHashtags: Record<string, string[]> = {
    linkedin: ['#LinkedIn', '#Professionnel', '#Carrière', '#Business'],
    instagram: ['#Insta', '#Inspiration', '#Motivation', '#Lifestyle'],
    twitter: ['#Thread', '#Tips', '#Insight'],
  };

  const additional = platformHashtags[platform] || [];
  const selected = additional.slice(0, 2);

  return [...baseHashtags, ...selected, '#KorevAI'].join(' ');
}

export function getRandomEmojis(): string {
  const emojiSets = ['🚀✨💡', '🎯🔥💪', '🌟⭐️✨', '💎🏆🎉', '🚀🎯💡'];
  return emojiSets[Math.floor(Math.random() * emojiSets.length)];
}

function generateArticleContent(request: AIRequest, topic: string, keywords: string[]): string {
  const userPrompt = request.prompt.trim();
  const mainKeyword = keywords[0] || topic;

  const isAboutAI =
    userPrompt.toLowerCase().includes('ia') ||
    userPrompt.toLowerCase().includes('intelligence') ||
    userPrompt.toLowerCase().includes('ai');
  const isAboutStartup =
    userPrompt.toLowerCase().includes('startup') ||
    userPrompt.toLowerCase().includes('start-up') ||
    userPrompt.toLowerCase().includes('entreprise');
  const isAboutSchool =
    userPrompt.toLowerCase().includes('école') ||
    userPrompt.toLowerCase().includes('éducation') ||
    userPrompt.toLowerCase().includes('formation');

  const toneAdaptations = {
    'Professionnel & stratégique': {
      intro: `Dans le contexte professionnel actuel, ${userPrompt} représente un enjeu stratégique majeur.`,
      style: 'analyse business approfondie',
      conclusion: 'recommandations stratégiques concrètes',
    },
    'Innovant & futuriste': {
      intro: `L'avenir se dessine aujourd'hui avec ${userPrompt}, et les innovations émergentes transforment notre vision.`,
      style: "perspective d'avant-garde",
      conclusion: 'vision prospective inspirante',
    },
    'Educatif & expert': {
      intro: `Pour bien comprendre ${userPrompt}, il est essentiel d'adopter une approche méthodique et structurée.`,
      style: 'guide pédagogique détaillé',
      conclusion: 'synthèse des apprentissages clés',
    },
    'Inspirant & visionnaire': {
      intro: `${userPrompt} ouvre des horizons extraordinaires et transforme notre façon de concevoir l'avenir.`,
      style: 'vision inspirante et motivante',
      conclusion: "appel à l'action transformateur",
    },
  } as const;

  const adaptation =
    toneAdaptations[request.tone as keyof typeof toneAdaptations] ||
    toneAdaptations['Professionnel & stratégique'];

  let specificContent = '';
  let contextualAnalysis = '';
  let recommendations = '';

  if (isAboutAI && isAboutStartup) {
    specificContent = `L'écosystème des startups IA connaît une croissance explosive en 2024. Ces jeunes entreprises révolutionnent tous les secteurs grâce à des innovations technologiques disruptives et des modèles économiques repensés.

🚀 **L'Explosion du Marché des Startups IA**

Le financement des startups IA a atteint des records historiques avec plus de 50 milliards d'euros investis mondialement.

Les secteurs les plus impactés :
• HealthTech : Diagnostic médical assisté par IA
• FinTech : Analyse prédictive et gestion des risques
• EdTech : Personnalisation de l'apprentissage
• RetailTech : Recommandations et optimisation des stocks
• AgriTech : Agriculture de précision

🎯 **Modèles d'Affaires Innovants**

**SaaS IA** : Outils en ligne accessibles aux PME sans expertise technique
**API-First** : Monétisation de l'intelligence artificielle via des interfaces programmables
**Freemium IA** : Démocratisation avec versions gratuites puis montée en gamme
**IA-as-a-Service** : Externalisation complète des besoins en intelligence artificielle`;

    contextualAnalysis = `**Défis et Opportunités des Startups IA**

1. **Talent et Recrutement** : Guerre des talents pour attirer les meilleurs profils IA
2. **Données d'Entraînement** : Accès aux datasets de qualité
3. **Réglementation** : Conformité avec l'AI Act européen
4. **Différenciation** : Se démarquer dans un marché concurrentiel
5. **Scalabilité** : Gérer la croissance tout en maintenant la performance`;

    recommendations = `**Stratégies Gagnantes pour les Startups IA**

🎯 **Pour les Entrepreneurs** : Validation marché, MVP IA, équipe hybride, financement adapté
🎯 **Pour les Investisseurs** : Due diligence technique, potentiel de marché, équipe fondatrice
🎯 **Pour les Corporates** : Veille technologique, partenariats, acquisition stratégique`;
  } else if (isAboutAI && isAboutSchool) {
    specificContent = `L'intelligence artificielle révolutionne le secteur éducatif. Les établissements scolaires qui intègrent l'IA observent des transformations remarquables.

🎯 **Impact sur l'Apprentissage**

L'IA personnalise l'expérience éducative en s'adaptant au rythme de chaque élève.

Les outils d'IA permettent aux enseignants de :
• Identifier rapidement les difficultés d'apprentissage
• Proposer des exercices adaptés au niveau de chaque élève
• Automatiser la correction et le suivi des progrès
• Créer du contenu pédagogique personnalisé`;

    contextualAnalysis = `**Défis et Opportunités**

1. **Formation des enseignants** : Accompagner les équipes pédagogiques
2. **Équité numérique** : Garantir l'accès aux outils IA pour tous
3. **Éthique et vie privée** : Protéger les données des élèves
4. **Développement de l'esprit critique** : Apprendre à utiliser l'IA de manière réfléchie`;

    recommendations = `**Recommandations pour une Intégration Réussie**

▶️ **Phase pilote** : Commencer par des projets limités
▶️ **Formation continue** : Investir dans la formation des enseignants
▶️ **Partenariats** : Collaborer avec des entreprises EdTech
▶️ **Évaluation** : Mesurer l'impact sur les résultats scolaires`;
  } else if (isAboutAI) {
    specificContent = `L'intelligence artificielle transforme radicalement notre façon de travailler, de créer et d'innover.

🚀 **Transformation des Métiers**

L'IA ne remplace pas les humains, elle augmente leurs capacités.

Les domaines les plus impactés incluent :
• Marketing et communication digitale
• Analyse de données et business intelligence
• Création de contenu et design
• Service client et support technique
• Recherche et développement`;

    contextualAnalysis = `**Enjeux Stratégiques**

1. **Compétences** : Former les équipes aux nouveaux outils
2. **Éthique** : Utiliser l'IA de manière responsable
3. **Compétitivité** : Rester à la pointe pour ne pas être distancé
4. **ROI** : Mesurer l'impact business des investissements IA`;

    recommendations = `**Stratégie d'Adoption IA**

▶️ **Audit des besoins** : Identifier les cas d'usage prioritaires
▶️ **Formation** : Développer les compétences IA en interne
▶️ **Expérimentation** : Tester rapidement sur des projets pilotes
▶️ **Scaling** : Déployer progressivement les solutions qui fonctionnent`;
  } else {
    specificContent = `${userPrompt} représente un sujet d'actualité majeur qui mérite une analyse approfondie.

🎯 **Contexte et Importance**

Cette problématique touche de nombreux acteurs et nécessite une approche structurée.

Les aspects clés à considérer :
• Impact sur les pratiques actuelles
• Opportunités de développement
• Défis à relever
• Perspectives d'évolution`;

    contextualAnalysis = `**Analyse Détaillée**

1. **Dimension stratégique** : Impact sur les objectifs à long terme
2. **Dimension opérationnelle** : Changements dans les processus quotidiens
3. **Dimension humaine** : Accompagnement des équipes
4. **Dimension technologique** : Outils et solutions à mettre en place`;

    recommendations = `**Plan d'Action Recommandé**

▶️ **Diagnostic** : Évaluer la situation actuelle et les besoins
▶️ **Stratégie** : Définir une feuille de route claire et réaliste
▶️ **Mise en œuvre** : Déployer progressivement les solutions
▶️ **Suivi** : Mesurer les résultats et ajuster si nécessaire`;
  }

  const conclusion =
    adaptation.conclusion === 'recommandations stratégiques concrètes'
      ? `En conclusion, ${userPrompt} représente un levier de transformation incontournable. Les organisations qui investissent dès maintenant prendront une avance décisive.`
      : adaptation.conclusion === 'vision prospective inspirante'
        ? `L'avenir de ${userPrompt} s'annonce révolutionnaire. Les innovations à venir transformeront notre façon de concevoir et d'utiliser ces approches.`
        : adaptation.conclusion === 'synthèse des apprentissages clés'
          ? `Retenez ces éléments essentiels : ${userPrompt} nécessite une approche méthodique, des compétences adaptées et une vision claire des objectifs.`
          : `${userPrompt} n'est pas qu'une tendance, c'est une révolution en marche. Saisissez cette opportunité.`;

  return `📖 ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)} : Analyse Complète 2024

${adaptation.intro}

${specificContent}

💡 ${contextualAnalysis}

🚀 ${recommendations}

🎯 **Conclusion**

${conclusion}

${generateHashtags([mainKeyword, ...keywords.slice(0, 3)], request.platform)}`;
}

function generateThreadContent(request: AIRequest, topic: string, keywords: string[]): string {
  const userPrompt = request.prompt.trim();
  const mainKeyword = keywords[0] || topic;

  const isAboutAI =
    userPrompt.toLowerCase().includes('ia') ||
    userPrompt.toLowerCase().includes('intelligence') ||
    userPrompt.toLowerCase().includes('ai');
  const isAboutInnovation =
    userPrompt.toLowerCase().includes('innovation') ||
    userPrompt.toLowerCase().includes('futur') ||
    userPrompt.toLowerCase().includes('2024');
  const isAboutBusiness =
    userPrompt.toLowerCase().includes('entreprise') ||
    userPrompt.toLowerCase().includes('business') ||
    userPrompt.toLowerCase().includes('stratégie');

  let threadContent = '';

  if (isAboutAI && isAboutInnovation) {
    threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Voici les innovations IA qui vont transformer 2024 👇

1/ 🚀 **IA Générative Multimodale**
Les nouveaux modèles combinent texte, image, vidéo et audio.

2/ 🎯 **IA Personnalisée pour les PME**
Outils plug-and-play, accessibles aux petites structures.

3/ 🔮 **Agents IA Autonomes**
Des assistants qui planifient, exécutent et optimisent en autonomie.

4/ 🌍 **IA Éthique et Transparente**
Investissements dans des IA explicables et respectueuses de la vie privée.

5/ ⚡ **IA Edge Computing**
Traitement local, latence réduite, confidentialité renforcée.

6/ 🎨 **Créativité Augmentée**
L'IA, co-pilote créatif des designers et marketeurs.

7/ 📊 **Prédictions Hyper-Précises**
Patterns invisibles à l'œil humain pour des prévisions inégalées.

🎯 **Conclusion** : 2024 marque l'entrée dans l'ère de l'IA démocratisée.

Quelle innovation vous excite le plus ? 👇`;
  } else if (isAboutAI) {
    threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Ce que vous devez absolument savoir 👇

1/ 🎯 **L'IA transforme tout**
${userPrompt} n'est plus de la science-fiction.

2/ 💡 **Opportunité vs Menace**
Les entreprises qui adoptent l'IA voient leurs performances augmenter de 40%.

3/ 🚀 **Par où commencer ?**
Identifiez UNE tâche répétitive dans votre quotidien.

4/ 🎓 **Formation = Clé du succès**
L'IA augmente les humains. Formez vos équipes.

5/ ⚖️ **Éthique et responsabilité**
Utilisez l'IA de manière transparente.

6/ 🔮 **Vision long terme**
${userPrompt} n'est que le début.

🎯 **Action immédiate** : Testez UN outil IA cette semaine.

Votre première expérience IA ? 👇`;
  } else if (isAboutBusiness) {
    threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Les clés du succès en 2024 👇

1/ 📊 **Données = Nouveau Pétrole**
${userPrompt} repose sur l'exploitation intelligente des données.

2/ 🎯 **Client au centre**
Personnalisez chaque interaction.

3/ 🚀 **Agilité organisationnelle**
Les entreprises qui s'adaptent rapidement survivent.

4/ 💡 **Innovation continue**
Ne suivez pas les tendances, créez-les.

5/ 🌍 **Impact sociétal**
Choisissez des marques alignées avec vos valeurs.

6/ 🤝 **Collaboration stratégique**
Partenariats gagnant-gagnant.

🎯 **Résultat** : ${userPrompt} devient un levier de croissance durable.

Quelle stratégie appliquez-vous ? 👇`;
  } else {
    threadContent = `🧵 THREAD : ${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}

Voici ce que vous devez savoir 👇

1/ 🎯 **Contexte actuel**
${userPrompt} représente un enjeu majeur.

2/ 💡 **Pourquoi maintenant ?**
Les conditions sont réunies.

3/ 🚀 **Opportunités concrètes**
${userPrompt} ouvre des perspectives inédites.

4/ ⚠️ **Défis à anticiper**
Identifiez-les maintenant.

5/ 🎓 **Compétences nécessaires**
L'investissement formation est rentable.

6/ 🔮 **Vision d'avenir**
${userPrompt} n'est que le début.

🎯 **Action** : Commencez petit, testez, apprenez, adaptez.

Votre expérience avec ${userPrompt} ? 👇`;
  }

  return `${threadContent}

${generateHashtags([mainKeyword, ...keywords.slice(0, 3)], request.platform)}`;
}

function getContentVariations(platform: string, contentType: string): string[] {
  const baseStructures = {
    linkedin: {
      post: [
        '🎯 {hook}\n\n{development}\n\n💡 Points clés :\n{points}\n\n{question}\n\n{hashtags}',
        '🚀 {hook}\n\n{story}\n\n✅ Résultats :\n{results}\n\n{cta}\n\n{hashtags}',
        '💭 {question_start}\n\n{explanation}\n\n🔑 Ma recommandation :\n{recommendation}\n\n{hashtags}',
      ],
      thread: [
        '🧵 THREAD : {title}\n\n1/ {point1}\n\n2/ {point2}\n\n3/ {point3}\n\n{conclusion}\n\n{hashtags}',
        '📚 Guide complet : {title}\n\n▶️ {step1}\n▶️ {step2}\n▶️ {step3}\n\n{summary}\n\n{hashtags}',
      ],
      article: [
        '📖 {title}\n\n{introduction}\n\n🎯 Contexte :\n{context}\n\n💡 Analyse :\n{analysis}\n\n🚀 Conclusion :\n{conclusion}\n\n{hashtags}',
      ],
    },
    instagram: {
      post: [
        '✨ {hook} ✨\n\n{content} 📸\n\n{emojis} {cta}\n\n{hashtags}',
        '🌟 {question}\n\n{answer} 💫\n\n{engagement_question}\n\n{hashtags}',
      ],
      story: [
        '🔥 {urgent_hook}\n\n{quick_tip}\n\n👆 Swipe pour plus !',
        '💡 Astuce du jour :\n\n{tip}\n\n❤️ Save si utile !',
      ],
    },
    twitter: [
      '{hook}\n\n{quick_points}\n\n{hashtags}',
      '🧵 {thread_intro}\n\n1/ {point1}\n2/ {point2}\n3/ {point3}',
      '💡 {insight}\n\n{explanation}\n\n{hashtags}',
    ],
  } as const;

  const platformStructures = baseStructures[platform as keyof typeof baseStructures] as
    | readonly string[]
    | Record<string, readonly string[]>
    | undefined;
  if (!platformStructures) return ['Contenu personnalisé pour {topic} avec un ton {tone}'];

  if (Array.isArray(platformStructures)) {
    return [...(platformStructures as readonly string[])];
  }
  const lookup = platformStructures as Record<string, readonly string[]>;
  const contentStructures = lookup[contentType];
  if (Array.isArray(contentStructures)) {
    return [...contentStructures];
  }
  const fallback = Object.values(lookup)[0];
  return Array.isArray(fallback) ? [...fallback] : [];
}

function generateContentElements(
  topic: string,
  keywords: string[],
  request: AIRequest,
): Record<string, string> {
  const randomIndex = Math.floor(Math.random() * 1000);
  const userPrompt = request.prompt.trim();

  const isAboutAI =
    userPrompt.toLowerCase().includes('ia') ||
    userPrompt.toLowerCase().includes('intelligence') ||
    userPrompt.toLowerCase().includes('ai');
  const isQuestion =
    userPrompt.includes('?') ||
    userPrompt.toLowerCase().includes('comment') ||
    userPrompt.toLowerCase().includes('pourquoi');
  const isAboutTips =
    userPrompt.toLowerCase().includes('conseil') ||
    userPrompt.toLowerCase().includes('astuce') ||
    userPrompt.toLowerCase().includes('tip');

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
    'Partagez votre expérience en commentaire !',
    "Qu'en pensez-vous ? Dites-le moi !",
    "Votre avis m'intéresse 👇",
    'À vous de jouer ! Commentez 💬',
    'Racontez-nous votre histoire !',
  ];

  let development = '';
  let explanation = '';
  let story = '';

  if (isAboutAI) {
    development = `${userPrompt} transforme radicalement notre façon de travailler.`;
    explanation = `Basé sur mon expérience avec ${userPrompt}, l'IA n'est plus l'avenir, c'est le présent.`;
    story = `Récemment, j'ai expérimenté ${userPrompt} et les résultats m'ont surpris.`;
  } else if (isQuestion) {
    development = `${userPrompt} Cette question mérite une réponse approfondie.`;
    explanation = `Pour répondre à "${userPrompt}", il faut comprendre les enjeux sous-jacents.`;
    story = `Un client m'a récemment posé cette question : "${userPrompt}".`;
  } else if (isAboutTips) {
    development = `${userPrompt} Voici des conseils pratiques testés et approuvés.`;
    explanation = `Ces astuces sur ${userPrompt} vont vous faire gagner du temps.`;
    story = `J'ai testé différentes approches pour ${userPrompt}.`;
  } else {
    development = `${userPrompt} représente un enjeu majeur. Voici pourquoi c'est important pour votre ${
      request.platform === 'linkedin' ? 'carrière professionnelle' : 'quotidien'
    }.`;
    explanation = `Mon analyse de ${userPrompt} révèle des aspects souvent négligés.`;
    story = `En travaillant sur ${userPrompt}, j'ai découvert des insights surprenants.`;
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
    points: keywords
      .slice(0, 3)
      .map((k) => `• ${k.charAt(0).toUpperCase() + k.slice(1)}`)
      .join('\n'),
    hashtags: generateHashtags(keywords, request.platform),
    content: `Focus sur ${userPrompt} aujourd'hui`,
    emojis: getRandomEmojis(),
    engagement_question: `Et vous, comment gérez-vous ${userPrompt} ?`,
    results: keywords
      .slice(0, 2)
      .map((k) => `• +50% efficacité ${k}`)
      .join('\n'),
    recommendation: `Pour ${userPrompt}, concentrez-vous sur l'action plutôt que la théorie.`,
    context: `Dans le contexte actuel, ${userPrompt} devient essentiel pour rester compétitif.`,
    analysis: `L'analyse montre que ${userPrompt} impacte directement les performances.`,
    conclusion: `En résumé, ${userPrompt} est un levier de transformation incontournable.`,
    introduction: `Parlons de ${userPrompt} et de son impact concret.`,
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
    quick_points: keywords
      .slice(0, 2)
      .map((k) => `✅ ${k}`)
      .join('\n'),
  };
}

function personalizeContent(
  template: string,
  topic: string,
  keywords: string[],
  request: AIRequest,
): string {
  const contentElements = generateContentElements(topic, keywords, request);

  let content = template;

  Object.entries(contentElements).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  content = content.replace(/{[^}]+}/g, '');

  return content.trim();
}

function generateContentByParameters(
  request: AIRequest,
  topic: string,
  keywords: string[],
  randomSeed: number,
): string {
  if (request.contentType === 'article') {
    return generateArticleContent(request, topic, keywords);
  }
  if (request.contentType === 'thread') {
    return generateThreadContent(request, topic, keywords);
  }
  const variations = getContentVariations(request.platform, request.contentType);
  const selectedVariation = variations[Math.floor(randomSeed * variations.length)];
  return personalizeContent(selectedVariation, topic, keywords, request);
}

export function generateDynamicFallback(request: AIRequest): AIResponse {
  const timestamp = Date.now();
  const randomSeed = Math.random();

  const keywords = extractKeywords(request.prompt);
  const mainTopic = identifyMainTopic(request.prompt, keywords);

  const content = generateContentByParameters(request, mainTopic, keywords, randomSeed);

  return {
    content,
    model: 'Kora Dynamic Generator',
    success: true,
    timestamp,
    platform: request.platform,
  };
}
