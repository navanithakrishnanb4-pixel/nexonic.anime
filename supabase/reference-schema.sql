-- ============================================================================
-- REFERENCE SCHEMA — Steps 18I–18L (Journal, Episodes, Homepage, Announcements)
-- ============================================================================
--
-- DO NOT RUN THIS BLINDLY AGAINST YOUR PRODUCTION DATABASE.
--
-- The task brief for this step states the database schema for these tables
-- already exists. The coding assistant that wrote this pass had no network
-- access to your live Supabase project, so it could not run
-- `supabase db diff`, inspect the Table Editor, or query
-- information_schema to confirm the *actual* column names/types already
-- in place.
--
-- Instead, the TypeScript row types in src/lib/supabase/types.ts
-- (JournalPostRow, EpisodeRow, HomepageConfigRow, AnnouncementRow) were
-- hand-written to match this file, following the exact same pattern the
-- existing WorkRow already used for public.works. If your real schema
-- already has these tables/columns under different names, the code will
-- compile fine but fail at runtime (Postgres "column does not exist"
-- errors) — reconcile this file against your real schema FIRST:
--
--   1. Compare each CREATE TABLE below against your actual tables
--      (Table Editor, or `supabase db diff`).
--   2. If a table/column already exists with a different name, either
--      rename it to match, or update the corresponding *Row interface in
--      src/lib/supabase/types.ts (and nowhere else — that's the one seam
--      where column names are known) to match your real names instead.
--   3. Only run the `create table if not exists` / `alter table ... add
--      column if not exists` statements for whatever is GENUINELY missing.
--      Every statement below is guarded so re-running this file is safe,
--      but that doesn't mean every statement in it needs to run.
--
-- Per the brief's rules: no seed data, no sample rows. This file only
-- creates structure, never inserts rows.

-- ---------------------------------------------------------------------------
-- journal_posts
-- ---------------------------------------------------------------------------
create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_media_id uuid references public.media_assets(id) on delete set null,
  category text,
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.journal_posts enable row level security;

-- Public (anon) can read only published posts.
drop policy if exists "journal_posts_public_read" on public.journal_posts;
create policy "journal_posts_public_read"
  on public.journal_posts for select
  to anon
  using (status = 'published');

-- Admins can read/write everything. Mirrors whatever admin-detection
-- expression your public.works RLS policies already use — replace
-- is_admin() below with that same check if it differs.
drop policy if exists "journal_posts_admin_all" on public.journal_posts;
create policy "journal_posts_admin_all"
  on public.journal_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- episodes
-- ---------------------------------------------------------------------------
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  season_number integer not null default 1,
  episode_number integer not null default 1,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_media_id uuid references public.media_assets(id) on delete set null,
  video_url text,
  duration_seconds integer,
  release_date date,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  unique (work_id, season_number, episode_number)
);

alter table public.episodes enable row level security;

drop policy if exists "episodes_public_read" on public.episodes;
create policy "episodes_public_read"
  on public.episodes for select
  to anon
  using (status = 'published');

drop policy if exists "episodes_admin_all" on public.episodes;
create policy "episodes_admin_all"
  on public.episodes for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- homepage_config (singleton — expected to hold exactly zero or one row)
-- ---------------------------------------------------------------------------
create table if not exists public.homepage_config (
  id uuid primary key default gen_random_uuid(),
  hero_eyebrow text,
  hero_title text not null default '',
  hero_description text not null default '',
  hero_media_id uuid references public.media_assets(id) on delete set null,
  hero_image_position text default 'center',
  hero_cta_label text,
  hero_cta_href text,
  hero_secondary_cta_label text,
  hero_secondary_cta_href text,
  hero_visible boolean not null default true,
  featured_work_id uuid references public.works(id) on delete set null,
  featured_work_visible boolean not null default false,
  featured_journal_id uuid references public.journal_posts(id) on delete set null,
  featured_journal_visible boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.homepage_config enable row level security;

-- Public can read the (single) row.
drop policy if exists "homepage_config_public_read" on public.homepage_config;
create policy "homepage_config_public_read"
  on public.homepage_config for select
  to anon
  using (true);

drop policy if exists "homepage_config_admin_write" on public.homepage_config;
create policy "homepage_config_admin_write"
  on public.homepage_config for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- announcements
-- ---------------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_url text,
  link_label text,
  visible boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

-- Public read policy intentionally mirrors getActiveAnnouncements()'s
-- application-level filter (visible + within the start/end window) so
-- RLS and app logic agree even before a public banner component exists.
drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read"
  on public.announcements for select
  to anon
  using (
    visible = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists "announcements_admin_all" on public.announcements;
create policy "announcements_admin_all"
  on public.announcements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
