# 07 — Plan de remédiation daté

Trajectoire de remédiation des limites assumées (cf. [`06-limites-assumees.md`](./06-limites-assumees.md)). Les milestones sont **indicatives** : elles supposent une mobilisation d'une équipe de développement à temps plein. Toute date doit être confirmée par le porteur lors d'une planification opérationnelle.

## 7.1 Vue d'ensemble

| Horizon | Période indicative | Thèmes |
| --- | --- | --- |
| Court terme | mai – juillet 2026 | Sécurité résiduelle, push remote, finalisation Wave 2/3 |
| Moyen terme | juillet – décembre 2026 | Ratchet de couverture, découpage des gros fichiers, observabilité |
| Long terme | 2027 et au-delà | SaaSisation, multi-tenant, déploiement prod industrialisé |

## 7.2 Court terme — Wave 3 et finitions Wave 1/2 (mai – juillet 2026)

### CT-1. Rotation effective des clés providers

- **Périmètre** : Perplexity, OpenAI, Anthropic, LinkedIn (`CLIENT_SECRET`).
- **Acteur** : DevSecOps / porteur Korev AI (action humaine dans les consoles fournisseur).
- **Préalable à** : exécution de `git filter-repo`.
- **Référence** : [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §5 étape 1.
- **Critère d'achèvement** : ancienne clé révoquée chez le fournisseur, nouvelle clé fonctionnelle vérifiée localement.

### CT-2. Exécution de `git filter-repo` et push coordonné

- **Périmètre** : réécriture de l'historique pour supprimer les secrets historiques.
- **Acteur** : coordinator Wave 1.
- **Procédure** : [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §5 étapes 2-6.
- **Critère d'achèvement** : `grep -rEn 'pplx-…|sk-proj-…|sk-ant-api…|WPL_AP1\.' …` retourne 0 résultat sur tout l'historique.

### CT-3. Création du remote Git public

- **Périmètre** : décision de l'organisation GitHub cible (Korev AI), création du repo public ou privé, première publication (force-push après `filter-repo`).
- **Acteur** : porteur Korev AI.
- **Critère d'achèvement** : champ `repository` du `package.json` renseigné, badges CI fonctionnels dans `README.md`, placeholders `<OWNER>/<REPO>` remplacés.

### CT-4. Finalisation du retrait des `VITE_*` sensibles

- **Périmètre** : retirer `VITE_LINKEDIN_CLIENT_SECRET` et `VITE_ANTHROPIC_API_KEY` du `.env.local.example` et du bundle.
- **Acteur** : développement (héritier Wave 1 — Agent 1).
- **Référence** : [`docs/SECURITY.md`](../SECURITY.md) §2.2, [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §10.
- **Critère d'achèvement** : aucune variable `VITE_*` sensible dans la documentation et le code ; appels Anthropic / LinkedIn exclusivement via proxy.

### CT-5. Réactivation des premières suites quarantinées

- **Périmètre** : `CompanyAnalysisWidget`, `report-export-csv`, `report-export-json`.
- **Acteur** : Agent 3 (TS / qualité) en parallèle de la présente Wave 2.
- **Référence** : [`docs/TESTING.md`](../TESTING.md) §5.
- **Critère d'achèvement** : nombre de tests passants ≥ 150, couverture lines ≥ 18 %, seuils CI ratchetés en conséquence.

## 7.3 Moyen terme — qualité et observabilité (juillet – décembre 2026)

### MT-1. Ratchet de couverture vers 25 %

- **Périmètre** : réactivation progressive des suites `BrandMonitoring*` et `BrandMonitoring.secure*` ; tests unitaires `BrandAnalysisCore`.
- **Référence** : [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §5.
- **Critère d'achèvement** : couverture lines ≥ 25 %, functions ≥ 40 %.

### MT-2. Découpage des fichiers > 1 000 lignes

- **Périmètre** : `RealBrandIntelligenceService.ts`, `pdf-exporter.ts`, `BrandMonitoring.tsx`, `linkedin-api.ts`, `BrandIntelligenceDashboard.tsx`, `ai-service.ts`, `Analytics.tsx`.
- **Référence** : [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §3.
- **Critère d'achèvement** : aucun fichier `src/` > 1 000 lignes ; chaque sous-module < 600 lignes.

### MT-3. Migration logger centralisé

- **Périmètre** : retrait des ≈ 500 occurrences `console.*` résiduelles, migration vers `src/lib/logger.ts` avec niveaux configurables.
- **Référence** : [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §4.
- **Critère d'achèvement** : 0 `console.*` dans `src/` hors fichiers de test ; build de production strip les logs `debug`.

### MT-4. Bump Vitest 3.x

- **Périmètre** : montée Vitest 2.x → 3.x, résolution des 9 vulnérabilités modérées en `devDependencies`.
- **Acteur** : Agent 2 (CI / tests).
- **Critère d'achèvement** : `npm audit` retourne 0 vulnérabilité modérée.

### MT-5. Observabilité minimale

- **Périmètre** : exposition de métriques structurées du proxy (`/api/metrics` étendu), logs JSON-shape ingérables par un agrégateur (Datadog / Grafana Loki / OpenObserve).
- **Critère d'achèvement** : tableau de bord opérationnel sur la latence, le taux d'erreur et le rate-limit du proxy.

### MT-6. Tests d'intégration LinkedIn mockés

- **Périmètre** : suite Playwright ou Vitest avec MSW (mock service worker) sur le parcours OAuth LinkedIn + analytics.
- **Critère d'achèvement** : le parcours utilisateur LinkedIn est testé en CI, indépendamment de la disponibilité de l'API LinkedIn réelle.

## 7.4 Long terme — SaaSisation (2027 et au-delà)

### LT-1. Multi-tenant et authentification applicative

- **Périmètre** : introduction d'un système d'auth (Keycloak / Auth0 / Clerk), isolation des données par tenant.
- **Préalable** : décision produit sur le modèle commercial.
- **Critère d'achèvement** : plusieurs organisations Korev AI peuvent utiliser une instance partagée sans fuite croisée.

### LT-2. Backend persistant

- **Périmètre** : introduction d'une base de données (PostgreSQL recommandé), migration progressive des données `localStorage` (planning, exports, paramètres) vers le backend.
- **Critère d'achèvement** : aucune donnée applicative critique persistée exclusivement côté navigateur.

### LT-3. Store de sessions partagé

- **Périmètre** : remplacement de la `Map<sessionId, …>` mémoire par Redis (ou store chiffré disque KMS).
- **Préalable** : déploiement multi-instance.
- **Critère d'achèvement** : un restart du proxy n'invalide pas les sessions actives.

### LT-4. Pipeline CI/CD de déploiement production

- **Périmètre** : workflow GitHub Actions (`build`, `test`, `lint`, `deploy`), hébergement statique pour le bundle (Vercel / Netlify / CDN), conteneurisation du proxy (Docker + Kubernetes ou Cloud Run).
- **Référence** : [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §12.
- **Critère d'achèvement** : tout push sur `main` produit un déploiement automatisé, versionné et reproductible.

### LT-5. Conformité RGPD et AI Act formalisée

- **Périmètre** : DPIA / AIPD, politique de confidentialité publiable, classification AI Act, registre des traitements.
- **Acteur** : cabinet juridique externe + DPO Korev AI.
- **Critère d'achèvement** : documents juridiques publiables, registre tenu à jour.

### LT-6. Intégrations Instagram et X (Twitter)

- **Périmètre** : Meta Graph API et X API v2 si décision produit.
- **Référence** : [`docs/TECH_DEBT.md`](../TECH_DEBT.md) §5.
- **Critère d'achèvement** : les blocs Instagram et X de `Dashboard` et `Analytics` exposent des données réelles, le mode démo devient optionnel.

## 7.5 Risques sur le plan de remédiation

| # | Risque | Impact | Mitigation |
| --- | --- | --- | --- |
| PR1 | Rotation des clés providers retardée | CT-2 (filter-repo) bloqué | Acter la rotation comme préalable obligatoire à toute publication du remote |
| PR2 | Refactor des gros fichiers casse des fonctionnalités | Régression silencieuse | Ratchet de couverture (MT-1) en parallèle du refactor (MT-2) |
| PR3 | Bump Vitest 3.x casse des suites | Faux régressions | Cibler MT-4 après MT-1 (couverture stable à 25 %) |
| PR4 | Décision multi-tenant (LT-1) impacte le modèle de données | Refonte profonde | Cadrer LT-1 avant LT-2 ; ne pas démarrer le backend tant que le modèle d'auth n'est pas arrêté |

## 7.6 Suivi

Le plan ci-dessus est à intégrer comme jalons dans l'outil de gestion de projet du porteur (Linear, Jira, GitHub Projects). Chaque item court terme et moyen terme doit être traduit en issue GitHub une fois le remote créé (CT-3).

---

Dernière mise à jour : 2026-05-22.
