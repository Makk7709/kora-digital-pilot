# 02 — Modules propriétaires

Inventaire des modules constitutifs de la propriété intellectuelle valorisable. Chaque entrée référence un chemin de code et une volumétrie observée, sans extrapolation. Les volumétries sont reproductibles par `wc -l <chemin>`.

## 2.1 Services métier — brand intelligence

| Module | Chemin | Lignes | Rôle |
| --- | --- | --- | --- |
| Orchestrateur principal de veille de marque | [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) | 2 332 | Orchestrateur P.R.I.S.M : objectif, actions récentes, analyse stratégique, signaux faibles, SWOT, alertes, recommandations actionnables. Calcule un score de confiance plafonné à 95 % et un indicateur de fraîcheur des données. |
| Orchestrateur Brand Intelligence | [`src/services/BrandIntelligenceOrchestrator.ts`](../../src/services/BrandIntelligenceOrchestrator.ts) | 188 | Coordonne le service principal avec les modules d'export et les hooks UI. |
| Cœur d'analyse | [`src/services/core/BrandAnalysisCore.ts`](../../src/services/core/BrandAnalysisCore.ts) | 924 | Composition fine des analyses (analyseurs déclaratifs, agrégation par catégorie). |
| Déduplication de contenu | [`src/services/ContentDeduplicationService.ts`](../../src/services/ContentDeduplicationService.ts) | 397 | Élimination des doublons sur les résultats Perplexity (signatures, similarité). |
| Sous-domaine `brand/` | [`src/services/brand/`](../../src/services/brand/) | 7 fichiers | `api-service.ts`, `brand-analysis-orchestrator.ts`, `parsers.ts`, `queries.ts`, `report-generator.ts`, `DataAggregationService.ts`, `index.ts`. |
| Intégration et génération de rapport | [`src/services/integration/ReportGenerationService.ts`](../../src/services/integration/ReportGenerationService.ts) | n.c. | Assemblage des rapports finaux à partir des analyses. |

**Constaté** par lecture directe et `wc -l`. La concentration de logique propriétaire est dans `RealBrandIntelligenceService.ts` (2 332 lignes — soit ≈ 22 % du périmètre `src/services/`).

## 2.2 Pipeline d'export

| Module | Chemin | Lignes | Rôle |
| --- | --- | --- | --- |
| Export PDF premium | [`src/services/export/formats/pdf-exporter.ts`](../../src/services/export/formats/pdf-exporter.ts) | 1 642 | Pipeline de génération PDF (mise en page, sections, graphiques) à partir des rapports Brand Intelligence et Analytics. Dépend de jspdf 4.2.1 (post bump Wave 1). |
| Sections PDF | [`src/services/export/formats/pdf-exporter-sections.ts`](../../src/services/export/formats/pdf-exporter-sections.ts) | n.c. | Sections atomiques réutilisables du PDF. |
| Export CSV / Excel / JSON | [`src/services/export/formats/csv-exporter.ts`](../../src/services/export/formats/csv-exporter.ts) · [`excel-exporter.ts`](../../src/services/export/formats/excel-exporter.ts) · [`json-exporter.ts`](../../src/services/export/formats/json-exporter.ts) | n.c. | Variantes d'export tabulaire et structurelle. |
| Orchestrateur d'export | [`src/services/export/export-orchestrator.ts`](../../src/services/export/export-orchestrator.ts) | n.c. | Sélection du format, historisation, compression. |
| Génération de métadonnées | [`src/services/export/metadata-generator.ts`](../../src/services/export/metadata-generator.ts) | n.c. | Métadonnées du document (auteur, date, titre, version). |
| Amélioration qualité | [`src/services/export/quality-enhancement.ts`](../../src/services/export/quality-enhancement.ts) | n.c. | Post-traitement des exports (lisibilité, contraste). |
| Historique d'exports | [`src/services/export/history-manager.ts`](../../src/services/export/history-manager.ts) | n.c. | Persistance de l'historique en `localStorage` (clé `kora_export_history`). |

**Constaté** par lecture directe. La maîtrise du pipeline PDF (`pdf-exporter.ts` ≈ 1 642 lignes) est un actif distinct car elle implémente une mise en page propriétaire calibrée sur les rapports Brand Intelligence et Analytics.

## 2.3 Couches techniques transverses (`src/lib/`)

| Module | Chemin | Lignes | Rôle |
| --- | --- | --- | --- |
| Service Perplexity | [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) | n.c. | Client Perplexity (auth, prompts, parsing, fallback simulation `kora-simulation-v1`). |
| Service OpenAI / ChatGPT | [`src/lib/chatgpt-service.ts`](../../src/lib/chatgpt-service.ts) | n.c. | Client OpenAI avec timeouts et retry. |
| Service IA orchestré | [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) | 1 202 | Couche d'abstraction multi-fournisseurs (OpenAI / Anthropic / Perplexity). |
| Service LinkedIn | [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) | 1 261 | Client LinkedIn (OAuth, analytics, posts), refactorisé Wave 1 pour basculer sur la session cookie `HttpOnly`. |
| Blocker global d'API | [`src/lib/global-api-blocker.ts`](../../src/lib/global-api-blocker.ts) | 192 | Garde-fou anti-spam : plafonnement par fenêtre, suspension automatique, restitution UI via `GlobalApiBlockerStatus`. **Protection de crédits API**. |
| Middleware Perplexity | [`src/lib/perplexity-protection-middleware.ts`](../../src/lib/perplexity-protection-middleware.ts) | n.c. | Limites configurables (par minute / par heure), plafond budgétaire quotidien, historisation locale. |
| Détection d'état serveur | [`src/lib/server-detection.ts`](../../src/lib/server-detection.ts) | n.c. | Arrêt automatique des tentatives sur incident. |
| Service planning | [`src/lib/planning-service.ts`](../../src/lib/planning-service.ts) | 374 | Persistance planning éditorial dans `localStorage` (`kora_planning_data`, `kora_weekly_plans`). |
| Logger | [`src/lib/logger.ts`](../../src/lib/logger.ts) | n.c. | Logger centralisé (niveaux `debug/info/warn/error`). En cours de généralisation (cf. [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §4). |
| Mode démo / réel | [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts) + [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts) | n.c. | Source unique de vérité des données simulées et bascule via `VITE_DATA_MODE`. Introduit en Wave 1 (Agent 4). |
| Gestion d'erreurs | [`src/lib/error-handler.ts`](../../src/lib/error-handler.ts) | n.c. | Normalisation des erreurs et exposition UI. |
| Prompts marque | [`src/lib/brand-prompts.ts`](../../src/lib/brand-prompts.ts) | n.c. | Bibliothèque de prompts propriétaires pour la veille de marque. |

**Constaté** par lecture directe. Les modules `global-api-blocker.ts`, `perplexity-protection-middleware.ts` et `server-detection.ts` constituent un système distinct de protection des crédits API, dont l'effet est observable dans les widgets `ApiHealthDashboard` et `GlobalApiBlockerStatus`.

## 2.4 Architecture de sécurité (post Wave 1 — Agent 1)

Actif propriétaire post-migration, documenté dans [`docs/SECURITY.md`](../SECURITY.md) §3 et tracé dans [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md).

| Élément | Référence dans le code | Statut |
| --- | --- | --- |
| Cookie `kora_linkedin_session` | `server.cjs` (endpoints `/api/auth/linkedin/session`, `/me`, `/logout`) | Posé `HttpOnly` + `SameSite=Lax` + `Secure` (production) + `Path=/api/auth` |
| Store de sessions serveur | `Map<sessionId, { accessToken, idToken, expiresAtMs, profile }>` dans `server.cjs` | En mémoire, purgé par `setInterval` horaire |
| CSP renforcée | `helmet` dans `server.cjs` | `default-src 'self'`, `script-src 'self'`, `script-src-attr 'none'`, `frame-ancestors 'none'` |
| Logger HTTP structuré | `server.cjs` | `method path status ip durationMs`, jamais de body ni de token |
| `trust proxy` activé | `server.cjs` ligne ≈ 100 | `app.set('trust proxy', 1)` |
| Rate limiter | `server.cjs` (multi-fenêtres) | `/api/auth/linkedin/session` 30/min, `/me` 120/min, `/logout` 60/min, global 300/min |

**Constaté** par lecture directe et croisement avec [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §6b.

## 2.5 Architecture « mode démo / mode réel » (post Wave 1 — Agent 4)

Actif propriétaire de transparence des données affichées, documenté dans [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md).

| Élément | Chemin | Rôle |
| --- | --- | --- |
| Source unique des données démo | [`src/lib/demo-data.ts`](../../src/lib/demo-data.ts) | Tous les exports préfixés `DEMO_*`, typés. Élimine les ≈ 180 constantes hardcodées identifiées avant refactor. |
| Bascule mode | [`src/lib/data-mode.ts`](../../src/lib/data-mode.ts) | `getDataMode()`, `isDemoMode()`, override DEV-only `localStorage`. Variable `VITE_DATA_MODE` (défaut `'real'`). |
| Contexte React | [`src/contexts/DataModeContext.tsx`](../../src/contexts/DataModeContext.tsx) | Distribution du mode dans l'arbre composant + toggle DEV-only. |
| Bannière sticky | [`src/components/DataModeBanner.tsx`](../../src/components/DataModeBanner.tsx) | `role="status"`, montée dans `pages/Index.tsx`, visible sur tout `/app` en mode démo. |
| Composant `EmptyState` | [`src/components/EmptyState.tsx`](../../src/components/EmptyState.tsx) | Remplace les blocs simulés en mode réel sans source connectée. |
| Badge source | `DataSourceBadge` (composant) | « Données réelles » (vert) / « Données simulées » (amber) / « LinkedIn temps réel » / « Aucune source ». |

**Constaté** par lecture directe et croisement avec [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §3 et §4.

## 2.6 Composants UI propriétaires (vue applicative)

| Composant | Chemin | Lignes |
| --- | --- | --- |
| Brand Intelligence Dashboard (variante TDD) | [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) | 1 227 |
| Brand Monitoring (historique) | [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) | 1 393 |
| Analytics | [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) | 1 178 |
| Dashboard | [`src/components/Dashboard.tsx`](../../src/components/Dashboard.tsx) | n.c. |
| Community Manager Dashboard | [`src/components/CommunityManagerDashboard.tsx`](../../src/components/CommunityManagerDashboard.tsx) | n.c. |
| Community Manager — Recherche par domaine | [`src/components/CommunityManagerDomainDashboard.tsx`](../../src/components/CommunityManagerDomainDashboard.tsx) | n.c. |
| Planning éditorial | [`src/components/PlanningWithPerplexity.tsx`](../../src/components/PlanningWithPerplexity.tsx) | n.c. |
| Library | [`src/components/Library.tsx`](../../src/components/Library.tsx) | n.c. |
| Inspiration AI | [`src/components/InspirationAI.tsx`](../../src/components/InspirationAI.tsx) | n.c. |
| Image Generator | [`src/components/ImageGenerator.tsx`](../../src/components/ImageGenerator.tsx) | n.c. |

Les 49 composants du dossier [`src/components/ui/`](../../src/components/ui/) sont des **primitives shadcn/ui** (Radix UI) ; elles ne constituent pas de la propriété intellectuelle propre à Korev AI et sont distribuées sous MIT.

**Constaté** par inventaire `find src/components -maxdepth 2 -type f`.

## 2.7 Hooks métier (`src/hooks/`)

9 hooks au sens React, dont :

| Hook | Chemin | Usage |
| --- | --- | --- |
| `useLinkedInAnalytics` | [`src/hooks/useLinkedInAnalytics.ts`](../../src/hooks/useLinkedInAnalytics.ts) | Récupération + cache + backoff exponentiel des analytics LinkedIn. Refactoré Wave 1 pour la session cookie. |
| `useLinkedInStats` | [`src/hooks/useLinkedInStats.ts`](../../src/hooks/useLinkedInStats.ts) | Stats agrégées LinkedIn. |
| `usePerplexity` | [`src/hooks/usePerplexity.ts`](../../src/hooks/usePerplexity.ts) | Couche d'accès Perplexity avec mode `kora-simulation-v1` (fallback documenté). |
| `useBusinessIntelligence` | [`src/hooks/useBusinessIntelligence.ts`](../../src/hooks/useBusinessIntelligence.ts) | Synthèse BI hybride (Perplexity + IA). |
| `useAI` | [`src/hooks/useAI.ts`](../../src/hooks/useAI.ts) | Façade OpenAI. |
| `useHybridAI` | [`src/hooks/useHybridAI.ts`](../../src/hooks/useHybridAI.ts) | Routage multi-fournisseurs IA. |
| `usePlanning` | [`src/hooks/usePlanning.ts`](../../src/hooks/usePlanning.ts) | Persistance planning éditorial. |

**Constaté** par `ls src/hooks/`.

## 2.8 Synthèse — modules valorisables (top 10)

Critère : volume de logique propriétaire, non substituable par une bibliothèque tierce.

| Rang | Module | Pourquoi |
| --- | --- | --- |
| 1 | `RealBrandIntelligenceService.ts` (2 332 L) | Orchestrateur P.R.I.S.M unique, calibré sur les prompts propriétaires Korev AI |
| 2 | `pdf-exporter.ts` (1 642 L) | Pipeline PDF métier (mise en page, sections, branding éditorial) |
| 3 | `linkedin-api.ts` (1 261 L) | Client LinkedIn refactorisé pour cookie `HttpOnly` |
| 4 | `BrandMonitoring.tsx` (1 393 L) + `enhanced/BrandIntelligenceDashboard.tsx` (1 227 L) | UI complète de veille de marque |
| 5 | `ai-service.ts` (1 202 L) | Couche d'abstraction multi-fournisseurs |
| 6 | `Analytics.tsx` (1 178 L) | UI analytics multi-plateformes avec bascule démo/réel |
| 7 | `BrandAnalysisCore.ts` (924 L) | Cœur d'analyse fine |
| 8 | Système de protection API (3 modules : `global-api-blocker.ts`, `perplexity-protection-middleware.ts`, `server-detection.ts`) | Protection des crédits API |
| 9 | Architecture session cookie `HttpOnly` (post Wave 1) | Sécurité opposable et documentée |
| 10 | Architecture mode démo / réel (post Wave 1) | Transparence des données affichées, opposable |

---

Dernière mise à jour : 2026-05-22.
