# Documentation Kora Digital Pilot

Table des matières du dossier `docs/`. Ces documents sont opposables : ils décrivent l'état réel du logiciel à la date indiquée dans chaque fichier et constituent la base documentaire de la valorisation.

## Documents canoniques

| Document | Objet |
| --- | --- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack technique, modules, flux de données, décisions d'architecture |
| [DATA_MODEL.md](./DATA_MODEL.md) | Types métier, clés de stockage côté navigateur, statut « données réelles vs simulées » |
| [FEATURES.md](./FEATURES.md) | Catalogue fonctionnel par section applicative |
| [SECURITY.md](./SECURITY.md) | Modèle de menaces, gestion des secrets, risques résiduels, rotation des clés |
| [OPERATIONS.md](./OPERATIONS.md) | Prérequis, variables d'environnement, commandes, ports, déploiement |
| [LICENSES.md](./LICENSES.md) | Licence du projet et licences des dépendances |
| [TECH_DEBT.md](./TECH_DEBT.md) | Dette technique assumée, datée et trajectoire de remédiation |
| [DEMO.md](./DEMO.md) | Parcours utilisateur clé pour démonstration |

## Sous-dossiers

| Dossier | Contenu |
| --- | --- |
| [guides/](./guides/) | Guides utilisateurs ou opérationnels encore maintenus |
| [archive/](./archive/) | Historique des rapports d'incidents, audits, refactorings et prompts de tests, conservés pour traçabilité mais non maintenus |
| [audit/](./audit/) | Artefacts générés par les outils d'audit automatique (licences, dépendances, sécurité) |

## Conventions

- Les documents canoniques sont datés en bas de fichier.
- Les ajouts ou modifications passent par une pull request avec mention dans le CHANGELOG racine.
- Les rapports terminés (post-mortem, audits ponctuels) doivent être déposés dans `archive/` avec date d'archivage.
