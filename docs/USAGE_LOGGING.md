# Telemetry / usage logging — Kora Digital Pilot

Wave 3 — Agent 6 (SaaSisation light).

---

## 1. Objectif

Émettre un signal léger, structuré et tenant-scoped à chaque action
utilisateur significative, pour permettre :

- l'**activation tracking** (combien d'utilisateurs vont jusqu'au premier
  rapport ? au premier export PDF ?) ;
- la **facturation à l'usage** future (compter les rapports générés par
  organisation) ;
- l'**audit** des actions sensibles (connexion LinkedIn, exports).

Les contraintes : pas de PII en clair, pas de bloquant en front, fonctionne
en démo (no-op) comme en prod (persistance).

---

## 2. Table cible

```sql
create table public.usage_events (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid     references auth.users(id) on delete set null,
  event_name  text not null,
  properties  jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index idx_usage_events_org_created
  on public.usage_events (org_id, created_at desc);
```

RLS : SELECT/INSERT autorisés ssi l'utilisateur est membre de `org_id`.
Voir [`docs/AUTH_MULTI_TENANT.md`](./AUTH_MULTI_TENANT.md) §3.

---

## 3. Chaîne d'émission

```
React component ─► logUsage(eventName, props)        src/lib/usage-logger.ts
                       │
                       │ POST /api/usage  (Bearer <jwt>, credentials:include)
                       ▼
                  server.cjs requireUser
                       │  (résout user + org via Supabase admin)
                       ▼
                  insert into usage_events (org_id, user_id, event_name, properties)
```

### Côté client — `src/lib/usage-logger.ts`

- API publique : `logUsage(event_name, properties?)` — fire-and-forget,
  retourne `Promise<void>`, n'échoue jamais.
- En démo (Supabase non configuré côté front) : log console + skip.
- Sinon : attache le JWT Supabase courant en `Authorization: Bearer ...`.

### Côté serveur — `server.cjs`

- `POST /api/usage`
  - rate-limit : 240 req/min/IP ;
  - validation : `event_name` non vide ; `properties` tronqué à 4 KB ;
  - mode démo : 202 sans persistance ;
  - mode Supabase : insert via service-role, scope `org_id` du `requireUser`.

---

## 4. Events instrumentés (Wave 3)

Définis canoniquement dans `USAGE_EVENTS` de
[`src/lib/usage-logger.ts`](../src/lib/usage-logger.ts) :

| Event name | Émis depuis | Properties typiques |
| --- | --- | --- |
| `auth.login.success` | `src/components/auth/SignIn.tsx` | `{ email_domain }` |
| `auth.signup.success` | `src/components/auth/SignUp.tsx` | `{ email_domain }` |
| `auth.logout` | _réservé_ — branchement futur via header user menu | — |
| `linkedin.connect.success` | `src/components/LinkedInCallback.tsx` | `{ hasProfile }` |
| `report.generated` | `src/components/BrandMonitoring.tsx` (Perplexity) | `{ source, brandName }` |
| `export.pdf` | `src/components/BrandMonitoring.tsx` | `{ brandName, fileSize }` |

Free-form events restent possibles via `logUsage('my.event', { ... })`,
mais utilisez la constante quand elle existe.

---

## 5. Requêtes utiles

### Funnel d'activation (signup → premier rapport → premier export)
```sql
with by_org as (
  select org_id,
         min(created_at) filter (where event_name = 'auth.signup.success') as signup_at,
         min(created_at) filter (where event_name = 'report.generated')   as first_report_at,
         min(created_at) filter (where event_name = 'export.pdf')         as first_export_at
  from public.usage_events
  group by org_id
)
select count(*)                                         as orgs,
       count(first_report_at)                           as orgs_with_report,
       count(first_export_at)                           as orgs_with_export,
       round(100.0 * count(first_report_at) / count(*), 1) as pct_report,
       round(100.0 * count(first_export_at) / count(*), 1) as pct_export
from by_org;
```

### Top organisations par volume (30 derniers jours)
```sql
select o.name, o.slug, count(*) as events_30d
from public.usage_events e
join public.organizations o on o.id = e.org_id
where e.created_at >= now() - interval '30 days'
group by o.name, o.slug
order by events_30d desc
limit 20;
```

### Tendance hebdomadaire des exports
```sql
select date_trunc('week', created_at) as week,
       count(*)                       as exports
from public.usage_events
where event_name = 'export.pdf'
group by 1
order by 1;
```

---

## 6. Limites assumées (Wave 3)

- Pas de batching côté client (un POST par event). À optimiser si volume
  > 10 events/s par session.
- Pas de schéma stricte sur `properties` (JSONB libre). Acceptable pour un
  pilote ; à formaliser via un dictionnaire d'événements quand le produit
  stabilisera.
- Pas de déduplication (un double-clic = deux rows). Acceptable pour de la
  télémétrie ; problème pour de la facturation directe.
- Pas d'export vers un outil tiers (Mixpanel, Posthog). La requête SQL est
  la primitive principale ; un export S3/CSV viendra plus tard si besoin.
