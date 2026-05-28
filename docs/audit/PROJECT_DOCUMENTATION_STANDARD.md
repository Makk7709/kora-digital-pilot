# Documentation Technique Standardisée — Kora Digital Pilot

## 1. Identification du projet

- **Nom du projet** : Kora Digital Pilot (package npm : `kora-digital-pilot`, voir [`package.json`](../../package.json) lignes 2-7).
- **Type de projet** : application web (Single Page Application) adossée à un proxy Node Express monofichier pour l'isolation des secrets serveur et l'orchestration auth multi-tenant (scaffold).
- **Domaine d'application** : communication digitale, brand intelligence, veille concurrentielle, analytics LinkedIn, planning éditorial multi-plateformes, génération de contenu assistée par IA.
- **Statut observé** : pré-stable — `version: 0.2.0` ([`package.json`](../../package.json) ligne 4), tag annoté Git `v0.2.0` (snapshot « valuation-ready »). Le [`CHANGELOG.md`](../../CHANGELOG.md) entrée `[0.2.0]` du 22 mai 2026 est aligné. Tags Git significatifs : `v0.2.0`, `wave1-merged`, `wave2-merged`, `wave3-merged`, `valuation-prep-merged`, plus tags de sauvegarde `pre-agent{1,2,3,4,5,6}-snapshot`, `pre-wave{1,2,3}-merge-snapshot`, et tags historiques `v1.0.0`, `v1.1.0`.
- **Langage principal** : TypeScript 5.6 côté SPA (205 fichiers TS/TSX, ≈ 56 700 lignes incluant tests), JavaScript CommonJS Node côté proxy (1 091 lignes).
- **Frameworks principaux** : Vite 5.4, React 18.3, Tailwind CSS 3.4, shadcn/ui (Radix UI), React Router DOM 6.28, TanStack React Query 5.56, React Hook Form 7.53, Zod 3.23, Vitest 2.1, Express 4.21 + Helmet 8.1 + express-rate-limit 8.5 + express-validator 7.3 + cookie-parser 1.4, Supabase JS 2.78 (auth + Postgres + RLS), jsPDF 4.2.1.
- **Date de génération** : 2026-05-22.
- **Périmètre audité** : commit `c6b3e4a` sur la branche `main`, tag `wave3-merged`. Sources `src/`, proxy `server.cjs`, schéma Supabase `supabase/migrations/`, scaffold de déploiement (`Dockerfile`, `docker-compose.yml`, `.github/workflows/`), configuration racine, documentation `docs/`. Le contenu de `docs/archive/`, `dossier-valorisation/`, `node_modules/` et `dist/` n'est référencé qu'en tant qu'artefact, pas analysé ligne à ligne.

## 2. Résumé exécutif

Kora Digital Pilot est une plateforme éditée par Korev AI, à finalité de pilotage de communication digitale et de veille de marque. Le livrable observé est une SPA React/TypeScript (`src/`, 205 fichiers TS/TSX pour ≈ 56 700 lignes y compris tests) accompagnée d'un proxy Express ([`server.cjs`](../../server.cjs), 1 091 lignes) qui isole les secrets serveur LinkedIn et Anthropic et qui porte désormais une couche d'authentification multi-tenant scaffold (Supabase). L'application s'organise en dix sections fonctionnelles accessibles via une coque `/app`, couvrant dashboard, deux modules de community management, deux variantes de veille de marque, inspiration IA, génération d'images, planning éditorial, analytics et bibliothèque.

Le cœur métier est concentré dans [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (façade 399 lignes après découpage, sous-modules pour ≈ 1 900 lignes additionnelles sous [`src/services/brand/real/`](../../src/services/brand/real/) : `extractors.ts`, `parsers.ts`, `prompts.ts`, `recommendations.ts`, `content-cleaner.ts`), un orchestrateur, des sous-modules d'export (PDF avec helpers purs extraits dans [`src/services/export/formats/pdf/`](../../src/services/export/formats/pdf/), CSV, Excel, JSON) et d'intégration, ainsi que les couches transverses `src/lib/` (Perplexity, OpenAI et Anthropic via façade [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) 196 lignes + sous-modules [`src/lib/ai/`](../../src/lib/ai/), LinkedIn, planning, anti-spam, logger structuré, clients Supabase, usage logger).

Le niveau de maturité observé est celui d'un produit fonctionnellement avancé, avec une dette technique inventoriée et assumée ([`docs/TECH_DEBT.md`](../TECH_DEBT.md)), et qui vient d'absorber trois vagues de remise à niveau coordonnées (Wave 1 sécurité + CI + vérité des données, Wave 2 qualité TypeScript + packaging valorisation, Wave 3 SaaSisation légère). La sécurité a été significativement durcie : tokens LinkedIn migrés en cookie `HttpOnly` géré côté proxy ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md)), 0 secret en clair dans le tree courant, bump `jspdf` 3.0 → 4.2.1 résolvant une vulnérabilité critique et quatre vulnérabilités hautes, helmet 8.1 + CSP + rate-limit multi-niveau, dotenv chargé en tête de proxy, body limit 1 Mo.

Réserves principales pour valorisation (toutes documentées) :

- Les clés API historiquement présentes dans le tree restent dans l'historique Git tant que `git filter-repo` n'est pas exécuté (action porteur, conditionnée à rotation préalable des 4 clés providers).
- 273 tests UI legacy en quarantaine explicite ([`docs/TESTING.md`](../TESTING.md) §5), 134 tests passent de manière déterministe (couverture 16,68 % lines / 31,44 % functions / 46,74 % branches, opposable).
- Stack SaaS multi-tenant scaffold (auth + organizations + memberships + telemetry + RLS) en place mais Supabase non provisionné — mode démo en place si vars Supabase absentes.

## 3. Périmètre fonctionnel constaté

Liste établie depuis [`src/App.tsx`](../../src/App.tsx), [`src/pages/Index.tsx`](../../src/pages/Index.tsx), [`docs/FEATURES.md`](../FEATURES.md) et inspection directe des composants.

| Fonctionnalité | Statut observé | Fichiers / modules concernés | Commentaire |
|---|---|---|---|
| Landing page publique | Implémenté | [`src/pages/Landing.tsx`](../../src/pages/Landing.tsx) | Route `/`, pas d'inscription en ligne |
| Authentification applicative (scaffold) | Implémenté (mode démo si Supabase absent) | [`src/pages/Auth.tsx`](../../src/pages/Auth.tsx), [`src/components/auth/`](../../src/components/auth/), [`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx) | Route `/auth`, garde `RequireAuth`, fallback `demo-user` si Supabase non configuré |
| Coque applicative à 10 sections | Implémenté | [`src/pages/Index.tsx`](../../src/pages/Index.tsx), [`src/components/Sidebar.tsx`](../../src/components/Sidebar.tsx) | Route `/app`, navigation par état `activeSection` |
| Dashboard multi-plateforme | Implémenté avec mode démo/réel explicite | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx), [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts), [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts), [`src/contexts/DataModeContext.tsx`](../../src/contexts/DataModeContext.tsx) | LinkedIn réel via API si token ; Instagram et X gating `isDemo` avec `EmptyState` en mode réel, données simulées préfixées `DEMO_*` en mode démo |
| Community Manager — pilotage | Implémenté | [`src/components/CommunityManagerDashboard.tsx`](../../src/components/CommunityManagerDashboard.tsx) | Section `cm-dashboard` |
| Community Manager — recherche par domaine | Implémenté | [`src/components/CommunityManagerDomainDashboard.tsx`](../../src/components/CommunityManagerDomainDashboard.tsx) | Section `cm-domain-search`, enrichissement Perplexity |
| Veille de marque historique | Implémenté | [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) (1 475 lignes), [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (399 lignes façade) + [`src/services/brand/real/`](../../src/services/brand/real/) | Section `brand-monitoring`, export PDF, télémétrie usage `report.generated` et `export.pdf` |
| Brand Intelligence TDD | Implémenté | [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) (1 296 lignes) | Section `brand-intelligence-tdd`, couverture unitaire sur service |
| Inspiration IA | Implémenté | [`src/components/InspirationAI.tsx`](../../src/components/InspirationAI.tsx), [`src/hooks/useAI.ts`](../../src/hooks/useAI.ts), [`src/hooks/useHybridAI.ts`](../../src/hooks/useHybridAI.ts), [`src/lib/ai/`](../../src/lib/ai/) | Section `inspiration`, OpenAI / Anthropic |
| Génération d'images | Implémenté | [`src/components/ImageGenerator.tsx`](../../src/components/ImageGenerator.tsx) | Section `images` |
| Planning éditorial | Implémenté | [`src/components/PlanningWithPerplexity.tsx`](../../src/components/PlanningWithPerplexity.tsx), [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | Section `planning`, persistance `localStorage` |
| Analytics détaillées | Implémenté avec mode démo/réel explicite | [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) (1 018 lignes) | LinkedIn via API si token ; autres plateformes via `DEMO_ANALYTICS_BY_PERIOD` ou `EmptyState` |
| Bibliothèque et exports | Implémenté | [`src/components/Library.tsx`](../../src/components/Library.tsx), [`src/services/export/`](../../src/services/export/), [`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) (2 000 lignes) + [`src/services/export/formats/pdf/`](../../src/services/export/formats/pdf/) (helpers extraits) | Section `library`, formats PDF/Excel/CSV/JSON |
| Réglages utilisateur | Implémenté | [`src/pages/Settings.tsx`](../../src/pages/Settings.tsx) | Route `/settings`, configuration des clés et mode données |
| Banc de test API | Implémenté (route DEV) | [`src/components/TestAPI.tsx`](../../src/components/TestAPI.tsx) | Route `/test-api`, gardée derrière `import.meta.env.DEV` |
| Diagnostic connecteurs | Implémenté (route DEV) | [`src/components/DiagnosticTest.tsx`](../../src/components/DiagnosticTest.tsx) | Route `/diagnostic`, gardée DEV |
| Authentification LinkedIn OAuth/OpenID | Implémenté avec cookie `HttpOnly` post-migration | [`src/components/LinkedInAuth.tsx`](../../src/components/LinkedInAuth.tsx), [`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx), [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (1 428 lignes), proxy `/api/auth/linkedin/{session,me,logout}` | Route `/auth/linkedin/callback`, tokens hors `localStorage` ([`docs/SECURITY.md`](../SECURITY.md) §3) |
| Mode démo / données réelles | Implémenté | [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts), [`src/contexts/DataModeContext.tsx`](../../src/contexts/DataModeContext.tsx), [`src/components/DataModeBanner.tsx`](../../src/components/DataModeBanner.tsx), [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts), [`src/components/EmptyState.tsx`](../../src/components/EmptyState.tsx) | Variable `VITE_DATA_MODE` (défaut `real`), bandeau sticky, badges `DataSourceBadge` |
| Télémétrie usage | Implémenté (no-op si Supabase absent) | [`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts), proxy `POST /api/usage` | 5 events instrumentés : `auth.login.success`, `auth.signup.success`, `linkedin.connect.success`, `report.generated`, `export.pdf` ([`docs/USAGE_LOGGING.md`](../USAGE_LOGGING.md)) |
| Multi-tenant scaffold (organizations / memberships) | Implémenté (DB + UI contexts) | [`src/contexts/TenantContext.tsx`](../../src/contexts/TenantContext.tsx), [`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql) | Trigger d'auto-provisionnement d'une organisation perso au signup, RLS sur tables business |
| Protections anti-spam API | Implémenté | [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts), [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts), [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | Widgets `ApiHealthDashboard`, `GlobalApiBlockerStatus` |
| Mode TV dashboard | Implémenté | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx) | Affichage open space |

## 4. Architecture technique

### 4.1 Vue d'ensemble

Application client-lourd (SPA) servie en statique après build Vite, accompagnée d'un proxy Node/Express qui (i) tient hors du bundle les secrets serveur (LinkedIn `CLIENT_SECRET`, clé Anthropic), (ii) gère la session LinkedIn en cookie `HttpOnly`, et (iii) expose les endpoints d'auth applicative et de télémétrie usage (multi-tenant via Supabase). Architecture détaillée dans [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) et [`docs/AUTH_MULTI_TENANT.md`](../AUTH_MULTI_TENANT.md).

```
Navigateur (SPA React, port 8088)
  ├── Cookie HttpOnly kora_linkedin_session   (session LinkedIn isolée)
  ├── Session Supabase Auth (JWT, persistSession)
  ├── localStorage (planning, historiques exports, paramètres anti-spam — pas de token)
  ├── Appels directs --> API Perplexity   (clé VITE_*)
  ├── Appels directs --> API OpenAI       (clé VITE_*)
  ├── Appels         --> Supabase Postgres (RLS multi-tenant)
  └── Appels         --> Proxy Express server.cjs (port 3001)
                          ├── --> API Anthropic        (clé serveur)
                          ├── --> API LinkedIn         (CLIENT_SECRET serveur)
                          ├── --> Supabase admin       (service role, telemetry)
                          └── --> Sortie : /api/me, /api/usage, /api/auth/linkedin/*
```

### 4.2 Frontend

- Bundler : Vite 5.4 ([`vite.config.ts`](../../vite.config.ts), 362 lignes ; multi-environnements DEV/STAGING/PRODUCTION, ports 8088/9088/10088, chunking manuel `vendor-react`, `vendor-ui`, `vendor-charts`, `pdf-utils`, `brand-intelligence`).
- Framework : React 18.3 + TypeScript 5.6.
- Configuration TypeScript : `noImplicitAny: true` activé en Wave 2 ([`tsconfig.app.json`](../../tsconfig.app.json) ligne 25). `strict: false` et `strictNullChecks: false` documentés comme dette dans [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md) (55 erreurs résiduelles concentrées dans `BrandIntelligenceDashboard.tsx`, `ReportGenerationService.ts`, `useBusinessIntelligence.ts`).
- Styling : Tailwind CSS 3.4 + shadcn/ui (49 primitives sous [`src/components/ui/`](../../src/components/ui/)).
- État serveur : TanStack React Query 5.56. Routage : React Router DOM 6.28. Validation : Zod 3.23, React Hook Form 7.53.
- Contexts globaux : `AuthProvider` + `TenantProvider` + `DataModeProvider` (montés dans [`src/App.tsx`](../../src/App.tsx)).
- Visualisation : Recharts 2.15. Export PDF : jsPDF 4.2.1 (bumpé Wave 1).
- Internationalisation : non documentée dans le périmètre audité.

### 4.3 Backend (proxy)

[`server.cjs`](../../server.cjs) : 1 091 lignes, Express 4.21 avec stack durci.

- **Sécurité d'entrée** : `helmet` 8.1 + CSP minimale paramétrée (directives `defaultSrc`, `scriptSrc 'self'`, `script-src-attr 'none'`, `styleSrc`, `imgSrc`, `connectSrc` listant LinkedIn, Anthropic, OpenAI, Perplexity, Supabase ; `frameAncestors 'none'`, `objectSrc 'none'`, HSTS conditionnel production).
- **Rate limiting** (`express-rate-limit` 8.5) : limiteur global 300 req/min sur `/api/`, 50/min `/api/linkedin/token`, 30/min `/api/anthropic/messages`, 30/min `/api/auth/linkedin/session`, 60/min `/api/auth/linkedin/logout`, 120/min `/api/auth/linkedin/me` et `/api/me`, 240/min `/api/usage`, 100/min `/api/linkedin/profile`.
- **Body** : JSON limit 1 Mo, validation JSON stricte ; `express.urlencoded` limit 1 Mo.
- **Session LinkedIn** : cookie `kora_linkedin_session` `HttpOnly` + `SameSite=Lax` + `Secure` en production, scope `/api/auth` ([`server.cjs`](../../server.cjs) lignes 603-720).
- **Auth applicative** : middleware `requireUser` valide le JWT Supabase (`Authorization: Bearer`) via le client admin (`getAdminClient()`), avec fallback `demo-user` si Supabase non configuré.
- **Cookies** : `cookie-parser` 1.4, `cookie` 1.1 (serialize).
- **Variables d'env** : chargées en tête (`require('dotenv').config()`).
- **Logger** : structuré (méthode, path, statut, IP, durée) — pas de body, pas de token.
- **Endpoints exposés** (audités dans `server.cjs`) :
  - `POST /api/linkedin/token` — échange code OAuth contre access token (ligne 235).
  - `POST /api/linkedin/profile` — récupération de profil LinkedIn (ligne 421).
  - `POST /api/anthropic/messages` — forward authentifié vers Anthropic (ligne 335).
  - `POST /api/auth/linkedin/session` — pose le cookie `HttpOnly` après échange OAuth (ligne 603).
  - `GET /api/auth/linkedin/me` — retourne le profil mis en cache (ligne 656).
  - `POST /api/auth/linkedin/logout` — invalide la session, clear cookie (ligne 646).
  - `GET /api/me` — retourne user + org courants (Supabase JWT ou mode démo) (ligne 866).
  - `POST /api/usage` — append-only telemetry vers `usage_events` (ligne 882, no-op en mode démo).
  - `GET /api/health` — sonde de disponibilité avec statut Supabase (ligne 957).
  - `GET /api/metrics` — métriques internes (DEV uniquement, ligne 986).

### 4.4 Persistance

Deux régimes coexistent post-Wave 3, sélectionnés par la présence des variables Supabase :

- **Régime SaaS multi-tenant** (Supabase configuré) — schéma `supabase/migrations/0001_init.sql` (246 lignes) :
  - `public.organizations` (id uuid, name, slug unique, plan, created_at) — racine tenant.
  - `public.org_members` (org_id, user_id, role `owner`/`admin`/`member`, unique (org_id, user_id)) — membership Supabase Auth.
  - `public.usage_events` (org_id, user_id, event_name, properties jsonb, created_at desc indexed) — télémétrie append-only.
  - `public.linkedin_sessions` (scaffold, non câblé dans `server.cjs` — la migration Wave 5 reprendra cette table pour passer le store mémoire en persistance chiffrée).
  - RLS activée sur toutes les tables business ; policies imposent que chaque utilisateur ne voie / écrive que les rows liés à ses organisations.
  - Trigger `kora_on_auth_user_created` auto-provisionne une organisation perso et une membership `owner` au signup Supabase Auth.
- **Régime démo / poste interne** (Supabase non configuré) — persistance `localStorage` du navigateur ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §2). Clés observées : `linkedin_oauth_state` (état OAuth, non sensible), `linkedin_last_sync`, `linkedin_cached_metrics`, `kora_planning_data`, `kora_weekly_plans`, `kora_export_history`, `kora-export-history` (doublon documenté), `perplexity_protection_settings`, `perplexity_protection_history`, `perplexity_usage_stats`. Les tokens LinkedIn ne sont plus persistés en `localStorage` depuis la migration cookie `HttpOnly`.

### 4.5 Intégrations externes

| Intégration | Mode d'accès | Module client | Statut |
|---|---|---|---|
| Perplexity API | Appel direct depuis bundle | [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) | Opérationnel sous clé `VITE_PERPLEXITY_API_KEY` |
| OpenAI API | Appel direct depuis bundle | [`src/lib/ai/openai-client.ts`](../../src/lib/ai/openai-client.ts) (via façade [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts)) | Opérationnel sous clé `VITE_OPENAI_API_KEY` |
| Anthropic API | Via proxy `/api/anthropic/messages` | [`src/lib/ai/anthropic-client.ts`](../../src/lib/ai/anthropic-client.ts) | Opérationnel via proxy (clé serveur uniquement) |
| LinkedIn OAuth + API | Via proxy `/api/auth/linkedin/*` et `/api/linkedin/*` | [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts), session cookie `HttpOnly` | Opérationnel sous configuration LinkedIn Developer |
| Supabase (auth + Postgres + RLS) | SDK browser + admin server-side | [`src/lib/supabase-client.ts`](../../src/lib/supabase-client.ts), [`src/lib/supabase-admin.cjs`](../../src/lib/supabase-admin.cjs) | Scaffold complet ; mode démo si non configuré |

### 4.6 Authentification

- **Authentification applicative** : Supabase Auth (email + mot de passe) via [`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx) ; page `/auth` ([`src/pages/Auth.tsx`](../../src/pages/Auth.tsx)) double tab signin/signup avec Zod + React Hook Form ; garde `RequireAuth` ([`src/components/auth/RequireAuth.tsx`](../../src/components/auth/RequireAuth.tsx)). **Fallback démo** instantané (`demo-user`, `demo-org`) si `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` absentes — la garde laisse passer.
- **Tenant** : [`src/contexts/TenantContext.tsx`](../../src/contexts/TenantContext.tsx) charge les `org_members` de l'utilisateur courant, expose `currentOrg`, `orgs`, `switchOrg`. Bootstrap automatique d'une organisation perso au signup via trigger SQL.
- **Authentification LinkedIn (OpenID Connect)** : implémentée côté proxy pour préserver le `CLIENT_SECRET` ([`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx), [`src/components/LinkedInAuth.tsx`](../../src/components/LinkedInAuth.tsx)). Session matérialisée par cookie `kora_linkedin_session` `HttpOnly`. Risque XSS-token classé « très faible » post-migration ([`docs/SECURITY.md`](../SECURITY.md) §3).
- **Niveau de durcissement** : middleware `requireUser` actif sur `/api/me` et `/api/usage` ; les endpoints LinkedIn restent ouverts (CORS + rate-limit) pour le flux OAuth.

### 4.7 Déploiement

Scaffold complet livré Wave 3 ([`docs/DEPLOYMENT.md`](../DEPLOYMENT.md)) :

- [`Dockerfile`](../../Dockerfile) multi-stage Node 20 Alpine (build SPA + bundle proxy).
- [`docker-compose.yml`](../../docker-compose.yml) avec service `app` + service `postgres` 15 (dev local sans Supabase managé).
- [`.dockerignore`](../../.dockerignore) (node_modules, dist, .git, dossier-valorisation, .env*, coverage, docs/archive).
- [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) : workflow déclenché sur tag `v*.*.*`, job `build` (docker build sans push) + job `deploy` **désactivé par `if: false`** tant qu'aucune cible n'est choisie.
- Cibles candidates documentées dans [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) §4 : Vercel + Railway/Render, Fly.io mono-conteneur, Render full-stack, VPS classique.

### 4.8 Intégration continue

Workflow : [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — `npm ci` puis `lint`, `typecheck`, `test:coverage`, `build`, sur Ubuntu et Node 20, avec upload d'artefact `coverage/`.

Hooks Git locaux : Husky 9 + lint-staged 15 + commitlint Conventional Commits ([`commitlint.config.cjs`](../../commitlint.config.cjs), [`.husky/pre-commit`](../../.husky/pre-commit), [`.husky/commit-msg`](../../.husky/commit-msg)). Format check Prettier via `npm run format:check` (configuration [`.prettierrc`](../../.prettierrc), exclusions [`.prettierignore`](../../.prettierignore)).

## 5. Structure du dépôt

| Chemin | Rôle identifié | Importance |
|---|---|---|
| [`src/`](../../src/) | Code source SPA (205 fichiers TS/TSX, ≈ 56 700 lignes) | Critique |
| [`src/pages/`](../../src/pages/) | Pages racines (`Index`, `Landing`, `Settings`, `Auth`, `NotFound`) | Critique |
| [`src/components/`](../../src/components/) | Composants applicatifs (102 fichiers) incluant dashboards, widgets, intégration LinkedIn, primitives shadcn/ui sous `ui/`, sous-dossier `auth/` (SignIn, SignUp, RequireAuth) | Critique |
| [`src/components/enhanced/`](../../src/components/enhanced/) | Variante TDD `BrandIntelligenceDashboard.tsx` | Critique |
| [`src/services/`](../../src/services/) | Logique métier (32 fichiers) : `RealBrandIntelligenceService.ts` (façade), sous-modules `brand/real/` (5 fichiers), `BrandIntelligenceOrchestrator.ts`, `ContentDeduplicationService.ts`, `core/`, `export/` avec `formats/pdf-exporter.ts` + helpers `formats/pdf/`, `integration/` | Critique |
| [`src/lib/`](../../src/lib/) | Couches techniques transverses (24 fichiers) : `perplexity-service.ts`, `ai-service.ts` (façade) + sous-modules `ai/`, `linkedin-api.ts`, `planning-service.ts`, `global-api-blocker.ts`, `perplexity-protection-middleware.ts`, `server-detection.ts`, `logger.ts`, `supabase-client.ts`, `supabase-admin.cjs`, `auth-client.ts`, `usage-logger.ts`, `data-mode.ts`, `demo-data.ts` | Critique |
| [`src/contexts/`](../../src/contexts/) | Contexts globaux : `AuthContext.tsx`, `TenantContext.tsx`, `DataModeContext.tsx` | Critique |
| [`src/hooks/`](../../src/hooks/) | Hooks React métier (8 fichiers) : `usePerplexity`, `useHybridAI`, `useAI`, `useBusinessIntelligence`, `useLinkedInAnalytics`, `useLinkedInStats`, `usePlanning`, `use-toast`, `use-mobile` | Élevée |
| [`src/types/`](../../src/types/) | Types métier (`BrandIntelligenceTypes.ts`, `brand-analysis.ts`) | Élevée |
| [`src/test/`](../../src/test/), [`src/tests/`](../../src/tests/) | Suites Vitest (27 fichiers de test) | Élevée |
| [`server.cjs`](../../server.cjs) | Proxy Express durci avec session cookie + auth + usage (1 091 lignes) | Critique |
| [`supabase/`](../../supabase/) | Schéma multi-tenant : `migrations/0001_init.sql` (246 lignes : tables, RLS, trigger), `seed.sql`, `README.md` | Critique |
| [`Dockerfile`](../../Dockerfile), [`docker-compose.yml`](../../docker-compose.yml), [`.dockerignore`](../../.dockerignore) | Scaffold conteneurisation | Élevée |
| [`scripts/build-valuation-dossier.sh`](../../scripts/build-valuation-dossier.sh) | Construction reproductible du dossier de valorisation (`npm run dossier`) | Élevée |
| [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt) | Patterns `git filter-repo` prêts pour purge historique (action porteur) | Élevée |
| [`docs/`](../) | Documentation opposable canonique (13 fichiers .md) | Élevée |
| [`docs/cabinet/`](../cabinet/) | Dossier valorisation pour cabinet d'évaluation (10 fichiers : 01-perimetre à 08-conclusion + README + annexes) | Critique |
| [`docs/archive/`](../archive/) | Historique de post-mortems, audits, refactorings, prompts de tests (86 fichiers Markdown) | Indicative |
| [`docs/audit/`](./) | Artefacts d'audit (présent document, notes, 5 rapports thématiques, `npm-audit.json`, `licenses.json`, snapshot HTML `coverage/`) | Élevée |
| [`dossier-valorisation/`](../../dossier-valorisation/) | Sortie du script (non versionnée, gitignored) | Indicative |
| [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) | Workflow CI (lint, typecheck, tests, build, coverage) | Critique |
| [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) | Workflow deploy (placeholder, job `deploy` désactivé) | Élevée |
| [`vite.config.ts`](../../vite.config.ts) | Configuration Vite multi-environnements | Critique |
| [`vitest.config.ts`](../../vitest.config.ts) | Configuration Vitest, seuils V8 bloquants calibrés valeur réelle − 2 pts (lines 14, branches 44, functions 29, statements 14) | Élevée |
| [`eslint.config.js`](../../eslint.config.js) | ESLint flat config 9 (plugins React, hooks, refresh, prettier) | Élevée |
| [`tsconfig.app.json`](../../tsconfig.app.json), [`tsconfig.json`](../../tsconfig.json) | Configuration TypeScript (`noImplicitAny: true`, `strict`/`strictNullChecks` documentés comme dette dans [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md)) | Élevée |
| [`package.json`](../../package.json) | Manifeste npm (`kora-digital-pilot`, `private: true`, `version: 0.2.0`, license MIT, author Korev AI) | Critique |
| [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md), [`LICENSE`](../../LICENSE) | Fichiers racine de gouvernance projet | Élevée |
| [`.env.example`](../../.env.example), [`.env.local.example`](../../.env.local.example), [`env.example`](../../env.example) | Gabarits d'environnement sanitisés (placeholders, aucune valeur réelle — vérification visuelle) | Élevée |
| [`.husky/`](../../.husky/) | Hooks Git (lint-staged, commitlint, prepare) | Indicative |

## 6. Modules propriétaires identifiés

| Module | Rôle | Niveau de spécificité | Éléments valorisables | Réserve |
|---|---|---|---|---|
| [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (399 L façade) + [`src/services/brand/real/`](../../src/services/brand/real/) (5 sous-modules ≈ 1 900 L) | Orchestration métier de la veille de marque (P.R.I.S.M.) : extraction, parsing, prompts, recommandations, nettoyage de contenu | Élevé — logique propriétaire au-dessus de Perplexity | Découpage en sous-modules purs, couverture TDD sur le service principal, structure de prompts dédiée, pipeline d'extraction et de normalisation typées | Service initialement à 2 332 L, découpé Wave 2 ; les sous-modules `extractors.ts` (795 L) et `parsers.ts` (553 L) restent volumineux ([`docs/TECH_DEBT.md`](../TECH_DEBT.md)) |
| [`src/services/BrandIntelligenceOrchestrator.ts`](../../src/services/BrandIntelligenceOrchestrator.ts) | Coordination multi-étapes de l'analyse de marque | Élevé | Composition des sous-services métier | Couplage interne à expliciter |
| [`src/services/ContentDeduplicationService.ts`](../../src/services/ContentDeduplicationService.ts) | Déduplication de contenu sur les sorties IA | Élevé | Heuristiques propriétaires | À documenter plus finement |
| [`src/services/brand/`](../../src/services/brand/) (DataAggregationService 824 L, parsers, report-generator, queries, brand-analysis-orchestrator, api-service) | Sous-domaine veille de marque modulaire | Élevé | Découpage par responsabilité | Couverture inégale |
| [`src/services/core/BrandAnalysisCore.ts`](../../src/services/core/BrandAnalysisCore.ts) (1 008 L) | Pipeline d'analyse de marque cœur | Élevé | Algorithmes propres | À découper |
| [`src/services/integration/ReportGenerationService.ts`](../../src/services/integration/ReportGenerationService.ts) (975 L) | Pont entre la veille de marque et les exports | Moyen | Format de rapport unifié | À auditer ligne à ligne |
| [`src/services/export/`](../../src/services/export/) | Orchestration des exports (PDF, Excel, CSV, JSON), historisation, métadonnées, compression | Moyen à élevé | Mise en forme premium, historique persisté | Doublon de clé `localStorage` ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §9) |
| [`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) (2 000 L) + [`src/services/export/formats/pdf/`](../../src/services/export/formats/pdf/) (`styles.ts`, `utils.ts`, `data-generators.ts`, `cover.ts`) | Mise en page PDF premium des rapports | Élevé | Templates, styles, structure ; helpers purs extraits Wave 2 | Sections encore couplées à `this.brandColors`/`this.dimensions` (cf. [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md)) |
| [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (1 428 L) | Couche LinkedIn (OpenID, Marketing API, session cookie `HttpOnly`) | Élevé | Intégration OAuth complète, restauration de session, hooks d'analytics et de stats | Volume élevé à factoriser ; sessions LinkedIn en mémoire mono-instance côté proxy (à migrer vers `linkedin_sessions` SQL) |
| [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) (196 L façade) + [`src/lib/ai/`](../../src/lib/ai/) (`openai-client.ts`, `anthropic-client.ts`, `fallback-generator.ts`, `system-prompt.ts`, `types.ts`) | Couche IA unifiée (OpenAI, Anthropic, fallback local) | Moyen à élevé | Bascule entre fournisseurs, prompts internes, fallback local | Service initialement à 1 202 L, découpé Wave 2 |
| [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) | Couche Perplexity (requête, parsing, retries) | Élevé | Encapsulation propre du fournisseur | Dépendance fournisseur |
| [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts), [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts), [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | Protections anti-spam et détection d'incident serveur | Moyen | Plafonds configurables, backoff exponentiel, reset manuel | Implémentation côté client uniquement |
| [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | Modèle planning éditorial multi-semaines | Moyen | Persistance `localStorage` typée | Pas de synchronisation multi-postes |
| [`src/lib/logger.ts`](../../src/lib/logger.ts) | Logger centralisé (debug/info/warn/error, no-op en prod via `import.meta.env.PROD`) | Moyen | Base de migration ; ≈ 231 `console.*` résiduels (Wave 2 : -45 % depuis 546) | Migration en cours |
| [`src/lib/supabase-client.ts`](../../src/lib/supabase-client.ts), [`src/lib/supabase-admin.cjs`](../../src/lib/supabase-admin.cjs), [`src/lib/auth-client.ts`](../../src/lib/auth-client.ts) | Couche Supabase (client browser + admin server-side + wrappers auth) | Moyen | Fallback démo, contrat d'isolation `VITE_*` vs server-only | Service role à protéger strictement (clé serveur uniquement) |
| [`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts) | Télémétrie usage append-only | Moyen | 5 events instrumentés ([`docs/USAGE_LOGGING.md`](../USAGE_LOGGING.md)) | Dictionnaire d'events extensible |
| [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts), [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts) | Mode démo/réel explicite + source unique des valeurs simulées (Wave 1) | Moyen | Pose un contrat de vérité produit ; ≈ 180 valeurs préfixées `DEMO_*` | Décision produit à confirmer pour passage en mode `real` strict |
| [`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx), [`src/contexts/TenantContext.tsx`](../../src/contexts/TenantContext.tsx) | Authentification applicative et tenant scaffold | Moyen | Multi-tenant minimal défendable | Mode démo en production = risque ([`docs/SECURITY.md`](../SECURITY.md)) |
| [`src/types/BrandIntelligenceTypes.ts`](../../src/types/BrandIntelligenceTypes.ts) (720 L) | Types métier consolidés P.R.I.S.M. | Élevé | Modélisation détaillée du domaine | Coexistence avec [`src/types/brand-analysis.ts`](../../src/types/brand-analysis.ts) ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §8) |
| [`src/hooks/usePerplexity.ts`](../../src/hooks/usePerplexity.ts), [`useHybridAI.ts`](../../src/hooks/useHybridAI.ts), [`useLinkedInAnalytics.ts`](../../src/hooks/useLinkedInAnalytics.ts), [`useLinkedInStats.ts`](../../src/hooks/useLinkedInStats.ts), [`useBusinessIntelligence.ts`](../../src/hooks/useBusinessIntelligence.ts), [`useAI.ts`](../../src/hooks/useAI.ts), [`usePlanning.ts`](../../src/hooks/usePlanning.ts) | Hooks d'orchestration React | Moyen | Réutilisabilité dans la SPA | Erreurs `react-hooks` historiques dans `usePlanning.ts` corrigées Wave 1 |
| [`server.cjs`](../../server.cjs) (1 091 L) | Proxy durci (helmet, CSP, rate-limit multi-niveau, validation, cookies, session LinkedIn, auth Supabase, usage logger) | Moyen à élevé | Isolation des secrets, façade auth applicative, télémétrie | Store de sessions en mémoire mono-instance (à passer sur Redis ou Postgres avant scale) |
| [`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql) (246 L) | Schéma SQL multi-tenant + RLS + trigger | Élevé | Modèle défendable et appliquable, RLS sur toutes les tables business | Non encore appliqué sur une base Supabase réelle (action porteur) |

## 7. Dépendances et composants externes

Inventaire détaillé dans [`docs/LICENSES.md`](../LICENSES.md) et [`docs/audit/licenses.json`](./licenses.json) (régénéré Wave 1, 390 packages, toutes licences permissives — aucune GPL/AGPL/SSPL/BUSL).

| Dépendance | Usage observé | Criticité | Risque associé |
|---|---|---|---|
| `react` 18.3, `react-dom` 18.3 | Framework UI | Critique | Sortie de support à anticiper long terme |
| `react-router-dom` 6.28 | Routage SPA | Critique | Mineur |
| `@tanstack/react-query` 5.56 | Cache et orchestration de requêtes | Élevée | Mineur |
| `vite` 5.4 | Bundler / dev server | Critique | Mineur |
| `typescript` 5.6 | Typage statique | Critique | Configuration partiellement stricte (cf. §9) |
| `tailwindcss` 3.4, `@tailwindcss/typography` 0.5 | Styling | Élevée | Mineur |
| `@radix-ui/*` (27 paquets) | Primitives UI accessibles | Élevée | Mineur |
| `react-hook-form` 7.53, `@hookform/resolvers` 3.9, `zod` 3.23 | Formulaires + validation | Élevée | Mineur |
| `recharts` 2.15 | Visualisation Analytics | Élevée | Mineur |
| `jspdf` 4.2.1 | Export PDF | Élevée | Bump Wave 1 (3.0 → 4.2.1) résolvant 1 critique + 4 hautes (cf. [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md)) |
| `express` 4.21, `helmet` 8.1, `express-rate-limit` 8.5, `express-validator` 7.3, `cors` 2.8, `node-fetch` 2.7, `cookie-parser` 1.4, `cookie` 1.1 | Proxy serveur durci | Critique | Mineur |
| `@supabase/supabase-js` 2.78 | Auth + Postgres + RLS (multi-tenant scaffold) | Élevée | Dépendance fournisseur managé ; mode démo en place si non configuré |
| `dotenv` 16.5 | Chargement variables d'environnement | Critique | Mineur |
| `@vitejs/plugin-react` 4.3, `vitest` 2.1, `@vitest/coverage-v8` 2.1, `@vitest/ui` 2.1 | Build et tests | Élevée | 9 vulnérabilités modérées résiduelles dans Vitest 2.x (devDeps uniquement, hors bundle) |
| `@testing-library/react` 16.3, `@testing-library/jest-dom` 6.6, `@testing-library/user-event` 14.6, `jsdom` 26.1 | Tests UI | Élevée | Suites quarantinées documentées ([`docs/TESTING.md`](../TESTING.md) §5) |
| `eslint` 9.13, `typescript-eslint` 8.59, `eslint-plugin-react-hooks` 5, `eslint-plugin-react-refresh` 0.4, `eslint-config-prettier` 10, `prettier` 3.8 | Lint et format | Élevée | Mineur |
| `@commitlint/cli` 20.5, `@commitlint/config-conventional` 20.5, `husky` 9, `lint-staged` 15 | Hygiène Git Conventional Commits | Élevée | Mineur |
| `class-variance-authority` 0.7, `clsx` 2.1, `tailwind-merge` 2.5 | Composition de classes UI | Moyenne | Mineur |
| `lucide-react` 0.462 | Icônes | Moyenne | Mineur |
| `date-fns` 3.6, `react-day-picker` 8.10 | Dates | Moyenne | Mineur |
| `cmdk` 1.0, `embla-carousel-react` 8.3, `input-otp` 1.2, `next-themes` 0.3, `react-resizable-panels` 2.1, `sonner` 1.5, `vaul` 0.9, `tailwindcss-animate` 1.0 | Composants/UX | Moyenne | Mineur |
| `concurrently` 9.1 | Orchestration scripts npm | Faible | Mineur |
| Plugin de tagging de composants Vite (devDependency) | Outillage de développement uniquement, non requis pour build/run | Faible | Peut être retiré sans impact fonctionnel — cf. [`docs/audit/PROJECT_AUDIT_NOTES.md`](./PROJECT_AUDIT_NOTES.md) |

**Vulnérabilités `npm audit` résiduelles** (cf. [`docs/audit/npm-audit.json`](./npm-audit.json)) : 9 modérées (0 critique, 0 haute). Toutes localisées dans `devDependencies` (Vitest 2.x et son écosystème, brace-expansion, vite, plugin de tagging dev). Le bundle livré au navigateur ne porte aucune vulnérabilité connue.

Aucune dépendance directe sous licence copyleft forte identifiée ([`docs/LICENSES.md`](../LICENSES.md), [`docs/audit/licenses.json`](./licenses.json) régénéré post-bump jspdf). Distribution sous MIT défendable sur le périmètre direct et indirect.

## 8. Données, sécurité et conformité

### 8.1 Gestion des secrets

- **Fichiers d'environnement** : [`.env`](../../.env) (non versionné, dans `.gitignore`), [`.env.local`](../../.env.local) (local, non versionné), [`.env.example`](../../.env.example), [`.env.local.example`](../../.env.local.example), [`env.example`](../../env.example) (gabarits sanitisés, valeurs placeholder uniquement — vérification visuelle directe). `.gitignore` durci Wave 1 (`.env`, `.env.local`, `.env.*.local`, `coverage/`, `dossier-valorisation/`).
- **Scan secrets** : tree courant scanné post-merge Wave 3 sur patterns Perplexity `pplx-`, OpenAI `sk-proj-`, Anthropic `sk-ant-api`, LinkedIn `WPL_AP1.`, identifiants LinkedIn — **0 match** ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §3).
- **Catégorisation des clés** ([`docs/SECURITY.md`](../SECURITY.md) §2) :
  - `VITE_PERPLEXITY_API_KEY`, `VITE_OPENAI_API_KEY` : injectées dans le bundle client, traitées comme publiques de fait avec rotation et plafond budgétaire fournisseur.
  - LinkedIn `CLIENT_SECRET`, clé Anthropic, `SUPABASE_SERVICE_ROLE_KEY` : strictement serveur, jamais en `VITE_*` (vérifié dans le tree).
- **Procédure de rotation** documentée ([`docs/SECURITY.md`](../SECURITY.md) §5, [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §5).
- **Patterns `git filter-repo`** prêts dans [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt). Exécution déléguée au porteur après rotation des 4 clés providers.

### 8.2 Authentification et autorisations

- **Authentification applicative** : Supabase Auth scaffold ([`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx), [`src/pages/Auth.tsx`](../../src/pages/Auth.tsx), [`src/components/auth/RequireAuth.tsx`](../../src/components/auth/RequireAuth.tsx)) avec fallback démo si vars Supabase absentes. Le middleware `requireUser` côté proxy valide le JWT Supabase.
- **Multi-tenant** : RLS Postgres sur toutes les tables business ([`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql)) ; trigger d'auto-provisionnement d'une organisation perso au signup.
- **Authentification LinkedIn (OpenID Connect)** : implémentée via cookie `HttpOnly` géré par le proxy ([`server.cjs`](../../server.cjs) lignes 603-720, [`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx)). Risque XSS-token classé « très faible » post-migration.
- **Risque résiduel signalé** : pas d'authentification applicative sur les endpoints LinkedIn ouverts par CORS — acceptable pour le flux OAuth, à durcir si exposition réseau publique ([`docs/SECURITY.md`](../SECURITY.md) §3.2).

### 8.3 Logs et auditabilité

- **Logger centralisé** [`src/lib/logger.ts`](../../src/lib/logger.ts) : niveaux debug/info/warn/error, no-op en prod via `import.meta.env.PROD`. Migration depuis ≈ 546 occurrences `console.*` → 231 restantes post-Wave 2 (-45 %).
- **Proxy** : logger structuré (méthode, path, statut, IP, durée) — pas de body, pas de token ([`server.cjs`](../../server.cjs) ligne 141).
- **ESLint** configuré pour interdire `console.log` (warning) et autoriser uniquement `console.warn` / `console.error`.
- **Télémétrie applicative** : table `public.usage_events` append-only ([`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql) §3) ; 5 events instrumentés (`auth.login.success`, `auth.signup.success`, `linkedin.connect.success`, `report.generated`, `export.pdf`) ; constantes canoniques exportées dans `USAGE_EVENTS` de [`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts). Endpoint serveur `POST /api/usage` no-op en mode démo (HTTP 202).

### 8.4 Données personnelles

- **Côté serveur** : pas de persistance par défaut. Avec Supabase configuré, persistance dans Supabase Auth (email + identifiants Supabase) et tables `org_members`, `usage_events`. Rétention, anonymisation et politique d'effacement à définir par le porteur.
- **Côté client** : tokens LinkedIn ne sont plus en `localStorage` depuis la migration cookie `HttpOnly`. Données encore stockées localement ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §2) : cache de métriques LinkedIn, planning éditorial, historiques d'exports, paramètres anti-spam. Pas de chiffrement applicatif du `localStorage` (risque résiduel assumé).

### 8.5 Mesures de protection en place

- **Hardening proxy** : `helmet` 8.1 avec CSP minimale paramétrée (directives explicites listées dans [`server.cjs`](../../server.cjs) lignes 109-140), HSTS conditionnel en production, `referrerPolicy: strict-origin-when-cross-origin`, `frameAncestors: 'none'`, `objectSrc: 'none'`, `script-src-attr 'none'`.
- **Rate limiting multi-niveau** : limiteur global 300 req/min sur `/api/`, plus limites spécifiques par endpoint (cf. §4.3).
- **Body limit** : 1 Mo strict JSON + urlencoded.
- **Validation** : Zod côté formulaires sensibles, validation manuelle des clés API côté proxy.
- **Anti-spam côté client** : `global-api-blocker`, `perplexity-protection-middleware`, `server-detection`, backoff exponentiel et déduplication dans les hooks.
- **Hygiène Git** : `.env` retiré du tracking ; `.gitignore` durci ; gabarits `.env*.example` ne contiennent que des placeholders (vérification visuelle directe) ; hooks Husky pre-commit (lint-staged + commitlint Conventional Commits).
- **Trust proxy** activé (`app.set('trust proxy', 1)`) pour environnements derrière reverse proxy.
- **Erreurs** : stack traces uniquement en DEV, message générique en PROD.

### 8.6 Risques résiduels assumés

Listés dans [`docs/SECURITY.md`](../SECURITY.md) §3, [`docs/TECH_DEBT.md`](../TECH_DEBT.md), et [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §7 :

1. **Historique Git** : clés API présentes dans les commits historiques tant que `git filter-repo` n'est pas exécuté. Rotation préalable des 4 clés providers obligatoire (Perplexity, OpenAI, Anthropic, LinkedIn `CLIENT_SECRET`).
2. **Clés `VITE_PERPLEXITY_API_KEY` / `VITE_OPENAI_API_KEY`** : exposées dans le bundle client (assumé sous rotation et plafond budgétaire). LinkedIn `CLIENT_SECRET` et Anthropic restent strictement serveur.
3. **Store de sessions LinkedIn** : `Map` en mémoire mono-instance dans `server.cjs`. À migrer vers la table `linkedin_sessions` (scaffold présent) ou Redis avant déploiement multi-instance.
4. **Mode démo en production** : si vars Supabase manquent au boot prod, la garde `RequireAuth` laisse passer (fallback `demo-user`). Checklist [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) §5 contrôle ce point.
5. **`'unsafe-inline'`** toléré dans `styleSrc` CSP (Radix/shadcn). Acceptable, à resserrer si nécessaire.
6. **Pas de révocation upstream LinkedIn lors du logout** : le cookie est invalidé côté serveur mais le token reste actif chez LinkedIn jusqu'à `expires_in`.
7. **Pas d'auth applicative sur les endpoints LinkedIn** ouverts par CORS (flux OAuth) — acceptable, à durcir si exposition publique.
8. **Pas de chiffrement du `localStorage`** côté navigateur.

### 8.7 Conformité

- **RGPD** : aucune affirmation de conformité ne peut être faite sur la base du périmètre audité. Avec Supabase configuré, la plateforme traite email + tokens LinkedIn + télémétrie usage indexée par utilisateur. Une analyse d'impact (PIA/DPIA) sera nécessaire avant exposition publique multi-utilisateurs. Aucun DPA fournisseur n'est référencé dans le périmètre audité.
- **AI Act** : usage de fournisseurs IA tiers (OpenAI, Anthropic, Perplexity) sans collecte de données utilisateurs particulière dans le périmètre audité. La catégorisation des cas d'usage (assistance à la création de contenu, veille concurrentielle) n'a pas été formalisée — à conduire par le porteur.
- **Aucune attestation externe** (SOC 2, ISO 27001, etc.) n'est documentée dans le périmètre audité.

## 9. Tests, qualité et maintenabilité

### 9.1 Tests

- **Framework** : Vitest 2.1 + Testing Library 16.3 + jsdom 26.
- **Configuration** : [`vitest.config.ts`](../../vitest.config.ts). `retry: 0`, `testTimeout: 15s` (vs 120 s pré-Wave 1), exclusion des tests de production (`src/test/production/**`, opt-in via `RUN_PRODUCTION_TESTS=1` et script `npm run test:production`).
- **27 fichiers de test** dans [`src/test/`](../../src/test/) et [`src/tests/`](../../src/tests/).
- **Résultat post-Wave 3** (`npm run test:run`) : **134 passed / 273 skipped / 0 failed** en moins de 2 s (vs > 6 minutes en hang sur la baseline). 11 fichiers entiers en quarantaine `describe.skip` + 24 tests individuels skipés, tous étiquetés `TODO(agent2-wave1)` et listés dans [`docs/TESTING.md`](../TESTING.md) §5.
- **Couverture mesurée** (V8, [`docs/audit/COVERAGE_REPORT.md`](./COVERAGE_REPORT.md), snapshot HTML versionné dans [`docs/audit/coverage/`](./coverage/)) :
  - Lines : **16,68 %** (seuil CI : 14 %)
  - Statements : **16,68 %** (seuil CI : 14 %)
  - Branches : **46,74 %** (seuil CI : 44 %)
  - Functions : **31,44 %** (seuil CI : 29 %)
- **Seuils CI bloquants** calibrés en « valeur réelle − 2 points » pour garantir la reproductibilité du gate sans le verrouiller à des objectifs non atteignables. Trajectoire de remontée listée dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md).
- **Tests de production** (Perplexity API réelle) : opt-in via `npm run test:production`, exclus du run CI par défaut.

### 9.2 Lint et typecheck

- **ESLint** : flat config 9 ([`eslint.config.js`](../../eslint.config.js)). Résultats post-Wave 3 : **0 erreurs, 491 warnings** (vs 898 baseline, soit -45 %). Distribution principale : `@typescript-eslint/no-explicit-any` (166 occurrences post-Wave 2, -45 % depuis 302), `no-unused-vars` (~80), `no-console` (~231, -43 % depuis 546), `no-useless-escape` (3 post-Wave 2, -94 % depuis 52).
- **TypeScript** : `npm run typecheck` OK avec `noImplicitAny: true` activé Wave 2 ([`tsconfig.app.json`](../../tsconfig.app.json) ligne 25). `strictNullChecks: false` (55 erreurs résiduelles concentrées dans `BrandIntelligenceDashboard.tsx`, `ReportGenerationService.ts`, `useBusinessIntelligence.ts`) et `noUnusedLocals/Parameters: false` (doublon avec `@typescript-eslint/no-unused-vars`) restent désactivés et documentés dans [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md).
- **`npm run check`** (lint + typecheck + test:run + build) : **vert end-to-end** post-Wave 3 (~13 s).

### 9.3 Dette technique structurelle

Inventoriée dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md). Points saillants à date :

- Configuration TypeScript partiellement stricte (`strict: false`, `strictNullChecks: false`, `noUnusedLocals/Parameters: false` — décisions tracées dans [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md)).
- 166 occurrences `any` (-45 % depuis 302).
- ≈ 231 occurrences `console.*` (-45 % depuis 546).
- 5 fichiers > 1 000 lignes restants : [`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) 2 000 L (helpers extraits, sections couplées), [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) 1 475 L, [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) 1 428 L, [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) 1 296 L, [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) 1 018 L, [`src/services/core/BrandAnalysisCore.ts`](../../src/services/core/BrandAnalysisCore.ts) 1 008 L.
- 273 tests en quarantaine documentée (réactivation programmée).
- Store de sessions LinkedIn en mémoire mono-instance.
- Doublons : deux familles de types métier (§8 [`docs/TECH_DEBT.md`](../TECH_DEBT.md)), deux clés `localStorage` d'historique d'export.
- Pas de pipeline de déploiement actif (scaffold présent, job désactivé).

### 9.4 Documentation existante

- **4 fichiers à la racine** : [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md), plus [`LICENSE`](../../LICENSE).
- **13 fichiers canoniques** sous [`docs/`](../) : [`README.md`](../README.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md), [`AUTH_MULTI_TENANT.md`](../AUTH_MULTI_TENANT.md), [`DATA_MODEL.md`](../DATA_MODEL.md), [`DEMO.md`](../DEMO.md), [`DEPLOYMENT.md`](../DEPLOYMENT.md), [`FEATURES.md`](../FEATURES.md), [`LICENSES.md`](../LICENSES.md), [`OPERATIONS.md`](../OPERATIONS.md), [`SECURITY.md`](../SECURITY.md), [`TECH_DEBT.md`](../TECH_DEBT.md), [`TESTING.md`](../TESTING.md), [`USAGE_LOGGING.md`](../USAGE_LOGGING.md).
- **10 fichiers `docs/cabinet/`** : `README.md` + `01-perimetre.md` à `08-conclusion.md` + `annexes/` (dossier valorisation opposable pour cabinet d'évaluation).
- **86 fichiers archivés** dans [`docs/archive/`](../archive/) (audits, incidents, refactorings, guides, prompts de tests).
- **Dossier [`docs/audit/`](./)** : présent document, [`PROJECT_AUDIT_NOTES.md`](./PROJECT_AUDIT_NOTES.md), [`COVERAGE_REPORT.md`](./COVERAGE_REPORT.md), [`DATA_TRUTH_REPORT.md`](./DATA_TRUTH_REPORT.md), [`SAASISATION_REPORT.md`](./SAASISATION_REPORT.md), [`SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md), [`TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md), [`npm-audit.json`](./npm-audit.json), [`licenses.json`](./licenses.json), snapshot HTML `coverage/`.

### 9.5 Pipeline CI / CD

- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) : `lint`, `typecheck`, `test:coverage`, `build` sur Node 20 / Ubuntu, avec upload d'artefact couverture. Job unique, déclenché sur push et PR ciblant `main`.
- [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) : workflow déclenché sur tag `v*.*.*`, job `build` (docker build sans push) + job `deploy` désactivé par `if: false` tant qu'aucune cible n'est choisie.
- Hooks Git locaux : Husky 9 + lint-staged 15 + commitlint Conventional Commits.

## 10. Niveau de maturité estimé

| Axe | Niveau observé | Commentaire |
|---|---|---|
| Fonctionnel | Avancé | 10 sections applicatives implémentées dont 2 modules de veille de marque avec rapports exportables, planning, analytics, génération IA ; mode démo/réel explicite ; auth applicative scaffold |
| Technique | Avancé sur le métier, hétérogène sur l'UI | Services métier découpés Wave 2 (RealBrandIntelligenceService 2332L→399L façade, ai-service 1202L→196L façade) ; UI Dashboard / Analytics avec gating `isDemo` explicite ; couche IA modulaire |
| Sécurité | Significativement renforcée, risques résiduels documentés | Cookie `HttpOnly` LinkedIn, helmet 8.1 + CSP + rate-limit multi-niveau, jspdf bump (0 critical/0 high), 0 secret en clair ; historique git à purger, store sessions mono-instance, mode démo prod à neutraliser ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md)) |
| Maintenabilité | En progression | 491 warnings ESLint (vs 898 baseline), `noImplicitAny` activé, 3 gros fichiers découpés, logger structuré ; 5 fichiers > 1 000 lignes restent, `strictNullChecks` désactivé documenté |
| Scalabilité | Scaffold multi-tenant en place | Schéma `organizations` + `org_members` + `usage_events` + RLS + trigger ; `AuthContext` + `TenantContext` ; mode démo si Supabase absent ; pas encore appliqué en prod (action porteur) |
| Documentation | Élevée | 13 documents canoniques + 10 documents `docs/cabinet/` + 86 archivés + 7 rapports d'audit thématiques ; modèle de menaces, modèle de données, dette technique, parcours de démonstration, déploiement, télémétrie, multi-tenant |
| Industrialisation | Avancée | CI Node 20 (lint/typecheck/test:coverage/build), Docker multi-stage + docker-compose, GitHub Actions deploy workflow (placeholder), Husky + Conventional Commits, dossier de valorisation reproductible (`npm run dossier`), télémétrie applicative |

## 11. Éléments utiles pour valorisation

- **Volume de code utile** : 205 fichiers TS/TSX sous [`src/`](../../src/) pour ≈ 56 700 lignes (dont ≈ 10 300 de tests). Proxy serveur : 1 091 lignes (vs 598 baseline). Schéma SQL multi-tenant : 246 lignes. Configuration Vite : 362 lignes. Total mesurable opposable.
- **Complexité fonctionnelle** : 10 sections applicatives intégrées dans une seule coque, deux variantes de veille de marque (héritée + TDD), pipeline d'export multi-format (PDF, Excel, CSV, JSON) avec historisation, scaffold SaaS multi-tenant.
- **Différenciation** : orchestration métier propriétaire au-dessus de Perplexity ([`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) façade + 5 sous-modules ≈ 1 900 lignes), modélisation P.R.I.S.M. typée dans [`src/types/BrandIntelligenceTypes.ts`](../../src/types/BrandIntelligenceTypes.ts) (720 lignes), pipeline d'extraction et de normalisation des actions récentes typées (`product`, `partnership`, `acquisition`, `strategy`, `marketing`, `crisis`, `regulation`), score de confiance plafonné et fraîcheur des données, mode démo/réel explicite (≈ 180 valeurs simulées préfixées `DEMO_*`), scaffold multi-tenant Supabase avec RLS sur toutes les tables business.
- **Réutilisabilité** : composition par hooks (`usePerplexity`, `useHybridAI`, `useAI`, `useLinkedInAnalytics`, etc.), services métier découpés par sous-domaines ([`src/services/brand/real/`](../../src/services/brand/real/), [`src/services/brand/`](../../src/services/brand/), [`src/services/core/`](../../src/services/core/), [`src/services/export/`](../../src/services/export/), [`src/services/integration/`](../../src/services/integration/)), couche IA factorisée ([`src/lib/ai/`](../../src/lib/ai/)), primitives shadcn/ui standardisées (49 fichiers sous [`src/components/ui/`](../../src/components/ui/)).
- **Profondeur métier** : modélisation explicite SWOT + métriques contenu + métriques concurrence + KPIs réputation + recommandations actionnables + alertes catégorisées (`critical` / `warning` / `info` / `opportunities`) ; pipeline d'export PDF premium ([`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) 2 000 lignes + helpers purs extraits dans [`pdf/`](../../src/services/export/formats/pdf/)) ; télémétrie usage avec dictionnaire d'events extensible.
- **Propriété intellectuelle potentielle** : code et documentation libellés Korev AI ; [`LICENSE`](../../LICENSE) MIT, copyright Korev AI 2024-2026 ; modélisation P.R.I.S.M. et prompts internes propriétaires ([`src/services/brand/real/prompts.ts`](../../src/services/brand/real/prompts.ts)) ; schéma SQL multi-tenant propre ([`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql)).
- **Niveau d'intégration** : 4 fournisseurs externes branchés (Perplexity, OpenAI, Anthropic, LinkedIn OAuth + Marketing) avec proxy de durcissement pour Anthropic et LinkedIn ; Supabase scaffold pour auth + persistance multi-tenant ; dépendance externe maîtrisée (toutes licences permissives).
- **Actifs documentaires** : 4 fichiers racine + 13 documents canoniques + 10 documents `docs/cabinet/` + 7 rapports d'audit thématiques + script de génération de dossier de valorisation reproductible ([`scripts/build-valuation-dossier.sh`](../../scripts/build-valuation-dossier.sh), `npm run dossier`).
- **Tests** : 134 tests passants déterministes en moins de 2 s, couverture opposable (16,68 % lines / 31,44 % functions / 46,74 % branches), seuils CI bloquants, snapshot HTML versionné. Périmètre quarantiné documenté.
- **Preuves d'usage et de remise à niveau** : 122 commits sur `main`, 19 tags Git dont annotés `v0.2.0`, `v1.0.0`, `v1.1.0`, et tags de jalons `wave1-merged`, `wave2-merged`, `wave3-merged`, `valuation-prep-merged` ; historique de versions documenté dans [`CHANGELOG.md`](../../CHANGELOG.md) format Keep a Changelog ; trois vagues de remise à niveau matérialisées par les tags de snapshot `pre-agent{1,2,3,4,5,6}-snapshot` et `pre-wave{1,2,3}-merge-snapshot`.

## 12. Limites et points à confirmer

| Point | Pourquoi c'est à confirmer | Impact potentiel |
|---|---|---|
| Présence de clés API en clair dans l'historique Git | Tout secret historique doit être considéré compromis tant qu'il n'a pas été rotaté chez le fournisseur ; réécriture d'historique nécessaire | Élevé en sécurité tant que la rotation des 4 clés (Perplexity, OpenAI, Anthropic, LinkedIn `CLIENT_SECRET`) n'est pas effectuée par le porteur |
| Exécution du `git filter-repo` | Conditionnée à la rotation préalable des clés ; patterns prêts dans [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt), procédure dans [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §5 | Élevé en sécurité tant que non exécuté |
| Provisionnement du projet Supabase | Le scaffold multi-tenant est en place mais la base distante n'est pas provisionnée ; le mode démo est actif par défaut | Modéré — l'application boote sans crash, mais le SaaS n'est pas opérationnel tant que les vars Supabase ne sont pas posées |
| Activation du job `deploy` de [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) | Job désactivé par `if: false` tant qu'aucune cible n'est choisie (Vercel, Fly.io, Railway, Render, VPS — cf. [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md)) | Modéré — pas de déploiement automatisé en l'état |
| `VITE_LINKEDIN_REDIRECT_URI` à aligner avec le domaine final | OAuth LinkedIn requiert un redirect URI exact côté LinkedIn Developer | Faible techniquement, bloquant fonctionnellement |
| 273 tests en quarantaine documentée | Faux sentiment de sécurité — à réactiver par sprints itératifs ([`docs/TESTING.md`](../TESTING.md) §5) | Modéré — n'altère pas le runtime applicatif, mais limite la profondeur du gate CI |
| Couverture V8 à 16,68 % lines | Mesurée et opposable, mais insuffisante pour détecter une régression non triviale ; cible MT-1 dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md) : 25 % | Modéré — chiffre défendable s'il est présenté avec sa trajectoire |
| Métriques Instagram / X / Facebook du Dashboard et Analytics | Sont désormais soumises au gating `isDemo` ; en mode réel sans source connectée, `EmptyState` est affiché. Décision produit à confirmer : conserver le mode démo en démonstration externe vs forcer le mode réel | Modéré pour la valorisation — clarification du narratif fonctionnel |
| `strictNullChecks: false` | Désactivé documenté ([`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md)) ; 55 erreurs à résoudre dans une itération typing dédiée (~1-2 jours) | Faible — pas de blocage en production, dette de maintenabilité |
| 9 vulnérabilités modérées `npm audit` résiduelles | Toutes dans `devDependencies` (Vitest 2.x et son écosystème) ; bump Vitest 3.x reporté car breaking | Faible — pas d'impact sur le bundle livré |
| `licenses.json` régénéré post-bump jspdf | Confirmation des licences indirectes (390 packages, toutes permissives) | Faible — aucune copyleft forte identifiée |
| Conformité RGPD / AI Act non formalisée | Aucune analyse d'impact (PIA) documentée ; Supabase introduit la persistance de données utilisateurs (email, télémétrie indexée) | Élevé en cas d'exposition multi-utilisateurs publique |
| Adresse `security@korev.ai` annoncée comme placeholder dans [`SECURITY.md`](../../SECURITY.md) | À confirmer ou ajuster par Korev AI | Faible |
| Statut juridique des marques « Korev AI » et « Kora Digital Pilot » | À confirmer par le porteur | Faible techniquement, opposable au cabinet |
| Périmètre d'usage cible (poste interne vs SaaS multi-utilisateurs publique) | Détermine la sévérité finale des risques résiduels et le scope des évolutions à programmer | Élevé pour le dossier de valorisation |
| Plugin de tagging de composants Vite (devDependency) | Outillage de développement non requis pour build/run | Faible — à retirer du `package.json` et du [`vite.config.ts`](../../vite.config.ts) par le porteur si souhaité |

## 13. Conclusion technique

Le dépôt audité au commit `c6b3e4a` (tag `wave3-merged`, version `0.2.0`) correspond à un produit logiciel fonctionnellement avancé, structuré autour d'un service métier de veille de marque propriétaire (façade 399 lignes + 5 sous-modules ≈ 1 900 lignes) construit sous discipline TDD, exposé via une coque applicative SPA en dix sections fonctionnelles et soutenu par un proxy Node durci (1 091 lignes) qui isole les secrets serveur, porte la session LinkedIn en cookie `HttpOnly` et héberge la façade auth applicative multi-tenant. Le périmètre couvert (≈ 56 700 lignes TypeScript dans `src/`, 27 fichiers de tests, 13 documents canoniques opposables, 10 documents `docs/cabinet/` dédiés cabinet d'évaluation, 246 lignes de schéma SQL multi-tenant) traduit un effort substantiel d'ingénierie produit, de documentation et d'industrialisation.

La sécurité a été significativement durcie dans la séquence finale : migration des tokens LinkedIn vers cookie `HttpOnly` géré par le proxy, helmet 8.1 + CSP minimale paramétrée + rate-limit multi-niveau, bump `jspdf` résolvant une vulnérabilité critique et quatre hautes (résultat `npm audit` : 0 critical, 0 high, 9 modérées toutes en `devDependencies`), 0 secret en clair dans le tree courant, hygiène Git renforcée (Husky, lint-staged, commitlint, Conventional Commits). Les risques résiduels assumés sont explicitement listés et accompagnés de leur trajectoire de remédiation ([`docs/SECURITY.md`](../SECURITY.md), [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md), [`docs/TECH_DEBT.md`](../TECH_DEBT.md)) : purge de l'historique Git conditionnée à la rotation préalable des clés (action porteur, patterns prêts dans [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt)), store de sessions LinkedIn en mémoire à migrer avant scale, mode démo applicatif à neutraliser en production. Ces points sont opposables tant qu'ils sont présentés comme tels au cabinet.

La maturité technique a progressé sur les axes qualité (warnings ESLint -45 % à 491, `noImplicitAny` activé, découpage des deux plus gros fichiers métier en sous-modules purs), couverture (134 tests déterministes, 16,68 % lines opposable, snapshot HTML versionné), industrialisation (scaffold Docker multi-stage, GitHub Actions deploy workflow placeholder, télémétrie usage 5 events instrumentés) et vérité produit (mode démo/réel explicite avec ≈ 180 valeurs simulées centralisées et gating `isDemo` sur les vues consolidées). Les chantiers résiduels (réactivation des 273 tests quarantinés, découpage des 5 fichiers > 1 000 lignes restants, activation `strictNullChecks`, provisionnement Supabase, activation pipeline de déploiement) sont identifiés, datés et inventoriés ; aucun n'est de nature à remettre en cause la consistance technique du livrable.

En l'état, le code et la documentation forment un ensemble exploitable pour une évaluation par un cabinet d'apport, sous réserve que le porteur (i) confirme les points listés en §12, (ii) exécute la rotation des clés historiquement exposées et la réécriture d'historique correspondante, (iii) provisionne Supabase et choisisse une cible de déploiement pour activer le scaffold SaaS, et (iv) qualifie le périmètre d'usage cible (poste interne, démonstration commerciale, ou exposition multi-utilisateurs publique), dont dépend la sévérité finale des risques résiduels identifiés. Le dossier d'évaluation dédié [`docs/cabinet/`](../cabinet/) (10 fichiers, lecture sobre et opposable) est la porte d'entrée recommandée pour le cabinet.
