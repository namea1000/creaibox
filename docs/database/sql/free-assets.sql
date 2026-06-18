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

-- 2. ALL: 어드민 또는 스태프에게 쓰기/수정/삭제 허용
-- admin_whitelist 테이블의 이메일 또는 profiles 테이블의 role이 ADMIN/STAFF인 경우 허용
drop policy if exists "Allow write access to admin or staff only" on public.free_assets;
create policy "Allow write access to admin or staff only"
on public.free_assets
for all
to authenticated
using (
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
