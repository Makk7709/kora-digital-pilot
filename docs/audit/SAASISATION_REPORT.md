# SaaSisation light — rapport d'agent

| Champ | Valeur |
| --- | --- |
| Wave | 3 |
| Agent | 6 — Produit / SaaSisation légère |
| Branche | `feat/saasisation-light` |
| Base | tag `wave2-merged` (commit `13a0f47`) |
| Snapshot pré-agent | tag `pre-agent6-snapshot` |
| Stack ajoutée | `@supabase/supabase-js`, scaffold Docker, GH Actions placeholder |

---

## 1. Cadre

Faire passer Kora d'« outil interne mono-utilisateur » à « actif
commercialisable crédible » sans tomber dans le piège du SaaS complet.
Wave 3 livre les **briques minimales défendables** : auth, multi-tenant
RLS, télémétrie scopée par org, scaffold Docker, workflow déploiement
placeholder. Toutes les briques sont conçues pour **dégrader proprement en
mode démo** quand Supabase n'est pas configuré, de sorte que `npm run dev`
continue de marcher comme avant.

---

## 2. Avant (post Wave 2)

- Aucune notion d'utilisateur, aucune authentification applicative ;
- Aucun multi-tenant — toute la session vit dans le browser de l'opérateur ;
- Pas de persistance backend : LinkedIn en `Map` mémoire, exports en
  `localStorage` ;
- Pas de télémétrie ;
- Pas de cible de déploiement (l'app tournait en local uniquement).

## 3. Après (livré dans cette wave)

### 3.1 Données — schéma multi-tenant Supabase

Fichier : [`supabase/migrations/0001_init.sql`](../../supabase/migrations/0001_init.sql).

- Tables `organizations`, `org_members`, `usage_events`, scaffold
  `linkedin_sessions` (non câblé).
- RLS activée + policies (`select if member`, `insert/update owner only`,
  etc.).
- Trigger `kora_on_auth_user_created` (SECURITY DEFINER) qui auto-provisionne
  une org perso + un `owner` membership au signup.
- Fonction `kora_generate_slug` (déterministe + suffixe random).

### 3.2 Frontend — auth + tenant

- `src/lib/supabase-client.ts` — client browser optionnel (`null` si non
  configuré).
- `src/lib/auth-client.ts` — wrappers `signIn / signUp / signOut / getCurrentSession / getCurrentOrg`
  avec fallback `DEMO_USER` / `DEMO_ORG`.
- `src/contexts/AuthContext.tsx` — souscrit à `onAuthStateChange`, expose
  `user / accessToken / loading / signIn / signUp / signOut`.
- `src/contexts/TenantContext.tsx` — résout l'org primaire via
  `org_members`, expose `currentOrg / orgs / switchOrg`.
- `src/pages/Auth.tsx` + `SignIn.tsx` + `SignUp.tsx` — page combinée avec
  validation Zod + react-hook-form.
- `src/components/auth/RequireAuth.tsx` — garde `/app` et `/settings`
  (no-op en démo).
- `src/App.tsx` — wrappé dans `<AuthProvider><TenantProvider>…`.

### 3.3 Backend — proxy étendu

Fichier : [`server.cjs`](../../server.cjs) section `SAAS / MULTI-TENANT`.

- Import du client admin via `src/lib/supabase-admin.cjs` (jumeau CJS du
  `.ts`).
- Middleware `requireUser` : valide le JWT Supabase, résout `req.user` +
  `req.org`, ou bascule en mode démo si la service-role key est absente.
- `GET  /api/me`     — identité + org courante.
- `POST /api/usage`  — append-only telemetry, scope automatique par org,
  rate-limited (240/min), tronque les `properties` > 4 KB.
- Health check enrichi avec `supabase.configured`.

### 3.4 Telemetry

Fichier : [`src/lib/usage-logger.ts`](../../src/lib/usage-logger.ts).

Instrumentation Wave 3 :

| Event | Source | Notes |
| --- | --- | --- |
| `auth.login.success` | `SignIn.tsx` | + `email_domain` |
| `auth.signup.success` | `SignUp.tsx` | + `email_domain` |
| `linkedin.connect.success` | `LinkedInCallback.tsx` | + `hasProfile` |
| `report.generated` | `BrandMonitoring.tsx` (Perplexity) | + `source`, `brandName` |
| `export.pdf` | `BrandMonitoring.tsx` | + `brandName`, `fileSize` |

### 3.5 Déploiement scaffold

- [`Dockerfile`](../../Dockerfile) multi-stage (deps → build → runtime,
  user `node`, healthcheck `/api/health`).
- [`docker-compose.yml`](../../docker-compose.yml) — `app` + `postgres:15`
  (volume + healthcheck) pour le dev local sans Supabase.
- [`.dockerignore`](../../.dockerignore) — image lean.
- [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml) —
  build + docker build + job `deploy` désactivé (`if: false`) en attendant
  qu'une cible soit choisie.

### 3.6 Documentation

- [`docs/DEPLOYMENT.md`](../DEPLOYMENT.md) — options de cible, prérequis,
  checklist mise en ligne, rollback, limites.
- [`docs/AUTH_MULTI_TENANT.md`](../AUTH_MULTI_TENANT.md) — schéma, RLS,
  flux signup, fallback démo, requêtes utiles.
- [`docs/USAGE_LOGGING.md`](../USAGE_LOGGING.md) — pipeline, events,
  requêtes SQL d'activation.
- [`supabase/README.md`](../../supabase/README.md) — comment appliquer les
  migrations local / remote.
- `env.example` + `.env.example` — variables Supabase ajoutées + commentaire
  sur la frontière `VITE_` vs server-only.

---

## 4. Smoke / validation

| Check | Statut | Détails |
| --- | --- | --- |
| `npm run lint` | ✅ | 0 errors, 493 warnings (≤ 600). |
| `npm run typecheck` | ✅ | propre. |
| `npm run test:run` | ✅ | 134 passed / 273 skipped (parité Wave 2). |
| `npm run build` | ✅ | bundle généré sans erreur. |
| `npm run check` | ✅ | vert sans Supabase configuré. |
| `npm run dev:full` smoke | ⏭️ | non lancé (timing) ; le boot a été validé indirectement via `check` et l'absence de régression d'import. |
| `docker build .` | ⏭️ | Docker non disponible dans l'environnement d'exécution de l'agent — voir limites §6. |

---

## 5. Compatibilité avec la session LinkedIn d'Agent 1

- `server.cjs` n'a **rien retiré** au code d'Agent 1.
- Les routes `/api/auth/linkedin/{session,logout,me}` restent intactes.
- Le cookie `kora_linkedin_session` (httpOnly, SameSite=Lax, Secure en
  production) continue d'être posé par les mêmes paths.
- Le `Map linkedinSessions` n'est ni partagé ni purgé.
- La nouvelle table `linkedin_sessions` est créée mais **non câblée** —
  elle est là pour une future itération.
- `requireUser` n'interfère pas avec les endpoints LinkedIn (il n'est
  monté que sur `/api/me` et `/api/usage`).

---

## 6. Limites assumées

- **Pas de billing.** Le champ `organizations.plan` est un label (`free`)
  sans wiring Stripe / Lemonsqueezy.
- **Pas d'invitations.** Un user = une org perso au signup. L'ajout
  manuel se fait via SQL editor (voir AUTH_MULTI_TENANT §6).
- **Sessions LinkedIn en mémoire.** Le scaffold Postgres est livré mais
  pas branché — Wave suivante.
- **Demo mode coexistant avec le mode prod.** Quand Supabase n'est pas
  configuré, `RequireAuth` ne redirige pas vers `/auth` — on garde le UX
  d'avant. Si on veut forcer l'auth en dev, il faut configurer un projet
  Supabase local.
- **Pas de UI org-switcher.** `TenantContext.switchOrg` est implémenté
  mais aucun composant de header ne le déclenche encore.
- **Pas de retry / batching côté telemetry.** Un échec réseau perd
  l'événement (silencieusement, comme demandé).
- **Tests automatisés non livrés pour cette wave.** Conformes à la
  contrainte « ne livre pas de tests » : la couverture reste à 134 passed,
  et les nouvelles surfaces (`AuthProvider`, `requireUser`, `logUsage`)
  sont à tester dans une wave dédiée.
- **`docker build` non exécuté** dans l'environnement de l'agent
  (Docker absent). Le Dockerfile est syntaxiquement valide
  (`docker/dockerfile:1.6` schema standard) ; à valider par le porteur.

---

## 7. Plan itérations suivantes

| # | Sujet | Effort | Pré-requis |
| --- | --- | --- | --- |
| 1 | Choisir une cible (Fly.io / Render / VPS) + activer le job `deploy` | XS | secrets côté hébergeur |
| 2 | UI invitations d'utilisateurs + table `pending_invitations` + ajustement du trigger | M | UI Settings → Équipe |
| 3 | Brancher Stripe (Checkout + webhook) sur `organizations.plan` | M | compte Stripe |
| 4 | Quotas par plan (rate limit `report.generated` côté server) | S | étape 3 |
| 5 | Migrer les sessions LinkedIn vers `linkedin_sessions` (chiffrement at-rest) | M | revue secu |
| 6 | Org-switcher dans le header + state persisté | S | — |
| 7 | Audit log admin (table `audit_events`) | S | — |
| 8 | Email transactionnels (Resend / Postmark) | S | provider email |
| 9 | Export S3 du `usage_events` pour BI | S | bucket |
| 10 | Tests automatisés sur la couche auth + telemetry | M | — |

---

## 8. Risques résiduels

1. **Trigger Supabase non testé contre une vraie base.** Le SQL est revu
   et idempotent (`drop policy / function / trigger if exists`), mais
   la première application en prod doit être faite en pré-prod d'abord
   pour valider le `SECURITY DEFINER` + `search_path = public`.
2. **`SUPABASE_SERVICE_ROLE_KEY` mal placée.** Une fuite côté front
   donnerait un bypass RLS total. La convention `SUPABASE_*` (sans
   `VITE_`) est appliquée et documentée, mais c'est de la convention,
   pas une garantie technique.
3. **Mode démo en prod.** Si les vars Supabase sont absentes en
   production, `RequireAuth` devient un no-op et `/app` est accessible
   sans login. La checklist mise en ligne (§5 de `DEPLOYMENT.md`) inclut
   un contrôle `supabase.configured: true`.
4. **Bundle augmenté.** `@supabase/supabase-js` ajoute ~50–80 KB gzip.
   Acceptable au regard de l'usage.
5. **Pas de logout côté UI.** Implicite : il faut clear le storage. Un
   bouton « Se déconnecter » dans `Settings` est à ajouter dans la prochaine
   itération (`signOut` est déjà exposé par `useAuth`).

---

## 9. Action utilisateur requise

Pour passer du scaffold à un environnement réellement provisionné :

1. **Créer le projet Supabase** sur <https://supabase.com> (free tier).
2. **Copier les 3 valeurs** dans le `.env` (et dans les secrets de la
   cible de déploiement) :
   - `VITE_SUPABASE_URL` + `SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server uniquement)
3. **Appliquer la migration** :
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
4. **Configurer LinkedIn OAuth** : ajouter le domaine de prod en
   `VITE_LINKEDIN_REDIRECT_URI` côté .env et dans le portail LinkedIn
   Developers.
5. **Choisir la cible de déploiement** (cf. `DEPLOYMENT.md` §4) et
   activer le job `deploy` du workflow GitHub Actions.

---

## 10. Liste des commits (oneline)

```
$ git log --oneline wave2-merged..feat/saasisation-light
```

(voir la sortie dans le terminal au moment du handover).
