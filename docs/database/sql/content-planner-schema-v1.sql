-- =========================================================
-- CreAIbox AI Content Planner Schema v1
-- 콘텐츠 플래너 최종 DB + RLS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- 0. 기존 초기 설계 테이블 삭제
-- 주의: 기존 데이터가 있으면 모두 삭제됨
-- =========================================================

drop table if exists public.writing_content_plan_items cascade;
drop table if exists public.writing_content_plans cascade;
drop table if exists public.writing_keyword_research_snapshots cascade;

-- =========================================================
-- 1. 콘텐츠 캠페인 / 시리즈
-- =========================================================

create table if not exists public.content_planner_campaigns (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  user_nicename text,

  title text not null,
  description text,
  strategy_summary text,

  content_category text,
  campaign_type text,
  content_type text,

  goals text[] not null default '{}',
  primary_platform text,
  target_platforms text[] not null default '{}',

  target_audience text,
  brand_tone text,
  item_count integer not null default 10,

  main_keyword text,
  sub_keywords text[] not null default '{}',
  trend_keywords text[] not null default '{}',
  golden_keywords text[] not null default '{}',
  money_keywords text[] not null default '{}',
  competitor_keywords text[] not null default '{}',

  keyword_source text not null default 'mixed',
  trend_period text not null default '30d',
  trend_region text not null default 'KR',

  google_search_snapshot jsonb not null default '{}'::jsonb,
  google_trends_snapshot jsonb not null default '{}'::jsonb,
  naver_trends_snapshot jsonb not null default '{}'::jsonb,
  youtube_trends_snapshot jsonb not null default '{}'::jsonb,
  keyword_metrics jsonb not null default '{}'::jsonb,

  ai_provider text,
  ai_model text,
  prompt_snapshot text,
  raw_ai_response jsonb not null default '{}'::jsonb,

  status text not null default 'saved',
  generated_count integer not null default 0,
  is_favorite boolean not null default false,

  constraint content_planner_campaigns_item_count_check
    check (item_count in (5, 10, 20, 30, 50, 100)),

  constraint content_planner_campaigns_status_check
    check (status in ('draft', 'saved', 'generated', 'archived', 'trash')),

  constraint content_planner_campaigns_keyword_source_check
    check (keyword_source in (
      'manual',
      'google_search',
      'google_trends',
      'naver_trends',
      'youtube_trends',
      'internal',
      'mixed'
    )),

  constraint content_planner_campaigns_trend_period_check
    check (trend_period in ('7d', '30d', '90d', '12m')),

  constraint content_planner_campaigns_trend_region_check
    check (trend_region in ('KR', 'GLOBAL'))
);

comment on table public.content_planner_campaigns is
'AI 콘텐츠 플래너의 캠페인/시리즈 단위. 하나의 전략에서 블로그, 쇼츠, SNS 등 여러 플랫폼으로 확장한다.';

-- =========================================================
-- 2. 콘텐츠 아이템 / 개별 주제
-- =========================================================

create table if not exists public.content_planner_items (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  campaign_id uuid not null references public.content_planner_campaigns(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  item_order integer not null default 1,

  title text not null,
  slug text,

  content_type text,
  primary_platform text,
  target_platforms text[] not null default '{}',

  main_keyword text,
  sub_keywords text[] not null default '{}',
  related_keywords text[] not null default '{}',

  search_intent text,
  target_audience text,
  content_angle text,
  hook text,

  key_points text[] not null default '{}',
  outline jsonb not null default '[]'::jsonb,
  script_points jsonb not null default '[]'::jsonb,
  cta text,

  seo_title text,
  meta_description text,
  focus_keyword text,
  seo_tags text[] not null default '{}',

  trend_score integer not null default 0,
  seo_score integer not null default 0,
  monetization_score integer not null default 0,
  difficulty_score integer not null default 0,
  opportunity_score integer not null default 0,

  source_trend_data jsonb not null default '{}'::jsonb,
  source_search_data jsonb not null default '{}'::jsonb,
  source_naver_data jsonb not null default '{}'::jsonb,
  source_youtube_data jsonb not null default '{}'::jsonb,

  ai_provider text,
  ai_model text,
  prompt_snapshot text,
  raw_ai_response jsonb not null default '{}'::jsonb,

  status text not null default 'planned',

  constraint content_planner_items_status_check
    check (status in ('planned', 'generating', 'generated', 'failed', 'skipped', 'trash')),

  constraint content_planner_items_score_check
    check (
      trend_score between 0 and 100
      and seo_score between 0 and 100
      and monetization_score between 0 and 100
      and difficulty_score between 0 and 100
      and opportunity_score between 0 and 100
    )
);

comment on table public.content_planner_items is
'AI 콘텐츠 플래너에서 생성된 개별 콘텐츠 주제. 하나의 아이템은 여러 플랫폼 출력물로 확장될 수 있다.';

-- =========================================================
-- 3. 콘텐츠 출력물 / 플랫폼별 제작 연결
-- =========================================================

create table if not exists public.content_planner_outputs (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  campaign_id uuid not null references public.content_planner_campaigns(id) on delete cascade,
  item_id uuid not null references public.content_planner_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  output_type text not null,
  platform text not null,
  target_route text,

  title text,
  description text,

  generated_post_id uuid,
  generated_project_id uuid,
  external_url text,

  status text not null default 'planned',
  metadata jsonb not null default '{}'::jsonb,

  ai_provider text,
  ai_model text,
  prompt_snapshot text,
  raw_ai_response jsonb not null default '{}'::jsonb,

  constraint content_planner_outputs_type_check
    check (output_type in (
      'creaibox_blog',
      'naver_blog',
      'youtube_shorts',
      'youtube_longform',
      'tiktok',
      'naver_clip',
      'instagram_reels',
      'sns_post',
      'newsletter',
      'multi_platform'
    )),

  constraint content_planner_outputs_status_check
    check (status in ('planned', 'generating', 'generated', 'failed', 'trash'))
);

comment on table public.content_planner_outputs is
'콘텐츠 플래너 아이템에서 플랫폼별로 생성되는 실제 제작물 연결 테이블.';

-- =========================================================
-- 4. 키워드 / 트렌드 스냅샷
-- =========================================================

create table if not exists public.content_planner_keyword_snapshots (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),

  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.content_planner_campaigns(id) on delete set null,
  item_id uuid references public.content_planner_items(id) on delete set null,

  source text not null,
  keyword text not null,

  region text not null default 'KR',
  period text not null default '30d',

  search_volume integer,
  competition_level text,
  cpc numeric,

  trend_score integer not null default 0,
  monetization_score integer not null default 0,
  opportunity_score integer not null default 0,

  related_keywords text[] not null default '{}',
  rising_keywords text[] not null default '{}',

  raw_data jsonb not null default '{}'::jsonb,

  constraint content_planner_keyword_source_check
    check (source in (
      'manual',
      'google_search',
      'google_trends',
      'naver_search',
      'naver_trends',
      'youtube_trends',
      'internal',
      'mixed'
    )),

  constraint content_planner_keyword_region_check
    check (region in ('KR', 'GLOBAL')),

  constraint content_planner_keyword_period_check
    check (period in ('7d', '30d', '90d', '12m')),

  constraint content_planner_keyword_competition_check
    check (
      competition_level is null
      or competition_level in ('낮음', '보통', '높음')
    ),

  constraint content_planner_keyword_score_check
    check (
      trend_score between 0 and 100
      and monetization_score between 0 and 100
      and opportunity_score between 0 and 100
    )
);

comment on table public.content_planner_keyword_snapshots is
'Google Search, Google Trends, Naver Trends, YouTube Trends, 내부 추천 키워드 분석 결과 저장 테이블.';

-- =========================================================
-- 5. updated_at 자동 갱신 함수
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_content_planner_campaigns_updated_at
on public.content_planner_campaigns;

create trigger trg_content_planner_campaigns_updated_at
before update on public.content_planner_campaigns
for each row
execute function public.set_updated_at();

drop trigger if exists trg_content_planner_items_updated_at
on public.content_planner_items;

create trigger trg_content_planner_items_updated_at
before update on public.content_planner_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_content_planner_outputs_updated_at
on public.content_planner_outputs;

create trigger trg_content_planner_outputs_updated_at
before update on public.content_planner_outputs
for each row
execute function public.set_updated_at();

-- =========================================================
-- 6. 인덱스
-- =========================================================

create index if not exists idx_content_planner_campaigns_user_created
on public.content_planner_campaigns(user_id, created_at desc);

create index if not exists idx_content_planner_campaigns_status
on public.content_planner_campaigns(user_id, status);

create index if not exists idx_content_planner_campaigns_main_keyword
on public.content_planner_campaigns(main_keyword);

create index if not exists idx_content_planner_campaigns_primary_platform
on public.content_planner_campaigns(primary_platform);

create index if not exists idx_content_planner_items_campaign_order
on public.content_planner_items(campaign_id, item_order asc);

create index if not exists idx_content_planner_items_user_created
on public.content_planner_items(user_id, created_at desc);

create index if not exists idx_content_planner_items_status
on public.content_planner_items(user_id, status);

create index if not exists idx_content_planner_items_main_keyword
on public.content_planner_items(main_keyword);

create index if not exists idx_content_planner_outputs_campaign
on public.content_planner_outputs(campaign_id);

create index if not exists idx_content_planner_outputs_item
on public.content_planner_outputs(item_id);

create index if not exists idx_content_planner_outputs_user_status
on public.content_planner_outputs(user_id, status);

create index if not exists idx_content_planner_outputs_type
on public.content_planner_outputs(output_type);

create index if not exists idx_content_planner_keyword_user_created
on public.content_planner_keyword_snapshots(user_id, created_at desc);

create index if not exists idx_content_planner_keyword_campaign
on public.content_planner_keyword_snapshots(campaign_id);

create index if not exists idx_content_planner_keyword_keyword
on public.content_planner_keyword_snapshots(keyword);

create index if not exists idx_content_planner_keyword_source
on public.content_planner_keyword_snapshots(source);

-- =========================================================
-- 7. RLS 활성화
-- =========================================================

alter table public.content_planner_campaigns enable row level security;
alter table public.content_planner_items enable row level security;
alter table public.content_planner_outputs enable row level security;
alter table public.content_planner_keyword_snapshots enable row level security;

-- =========================================================
-- 8. 기존 정책 제거
-- =========================================================

drop policy if exists "Users can view own content planner campaigns"
on public.content_planner_campaigns;

drop policy if exists "Users can insert own content planner campaigns"
on public.content_planner_campaigns;

drop policy if exists "Users can update own content planner campaigns"
on public.content_planner_campaigns;

drop policy if exists "Users can delete own content planner campaigns"
on public.content_planner_campaigns;

drop policy if exists "Users can view own content planner items"
on public.content_planner_items;

drop policy if exists "Users can insert own content planner items"
on public.content_planner_items;

drop policy if exists "Users can update own content planner items"
on public.content_planner_items;

drop policy if exists "Users can delete own content planner items"
on public.content_planner_items;

drop policy if exists "Users can view own content planner outputs"
on public.content_planner_outputs;

drop policy if exists "Users can insert own content planner outputs"
on public.content_planner_outputs;

drop policy if exists "Users can update own content planner outputs"
on public.content_planner_outputs;

drop policy if exists "Users can delete own content planner outputs"
on public.content_planner_outputs;

drop policy if exists "Users can view own content planner keyword snapshots"
on public.content_planner_keyword_snapshots;

drop policy if exists "Users can insert own content planner keyword snapshots"
on public.content_planner_keyword_snapshots;

drop policy if exists "Users can update own content planner keyword snapshots"
on public.content_planner_keyword_snapshots;

drop policy if exists "Users can delete own content planner keyword snapshots"
on public.content_planner_keyword_snapshots;

-- =========================================================
-- 9. RLS 정책 생성
-- =========================================================

create policy "Users can view own content planner campaigns"
on public.content_planner_campaigns
for select
using (auth.uid() = user_id);

create policy "Users can insert own content planner campaigns"
on public.content_planner_campaigns
for insert
with check (auth.uid() = user_id);

create policy "Users can update own content planner campaigns"
on public.content_planner_campaigns
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own content planner campaigns"
on public.content_planner_campaigns
for delete
using (auth.uid() = user_id);

create policy "Users can view own content planner items"
on public.content_planner_items
for select
using (auth.uid() = user_id);

create policy "Users can insert own content planner items"
on public.content_planner_items
for insert
with check (auth.uid() = user_id);

create policy "Users can update own content planner items"
on public.content_planner_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own content planner items"
on public.content_planner_items
for delete
using (auth.uid() = user_id);

create policy "Users can view own content planner outputs"
on public.content_planner_outputs
for select
using (auth.uid() = user_id);

create policy "Users can insert own content planner outputs"
on public.content_planner_outputs
for insert
with check (auth.uid() = user_id);

create policy "Users can update own content planner outputs"
on public.content_planner_outputs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own content planner outputs"
on public.content_planner_outputs
for delete
using (auth.uid() = user_id);

create policy "Users can view own content planner keyword snapshots"
on public.content_planner_keyword_snapshots
for select
using (auth.uid() = user_id);

create policy "Users can insert own content planner keyword snapshots"
on public.content_planner_keyword_snapshots
for insert
with check (auth.uid() = user_id);

create policy "Users can update own content planner keyword snapshots"
on public.content_planner_keyword_snapshots
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own content planner keyword snapshots"
on public.content_planner_keyword_snapshots
for delete
using (auth.uid() = user_id);

-- =========================================================
-- 10. 권한 부여
-- =========================================================

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
on public.content_planner_campaigns
to authenticated;

grant select, insert, update, delete
on public.content_planner_items
to authenticated;

grant select, insert, update, delete
on public.content_planner_outputs
to authenticated;

grant select, insert, update, delete
on public.content_planner_keyword_snapshots
to authenticated;

-- =========================================================
-- End
-- =========================================================