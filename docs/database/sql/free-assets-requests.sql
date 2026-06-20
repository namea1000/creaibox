-- =====================================================
-- CreAibox Free Asset Requests DB
-- =====================================================

create table if not exists public.free_asset_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    user_email varchar(255) not null,
    user_nickname varchar(100) not null,
    media_type varchar(50) not null,            -- 이미지, 일러스트, 벡터, 비디오, GIF, 음악, 음향 등
    description text not null,
    status varchar(50) default 'pending' not null, -- pending (대기중), completed (제작완료)
    comment text,                               -- 관리자 코멘트
    commenter_email varchar(255),               -- 코멘트 작성 관리자 이메일
    commented_at timestamptz,                   -- 코멘트 작성 시각
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- =====================================================
-- Indexes for Search & Filtering Optimization
-- =====================================================

create index if not exists idx_free_asset_requests_status on public.free_asset_requests(status);
create index if not exists idx_free_asset_requests_created_at on public.free_asset_requests(created_at desc);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

alter table public.free_asset_requests enable row level security;

-- 1. SELECT: 모든 사용자(비회원 포함)에게 읽기 허용
drop policy if exists "Allow public read access to free asset requests" on public.free_asset_requests;
create policy "Allow public read access to free asset requests"
on public.free_asset_requests
for select
using (true);

-- 2. INSERT: 로그인한 본인 계정으로만 등록 허용
drop policy if exists "Allow authenticated users to insert requests" on public.free_asset_requests;
create policy "Allow authenticated users to insert requests"
on public.free_asset_requests
for insert
to authenticated
with check (
    auth.uid() = user_id
);

-- 3. UPDATE: 어드민 또는 스태프 계정만 수정(코멘트 및 상태 변경) 허용
drop policy if exists "Allow admin/staff to update requests" on public.free_asset_requests;
create policy "Allow admin/staff to update requests"
on public.free_asset_requests
for update
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

-- 4. DELETE: 어드민 또는 스태프 계정만 삭제 허용
drop policy if exists "Allow admin/staff to delete requests" on public.free_asset_requests;
create policy "Allow admin/staff to delete requests"
on public.free_asset_requests
for delete
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
);
