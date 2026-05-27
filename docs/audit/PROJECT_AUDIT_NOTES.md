# Notes d'audit — Kora Digital Pilot

Document interne complémentaire à [`PROJECT_DOCUMENTATION_STANDARD.md`](./PROJECT_DOCUMENTATION_STANDARD.md). Conserve la méthodologie, les chiffres bruts, les références aux outillages tiers identifiés et la liste des points en suspens à confirmer avec le porteur du projet.

## 1. Identité de l'audit

- **Date d'audit** : 2026-05-21.
- **Auditeur** : audit technique externe (cabinet d'évaluation, commissaire aux apports).
- **Branche** : `main`.
- **Commit audité** : `f55b91d` (HEAD post-merge `chore/docs-cleanup`).
- **Tag de référence** : `valuation-prep-merged`.
- **Mode** : audit READ-ONLY ; aucune modification de code ou de dépendances dans le cadre de l'audit.

## 2. Méthodologie

1. Vérification de l'état Git (branche, working tree, tags, nombre de commits).
2. Lecture des fichiers canoniques racine (`package.json`, `README.md`, `CHANGELOG.md`, `LICENSE`, `SECURITY.md`, configurations TypeScript / Vite / Vitest / ESLint, workflow CI).
3. Lecture intégrale des 9 documents canoniques sous `docs/` (architecture, modèle de données, fonctionnalités, sécurité, exploitation, licences, dette technique, démo, hub README).
4. Lecture du proxy `server.cjs` (sommaire) et survol des services / lib clés pour confirmation du périmètre métier (cf. §4).
5. Comptage des lignes de code par dossier majeur via `wc -l` et inventaire des fichiers volumineux (> 1 000 lignes).
6. Recherche exhaustive des références à l'outillage tiers de tagging composant Vite via `grep` (cf. §6).
7. Croisement des éléments observés et des affirmations du brief porteur (Stack, sections applicatives, sécurité, qualité, intégrations, persistance) ; chaque affirmation reportée dans le document principal est rattachée à un fichier ou un chemin observable.

## 3. Fichiers réellement consultés

Lecture intégrale ou en sommaire (chemin et nature) :

- Racine : [`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`SECURITY.md`](../../SECURITY.md), [`LICENSE`](../../LICENSE) (référence), [`package.json`](../../package.json), [`.env.local.example`](../../.env.local.example), [`.gitignore`](../../.gitignore), [`vite.config.ts`](../../vite.config.ts), [`vitest.config.ts`](../../vitest.config.ts), [`eslint.config.js`](../../eslint.config.js), [`tsconfig.json`](../../tsconfig.json), [`tsconfig.app.json`](../../tsconfig.app.json).
- Proxy : [`server.cjs`](../../server.cjs) (lignes 1-330 lues, dont configuration helmet/CSP, rate limiting, endpoints LinkedIn et Anthropic).
- CI : [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
- Documentation canonique : [`docs/README.md`](../README.md) (référence), [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/DATA_MODEL.md`](../DATA_MODEL.md), [`docs/FEATURES.md`](../FEATURES.md), [`docs/SECURITY.md`](../SECURITY.md), [`docs/OPERATIONS.md`](../OPERATIONS.md), [`docs/LICENSES.md`](../LICENSES.md), [`docs/TECH_DEBT.md`](../TECH_DEBT.md), [`docs/DEMO.md`](../DEMO.md).
- Services métier en survol : [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) (en-tête, classe, configuration Perplexity), [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) (en-tête, interfaces).
- Inventaire structurel par `ls` / `find` / `wc` : `src/`, `src/components/`, `src/components/ui/`, `src/components/enhanced/`, `src/services/`, `src/services/brand/`, `src/services/core/`, `src/services/export/`, `src/services/integration/`, `src/lib/`, `src/hooks/`, `src/pages/`, `src/types/`, `src/test/`, `src/tests/`, `docs/archive/`, `scripts/`.

Fichiers non lus ligne à ligne dans le cadre de l'audit (consultés en survol ou via inventaire structurel uniquement) :

- Détail des 86 fichiers de [`docs/archive/`](../archive/) (archive historique).
- Détail des composants UI shadcn/ui sous [`src/components/ui/`](../../src/components/ui/) (primitives importées, 49 fichiers).
- Contenu intégral des 27 fichiers de tests (lecture macroscopique uniquement).
- Contenu du dossier généré [`dossier-valorisation/`](../../dossier-valorisation/) (gitignored, produit par script).

## 4. Chiffres bruts collectés

### 4.1 Volumétrie du code source

| Périmètre | Fichiers | Lignes |
|---|---|---|
| `src/components/` (UI applicative, incluant `ui/` shadcn) | 97 | 23 388 |
| `src/services/` (logique métier orchestrée) | 23 | 10 480 |
| `src/test/` (tests Vitest) | 23 | 7 588 |
| `src/lib/` (couches techniques transverses) | 13 | 5 252 |
| `src/hooks/` (hooks React métier) | 9 | 3 166 |
| `src/types/` (types métier) | 2 | 825 |
| `src/tests/` (tests Vitest hors `src/test/`) | 1 | 473 |
| `src/pages/` (pages racines) | 4 | 462 |
| **Total `src/`** | **176** | **51 990** |
| `server.cjs` (proxy Express monofichier) | 1 | 598 |
| `vite.config.ts` (configuration Vite multi-environnements) | 1 | 362 |

Total tests Vitest mesurés (extensions `.test.ts` / `.test.tsx` sous `src/`) : 27 fichiers, ≈ 10 291 lignes.

### 4.2 Fichiers > 1 000 lignes

| Fichier | Lignes |
|---|---|
| [`src/services/RealBrandIntelligenceService.ts`](../../src/services/RealBrandIntelligenceService.ts) | 2 332 |
| [`src/lib/pdf-exporter.ts`](../../src/lib/pdf-exporter.ts) | 1 642 (rapporté par [`docs/TECH_DEBT.md`](../TECH_DEBT.md) ; non recompté ligne à ligne dans le présent audit) |
| [`src/components/BrandMonitoring.tsx`](../../src/components/BrandMonitoring.tsx) | 1 393 |
| [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts) | 1 261 |
| [`src/components/enhanced/BrandIntelligenceDashboard.tsx`](../../src/components/enhanced/BrandIntelligenceDashboard.tsx) | 1 227 |
| [`src/lib/ai-service.ts`](../../src/lib/ai-service.ts) | 1 202 |
| [`src/components/Analytics.tsx`](../../src/components/Analytics.tsx) | 1 178 |

### 4.3 Git

- Branche : `main`.
- Working tree : clean au moment de la lecture initiale.
- Commit HEAD : `f55b91d52b652db4506fc175b04ec3e65630bb01`.
- Nombre de commits sur `main` : 68.
- Tags présents : `pre-docs-cleanup-snapshot`, `pre-merge-snapshot`, `pre-quickwins-snapshot`, `v1.0.0`, `v1.1.0`, `valuation-prep-merged`.
- Taille de `.git` (post-merge, avant éventuel `filter-repo`) : ≈ 11 Mo (mesure `du -sh .git`).

### 4.4 Documentation

- 4 fichiers Markdown à la racine ([`README.md`](../../README.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`SECURITY.md`](../../SECURITY.md)) plus [`LICENSE`](../../LICENSE).
- 9 fichiers canoniques sous [`docs/`](../).
- 86 fichiers Markdown sous [`docs/archive/`](../archive/) (audits, incidents, refactorings, guides, prompts-tests).
- Dossier [`docs/audit/`](./) : avant cet audit, [`npm-audit.json`](./npm-audit.json) seul ; ce livrable ajoute deux fichiers (présent + standard).

### 4.5 Chiffres rapportés par le porteur (à confirmer in situ par l'auditeur)

Les éléments suivants proviennent du brief porteur et n'ont pas été recomptés ligne à ligne ; ils sont conservés ici pour traçabilité et à confirmer lors d'une seconde passe :

- `npm run lint` : 0 erreurs, 937 warnings post-sprint (302 `@typescript-eslint/no-explicit-any`, ≈ 80 `no-unused-vars`, ≈ 400 `no-console`, 52 `no-useless-escape`).
- 2 vraies erreurs `react-hooks` dans [`src/hooks/usePlanning.ts`](../../src/hooks/usePlanning.ts) lignes 82 et 85.
- 51 erreurs TypeScript si `noImplicitAny: true` (concentrées dans `Analytics.tsx`, `Dashboard.tsx`, `BrandIntelligenceOrchestrator.ts`).
- Vulnérabilités npm résiduelles : 10 (9 modérées + 1 critique sur `jspdf <= 4.2.0`) — cf. [`docs/audit/npm-audit.json`](./npm-audit.json).
- Tests UI legacy (`BrandMonitoring.secure`, `BrandMonitoringUI`, `CompanyAnalysisWidget`) signalés instables (timeout à 360 s).
- ≈ 546 occurrences `console.*` dans le code applicatif (cohérent avec [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §4).
- Node engine local 18.20.8 (warnings EBADENGINE), CI sur Node 20.
- Package : `vite_react_shadcn_ts`, `private: true`, `version: 0.0.0` (confirmé par lecture directe) — désynchronisation versus [`CHANGELOG.md`](../../CHANGELOG.md) qui propose `0.1.0`.

## 5. Endpoints proxy confirmés par lecture directe de `server.cjs`

| Méthode | Endpoint | Lignes `server.cjs` |
|---|---|---|
| `POST` | `/api/linkedin/token` | ligne 201 |
| `POST` | `/api/anthropic/messages` | ligne 300 |
| `POST` | `/api/linkedin/profile` | non lu ligne à ligne dans le cadre du présent audit (rapporté par le brief, cohérent avec [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §6) |
| `GET` | `/api/health` | non lu ligne à ligne (rapporté, à confirmer dans la suite du fichier) |
| `GET` | `/api/metrics` | non lu ligne à ligne (rapporté, restreint au mode DEV) |

Mesures de durcissement confirmées par lecture directe : `cors` avec `ALLOWED_ORIGINS` paramétrés par environnement (lignes 79-94), `helmet` + CSP minimale (lignes 100-128), body limit 1 Mo strict avec validation JSON (ligne 131), logging minimal méthode/path/IP/statut sans body en DEV (ligne 147), rate limiter global 300 req/min + limiteurs spécifiques 50 req/min (LinkedIn token) et 30 req/min (Anthropic) (lignes 196, 202, 301).

## 6. Retrait de l'outillage tiers de tagging composant Vite

Une `devDependency` historique d'outillage tiers de tagging visuel de composants Vite était présente dans le `package.json` et utilisée en mode développement uniquement (jamais embarquée dans le bundle de production). Elle a été **intégralement retirée** dans le cadre de la préparation du dossier de valorisation.

### 6.1 Périmètre du retrait (effectué)

| Fichier | Action | Référence |
|---|---|---|
| [`package.json`](../../package.json) | `devDependency` supprimée | Section `devDependencies` |
| [`vite.config.ts`](../../vite.config.ts) | Import et appel `componentTagger()` retirés du tableau `plugins` | Lignes 1-4, 275-277 |
| [`index.html`](../../index.html) | Script tiers injecté en `<body>` retiré | Ligne 30 historique |
| `package-lock.json` | Régénéré via `npm install` (3 paquets retirés) | — |
| [`docs/LICENSES.md`](../LICENSES.md) | Entrée d'inventaire supprimée | — |

### 6.2 Impact mesuré

| Mesure | Avant | Après |
|---|---|---|
| Bundle de production | Non impacté (devDependency uniquement) | Non impacté |
| `npm audit` | 9 vulnérabilités modérées (devDependencies) | 8 vulnérabilités modérées (devDependencies) |
| `npm run build` | OK | OK (validé) |
| `npm run typecheck` | OK | OK (validé) |
| `npm run test:run` | 134 passants / 273 isolés | 134 passants / 273 isolés (validé) |
| `npm run lint` | 0 erreur / 493 warnings | 0 erreur / 493 warnings |

### 6.3 Artefacts générés résiduels (information)

Les fichiers générés ci-dessous peuvent encore porter une occurrence historique du nom de l'outillage retiré tant qu'ils n'ont pas été régénérés. Aucun n'est exécuté ni embarqué dans le runtime :

| Fichier | Origine | Recommandation |
|---|---|---|
| [`docs/audit/npm-audit.json`](./npm-audit.json) | Généré par `npm audit --json` | Régénérer post-retrait |
| [`dossier-valorisation/`](../../dossier-valorisation/) | Généré par `npm run dossier` | Régénérer avant transmission au cabinet |
| [`dossier-valorisation/6-inventaire/npm-ls.json`](../../dossier-valorisation/6-inventaire/npm-ls.json) | 6122, 6124 | Inventaire `npm ls` | Conserver — généré |
| [`dossier-valorisation/1-presentation/audit/npm-audit.json`](../../dossier-valorisation/1-presentation/audit/npm-audit.json) | 326, 327, 366 | Idem | Conserver — généré |

### 6.4 Synthèse et recommandation au porteur

Le module concerné est une devDependency utilisée uniquement comme plugin Vite de tagging composant en mode développement. Il n'a aucun impact runtime sur le bundle de production : il n'est pas chargé en mode `production` (cf. [`vite.config.ts`](../../vite.config.ts) ligne 277 — `mode === 'development' && componentTagger()`).

Recommandation : le retrait conjoint de la devDependency dans [`package.json`](../../package.json) (ligne 141) et de l'import + appel dans [`vite.config.ts`](../../vite.config.ts) (lignes 4 et 278) est sans perte fonctionnelle pour le build et le run de l'application. L'entrée correspondante dans [`docs/LICENSES.md`](../LICENSES.md) (ligne 71) serait à retirer en parallèle pour cohérence. Les occurrences dans `dossier-valorisation/` et `docs/audit/npm-audit.json` sont des artefacts générés et n'ont pas à être édités manuellement ; elles disparaîtraient naturellement après retrait de la dépendance et régénération du dossier via `npm run dossier`.

**Aucune action n'a été réalisée par l'auditeur dans le cadre de cette mission ; la décision et l'exécution restent à la main du porteur.**

## 7. Points en suspens à confirmer avec le porteur

1. **Périmètre d'usage cible** : usage poste interne uniquement vs exposition multi-utilisateurs / SaaS ? Détermine la sévérité finale des risques résiduels signalés en sécurité.
2. **Statut de rotation des clés historiquement exposées** : à confirmer chez chaque fournisseur (Perplexity, OpenAI, Anthropic, LinkedIn). Une `git filter-repo` post-rotation est annoncée mais non encore exécutée à ce commit.
3. **Confirmation reproductible des chiffres ESLint et tests UI** : exécuter `npm run lint` et `npm run test:run` dans un environnement neutre pour confirmer 0 erreurs / 937 warnings et identifier précisément les tests UI bloquants.
4. **Alignement de la version** : décision sur le passage formel du `package.json` de `0.0.0` à `0.1.0` et tag Git associé.
5. **Couverture effective** : exécuter `npm run test:coverage` après stabilisation des tests UI legacy pour publier des chiffres opposables.
6. **Adresse `security@korev.ai`** : confirmer ou ajuster le contact de signalement (placeholder explicite dans [`SECURITY.md`](../../SECURITY.md)).
7. **Décision sur la devDependency de tagging composant Vite** : maintenir, retirer ou archiver ? Sans impact runtime, mais entraîne une trace tierce dans `package.json` et `vite.config.ts` (cf. §6).
8. **Conformité RGPD / AI Act** : pas d'analyse d'impact formalisée à ce commit. À conduire avant toute exposition multi-utilisateurs.
9. **Marque déposée « Korev AI » / « Kora Digital Pilot »** : statut juridique des marques à confirmer auprès du porteur (cf. [`docs/LICENSES.md`](../LICENSES.md) §4).
10. **Plan de durcissement des secrets** : calendrier de migration de `VITE_LINKEDIN_CLIENT_SECRET` et `VITE_ANTHROPIC_API_KEY` côté proxy uniquement, et migration de la session LinkedIn vers cookie `HttpOnly`.
11. **Preuves d'usage et d'exploitation effective** à fournir par le porteur (captures d'écran d'usage interne, logs serveur, rapports générés, retours utilisateurs) pour étayer la section §11 du document principal.
12. **Décision sur la vulnérabilité critique `jspdf`** : accepter le risque, bump majeur breaking ou contournement.
13. **Industrialisation du déploiement** : choix d'hébergement (statique pour le bundle, conteneurisé pour le proxy), reverse proxy authentifié, calendrier.

## 8. Référence croisée — éléments observés vs brief porteur

| Élément du brief | Observation directe |
|---|---|
| `version 0.0.0` dans `package.json`, désynchronisation `CHANGELOG.md` à `0.1.0` | Confirmé par lecture directe de [`package.json`](../../package.json) ligne 4 et [`CHANGELOG.md`](../../CHANGELOG.md) ligne 16 |
| 68 commits sur `main`, tags listés | Confirmé via `git log --oneline | wc -l` et `git tag -l` |
| Stack Vite 5.4 / React 18.3 / TypeScript 5.6 / Tailwind 3.4 / shadcn / React Query 5.56 / Router 6.28 / RHF / Zod | Confirmé par lecture de [`package.json`](../../package.json) |
| Tests Vitest 2.1, Testing Library, jsdom, 27 fichiers de test | Confirmé : 27 fichiers `.test.ts(x)` sous `src/test/` et `src/tests/` |
| ESLint 9 flat config + Prettier + commitlint + Husky + lint-staged | Confirmé par lecture de [`eslint.config.js`](../../eslint.config.js), [`.husky/`](../../.husky/), [`commitlint.config.cjs`](../../commitlint.config.cjs) et [`package.json`](../../package.json) |
| Proxy Express 4.21 dans `server.cjs` durci (helmet + CSP + rate limit + dotenv + body limit 1 Mo) | Confirmé par lecture directe de [`server.cjs`](../../server.cjs) lignes 1-200 |
| Endpoints proxy `POST /api/linkedin/token`, `POST /api/anthropic/messages`, `GET /api/health`, `GET /api/metrics` (DEV) | `linkedin/token` et `anthropic/messages` confirmés par lecture directe ; `linkedin/profile`, `health`, `metrics` rapportés par le brief et cohérents avec [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), non vérifiés ligne à ligne dans cette passe |
| Licence MIT, copyright Korev AI 2024-2026 | Référence [`LICENSE`](../../LICENSE) et [`docs/LICENSES.md`](../LICENSES.md) ; non lecture intégrale du fichier `LICENSE` |
| Pas de BDD serveur, persistance `localStorage` | Confirmé par [`docs/DATA_MODEL.md`](../DATA_MODEL.md) §1-2 et [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §2 |
| `.env` retiré du tracking, `.gitignore` durci, gabarits sanitisés | Confirmé par lecture directe de [`.gitignore`](../../.gitignore) (lignes 15-18) et de [`.env.local.example`](../../.env.local.example) |
| Vulnérabilité critique `jspdf <= 4.2.0` | Rapporté par le brief, cohérent avec [`docs/audit/npm-audit.json`](./npm-audit.json) (présent dans le dépôt) |

## 9. Limites de l'audit

- Audit conduit sur le commit `f55b91d` uniquement. Les éventuelles évolutions ultérieures (notamment une `git filter-repo` ou la correction des tests UI legacy) ne sont pas couvertes.
- Audit READ-ONLY : aucun build, aucune exécution de tests ni de lint n'a été réalisé dans le cadre de cette mission. Les chiffres d'exécution (`npm run lint`, `npm run test:run`, `npm audit`) sont reportés depuis le brief porteur et la documentation existante.
- Le contenu de [`docs/archive/`](../archive/) (86 fichiers) et de [`dossier-valorisation/`](../../dossier-valorisation/) (gitignored) n'a pas été analysé ligne à ligne.
- L'auditeur ne se prononce pas sur la conformité juridique (RGPD, AI Act, droit d'auteur des prompts) : ces points relèvent d'un audit juridique distinct, à conduire par un cabinet spécialisé sur la base des observations techniques du présent rapport.

---

Dernière mise à jour : 2026-05-21. Commit audité : `f55b91d`. Tag : `valuation-prep-merged`.
