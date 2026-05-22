-- =============================================================================
-- Kora Digital Pilot — Multi-tenant init schema
-- =============================================================================
-- Wave 3 — Agent 6 (SaaSisation light).
--
-- This migration introduces the minimal multi-tenant primitives required to
-- ship Kora as a commercialisable SaaS:
--   - organizations           : tenant root entity
--   - org_members             : link auth.users <-> organizations with a role
--   - usage_events            : append-only telemetry per org
--   - linkedin_sessions       : scaffold table (NOT wired in server.cjs yet)
--
-- Plus the canonical bootstrap trigger that auto-creates a personal org and an
-- "owner" membership the first time a Supabase Auth user is created.
--
-- RLS is enabled on every business table; policies enforce that a user can
-- only see / write rows belonging to organizations they are a member of.
-- =============================================================================

-- Required for gen_random_uuid().
create extension if not exists "pgcrypto";

-- =============================================================================
-- 1. organizations
-- =============================================================================

create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  plan        text not null default 'free',
  created_at  timestamptz not null default now()
);

comment on table  public.organizations is 'Tenant root. Every business row in Kora is scoped to an organization.';
comment on column public.organizations.plan is 'Billing plan stub. Values: free | pro | enterprise (no billing wired yet).';

-- =============================================================================
-- 2. org_members
-- =============================================================================

create table if not exists public.org_members (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at  timestamptz not null default now(),
  unique (org_id, user_id)
);

create index if not exists idx_org_members_user on public.org_members (user_id);
create index if not exists idx_org_members_org  on public.org_members (org_id);

comment on table public.org_members is 'Membership of a Supabase user inside an organization, with a role.';

-- =============================================================================
-- 3. usage_events
-- =============================================================================

create table if not exists public.usage_events (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid     references auth.users(id) on delete set null,
  event_name  text not null,
  properties  jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists idx_usage_events_org_created
  on public.usage_events (org_id, created_at desc);

create index if not exists idx_usage_events_event
  on public.usage_events (event_name);

comment on table public.usage_events is
  'Append-only telemetry stream. One row per user-facing event, scoped to an organization.';

-- =============================================================================
-- 4. linkedin_sessions (scaffold, NOT integrated in server.cjs yet)
-- =============================================================================
--
-- Today server.cjs keeps LinkedIn sessions in a process-local Map (see
-- docs/SECURITY.md §3). This table is prepared so a later iteration can move
-- them to Postgres without another migration.

create table if not exists public.linkedin_sessions (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.organizations(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  encrypted_tokens  text not null,
  expires_at        timestamptz not null,
  created_at        timestamptz not null default now()
);

create index if not exists idx_linkedin_sessions_user on public.linkedin_sessions (user_id);
create index if not exists idx_linkedin_sessions_org  on public.linkedin_sessions (org_id);

comment on table public.linkedin_sessions is
  'Scaffold for moving the in-memory LinkedIn session Map to Postgres. NOT wired yet.';

-- =============================================================================
-- 5. RLS — enable + policies
-- =============================================================================

alter table public.organizations    enable row level security;
alter table public.org_members      enable row level security;
alter table public.usage_events     enable row level security;
alter table public.linkedin_sessions enable row level security;

-- Helper: a user is a member of an org iff a row exists in org_members.
-- We inline the EXISTS subquery in each policy to keep policies independent
-- and to avoid SECURITY DEFINER helpers.

-- ---------- organizations ----------

drop policy if exists "orgs_select_if_member" on public.organizations;
create policy "orgs_select_if_member"
  on public.organizations
  for select
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = organizations.id
        and m.user_id = auth.uid()
    )
  );

-- Authenticated users can create an org (the bootstrap trigger does it once,
-- but an admin UI may later create additional orgs).
drop policy if exists "orgs_insert_authenticated" on public.organizations;
create policy "orgs_insert_authenticated"
  on public.organizations
  for insert
  with check (auth.uid() is not null);

-- Updates / deletes restricted to org owners.
drop policy if exists "orgs_update_owner" on public.organizations;
create policy "orgs_update_owner"
  on public.organizations
  for update
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = organizations.id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "orgs_delete_owner" on public.organizations;
create policy "orgs_delete_owner"
  on public.organizations
  for delete
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = organizations.id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- ---------- org_members ----------

-- A user can see their own membership rows, and any membership belonging to
-- an org they are themselves a member of.
drop policy if exists "members_select_self_or_org" on public.org_members;
create policy "members_select_self_or_org"
  on public.org_members
  for select
  using (
    org_members.user_id = auth.uid()
    or exists (
      select 1 from public.org_members m2
      where m2.org_id = org_members.org_id
        and m2.user_id = auth.uid()
    )
  );

-- Only owners can add / change / remove memberships. The bootstrap trigger
-- runs as SECURITY DEFINER so it bypasses RLS for the initial owner row.
drop policy if exists "members_insert_owner" on public.org_members;
create policy "members_insert_owner"
  on public.org_members
  for insert
  with check (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_members.org_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "members_update_owner" on public.org_members;
create policy "members_update_owner"
  on public.org_members
  for update
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_members.org_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

drop policy if exists "members_delete_owner" on public.org_members;
create policy "members_delete_owner"
  on public.org_members
  for delete
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = org_members.org_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- ---------- usage_events ----------

drop policy if exists "usage_select_if_member" on public.usage_events;
create policy "usage_select_if_member"
  on public.usage_events
  for select
  using (
    exists (
      select 1 from public.org_members m
      where m.org_id = usage_events.org_id
        and m.user_id = auth.uid()
    )
  );

drop policy if exists "usage_insert_if_member" on public.usage_events;
create policy "usage_insert_if_member"
  on public.usage_events
  for insert
  with check (
    exists (
      select 1 from public.org_members m
      where m.org_id = usage_events.org_id
        and m.user_id = auth.uid()
    )
  );

-- ---------- linkedin_sessions ----------

drop policy if exists "linkedin_sessions_self" on public.linkedin_sessions;
create policy "linkedin_sessions_self"
  on public.linkedin_sessions
  for all
  using (linkedin_sessions.user_id = auth.uid())
  with check (linkedin_sessions.user_id = auth.uid());

-- =============================================================================
-- 6. Slug generator + bootstrap trigger
-- =============================================================================

-- Deterministic, lowercased, ASCII-safe slug derived from an email or a name.
-- A short random suffix is appended to avoid collisions across signups that
-- share a local-part (e.g. multiple gmail accounts).
create or replace function public.kora_generate_slug(input_text text)
returns text
language plpgsql
immutable
as $$
declare
  base_slug text;
  suffix    text;
begin
  if input_text is null or length(trim(input_text)) = 0 then
    base_slug := 'org';
  else
    base_slug := lower(split_part(input_text, '@', 1));
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := regexp_replace(base_slug, '(^-+|-+$)', '', 'g');
    if length(base_slug) = 0 then
      base_slug := 'org';
    end if;
    if length(base_slug) > 32 then
      base_slug := substring(base_slug from 1 for 32);
    end if;
  end if;
  suffix := substr(encode(gen_random_bytes(3), 'hex'), 1, 6);
  return base_slug || '-' || suffix;
end;
$$;

-- Bootstrap: on every new auth.users row, create a personal organization
-- (named after the email) plus an 'owner' membership.
--
-- SECURITY DEFINER is required because the trigger runs in the auth schema
-- where the new user has not yet acquired any RLS rights on public tables.
create or replace function public.kora_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  display_name text;
begin
  display_name := coalesce(new.email, 'New organization');

  insert into public.organizations (name, slug, plan)
  values (display_name, public.kora_generate_slug(new.email), 'free')
  returning id into new_org_id;

  insert into public.org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

drop trigger if exists kora_on_auth_user_created on auth.users;
create trigger kora_on_auth_user_created
  after insert on auth.users
  for each row execute function public.kora_handle_new_user();

-- =============================================================================
-- End of 0001_init.sql
-- =============================================================================
