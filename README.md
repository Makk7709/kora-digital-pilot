# Kora Digital Pilot

Plateforme de communication digitale et de brand intelligence éditée par Korev AI.

[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-vitest-blue)](./docs/OPERATIONS.md#4-commandes-principales)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

Kora Digital Pilot regroupe en un seul outil interne la veille concurrentielle (Perplexity), le pilotage de community management, l'analytics LinkedIn, la génération de contenu assistée par IA (OpenAI, Anthropic), le planning éditorial multi-plateformes et l'export PDF/Excel. L'application est une SPA React adossée à un proxy Node.js minimal pour les appels nécessitant un secret serveur.

## Démarrage rapide

```bash
npm install
cp .env.local.example .env.local   # renseigner les cles d'API
npm run dev:full                   # demarre le proxy (3001) puis l'app (8088)
```

Pour les détails (variables d'environnement, ports, commandes alternatives, dépannage), voir [`docs/OPERATIONS.md`](./docs/OPERATIONS.md).

## Documentation

Toute la documentation opposable est dans [`docs/`](./docs/README.md).

| Document | Objet |
| --- | --- |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Stack, modules, flux SPA / proxy / APIs externes, décisions d'architecture |
| [docs/DATA_MODEL.md](./docs/DATA_MODEL.md) | Types métier, clés `localStorage`, distinction données réelles / simulées |
| [docs/FEATURES.md](./docs/FEATURES.md) | Catalogue fonctionnel par section applicative |
| [docs/SECURITY.md](./docs/SECURITY.md) | Modèle de menaces, gestion des secrets, rotation des clés |
| [docs/OPERATIONS.md](./docs/OPERATIONS.md) | Installation, commandes, ports, déploiement |
| [docs/LICENSES.md](./docs/LICENSES.md) | Licence du projet et licences des dépendances |
| [docs/TECH_DEBT.md](./docs/TECH_DEBT.md) | Dette technique assumée et trajectoire |
| [docs/DEMO.md](./docs/DEMO.md) | Parcours utilisateur de démonstration |

L'historique des post-mortems, audits ponctuels et plans de refactoring est conservé dans [`docs/archive/`](./docs/archive/README.md).

## Scripts npm clés

| Commande | Effet |
| --- | --- |
| `npm run dev:full` | Lance le proxy puis l'application en mode développement |
| `npm run build` | Build de production (TypeScript + Vite) |
| `npm run preview` | Sert localement le bundle de production |
| `npm run test` | Vitest interactif |
| `npm run test:run` | Vitest en mode CI |
| `npm run test:coverage` | Couverture V8 |
| `npm run lint` | ESLint |
| `npm run health-check` | Sonde le proxy local |

Liste complète et options : voir [`docs/OPERATIONS.md`](./docs/OPERATIONS.md).

## Stack technique

Vite 5 · React 18 · TypeScript ~5.6 · Tailwind CSS 3 · shadcn/ui (Radix) · React Router 6 · React Query 5 · Zod · Vitest 2 · Express 4 (proxy Node 20+).

Détails et choix d'architecture : [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Sécurité

Voir [`docs/SECURITY.md`](./docs/SECURITY.md) pour le modèle de menaces, la catégorisation des clés `VITE_*` versus secrets serveur, et la procédure de rotation. Signalement d'une vulnérabilité : voir [`SECURITY.md`](./SECURITY.md) à la racine.

## Contribution

Voir [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Licence

Distribué sous licence MIT. Voir [`LICENSE`](./LICENSE) et [`docs/LICENSES.md`](./docs/LICENSES.md) pour le détail des dépendances.

© 2024–2026 Korev AI.
