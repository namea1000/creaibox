-- ==============================================================================
-- CreAibox Custom Domain Email Forwarding Rules Table Schema
-- Table Name: public.email_forwarding_rules
-- Description: 사용자 및 고객사 도메인별 메일 별칭(alias_prefix)과 전달받을 담당자 메일(forward_to) 매핑 테이블
-- ==============================================================================

create table if not exists public.email_forwarding_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  domain_name text not null,
  alias_prefix text not null,
  forward_to text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint unique_domain_alias unique (domain_name, alias_prefix)
);

-- RLS (Row Level Security) 설정
alter table public.email_forwarding_rules enable row level security;

-- 본인 소유의 규칙만 조회 및 CRUD 가능하도록 RLS 정책 부여
create policy "Users can view own email forwarding rules"
  on public.email_forwarding_rules for select
  using (auth.uid() = user_id);

create policy "Users can insert own email forwarding rules"
  on public.email_forwarding_rules for insert
  with check (auth.uid() = user_id);

create policy "Users can update own email forwarding rules"
  on public.email_forwarding_rules for update
  using (auth.uid() = user_id);

create policy "Users can delete own email forwarding rules"
  on public.email_forwarding_rules for delete
  using (auth.uid() = user_id);

-- 인덱스 생성
create index if not exists idx_email_forwarding_rules_user_id on public.email_forwarding_rules(user_id);
create index if not exists idx_email_forwarding_rules_lookup on public.email_forwarding_rules(domain_name, alias_prefix);
