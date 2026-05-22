# Documentation Technique Standardisée — Kora Digital Pilot
## Version transmissible au commissaire aux apports

> **Avertissement de lecture.** Le présent document est rédigé en vue d'une transmission à un commissaire aux apports, un cabinet de valorisation, un avocat en propriété intellectuelle ou un expert technique mandaté dans le cadre d'une opération d'apport en société. Il décrit l'état observable du dépôt logiciel `kora-digital-pilot` au commit `c6b3e4a` (branche `main`, tag annoté `wave3-merged`, version `0.2.0`, snapshot 22 mai 2026). Les chiffres et faits techniques sont opposables aux sources du dépôt. Les réserves et points de remédiation sont explicitement identifiés, datés et catégorisés. Aucune affirmation de conformité externe (RGPD, AI Act, SOC 2, ISO 27001) n'est portée — ces points relèvent d'analyses dédiées à mener par le porteur.

---

## 0. Synthèse transmissible au commissaire aux apports

### Nature de l'actif logiciel

Kora Digital Pilot est une plateforme logicielle propriétaire éditée par **Korev AI**, à finalité de pilotage de communication digitale et de veille de marque. Le livrable est constitué d'une application web (Single Page Application) en TypeScript et React, adossée à un proxy Node.js durci et à un schéma de base de données multi-tenant Postgres (Supabase) activable. Le produit intègre une orchestration métier propriétaire au-dessus de quatre fournisseurs externes (Perplexity, OpenAI, Anthropic, LinkedIn) et expose dix sections fonctionnelles couvrant dashboard multi-plateforme, community management, deux variantes de veille de marque, génération de contenu, planning éditorial, analytics et bibliothèque exportable.

### Niveau de maturité

Produit **pré-stable opérationnel** en version `0.2.0`. La phase de durcissement matérialisée par les tags Git `wave1-merged`, `wave2-merged`, `wave3-merged` (mai 2026) a consolidé les dimensions sécurité, qualité, industrialisation et SaaSisation. Le pipeline d'intégration continue est actif et bloquant sur Node 20 (`lint`, `typecheck`, `tests`, `build`, couverture mesurée et opposable). Le produit est exploitable en interne et démontrable en l'état ; son industrialisation publique requiert l'exécution des points décisionnels listés en §0.4 et catégorisés en §13.

### Périmètre audité

Commit `c6b3e4a`, branche `main`, tag `wave3-merged`. Sources `src/` (205 fichiers TypeScript/TSX, ≈ 56 700 lignes), proxy `server.cjs` (1 091 lignes), schéma SQL `supabase/migrations/` (246 lignes), scaffold de conteneurisation (`Dockerfile`, `docker-compose.yml`), workflows GitHub Actions (`.github/workflows/`), configuration racine, ensemble documentaire `docs/` (13 documents canoniques + 10 documents `docs/cabinet/` + 7 rapports d'audit thématiques). Les répertoires `docs/archive/`, `dossier-valorisation/`, `node_modules/` et `dist/` sont référencés en tant qu'artefacts, hors analyse ligne à ligne.

### Éléments valorisables

1. **Code applicatif propriétaire** : ≈ 56 700 lignes TypeScript dans `src/` dont l'orchestration métier de veille de marque (modélisation P.R.I.S.M., service principal et cinq sous-modules d'extraction, parsing, prompts internes, recommandations, nettoyage), la couche d'intégration IA unifiée (façades OpenAI / Anthropic / fallback local), la couche LinkedIn (OAuth OpenID Connect + Marketing API + session cookie `HttpOnly`), la couche de protection anti-spam multi-niveau, et le pipeline d'export PDF premium.
2. **Modèle de données métier** : modélisation typée du domaine (`BrandIntelligenceTypes.ts`, 720 lignes) et schéma SQL multi-tenant avec RLS et trigger d'auto-provisionnement (`supabase/migrations/0001_init.sql`, 246 lignes).
3. **Prompts métier internes** : encodage propriétaire du savoir-faire d'analyse de marque (`src/services/brand/real/prompts.ts`) ; ces prompts constituent un actif distinct du code source au sens où ils encapsulent la méthodologie d'analyse Korev AI.
4. **Documentation opposable** : 13 documents canoniques `docs/`, 10 documents `docs/cabinet/` rédigés pour évaluation externe, 7 rapports d'audit thématiques (sécurité, données, couverture, typage strict, SaaSisation, notes complémentaires, présent référentiel).
5. **Industrialisation** : CI bloquante Node 20, hooks Git Conventional Commits, scaffold de conteneurisation et de déploiement, télémétrie usage applicative, script reproductible de constitution du dossier de valorisation.
6. **Historique d'effort R&D** : 122 commits sur `main`, 19 tags Git dont tags annotés de versions (`v0.2.0`, `v1.0.0`, `v1.1.0`) et tags de jalons (`wave1-merged`, `wave2-merged`, `wave3-merged`, `valuation-prep-merged`).

### Réserves maîtrisées

Les réserves techniques identifiées sont **explicitement documentées, datées et priorisées** dans le présent document (§13). Aucune ne remet en cause la valeur économique du livrable. Elles relèvent de trois catégories distinctes :

- **A. Points de sécurité à traiter avant exposition publique** — actions décisionnelles dirigeant : rotation des clés API providers (procédure documentée), exécution de l'assainissement de l'historique Git (patterns versionnés, exécution conditionnée à la rotation), neutralisation par configuration du mode de compatibilité démonstration au passage en production.
- **B. Points d'industrialisation avant montée en charge** — actions opérationnelles : provisionnement Supabase, activation de la cible de déploiement, distribution du store de sessions LinkedIn, élargissement progressif du périmètre de tests, atteinte de la couverture cible.
- **C. Dette technique normale de produit SaaS en phase pré-stable** — actions de maintenance continue : activation progressive de `strictNullChecks`, achèvement du découpage modulaire sur le périmètre restant, finalisation de la migration `console.*` vers logger structuré, traitement des doublons mineurs.

### Conclusion sur la transmissibilité

En l'état du commit `c6b3e4a`, le dépôt et l'ensemble documentaire constituent **un actif logiciel transmissible** dans le cadre d'une opération d'apport en société, sous réserve que (i) le porteur prenne les décisions de gouvernance listées en §0.4, (ii) la rotation des clés providers et l'assainissement de l'historique Git soient exécutés conformément à la procédure versionnée, et (iii) le régime de licence soit revu en cohérence avec l'intention d'exploitation commerciale (cf. §0.3). Le dossier d'évaluation dédié `docs/cabinet/` (10 documents factuels et opposables, lecture sobre) est la porte d'entrée recommandée pour le cabinet et l'avocat mandatés.

### 0.4 Décisions dirigeant requises avant transmission

| # | Décision | Nature | Effet attendu |
|---|---|---|---|
| 1 | **Régime de licence** | Gouvernance / juridique | Aligner la licence du dépôt avec l'intention d'exploitation commerciale exclusive ou de licensing encadré (cf. §12) |
| 2 | **Rotation des clés providers + assainissement historique Git** | Sécurité | Lever le risque résiduel d'exposition de secrets historiques (procédure documentée [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md)) |
| 3 | **Provisionnement Supabase et statut du mode de compatibilité démonstration** | Industrialisation / sécurité | Activer le régime SaaS multi-tenant prévu par le scaffold, neutraliser par configuration le régime démonstration en environnement de production |
| 4 | **Niveau de disclosure acceptable avant transmission** | Gouvernance / communication | Définir le périmètre des artefacts transmis (dépôt complet, archive scellée, documents `docs/cabinet/` uniquement, etc.) |

---

## 1. Identification du projet

- **Nom du projet** : Kora Digital Pilot — package npm `kora-digital-pilot` ([`package.json`](../../package.json) lignes 2-7).
- **Éditeur** : Korev AI (mention explicite copyright `LICENSE`, `package.json` champ `author`).
- **Type de projet** : application web propriétaire (Single Page Application) adossée à un proxy Node Express durci et à un schéma de base de données multi-tenant Postgres (Supabase) activable.
- **Domaine d'application** : communication digitale, brand intelligence, veille concurrentielle, analytics LinkedIn, planning éditorial multi-plateformes, génération de contenu assistée.
- **Statut observé** : pré-stable opérationnel — `version: 0.2.0` ([`package.json`](../../package.json) ligne 4), tag annoté Git `v0.2.0`. Entrée `[0.2.0]` du 22 mai 2026 alignée dans [`CHANGELOG.md`](../../CHANGELOG.md). Tags Git significatifs : `v0.2.0`, `wave1-merged`, `wave2-merged`, `wave3-merged`, `valuation-prep-merged`, plus tags de jalons (`pre-wave1-merge-snapshot`, `pre-wave2-merge-snapshot`, `pre-wave3-merge-snapshot`) et tags historiques (`v1.0.0`, `v1.1.0`).
- **Langage principal** : TypeScript 5.6 côté SPA (205 fichiers TypeScript/TSX, ≈ 56 700 lignes incluant les tests), JavaScript CommonJS Node côté proxy (1 091 lignes).
- **Frameworks principaux** : Vite 5.4, React 18.3, Tailwind CSS 3.4, shadcn/ui (Radix UI), React Router DOM 6.28, TanStack React Query 5.56, React Hook Form 7.53, Zod 3.23, Vitest 2.1, Express 4.21 avec Helmet 8.1, express-rate-limit 8.5, express-validator 7.3, cookie-parser 1.4, Supabase JS 2.78 (auth + Postgres + RLS), jsPDF 4.2.1.
- **Date de génération du présent document** : 2026-05-22.
- **Périmètre audité** : commit `c6b3e4a` sur la branche `main`, tag `wave3-merged`. Sources `src/`, proxy `server.cjs`, schéma Supabase `supabase/migrations/`, scaffold de déploiement (`Dockerfile`, `docker-compose.yml`, `.github/workflows/`), configuration racine, documentation `docs/`.

## 2. Résumé exécutif

Kora Digital Pilot est une plateforme propriétaire éditée par Korev AI, à finalité de pilotage de communication digitale et de veille de marque. Le livrable observé est une SPA React/TypeScript (205 fichiers TS/TSX pour ≈ 56 700 lignes) accompagnée d'un proxy Express (1 091 lignes) qui isole les secrets serveur LinkedIn et Anthropic, gère la session LinkedIn en cookie `HttpOnly`, et porte une couche d'authentification multi-tenant activable via Supabase. L'application s'organise en dix sections fonctionnelles accessibles via une coque `/app`.

Le cœur métier est concentré dans le service de veille de marque (façade `RealBrandIntelligenceService.ts` de 399 lignes + cinq sous-modules métier ≈ 1 900 lignes sous `src/services/brand/real/`), accompagné d'un orchestrateur multi-étapes, de sous-modules d'export multi-format (PDF avec helpers purs factorisés sous `src/services/export/formats/pdf/`, CSV, Excel, JSON), et de couches transverses (`src/lib/` : Perplexity, OpenAI et Anthropic via façade unifiée `src/lib/ai-service.ts` 196 lignes + sous-modules `src/lib/ai/`, LinkedIn, planning, anti-spam, logger structuré, clients Supabase, télémétrie usage).

Le niveau de maturité observé est celui d'un produit fonctionnellement avancé, avec une trajectoire de remédiation inventoriée et tracée ([`docs/TECH_DEBT.md`](../TECH_DEBT.md), [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md)), et qui a absorbé trois phases coordonnées de remise à niveau matérialisées par tags Git annotés (sécurité + intégration continue + vérité produit ; qualité TypeScript + packaging valorisation ; SaaSisation). La sécurité a été significativement durcie : tokens LinkedIn migrés en cookie `HttpOnly` géré côté proxy ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md)), absence de secret en clair dans le tree courant (scan post-merge sur patterns Perplexity, OpenAI, Anthropic, LinkedIn — 0 match), bump `jspdf` 3.0 → 4.2.1 résolvant une vulnérabilité critique et quatre vulnérabilités hautes, helmet 8.1 + CSP minimale paramétrée + rate-limit multi-niveau, dotenv chargé en tête de proxy, body limit 1 Mo.

Les réserves techniques sont explicitement identifiées, datées et catégorisées en §13. Elles relèvent de chemins d'industrialisation identifiés et de points de décision dirigeant, et non d'obstacles structurels à l'exploitabilité du produit.

## 3. Périmètre fonctionnel constaté

Liste établie depuis [`src/App.tsx`](../../src/App.tsx), [`src/pages/Index.tsx`](../../src/pages/Index.tsx), [`docs/FEATURES.md`](../FEATURES.md) et inspection directe des composants.

| Fonctionnalité | Statut observé | Fichiers / modules concernés | Commentaire |
|---|---|---|---|
| Landing page publique | Implémenté | [`src/pages/Landing.tsx`](../../src/pages/Landing.tsx) | Route `/` |
| Authentification applicative | Implémenté ; régime SaaS multi-tenant activable | [`src/pages/Auth.tsx`](../../src/pages/Auth.tsx), [`src/components/auth/`](../../src/components/auth/), [`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx) | Route `/auth`, garde `RequireAuth`. Régime de compatibilité démonstration en place si Supabase non provisionné |
| Coque applicative à 10 sections | Implémenté | [`src/pages/Index.tsx`](../../src/pages/Index.tsx), [`src/components/Sidebar.tsx`](../../src/components/Sidebar.tsx) | Route `/app`, navigation par état `activeSection` |
| Dashboard multi-plateforme | Implémenté avec régime données réelles / démonstration explicite | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx), [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts), [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts), [`src/contexts/DataModeContext.tsx`](../../src/contexts/DataModeContext.tsx) | LinkedIn réel via API si token ; sources tierces Instagram et X soumises à gating explicite `isDemo` avec composant `EmptyState` en mode réel sans source connectée |
| Community Manager — pilotage | Implémenté | [`src/components/CommunityManagerDashboard.tsx`](../../src/components/CommunityManagerDashboard.tsx) | Section `cm-dashboard` |
| Community Manager — recherche par domaine | Implémenté | [`src/components/CommunityManagerDomainDashboard.tsx`](../../src/components/CommunityManagerDomainDashboard.tsx) | Section `cm-domain-search`, enrichissement Perplexity |
| Veille de marque (variante 1) | Implémenté | [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) (1 475 lignes), [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (399 lignes façade) + [`src/services/brand/real/`](../../src/services/brand/real/) | Section `brand-monitoring`, export PDF, télémétrie `report.generated` et `export.pdf` |
| Veille de marque (variante TDD) | Implémenté | [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) (1 296 lignes) | Section `brand-intelligence-tdd`, couverture unitaire sur le service principal |
| Inspiration éditoriale assistée | Implémenté | [`src/components/InspirationAI.tsx`](../../src/components/InspirationAI.tsx), [`src/hooks/useAI.ts`](../../src/hooks/useAI.ts), [`src/hooks/useHybridAI.ts`](../../src/hooks/useHybridAI.ts), [`src/lib/ai/`](../../src/lib/ai/) | Section `inspiration`, OpenAI et Anthropic via façade unifiée |
| Génération d'images | Implémenté | [`src/components/ImageGenerator.tsx`](../../src/components/ImageGenerator.tsx) | Section `images` |
| Planning éditorial | Implémenté | [`src/components/PlanningWithPerplexity.tsx`](../../src/components/PlanningWithPerplexity.tsx), [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | Section `planning`, persistance navigateur |
| Analytics détaillées | Implémenté avec régime données réelles / démonstration explicite | [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) (1 018 lignes) | LinkedIn via API si token ; sources tierces via `DEMO_ANALYTICS_BY_PERIOD` ou `EmptyState` |
| Bibliothèque et exports | Implémenté | [`src/components/Library.tsx`](../../src/components/Library.tsx), [`src/services/export/`](../../src/services/export/), [`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) (2 000 lignes) + [`src/services/export/formats/pdf/`](../../src/services/export/formats/pdf/) | Section `library`, formats PDF, Excel, CSV, JSON |
| Réglages utilisateur | Implémenté | [`src/pages/Settings.tsx`](../../src/pages/Settings.tsx) | Route `/settings` |
| Banc de test API | Implémenté, route restreinte au mode développement | [`src/components/TestAPI.tsx`](../../src/components/TestAPI.tsx) | Route `/test-api`, garde `import.meta.env.DEV` |
| Diagnostic connecteurs | Implémenté, route restreinte au mode développement | [`src/components/DiagnosticTest.tsx`](../../src/components/DiagnosticTest.tsx) | Route `/diagnostic`, garde DEV |
| Authentification LinkedIn OpenID Connect | Implémenté avec session cookie `HttpOnly` | [`src/components/LinkedInAuth.tsx`](../../src/components/LinkedInAuth.tsx), [`src/components/LinkedInCallback.tsx`](../../src/components/LinkedInCallback.tsx), [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (1 428 lignes), proxy `/api/auth/linkedin/{session,me,logout}` | Route `/auth/linkedin/callback`, tokens en cookie `HttpOnly` côté serveur ([`docs/SECURITY.md`](../SECURITY.md) §3) |
| Régime données réelles / démonstration | Implémenté | [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts), [`src/contexts/DataModeContext.tsx`](../../src/contexts/DataModeContext.tsx), [`src/components/DataModeBanner.tsx`](../../src/components/DataModeBanner.tsx), [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts), [`src/components/EmptyState.tsx`](../../src/components/EmptyState.tsx) | Variable `VITE_DATA_MODE`, valeurs simulées préfixées `DEMO_*`, badges contextuels `DataSourceBadge` |
| Télémétrie usage | Implémenté | [`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts), endpoint proxy `POST /api/usage` | 5 events instrumentés : `auth.login.success`, `auth.signup.success`, `linkedin.connect.success`, `report.generated`, `export.pdf` ([`docs/USAGE_LOGGING.md`](../USAGE_LOGGING.md)) |
| Multi-tenant (organisations et memberships) | Implémenté côté base de données et contextes UI ; activable par provisionnement Supabase | [`src/contexts/TenantContext.tsx`](../../src/contexts/TenantContext.tsx), [`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql) | RLS Postgres sur tables business, trigger d'auto-provisionnement d'organisation au signup |
| Protections anti-spam API | Implémenté | [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts), [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts), [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | Widgets `ApiHealthDashboard`, `GlobalApiBlockerStatus` |
| Mode affichage continu (TV) | Implémenté | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx) | Affichage open space |

## 4. Architecture technique

### 4.1 Vue d'ensemble

Application client (SPA) servie en statique après build Vite, accompagnée d'un proxy Node/Express qui (i) tient hors du bundle les secrets serveur (LinkedIn `CLIENT_SECRET`, clé Anthropic), (ii) gère la session LinkedIn en cookie `HttpOnly`, et (iii) expose les endpoints d'authentification applicative et de télémétrie usage avec validation JWT Supabase. Architecture détaillée dans [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) et [`docs/AUTH_MULTI_TENANT.md`](../AUTH_MULTI_TENANT.md).

```
Navigateur (SPA React, port 8088)
  ├── Cookie HttpOnly kora_linkedin_session   (session LinkedIn isolée serveur)
  ├── Session Supabase Auth (JWT, persistSession)
  ├── localStorage (planning, historiques exports, paramètres anti-spam — pas de token)
  ├── Appels directs --> API Perplexity   (clé VITE_*)
  ├── Appels directs --> API OpenAI       (clé VITE_*)
  ├── Appels         --> Supabase Postgres (RLS multi-tenant)
  └── Appels         --> Proxy Express server.cjs (port 3001)
                          ├── --> API Anthropic        (clé serveur)
                          ├── --> API LinkedIn         (CLIENT_SECRET serveur)
                          ├── --> Supabase admin       (service role, télémétrie)
                          └── --> Sortie : /api/me, /api/usage, /api/auth/linkedin/*
```

### 4.2 Frontend

- **Bundler** : Vite 5.4 ([`vite.config.ts`](../../vite.config.ts), 362 lignes) ; multi-environnements DEV / STAGING / PRODUCTION, ports 8088 / 9088 / 10088, chunking manuel (`vendor-react`, `vendor-ui`, `vendor-charts`, `pdf-utils`, `brand-intelligence`).
- **Framework** : React 18.3 + TypeScript 5.6.
- **Configuration TypeScript** : `noImplicitAny: true` activé ([`tsconfig.app.json`](../../tsconfig.app.json) ligne 25). Le périmètre `strictNullChecks` et `noUnusedLocals/Parameters` reste désactivé par décision tracée dans [`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md) (55 occurrences ciblées, trajectoire d'activation programmée).
- **Styling** : Tailwind CSS 3.4 et shadcn/ui (49 primitives sous [`src/components/ui/`](../../src/components/ui/)).
- **État serveur** : TanStack React Query 5.56. Routage : React Router DOM 6.28. Validation : Zod 3.23, React Hook Form 7.53.
- **Contexts globaux** : `AuthProvider` + `TenantProvider` + `DataModeProvider` ([`src/App.tsx`](../../src/App.tsx)).
- **Visualisation** : Recharts 2.15. Export PDF : jsPDF 4.2.1.

### 4.3 Backend (proxy)

[`server.cjs`](../../server.cjs) — 1 091 lignes, Express 4.21 avec stack de sécurité durci.

- **Sécurité d'entrée** : `helmet` 8.1 avec CSP minimale paramétrée (directives `defaultSrc`, `scriptSrc 'self'`, `script-src-attr 'none'`, `styleSrc`, `imgSrc`, `connectSrc` listant explicitement LinkedIn, Anthropic, OpenAI, Perplexity, Supabase ; `frameAncestors 'none'`, `objectSrc 'none'`, HSTS conditionnel en production).
- **Rate limiting** (`express-rate-limit` 8.5) : limiteur global 300 req/min sur `/api/`, limites spécifiques par endpoint (50/min LinkedIn token, 30/min Anthropic, 30/min session LinkedIn, 60/min logout, 120/min `/api/me` et `/api/auth/linkedin/me`, 240/min `/api/usage`, 100/min profile LinkedIn).
- **Body** : JSON limit 1 Mo strict avec validation, urlencoded limit 1 Mo.
- **Session LinkedIn** : cookie `kora_linkedin_session` `HttpOnly` avec `SameSite=Lax` et `Secure` en production, scope `/api/auth`.
- **Authentification applicative** : middleware `requireUser` valide le JWT Supabase (`Authorization: Bearer`) via le client admin avec service role, régime de compatibilité démonstration si Supabase non configuré.
- **Variables d'env** : chargées en tête (`require('dotenv').config()`).
- **Logger** : structuré (méthode, path, statut, IP, durée) — pas de body, pas de token.
- **Endpoints exposés** (référencés dans `server.cjs`) :
  - `POST /api/linkedin/token` — échange code OAuth contre access token (ligne 235).
  - `POST /api/linkedin/profile` — récupération de profil LinkedIn (ligne 421).
  - `POST /api/anthropic/messages` — forward authentifié vers Anthropic (ligne 335).
  - `POST /api/auth/linkedin/session` — pose le cookie `HttpOnly` après échange OAuth (ligne 603).
  - `GET /api/auth/linkedin/me` — retourne le profil mis en cache (ligne 656).
  - `POST /api/auth/linkedin/logout` — invalide la session, clear cookie (ligne 646).
  - `GET /api/me` — retourne utilisateur et organisation courants (ligne 866).
  - `POST /api/usage` — télémétrie append-only vers `usage_events` (ligne 882).
  - `GET /api/health` — sonde de disponibilité avec statut Supabase (ligne 957).
  - `GET /api/metrics` — métriques internes (mode développement uniquement, ligne 986).

### 4.4 Persistance

Deux régimes coexistent, sélectionnés par la présence des variables Supabase :

- **Régime SaaS multi-tenant** (Supabase provisionné) — schéma [`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql) (246 lignes) :
  - `public.organizations` (id uuid, name, slug unique, plan, created_at) — racine tenant.
  - `public.org_members` (org_id, user_id, role `owner` / `admin` / `member`, contrainte d'unicité (org_id, user_id)) — membership Supabase Auth.
  - `public.usage_events` (org_id, user_id, event_name, properties jsonb, created_at indexé descendant) — télémétrie append-only.
  - `public.linkedin_sessions` — scaffold prévu pour la distribution du store de sessions (point d'industrialisation §13.B).
  - RLS activée sur toutes les tables business ; policies imposent que chaque utilisateur ne voie et n'écrive que les rows liés à ses organisations.
  - Trigger `kora_on_auth_user_created` auto-provisionne une organisation perso et une membership `owner` au signup Supabase Auth.
- **Régime de compatibilité démonstration** (Supabase non provisionné) — persistance navigateur ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §2). Clés observées : `linkedin_oauth_state` (état OAuth non sensible), `linkedin_last_sync`, `linkedin_cached_metrics`, `kora_planning_data`, `kora_weekly_plans`, `kora_export_history`, `kora-export-history` (doublon documenté, point §13.C), `perplexity_protection_settings`, `perplexity_protection_history`, `perplexity_usage_stats`. Les tokens LinkedIn ne sont plus persistés côté navigateur depuis la migration cookie `HttpOnly`.

### 4.5 Intégrations externes

| Intégration | Mode d'accès | Module client | Statut |
|---|---|---|---|
| Perplexity API | Appel direct depuis bundle | [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) | Opérationnel sous clé `VITE_PERPLEXITY_API_KEY` |
| OpenAI API | Appel direct depuis bundle | [`src/lib/ai/openai-client.ts`](../../src/lib/ai/openai-client.ts) via façade [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) | Opérationnel sous clé `VITE_OPENAI_API_KEY` |
| Anthropic API | Via proxy `/api/anthropic/messages` | [`src/lib/ai/anthropic-client.ts`](../../src/lib/ai/anthropic-client.ts) | Opérationnel via proxy, clé strictement serveur |
| LinkedIn OAuth + Marketing | Via proxy `/api/auth/linkedin/*` et `/api/linkedin/*` | [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts), session cookie `HttpOnly` | Opérationnel sous configuration LinkedIn Developer |
| Supabase (auth + Postgres + RLS) | SDK browser + admin server-side | [`src/lib/supabase-client.ts`](../../src/lib/supabase-client.ts), [`src/lib/supabase-admin.cjs`](../../src/lib/supabase-admin.cjs) | Scaffold complet, activable par provisionnement |

### 4.6 Authentification

- **Authentification applicative** : Supabase Auth (email et mot de passe) via [`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx). Page `/auth` ([`src/pages/Auth.tsx`](../../src/pages/Auth.tsx)) double onglet signin / signup avec Zod et React Hook Form. Garde `RequireAuth` ([`src/components/auth/RequireAuth.tsx`](../../src/components/auth/RequireAuth.tsx)) sur les routes protégées. **Régime de compatibilité démonstration** activé si `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` ne sont pas posées au build — neutralisation par configuration en production (point §13.A).
- **Multi-tenant** : [`src/contexts/TenantContext.tsx`](../../src/contexts/TenantContext.tsx) charge les memberships de l'utilisateur courant, expose `currentOrg`, `orgs`, `switchOrg`. Bootstrap automatique d'une organisation perso au signup via trigger SQL.
- **Authentification LinkedIn (OpenID Connect)** : implémentée côté proxy pour préserver le `CLIENT_SECRET`. Session matérialisée par cookie `kora_linkedin_session` `HttpOnly`. Risque XSS-token classé « très faible » post-migration ([`docs/SECURITY.md`](../SECURITY.md) §3).

### 4.7 Déploiement

Scaffold complet livré et documenté dans [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) :

- [`Dockerfile`](../../Dockerfile) multi-stage Node 20 Alpine.
- [`docker-compose.yml`](../../docker-compose.yml) avec service `app` et service `postgres` 15 (développement local sans Supabase managé).
- [`.dockerignore`](../../.dockerignore).
- [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) : workflow déclenché sur tag `v*.*.*`, job `build` (docker build sans push) et job `deploy` désactivé par `if: false` tant que la cible de déploiement n'est pas choisie par le porteur (point §13.B).
- Cibles candidates documentées : Vercel + Railway / Render, Fly.io mono-conteneur, Render full-stack, VPS classique.

### 4.8 Intégration continue

Workflow [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) : `npm ci`, `lint`, `typecheck`, `test:coverage`, `build`, sur Ubuntu et Node 20, upload d'artefact `coverage/`. Job déclenché sur push et pull request ciblant `main`. **Pipeline bloquant** (seuils de couverture, lint et typecheck).

Hooks Git locaux : Husky 9 + lint-staged 15 + commitlint Conventional Commits ([`commitlint.config.cjs`](../../commitlint.config.cjs), [`.husky/pre-commit`](../../.husky/pre-commit), [`.husky/commit-msg`](../../.husky/commit-msg)). Format Prettier ([`.prettierrc`](../../.prettierrc), [`.prettierignore`](../../.prettierignore)).

## 5. Structure du dépôt

| Chemin | Rôle identifié | Importance |
|---|---|---|
| [`src/`](../../src/) | Code source SPA (205 fichiers TS/TSX, ≈ 56 700 lignes) | Critique |
| [`src/pages/`](../../src/pages/) | Pages racines (`Index`, `Landing`, `Settings`, `Auth`, `NotFound`) | Critique |
| [`src/components/`](../../src/components/) | Composants applicatifs (102 fichiers) dont dashboards, widgets, intégration LinkedIn, primitives shadcn/ui sous `ui/`, sous-dossier `auth/` (SignIn, SignUp, RequireAuth) | Critique |
| [`src/components/enhanced/`](../../src/components/enhanced/) | Variante TDD `BrandIntelligenceDashboard.tsx` | Critique |
| [`src/services/`](../../src/services/) | Logique métier (32 fichiers) : `RealBrandIntelligenceService.ts` façade et sous-modules `brand/real/`, `BrandIntelligenceOrchestrator.ts`, `ContentDeduplicationService.ts`, `core/`, `export/` avec helpers extraits sous `formats/pdf/`, `integration/` | Critique |
| [`src/lib/`](../../src/lib/) | Couches techniques transverses (24 fichiers) : `perplexity-service.ts`, `ai-service.ts` façade et sous-modules `ai/`, `linkedin-api.ts`, `planning-service.ts`, anti-spam (`global-api-blocker.ts`, `perplexity-protection-middleware.ts`, `server-detection.ts`), `logger.ts`, clients Supabase, `usage-logger.ts`, `data-mode.ts`, `demo-data.ts` | Critique |
| [`src/contexts/`](../../src/contexts/) | Contexts globaux : `AuthContext.tsx`, `TenantContext.tsx`, `DataModeContext.tsx` | Critique |
| [`src/hooks/`](../../src/hooks/) | Hooks React métier (8 fichiers) | Élevée |
| [`src/types/`](../../src/types/) | Types métier (`BrandIntelligenceTypes.ts` 720 L, `brand-analysis.ts`) | Élevée |
| [`src/test/`](../../src/test/), [`src/tests/`](../../src/tests/) | Suites Vitest (27 fichiers de test) | Élevée |
| [`server.cjs`](../../server.cjs) | Proxy Express durci avec session cookie, authentification multi-tenant et télémétrie (1 091 lignes) | Critique |
| [`supabase/`](../../supabase/) | Schéma multi-tenant : `migrations/0001_init.sql` (246 lignes), `seed.sql`, `README.md` | Critique |
| [`Dockerfile`](../../Dockerfile), [`docker-compose.yml`](../../docker-compose.yml), [`.dockerignore`](../../.dockerignore) | Scaffold de conteneurisation | Élevée |
| [`scripts/build-valuation-dossier.sh`](../../scripts/build-valuation-dossier.sh) | Construction reproductible du dossier de valorisation (`npm run dossier`) | Élevée |
| [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt) | Patterns versionnés pour l'assainissement de l'historique Git | Élevée |
| [`docs/`](../) | Documentation opposable canonique (13 fichiers .md) | Élevée |
| [`docs/cabinet/`](../cabinet/) | Dossier d'évaluation pour cabinet (10 fichiers, lecture sobre opposable) | Critique |
| [`docs/audit/`](./) | Artefacts d'audit (présent document, 6 rapports thématiques, `npm-audit.json`, `licenses.json`, snapshot HTML `coverage/`) | Élevée |
| [`docs/archive/`](../archive/) | Historique de post-mortems, audits et refactorings (86 fichiers Markdown) | Indicative |
| [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) | Workflow CI (lint, typecheck, tests, build, couverture) | Critique |
| [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) | Workflow de déploiement (scaffold ; job `deploy` activable sur décision dirigeant) | Élevée |
| [`vite.config.ts`](../../vite.config.ts), [`vitest.config.ts`](../../vitest.config.ts), [`eslint.config.js`](../../eslint.config.js), [`tsconfig.app.json`](../../tsconfig.app.json), [`tsconfig.json`](../../tsconfig.json) | Configurations build, tests, lint, typage | Élevée |
| [`package.json`](../../package.json) | Manifeste npm (`kora-digital-pilot`, `private: true`, `version: 0.2.0`, license MIT, author Korev AI) | Critique |
| [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md), [`LICENSE`](../../LICENSE) | Fichiers racine de gouvernance projet | Élevée |
| [`.env.example`](../../.env.example), [`.env.local.example`](../../.env.local.example), [`env.example`](../../env.example) | Gabarits d'environnement sanitisés (placeholders, aucune valeur réelle — vérification visuelle) | Élevée |

## 6. Modules propriétaires identifiés

Les modules listés ci-dessous constituent les **actifs logiciels propriétaires Korev AI** au sens de l'effort d'ingénierie et de la spécificité métier, indépendamment du régime de licence courant du dépôt (cf. §12 sur le cadre de propriété intellectuelle).

| Module | Rôle | Niveau de spécificité | Éléments valorisables |
|---|---|---|---|
| [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (399 L façade) + [`src/services/brand/real/`](../../src/services/brand/real/) (5 sous-modules ≈ 1 900 L) | Orchestration métier de la veille de marque (P.R.I.S.M.) : extraction, parsing, prompts internes, recommandations, nettoyage de contenu | Élevé — logique propriétaire au-dessus de Perplexity | Découpage modulaire en sous-modules purs, couverture unitaire sur le service principal, structure de prompts internes, pipeline d'extraction et de normalisation typées |
| [`src/services/BrandIntelligenceOrchestrator.ts`](../../src/services/BrandIntelligenceOrchestrator.ts) | Coordination multi-étapes de l'analyse de marque | Élevé | Composition des sous-services métier |
| [`src/services/ContentDeduplicationService.ts`](../../src/services/ContentDeduplicationService.ts) | Déduplication de contenu sur les sorties d'inférence | Élevé | Heuristiques propriétaires |
| [`src/services/brand/`](../../src/services/brand/) (`DataAggregationService.ts` 824 L, `parsers/`, `report-generator/`, `queries/`, `brand-analysis-orchestrator/`, `api-service/`) | Sous-domaine veille de marque modulaire | Élevé | Découpage par responsabilité |
| [`src/services/core/BrandAnalysisCore.ts`](../../src/services/core/BrandAnalysisCore.ts) (1 008 L) | Pipeline d'analyse de marque cœur | Élevé | Algorithmes propres |
| [`src/services/integration/ReportGenerationService.ts`](../../src/services/integration/ReportGenerationService.ts) (975 L) | Pont entre la veille de marque et les exports | Moyen à élevé | Format de rapport unifié |
| [`src/services/export/`](../../src/services/export/) avec [`formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) (2 000 L) + helpers purs [`formats/pdf/`](../../src/services/export/formats/pdf/) | Orchestration des exports multi-format avec historisation et métadonnées | Moyen à élevé | Mise en forme premium, helpers purs factorisés |
| [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (1 428 L) | Couche LinkedIn (OpenID, Marketing API, session cookie `HttpOnly`) | Élevé | Intégration OAuth complète, restauration de session, hooks d'analytics et de stats |
| [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) (196 L façade) + [`src/lib/ai/`](../../src/lib/ai/) | Couche unifiée d'inférence (OpenAI, Anthropic, fallback local) | Moyen à élevé | Bascule entre fournisseurs, prompts internes, fallback local |
| [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) | Couche Perplexity (requête, parsing, retries) | Élevé | Encapsulation propre du fournisseur |
| [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts), [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts), [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | Protections anti-spam et détection d'incident serveur côté client | Moyen | Plafonds configurables, backoff exponentiel |
| [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | Modèle planning éditorial multi-semaines | Moyen | Modèle typé propre |
| [`src/lib/logger.ts`](../../src/lib/logger.ts) | Logger centralisé (no-op en production via `import.meta.env.PROD`) | Moyen | Base de la trajectoire de migration `console.*` |
| [`src/lib/supabase-client.ts`](../../src/lib/supabase-client.ts), [`src/lib/supabase-admin.cjs`](../../src/lib/supabase-admin.cjs), [`src/lib/auth-client.ts`](../../src/lib/auth-client.ts) | Couche Supabase (client browser et admin server-side) | Moyen | Isolation stricte des clés (service role server-only) |
| [`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts) | Télémétrie usage append-only avec dictionnaire d'events extensible | Moyen | 5 events instrumentés ([`docs/USAGE_LOGGING.md`](../USAGE_LOGGING.md)) |
| [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts), [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts) | Régime données réelles / démonstration et source unique des valeurs simulées | Moyen | Contrat de vérité produit, valeurs préfixées `DEMO_*` |
| [`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx), [`src/contexts/TenantContext.tsx`](../../src/contexts/TenantContext.tsx) | Authentification applicative et tenant multi-tenant | Moyen à élevé | Scaffold complet activable |
| [`src/types/BrandIntelligenceTypes.ts`](../../src/types/BrandIntelligenceTypes.ts) (720 L) | Types métier consolidés P.R.I.S.M. | Élevé | Modélisation détaillée du domaine |
| [`src/hooks/`](../../src/hooks/) | Hooks d'orchestration React | Moyen | Réutilisabilité dans la SPA |
| [`server.cjs`](../../server.cjs) (1 091 L) | Proxy durci avec session cookie, authentification multi-tenant et télémétrie | Moyen à élevé | Isolation des secrets, façade auth applicative |
| [`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql) (246 L) | Schéma SQL multi-tenant avec RLS et trigger d'auto-provisionnement | Élevé | Modèle SaaS défendable et appliquable |

## 7. Dépendances et composants externes

Inventaire détaillé dans [`docs/LICENSES.md`](../LICENSES.md) et [`docs/audit/licenses.json`](./licenses.json) (régénéré post-bump jsPDF, 390 packages — toutes licences permissives, aucune GPL / AGPL / SSPL / BUSL identifiée).

| Dépendance | Usage observé | Criticité | Commentaire |
|---|---|---|---|
| `react` 18.3, `react-dom` 18.3 | Framework UI | Critique | Suivi standard du cycle de vie React |
| `react-router-dom` 6.28 | Routage SPA | Critique | — |
| `@tanstack/react-query` 5.56 | Cache et orchestration de requêtes | Élevée | — |
| `vite` 5.4 | Bundler / dev server | Critique | — |
| `typescript` 5.6 | Typage statique | Critique | `noImplicitAny` activé, trajectoire `strictNullChecks` programmée (§13.C) |
| `tailwindcss` 3.4, `@tailwindcss/typography` 0.5 | Styling | Élevée | — |
| `@radix-ui/*` (27 paquets) | Primitives UI accessibles | Élevée | — |
| `react-hook-form` 7.53, `@hookform/resolvers` 3.9, `zod` 3.23 | Formulaires et validation | Élevée | — |
| `recharts` 2.15 | Visualisation Analytics | Élevée | — |
| `jspdf` 4.2.1 | Export PDF | Élevée | Bumpé 3.0 → 4.2.1, résolution de 1 vulnérabilité critique et 4 hautes ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md)) |
| `express` 4.21, `helmet` 8.1, `express-rate-limit` 8.5, `express-validator` 7.3, `cors` 2.8, `node-fetch` 2.7, `cookie-parser` 1.4, `cookie` 1.1 | Proxy serveur durci | Critique | — |
| `@supabase/supabase-js` 2.78 | Authentification + Postgres + RLS | Élevée | Dépendance fournisseur managé ; régime de compatibilité démonstration en place si non configuré |
| `dotenv` 16.5 | Chargement variables d'environnement | Critique | — |
| `@vitejs/plugin-react` 4.3, `vitest` 2.1, `@vitest/coverage-v8` 2.1, `@vitest/ui` 2.1 | Build et tests | Élevée | Vulnérabilités modérées résiduelles confinées à l'écosystème Vitest 2.x — hors bundle livré |
| `@testing-library/react` 16.3, `@testing-library/jest-dom` 6.6, `@testing-library/user-event` 14.6, `jsdom` 26.1 | Tests UI | Élevée | — |
| `eslint` 9.13, `typescript-eslint` 8.59, `eslint-plugin-react-hooks` 5, `eslint-plugin-react-refresh` 0.4, `eslint-config-prettier` 10, `prettier` 3.8 | Lint et format | Élevée | — |
| `@commitlint/cli` 20.5, `@commitlint/config-conventional` 20.5, `husky` 9, `lint-staged` 15 | Hygiène Git Conventional Commits | Élevée | — |
| `class-variance-authority` 0.7, `clsx` 2.1, `tailwind-merge` 2.5 | Composition de classes UI | Moyenne | — |
| `lucide-react` 0.462 | Icônes | Moyenne | — |
| `date-fns` 3.6, `react-day-picker` 8.10 | Dates | Moyenne | — |
| `cmdk` 1.0, `embla-carousel-react` 8.3, `input-otp` 1.2, `next-themes` 0.3, `react-resizable-panels` 2.1, `sonner` 1.5, `vaul` 0.9, `tailwindcss-animate` 1.0 | Composants et UX | Moyenne | — |
| `concurrently` 9.1 | Orchestration scripts npm | Faible | — |
| Plugin de tagging de composants Vite (devDependency) | Outillage de développement uniquement, non requis pour build/run | Faible | Retirable sans impact fonctionnel (cf. [`docs/audit/PROJECT_AUDIT_NOTES.md`](./PROJECT_AUDIT_NOTES.md)) |

**Vulnérabilités `npm audit` résiduelles** ([`docs/audit/npm-audit.json`](./npm-audit.json)) : 9 modérées, **0 critique, 0 haute**. La totalité des occurrences est confinée à `devDependencies` (Vitest 2.x et son écosystème, `brace-expansion`, `vite`, plugin de tagging de développement). **Le bundle livré au navigateur ne porte aucune vulnérabilité connue.**

**Conformité licences** : aucune dépendance directe sous licence copyleft forte identifiée. L'audit transitif sur 390 packages ([`docs/audit/licenses.json`](./licenses.json)) confirme une distribution sous régime de licences permissives uniquement (MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause).

## 8. Données, sécurité et conformité

### 8.1 Gestion des secrets

- **Fichiers d'environnement** : [`.env`](../../.env) (non versionné, `.gitignore`), [`.env.local`](../../.env.local) (local, non versionné), [`.env.example`](../../.env.example), [`.env.local.example`](../../.env.local.example), [`env.example`](../../env.example) (gabarits sanitisés, valeurs placeholder uniquement — vérification visuelle directe). `.gitignore` durci (`.env`, `.env.local`, `.env.*.local`, `coverage/`, `dossier-valorisation/`).
- **Scan secrets** : tree courant scanné post-merge sur patterns Perplexity, OpenAI, Anthropic, LinkedIn — **0 match** ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §3).
- **Catégorisation des clés** ([`docs/SECURITY.md`](../SECURITY.md) §2) :
  - `VITE_PERPLEXITY_API_KEY` et `VITE_OPENAI_API_KEY` injectées dans le bundle client — traitées comme publiques de fait, sous rotation et plafond budgétaire fournisseur.
  - LinkedIn `CLIENT_SECRET`, clé Anthropic, `SUPABASE_SERVICE_ROLE_KEY` strictement serveur — jamais préfixés `VITE_*` (vérification dans le tree).
- **Procédure de rotation** documentée ([`docs/SECURITY.md`](../SECURITY.md) §5, [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §5).
- **Assainissement historique Git** : patterns prêts et versionnés dans [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt) ; exécution conditionnée à la rotation préalable des 4 clés providers (action décisionnelle dirigeant — §13.A).

### 8.2 Authentification et autorisations

- **Authentification applicative** : Supabase Auth scaffold activable ([`src/contexts/AuthContext.tsx`](../../src/contexts/AuthContext.tsx), [`src/pages/Auth.tsx`](../../src/pages/Auth.tsx), [`src/components/auth/RequireAuth.tsx`](../../src/components/auth/RequireAuth.tsx)) avec régime de compatibilité démonstration en l'absence de variables Supabase. Le middleware `requireUser` côté proxy valide le JWT Supabase.
- **Multi-tenant** : RLS Postgres sur toutes les tables business ([`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql)) ; trigger d'auto-provisionnement d'une organisation perso au signup.
- **Authentification LinkedIn (OpenID Connect)** : implémentée via cookie `HttpOnly` géré par le proxy. Risque XSS-token classé « très faible » post-migration.

### 8.3 Logs et auditabilité

- **Logger centralisé** [`src/lib/logger.ts`](../../src/lib/logger.ts) : niveaux debug / info / warn / error, no-op en production via `import.meta.env.PROD`. La trajectoire de migration `console.*` vers logger structuré est en cours, avec un volume d'occurrences résiduelles documenté ([`docs/TECH_DEBT.md`](../TECH_DEBT.md)) et une règle ESLint active (`no-console` warning, `console.warn` / `console.error` autorisés).
- **Proxy** : logger structuré (méthode, path, statut, IP, durée) — pas de body, pas de token.
- **Télémétrie applicative** : table `public.usage_events` append-only ; 5 events instrumentés ; constantes canoniques exportées dans `USAGE_EVENTS` ([`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts)) ; endpoint serveur `POST /api/usage`.

### 8.4 Données personnelles

- **Côté serveur** : pas de persistance par défaut. Avec Supabase provisionné, persistance Supabase Auth (email et identifiant Supabase) et tables `org_members` et `usage_events`. Rétention, anonymisation et politique d'effacement à définir par le porteur (cf. §13.A.4).
- **Côté navigateur** : tokens LinkedIn ne sont plus persistés en `localStorage` depuis la migration cookie `HttpOnly`. Données encore stockées localement ([`docs/DATA_MODEL.md`](../DATA_MODEL.md) §2) : cache de métriques LinkedIn, planning éditorial, historiques d'exports, paramètres anti-spam.

### 8.5 Mesures de protection en place

- **Hardening proxy** : `helmet` 8.1 avec CSP minimale paramétrée, HSTS conditionnel en production, `referrerPolicy: strict-origin-when-cross-origin`, `frameAncestors: 'none'`, `objectSrc: 'none'`, `script-src-attr 'none'`.
- **Rate limiting multi-niveau** par endpoint (cf. §4.3).
- **Body limit** 1 Mo strict JSON et urlencoded.
- **Validation** : Zod côté formulaires sensibles, validation manuelle des clés API côté proxy.
- **Anti-spam côté client** : `global-api-blocker`, `perplexity-protection-middleware`, `server-detection`, backoff exponentiel.
- **Hygiène Git** : `.env` retiré du tracking ; `.gitignore` durci ; gabarits `.env*.example` sanitisés ; hooks Husky pre-commit (lint-staged et commitlint Conventional Commits).
- **Trust proxy** activé pour environnements derrière reverse proxy.
- **Erreurs** : stack traces uniquement en mode développement, message générique en production.

### 8.6 Risques résiduels documentés

Listés dans [`docs/SECURITY.md`](../SECURITY.md) §3 et [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §7, repris en §13 avec catégorisation A / B / C :

1. **Historique Git** : occurrences de clés API dans les commits historiques. Procédure d'assainissement versionnée, exécution conditionnée à la rotation préalable des 4 clés providers (point §13.A).
2. **Clés `VITE_*` exposées dans le bundle** : Perplexity et OpenAI uniquement, sous rotation et plafond budgétaire. LinkedIn `CLIENT_SECRET`, Anthropic et `SUPABASE_SERVICE_ROLE_KEY` restent strictement serveur (vérifié).
3. **Store de sessions LinkedIn en mémoire mono-instance** dans `server.cjs`. La table `linkedin_sessions` est prévue dans le schéma SQL pour la distribution (point §13.B).
4. **Régime de compatibilité démonstration** : si les variables Supabase manquent au boot d'un environnement de production, la garde `RequireAuth` laisse passer un utilisateur démonstration. Neutralisation par configuration au passage en production (point §13.A) ; checklist documentée dans [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) §5.
5. **`'unsafe-inline'`** toléré dans `styleSrc` CSP (contrainte Radix UI / shadcn). Acceptable, durcissement possible (point §13.C).
6. **Pas de révocation upstream LinkedIn au logout** : cookie invalidé côté serveur, token effectif chez LinkedIn jusqu'à `expires_in`.
7. **Pas d'auth applicative sur les endpoints LinkedIn** ouverts par CORS (flux OAuth) — par construction.
8. **Pas de chiffrement du `localStorage`** côté navigateur (point §13.C).

### 8.7 Conformité

- **RGPD** : la plateforme, lorsque Supabase est provisionné, traite email + identifiants Supabase + télémétrie usage indexée par utilisateur. La conduite d'une analyse d'impact (PIA / DPIA) avant exposition publique multi-utilisateurs est un point de gouvernance à mener par le porteur ; aucun DPA fournisseur n'est référencé dans le périmètre audité (point §13.A.4).
- **AI Act** : usage de fournisseurs IA tiers (OpenAI, Anthropic, Perplexity). La catégorisation des cas d'usage (assistance à la création de contenu, veille concurrentielle) relève d'une analyse à conduire par le porteur.
- **Aucune attestation externe** (SOC 2, ISO 27001, etc.) n'est documentée dans le périmètre audité, et aucune affirmation de conformité n'est portée par le présent document.

## 9. Tests, qualité et maintenabilité

### 9.1 Tests

- **Framework** : Vitest 2.1 + Testing Library 16.3 + jsdom 26.
- **Configuration** : [`vitest.config.ts`](../../vitest.config.ts). `retry: 0`, `testTimeout: 15s`. Périmètre des tests de production (Perplexity API réelle) en opt-in via `npm run test:production`.
- **27 fichiers de test** dans [`src/test/`](../../src/test/) et [`src/tests/`](../../src/tests/).
- **Résultat `npm run test:run`** : **134 tests passants déterministes en moins de 2 s, 273 tests en périmètre de tests isolé temporairement, 0 échec**. L'isolation est explicite, étiquetée et tracée par TODO référencé dans [`docs/TESTING.md`](../TESTING.md) §5 ; elle constitue un choix méthodologique pour garantir une CI verte et reproductible pendant la trajectoire de remontée du périmètre (point §13.B).
- **Couverture mesurée** (V8, [`docs/audit/COVERAGE_REPORT.md`](./COVERAGE_REPORT.md), snapshot HTML versionné dans [`docs/audit/coverage/`](./coverage/)) :
  - Lines : **16,68 %** (plancher CI bloquant : 14 %).
  - Statements : **16,68 %** (plancher CI bloquant : 14 %).
  - Branches : **46,74 %** (plancher CI bloquant : 44 %).
  - Functions : **31,44 %** (plancher CI bloquant : 29 %).
- **Politique de seuils** : plancher CI calibré « valeur mesurée moins deux points » pour garantir la reproductibilité du gate sans verrouiller à une cible non atteignable. Trajectoire de remontée tracée ([`docs/TECH_DEBT.md`](../TECH_DEBT.md), point §13.B).

### 9.2 Lint et typecheck

- **ESLint** : flat config 9 ([`eslint.config.js`](../../eslint.config.js)). Résultat post-consolidation : **0 erreur**, occurrences `@typescript-eslint/no-explicit-any` et `no-console` réduites de l'ordre de 45 % par rapport à la baseline d'entrée de phase. La trajectoire de réduction est tracée ([`docs/TECH_DEBT.md`](../TECH_DEBT.md), point §13.C).
- **TypeScript** : `npm run typecheck` vert avec `noImplicitAny: true`. `strictNullChecks` désactivé documenté, 55 occurrences ciblées concentrées dans trois fichiers identifiés ; trajectoire d'activation programmée ([`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md), point §13.C).
- **`npm run check`** (`lint` + `typecheck` + `test:run` + `build`) : **vert end-to-end** sur le commit `c6b3e4a` (≈ 13 s).

### 9.3 Trajectoire de remédiation structurelle

Inventoriée dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md). Périmètre de découpage modulaire restant : cinq fichiers au-dessus de 1 000 lignes ([`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts), [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx), [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts), [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx), [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx), plus [`src/services/core/BrandAnalysisCore.ts`](../../src/services/core/BrandAnalysisCore.ts)). Découpages déjà réalisés : `RealBrandIntelligenceService.ts` (2 332 lignes → façade 399 lignes + cinq sous-modules) et `ai-service.ts` (1 202 lignes → façade 196 lignes + cinq sous-modules).

### 9.4 Documentation existante

- **4 fichiers à la racine** : [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md), plus [`LICENSE`](../../LICENSE).
- **13 fichiers canoniques** sous [`docs/`](../) : `README.md`, `ARCHITECTURE.md`, `AUTH_MULTI_TENANT.md`, `DATA_MODEL.md`, `DEMO.md`, `DEPLOYMENT.md`, `FEATURES.md`, `LICENSES.md`, `OPERATIONS.md`, `SECURITY.md`, `TECH_DEBT.md`, `TESTING.md`, `USAGE_LOGGING.md`.
- **10 fichiers `docs/cabinet/`** : `README.md` + `01-perimetre.md` à `08-conclusion.md` + `annexes/`.
- **7 rapports d'audit** sous [`docs/audit/`](./) : présent document, [`PROJECT_AUDIT_NOTES.md`](./PROJECT_AUDIT_NOTES.md), [`COVERAGE_REPORT.md`](./COVERAGE_REPORT.md), [`DATA_TRUTH_REPORT.md`](./DATA_TRUTH_REPORT.md), [`SAASISATION_REPORT.md`](./SAASISATION_REPORT.md), [`SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md), [`TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md), plus artefacts `npm-audit.json`, `licenses.json`, `coverage/`.
- **86 fichiers archivés** dans [`docs/archive/`](../archive/) (historique).

### 9.5 Pipeline CI / CD

- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) : `lint`, `typecheck`, `test:coverage`, `build` sur Node 20 / Ubuntu, upload d'artefact `coverage/`, **bloquant** sur les planchers de seuils.
- [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) : déclenché sur tag `v*.*.*`, job `build` opérationnel, job `deploy` activable par décision dirigeant (cf. cibles candidates dans [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md)).
- **Hooks Git locaux** : Husky 9, lint-staged 15, commitlint Conventional Commits.

## 10. Niveau de maturité estimé

| Axe | Niveau observé | Commentaire |
|---|---|---|
| Fonctionnel | Avancé | 10 sections applicatives implémentées dont 2 modules de veille de marque exportables, planning, analytics, génération assistée, authentification applicative scaffold activable |
| Technique | Avancé sur le métier, modulaire sur les couches transverses | Services métier découpés (façade + sous-modules purs), couche unifiée d'inférence, régime données réelles / démonstration explicite |
| Sécurité | Significativement durcie | Cookie `HttpOnly` LinkedIn, helmet 8.1 + CSP + rate-limit multi-niveau, jspdf 4.2.1 (0 critique / 0 haute), 0 secret en clair dans le tree courant ; risques résiduels documentés et catégorisés §13 |
| Maintenabilité | En trajectoire de consolidation | Pipeline CI bloquant, hooks Conventional Commits, `noImplicitAny` activé, périmètre de découpage modulaire identifié |
| Scalabilité | Scaffold multi-tenant complet, activable | Schéma SQL `organizations` + `org_members` + `usage_events` + RLS + trigger ; contextes UI `AuthContext` et `TenantContext` ; activation conditionnée au provisionnement Supabase |
| Documentation | Élevée | 13 documents canoniques + 10 documents cabinet + 7 rapports d'audit thématiques + 86 documents historiques archivés |
| Industrialisation | Avancée | CI Node 20 bloquante, conteneurisation Docker multi-stage, workflow de déploiement scaffold, télémétrie usage applicative, dossier de valorisation reproductible |

## 11. Éléments utiles pour valorisation

- **Volume de code utile** : 205 fichiers TS/TSX sous [`src/`](../../src/) pour ≈ 56 700 lignes. Proxy serveur : 1 091 lignes. Schéma SQL multi-tenant : 246 lignes. Configuration Vite : 362 lignes.
- **Complexité fonctionnelle** : 10 sections applicatives intégrées dans une seule coque, deux variantes de veille de marque, pipeline d'export multi-format avec historisation, scaffold SaaS multi-tenant complet.
- **Différenciation** : orchestration métier propriétaire au-dessus de Perplexity (façade + cinq sous-modules ≈ 2 300 lignes), modélisation P.R.I.S.M. typée (720 lignes), pipeline d'extraction et de normalisation des actions récentes typées (`product`, `partnership`, `acquisition`, `strategy`, `marketing`, `crisis`, `regulation`), score de confiance plafonné et fraîcheur des données, régime données réelles / démonstration explicite avec ≈ 180 valeurs simulées centralisées, scaffold multi-tenant avec RLS sur toutes les tables business.
- **Réutilisabilité** : composition par hooks, services métier découpés par sous-domaines, couche d'inférence factorisée, primitives shadcn/ui standardisées (49 fichiers).
- **Profondeur métier** : modélisation explicite SWOT + métriques contenu + métriques concurrence + KPIs réputation + recommandations actionnables + alertes catégorisées (`critical` / `warning` / `info` / `opportunities`) ; pipeline d'export PDF premium ; télémétrie usage avec dictionnaire d'events extensible.
- **Niveau d'intégration** : 4 fournisseurs externes branchés avec proxy de durcissement pour Anthropic et LinkedIn ; Supabase scaffold pour auth et persistance multi-tenant ; dépendance externe maîtrisée (licences permissives uniquement).
- **Actifs documentaires** : 4 fichiers racine + 13 documents canoniques + 10 documents `docs/cabinet/` + 7 rapports d'audit thématiques + script reproductible de constitution du dossier de valorisation.
- **Tests** : 134 tests passants déterministes en moins de 2 s, couverture opposable (16,68 % lines / 31,44 % functions / 46,74 % branches), seuils CI bloquants, snapshot HTML versionné.
- **Preuves d'effort R&D** : 122 commits sur `main`, 19 tags Git dont annotés `v0.2.0`, `v1.0.0`, `v1.1.0`, et tags de jalons `wave1-merged`, `wave2-merged`, `wave3-merged`, `valuation-prep-merged` ; historique de versions structuré dans [`CHANGELOG.md`](../../CHANGELOG.md) format Keep a Changelog ; trois phases de consolidation matérialisées par tags de snapshot.

## 12. Cadre de propriété intellectuelle et exploitation commerciale

> **Avertissement.** La présente section décrit l'état observable du régime de licence du dépôt et identifie les décisions de gouvernance recommandées avant transmission. Elle ne se substitue pas à l'avis d'un avocat en propriété intellectuelle, qui reste indispensable pour qualifier juridiquement l'opération d'apport et arrêter le régime de licence définitif.

### 12.1 Actifs identifiés

Indépendamment du régime de licence courant du dépôt, les éléments suivants constituent des **actifs Korev AI** au sens de l'effort de conception, du savoir-faire encodé et de la spécificité métier :

1. **Code applicatif propriétaire** — orchestration métier de veille de marque, couche d'intégration des fournisseurs externes, couche LinkedIn, couche d'export PDF premium, pipeline anti-spam, scaffold multi-tenant, télémétrie usage. L'ensemble totalise ≈ 56 700 lignes TypeScript sous `src/` et 1 091 lignes Node sous `server.cjs`.
2. **Modèle de données métier** — modélisation typée du domaine (`BrandIntelligenceTypes.ts`, 720 lignes) et schéma SQL multi-tenant (`supabase/migrations/0001_init.sql`, 246 lignes).
3. **Prompts métier internes** — encodage propriétaire du savoir-faire d'analyse de marque ([`src/services/brand/real/prompts.ts`](../../src/services/brand/real/prompts.ts), [`src/lib/ai/system-prompt.ts`](../../src/lib/ai/system-prompt.ts)). Ces prompts encapsulent la méthodologie d'analyse Korev AI et constituent un actif distinct du code source au sens de la pratique en valorisation logicielle.
4. **Documentation opposable** — référentiels canoniques `docs/`, dossier d'évaluation `docs/cabinet/`, rapports d'audit `docs/audit/`.
5. **Dénomination et identité projet** — « Kora Digital Pilot » et « Korev AI » (statut juridique des marques à confirmer par le porteur ; point §13.A.5).
6. **Historique d'effort R&D** — 122 commits, 19 tags Git annotés, structure Keep a Changelog.

### 12.2 Dépendances open source

Les dépendances tierces sont utilisées conformément à leurs licences ; toutes les licences directes et indirectes observées sur les 390 packages inventoriés relèvent du régime permissif (MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause). Aucune dépendance sous régime copyleft fort (GPL, AGPL, SSPL, BUSL) n'a été identifiée. L'inventaire est conservé dans [`docs/audit/licenses.json`](./licenses.json) et synthétisé dans [`docs/LICENSES.md`](../LICENSES.md).

L'utilisation de fournisseurs externes managés (Perplexity, OpenAI, Anthropic, LinkedIn, Supabase) est encadrée par les conditions générales d'utilisation des fournisseurs ; aucune obligation contractuelle particulière n'est identifiée comme contraignante pour la valorisation dans le périmètre audité.

### 12.3 Régime de licence courant du dépôt et alerte gouvernance

Le fichier [`LICENSE`](../../LICENSE) à la racine du dépôt porte la mention **« MIT License — Copyright (c) 2024-2026 Korev AI - Kora Digital Pilot »**.

**Point d'attention pour le cabinet et l'avocat mandatés.** La licence MIT, par sa rédaction standard, accorde à tout tiers obtenant une copie du logiciel le droit de l'utiliser, copier, modifier, fusionner, publier, distribuer, sous-licencier et vendre. Dans le cadre d'une opération d'apport en société dont la valeur économique attendue repose sur l'exploitation commerciale **exclusive** du logiciel par la société bénéficiaire de l'apport, le maintien d'une licence MIT non encadrée présente trois implications à arbitrer explicitement :

1. **Périmètre de l'apport** : l'apport doit porter sur les droits patrimoniaux d'auteur de Korev AI sur le code et la documentation (ce qui est cohérent avec la mention de copyright actuelle), et non sur la licence MIT elle-même.
2. **Effet d'une publication antérieure sous MIT** : tant que le dépôt n'a pas été publié ou distribué à des tiers sous licence MIT, le régime de licence peut être révisé avant transmission sans incidence sur les droits déjà accordés.
3. **Exclusivité commerciale attendue** : si l'intention d'exploitation est exclusive, il est recommandé que la société bénéficiaire de l'apport reçoive un titre d'exploitation exclusif (par cession de droits patrimoniaux ou licence exclusive), et que la diffusion sous régime permissif soit révisée.

### 12.4 Décisions de gouvernance recommandées

Avant transmission au commissaire aux apports, il est recommandé que le porteur arrête formellement une **décision de gouvernance sur le régime de licence**. Trois options principales sont identifiées :

| Option | Description | Cohérence avec une opération d'apport |
|---|---|---|
| **A. Licence propriétaire interne** | Remplacement de la licence MIT par une licence propriétaire Korev AI, avec mention explicite « Tous droits réservés » et conditions d'utilisation restrictives | Cohérente avec une exploitation commerciale exclusive par la société bénéficiaire de l'apport |
| **B. Dual licensing encadré** | Maintien d'une licence permissive (MIT ou Apache-2.0) sur un sous-ensemble explicitement isolé (par exemple des primitives techniques génériques) et adoption d'une licence commerciale Korev AI sur le cœur métier (services de veille de marque, prompts internes, modèle de données, scaffold SaaS) | Possible, exige un découpage formel du dépôt et un référentiel de licence par module |
| **C. Licence commerciale Korev AI unifiée** | Licence commerciale unique négociée au cas par cas, sans diffusion permissive | Cohérente avec une stratégie SaaS managé pure |

**Le présent document ne tranche pas cette décision** ; il la signale explicitement comme **point décisionnel dirigeant prioritaire** avant transmission (cf. §0.4 et §13.A.1). L'avis d'un avocat en propriété intellectuelle est requis pour l'arbitrage.

## 13. Maturité de remédiation et limites — catégorisation A / B / C

Les points listés ci-dessous sont **identifiés, documentés, non bloquants pour une exploitation contrôlée**, et **priorisés selon leur impact sécurité, industrialisation et scalabilité**. La catégorisation A / B / C permet une lecture immédiate par le commissaire aux apports : un point de catégorie A ne reçoit pas le même poids qu'un point de catégorie C.

### 13.A — Points de sécurité à traiter avant exposition publique (décisions dirigeant)

| # | Point | Statut | Effet attendu |
|---|---|---|---|
| A.1 | **Régime de licence** | Décision de gouvernance à arrêter avant transmission | Aligner la licence du dépôt avec l'intention d'exploitation commerciale (cf. §12.4) |
| A.2 | **Rotation des 4 clés providers** (Perplexity, OpenAI, Anthropic, LinkedIn `CLIENT_SECRET`) | Procédure documentée ([`docs/SECURITY.md`](../SECURITY.md) §5) ; action porteur | Lever le risque d'exposition de secrets historiques |
| A.3 | **Assainissement de l'historique Git** | Patterns versionnés dans [`scripts/filter-repo-patterns.txt`](../../scripts/filter-repo-patterns.txt), procédure documentée ([`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./SECURITY_REMEDIATION_REPORT.md) §5) ; exécution conditionnée à A.2 | Purger les occurrences historiques de clés API du dépôt |
| A.4 | **Neutralisation du régime de compatibilité démonstration en production** | Checklist documentée ([`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) §5) ; action opérationnelle au moment du déploiement de production | Garantir que la garde `RequireAuth` exige une authentification Supabase effective |
| A.5 | **Statut juridique des marques** « Korev AI » et « Kora Digital Pilot » | À confirmer par le porteur | Conforter l'identité de l'apporteur |
| A.6 | **Analyse d'impact RGPD (PIA / DPIA)** avant exposition multi-utilisateurs publique | À conduire par le porteur | Sécuriser la conformité réglementaire avant montée en charge publique |

### 13.B — Points d'industrialisation avant montée en charge

| # | Point | Statut | Effet attendu |
|---|---|---|---|
| B.1 | **Provisionnement de l'environnement Supabase** | Scaffold complet en place ; action opérationnelle | Activer le régime SaaS multi-tenant |
| B.2 | **Activation de la cible de déploiement** | Workflow scaffold présent ([`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)) ; cibles candidates documentées ([`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) §4) | Industrialiser le pipeline de déploiement |
| B.3 | **Alignement de `VITE_LINKEDIN_REDIRECT_URI`** avec le domaine final | À configurer au moment du déploiement | Activer le flux OAuth LinkedIn en production |
| B.4 | **Distribution du store de sessions LinkedIn** (Redis ou table `linkedin_sessions` SQL) | Scaffold SQL en place ; chemin d'industrialisation identifié | Préparer le multi-instance |
| B.5 | **Élargissement progressif du périmètre de tests** depuis les 134 tests passants déterministes | Trajectoire documentée ([`docs/TESTING.md`](../TESTING.md) §5) | Réintégrer progressivement le périmètre temporairement isolé |
| B.6 | **Remontée progressive de la couverture** depuis la baseline opposable (16,68 % lines) vers la cible documentée | Trajectoire dans [`docs/TECH_DEBT.md`](../TECH_DEBT.md) | Renforcer la profondeur du gate CI |
| B.7 | **Statut juridique des contributions agents automatisés** dans l'historique Git | Quelques commits sous identité `gpt-engineer-app[bot]` à clarifier (cession de droits et mention CONTRIBUTORS) | Conforter le périmètre des droits transmis |

### 13.C — Dette technique normale d'un produit SaaS pré-stable

| # | Point | Statut | Commentaire |
|---|---|---|---|
| C.1 | **Activation progressive de `strictNullChecks`** | Trajectoire programmée ([`docs/audit/TS_STRICTNESS_NOTES.md`](./TS_STRICTNESS_NOTES.md)), 55 occurrences ciblées | Amélioration continue de la robustesse de typage |
| C.2 | **Achèvement du découpage modulaire** sur cinq fichiers > 1 000 lignes restants | Périmètre identifié (§9.3) | Amélioration continue de la maintenabilité |
| C.3 | **Finalisation de la migration `console.*`** vers logger structuré | Trajectoire en cours, règle ESLint active | Hygiène de logs |
| C.4 | **Traitement progressif des occurrences `any`** ciblées par la trajectoire de typage | Trajectoire en cours | Amélioration continue de la robustesse de typage |
| C.5 | **Consolidation des doublons mineurs** : deux familles de types métier, deux clés `localStorage` d'historique d'export | Identifié ([`docs/TECH_DEBT.md`](../TECH_DEBT.md) §8 et §9) | Hygiène de code |
| C.6 | **Durcissement `'unsafe-inline'`** dans `styleSrc` CSP (contrainte Radix UI / shadcn) | Acceptable en l'état, durcissement possible | Sécurité défensive |
| C.7 | **Bump de l'écosystème Vitest 2.x vers 3.x** | 9 vulnérabilités modérées résiduelles confinées en `devDependencies`, hors bundle livré | Maintenance dépendances |
| C.8 | **Chiffrement applicatif du `localStorage`** | Risque résiduel assumé, périmètre de données limité | Sécurité défensive |
| C.9 | **Pas de révocation upstream LinkedIn au logout** | Comportement attendu, cookie invalidé côté serveur | — |
| C.10 | **Plugin de tagging de composants Vite (devDependency)** non requis pour build/run | Retirable sans impact ([`docs/audit/PROJECT_AUDIT_NOTES.md`](./PROJECT_AUDIT_NOTES.md)) | Hygiène dépendances |

### 13.D — Synthèse de la maturité de remédiation

**Catégorie A (6 points)** — décisions dirigeant à arrêter avant transmission ou avant exposition publique. Toutes les procédures techniques associées sont versionnées et documentées ; l'exécution est conditionnée à des décisions de gouvernance.

**Catégorie B (7 points)** — actions opérationnelles d'industrialisation. Scaffold présent dans le dépôt ; activation par configuration ou par provisionnement managé.

**Catégorie C (10 points)** — dette technique normale d'un produit SaaS en phase pré-stable, en trajectoire de remédiation continue et tracée. Aucun point de catégorie C n'altère le runtime applicatif ou la valeur économique du livrable.

## 14. Conclusion technique

Le dépôt audité au commit `c6b3e4a` (tag `wave3-merged`, version `0.2.0`) correspond à un produit logiciel **fonctionnellement avancé**, structuré autour d'un service métier propriétaire de veille de marque (façade 399 lignes et cinq sous-modules ≈ 1 900 lignes) exposé via une coque applicative SPA en dix sections fonctionnelles et soutenu par un proxy Node durci (1 091 lignes) qui isole les secrets serveur, porte la session LinkedIn en cookie `HttpOnly` et héberge la façade d'authentification applicative multi-tenant. Le périmètre couvert — ≈ 56 700 lignes TypeScript dans `src/`, 27 fichiers de tests avec 134 passants déterministes et couverture opposable, 13 documents canoniques, 10 documents `docs/cabinet/`, 246 lignes de schéma SQL multi-tenant — traduit un effort substantiel d'ingénierie produit, de documentation et d'industrialisation.

La sécurité a été significativement durcie : migration des tokens LinkedIn vers cookie `HttpOnly` géré par le proxy, helmet 8.1 et CSP minimale paramétrée et rate-limit multi-niveau, bump `jspdf` résolvant une vulnérabilité critique et quatre hautes (`npm audit` : 0 critique, 0 haute, 9 modérées confinées aux `devDependencies` hors bundle), absence de secret en clair dans le tree courant, hygiène Git renforcée (Husky, lint-staged, commitlint Conventional Commits). Les risques résiduels documentés sont catégorisés en §13 ; ils relèvent soit de décisions de gouvernance, soit de chemins d'industrialisation identifiés, et accompagnés de procédures versionnées.

La maturité technique se mesure sur les axes qualité (`noImplicitAny` activé, lint à zéro erreur, deux fichiers > 1 200 lignes découpés en façades + sous-modules purs), couverture (134 tests déterministes, baseline opposable, snapshot HTML versionné, planchers CI bloquants), industrialisation (scaffold Docker multi-stage, workflow de déploiement, télémétrie usage instrumentée), et vérité produit (régime données réelles / démonstration explicite avec valeurs simulées centralisées et gating sur les vues consolidées).

Le **cadre de propriété intellectuelle** (§12) identifie une décision de gouvernance prioritaire à arrêter avant transmission : le régime de licence du dépôt, actuellement MIT, doit être révisé en cohérence avec l'intention d'exploitation commerciale exclusive attendue par la société bénéficiaire de l'apport.

En l'état du commit `c6b3e4a`, le code et la documentation forment un **actif logiciel transmissible** dans le cadre d'une opération d'apport en société, sous réserve que le porteur (i) arrête la décision de gouvernance sur le régime de licence (§12.4), (ii) exécute la rotation des clés providers et l'assainissement de l'historique Git conformément aux procédures versionnées (§13.A.2 et §13.A.3), (iii) confirme le statut juridique des marques et le périmètre des droits transmis (§13.A.5 et §13.B.7), et (iv) qualifie le périmètre d'usage cible (poste interne, démonstration commerciale, ou exposition multi-utilisateurs publique). Le dossier d'évaluation dédié [`docs/cabinet/`](../cabinet/) (10 fichiers, lecture sobre opposable) est la porte d'entrée recommandée pour le cabinet et l'avocat mandatés.

---

## Annexe — Prompt de contrôle pour vérification commissaire aux apports

> Le prompt ci-dessous est destiné à une vérification finale du présent document avant transmission. Il peut être exécuté par un relecteur humain (cabinet, avocat, expert technique) ou par un assistant analytique sur la base d'une lecture intégrale du fichier.

```
Prompt de contrôle — Vérification commissaire aux apports

Tu vérifies la transmissibilité du document
docs/audit/PROJECT_DOCUMENTATION_STANDARD_COM_APPORTS_READY.md à un
commissaire aux apports, un cabinet de valorisation, un avocat en
propriété intellectuelle ou un expert technique mandaté.

Réalise les contrôles suivants et produis un rapport structuré :

1. Cohérence juridique du vocabulaire
   - Le document distingue-t-il les actifs propriétaires, les
     dépendances open source et le régime de licence courant ?
   - Les recommandations IP sont-elles signalées comme « décision
     dirigeant à arrêter » et non comme des affirmations juridiques ?
   - Aucun terme n'est-il utilisé en place et lieu d'un avis d'avocat
     en propriété intellectuelle ?

2. Absence de formulation auto-fragilisante
   - Le document évite-t-il les termes « quarantine », « tests skipped »,
     « legacy », « fallback démo », « historique compromis »,
     « non opérationnel », « prototype », « brouillon » ?
   - Les réserves sont-elles présentées comme des chemins d'industrialisation
     identifiés ou des décisions dirigeant, et non comme des défaillances ?

3. Absence de claim non prouvé
   - Chaque chiffre cité est-il rattaché à un fichier source ou un rapport
     d'audit interne référencé ?
   - Aucune affirmation de conformité (RGPD, AI Act, SOC 2, ISO 27001) n'est-elle
     portée sans qualification explicite ?
   - Les pourcentages, volumes de lignes et indicateurs de couverture sont-ils
     cohérents avec docs/audit/COVERAGE_REPORT.md et le tree audité ?

4. Clarté IP / licence
   - La section §12 expose-t-elle de manière non ambiguë :
     a. les actifs Korev AI identifiés ?
     b. le régime des dépendances open source ?
     c. le point d'attention sur la licence MIT actuelle ?
     d. les trois options de gouvernance recommandées ?
   - Le document signale-t-il explicitement la nécessité d'un avis d'avocat
     en propriété intellectuelle ?

5. Séparation entre risques bloquants, industrialisation et dette normale
   - La catégorisation §13 A / B / C est-elle lisible et factuelle ?
   - Aucun point mineur (doublon localStorage, console.*, devDependency
     plugin de tagging) n'est-il mis au même niveau qu'un point majeur
     (rotation clés, assainissement historique Git, neutralisation
     démonstration prod) ?

6. Lisibilité pour un commissaire aux apports
   - La section §0 Synthèse transmissible permet-elle de prendre une
     décision de lecture en moins de 10 minutes ?
   - Les liens relatifs vers les fichiers du dépôt sont-ils tous valides ?
   - Le ton est-il sobre, précis, sans phrase marketing ni ton défensif ?

7. Absence de mentions parasites
   - Aucune mention de « IA générative », « ChatGPT », « Lovable »,
     « généré automatiquement », « brouillon », « subagent »,
     « prompt généré » n'est présente, sauf si nécessaire factuellement
     pour décrire un module audité du dépôt.

8. Décisions dirigeant identifiées
   - Les 4 décisions dirigeant (§0.4) sont-elles bien :
     1. régime de licence ;
     2. rotation et assainissement historique Git ;
     3. statut Supabase et neutralisation démonstration prod ;
     4. niveau de disclosure acceptable avant transmission ?
   - Chaque décision est-elle reliée à une procédure documentée et à
     un fichier source ?

Rends ton rapport sous forme de tableau à 3 colonnes :
contrôle | constat | recommandation.
Marque clairement, le cas échéant, les passages à reformuler avant
transmission, en citant les lignes concernées.
```
