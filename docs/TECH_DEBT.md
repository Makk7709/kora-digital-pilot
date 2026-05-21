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

- **Constat** : environ 546 occurrences de `console.*` dans le code applicatif.
- **Cause** : développement itératif sans logger centralisé d'origine.
- **Impact** : bruit en console, secrets potentiellement loggés, traçabilité limitée.
- **Trajectoire** : migration vers le logger centralisé `src/lib/logger.ts` (introduit par le worker code/sécurité), niveaux `debug/info/warn/error` paramétrables, suppression complète des `console.log` en build de production.

## 5. Métriques dashboard partiellement simulées

- **Constat** : les métriques affichées sur `Dashboard.tsx` et `Analytics.tsx` pour Instagram et X (Twitter) reposent sur des valeurs hardcodées d'illustration.
- **Cause** : absence d'intégration API officielle pour Instagram et X.
- **Impact** : la vue d'ensemble présente des chiffres non sourcés ; risque de confusion pour un évaluateur externe.
- **Trajectoire** : soit ajouter des intégrations (Meta Graph API, X API), soit remplacer ces vues par une saisie manuelle ou une mention explicite « données d'illustration ». À court terme, ajouter un bandeau visible dans l'UI.

## 6. Tokens LinkedIn en `localStorage`

- **Constat** : `linkedin_access_token` et `linkedin_id_token` stockés en clair dans `localStorage`.
- **Cause** : choix de simplicité sans backend de session.
- **Impact** : exposition à un XSS éventuel.
- **Trajectoire** : déplacer la session LinkedIn dans un cookie `HttpOnly` géré par le proxy, ou introduire un mécanisme de chiffrement applicatif à clé dérivée.

## 7. Couverture de tests inférieure aux seuils déclarés

- **Constat** : certains modules sont fortement couverts (RealBrandIntelligenceService) mais la couverture globale est en dessous des seuils déclarés historiquement (95 %) ; ≈ 27 fichiers de tests pour une base de code de plusieurs dizaines de modules.
- **Cause** : effort de test concentré sur le service Brand Intelligence ; UI peu testée.
- **Impact** : régressions possibles côté UI et hooks.
- **Trajectoire** : tests d'intégration légers (Testing Library) sur les composants critiques (Dashboard, BrandMonitoring, PlanningWithPerplexity), tests des hooks (`useLinkedInAnalytics`, `usePerplexity`).

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
- **Trajectoire** : retirer ces variables du bundle, ne les conserver que côté proxy (`LINKEDIN_CLIENT_SECRET`, `ANTHROPIC_API_KEY` sans préfixe). Ajuster `server.cjs` en conséquence. Voir `SECURITY.md`.

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

- **Constat** : code et documentation utilisent indifféremment « Kora », « Real Brand Intelligence Service », « Kora Digital Pilot » et « KORA ».
- **Cause** : évolution organique du produit.
- **Impact** : confusion sur l'identité du livrable.
- **Trajectoire** : retenir « Kora Digital Pilot » comme dénomination produit et conserver « Real Brand Intelligence Service » comme nom de composant interne.

---

Dernière mise à jour : 2026-05-21.
