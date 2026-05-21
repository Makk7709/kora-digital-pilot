// Prompt builders pour `RealBrandIntelligenceService`. Centralise les longues
// chaînes de requête envoyées à Perplexity afin de réduire la taille du
// service principal et faciliter une éventuelle évolution multi-langue.

export function buildObjectiveAnalysisPrompt(brandName: string): string {
  return `ANALYSE OBJECTIVE COMPLÈTE - ${brandName}

Fournis une analyse factuelle et détaillée incluant:

1. HISTOIRE DE LA MARQUE:
   - Année de fondation et fondateurs
   - Évolution historique et jalons clés
   - Transformations majeures

2. POSITION MARCHÉ ACTUELLE:
   - Secteur d'activité et segments
   - Part de marché et rang concurrentiel
   - Présence géographique

3. SANTÉ FINANCIÈRE:
   - Chiffre d'affaires récent (dernier exercice)
   - Rentabilité et croissance
   - Valorisation si publique

4. MÉTRIQUES QUANTIFIÉES:
   - Index innovation (score 0-100 basé sur brevets, R&D, lancements)
   - Score réputation (0-100 basé sur études, sondages, médias)
   - Nombre d'employés approximatif

Utilise uniquement des données vérifiables et récentes (2023-2024).
Structure ta réponse avec des sections claires et des chiffres précis.`;
}

export function buildRecentActionsPrompt(brandName: string): string {
  return `ACTIONS STRATÉGIQUES RÉCENTES - ${brandName} (6 DERNIERS MOIS)

Identifie et documente les actions stratégiques récentes avec:

1. LANCEMENTS PRODUITS/SERVICES
2. PARTENARIATS ET ACQUISITIONS
3. CHANGEMENTS STRATÉGIQUES
4. INITIATIVES MARKETING/COMMUNICATION

Pour chaque action, fournis:
- Date exacte (mois/année)
- Description précise
- Impact estimé sur l'entreprise
- Sources mentionnées

Limite aux 5 actions les plus impactantes et récentes.`;
}

export function buildStrategicAnalysisPrompt(brandName: string): string {
  return `ANALYSE STRATÉGIQUE APPROFONDIE - ${brandName}

Analyse la stratégie actuelle de l'entreprise:

1. STRATÉGIE PRINCIPALE
2. MARCHÉS CIBLES
3. MODÈLE ÉCONOMIQUE
4. DIRECTION FUTURE
5. DÉFIS ET RISQUES

Base ton analyse sur des communications officielles récentes (rapports annuels,
conférences, interviews dirigeants).`;
}

export function buildSectorIdentificationPrompt(brandName: string): string {
  return `Identifie en 2-3 mots clés le secteur d'activité principal de ${brandName} (exemples: automobile électrique, technologie logicielle, pharmaceutique, retail mode, banque numérique, etc.)`;
}

export function buildTrendsPrompt(brandName: string, sectorContext: string): string {
  return `TENDANCES ET SIGNAUX FAIBLES SECTORIELS - ${brandName}

CONTEXTE SECTORIEL: ${brandName} opère dans le secteur: ${sectorContext}

1. TENDANCES SECTORIELLES SPÉCIFIQUES (${sectorContext})
2. SIGNAUX FAIBLES SECTORIELS (${sectorContext})
3. OPPORTUNITÉS SECTORIELLES (${sectorContext})
4. MENACES DISRUPTIVES SECTORIELLES (${sectorContext})

FOCUS: Analyse uniquement les tendances pertinentes pour ${brandName} dans le contexte de ${sectorContext}.
EXCLUSION: Évite les tendances génériques business non applicables à ce secteur spécifique.
PÉRIODE: Focus sur les 12 derniers mois avec impact potentiel sur ${brandName}.`;
}

export function buildSWOTPrompt(brandName: string): string {
  return `ANALYSE SWOT QUANTIFIÉE - ${brandName}

Évalue et quantifie chaque dimension SWOT (scores 0-100):
FORCES, FAIBLESSES, OPPORTUNITÉS, MENACES.

Pour chaque élément, fournis un score 0-100 basé sur des faits documentés.`;
}

export function buildContentMetricsPrompt(brandName: string): string {
  return `ANALYSE CONTENU ET THÉMATIQUES - ${brandName}

1. DISTRIBUTION THÉMATIQUES
2. SENTIMENT PAR THÈME
3. MÉTRIQUES ENGAGEMENT
4. INFLUENCEURS CLÉS

Base ton analyse sur données publiques récentes (réseaux sociaux, médias, forums).`;
}

export function buildCompetitivePrompt(brandName: string): string {
  return `ANALYSE CONCURRENTIELLE QUANTIFIÉE - ${brandName}

Identifie d'abord le secteur d'activité de ${brandName}, puis analyse sa concurrence:

1. SECTEUR ET CONTEXTE
2. CONCURRENTS DIRECTS
3. POSITIONNEMENT COMPARATIF
4. MOUVEMENTS RÉCENTS

Fournis des données factuelles et chiffrées quand disponibles.`;
}

export function buildReputationPrompt(brandName: string): string {
  return `KPIs RÉPUTATION QUANTIFIÉS - ${brandName}

1. SCORE GLOBAL RÉPUTATION (0-100)
2. SENTIMENT PAR STAKEHOLDER
3. INDICATEURS CONFIANCE
4. RISQUES RÉPUTATIONNELS

Base ton évaluation sur données publiques mesurables et études reconnues.`;
}

export function buildRecommendationsPrompt(brandName: string): string {
  return `RECOMMANDATIONS STRATÉGIQUES ACTIONNABLES - ${brandName}

Basé sur l'analyse complète, propose 5-7 recommandations prioritaires.

Pour chaque recommandation: titre, catégorie, priorité, impact estimé, budget,
timeline, département responsable, métriques de succès.

Focus sur des actions concrètes et réalisables avec ROI mesurable.`;
}

export function buildAlertsPrompt(brandName: string): string {
  return `ALERTES INTELLIGENTES - ${brandName}

1. ALERTES CRITIQUES
2. ALERTES WARNING
3. ALERTES INFO

Pour chaque alerte: niveau urgence, action recommandée, timeline.`;
}
