# Parcours de démonstration

Scénario de démonstration de Kora Digital Pilot pour une présentation à un évaluateur externe. Durée cible : 12 à 15 minutes. Toutes les étapes se déroulent localement après `npm run dev:full`.

## Prérequis

- `.env.local` configuré avec une clé Perplexity valide et, idéalement, une application LinkedIn configurée.
- Application lancée via `npm run dev:full`, accessible sur `http://localhost:8088`.

## Étape 1 — Page d'accueil publique

URL : `/`.

Présentation du positionnement produit : plateforme interne Korev AI de communication digitale, brand intelligence, planning éditorial et analytics. Pas d'inscription requise pour la démo.

## Étape 2 — Entrée dans l'application

URL : `/app`.

Survol rapide de la coque applicative : sidebar de navigation à gauche (10 sections), header en haut, zone de contenu principal. Mention du fait que tout l'état applicatif est local au navigateur.

## Étape 3 — Vue d'ensemble (Dashboard)

Section : `dashboard`.

Présentation du cockpit consolidé : portée totale, taux d'engagement, clics et publications récentes par plateforme. Mettre en avant le mode TV pour affichage en open space. Préciser à l'évaluateur que les chiffres affichés pour Instagram et X sont des valeurs d'illustration aujourd'hui, et que la métrique LinkedIn est issue de l'API quand le token est présent.

## Étape 4 — Authentification LinkedIn

Section : header → bouton de connexion LinkedIn.

Déclenchement du flow OAuth (OpenID Connect) qui passe par `/auth/linkedin/callback`. Une fois connecté, le profil et les métriques LinkedIn alimentent le widget du dashboard et la section Analytics. Le token est stocké en `localStorage`.

## Étape 5 — Veille de marque (Brand Monitoring)

Section : `brand-monitoring`.

Saisie d'une marque cible (par exemple un concurrent identifié). Lancement d'une analyse Perplexity. Présenter en direct : analyse objective, actions récentes typées, analyse stratégique, SWOT, alertes, recommandations. Insister sur la traçabilité (sources, score de confiance, fraîcheur des données).

## Étape 6 — Brand Intelligence TDD

Section : `brand-intelligence-tdd`.

Présentation de la variante enrichie, construite sous discipline TDD. Lancement sur la même marque pour montrer la mise en forme et la structure du rapport (métriques quantifiées, KPIs réputation, recommandations actionnables avec impact estimé et timeline). Mentionner la couverture de tests sur le service métier `RealBrandIntelligenceService`.

## Étape 7 — Génération de contenu IA

Section : `inspiration` puis `images`.

Saisir une thématique éditoriale et générer des idées d'articles avec `InspirationAI`. Basculer ensuite sur `images` pour produire une illustration. Souligner que le projet supporte plusieurs fournisseurs (OpenAI, Anthropic) via `useHybridAI`.

## Étape 8 — Planning éditorial

Section : `planning`.

Création d'un post planifié sur la base d'une idée générée à l'étape 7. Visualisation en calendrier hebdomadaire. Modification d'une date, changement de plateforme, sauvegarde automatique en `localStorage`.

## Étape 9 — Analytics détaillés

Section : `analytics`.

Présentation des courbes de tendance par plateforme (recharts), comparatif périodique, drill-down LinkedIn (données réelles via l'API). Préciser qu'un audit chiffre par chiffre est en cours pour distinguer les sources réelles des illustrations.

## Étape 10 — Bibliothèque et exports

Section : `library`.

Récupération du rapport Perplexity généré à l'étape 5. Lancement d'un export PDF depuis la bibliothèque, démonstration de la mise en page premium (`src/lib/pdf-exporter.ts`). Exportation alternative au format Excel/CSV. Présentation de l'historique d'exports persisté en `localStorage`.

## Étape de clôture (optionnelle) — Diagnostic et protections

Sections : `/diagnostic`, widgets `ApiHealthDashboard` et `GlobalApiBlockerStatus` dans la vue d'ensemble.

Montrer l'instrumentation des appels d'API tiers : santé du proxy, statistiques d'usage Perplexity, plafonds anti-spam, capacité de reset manuel. Justifie la robustesse opérationnelle de l'application en cas d'incident tiers.

---

Dernière mise à jour : 2026-05-21.
