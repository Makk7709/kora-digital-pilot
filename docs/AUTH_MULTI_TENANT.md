# Authentification & multi-tenant — Kora Digital Pilot

Wave 3 — Agent 6 (SaaSisation light).
Document de référence pour comprendre, étendre ou auditer la couche auth
multi-tenant introduite dans cette wave.

---

## 1. Pourquoi cette wave

Kora était un outil interne mono-utilisateur sans couche d'identité. Pour
qu'il devienne un actif commercialisable il faut a minima :

- une **identité** (qui utilise l'app) ;
- une **organisation** (le client à qui facturer) ;
- un **isolement** entre clients (Row-Level Security) ;
- un **fallback démo** pour les démonstrations sans backend.

La pile retenue est **Supabase** (auth + Postgres + RLS), avec **fallback
en mémoire** quand les variables `SUPABASE_*` ne sont pas configurées. Aucun
provisioning Supabase n'est fait par cette wave — c'est une action porteur
(voir [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md)).

---

## 2. Schéma de données

Fichier source : [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql).

```
auth.users          (Supabase managed)
   │
   │  user_id  (FK)
   ▼
org_members ──────────► organizations
   │                       ▲
   │  org_id (FK)          │
   ▼                       │
usage_events               │
                           │
linkedin_sessions  ────────┘   (scaffold, non câblé en Wave 3)
```

### `organizations`
| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` (pk, default `gen_random_uuid()`) | |
| `name` | `text not null` | nom commercial |
| `slug` | `text not null unique` | URL-friendly, généré par trigger |
| `plan` | `text not null default 'free'` | stub billing (`free | pro | enterprise`) |
| `created_at` | `timestamptz` | |

### `org_members`
| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` (pk) | |
| `org_id` | `uuid FK organizations on delete cascade` | |
| `user_id` | `uuid FK auth.users on delete cascade` | |
| `role` | `'owner' | 'admin' | 'member'` | défaut `owner` |
| `created_at` | `timestamptz` | |
| _unique_ | `(org_id, user_id)` | |

### `usage_events`
| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` (pk) | |
| `org_id` | `uuid FK organizations on delete cascade` | |
| `user_id` | `uuid FK auth.users on delete set null` | |
| `event_name` | `text not null` | ex `report.generated` |
| `properties` | `jsonb default '{}'::jsonb` | payload libre, ≤ 4 KB |
| `created_at` | `timestamptz` | indexé desc avec `org_id` |

### `linkedin_sessions` (scaffold)
Prévu pour migrer plus tard le `Map` en mémoire d'Agent 1 vers Postgres.
Non utilisé en Wave 3 — `server.cjs` continue d'utiliser sa Map locale.

---

## 3. Politiques RLS

RLS est activé sur **toutes** les tables business. Sémantique générale :

| Table | SELECT | INSERT | UPDATE / DELETE |
| --- | --- | --- | --- |
| `organizations` | si l'utilisateur est membre | tout user authentifié (l'org auto-créée est posée par trigger) | owner uniquement |
| `org_members` | membre = soi ou même org | owner uniquement | owner uniquement |
| `usage_events` | si membre de l'org | si membre de l'org | — (append-only) |
| `linkedin_sessions` | si `user_id = auth.uid()` | idem | idem |

Les politiques sont nommées et reproduites en `drop policy if exists … create policy …`
pour rester ré-appliquables sans erreur.

---

## 4. Flux signup → organisation auto-créée

1. L'utilisateur s'inscrit via [`/auth`](../src/pages/Auth.tsx) (composants
   `SignUp`/`SignIn`, validation Zod, react-hook-form).
2. `@supabase/supabase-js` poste le couple email/mot de passe à Supabase Auth.
3. Supabase crée un row dans `auth.users`.
4. Le trigger `kora_on_auth_user_created` (SECURITY DEFINER) s'exécute :
   - crée une `organizations` (`name = email`, `slug = generate_slug(email)`,
     `plan = 'free'`) ;
   - crée la `org_members` avec `role = 'owner'`.
5. La réponse Supabase contient un JWT ; le client le stocke en localStorage
   (option `persistSession: true`).
6. `AuthContext` reçoit l'event `SIGNED_IN` via `onAuthStateChange` et
   pousse le user dans tout l'arbre React.
7. `TenantContext` interroge `org_members` pour résoudre l'org primaire.

```
Browser                       Supabase                    Postgres (trigger)
   │  signUp(email,pwd)          │                              │
   │ ──────────────────────────► │                              │
   │                             │ insert auth.users            │
   │                             │ ───────────────────────────► │
   │                             │                              │ insert organizations
   │                             │                              │ insert org_members (owner)
   │  SIGNED_IN event            │                              │
   │ ◄────────────────────────── │                              │
   │  fetch org_members           │                              │
   │ ──────────────────────────► │ select where user_id=…       │
   │                             │ ───────────────────────────► │
   │  current org                │                              │
   │ ◄────────────────────────── │                              │
```

---

## 5. Fallback démo (Supabase non configuré)

Quand `VITE_SUPABASE_URL` ou `VITE_SUPABASE_ANON_KEY` sont absents :

- `src/lib/supabase-client.ts` exporte `null`.
- `AuthContext` initialise `user = DEMO_USER` (`id: 'demo-user'`,
  `email: 'demo@local'`, `isDemo: true`) instantanément.
- `TenantContext` retourne `DEMO_ORG` (`id: 'demo-org'`, `slug: 'demo'`).
- `RequireAuth` ne redirige jamais vers `/auth`.
- `server.cjs` détecte l'absence du service-role key et :
  - `GET /api/me` renvoie l'identité démo + `authMode: 'demo'`,
  - `POST /api/usage` répond `202` sans persister (`persisted: false`).

Conséquence : `npm run dev:full` continue de marcher sans la moindre
configuration. La `DataModeBanner` existante d'Agent 4 (Wave 1) signale
déjà à l'opérateur que les données sont en mode dégradé.

---

## 6. Ajouter un user à une org existante (à venir)

Wave 3 n'implémente pas la UI d'invitation. La trajectoire est :

1. Owner ouvre `/settings` → onglet « Équipe » (UI à créer).
2. POST `/api/orgs/:id/invite` (endpoint à créer) → email Supabase Auth
   (`supabase.auth.admin.inviteUserByEmail`).
3. Au signup, le trigger `kora_on_auth_user_created` doit être adapté pour
   ne PAS créer une org perso si l'utilisateur a déjà été pré-inscrit comme
   membre (lookup via une table `pending_invitations`).

En attendant, un opérateur peut ajouter manuellement un user via le SQL
editor Supabase :

```sql
insert into public.org_members (org_id, user_id, role)
values ('<org-uuid>', '<user-uuid>', 'member');
```

(L'opération nécessite la service-role key et bypasse la RLS « owner only ».)

---

## 7. Tests recommandés (à écrire dans une wave dédiée tests)

- Signup → `organizations` créée + `org_members` `owner` posé.
- Login → JWT reçu, `req.user` résolu dans `requireUser`.
- `GET /api/me` → 401 sans Bearer ; 200 + payload avec.
- `POST /api/usage` → 202, insert visible avec `select * from usage_events`.
- Tentative de cross-tenant : user A interroge `org_members` de user B → 0 rows.

---

## 8. Références internes

- Migrations SQL : [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql)
- Client browser : [`src/lib/supabase-client.ts`](../src/lib/supabase-client.ts)
- Client admin   : [`src/lib/supabase-admin.cjs`](../src/lib/supabase-admin.cjs) (CJS pour `server.cjs`)
- Wrappers auth  : [`src/lib/auth-client.ts`](../src/lib/auth-client.ts)
- Contexts       : [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx),
                   [`src/contexts/TenantContext.tsx`](../src/contexts/TenantContext.tsx)
- Garde de route : [`src/components/auth/RequireAuth.tsx`](../src/components/auth/RequireAuth.tsx)
- Page auth      : [`src/pages/Auth.tsx`](../src/pages/Auth.tsx)
- Endpoints proxy: [`server.cjs`](../server.cjs) §SAAS / MULTI-TENANT
- Telemetry      : [`docs/USAGE_LOGGING.md`](./USAGE_LOGGING.md)
