# Changelog

Toutes les modifications notables du projet Kora Digital Pilot sont documentées dans ce fichier.

Le format suit [Keep a Changelog 1.1.0](https://keepachangelog.com/fr/1.1.0/) et le projet adhère à [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

Tant que la version `1.0.0` officielle n'est pas publiée, les versions `0.x` sont à considérer comme pré-stables : la surface publique peut évoluer entre deux mineures.

## [Unreleased]

### Documentation

- Refonte complète de la documentation : introduction du dossier `docs/` (architecture, modèle de données, fonctionnalités, sécurité, exploitation, licences, dette technique, démo) et archivage de l'historique des rapports d'incidents, audits, refactorings et prompts de tests dans `docs/archive/`.
- Réécriture du `README.md` racine, de `CONTRIBUTING.md`, et ajout d'un `SECURITY.md` racine pointant vers `docs/SECURITY.md`.

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
