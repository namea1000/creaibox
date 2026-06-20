-- =====================================================
-- CreAibox Free Assets DB Final
-- =====================================================

create table if not exists public.free_assets (
    id uuid primary key default gen_random_uuid(),
    gdrive_file_id varchar(255) not null unique,
    storage_url text not null,
    file_name varchar(255) not null,
    mime_type varchar(100) not null,
    media_type varchar(50) not null,            -- image, music, video, document 등
    year_month varchar(6) not null,             -- YYYYMM (예: 202606)
    title varchar(255) not null,
    tags text[] default '{}',
    uploader varchar(255) default '익명',
    downloads_count integer default 0,
    views_count integer default 0,
    width integer default 0,
    height integer default 0,
    aspect_ratio varchar(50) default '',
    generation_type varchar(50) default 'real',
    camera varchar(255) default '촬영 정보 없음',
    prompt text default '',
    ai_tool varchar(100) default '',
    created_at timestamptz default now() not null
);

-- =====================================================
-- Indexes for Search Optimization
-- =====================================================

create index if not exists idx_free_assets_media_type on public.free_assets(media_type);
create index if not exists idx_free_assets_created_at on public.free_assets(created_at desc);
create index if not exists idx_free_assets_tags on public.free_assets using gin(tags);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

alter table public.free_assets enable row level security;

-- 1. SELECT: 모든 사용자(비회원 포함)에게 읽기 허용
drop policy if exists "Allow public read access to free assets" on public.free_assets;
create policy "Allow public read access to free assets"
on public.free_assets
for select
using (true);

-- 2. ALL: 어드민, 스태프 또는 업로더 본인에게 쓰기/수정/삭제 허용
drop policy if exists "Allow write access to admin or staff only" on public.free_assets;
drop policy if exists "Allow write access to authorized users" on public.free_assets;
create policy "Allow write access to authorized users"
on public.free_assets
for all
to authenticated
using (
  (uploader = auth.jwt() ->> 'email')
  or
  exists (
    select 1 from public.admin_whitelist
    where email = auth.jwt() ->> 'email'
  )
  or
  exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('ADMIN', 'STAFF')
  )
)
with check (
  (uploader = auth.jwt() ->> 'email')
  or
  exists (
    select 1 from public.admin_whitelist
    where email = auth.jwt() ->> 'email'
  )
  or
  exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('ADMIN', 'STAFF')
  )
);

-- =====================================================
-- Migration commands to update existing tables
-- =====================================================
-- ALTER TABLE public.free_assets ADD COLUMN IF NOT EXISTS prompt TEXT DEFAULT '';
-- ALTER TABLE public.free_assets ADD COLUMN IF NOT EXISTS ai_tool VARCHAR(100) DEFAULT '';
