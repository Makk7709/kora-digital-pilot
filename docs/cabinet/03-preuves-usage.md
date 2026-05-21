# 03 — Preuves d'usage et d'exploitation

## 3.1 Activité Git mesurée

| Métrique | Valeur | Source |
| --- | --- | --- |
| Nombre de commits sur `main` au snapshot `v0.2.0` | 90 | `git log --oneline main | wc -l` |
| Nombre de commits Wave 1 + Wave 2 (depuis `valuation-prep-merged`) | ≥ 22 | `git log --oneline valuation-prep-merged..HEAD` |
| Tags actuels présents dans le repo | 11 | `git tag --list` |
| Branche du présent livrable | `feat/packaging-valo` | `git rev-parse --abbrev-ref HEAD` |

**Constaté** par exécution directe des commandes Git ci-dessus dans le worktree `/Users/aminemohamed/Desktop/APP/kora-packaging/`.

## 3.2 Tags Git

Liste exhaustive (par ordre alphabétique) au snapshot `v0.2.0` :

| Tag | Nature | Rôle |
| --- | --- | --- |
| `pre-agent1-snapshot` | snapshot | Bascule pré-Agent 1 (sécurité) — Wave 1 |
| `pre-agent2-snapshot` | snapshot | Bascule pré-Agent 2 (CI / tests) — Wave 1 |
| `pre-agent3-snapshot` | snapshot | Bascule pré-Agent 3 (TS / qualité) — réservé Wave 2 |
| `pre-agent4-snapshot` | snapshot | Bascule pré-Agent 4 (vérité produit) — Wave 1 |
| `pre-agent5-snapshot` | snapshot | Bascule pré-Agent 5 (packaging) — Wave 2 |
| `pre-docs-cleanup-snapshot` | snapshot | Bascule pré-refonte documentaire |
| `pre-merge-snapshot` | snapshot | Bascule pré-merge initial |
| `pre-quickwins-snapshot` | snapshot | Bascule pré-quickwins |
| `pre-wave1-merge-snapshot` | snapshot | Bascule pré-merge Wave 1 |
| `valuation-prep-merged` | livraison | État pré-Wave 1 figé pour la valorisation |
| `wave1-merged` | livraison | Snapshot Wave 1 mergée |
| `v1.0.0` | release historique | Annoncée en interne (service Brand Intelligence — décembre 2024) |
| `v1.1.0` | release historique | Annoncée en interne |
| `v0.2.0` | livraison | **Snapshot du présent dossier (Wave 1 + Wave 2 packaging)** |

**Note** : les tags `v1.0.0` et `v1.1.0` sont historiques et conservés pour traçabilité. Le projet revient à une version `0.x` pré-stable depuis [`docs/audit/PROJECT_DOCUMENTATION_STANDARD.md`](../audit/PROJECT_DOCUMENTATION_STANDARD.md) afin de marquer explicitement l'absence de déploiement production industrialisé. Voir [`CHANGELOG.md`](../../CHANGELOG.md).

**Constaté** par `git tag --list`.

## 3.3 Historique des releases consolidées

D'après [`CHANGELOG.md`](../../CHANGELOG.md) (format Keep a Changelog 1.1.0) :

| Version | Date | Objet principal |
| --- | --- | --- |
| `[0.9.0]` (historique, consolidé) | 2024-12-29 | Initialisation, premiers tests Vitest |
| `[1.0.0]` (historique, interne) | 2024-12-30 | Service Brand Intelligence livré en interne |
| `[1.1.0]` (historique, interne) | — | Incréments fonctionnels |
| `[0.1.0]` (consolidation pré-stable) | 2026-05-21 | Refonte documentaire, harmonisation versioning |
| `[0.2.0]` (le présent) | 2026-05-22 | Snapshot Wave 1 + Wave 2 packaging |

**Constaté** par lecture directe du `CHANGELOG.md`. Les fiches de release et rapports détaillés associés sont conservés dans [`docs/archive/refactoring/`](../archive/refactoring/).

## 3.4 Démo reproductible

Le parcours de démonstration est documenté dans [`docs/DEMO.md`](../DEMO.md). Reproduction minimale :

```bash
git checkout v0.2.0
npm install --no-audit --no-fund
cp .env.local.example .env.local
# Optionnel : passer en mode démo pour voir les badges et la bannière
echo "VITE_DATA_MODE=demo" >> .env.local
npm run dev:full
# Proxy sur :3001, SPA sur :8088
```

Accès navigateur sur `http://localhost:8088/app` pour explorer les 10 sections applicatives. En mode `demo` :

- bandeau sticky `DataModeBanner` rendu en haut de l'écran (`role="status"`) ;
- chaque carte plateforme rend un badge `DataSourceBadge` explicite (« Données simulées » / « LinkedIn temps réel » / « Aucune source ») ;
- les blocs Instagram et X (Twitter) sont visibles, peuplés depuis `DEMO_*` ;
- en mode `real`, ces blocs sont remplacés par un `EmptyState` (`Non connecté`).

**Constaté** par lecture des composants et par procédure documentée dans [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §3.

## 3.5 Reproductibilité du dossier de valorisation

Le script `npm run dossier` (alias de [`scripts/build-valuation-dossier.sh`](../../scripts/build-valuation-dossier.sh)) produit un répertoire `dossier-valorisation/` à plat, gitignoré, contenant :

| Sous-dossier | Contenu | Source |
| --- | --- | --- |
| `1-presentation/` | Copie brute de `docs/` (canonique + audit) | `cp -R docs/ ...` |
| `2-coverage/` | Rapport Vitest HTML | `coverage/` local (ou `docs/audit/coverage/`) |
| `3-audit-securite/` | `npm-audit.json` + `licenses.json` | `npm audit --json`, `npx license-checker --json` |
| `4-cabinet/` | Copie figée de `docs/cabinet/` | `cp -R docs/cabinet/ ...` |
| `5-historique-git/` | `git log --stat`, `git shortlog`, `tags.txt`, `git-history-wave.txt` | `git log`, `git shortlog`, `git tag --list` |
| `6-inventaire/` | `cloc` (si présent), `npm ls --depth=0`, `npm ls --all --json` | – |
| `manifest.txt` | Horodatage UTC + arborescence à 3 niveaux | – |

**Reproductible** par toute personne disposant du repo et de Node 20+.

## 3.6 Preuves de fonctionnement applicatif

| Élément | Statut | Référence |
| --- | --- | --- |
| Lint (`npm run lint`) | 0 erreurs (warnings préexistants tolérés) | [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §9 |
| Typecheck (`npm run typecheck`) | OK | [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §9 |
| Build (`npm run build`) | OK (`dist/` ≈ 1,8 Mo) | [`docs/audit/DATA_TRUTH_REPORT.md`](../audit/DATA_TRUTH_REPORT.md) §9 |
| Suite Vitest CI (`npm run test:run`) | 134 tests passants, 273 skipés explicites | [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §1 et [`docs/TESTING.md`](../TESTING.md) §5 |
| Couverture V8 (`npm run test:coverage`) | 16,68 % lines / 31,44 % functions / 46,74 % branches | [`docs/audit/COVERAGE_REPORT.md`](../audit/COVERAGE_REPORT.md) §1 |
| Smoke endpoints session LinkedIn | OK (cookie posé / lu / purgé) | [`docs/audit/SECURITY_REMEDIATION_REPORT.md`](../audit/SECURITY_REMEDIATION_REPORT.md) §6b |

**Constaté** par croisement des rapports d'audit ; reproductible localement.

## 3.7 Contributeurs

Liste produite par `git shortlog -sne` dans `dossier-valorisation/5-historique-git/contributors.txt`. Les contributeurs sont :

- l'équipe technique interne Korev AI (signatures à confirmer par le porteur lors de l'évaluation) ;
- les Agents IA spécialisés (Wave 1 et Wave 2) dont l'attribution est tracée par les en-têtes de commit (`security-hardening`, `data-truth-mode`, `ci-tests-stable`, `packaging-valo`).

**À confirmer par le porteur** : statut juridique des contributions Agents IA (cession de droits, licence d'usage, mention dans `CONTRIBUTORS` si distinct du `LICENSE`).

## 3.8 Limites de la preuve d'usage

- **Pas de claim « X clients utilisent Kora »** dans ce document : aucune télémétrie n'est observable depuis le repo. Toute donnée d'usage en production doit être fournie séparément par le porteur (logs serveur, captures, accords de licence interne).
- **Pas de remote Git public** au snapshot `v0.2.0`. L'évaluation se fait sur la base du repo local et de ses tags.
- **Releases historiques `v1.0.0` / `v1.1.0`** : non rattachées à une exploitation publique observable depuis le repo (notes de release internes archivées dans `docs/archive/refactoring/`).

---

Dernière mise à jour : 2026-05-22.
