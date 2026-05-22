# Déploiement — Kora Digital Pilot

Document opérationnel de référence pour déployer Kora dans un environnement
de pré-production ou de production. Wave 3 — Agent 6 (SaaSisation light).

> Statut : scaffold. Le pipeline CI/CD ([`/.github/workflows/deploy.yml`](../.github/workflows/deploy.yml))
> compile et construit l'image Docker, mais le job `deploy` est désactivé
> (`if: false`) tant qu'aucune cible n'a été choisie par le porteur. Ce
> document décrit les options et les pré-requis communs.

---

## 1. Vue d'ensemble

L'application se compose de deux artefacts :

| Artefact | Rôle | Built by |
| --- | --- | --- |
| SPA React `dist/` | UI utilisateur, statique | `npm run build` |
| Proxy `server.cjs` | API LinkedIn / Anthropic, Supabase admin, telemetry | Node 20 |

Le `Dockerfile` multi-stage emballe les deux dans une image unique (le proxy
sert les assets statiques et expose `/api/*`). Cette image est suffisante
pour la plupart des cibles ; un déploiement séparé (CDN + Node) reste
possible.

Le backend de données est **Supabase** (Postgres managé + Auth). Aucune
provisioning n'est faite automatiquement : l'opérateur crée son projet
Supabase, copie les secrets dans les variables d'environnement, et applique
les migrations livrées dans [`supabase/migrations/`](../supabase/migrations/).

---

## 2. Pré-requis communs

1. **Projet Supabase** — créé sur <https://supabase.com> (free tier OK pour
   un pilote). Récupérer :
   - `Project URL`             → `SUPABASE_URL` + `VITE_SUPABASE_URL`
   - `anon public` key         → `VITE_SUPABASE_ANON_KEY`
   - `service_role` (secret)   → `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement)
2. **Migrations appliquées** — depuis un terminal authentifié au projet :
   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   # ou : psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_init.sql
   ```
3. **Secrets côté hébergeur** (GitHub Actions ou panneau de la cible) :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - LinkedIn : `VITE_LINKEDIN_CLIENT_ID`, `VITE_LINKEDIN_CLIENT_SECRET`,
     `VITE_LINKEDIN_REDIRECT_URI`
   - Providers IA : `VITE_PERPLEXITY_API_KEY`, `VITE_OPENAI_API_KEY`,
     `VITE_ANTHROPIC_API_KEY` selon les fonctions activées
4. **Nom de domaine** — l'URL configurée dans LinkedIn OAuth doit
   correspondre exactement à `VITE_LINKEDIN_REDIRECT_URI` (callback path :
   `/auth/linkedin/callback`).

---

## 3. Procédure Docker locale (équivalent staging)

```bash
# 1. Préparer le fichier .env (copier env.example puis renseigner les valeurs)
cp env.example .env

# 2. Construire l'image et lancer la stack
docker compose up --build

# 3. Tester
curl http://localhost:3001/api/health
```

`docker-compose.yml` fournit aussi un Postgres 15 local (volume `kora_pgdata`),
utile si vous voulez appliquer les migrations SQL sans dépendre d'un projet
Supabase. Attention : ce Postgres seul ne fournit pas Supabase Auth — l'app
tournera donc en mode démo (voir [`docs/AUTH_MULTI_TENANT.md`](./AUTH_MULTI_TENANT.md)).

---

## 4. Procédure générique CI/CD

Le workflow [`/.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) :

1. se déclenche sur les tags `v*.*.*` ou en manuel (`workflow_dispatch`) ;
2. exécute `npm run check` (lint + typecheck + tests + build) ;
3. construit l'image Docker (sans push) ;
4. **placeholder** : le job `deploy` est désactivé. Y brancher l'action
   spécifique à la cible choisie.

### Cibles supportées (au choix)

| Cible | Forces | Faiblesses | Recommandé pour |
| --- | --- | --- | --- |
| **Fly.io** | proche du container, scale-to-zero, secrets natifs, Postgres managé | facturation à l'usage parfois opaque | pré-prod et prod légère |
| **Render** | très simple, dashboard clair, postgres managé inclus | scale limité, pas de scale-to-zero gratuit | démo client, pilote payant |
| **Railway** | DX excellente, services jumeaux | facturation min/$5 | équipes early-stage |
| **Vercel** | hébergement SPA premium, edge | proxy Node à externaliser | si on découple front / API |
| **Cloud Run (GCP)** | scale-to-zero, prix bas, robustesse | setup IAM lourd | usage entreprise |
| **VPS (Hetzner, OVH)** | coût fixe, contrôle total | ops à votre charge | pilotes long-terme |

### Plan minimum d'activation

1. Pour la cible choisie, configurer les secrets listés en §2 dans les
   variables d'environnement.
2. Ajouter le step `deploy` correspondant dans `deploy.yml` (ex.
   `superfly/flyctl-actions/setup-flyctl@master` + `flyctl deploy`).
3. Retirer le `if: false` du job `deploy`.
4. Pousser un tag `v0.3.0` pour déclencher.

---

## 5. Checklist avant mise en ligne

- [ ] Migrations Supabase appliquées et vérifiées (`select * from pg_policies`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` présent côté serveur uniquement (jamais en `VITE_`)
- [ ] `VITE_LINKEDIN_REDIRECT_URI` aligné avec l'app LinkedIn déclarée
- [ ] HTTPS actif (HSTS s'active automatiquement en `NODE_ENV=production`,
      cf. `server.cjs` §HELMET)
- [ ] Cookies LinkedIn `Secure` (automatique en production)
- [ ] `/api/health` retourne 200 et `supabase.configured: true`
- [ ] Smoke flow : signup → org auto-créée → login → /app accessible
- [ ] Une requête `select * from public.usage_events` retourne au moins un
      événement après un export PDF de test

---

## 6. Rollback

L'image Docker est immuable : pour rollback, redéployer le tag précédent.
Les migrations Supabase sont additives par défaut ; en cas de migration
destructrice future, ajouter un fichier `00xx_rollback.sql` jumeau et le
documenter ici.

---

## 7. Limites assumées (Wave 3)

- Pas de billing/Stripe : les `organizations.plan` sont des labels.
- Pas d'invitation d'utilisateurs : un user = une org perso à l'inscription.
- Sessions LinkedIn toujours en `Map` mémoire dans `server.cjs` ; le
  scaffold `linkedin_sessions` est livré dans le schéma mais pas branché.
- Le job `deploy` du workflow est désactivé tant qu'aucune cible n'est
  choisie.

Voir [`docs/audit/SAASISATION_REPORT.md`](./audit/SAASISATION_REPORT.md) pour
la trajectoire d'itération.
