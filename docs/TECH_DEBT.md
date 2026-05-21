# Dette technique

Inventaire des dettes techniques assumées sur le périmètre actuel de Kora Digital Pilot, avec leur impact, leur cause et la trajectoire de remédiation envisagée. Document à mettre à jour à chaque revue trimestrielle.

## 1. Configuration TypeScript non strict

- **Constat** : `tsconfig` n'est pas en mode strict complet (certaines options comme `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess` ne sont pas toutes activées).
- **Cause** : héritage d'un démarrage rapide en TDD ; certains modules historiques ne passeraient pas le mode strict en l'état.
- **Impact** : faux positifs runtime possibles, qualité de typage hétérogène.
- **Trajectoire** : activer les options strict progressivement, module par module, en commençant par les services métier déjà couverts par des tests.

## 2. Usage de `any`

- **Constat** : environ 302 occurrences de `any` recensées dans le code (concentration dans `src/tests/` et certains services métier).
- **Cause** : pragmatisme sur les mocks et certaines réponses Perplexity au format variable.
- **Impact** : couverture statique partielle, sécurité de type dégradée.
- **Trajectoire** : remplacer par `unknown` + narrowing dans les tests ; introduire des schémas Zod sur les réponses API critiques.

## 3. Fichiers volumineux

Six fichiers dépassent 1 000 lignes et concentrent une part importante du code métier :

| Fichier | Lignes (ordre de grandeur) |
| --- | --- |
| `src/services/RealBrandIntelligenceService.ts` | 2 332 |
| `src/lib/pdf-exporter.ts` | 1 642 |
| `src/components/BrandMonitoring.tsx` | 1 393 |
| `src/lib/linkedin-api.ts` | 1 259 |
| `src/components/enhanced/BrandIntelligenceDashboard.tsx` | 1 227 |
| `src/lib/ai-service.ts` | 1 202 |
| `src/components/Analytics.tsx` | 1 178 |

- **Cause** : croissance par accrétion fonctionnelle, faible factorisation initiale.
- **Impact** : lisibilité dégradée, surface de bugs élevée, tests plus difficiles à isoler.
- **Trajectoire** : découpage par responsabilité (extracteurs, parseurs, orchestrateurs) en s'appuyant sur les sous-dossiers existants `src/services/{brand,core,export,integration}/`. Cibler `RealBrandIntelligenceService.ts` en priorité.

## 4. Logging anarchique

- **Constat** : environ 500+ occurrences de `console.*` dans le code applicatif (rapport audit Wave 1).
- **Cause** : développement itératif sans logger centralisé d'origine.
- **Impact** : bruit en console, secrets potentiellement loggés en debug, traçabilité limitée.
- **Trajectoire** : migration vers le logger centralisé `src/lib/logger.ts` (à introduire), niveaux `debug/info/warn/error` paramétrables, suppression complète des `console.log` en build de production. Le logger HTTP côté proxy (`server.cjs`) est déjà structuré depuis Agent 1 (Wave 1) — voir `docs/audit/SECURITY_REMEDIATION_REPORT.md` §3.

## 5. Métriques dashboard partiellement simulées

- **Constat (post Wave 1 — Agent 4)** : les métriques Instagram et X (Twitter) sont désormais centralisées dans `src/lib/demo-data.ts` (préfixe `DEMO_*`), affichées avec un badge contextuel (`DataSourceBadge`) et un `EmptyState` en mode `VITE_DATA_MODE=real` sans source connectée. Une bannière sticky `DataModeBanner` est rendue sur toute la coque `/app` en mode démo.
- **Cause** : absence d'intégration API officielle pour Instagram et X.
- **Impact résiduel** : Instagram et X restent sans source temps réel ; LinkedIn et Perplexity restent les seules sources réelles branchées.
- **Trajectoire** : (a) brancher Meta Graph API et X API v2 si nécessaire, ou (b) figer la posture « démo » pour ces plateformes et exposer uniquement LinkedIn en réel. Référence : [`docs/audit/DATA_TRUTH_REPORT.md`](./audit/DATA_TRUTH_REPORT.md).

## 6. Tokens LinkedIn — session httpOnly (résolu Wave 1)

- **Constat antérieur** : `linkedin_access_token` et `linkedin_id_token` stockés en clair dans `localStorage`.
- **Statut post-Wave 1 (Agent 1, mai 2026)** : ✅ résolu. Les tokens LinkedIn sont désormais détenus exclusivement côté `server.cjs` dans une `Map` en mémoire ; le navigateur ne reçoit qu'un identifiant de session dans un cookie `kora_linkedin_session` `HttpOnly` + `SameSite=Lax` (+ `Secure` en production). Voir [`docs/SECURITY.md`](./SECURITY.md) §3 et [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./audit/SECURITY_REMEDIATION_REPORT.md).
- **Limite résiduelle assumée** : store de sessions mono-instance ; un `restart` du proxy invalide toutes les sessions. Acceptable en local. Roadmap : remplacement par Redis ou store chiffré disque dès qu'on déploie en multi-instance.

## 7. Couverture de tests opposable, mais 273 tests en quarantaine

- **Constat (post Wave 1)** : couverture V8 mesurée et bloquante en CI à **16,68 % lines / 31,44 % functions / 46,74 % branches / 16,68 % statements** (seuils calibrés à valeur réelle − 2 points dans `vitest.config.ts`, échec CI si dérive). 134 tests passent de manière déterministe (`retry: 0`, `testTimeout: 15s`). **273 tests sont placés en quarantaine explicite** (`it.skip` documenté), majoritairement sur `BrandMonitoring*`, `CompanyAnalysisWidget`, `report-export-*`.
- **Cause** : effort de test historiquement concentré sur `RealBrandIntelligenceService` ; suites UI legacy instables (timeouts, dépendances temps réelles).
- **Impact** : zones non couvertes connues : `src/services/core` (0 %), `src/services/integration` (0 %), `src/components/ui` (9,5 % — primitives shadcn, accepté).
- **Trajectoire** : Wave 2/3 — réactivation progressive des suites quarantinées ; tests unitaires `BrandAnalysisCore` ; tests d'intégration LinkedIn mockés. Cible Wave 2 : 25 % lines/statements. Référence : [`docs/audit/COVERAGE_REPORT.md`](./audit/COVERAGE_REPORT.md), [`docs/TESTING.md`](./TESTING.md) §5.

## 8. Double famille de types métier

- **Constat** : `src/types/BrandIntelligenceTypes.ts` et `src/types/brand-analysis.ts` coexistent avec des structures qui se recouvrent partiellement.
- **Cause** : refactoring en deux temps non finalisé.
- **Impact** : confusion lors de l'ajout de nouvelles features ; risque d'incohérence.
- **Trajectoire** : décider d'une famille canonique, exposer l'autre en types adaptateurs, déprécier progressivement.

## 9. Double clé d'historique d'export

- **Constat** : `kora_export_history` (via `history-manager.ts`) et `kora-export-history` (via `export-orchestrator.ts`) coexistent dans `localStorage`.
- **Cause** : convergence incomplète des deux modules d'export.
- **Impact** : données dupliquées ou perdues selon le chemin d'écriture.
- **Trajectoire** : convergence vers une clé unique (`kora_export_history`) avec migration douce au démarrage.

## 10. Variables `VITE_*` exposant des secrets

- **Constat** : `VITE_LINKEDIN_CLIENT_SECRET` et `VITE_ANTHROPIC_API_KEY` sont définis dans `.env.local.example` côté bundle.
- **Cause** : implémentation initiale avant introduction du proxy.
- **Impact** : ces secrets seraient publiés dans le bundle livré.
- **Statut post Wave 1** : la chaîne d'auth LinkedIn ne dépend plus du `CLIENT_SECRET` côté bundle (token échange exécuté server-side via `/api/auth/linkedin/session`). Anthropic transite déjà via le proxy `/api/anthropic/messages`. Le retrait formel des variables `VITE_LINKEDIN_CLIENT_SECRET` et `VITE_ANTHROPIC_API_KEY` du bundle reste à valider par le porteur (renommage sans préfixe `VITE_` côté `.env` + `server.cjs`).
- **Trajectoire** : étape technique mineure documentée dans [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./audit/SECURITY_REMEDIATION_REPORT.md) §4. À synchroniser avec la doc d'exploitation [`docs/OPERATIONS.md`](./OPERATIONS.md).

## 11. Historique git contenant `.env`

- **Constat** : un fichier `.env` a été versionné par le passé.
- **Cause** : `.gitignore` initial incomplet.
- **Impact** : tout secret y figurant à l'époque doit être considéré compromis.
- **Trajectoire** : rotation systématique des clés concernées et réécriture d'historique (`git filter-repo`) coordonnée par le worker code/sécurité.

## 12. Absence de pipeline de production

- **Constat** : pas de workflow CI/CD de déploiement défini dans le dépôt.
- **Cause** : usage actuellement local / interne.
- **Impact** : déploiement manuel, risque d'erreur opérateur.
- **Trajectoire** : ajout d'un workflow GitHub Actions (`build`, `test`, `lint`) puis pipeline de déploiement statique pour le bundle et conteneurisation pour le proxy.

## 13. Documentation historique éparpillée

- **Constat** : 87 fichiers Markdown à la racine avant la présente refonte.
- **Cause** : itérations rapides documentées par fichiers ad hoc, pas de hub centralisé.
- **Impact** : documentation difficilement opposable, redondances.
- **Trajectoire** : structure `docs/` introduite par la présente refonte (`docs/`, `docs/guides/`, `docs/archive/`).

## 14. Branding mixte React et serveur

- **Constat (post Wave 2)** : la nomenclature produit est arrêtée : **Kora Digital Pilot** comme dénomination officielle (champ `name` du `package.json` aligné depuis 0.2.0, `kora-digital-pilot`). « Real Brand Intelligence Service » reste le nom du composant interne (`src/services/RealBrandIntelligenceService.ts`). « KORA » en capitales subsiste ponctuellement dans des commentaires et certaines vues.
- **Trajectoire** : passe de nettoyage capitalisation lors d'un futur refactor UI.

## 15. Vulnérabilités modérées résiduelles (devDependencies)

- **Constat (post Wave 1)** : `npm audit` retourne 9 vulnérabilités modérées, toutes localisées dans les `devDependencies` de l'écosystème Vitest 2.x (`vite`, `esbuild`, `brace-expansion`, `lovable-tagger`).
- **Cause** : Vitest 2.x est l'écosystème calibré pour la couverture V8 actuelle ; un bump majeur (3.x) imposerait une revalidation des seuils CI et de la quarantaine.
- **Impact** : aucun — `devDependencies` non livrées dans le bundle de production.
- **Trajectoire** : bump `@vitest/*` 2.x → 3.x en Wave 3 (ownership Agent 2 / dépendances).

## 16. Tests en quarantaine (273 suites)

- **Constat (post Wave 1)** : 273 tests sont placés en `it.skip` explicite avec TODO documenté dans [`docs/TESTING.md`](./TESTING.md) §5. Périmètre principal : `BrandMonitoring*`, `BrandMonitoring.secure*`, `CompanyAnalysisWidget`, `report-export-*`.
- **Cause** : suites legacy avec timeouts, dépendances réseau réelles, ou couplage à des mocks instables.
- **Impact** : faux sentiment de sécurité ; la couverture mesurée ne reflète pas l'ensemble du code testé historiquement.
- **Trajectoire** : Wave 2/3 — réactivation suite par suite, avec ratchet de couverture (les seuils CI montent à chaque réactivation).

## 17. Historique git non purgé (post Wave 1)

- **Constat** : les anciens secrets API présents dans des commits historiques (Perplexity, OpenAI, Anthropic, LinkedIn) n'ont pas été retirés du `.git/objects`.
- **Statut** : patterns `git filter-repo` prêts dans [`scripts/filter-repo-patterns.txt`](../scripts/filter-repo-patterns.txt) ; procédure documentée dans [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](./audit/SECURITY_REMEDIATION_REPORT.md) §5.
- **Préalable** : **rotation effective des 4 clés providers par le porteur** dans les consoles fournisseur ; tant que les anciennes clés ne sont pas révoquées, la purge `git filter-repo` est sans effet sur le risque.
- **Trajectoire** : action humaine (DevSecOps Korev AI). Hors capacité d'un agent code.

## 18. Pas de remote Git public

- **Constat** : le repo reste local. Le champ `repository` de `package.json` est volontairement omis tant que l'organisation GitHub n'est pas décidée.
- **Impact** : le badge CI dans [`README.md`](../README.md) contient les placeholders `<OWNER>/<REPO>` (commenté `<!-- TODO: replace -->`).
- **Trajectoire** : à compléter par le porteur lors de la création du remote.

---

## Statut consolidé Wave 1 + Wave 2 (mai 2026)

| Item | Avant Wave 1 | Statut actuel |
| --- | --- | --- |
| Tokens LinkedIn en `localStorage` | Risque XSS élevé | ✅ Migration cookie `HttpOnly` (Agent 1) |
| Vulnérabilité critique `jspdf` | 1 critical | ✅ Bump `jspdf` 3.0.1 → 4.2.1 (0 critical) |
| Vulnérabilités modérées | 9 (devDeps) | 🟡 9 (devDeps, inchangé — bump Vitest 3.x reporté) |
| Couverture mesurée et bloquante | Non | ✅ V8 + seuils CI (Agent 2) |
| Tests CI déterministes | Non | ✅ 134 tests verts, 273 quarantinés explicitement |
| Métriques simulées non étiquetées | Confusion possible | ✅ `VITE_DATA_MODE` + bannière + `EmptyState` (Agent 4) |
| Identité projet (`package.json`) | `vite_react_shadcn_ts` v0.0.0 | ✅ `kora-digital-pilot` v0.2.0 (Agent 5) |
| Dossier cabinet d'évaluation | Absent | ✅ `docs/cabinet/` (Agent 5) |
| Historique git secrets | Présents | 🟡 Patterns prêts, exécution par le porteur |
| Remote GitHub | Non décidé | 🟡 Placeholders explicites, action porteur |

---

Dernière mise à jour : 2026-05-22 (Wave 1 + Wave 2 packaging).
