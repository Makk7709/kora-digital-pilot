# Documentation Technique Standardisée — Kora Digital Pilot

## 1. Identification du projet

- **Nom du projet** : Kora Digital Pilot (dénomination interne « Kora », package npm `vite_react_shadcn_ts`, voir [`package.json`](../../package.json)).
- **Type de projet** : application web interne (Single Page Application) adossée à un proxy Node.js minimal pour les appels nécessitant un secret serveur.
- **Domaine d'application** : communication digitale, brand intelligence, veille concurrentielle, analytics LinkedIn, planning éditorial multi-plateformes, génération de contenu assistée par IA.
- **Statut observé** : pré-stable, version déclarée `0.0.0` dans [`package.json`](../../package.json) (le [`CHANGELOG.md`](../../CHANGELOG.md) propose `0.1.0` non encore aligné). Tags Git présents : `v1.0.0`, `v1.1.0`, `pre-quickwins-snapshot`, `pre-docs-cleanup-snapshot`, `pre-merge-snapshot`, `valuation-prep-merged`.
- **Langage principal** : TypeScript ~5.6 côté SPA, JavaScript (CommonJS, Node) côté proxy.
- **Frameworks principaux** : Vite 5.4, React 18.3, Tailwind CSS 3.4, shadcn/ui (Radix UI), React Router DOM 6.28, TanStack React Query 5.56, React Hook Form, Zod, Vitest 2.1, Express 4.21.
- **Date de génération** : 2026-05-21.
- **Périmètre audité** : commit `f55b91d` sur la branche `main`, tag `valuation-prep-merged`. Sources `src/`, proxy `server.cjs`, configuration racine, documentation `docs/`. Le contenu de `docs/archive/`, `dossier-valorisation/`, `node_modules/` et `dist/` n'est référencé qu'en tant qu'artefact, pas analysé ligne à ligne.

## 2. Résumé exécutif

Kora Digital Pilot est une plateforme interne éditée par Korev AI, à finalité de pilotage de communication digitale et de veille de marque. Le livrable observé est une SPA React/TypeScript (`src/`, 176 fichiers TypeScript/TSX pour environ 52 000 lignes y compris tests) accompagnée d'un proxy Express monofichier ([`server.cjs`](../../server.cjs), 598 lignes) qui isole les secrets serveur LinkedIn et Anthropic. L'application s'organise en dix sections fonctionnelles accessibles via une coque `/app`, couvrant dashboard, deux modules de community management, deux variantes de veille de marque, inspiration IA, génération d'images, planning éditorial, analytics et bibliothèque.

Le cœur métier est concentré dans [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (2 332 lignes, orchestration Perplexity sous discipline TDD), un orchestrateur, des sous-modules d'export (PDF, CSV, Excel, JSON) et d'intégration, ainsi que les couches transverses `src/lib/` (Perplexity, OpenAI, Anthropic, LinkedIn, planning, anti-spam, logger). Aucune base de données serveur n'est embarquée ; la persistance est intégralement portée par le `localStorage` du navigateur (clés référencées dans [`docs/DATA_MODEL.md`](../DATA_MODEL.md)).

Le niveau de maturité observé est celui d'un produit fonctionnellement avancé en usage interne, avec une dette technique inventoriée et assumée ([`docs/TECH_DEBT.md`](../TECH_DEBT.md)) : configuration TypeScript non stricte, fichiers volumineux, doublons de types et de clés `localStorage`, métriques d'illustration sur certaines vues dashboard. La sécurité a été durcie post-sprint (helmet, CSP minimale, rate limiting, suppression du tracking `.env`) mais conserve des risques résiduels documentés : tokens LinkedIn en `localStorage`, clés `VITE_*` exposées au bundle, secrets historiques à rotater côté fournisseur.

Réserve principale pour valorisation : une partie des chiffres affichés sur `Dashboard.tsx` et `Analytics.tsx` (Instagram, X) sont aujourd'hui des valeurs codées en dur d'illustration, distinguées des données réelles LinkedIn/Perplexity dans [`docs/DATA_MODEL.md`](../DATA_MODEL.md) §4.

## 3. Périmètre fonctionnel constaté

Liste établie depuis [`src/App.tsx`](../../src/App.tsx), [`src/pages/Index.tsx`](../../src/pages/Index.tsx), [`docs/FEATURES.md`](../FEATURES.md) et inspection directe des composants.

| Fonctionnalité | Statut observé | Fichiers / modules concernés | Commentaire |
|---|---|---|---|
| Landing page publique | Implémenté | [`src/pages/Landing.tsx`](../../src/pages/Landing.tsx) | Route `/`, pas d'inscription |
| Coque applicative à 10 sections | Implémenté | [`src/pages/Index.tsx`](../../src/pages/Index.tsx), [`src/components/Sidebar.tsx`](../../src/components/Sidebar.tsx) | Route `/app`, navigation par état `activeSection` |
| Dashboard multi-plateforme | Partiellement réel | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx) | Métriques Instagram et X codées en dur, widget LinkedIn réel si token présent |
| Community Manager — pilotage | Implémenté | [`src/components/CommunityManagerDashboard.tsx`](../../src/components/CommunityManagerDashboard.tsx) | Section `cm-dashboard` |
| Community Manager — recherche par domaine | Implémenté | [`src/components/CommunityManagerDomainDashboard.tsx`](../../src/components/CommunityManagerDomainDashboard.tsx) | Section `cm-domain-search`, enrichissement Perplexity |
| Veille de marque historique | Implémenté | [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) (1 393 lignes), [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) | Section `brand-monitoring`, export PDF |
| Brand Intelligence TDD | Implémenté | [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) (1 227 lignes) | Section `brand-intelligence-tdd`, couverture unitaire sur service |
| Inspiration IA | Implémenté | [`src/components/InspirationAI.tsx`](../../src/components/InspirationAI.tsx), [`src/hooks/useAI.ts`](../../src/hooks/useAI.ts), [`src/hooks/useHybridAI.ts`](../../src/hooks/useHybridAI.ts) | Section `inspiration`, OpenAI / Anthropic |
| Génération d'images | Implémenté | [`src/components/ImageGenerator.tsx`](../../src/components/ImageGenerator.tsx) | Section `images` |
| Planning éditorial | Implémenté | [`src/components/PlanningWithPerplexity.tsx`](../../src/components/PlanningWithPerplexity.tsx), [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | Section `planning`, persistance `localStorage` |
| Analytics détaillées | Partiellement réel | [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) (1 178 lignes) | LinkedIn via API si token ; autres plateformes simulées |
| Bibliothèque et exports | Implémenté | [`src/components/Library.tsx`](../../src/components/Library.tsx), [`src/services/export/`](../../src/services/export/), [`src/lib/pdf-exporter.ts`](../../src/lib/pdf-exporter.ts) (1 642 lignes) | Section `library`, formats PDF/Excel/CSV/JSON |
| Réglages utilisateur | Implémenté | [`src/pages/Settings.tsx`](../../src/pages/Settings.tsx) | Route `/settings`, configuration des clés |
| Banc de test API | Implémenté | [`src/components/TestAPI.tsx`](../../src/components/TestAPI.tsx) | Route `/test-api` |
| Diagnostic connecteurs | Implémenté | [`src/components/DiagnosticTest.tsx`](../../src/components/DiagnosticTest.tsx) | Route `/diagnostic` |
| Authentification LinkedIn OAuth/OpenID | Implémenté | [`src/components/LinkedInAuth.tsx`](../../src/components/LinkedInAuth.tsx), [`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx), [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (1 261 lignes) | Route `/auth/linkedin/callback`, proxy `/api/linkedin/*` |
| Protections anti-spam API | Implémenté | [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts), [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts), [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | Widgets `ApiHealthDashboard`, `GlobalApiBlockerStatus` |
| Mode TV dashboard | Implémenté | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx) | Affichage open space |

## 4. Architecture technique

### 4.1 Vue d'ensemble

Application client-lourd (SPA) servie en statique après build Vite, accompagnée d'un proxy Node/Express monofichier dont la seule fonction est de tenir hors du bundle les secrets serveur (LinkedIn `CLIENT_SECRET`, clé Anthropic). Architecture détaillée dans [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md).

```
Navigateur (SPA React, port 8088)
  ├── localStorage (tokens LinkedIn, planning, historiques)
  ├── appels directs --> API Perplexity
  ├── appels directs --> API OpenAI
  └── appels --> Proxy Express server.cjs (port 3001)
                  ├── --> API Anthropic
                  └── --> API LinkedIn (OAuth + Marketing)
```

### 4.2 Frontend

- Bundler : Vite 5.4 ([`vite.config.ts`](../../vite.config.ts), 362 lignes ; configuration multi-environnements DEV/STAGING/PRODUCTION, ports 8088/9088/10088, chunking manuel `vendor-react`, `vendor-ui`, `vendor-charts`, `pdf-utils`, `brand-intelligence`).
- Framework : React 18.3 + TypeScript ~5.6. Configuration TypeScript non stricte (cf. §9) — voir [`tsconfig.app.json`](../../tsconfig.app.json) et [`tsconfig.json`](../../tsconfig.json).
- Styling : Tailwind CSS 3.4 + shadcn/ui (49 primitives sous [`src/components/ui/`](../../src/components/ui/)).
- État serveur : TanStack React Query 5.56. Routage : React Router DOM 6.28. Validation : Zod 3.23, React Hook Form 7.53.
- Visualisation : Recharts 2.15. Export PDF : jsPDF 3.0.
- Internationalisation : non documentée dans le périmètre audité.

### 4.3 Backend (proxy)

- [`server.cjs`](../../server.cjs) : Express 4.21 + helmet + express-rate-limit + express-validator + cors + node-fetch + dotenv. CSP minimale paramétrée (directives `defaultSrc`, `scriptSrc`, `styleSrc`, `imgSrc`, `connectSrc` listant explicitement LinkedIn, Anthropic, OpenAI et Perplexity), limite de body 1 Mo, rate limiting global 300 requêtes/minute et limiteurs spécifiques (50/min LinkedIn token, 30/min Anthropic).
- Endpoints exposés (audités dans `server.cjs`) :
  - `POST /api/linkedin/token` — échange code OAuth contre access token.
  - `POST /api/linkedin/profile` — récupération de profil LinkedIn.
  - `POST /api/anthropic/messages` — forward authentifié vers Anthropic.
  - `GET /api/health` — sonde de disponibilité.
  - `GET /api/metrics` — métriques internes (développement).
- Le proxy n'expose aucune authentification utilisateur applicative ; il est prévu pour un usage local ou réseau privé ([`docs/SECURITY.md`](../SECURITY.md) §1).

### 4.4 Persistance

Aucune base de données serveur. Toute la persistance est sérialisée dans le `localStorage` du navigateur ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §2). Clés observées : `linkedin_access_token`, `linkedin_id_token`, `linkedin_token_expires`, `linkedin_last_sync`, `linkedin_cached_metrics`, `linkedin_oauth_state`, `kora_planning_data`, `kora_weekly_plans`, `kora_export_history`, `kora-export-history` (doublon documenté), `perplexity_protection_settings`, `perplexity_protection_history`, `perplexity_usage_stats`.

### 4.5 Intégrations externes

| Intégration | Mode d'accès | Module client | Statut |
|---|---|---|---|
| Perplexity API | Appel direct depuis bundle | [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) | Opérationnel sous clé `VITE_PERPLEXITY_API_KEY` |
| OpenAI API | Appel direct depuis bundle | [`src/lib/chatgpt-service.ts`](../../src/lib/chatgpt-service.ts), [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) | Opérationnel sous clé `VITE_OPENAI_API_KEY` |
| Anthropic API | Via proxy `/api/anthropic/messages` | [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) | Opérationnel via proxy |
| LinkedIn OAuth + API | Via proxy `/api/linkedin/*` | [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) | Opérationnel sous configuration LinkedIn Developer |

### 4.6 Authentification

- Authentification utilisateur applicative : absente. L'application est conçue pour un poste interne.
- Authentification LinkedIn (OpenID Connect) : implémentée via le proxy pour préserver le client secret ([`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx), [`src/components/LinkedInAuth.tsx`](../../src/components/LinkedInAuth.tsx)).

### 4.7 Déploiement

Pas de pipeline de déploiement de production défini dans le dépôt ([`docs/OPERATIONS.md`](../OPERATIONS.md) §7, et dette `12. Absence de pipeline de production` dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md)). Build statique manuel via `npm run build`, proxy à héberger séparément.

### 4.8 Intégration continue

Workflow unique : [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — `npm ci` puis `lint`, `typecheck`, `test:coverage`, `build`, sur Ubuntu et Node 20, avec upload d'artefact `coverage/`.

## 5. Structure du dépôt

| Chemin | Rôle identifié | Importance |
|---|---|---|
| [`src/`](../../src/) | Code source SPA (176 fichiers TS/TSX, ≈ 52 000 lignes) | Critique |
| [`src/pages/`](../../src/pages/) | Pages racines des routes (`Index`, `Landing`, `Settings`, `NotFound`) | Critique |
| [`src/components/`](../../src/components/) | Composants applicatifs (97 fichiers, ≈ 23 400 lignes) incluant dashboards, widgets, intégration LinkedIn, primitives shadcn/ui sous `ui/` | Critique |
| [`src/components/enhanced/`](../../src/components/enhanced/) | Variante TDD `BrandIntelligenceDashboard.tsx` | Critique |
| [`src/services/`](../../src/services/) | Logique métier (23 fichiers, ≈ 10 500 lignes) : `RealBrandIntelligenceService.ts`, `BrandIntelligenceOrchestrator.ts`, `ContentDeduplicationService.ts`, sous-modules `brand/`, `core/`, `export/`, `integration/` | Critique |
| [`src/lib/`](../../src/lib/) | Couches techniques transverses (13 fichiers, ≈ 5 250 lignes) : `perplexity-service.ts`, `ai-service.ts`, `linkedin-api.ts`, `pdf-exporter.ts`, `planning-service.ts`, `global-api-blocker.ts`, `perplexity-protection-middleware.ts`, `server-detection.ts`, `logger.ts` | Critique |
| [`src/hooks/`](../../src/hooks/) | Hooks React métier (9 fichiers, ≈ 3 200 lignes) : `usePerplexity`, `useHybridAI`, `useAI`, `useBusinessIntelligence`, `useLinkedInAnalytics`, `useLinkedInStats`, `usePlanning`, `use-toast`, `use-mobile` | Élevée |
| [`src/types/`](../../src/types/) | Types métier (`BrandIntelligenceTypes.ts` 720 L, `brand-analysis.ts` 105 L) | Élevée |
| [`src/test/`](../../src/test/), [`src/tests/`](../../src/tests/) | Suites Vitest (27 fichiers de test, ≈ 10 300 lignes) | Élevée |
| [`server.cjs`](../../server.cjs) | Proxy Express monofichier (598 lignes) | Critique |
| [`scripts/build-valuation-dossier.sh`](../../scripts/build-valuation-dossier.sh) | Construction reproductible du dossier de valorisation (`npm run dossier`) | Élevée |
| [`docs/`](../) | Documentation opposable canonique (9 fichiers) | Élevée |
| [`docs/archive/`](../archive/) | Historique de post-mortems, audits, refactorings, prompts de tests (86 fichiers Markdown) | Indicative |
| [`docs/audit/`](./) | Artefacts d'audit (`npm-audit.json`, présent document, notes complémentaires) | Élevée |
| [`dossier-valorisation/`](../../dossier-valorisation/) | Sortie du script de dossier de valorisation (non versionnée, gitignored) | Indicative |
| [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) | Workflow CI (lint, typecheck, tests, build, coverage) | Critique |
| [`vite.config.ts`](../../vite.config.ts) | Configuration Vite multi-environnements | Critique |
| [`vitest.config.ts`](../../vitest.config.ts) | Configuration Vitest, seuils de couverture (lines 30, functions 30, branches 25, statements 30) | Élevée |
| [`eslint.config.js`](../../eslint.config.js) | ESLint flat config 9, surcouches plugins React, hooks, refresh, prettier | Élevée |
| [`tsconfig.app.json`](../../tsconfig.app.json), [`tsconfig.json`](../../tsconfig.json) | Configuration TypeScript (strict false documenté comme dette) | Élevée |
| [`package.json`](../../package.json) | Manifeste npm (`vite_react_shadcn_ts`, `private: true`, `version: 0.0.0`) | Critique |
| [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md), [`LICENSE`](../../LICENSE) | Fichiers racine de gouvernance projet | Élevée |
| [`.env.example`](../../.env.example), [`.env.local.example`](../../.env.local.example) | Gabarits d'environnement sanitisés | Élevée |
| [`.husky/`](../../.husky/) | Hooks Git (lint-staged, commitlint, prepare) | Indicative |

## 6. Modules propriétaires identifiés

| Module | Rôle | Niveau de spécificité | Éléments valorisables | Réserve |
|---|---|---|---|---|
| [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (2 332 L) | Orchestration métier de la veille de marque (P.R.I.S.M.) : analyse objective, actions récentes typées, analyse stratégique, signaux faibles, SWOT quantifié, KPIs réputation, recommandations actionnables, alertes catégorisées, score de confiance, fraîcheur des données | Élevé — logique propriétaire au-dessus de Perplexity | Couverture TDD sur le service (cf. [`src/test/`](../../src/test/)), structure de prompts dédiée, pipeline d'extraction et de normalisation | Fichier volumineux à découper ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §3) ; dépendance à Perplexity |
| [`src/services/BrandIntelligenceOrchestrator.ts`](../../src/services/BrandIntelligenceOrchestrator.ts) | Coordination multi-étapes de l'analyse de marque | Élevé | Composition des sous-services métier | Couplage interne à expliciter |
| [`src/services/ContentDeduplicationService.ts`](../../src/services/ContentDeduplicationService.ts) | Déduplication de contenu sur les sorties IA | Élevé | Heuristiques propriétaires | À documenter plus finement |
| [`src/services/brand/`](../../src/services/brand/) (DataAggregationService, parsers, report-generator, queries, brand-analysis-orchestrator, api-service) | Sous-domaine veille de marque modulaire | Élevé | Découpage par responsabilité (parsing, agrégation, génération de rapport) | Couverture inégale |
| [`src/services/export/`](../../src/services/export/) | Orchestration des exports (PDF, Excel, CSV, JSON), historisation, métadonnées, compression, amélioration qualité | Moyen à élevé | Mise en forme premium, historique persisté | Doublon de clé `localStorage` ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §9) |
| [`src/services/integration/ReportGenerationService.ts`](../../src/services/integration/ReportGenerationService.ts) | Pont entre la veille de marque et les exports | Moyen | Format de rapport unifié | À auditer ligne à ligne |
| [`src/lib/pdf-exporter.ts`](../../src/lib/pdf-exporter.ts) (1 642 L) | Mise en page PDF premium des rapports | Élevé | Templates, styles, structure | Volume élevé à factoriser |
| [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (1 261 L) | Couche LinkedIn (OpenID, Marketing API, cache local) | Élevé | Intégration OAuth complète, hooks d'analytics et de stats | Tokens en `localStorage` (risque résiduel §8) |
| [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) (1 202 L) | Couche IA unifiée (OpenAI, Anthropic) | Moyen à élevé | Bascule entre fournisseurs, prompts internes | Volume à factoriser |
| [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) (516 L) | Couche Perplexity (requête, parsing, retries) | Élevé | Encapsulation propre du fournisseur | Dépendance fournisseur |
| [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts), [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts), [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | Protections anti-spam et détection d'incident serveur | Moyen | Plafonds configurables, backoff exponentiel, reset manuel | Implémentation côté client uniquement |
| [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | Modèle planning éditorial multi-semaines | Moyen | Persistance `localStorage` typée | Pas de synchronisation multi-postes |
| [`src/lib/logger.ts`](../../src/lib/logger.ts) | Logger centralisé (introduction récente) | Faible à moyen | Niveau configurable, base de migration depuis ≈ 546 `console.*` ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §4) | Migration en cours |
| [`src/types/BrandIntelligenceTypes.ts`](../../src/types/BrandIntelligenceTypes.ts) (720 L) | Types métier consolidés P.R.I.S.M. | Élevé | Modélisation détaillée du domaine | Coexistence avec [`src/types/brand-analysis.ts`](../../src/types/brand-analysis.ts) ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §8) |
| [`src/hooks/usePerplexity.ts`](../../src/hooks/usePerplexity.ts), [`src/hooks/useHybridAI.ts`](../../src/hooks/useHybridAI.ts), [`src/hooks/useLinkedInAnalytics.ts`](../../src/hooks/useLinkedInAnalytics.ts), [`src/hooks/useLinkedInStats.ts`](../../src/hooks/useLinkedInStats.ts), [`src/hooks/useBusinessIntelligence.ts`](../../src/hooks/useBusinessIntelligence.ts), [`src/hooks/useAI.ts`](../../src/hooks/useAI.ts), [`src/hooks/usePlanning.ts`](../../src/hooks/usePlanning.ts) | Hooks d'orchestration React | Moyen | Réutilisabilité dans la SPA | Deux erreurs `react-hooks` documentées dans [`src/hooks/usePlanning.ts`](../../src/hooks/usePlanning.ts) lignes 82/85 (cf. §9) |
| [`server.cjs`](../../server.cjs) | Proxy Express durci (helmet, CSP, rate limiting, validation clés, body limit 1 Mo) | Moyen | Isolation des secrets serveur | Pas d'authentification applicative |

## 7. Dépendances et composants externes

Inventaire détaillé dans [`docs/LICENSES.md`](../LICENSES.md). Synthèse ci-dessous.

| Dépendance | Usage observé | Criticité | Risque associé |
|---|---|---|---|
| `react` 18.3, `react-dom` 18.3 | Framework UI | Critique | Sortie de support à anticiper à long terme |
| `react-router-dom` 6.28 | Routage SPA | Critique | Mineur |
| `@tanstack/react-query` 5.56 | Cache et orchestration de requêtes | Élevée | Mineur |
| `vite` 5.4 | Bundler / dev server | Critique | Mineur |
| `typescript` ~5.6 | Typage statique | Critique | Configuration non stricte (§9) |
| `tailwindcss` 3.4, `@tailwindcss/typography` 0.5 | Styling | Élevée | Mineur |
| `@radix-ui/*` (≈ 27 paquets) | Primitives UI accessibles | Élevée | Mineur |
| `react-hook-form` 7.53, `@hookform/resolvers` 3.9, `zod` 3.23 | Formulaires + validation | Élevée | Mineur |
| `recharts` 2.15 | Visualisation Analytics | Élevée | Mineur |
| `jspdf` 3.0 | Export PDF | Élevée | Vulnérabilité critique recensée à corriger par bump majeur (cf. [`docs/audit/npm-audit.json`](./npm-audit.json)) |
| `express` 4.21, `helmet` 8.1, `express-rate-limit` 8.5, `express-validator` 7.3, `cors` 2.8, `node-fetch` 2.7 | Proxy serveur | Critique | Mineur |
| `dotenv` 16.5 | Chargement variables d'environnement | Critique | Mineur |
| `@vitejs/plugin-react` 4.3, `vitest` 2.1, `@vitest/coverage-v8` 2.1, `@vitest/ui` 2.1 | Build et tests | Élevée | Mineur |
| `@testing-library/react` 16.3, `@testing-library/jest-dom` 6.6, `@testing-library/user-event` 14.6, `jsdom` 26.1 | Tests UI | Élevée | Tests UI legacy instables (§9) |
| `eslint` 9.13, `typescript-eslint` 8.59, `eslint-plugin-react-hooks` 5, `eslint-plugin-react-refresh` 0.4, `eslint-config-prettier` 10, `prettier` 3.8 | Lint et format | Élevée | Mineur |
| `@commitlint/cli` 20.5, `@commitlint/config-conventional` 20.5, `husky` 9, `lint-staged` 15 | Hygiène Git (Conventional Commits, hooks) | Élevée | Mineur |
| `class-variance-authority` 0.7, `clsx` 2.1, `tailwind-merge` 2.5 | Composition de classes UI | Moyenne | Mineur |
| `lucide-react` 0.462 | Icônes | Moyenne | Mineur |
| `date-fns` 3.6, `react-day-picker` 8.10 | Dates | Moyenne | Mineur |
| `cmdk` 1.0, `embla-carousel-react` 8.3, `input-otp` 1.2, `next-themes` 0.3, `react-resizable-panels` 2.1, `sonner` 1.5, `vaul` 0.9, `tailwindcss-animate` 1.0 | Composants/UX | Moyenne | Mineur |
| `concurrently` 9.1 | Orchestration scripts npm | Faible | Mineur |
| Plugin de tagging composant Vite (devDependency) | Outil interne d'instrumentation visuelle, non requis pour build/run | Faible | Peut être retiré sans impact fonctionnel — voir notes d'audit complémentaires |

Vulnérabilités résiduelles `npm audit` (cf. [`docs/audit/npm-audit.json`](./npm-audit.json)) : 10 au total (9 modérées + 1 critique sur `jspdf <= 4.2.0`). Le correctif requiert un bump majeur breaking non appliqué dans le périmètre.

Aucune dépendance directe sous licence copyleft forte (GPL/AGPL) identifiée. Distribution sous MIT défendable sur le périmètre direct ([`docs/LICENSES.md`](../LICENSES.md) §2.3) ; audit transitif à reconfirmer via `npx license-checker --json`.

## 8. Données, sécurité et conformité

### 8.1 Gestion des secrets

- Fichiers d'environnement : [`.env`](../../.env) (non versionné, dans `.gitignore`), [`.env.local`](../../.env.local) (local, non versionné), [`.env.example`](../../.env.example) et [`.env.local.example`](../../.env.local.example) (gabarits sanitisés, valeurs placeholder uniquement — vérification visuelle).
- Catégorisation des clés dans [`docs/SECURITY.md`](../SECURITY.md) §2.2 : les variables `VITE_*` sont injectées dans le bundle client (clés Perplexity, OpenAI, LinkedIn `CLIENT_ID` traitées comme publiques de fait) ; LinkedIn `CLIENT_SECRET` et clé Anthropic doivent rester côté proxy (dette en cours sur l'usage actuel — cf. [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §10).
- Procédure de rotation documentée ([`docs/SECURITY.md`](../SECURITY.md) §5) : génération nouvelle clé, mise à jour `.env`, redémarrage proxy / rebuild bundle, révocation ancienne clé, revue des logs fournisseur sur 7 jours.

### 8.2 Authentification et autorisations

- Pas d'authentification utilisateur applicative dans le périmètre audité (déduit de l'absence de middleware d'auth dans [`server.cjs`](../../server.cjs) et de provider de session dans [`src/App.tsx`](../../src/App.tsx)).
- Authentification LinkedIn (OpenID Connect) implémentée pour les besoins LinkedIn uniquement ([`src/components/LinkedInAuth.tsx`](../../src/components/LinkedInAuth.tsx), [`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx), endpoint proxy `/api/linkedin/token`).
- Risque résiduel signalé : pas d'authentification sur le proxy local — exploitation acceptable en local uniquement ([`docs/SECURITY.md`](../SECURITY.md) §3.2).

### 8.3 Logs et auditabilité

- Logger centralisé introduit récemment ([`src/lib/logger.ts`](../../src/lib/logger.ts)). Migration depuis ≈ 546 occurrences `console.*` listée comme dette ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §4).
- Proxy : logs HTTP minimalistes en DEV (méthode, path, statut, IP) ; pas de body loggé ([`server.cjs`](../../server.cjs) ligne 147).
- ESLint configuré pour interdire `console.log` (warning) et autoriser uniquement `console.warn` / `console.error` ([`eslint.config.js`](../../eslint.config.js) ligne 42).

### 8.4 Données personnelles

- Aucune donnée personnelle persistée côté serveur (proxy sans état, hors compteurs en mémoire pour rate limiting).
- Données stockées localement dans le navigateur ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §2) : tokens LinkedIn de l'utilisateur connecté, cache de métriques LinkedIn, planning éditorial, historiques d'exports, paramètres anti-spam.
- Pas de chiffrement applicatif du `localStorage` (risque résiduel assumé — [`docs/SECURITY.md`](../SECURITY.md) §3.5).

### 8.5 Mesures de protection en place

- Hardening proxy : `helmet` avec CSP minimale paramétrée (directives explicites listées dans [`server.cjs`](../../server.cjs) lignes 100-128), HSTS conditionnel en production, `referrerPolicy: strict-origin-when-cross-origin`, `frameAncestors: 'none'`, `objectSrc: 'none'`.
- Rate limiting : limiteur global 300 req/min sur `/api/`, 50 req/min sur `/api/linkedin/token`, 30 req/min sur `/api/anthropic/messages` ([`server.cjs`](../../server.cjs) lignes 196, 202, 301).
- Body limit : 1 Mo strict avec validation JSON ([`server.cjs`](../../server.cjs) ligne 131).
- Validation : Zod côté formulaires sensibles, validation manuelle des clés API côté proxy (`validateApiKey`, [`server.cjs`](../../server.cjs) ligne 157).
- Anti-spam côté client : `global-api-blocker`, `perplexity-protection-middleware`, `server-detection`, backoff exponentiel et déduplication dans les hooks.
- Hygiène Git : `.env` retiré du tracking, `.gitignore` durci (lignes 16-18 listant `.env`, `.env.local`, `.env.*.local`), gabarits `.env.example` / `.env.local.example` ne contiennent que des placeholders (vérification visuelle directe).

### 8.6 Risques résiduels assumés

Listés dans [`docs/SECURITY.md`](../SECURITY.md) §3 et [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §6 / §10 / §11 :

1. Tokens LinkedIn (`linkedin_access_token`, `linkedin_id_token`) stockés en `localStorage` — vulnérables à un XSS. Trajectoire cible : cookie `HttpOnly` géré côté proxy (TODO de migration également posé en commentaire en tête de [`server.cjs`](../../server.cjs) lignes 3-6).
2. Clés `VITE_*` exposées dans le bundle client (acceptable pour Perplexity / OpenAI sous rotation et plafond budgétaire ; non acceptable pour LinkedIn `CLIENT_SECRET` et Anthropic — dette à corriger).
3. Historique Git ayant porté `.env` par le passé (cf. [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §11) : la rotation des clés concernées chez les fournisseurs et la réécriture d'historique (`git filter-repo`) sont à conduire par le porteur du projet.
4. CSP applicative côté serveur statique non encore stricte en production (à finaliser au déploiement).
5. Pas de chiffrement du `localStorage`.
6. Proxy sans authentification applicative — à durcir avant exposition réseau.

### 8.7 Conformité

- RGPD : aucune affirmation de conformité ne peut être faite sur la base du périmètre audité. La plateforme ne collecte pas de données personnelles côté serveur (à confirmer en production), mais traite des tokens LinkedIn identifiants côté navigateur. Une analyse d'impact (PIA/DPIA) sera nécessaire si l'outil est exposé à plusieurs utilisateurs ou couplé à une base de données.
- AI Act : usage de fournisseurs IA tiers (OpenAI, Anthropic, Perplexity) sans collecte de données utilisateurs particulière dans le périmètre audité. La catégorisation des cas d'usage (assistance à la création de contenu, veille concurrentielle) n'a pas été formalisée — à conduire par le porteur.
- Aucune attestation de conformité externe (SOC 2, ISO 27001, etc.) n'est documentée dans le périmètre audité.

## 9. Tests, qualité et maintenabilité

### 9.1 Tests

- Framework : Vitest 2.1 + Testing Library + jsdom.
- Configuration : [`vitest.config.ts`](../../vitest.config.ts). Timeout 120 s, retries 2, environnement `jsdom`, exclusion des tests de production (`src/test/production/**`).
- 27 fichiers de test dans [`src/test/`](../../src/test/) et [`src/tests/`](../../src/tests/) (≈ 10 300 lignes).
- Seuils de couverture déclarés (Vitest) : lines 30 %, functions 30 %, branches 25 %, statements 30 % — décrits comme « réalistes pour le quickwins sprint » ([`vitest.config.ts`](../../vitest.config.ts) ligne 66).
- Statut signalé par le brief porteur : `npm run test:run` instable — tests UI legacy `BrandMonitoring.secure`, `BrandMonitoringUI`, `CompanyAnalysisWidget` hangent à 360 s ; CI rouge sur tests tant que ces tests ne sont pas corrigés. À reproduire et confirmer.

### 9.2 Lint et typecheck

- ESLint : flat config 9 ([`eslint.config.js`](../../eslint.config.js)). Résultats post-sprint (rapportés par le porteur) : 0 erreurs, 937 warnings (dette héritée — `@typescript-eslint/no-explicit-any` 302 occurrences, `no-unused-vars` ≈ 80, `no-console` ≈ 400, `no-useless-escape` 52). À l'exception de deux vraies erreurs `react-hooks` documentées dans [`src/hooks/usePlanning.ts`](../../src/hooks/usePlanning.ts) lignes 82 et 85, à reproduire et corriger.
- TypeScript : `npm run typecheck` OK ([`tsconfig.app.json`](../../tsconfig.app.json) lignes 18-24 ; `strict: false`, `noImplicitAny: false` documentés comme dette, ≈ 51 erreurs si `noImplicitAny: true`, concentrées dans `Analytics.tsx`, `Dashboard.tsx`, `BrandIntelligenceOrchestrator.ts`).

### 9.3 Dette technique structurelle

Inventoriée dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md) (14 entrées). Points saillants :

- Configuration TypeScript non stricte (§1).
- 302 occurrences `any` (§2).
- 7 fichiers > 1 000 lignes : [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) 2 332 L, [`src/lib/pdf-exporter.ts`](../../src/lib/pdf-exporter.ts) 1 642 L, [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) 1 393 L, [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) 1 261 L, [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) 1 227 L, [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) 1 202 L, [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) 1 178 L.
- ≈ 546 occurrences `console.*` (§4).
- Métriques dashboard partiellement simulées (§5).
- Doublons : deux familles de types métier (§8), deux clés `localStorage` d'historique d'export (§9).
- Absence de pipeline de production (§12).

### 9.4 Documentation existante

- 4 fichiers à la racine : [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md), plus [`LICENSE`](../../LICENSE).
- 9 fichiers canoniques sous [`docs/`](../) : [`README.md`](../README.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md), [`DATA_MODEL.md`](../DATA_MODEL.md), [`DEMO.md`](../DEMO.md), [`FEATURES.md`](../FEATURES.md), [`LICENSES.md`](../LICENSES.md), [`OPERATIONS.md`](../OPERATIONS.md), [`SECURITY.md`](../SECURITY.md), [`TECH_DEBT.md`](../TECH_DEBT.md).
- 86 fichiers Markdown archivés dans [`docs/archive/`](../archive/) (audits, incidents, refactorings, guides, prompts de tests).
- Dossier [`docs/audit/`](./) : [`npm-audit.json`](./npm-audit.json), présent document, notes complémentaires.

### 9.5 Pipeline CI / CD

- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) : `lint`, `typecheck`, `test:coverage`, `build` sur Node 20 / Ubuntu, avec upload d'artefact couverture. Job unique, déclenché sur push et PR ciblant `main`.
- Pas de workflow de déploiement de production (cf. §4.7).
- Hooks Git locaux : Husky 9 + lint-staged 15 + commitlint (Conventional Commits) — [`commitlint.config.cjs`](../../commitlint.config.cjs), [`.husky/`](../../.husky/).

## 10. Niveau de maturité estimé

| Axe | Niveau observé | Commentaire |
|---|---|---|
| Fonctionnel | Avancé | 10 sections applicatives implémentées, dont 2 modules de veille de marque avec rapports exportables, planning, analytics, génération IA |
| Technique | Avancé sur le métier, hétérogène sur l'UI | Service `RealBrandIntelligenceService` structuré et testé ; UI Dashboard / Analytics encore mixtes (données réelles et illustratives) |
| Sécurité | Renforcée post-sprint, risques résiduels documentés | Helmet + CSP + rate limit + dotenv + body limit ; tokens en `localStorage` et clés `VITE_*` exposées restent des risques connus ([`docs/SECURITY.md`](../SECURITY.md) §3) |
| Maintenabilité | À améliorer | 7 fichiers > 1 000 lignes, 937 warnings ESLint résiduels, `tsconfig` non strict, deux familles de types métier coexistantes |
| Scalabilité | Limitée par construction | Pas de base de données serveur, persistance `localStorage`, proxy monofichier sans cache ni file d'attente ; cible explicite : poste interne / réseau privé |
| Documentation | Élevée | 9 documents canoniques structurés, modèle de menaces, modèle de données, dette technique, parcours de démonstration |
| Industrialisation | Partielle | CI lint/typecheck/test/build sur Node 20 ; pas de pipeline de déploiement, tests UI legacy instables, dossier de valorisation reproductible (`npm run dossier`) |

## 11. Éléments utiles pour valorisation

- **Volume de code utile** : 176 fichiers TS/TSX sous [`src/`](../../src/) pour ≈ 52 000 lignes (dont ≈ 10 300 de tests et ≈ 23 400 de composants). Proxy serveur : 598 lignes. Configuration Vite : 362 lignes. Total mesurable opposable.
- **Complexité fonctionnelle** : 10 sections applicatives intégrées dans une seule coque, deux variantes de veille de marque (héritée + TDD), pipeline d'export multi-format (PDF, Excel, CSV, JSON) avec historisation.
- **Différenciation** : orchestration métier propriétaire au-dessus de Perplexity ([`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) 2 332 lignes), modélisation P.R.I.S.M. typée dans [`src/types/BrandIntelligenceTypes.ts`](../../src/types/BrandIntelligenceTypes.ts) (720 lignes), pipeline d'extraction et de normalisation des actions récentes typées (`product`, `partnership`, `acquisition`, `strategy`, `marketing`, `crisis`, `regulation`), score de confiance plafonné et fraîcheur des données.
- **Réutilisabilité** : composition par hooks (`usePerplexity`, `useHybridAI`, `useAI`, `useLinkedInAnalytics`, etc.), services métier découpés par sous-domaines ([`src/services/brand/`](../../src/services/brand/), [`src/services/core/`](../../src/services/core/), [`src/services/export/`](../../src/services/export/), [`src/services/integration/`](../../src/services/integration/)), primitives shadcn/ui standardisées sous [`src/components/ui/`](../../src/components/ui/) (49 fichiers).
- **Profondeur métier** : modélisation explicite SWOT + métriques contenu + métriques concurrence + KPIs réputation + recommandations actionnables + alertes catégorisées (`critical` / `warning` / `info` / `opportunities`) ; pipeline d'export PDF premium ([`src/lib/pdf-exporter.ts`](../../src/lib/pdf-exporter.ts), 1 642 lignes).
- **Propriété intellectuelle potentielle** : code et documentation libellés Korev AI ; [`LICENSE`](../../LICENSE) MIT, copyright Korev AI 2024-2026 ; modélisation P.R.I.S.M. et prompts internes propriétaires (référencés dans `src/lib/brand-prompts.ts` et le service principal).
- **Niveau d'intégration** : 4 fournisseurs externes branchés (Perplexity, OpenAI, Anthropic, LinkedIn OAuth + Marketing) avec proxy de durcissement pour les deux derniers ; pas de Supabase, pas de SGBD, dépendance externe limitée au strict nécessaire.
- **Actifs documentaires** : 9 documents canoniques cohérents, 86 documents archivés (audits, incidents, refactorings), script de génération de dossier de valorisation reproductible ([`scripts/build-valuation-dossier.sh`](../../scripts/build-valuation-dossier.sh)).
- **Tests** : 27 fichiers de tests Vitest, couverture configurée avec seuils déclarés, focus opérationnel sur les services métier.
- **Preuves d'usage** : tags Git `v1.0.0`, `v1.1.0` ; 68 commits sur `main` ; historique de versions documenté dans [`CHANGELOG.md`](../../CHANGELOG.md) ; sprint de remise à niveau matérialisé par les tags `pre-quickwins-snapshot`, `pre-docs-cleanup-snapshot`, `pre-merge-snapshot`, `valuation-prep-merged`.

## 12. Limites et points à confirmer

| Point | Pourquoi c'est à confirmer | Impact potentiel |
|---|---|---|
| Désynchronisation entre `package.json` (`version: 0.0.0`) et [`CHANGELOG.md`](../../CHANGELOG.md) qui propose `0.1.0` | Cohérence de la version publique du livrable | Faible techniquement, modéré en lisibilité pour un évaluateur externe |
| Présence de clés API en clair dans l'historique Git ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §11) | Tout secret historique doit être considéré compromis tant qu'il n'a pas été rotaté chez le fournisseur ; réécriture d'historique nécessaire | Élevé en sécurité tant que la rotation n'est pas effectuée par le porteur |
| Tests UI legacy bloquants (`BrandMonitoring.secure`, `BrandMonitoringUI`, `CompanyAnalysisWidget`) signalés comme hangeant à 360 s | À reproduire et chiffrer in situ ; CI rouge sur tests tant que non corrigés | Modéré — n'altère pas le runtime applicatif, mais bloque l'industrialisation CI |
| Deux erreurs `react-hooks` signalées dans [`src/hooks/usePlanning.ts`](../../src/hooks/usePlanning.ts) lignes 82 et 85 | À reproduire via `npm run lint` et corriger | Modéré — peut générer des bugs runtime sur le planning |
| Couverture de tests : seuils déclarés (lines 30, functions 30, branches 25, statements 30) non confirmés par exécution CI fiable | À confirmer après stabilisation des tests UI | Modéré — argumentaire de couverture difficile à opposer en l'état |
| Métriques `Dashboard.tsx` et `Analytics.tsx` Instagram / X codées en dur d'illustration ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §4) | Ces vues ne doivent pas être présentées comme source de vérité à un évaluateur externe | Modéré pour la valorisation (impact sur le narratif fonctionnel) |
| Vulnérabilité critique `jspdf <= 4.2.0` non corrigée (bump majeur breaking) | Décision produit nécessaire | Modéré en sécurité tant qu'aucun PDF n'est ouvert depuis source non maîtrisée |
| `licenses.json` transitif à régénérer ([`docs/LICENSES.md`](../LICENSES.md) §3) | Confirmation des licences indirectes | Faible — pas de copyleft fort identifié sur le périmètre direct |
| Conformité RGPD / AI Act non formalisée | Aucune analyse d'impact (PIA) documentée | Élevé en cas d'exposition multi-utilisateurs ; faible en usage poste interne |
| Adresse `security@korev.ai` annoncée comme placeholder dans [`SECURITY.md`](../../SECURITY.md) | À confirmer ou ajuster par Korev AI | Faible |
| Périmètre d'usage cible (poste interne vs SaaS multi-utilisateurs) | Détermine la sévérité des risques résiduels et le scope des évolutions sécurité | Élevé pour le dossier de valorisation |
| Pas de logs d'usage agrégés en production ; preuves d'usage limitées aux tags Git et au `CHANGELOG.md` | Une preuve d'exploitation effective serait à fournir par le porteur (traces serveur, comptes utilisateurs internes, captures, rapports générés) | Modéré — affecte la profondeur des preuves d'exploitation présentées au cabinet |
| Présence d'une devDependency de tagging composant Vite tierce non requise pour le build/run | À retirer du `package.json` et du [`vite.config.ts`](../../vite.config.ts) par le porteur si souhaité — voir notes d'audit complémentaires | Faible |

## 13. Conclusion technique

Le dépôt audité au commit `f55b91d` correspond à un produit logiciel fonctionnellement avancé, structuré autour d'un service métier de veille de marque propriétaire (≈ 2 300 lignes) construit sous discipline TDD, exposé via une coque applicative SPA en dix sections fonctionnelles et soutenu par un proxy Node minimal isolant les secrets serveur. Le périmètre couvert (≈ 52 000 lignes TypeScript dans `src/`, 27 fichiers de tests, 9 documents canoniques opposables) traduit un effort substantiel d'ingénierie produit et de documentation, cohérent avec un livrable interne mature en phase pré-stable.

La sécurité a été visiblement durcie dans la séquence finale (helmet, CSP minimale paramétrée, rate limiting multi-niveau, body limit, gestion explicite des secrets, sortie du `.env` du tracking), mais conserve des risques résiduels assumés et documentés : tokens LinkedIn en `localStorage`, clés `VITE_*` exposées dans le bundle, historique Git porteur de secrets exigeant rotation chez les fournisseurs et réécriture. Ces points sont opposables tant qu'ils sont présentés comme tels au cabinet, accompagnés d'une trajectoire de remédiation explicite ([`docs/SECURITY.md`](../SECURITY.md) §3, [`docs/TECH_DEBT.md`](../TECH_DEBT.md)).

La maturité technique est hétérogène : forte sur le cœur métier (services Perplexity, modélisation P.R.I.S.M., pipeline d'export), à consolider sur les vues consolidées Dashboard et Analytics qui mélangent encore données réelles (LinkedIn, Perplexity) et valeurs d'illustration codées en dur. Cette mixité doit être présentée explicitement à un évaluateur — la documentation interne le fait déjà ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §4) — pour distinguer le réalisé du potentiel et préserver le caractère défendable du dossier.

L'industrialisation est en cours : CI multi-étapes en place sur Node 20, hooks Git Conventional Commits, dossier de valorisation reproductible, seuils de couverture déclarés. Les chantiers résiduels (stabilisation des tests UI legacy, alignement du numéro de version, durcissement complet des secrets côté proxy, pipeline de déploiement) sont identifiés et inventoriés ; aucun n'est de nature à remettre en cause la consistance technique du livrable.

En l'état, le code et la documentation forment un ensemble exploitable pour une évaluation par un cabinet d'apport, sous réserve que le porteur (i) confirme les points listés en §12, (ii) exécute la rotation des clés historiquement exposées, et (iii) qualifie le périmètre d'usage cible (poste interne vs exposition multi-utilisateurs), dont dépend la sévérité finale des risques résiduels identifiés.
