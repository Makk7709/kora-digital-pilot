# Archive documentaire

Ce dossier rassemble l'historique documentaire de Kora Digital Pilot accumulé pendant les phases de construction du produit. Il est conservé pour traçabilité (post-mortems, rapports d'audits, plans de refactoring, prompts de tests) mais n'est **plus maintenu**.

Ne pas se référer à ces documents pour comprendre l'état actuel du logiciel. La documentation vivante est dans `docs/` (racine).

## Organisation

| Sous-dossier | Contenu |
| --- | --- |
| [`incidents/`](./incidents/) | Rapports de résolution de bugs, fiches « problème résolu », correctifs OAuth LinkedIn, correctifs API |
| [`audits/`](./audits/) | Rapports d'audits ponctuels (TDD, Perplexity, veille de marque, CM dashboard, refactoring) |
| [`refactoring/`](./refactoring/) | Plans de refactoring, transitions de phases, résumés d'intégration, releases passées |
| [`prompts-tests/`](./prompts-tests/) | Prompts de tests, guides de test pour exports PDF, guides de protection anti-spam |
| [`guides/`](./guides/) | Guides utilisateurs ou opérationnels absorbés dans la documentation canonique |

## Politique de redaction

Les secrets (`pplx-*`, `sk-proj-*`, `sk-ant-api*`, `WPL_AP1.*`, identifiants LinkedIn) présents dans ces archives ont été remplacés par `[REDACTED]` lors de la phase d'archivage. Tout secret résiduel doit être signalé et rotaté immédiatement.

## Politique de purge

Aucune purge n'est planifiée : ces documents sont des pièces du dossier de constitution du produit. Si une refonte ultérieure les rend obsolètes, ils restent conservés.
