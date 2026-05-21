# Catalogue fonctionnel

Description des sections applicatives de Kora Digital Pilot. Toutes les sections sont accessibles depuis la coque `/app` via la `Sidebar`.

> Convention d'annotation des données ci-dessous :
>
> - **Données : réelles** — la vue n'expose que des données issues d'une API
>   tierce ou d'un saisi utilisateur.
> - **Données : démo** — la vue n'expose que des données simulées
>   (centralisées dans `src/lib/demo-data.ts`). Le mode démo doit être
>   explicitement activé via `VITE_DATA_MODE=demo` ; sinon un `EmptyState`
>   s'affiche.
> - **Données : hybride** — la vue mélange une source réelle (généralement
>   LinkedIn ou Perplexity) avec des données simulées pour les plateformes
>   non connectées. La distinction est visible à l'écran via badges
>   « Données réelles » (vert) / « Données simulées » (amber).

## 1. Vue d'ensemble (`dashboard`)

Composant principal : `src/components/Dashboard.tsx`.

Cockpit synthétique multi-plateforme (LinkedIn, Instagram, X). Présente la portée totale, le taux d'engagement global et les clics consolidés, accompagnés de la liste des publications récentes et d'un widget LinkedIn temps réel. Inclut un mode TV pour affichage en open space.

**Données : hybride** — Le widget LinkedIn est branché sur l'API réelle si le token est présent. Toutes les autres métriques (Instagram, X, totaux agrégés, suggestions IA dérivées) sont simulées via `DEMO_DASHBOARD_PLATFORMS` / `DEMO_AGGREGATE_KPIS` (`src/lib/demo-data.ts`) et affichées uniquement quand `VITE_DATA_MODE=demo`. En mode réel, ces blocs sont remplacés par un `EmptyState` « Non connecté ». Voir `DATA_MODEL.md` §4.

## 2. Community Manager — Dashboard (`cm-dashboard`)

Composant principal : `src/components/CommunityManagerDashboard.tsx`.

Espace de pilotage pour le community manager : suivi des publications planifiées, interactions, taux de réponse, alertes opérationnelles. Conçu pour un usage quotidien (vérification rapide en début et fin de journée).

**Données : réelles** — Les 4 axes (Tendances IA, Améliorations contenu, Top trending, Veille marque) sont alimentés exclusivement par l'API Perplexity. Aucune donnée n'est affichée tant qu'aucun scan n'a été lancé.

## 3. Community Manager — Recherche par domaine (`cm-domain-search`)

Composant principal : `src/components/CommunityManagerDomainDashboard.tsx`.

Recherche orientée domaine d'activité. L'utilisateur saisit un secteur ou une thématique et obtient une cartographie des acteurs, des tendances et des opportunités éditoriales. S'appuie sur Perplexity pour l'enrichissement et la qualification des résultats.

**Données : réelles** — Recherche exclusivement Perplexity. Aucune donnée hardcodée.

## 4. Veille de marque (`brand-monitoring`)

Composant principal : `src/components/BrandMonitoring.tsx` (≈1390 lignes).

Module historique de veille de marque. Permet de lancer une analyse complète sur un nom de marque (objectif, actions récentes, analyse stratégique, signaux faibles, SWOT, alertes, recommandations). Restitue un rapport long format consultable et exportable. Sécurisé par le mécanisme de protection anti-spam Perplexity.

Services sollicités : `RealBrandIntelligenceService`, `perplexity-service`, `BrandIntelligenceOrchestrator`.

**Données : hybride** — Analyse réelle via Perplexity quand la clé est configurée. Fallback démonstration `mockBrandReport` / `createDemoReport` clairement étiqueté `(Démo)` ou `(Test)` dans le nom de marque affiché.

## 5. Brand Intelligence TDD (`brand-intelligence-tdd`)

Composant principal : `src/components/enhanced/BrandIntelligenceDashboard.tsx` (≈1230 lignes).

Variante enrichie de la veille de marque, construite sous discipline TDD avec couverture unitaire. Présente :

- Analyse objective : histoire, position marché, santé financière.
- Actions récentes typées (lancement, partenariat, acquisition, crise, régulation).
- Métriques quantifiées : SWOT, contenu, concurrence, KPIs réputation.
- Recommandations actionnables avec impact estimé et timeline.
- Alertes catégorisées (critical / warning / info / opportunities).
- Score de confiance et indicateur de fraîcheur des données.

**Données : hybride** — Connecté à Perplexity en production ; fallback simulé si la clé n'est pas fournie. Le score de confiance et la fraîcheur des données sont restitués dans l'UI.

## 6. Inspiration IA (`inspiration`)

Composant principal : `src/components/InspirationAI.tsx`.

Générateur d'idées éditoriales contextualisées. À partir d'un sujet, l'utilisateur obtient une liste de pistes (formats, angles, accroches), assistée par les hooks `useAI` / `useHybridAI` (OpenAI / Anthropic).

**Données : réelles** — Génération exclusivement via OpenAI / Anthropic. Aucun contenu hardcodé.

## 7. Génération d'images (`images`)

Composant principal : `src/components/ImageGenerator.tsx`.

Génération d'illustrations à partir de prompts. Téléchargement local avec nommage `kora-*.png`. Une chartre visuelle est documentée séparément (intégrée dans la section démo).

**Données : réelles** — Génération via API. Aucun visuel d'illustration hardcodé.

## 8. Planning éditorial (`planning`)

Composant principal : `src/components/PlanningWithPerplexity.tsx`. Service : `src/lib/planning-service.ts`.

Calendrier éditorial multi-semaines. Permet de saisir, planifier et catégoriser des posts par plateforme. Persistance via `localStorage` (`kora_planning_data`, `kora_weekly_plans`). Intègre des recommandations d'optimisation basées sur Perplexity.

**Données : réelles** — Posts saisis par l'utilisateur ; recommandations issues de Perplexity. Quelques suggestions d'optimisation textuelles statiques subsistent dans `Planning.tsx` (encarts « Optimiser les horaires » / « Contenu tendance ») et sont à brancher sur Perplexity dans une itération suivante (suivi : `TECH_DEBT.md`).

## 9. Analytics (`analytics`)

Composant principal : `src/components/Analytics.tsx` (≈1180 lignes).

Tableau de bord d'analyse détaillé : portée par plateforme, engagement, clics, comparatif périodique, courbes de tendance. Inclut un widget LinkedIn avancé (`useLinkedInAnalytics`).

**Données : hybride** — LinkedIn temps réel via OAuth (badge `Données réelles` vert) ; Instagram et X (Twitter) en `Données simulées` (badge amber) uniquement en mode démo, sinon `EmptyState` « Non connecté » en mode réel. Le rapport IA généré et la stratégie optimisée s'appuient sur OpenAI/Anthropic, à partir des chiffres affichés (donc cohérents avec le mode actif).

## 10. Bibliothèque (`library`)

Composant principal : `src/components/Library.tsx`.

Espace de capitalisation : enregistrement des rapports Perplexity générés, des analyses de marque, des templates de contenu, des exports. Catalogue navigable et consultable, exportable au format PDF.

**Données : démo** — Le catalogue par défaut (4 posts d'exemple, statistiques 24/18/4/2) provient de `DEMO_LIBRARY_ITEMS` / `DEMO_LIBRARY_STATS` (`src/lib/demo-data.ts`) et n'est affiché qu'en mode démo. En mode réel, la liste est vide et un `EmptyState` invite l'utilisateur à enregistrer ses propres rapports. La persistance réelle (rapports Perplexity, exports) reste branchée sur `localStorage` et n'est pas affectée par le mode.

## 11. Modules transverses

- **Réglages (`/settings`)** : configuration des clés API (Perplexity, OpenAI, Anthropic, LinkedIn) et des préférences utilisateur.
- **Banc de tests (`/test-api`)** : sondes manuelles vers les services tiers.
- **Diagnostic (`/diagnostic`)** : état des connecteurs (proxy, LinkedIn, Perplexity).
- **Callback OAuth LinkedIn (`/auth/linkedin/callback`)** : finalisation du flow OpenID Connect.
- **Protections API** : `APIUsageProtection.tsx`, `ApiHealthDashboard.tsx`, `ApiSpamController.tsx`, `GlobalApiBlockerStatus.tsx` — pilotage des garde-fous anti-spam (voir `SECURITY.md`).
- **Exports** : `src/services/export/` regroupe l'orchestration et l'historisation des exports (PDF via `src/lib/pdf-exporter.ts`, ≈1640 lignes).

---

Dernière mise à jour : 2026-05-21.
