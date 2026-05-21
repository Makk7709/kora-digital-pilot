# Dossier d'évaluation — Kora Digital Pilot

Dossier consolidé à destination d'un cabinet d'évaluation (apport en nature, due diligence, expertise indépendante). Tous les éléments présents sont opposables : chaque assertion technique référence un fichier, un commit, un tag ou un rapport d'audit dont la reproduction est à la portée d'un auditeur disposant du code et de Node 20+.

## Identité du projet

| Champ | Valeur |
| --- | --- |
| Nom commercial | Kora Digital Pilot |
| Éditeur | Korev AI |
| Slug technique (`package.json` → `name`) | `kora-digital-pilot` |
| Version courante (`package.json` → `version`) | `0.2.0` |
| Licence | MIT |
| Tag de référence | `v0.2.0` (snapshot Wave 1 mergée + packaging Wave 2) |
| Branche | `feat/packaging-valo` (non poussée) |
| Repo | local — aucune URL publique à ce jour (cf. §07 plan de remédiation) |

## Comment lire ce dossier

Le dossier suit huit sections numérotées, lisibles dans l'ordre par un évaluateur découvrant le projet :

| # | Document | Objet |
| --- | --- | --- |
| 01 | [`01-perimetre.md`](./01-perimetre.md) | Périmètre fonctionnel, technique, intégrations API |
| 02 | [`02-modules-proprietaires.md`](./02-modules-proprietaires.md) | Inventaire des actifs propriétaires valorisables |
| 03 | [`03-preuves-usage.md`](./03-preuves-usage.md) | Preuves d'usage : commits, tags, releases, démo |
| 04 | [`04-preuves-tests.md`](./04-preuves-tests.md) | Preuves de tests et couverture |
| 05 | [`05-securite-conformite.md`](./05-securite-conformite.md) | Synthèse sécurité et conformité |
| 06 | [`06-limites-assumees.md`](./06-limites-assumees.md) | Limites techniques connues et assumées |
| 07 | [`07-plan-remediation-date.md`](./07-plan-remediation-date.md) | Plan de remédiation daté |
| 08 | [`08-conclusion.md`](./08-conclusion.md) | Synthèse factuelle |

Les pièces brutes (audits, licences, couverture HTML, historique Git, inventaire des dépendances) sont produites par le script reproductible `npm run dossier` dans le répertoire `dossier-valorisation/` (gitignoré). Voir [`annexes/README.md`](./annexes/README.md) pour le détail des pointeurs et leur procédure de régénération.

## Conventions de rédaction

- Phrases courtes, factuelles, opposables. Aucun superlatif, aucun élément marketing.
- Chaque assertion technique référence un fichier, un commit, un tag ou un rapport.
- Distinction explicite entre :
  - **constaté** : observation directe par l'auteur du document (lecture de code, exécution de commande sur le repo) ;
  - **déduit** : conclusion appuyée sur un croisement de plusieurs sources internes ;
  - **à confirmer par le porteur** : élément hors capacité d'observation (rotation effective de clés, marques déposées, contrats d'usage).
- Tous les renvois vers les rapports d'audit pointent vers [`docs/audit/`](../audit/).

## Périmètre temporel

| Élément | Date |
| --- | --- |
| Première version publique notable | `v1.0.0` (interne) — 2024-12-30 (release archivée) |
| Snapshot pré-valorisation | `valuation-prep-merged` — 2026-05-21 |
| Wave 1 mergée (sécurité, vérité produit, couverture) | `wave1-merged` — 2026-05-22 |
| Snapshot dossier (le présent) | `v0.2.0` — 2026-05-22 |

## Reproduction du dossier

```bash
npm install --no-audit --no-fund
npm run dossier
# Sortie : ./dossier-valorisation/
```

Le script (`scripts/build-valuation-dossier.sh`) produit :

- `1-presentation/` — copie de `docs/` (canonique + audit + cabinet)
- `2-coverage/` — rapport Vitest HTML local (si `coverage/` présent)
- `3-audit-securite/` — `npm-audit.json` + `licenses.json`
- `4-cabinet/` — copie figée de `docs/cabinet/` (le présent)
- `5-historique-git/` — `git log`, `git shortlog`, `git tag --list`, `git-history-wave.txt`
- `6-inventaire/` — `cloc` (si disponible), `npm ls`
- `manifest.txt` — horodatage et arborescence

---

Dernière mise à jour : 2026-05-22. Snapshot : `v0.2.0`.
