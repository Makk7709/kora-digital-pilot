# Supabase — Kora Digital Pilot

This folder holds the SQL artefacts that turn Kora into a multi-tenant SaaS.
It is consumed by the [Supabase CLI](https://supabase.com/docs/guides/cli)
and/or applied directly via `psql` to a remote project.

```
supabase/
├── README.md              # you are here
├── migrations/
│   └── 0001_init.sql      # organizations, org_members, usage_events, RLS, trigger
└── seed.sql               # optional, no-op by default
```

## Apply against a remote project

1. Create a project at <https://supabase.com> (free tier is fine for a pilot).
2. Copy the project URL and the service role + anon keys into your `.env`
   (see `env.example`, section "Supabase").
3. Apply the migration through the SQL editor, or with the CLI:

   ```bash
   supabase link --project-ref <your-ref>
   supabase db push
   ```

## Apply against local Postgres (without Supabase)

The migration file is self-contained PostgreSQL (one extension: `pgcrypto`).
You can run it directly:

```bash
psql "$DATABASE_URL" -f supabase/migrations/0001_init.sql
```

The `auth.users` references will fail outside of a real Supabase project; in
that case Kora falls back to its in-memory demo session (see
`src/contexts/AuthContext.tsx`). No code path crashes.

## What the migration delivers

- `organizations` — tenant root
- `org_members` — auth.users ↔ organization with a role (owner / admin / member)
- `usage_events` — append-only telemetry, indexed by `(org_id, created_at desc)`
- `linkedin_sessions` — scaffold (not wired to `server.cjs` yet)
- RLS policies on every business table
- A `kora_handle_new_user()` trigger that auto-creates a personal org and an
  `owner` membership the first time a Supabase Auth user is provisioned.

See [`docs/AUTH_MULTI_TENANT.md`](../docs/AUTH_MULTI_TENANT.md) for the full
walkthrough.
