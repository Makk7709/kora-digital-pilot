# Exploitation

Guide opérationnel pour installer, lancer, tester et construire Kora Digital Pilot.

## 1. Prérequis

- Node.js 20.x ou supérieur.
- npm 10.x (livré avec Node 20).
- Accès à un fournisseur Perplexity (clé d'API).
- Accès LinkedIn Developer (Client ID + Client Secret + URL de redirection autorisée).
- Optionnel : clé OpenAI et/ou Anthropic pour les modules d'assistance IA.

## 2. Installation

```bash
git clone <url-du-depot> kora
cd kora
npm install
cp .env.local.example .env.local
```

Éditer `.env.local` pour renseigner les clés réelles (voir `SECURITY.md` pour la catégorisation des variables).

## 3. Variables d'environnement

Fichier de référence : `.env.local.example`.

Variables côté bundle (préfixées `VITE_`) :

```
VITE_OPENAI_API_KEY=
VITE_CHATGPT_API_KEY=
VITE_ANTHROPIC_API_KEY=
VITE_PERPLEXITY_API_KEY=
VITE_PERPLEXITY_MODEL=llama-3.1-sonar-large-128k-online
VITE_PERPLEXITY_MAX_TOKENS=8000
VITE_PERPLEXITY_TEMPERATURE=0.2
VITE_LINKEDIN_CLIENT_ID=
VITE_LINKEDIN_CLIENT_SECRET=
VITE_LINKEDIN_REDIRECT_URI=http://localhost:8088/auth/linkedin/callback
```

Variables recommandées côté proxy (à introduire lors du durcissement décrit dans `SECURITY.md` et `TECH_DEBT.md`) :

```
ANTHROPIC_API_KEY=
LINKEDIN_CLIENT_SECRET=
```

## 4. Commandes principales

| Commande | Effet |
| --- | --- |
| `npm run dev:full` | Démarre simultanément le proxy (port 3001) puis l'application Vite (port 8088). À privilégier pour le développement courant |
| `npm run dev` | Démarre uniquement Vite (sans proxy ; certaines fonctionnalités LinkedIn et Anthropic seront indisponibles) |
| `npm run proxy` | Démarre uniquement le proxy `server.cjs` (port 3001) |
| `npm run build` | Compile TypeScript puis génère le bundle de production dans `dist/` |
| `npm run preview` | Sert localement le contenu de `dist/` |
| `npm run lint` | Lance ESLint sur l'ensemble du projet |
| `npm run test` | Lance Vitest en mode interactif |
| `npm run test:run` | Lance Vitest une fois, en mode CI |
| `npm run test:coverage` | Lance Vitest avec le rapport de couverture (V8) |
| `npm run health-check` | Sonde l'endpoint `/api/health` du proxy |
| `npm run ports:check` | Liste les processus occupant les ports Kora |
| `npm run ports:reset` | Arrête les processus Vite et proxy |

Les commandes `npm run dev:staging` / `npm run dev:production` permettent de cibler des configurations alternatives (ports 9088 / 10088 pour Vite, 4001 / 5001 pour le proxy).

## 5. Ports utilisés

| Port | Usage | Environnement |
| --- | --- | --- |
| 8088 | Application Vite | Développement |
| 8089 | HMR Vite | Développement |
| 8090 | `vite preview` | Développement |
| 8091 | Vitest UI | Développement |
| 3001 | Proxy `server.cjs` | Développement |
| 9088 | Application Vite | Staging |
| 4001 | Proxy `server.cjs` | Staging |
| 10088 | Application Vite | Production |
| 5001 | Proxy `server.cjs` | Production |

## 6. Sondes de santé

- `GET http://localhost:3001/api/health` : disponibilité du proxy.
- `GET http://localhost:3001/api/metrics` : métriques internes (développement).
- Console navigateur : la section Vue d'ensemble de l'application embarque les composants `ApiHealthDashboard` et `GlobalApiBlockerStatus` pour visualiser l'état des protections anti-spam.

## 7. Déploiement

À ce jour, aucun pipeline de déploiement de production n'est défini dans le dépôt. Le mode de mise à disposition est manuel : `npm run build` puis publication du dossier `dist/` sur l'hébergement statique cible (par exemple Vercel, Netlify, ou un bucket S3 servi via CloudFront).

Le proxy `server.cjs` est à héberger séparément (par exemple sur un nœud Node.js managé) et à exposer derrière un reverse proxy authentifié si l'application sort du périmètre poste local. Cette mise en production complète n'a pas encore été industrialisée ; elle est listée dans `TECH_DEBT.md` comme dette d'industrialisation.

## 8. Dépannage

| Symptôme | Action |
| --- | --- |
| Port 8088 ou 3001 déjà utilisé | `npm run ports:reset`, puis `npm run dev:full` |
| Échec d'authentification LinkedIn | Vérifier `VITE_LINKEDIN_REDIRECT_URI` côté code et côté LinkedIn Developer Portal |
| Boucle d'appels Perplexity et alertes anti-spam | Ouvrir la console navigateur et invoquer `globalApiBlocker.reset()` puis `window.perplexityProtectionMiddleware.reset()` |
| Variables d'environnement absentes | Vérifier la présence et le contenu de `.env.local`, redémarrer Vite (les variables sont lues au démarrage) |
| Erreurs TypeScript au build | `npx tsc --noEmit` pour le détail |

---

Dernière mise à jour : 2026-05-21.
