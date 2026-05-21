# 01 — Périmètre

## 1.1 Nature du projet

Kora Digital Pilot est une application interne éditée par Korev AI, destinée au pilotage de communication digitale et à la veille de marque. Le produit est constitué de deux artefacts techniques :

| Artefact | Description | Référence |
| --- | --- | --- |
| Single Page Application (SPA) | Application React/TypeScript empaquetée par Vite, livrée comme bundle statique au navigateur | [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §2 |
| Proxy Node/Express minimal | Service serveur monofichier `server.cjs` exposant les endpoints nécessitant un secret côté serveur (LinkedIn OAuth, Anthropic, gestion de session) | [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §6, [`server.cjs`](../../server.cjs) |

**Constaté** par lecture directe du code et de la configuration.

## 1.2 Stack technique

Pile détaillée dans [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) §2, croisée avec `package.json` :

| Couche | Technologie | Version |
| --- | --- | --- |
| Build / bundler | Vite | 5.4.x |
| Framework UI | React | 18.3.x |
| Langage | TypeScript | ~5.6 |
| Styling | Tailwind CSS 3.4 + shadcn/ui (Radix UI) | – |
| Routing | React Router DOM | 6.28 |
| State / data | TanStack React Query | 5.56 |
| Formulaires / validation | React Hook Form + Zod | – |
| Visualisation | Recharts | 2.15 |
| Génération PDF | jsPDF | 4.2.1 (post Wave 1) |
| Proxy serveur | Node.js 20+ / Express 4.21 / node-fetch 2.x | – |
| Tests | Vitest 2.1.9 + Testing Library + jsdom | – |
| Coverage | `@vitest/coverage-v8` 2.1.9 | – |
| Hooks Git | Husky + lint-staged + commitlint conventional | – |

**Constaté** par lecture de [`package.json`](../../package.json).

## 1.3 Domaine fonctionnel

Le produit s'organise autour de trois axes métier :

1. **Brand intelligence** — analyse multi-dimensions d'une marque (objectif, actions récentes, SWOT, signaux faibles, recommandations actionnables) via l'API Perplexity.
2. **Community management** — pilotage éditorial multi-plateformes (LinkedIn, Instagram, X / Twitter), planning, bibliothèque de contenus.
3. **Analytics LinkedIn** — restitution temps réel des indicateurs LinkedIn (engagement, portée, posts) via OAuth.

Catalogue applicatif détaillé dans [`docs/FEATURES.md`](../FEATURES.md). Les 10 sections de la coque `/app` :

| Section (`activeSection`) | Composant racine | Mode de données |
| --- | --- | --- |
| `dashboard` | `Dashboard.tsx` | Hybride — LinkedIn réel ; Instagram / X via `DEMO_*` en mode démo, sinon `EmptyState` |
| `cm-dashboard` | `CommunityManagerDashboard.tsx` | Réelles (Perplexity) |
| `cm-domain-search` | `CommunityManagerDomainDashboard.tsx` | Réelles (Perplexity) |
| `brand-monitoring` | `BrandMonitoring.tsx` (~1 393 L) | Hybride — analyse Perplexity ; fallback étiqueté `(Démo)` / `(Test)` |
| `brand-intelligence-tdd` | `enhanced/BrandIntelligenceDashboard.tsx` (~1 227 L) | Hybride — branchée Perplexity |
| `inspiration` | `InspirationAI.tsx` | Réelles (OpenAI / Anthropic) |
| `images` | `ImageGenerator.tsx` | Réelles (API d'image) |
| `planning` | `PlanningWithPerplexity.tsx` | Réelles — saisie utilisateur + Perplexity |
| `analytics` | `Analytics.tsx` (~1 178 L) | Hybride — LinkedIn réel ; Instagram / X en démo |
| `library` | `Library.tsx` | Démo (catalogue) ; persistance réelle des rapports utilisateur |

**Constaté** par lecture directe des composants et de [`docs/FEATURES.md`](../FEATURES.md).

## 1.4 Intégrations externes

| Fournisseur | Usage | Côté | Référence dans le code |
| --- | --- | --- | --- |
| Perplexity | Brand intelligence, recherche de domaine, veille | Client (clé `VITE_PERPLEXITY_API_KEY`) | [`src/lib/perplexity-service.ts`](../../src/lib/perplexity-service.ts) |
| OpenAI | Génération de contenu et d'idées | Client (`VITE_OPENAI_API_KEY`) | [`src/lib/chatgpt-service.ts`](../../src/lib/chatgpt-service.ts), [`src/hooks/useAI.ts`](../../src/hooks/useAI.ts) |
| Anthropic | Génération hybride et plan stratégique | Proxy (`ANTHROPIC_API_KEY` serveur) | `POST /api/anthropic/messages` dans [`server.cjs`](../../server.cjs) |
| LinkedIn | OAuth + analytics + posts récents | Proxy + session cookie `HttpOnly` | [`src/lib/linkedin-api.ts`](../../src/lib/linkedin-api.ts), `/api/auth/linkedin/*` dans `server.cjs` |

**Constaté** par lecture des modules cités et de [`docs/SECURITY.md`](../SECURITY.md) §2.

## 1.5 Persistance

**Pas de base de données serveur.** L'ensemble de la persistance applicative se fait :

- côté navigateur, via `localStorage` (planning, paramètres anti-spam, historique d'exports, état d'auth UI) ;
- côté proxy, dans une `Map<sessionId, …>` en mémoire pour les sessions LinkedIn (purge automatique sur expiration).

Référence : [`docs/DATA_MODEL.md`](../DATA_MODEL.md) (catalogue des clés `localStorage`), [`docs/SECURITY.md`](../SECURITY.md) §3.3.

**Constaté** par lecture directe.

## 1.6 Hors périmètre

Sont explicitement hors périmètre du livrable au snapshot `v0.2.0` :

- aucune base de données relationnelle ou NoSQL serveur ;
- aucun module de facturation ou d'abonnement ;
- aucune authentification multi-utilisateurs applicative ;
- aucun pipeline CI/CD de déploiement production ;
- aucun mobile natif (iOS / Android) ;
- aucune fonctionnalité multi-tenant.

**Constaté** par inspection de la structure du repo et de la documentation. Voir aussi [`06-limites-assumees.md`](./06-limites-assumees.md).

## 1.7 Volumétrie du code source

Mesures rapportées dans [`docs/audit/PROJECT_AUDIT_NOTES.md`](../audit/PROJECT_AUDIT_NOTES.md) §4.1 (audit READ-ONLY 2026-05-21) :

| Périmètre | Fichiers | Lignes |
| --- | --- | --- |
| `src/components/` (UI applicative, incluant `ui/` shadcn) | 97 | 23 388 |
| `src/services/` (logique métier orchestrée) | 23 | 10 480 |
| `src/test/` (tests Vitest) | 23 | 7 588 |
| `src/lib/` (couches techniques transverses) | 13 | 5 252 |
| `src/hooks/` (hooks React métier) | 9 | 3 166 |
| `src/types/` (types métier) | 2 | 825 |
| `src/pages/` (pages racines) | 4 | 462 |
| **Total `src/`** | **176** | **51 990** |
| `server.cjs` (proxy Express monofichier) | 1 | 598 |

**Déduit** des chiffres collectés en audit READ-ONLY ; reproductible par `find src -type f -name '*.ts' -o -name '*.tsx' | xargs wc -l`.

## 1.8 Identité juridique du livrable

| Champ | Valeur observée | Source |
| --- | --- | --- |
| Nom de package | `kora-digital-pilot` | [`package.json`](../../package.json) ligne 2 |
| Version | `0.2.0` | [`package.json`](../../package.json) ligne 4 |
| Description | « Plateforme interne Korev AI de communication digitale et de brand intelligence (SPA React + proxy Node). » | [`package.json`](../../package.json) ligne 5 |
| Auteur | « Korev AI » | [`package.json`](../../package.json) ligne 6 |
| Licence | MIT | [`package.json`](../../package.json) ligne 7 + [`LICENSE`](../../LICENSE) |
| Privé | `true` | [`package.json`](../../package.json) |
| Repository (URL) | non renseigné — placeholder explicite | [`README.md`](../../README.md) ligne badge CI (`<!-- TODO: replace -->`) |

**À confirmer par le porteur** : organisation GitHub cible, statut de la marque « Korev AI » et « Kora Digital Pilot », contact `security@korev.ai`.

---

Dernière mise à jour : 2026-05-22.
