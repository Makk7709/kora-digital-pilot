// Construction du system prompt pour les providers IA. Extrait depuis
// `ai-service.ts` pour permettre à plusieurs clients (OpenAI, Anthropic) de
// partager la même logique sans dupliquer le module principal.

import type { AIRequest } from './types';

const PLATFORM_SPECS: Record<string, string> = {
  linkedin: 'LinkedIn (professionnel, 3000 caractères max, hashtags pertinents)',
  instagram: 'Instagram (visuel, 2200 caractères max, emojis, hashtags)',
  twitter: 'X/Twitter (concis, 280 caractères max, hashtags)',
  facebook: 'Facebook (conversationnel, 2000 caractères max)',
  tiktok: 'TikTok (viral, jeune, emojis, hashtags tendance)',
};

const CONTENT_TYPE_SPECS: Record<string, string> = {
  post: 'un post simple et engageant',
  thread: 'un thread/carrousel avec plusieurs parties numérotées',
  story: 'du contenu pour story/réels court et impactant',
  article:
    'un article long et détaillé avec structure complète (introduction, développement, conclusion)',
  carousel: 'un carrousel avec slides multiples',
  video: 'un script pour vidéo avec accroches',
};

const TONE_SPECS: Record<string, string> = {
  'Professionnel & stratégique':
    'ton professionnel, expert et stratégique avec une approche business',
  'Innovant & futuriste':
    'ton innovant, avant-gardiste et visionnaire avec une perspective futuriste',
  'Educatif & expert': 'ton pédagogique, informatif et expert avec des explications claires',
  'Inspirant & visionnaire': 'ton motivant, inspirant et aspirationnel avec une vision positive',
  professionnel: 'ton professionnel et expert',
  décontracté: 'ton décontracté et accessible',
  inspirant: 'ton motivant et inspirant',
  éducatif: 'ton pédagogique et informatif',
  humoristique: "ton léger avec touches d'humour",
  urgent: 'ton pressant et direct',
  bienveillant: 'ton chaleureux et empathique',
};

const LENGTH_SPECS: Record<string, string | ((req: AIRequest) => string)> = {
  post: (req) => (req.platform === 'twitter' ? '280 caractères maximum' : '300-800 caractères'),
  thread: '1000-2000 caractères répartis en plusieurs parties',
  story: '100-200 caractères, très concis',
  article: '1500-3000 caractères, format long et détaillé',
  carousel: '500-1000 caractères répartis en slides',
  video: '300-600 caractères pour le script',
};

export function buildSystemPrompt(request: AIRequest): string {
  const currentTime = new Date().toLocaleString('fr-FR');
  const randomSeed = Math.random().toString(36).substring(7);

  const lengthSpec = LENGTH_SPECS[request.contentType];
  const length =
    typeof lengthSpec === 'function' ? lengthSpec(request) : (lengthSpec ?? 'adapté au contexte');

  return `Tu es Kora, l'assistante IA de Korev AI, spécialisée dans la création de contenu digital premium.

MISSION CRITIQUE : Respecter EXACTEMENT les spécifications demandées.

CONTEXTE UNIQUE (${currentTime} - ${randomSeed}):
- Plateforme: ${PLATFORM_SPECS[request.platform] || request.platform}
- Type: ${CONTENT_TYPE_SPECS[request.contentType] || request.contentType}
- Ton: ${TONE_SPECS[request.tone] || request.tone}
- Longueur cible: ${length}

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
${
  request.contentType === 'article'
    ? `
- ARTICLE LONG : Structure complète avec introduction, développement en plusieurs parties, conclusion
- Minimum 1500 caractères, maximum 3000 caractères
- Inclus des sous-titres, points clés, et une conclusion actionnable
`
    : ''
}
${
  request.contentType === 'thread'
    ? `
- THREAD : Numéroter les parties (1/, 2/, 3/, etc.)
- Chaque partie doit être cohérente et engageante
- Inclure une introduction et une conclusion
`
    : ''
}
${
  request.contentType === 'post'
    ? `
- POST SIMPLE : Direct, engageant, avec un message clair
- Inclure un hook, du contenu de valeur, et un CTA
`
    : ''
}

VARIÉTÉ OBLIGATOIRE:
- Change la structure à chaque génération
- Varie les accroches et conclusions
- Alterne entre différents styles d'écriture
- Adapte la longueur selon le contexte exact

FORMAT DE RÉPONSE:
Retourne uniquement le contenu final, prêt à publier, sans commentaires additionnels ou métadonnées.`;
}
