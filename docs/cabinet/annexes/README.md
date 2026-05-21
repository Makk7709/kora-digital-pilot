# Annexes — pointeurs vers les pièces brutes

Ce dossier ne contient pas de documents narratifs ; il liste les pointeurs vers les pièces brutes utilisées par le cabinet d'évaluation pour reproduire les chiffres et constats du dossier (`docs/cabinet/01..08`).

Les fichiers cibles vivent dans [`docs/audit/`](../../audit/) (versionnés) ou sont régénérés à la demande par `npm run dossier` (gitignoré, dans `dossier-valorisation/`).

## A. Documents d'audit Wave 1 (versionnés dans `docs/audit/`)

| Pièce | Chemin | Producteur | Date |
| --- | --- | --- | --- |
| Standard de documentation projet | [`../../audit/PROJECT_DOCUMENTATION_STANDARD.md`](../../audit/PROJECT_DOCUMENTATION_STANDARD.md) | Audit READ-ONLY | 2026-05-21 |
| Notes d'audit complémentaires | [`../../audit/PROJECT_AUDIT_NOTES.md`](../../audit/PROJECT_AUDIT_NOTES.md) | Audit READ-ONLY | 2026-05-21 |
| Rapport de remédiation sécurité | [`../../audit/SECURITY_REMEDIATION_REPORT.md`](../../audit/SECURITY_REMEDIATION_REPORT.md) | Wave 1 — Agent 1 | 2026-05-22 |
| Rapport vérité des données | [`../../audit/DATA_TRUTH_REPORT.md`](../../audit/DATA_TRUTH_REPORT.md) | Wave 1 — Agent 4 | 2026-05-21 |
| Rapport de couverture | [`../../audit/COVERAGE_REPORT.md`](../../audit/COVERAGE_REPORT.md) | Wave 1 — Agent 2 | 2026-05-21 |
| Snapshot HTML coverage | [`../../audit/coverage/index.html`](../../audit/coverage/index.html) | Wave 1 — Agent 2 | 2026-05-21 (6,6 Mo, 144 fichiers) |
| `npm audit` post-bump | [`../../audit/npm-audit.json`](../../audit/npm-audit.json) | Wave 1 — Agent 1 | 2026-05-22 |
| Licences | [`../../audit/licenses.json`](../../audit/licenses.json) | Wave 1 — Agent 1 | 2026-05-22 |

## B. Documentation canonique projet

| Pièce | Chemin |
| --- | --- |
| Hub `docs/` | [`../../README.md`](../../README.md) |
| Architecture | [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md) |
| Modèle de données | [`../../DATA_MODEL.md`](../../DATA_MODEL.md) |
| Catalogue fonctionnel | [`../../FEATURES.md`](../../FEATURES.md) |
| Sécurité | [`../../SECURITY.md`](../../SECURITY.md) |
| Opérations | [`../../OPERATIONS.md`](../../OPERATIONS.md) |
| Licences | [`../../LICENSES.md`](../../LICENSES.md) |
| Dette technique | [`../../TECH_DEBT.md`](../../TECH_DEBT.md) |
| Stratégie de test | [`../../TESTING.md`](../../TESTING.md) |
| Démo | [`../../DEMO.md`](../../DEMO.md) |

## C. Documentation racine

| Pièce | Chemin |
| --- | --- |
| README projet | [`../../../README.md`](../../../README.md) |
| CHANGELOG | [`../../../CHANGELOG.md`](../../../CHANGELOG.md) |
| CONTRIBUTING | [`../../../CONTRIBUTING.md`](../../../CONTRIBUTING.md) |
| SECURITY (alias) | [`../../../SECURITY.md`](../../../SECURITY.md) |
| LICENSE | [`../../../LICENSE`](../../../LICENSE) |

## D. Pièces régénérées par `npm run dossier` (gitignoré)

Le script [`scripts/build-valuation-dossier.sh`](../../../scripts/build-valuation-dossier.sh) produit dans `dossier-valorisation/` à plat :

| Sous-dossier | Contenu | Source de génération |
| --- | --- | --- |
| `1-presentation/` | Copie de `docs/` (canonique + audit) | `cp -R docs/ ...` |
| `2-coverage/` | Rapport HTML Vitest local | `coverage/` (run de `npm run test:coverage`) ou fallback `docs/audit/coverage/` |
| `3-audit-securite/` | `npm-audit.json`, `licenses.json` | `npm audit --json`, `npx license-checker --json` |
| `4-cabinet/` | Copie figée de `docs/cabinet/` | `cp -R docs/cabinet/ ...` |
| `5-historique-git/` | `git-log.txt`, `contributors.txt`, `tags.txt`, `git-history-wave.txt` | `git log --stat`, `git shortlog -sne`, `git tag --list` |
| `6-inventaire/` | `cloc.txt` (si disponible), `npm-ls.json`, `npm-ls-top.txt` | `cloc`, `npm ls --all --json`, `npm ls --depth=0` |
| `manifest.txt` | Horodatage UTC + arborescence à 3 niveaux | – |

### Procédure de régénération

```bash
git checkout v0.2.0
npm install --no-audit --no-fund
npm run dossier
# Sortie : ./dossier-valorisation/
```

Le script est idempotent : il purge `dossier-valorisation/` au démarrage et le reconstruit intégralement.

---

Dernière mise à jour : 2026-05-22.
