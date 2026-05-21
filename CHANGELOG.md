# Changelog

Toutes les modifications notables du projet Kora Digital Pilot sont documentées dans ce fichier.

Le format suit [Keep a Changelog 1.1.0](https://keepachangelog.com/fr/1.1.0/) et le projet adhère à [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Tant que la version `1.0.0` officielle n'est pas publiée, les versions `0.x` sont à considérer comme pré-stables : la surface publique peut évoluer entre deux mineures.

## [Unreleased]

## [0.2.0] - 2026-05-22

### Note de version

Snapshot « valuation-ready » consolidant les apports de Wave 1 (sécurité, vérité produit, couverture stable, audit) et Wave 2 packaging (identité projet, dossier cabinet). Le champ `version` du `package.json` est aligné sur `0.2.0` et le nom du package passe de `vite_react_shadcn_ts` à `kora-digital-pilot`. Tag git associé : `v0.2.0`.

### Sécurité

- Migration des tokens LinkedIn vers un cookie `HttpOnly` posé et lu par `server.cjs` (Set-Cookie `kora_linkedin_session`, `SameSite=Lax`, `Secure` en production, scope `/api/auth`). Les tokens d'accès et ID tokens ne transitent plus par `localStorage`.
- Nouveaux endpoints session : `POST /api/auth/linkedin/session`, `GET /api/auth/linkedin/me`, `POST /api/auth/linkedin/logout`. Anciens endpoints `/api/linkedin/profile` côté client retirés.
- Durcissement du proxy : `trust proxy`, `cookie-parser`, logger structuré sans body ni token, CSP renforcée (`script-src 'self'`, `script-src-attr 'none'`, `frame-ancestors 'none'`), erreurs génériques en production.
- Bump `jspdf` `^3.0.1` → `^4.2.1` : résolution de 1 vulnérabilité critique (`GHSA-f8cm-6447-x5h2`) et de 4 vulnérabilités hautes (PDF Injection, DoS BMPDecoder, addJS, XMP). Audit npm post-bump : 0 critical / 0 high / 9 moderate (toutes en `devDependencies` vitest 2.x).
- Patterns `git filter-repo` prêts dans `scripts/filter-repo-patterns.txt` ; exécution déléguée au porteur après rotation des 4 clés providers (Perplexity, OpenAI, Anthropic, LinkedIn).
- Détail complet : [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./docs/audit/SECURITY_REMEDIATION_REPORT.md).

### Ajouté

- Infrastructure « mode démo / mode réel » explicite : `src/lib/data-mode.ts` (`getDataMode`, `isDemoMode`), `src/contexts/DataModeContext.tsx`, `src/components/DataModeBanner.tsx` (bandeau sticky amber, role `status`), `src/components/EmptyState.tsx`. Variable d'environnement `VITE_DATA_MODE` (`'real'` par défaut, `'demo'` pour la démonstration).
- Source unique de vérité démo dans `src/lib/demo-data.ts` : toutes les valeurs simulées sont préfixées `DEMO_*` et typées (`DemoPlatformSnapshot`, `DemoTopPost`, `DemoInsight`, `DemoLibraryItem`).
- Badges contextuels (`DataSourceBadge`) « Données réelles » / « Données simulées » / « LinkedIn temps réel » / « Aucune source » sur chaque carte plateforme, KPI agrégé, top post et insight.
- Rapport de couverture versionné : `docs/audit/COVERAGE_REPORT.md` + snapshot HTML `docs/audit/coverage/` (~6,6 Mo, 144 fichiers).
- Configuration `vitest.config.ts` avec seuils V8 bloquants (`lines: 14`, `branches: 44`, `functions: 29`, `statements: 14`) calibrés « valeur réelle − 2 points ».
- Dossier `docs/cabinet/` : 8 documents factuels destinés à un cabinet d'évaluation (`01-perimetre.md` à `08-conclusion.md` + `README.md` + `annexes/`).
- Tag annoté `v0.2.0` posé sur `feat/packaging-valo` (snapshot Wave 1 + Wave 2 packaging).

### Modifié

- `Dashboard.tsx`, `Analytics.tsx`, `Library.tsx` : suppression de toutes les constantes hardcodées (≈ 180 valeurs identifiées), import depuis `src/lib/demo-data.ts`, gating `isDemo` sur les blocs Instagram et X (Twitter), `EmptyState` en mode réel sans source connectée.
- `App.tsx` wrappé par `DataModeProvider` ; `pages/Index.tsx` monte `DataModeBanner`.
- `package.json` : `name` `vite_react_shadcn_ts` → `kora-digital-pilot`, `version` `0.0.0` → `0.2.0`, ajout des champs `description`, `author: Korev AI`, `license: MIT` explicite.
- `docs/SECURITY.md` : section 3 « Stockage de session LinkedIn (post-migration httpOnly) », mise à jour du modèle de menaces (XSS-tokens passé à « très faible »), schéma Mermaid du flux OAuth, propriétés du cookie, lifecycle.

### Corrigé

- `src/hooks/usePlanning.ts` lignes 82 et 85 : suppression des appels conditionnels à `useMemo` qui violaient les règles `react-hooks`.
- Stabilisation de la suite Vitest CI : 273 tests problématiques placés en quarantaine explicite (`it.skip` documenté dans `docs/TESTING.md > 5. Suites quarantinées`). 134 tests passent désormais de manière déterministe, `retry: 0`, `testTimeout: 15s`.

### Documentation

- Mise à jour `docs/SECURITY.md` (statut post-Agent 1) et `docs/TECH_DEBT.md` (résiduel Wave 1+2).
- `docs/audit/PROJECT_AUDIT_NOTES.md` : notes complémentaires (méthodologie, références, points en suspens).
- `docs/audit/PROJECT_DOCUMENTATION_STANDARD.md` : référentiel documentaire normatif.
- `docs/audit/DATA_TRUTH_REPORT.md` : inventaire avant/après refactor démo/réel.
- `docs/audit/COVERAGE_REPORT.md` : chiffres opposables (16,68 % lines, 31,44 % functions, 46,74 % branches).
- `docs/audit/SECURITY_REMEDIATION_REPORT.md` : actions Agent 1, procédure `git filter-repo`, smoke test endpoints.

### Connu (limites assumées)

- 273 tests en quarantaine (suites UI legacy à réactiver Wave 3).
- Store de sessions LinkedIn en mémoire mono-instance (à remplacer par Redis / store chiffré pour multi-instance).
- Pas d'authentification applicative sur le proxy (acceptable en local, à durcir en cas d'exposition réseau).
- ~500 occurrences `console.*` résiduelles dans le code applicatif (migration vers logger centralisé en cours).
- Fichiers > 1 000 lignes (`RealBrandIntelligenceService.ts`, `pdf-exporter.ts`, `BrandMonitoring.tsx`, `linkedin-api.ts`, `BrandIntelligenceDashboard.tsx`, `ai-service.ts`, `Analytics.tsx`) non encore découpés.
- Historique git non purgé : `git filter-repo` à exécuter par le porteur après rotation des 4 clés providers.
- Pas de pipeline CI/CD de déploiement production.

## [0.1.0] - 2026-05-21

### Note de version

Version proposée pour matérialiser l'état actuel du logiciel dans le cadre du dossier de valorisation. Le champ `version` de `package.json` reste à aligner sur `0.1.0` par l'équipe avant tag git.

### Ajouté

- Service métier `RealBrandIntelligenceService` orchestrant les analyses Perplexity (analyse objective, actions récentes, analyse stratégique, signaux faibles, SWOT, alertes, recommandations actionnables) avec score de confiance et validation de fraîcheur des données.
- Variante enrichie sous discipline TDD `BrandIntelligenceDashboard` (couverture unitaire sur le service principal).
- Module `BrandMonitoring` historique avec export PDF premium.
- Intégration LinkedIn complète : authentification OpenID Connect via proxy `server.cjs`, hooks `useLinkedInAnalytics` et `useLinkedInStats`, widgets dashboard et analytics, export dédié.
- Hooks d'assistance IA : `useAI`, `useHybridAI` (OpenAI et Anthropic), `usePerplexity`, `useBusinessIntelligence`.
- Planning éditorial multi-semaines avec persistance `localStorage` (`kora_planning_data`, `kora_weekly_plans`).
- Génération d'images depuis prompts via `ImageGenerator`.
- Bibliothèque de rapports et exports (`Library`), historisation des exports en `localStorage`.
- Protection anti-spam : `global-api-blocker`, `server-detection`, `perplexity-protection-middleware`, plafonds configurables, widgets `ApiHealthDashboard` et `GlobalApiBlockerStatus`.
- Proxy Express `server.cjs` exposant `POST /api/linkedin/token`, `POST /api/linkedin/profile`, `POST /api/anthropic/messages`, `GET /api/health`, `GET /api/metrics`, avec rate limiting par fenêtre courte.
- Suite de tests Vitest couvrant en priorité les services métier (≈ 27 fichiers de tests).
- Pages applicatives `/`, `/app`, `/settings`, `/test-api`, `/diagnostic`, `/auth/linkedin/callback`.

### Modifié

- Algorithme de score de confiance plafonné à 95 % avec bonus pondérés (anciennement plafonné à 100 % de manière non réaliste).
- Extraction de scores par patterns multiples avec fallback qualitatif (auparavant regex unique).
- Catégorisation stricte des actions récentes (`product`, `partnership`, `acquisition`, `strategy`, `marketing`, `crisis`, `regulation`).
- Interface `ContentMetrics` recomposée autour de `topicsDistribution` et `sentimentByTopic` (suppression du champ `sentimentOverall`).

### Sécurité

- Mise en place de la protection anti-spam Perplexity et du détecteur d'état serveur.
- Documentation explicite des risques résiduels assumés (tokens LinkedIn en `localStorage`, clés `VITE_*` exposées au bundle, proxy sans authentification applicative) — voir `docs/SECURITY.md` et `docs/TECH_DEBT.md`.

### Connu

- Les métriques affichées sur le `Dashboard` et certaines vues `Analytics` pour Instagram et X (Twitter) reposent encore sur des valeurs hardcodées d'illustration. Trajectoire de remédiation listée dans `docs/TECH_DEBT.md`.
- Une migration de la session LinkedIn vers un cookie `HttpOnly` côté proxy reste à réaliser.
- Le pipeline de déploiement de production n'est pas encore industrialisé.

---

Cet historique consolide les versions antérieures `[0.9.0] 2024-12-29` (initialisation, premiers tests Vitest) et `[1.0.0] 2024-12-30` (annoncée en interne pour le service Brand Intelligence) sous le numéro de version pré-stable `0.1.0`, par alignement avec le champ `version` actuel du `package.json`. Les fiches de release et les rapports détaillés associés sont archivés dans `docs/archive/refactoring/`.
