-- ==============================================================================
-- Table: public.youtube_popular_archive
-- Description: 하루 딱 1개 Row로 60개국/카테고리/기간별 인기 영상 조회수 랭킹 통합 보관함 (Single Daily Bundle Row)
-- ==============================================================================

create table if not exists public.youtube_popular_archive (
  id uuid primary key default gen_random_uuid(),
  target_date date not null unique default CURRENT_DATE,
  videos_data jsonb not null default '{}'::jsonb, -- Key: 'KR_all_all_time', 'GLOBAL_10_7d' 등 맵 객체
  updated_at timestamp with time zone default now()
);

-- 기존 테이블이 존재하고 컬럼 구조를 단일 번들형으로 맞추는 마이그레이션 안전 구문
alter table public.youtube_popular_archive add column if not exists videos_data jsonb default '{}'::jsonb;

-- RLS 보안 정책 설정
alter table public.youtube_popular_archive enable row level security;

-- 누구나 조회 가능 (비로그인 자유 둘러보기 규칙)
drop policy if exists "Allow public read to youtube_popular_archive" on public.youtube_popular_archive;
create policy "Allow public read to youtube_popular_archive"
  on public.youtube_popular_archive for select
  using (true);

-- 백엔드 서비스 롤 쓰기 권한
drop policy if exists "Allow service role write to youtube_popular_archive" on public.youtube_popular_archive;
create policy "Allow service role write to youtube_popular_archive"
  on public.youtube_popular_archive for all
  using (true);
