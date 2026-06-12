-- ==================================================
-- CreAibox Video Studio Database Schema
-- 원본 영상/음악/이미지는 저장하지 않고,
-- 프로젝트 메타데이터와 편집 히스토리만 저장한다.
-- ==================================================

create table if not exists public.video_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null default 'Untitled Project',
  description text,

  thumbnail_url text,

  canvas_ratio text not null default '16:9',
  duration numeric not null default 0,

  project_json jsonb not null default '{}'::jsonb,

  storage_mode text not null default 'local_metadata_only',
  status text not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  asset_type text not null,
  asset_name text not null,

  local_file_key text,
  local_file_name text,
  local_file_size bigint,
  local_file_type text,
  local_last_modified bigint,

  source_kind text not null default 'local',
  source_label text,
  source_meta jsonb not null default '{}'::jsonb,

  duration numeric,
  width integer,
  height integer,

  is_missing boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_project_clips (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  asset_id uuid references public.video_project_assets(id) on delete set null,

  track_id text,
  clip_type text not null,
  name text,

  start_time numeric not null default 0,
  duration numeric not null default 0,

  trim_start numeric not null default 0,
  trim_end numeric not null default 0,

  volume numeric not null default 1,
  muted boolean not null default false,

  transition_in text not null default 'none',
  transition_out text not null default 'none',

  settings jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  version_no bigint not null,
  label text,
  project_json jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.video_project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.video_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  event_type text not null,
  event_message text,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.video_project_exports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.video_projects(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  export_resolution text not null default '1080p',
  export_fps integer not null default 30,
  export_quality text not null default 'standard',

  output_file_name text,
  output_local_key text,

  status text not null default 'completed',
  progress integer not null default 100,

  created_at timestamptz not null default now()
);

-- ==================================================
-- Index
-- ==================================================

create index if not exists video_projects_user_id_idx
on public.video_projects(user_id);

create index if not exists video_projects_updated_at_idx
on public.video_projects(updated_at desc);

create index if not exists video_project_assets_project_id_idx
on public.video_project_assets(project_id);

create index if not exists video_project_assets_user_id_idx
on public.video_project_assets(user_id);

create index if not exists video_project_clips_project_id_idx
on public.video_project_clips(project_id);

create index if not exists video_project_versions_project_id_idx
on public.video_project_versions(project_id);

create index if not exists video_project_events_project_id_idx
on public.video_project_events(project_id);

create index if not exists video_project_exports_user_id_idx
on public.video_project_exports(user_id);

-- ==================================================
-- updated_at trigger
-- ==================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_video_projects_updated_at on public.video_projects;
create trigger set_video_projects_updated_at
before update on public.video_projects
for each row
execute function public.set_updated_at();

drop trigger if exists set_video_project_assets_updated_at on public.video_project_assets;
create trigger set_video_project_assets_updated_at
before update on public.video_project_assets
for each row
execute function public.set_updated_at();

drop trigger if exists set_video_project_clips_updated_at on public.video_project_clips;
create trigger set_video_project_clips_updated_at
before update on public.video_project_clips
for each row
execute function public.set_updated_at();

-- ==================================================
-- RLS
-- ==================================================

alter table public.video_projects enable row level security;
alter table public.video_project_assets enable row level security;
alter table public.video_project_clips enable row level security;
alter table public.video_project_versions enable row level security;
alter table public.video_project_events enable row level security;
alter table public.video_project_exports enable row level security;

drop policy if exists "video_projects_all_own" on public.video_projects;
create policy "video_projects_all_own"
on public.video_projects
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "video_project_assets_all_own" on public.video_project_assets;
create policy "video_project_assets_all_own"
on public.video_project_assets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "video_project_clips_all_own" on public.video_project_clips;
create policy "video_project_clips_all_own"
on public.video_project_clips
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "video_project_versions_all_own" on public.video_project_versions;
create policy "video_project_versions_all_own"
on public.video_project_versions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "video_project_events_all_own" on public.video_project_events;
create policy "video_project_events_all_own"
on public.video_project_events
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "video_project_exports_all_own" on public.video_project_exports;
create policy "video_project_exports_all_own"
on public.video_project_exports
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);