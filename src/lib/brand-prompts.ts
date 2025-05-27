// Configuration des prompts premium pour le branding Kora
export const BRAND_CONFIG = {
  // Couleurs de marque
  colors: {
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    accent: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500'
  },
  
  // Identité visuelle
  identity: {
    style: 'ultra-réaliste',
    quality: 'premium',
    atmosphere: 'sophistiquée',
    tone: 'professionnel mais accessible'
  }
};

// Éléments techniques pour la qualité premium
export const TECHNICAL_SPECS = {
  cameras: [
    'Canon EOS R5',
    'Sony A7R IV', 
    'Leica Q2',
    'Nikon Z9',
    'Fujifilm GFX 100S'
  ],
  
  lenses: [
    'objectif 85mm',
    'objectif 50mm',
    'objectif 24-70mm',
    'objectif grand angle',
    'objectif moyen format'
  ],
  
  lighting: [
    'éclairage naturel',
    'configuration d\'éclairage professionnel',
    'éclairage cinématographique',
    'lumière naturelle douce',
    'éclairage architectural',
    'éclairage heure dorée'
  ],
  
  quality: [
    'photographie ultra-réaliste',
    'ultra-haute résolution',
    'photographie professionnelle',
    'qualité cinématographique',
    'qualité premium',
    'faible profondeur de champ'
  ]
};

// Environnements premium par catégorie
export const PREMIUM_ENVIRONMENTS = {
  business: [
    'salle de conférence moderne en verre',
    'bureau de startup sophistiqué',
    'environnement d\'affaires de luxe',
    'espace de coworking premium',
    'salle de conseil exécutif',
    'espace de bureau contemporain',
    'siège social corporatif haut de gamme'
  ],
  
  tech: [
    'laboratoire de recherche IA futuriste',
    'centre de données moderne',
    'atelier d\'innovation',
    'bureau de startup high-tech',
    'laboratoire de pointe',
    'centre de transformation numérique',
    'environnement de bureau intelligent'
  ],
  
  lifestyle: [
    'bureau à domicile de luxe',
    'café premium',
    'restaurant haut de gamme',
    'espace de coworking moderne',
    'salon sophistiqué',
    'espace de travail élégant',
    'environnement social premium'
  ],
  
  creative: [
    'espace studio moderne',
    'bureau d\'agence créative',
    'espace de design thinking',
    'laboratoire d\'innovation',
    'espace de travail artistique',
    'galerie contemporaine',
    'environnement créatif premium'
  ]
};

// Atmosphères et styles premium
export const PREMIUM_ATMOSPHERES = {
  corporate: [
    'élégance corporative',
    'atmosphère sophistiquée',
    'esthétique business premium',
    'environnement professionnel',
    'cadre de luxe',
    'présence exécutive',
    'style corporatif moderne'
  ],
  
  innovative: [
    'atmosphère high-tech',
    'environnement futuriste',
    'technologie de pointe',
    'axé sur l\'innovation',
    'cadre tech-forward',
    'transformation numérique',
    'espace de travail nouvelle génération'
  ],
  
  lifestyle: [
    'lifestyle sophistiqué',
    'environnement social premium',
    'atmosphère élégante',
    'cadre raffiné',
    'environnement haut de gamme',
    'lifestyle de luxe',
    'élégance contemporaine'
  ],
  
  creative: [
    'atmosphère artistique',
    'leadership créatif',
    'pensée innovante',
    'environnement axé design',
    'excellence créative',
    'sophistication artistique',
    'espace créatif premium'
  ]
};

// Sujets humains premium
export const PREMIUM_SUBJECTS = {
  business: [
    'équipe diversifiée de dirigeants',
    'leader d\'entreprise confiant',
    'réunion d\'équipe professionnelle',
    'présentation exécutive',
    'professionnels d\'affaires',
    'leadership corporatif',
    'session de planification stratégique'
  ],
  
  tech: [
    'équipe tech innovante',
    'chercheurs en IA',
    'développeurs logiciels',
    'data scientists',
    'entrepreneurs tech',
    'innovateurs numériques',
    'professionnels de la technologie'
  ],
  
  lifestyle: [
    'jeunes professionnels',
    'travailleurs à distance',
    'professionnels en networking',
    'entrepreneurs lifestyle',
    'professionnels modernes',
    'nomades numériques',
    'main-d\'œuvre contemporaine'
  ],
  
  creative: [
    'professionnels créatifs',
    'équipe de design',
    'directeurs artistiques',
    'leadership créatif',
    'designers innovants',
    'stratèges créatifs',
    'professionnels artistiques'
  ]
};

// Fonction pour générer un prompt optimisé pour la marque
export function optimizePromptForBrand(basePrompt: string, category: keyof typeof PREMIUM_ENVIRONMENTS = 'business'): string {
  const randomCamera = TECHNICAL_SPECS.cameras[Math.floor(Math.random() * TECHNICAL_SPECS.cameras.length)];
  const randomLens = TECHNICAL_SPECS.lenses[Math.floor(Math.random() * TECHNICAL_SPECS.lenses.length)];
  const randomLighting = TECHNICAL_SPECS.lighting[Math.floor(Math.random() * TECHNICAL_SPECS.lighting.length)];
  const randomQuality = TECHNICAL_SPECS.quality[Math.floor(Math.random() * TECHNICAL_SPECS.quality.length)];
  const randomAtmosphere = PREMIUM_ATMOSPHERES.corporate[Math.floor(Math.random() * PREMIUM_ATMOSPHERES.corporate.length)];
  
  return `${basePrompt}, ${randomQuality}, prise avec ${randomCamera}, ${randomLens}, ${randomLighting}, ${randomAtmosphere}`;
}

// Fonction pour générer un prompt complet premium
export function generatePremiumPrompt(
  subject: string,
  environment: string,
  category: keyof typeof PREMIUM_ENVIRONMENTS = 'business'
): string {
  const camera = TECHNICAL_SPECS.cameras[Math.floor(Math.random() * TECHNICAL_SPECS.cameras.length)];
  const lighting = TECHNICAL_SPECS.lighting[Math.floor(Math.random() * TECHNICAL_SPECS.lighting.length)];
  const quality = TECHNICAL_SPECS.quality[0]; // Toujours ultra-réaliste
  const atmosphere = PREMIUM_ATMOSPHERES[category === 'business' ? 'corporate' : category][0];
  
  return `${subject} dans ${environment}, ${lighting}, ${quality}, prise avec ${camera}, ${atmosphere}`;
}

// Templates de prompts par secteur d'activité
export const INDUSTRY_TEMPLATES = {
  consulting: {
    name: "Conseil & Stratégie",
    prompts: [
      "Réunion de conseil stratégique dans une salle de conseil premium, équipe diversifiée de consultants présentant aux dirigeants, éclairage naturel, photographie ultra-réaliste, prise avec Canon EOS R5, élégance corporative",
      "Consultant en management travaillant avec visualisations de données sur plusieurs écrans, environnement de bureau moderne, éclairage professionnel, ultra-haute résolution, atmosphère sophistiquée"
    ]
  },
  
  fintech: {
    name: "FinTech & Finance",
    prompts: [
      "Équipe de technologie financière analysant données de marché dans une salle de trading moderne, plusieurs moniteurs avec graphiques, éclairage naturel, photographie ultra-réaliste, prise avec Sony A7R IV, atmosphère high-tech",
      "Bureau de startup fintech avec visualisations de cryptomonnaie et blockchain, jeunes professionnels collaborant, éclairage cinématographique, qualité premium, environnement innovant"
    ]
  },
  
  healthcare: {
    name: "Santé & MedTech",
    prompts: [
      "Professionnels de technologie médicale dans un établissement de santé moderne, équipement médical avancé, éclairage naturel, photographie ultra-réaliste, prise avec Leica Q2, environnement médical professionnel",
      "Configuration de consultation de télémédecine avec équipement high-tech, professionnels de santé, éclairage doux, qualité premium, atmosphère médicale sophistiquée"
    ]
  },
  
  education: {
    name: "EdTech & Formation",
    prompts: [
      "Atelier de technologie éducative avec écrans interactifs, groupe diversifié d'éducateurs et étudiants, éclairage naturel, photographie ultra-réaliste, prise avec Canon EOS R5, environnement d'apprentissage innovant",
      "Équipe de développement de plateforme d'apprentissage en ligne, bureau moderne avec contenu éducatif sur écrans, éclairage professionnel, qualité premium, cadre éducatif tech-forward"
    ]
  },
  
  retail: {
    name: "Retail & E-commerce",
    prompts: [
      "Équipe e-commerce analysant données clients et métriques de vente, siège social retail moderne, éclairage naturel, photographie ultra-réaliste, prise avec Sony A7R IV, environnement retail premium",
      "Professionnels de technologie retail travaillant sur solutions omnicanal, espace de bureau contemporain, éclairage professionnel, ultra-haute résolution, atmosphère retail sophistiquée"
    ]
  }
};

// Fonction pour obtenir des prompts par secteur
export function getIndustryPrompts(industry: keyof typeof INDUSTRY_TEMPLATES): string[] {
  return INDUSTRY_TEMPLATES[industry]?.prompts || [];
}

// Validation des prompts pour la cohérence de marque
export function validateBrandConsistency(prompt: string): {
  isValid: boolean;
  suggestions: string[];
  score: number;
} {
  const requiredElements = [
    'ultra-réaliste',
    'professionnel',
    'éclairage naturel',
    'premium',
    'sophistiqué'
  ];
  
  const presentElements = requiredElements.filter(element => 
    prompt.toLowerCase().includes(element.toLowerCase())
  );
  
  const score = (presentElements.length / requiredElements.length) * 100;
  const isValid = score >= 60; // Au moins 60% des éléments requis
  
  const suggestions = requiredElements
    .filter(element => !prompt.toLowerCase().includes(element.toLowerCase()))
    .map(element => `Ajouter "${element}" pour améliorer la cohérence de marque`);
  
  return {
    isValid,
    suggestions,
    score
  };
}

// Export des constantes principales
export const BRAND_KEYWORDS = {
  quality: TECHNICAL_SPECS.quality,
  lighting: TECHNICAL_SPECS.lighting,
  atmospheres: PREMIUM_ATMOSPHERES,
  environments: PREMIUM_ENVIRONMENTS
};

export default {
  BRAND_CONFIG,
  TECHNICAL_SPECS,
  PREMIUM_ENVIRONMENTS,
  PREMIUM_ATMOSPHERES,
  PREMIUM_SUBJECTS,
  optimizePromptForBrand,
  generatePremiumPrompt,
  validateBrandConsistency,
  INDUSTRY_TEMPLATES,
  getIndustryPrompts
}; 