-- =====================================================
-- CreAIbox AI Assistant / Multi Agent Hub DB Final
-- =====================================================

-- 1. 회원 등급별 AI Assistant 정책
create table if not exists ai_assistant_plan_limits (
  id uuid primary key default gen_random_uuid(),

  plan_key text not null unique, -- free, pro, business, admin
  plan_name text not null,

  max_chars_per_conversation int not null default 300000,
  max_conversations int not null default 20,
  max_folders int not null default 10,

  can_use_multi_agent boolean default false,
  can_use_context_actions boolean default false,
  can_use_file_context boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into ai_assistant_plan_limits (
  plan_key,
  plan_name,
  max_chars_per_conversation,
  max_conversations,
  max_folders,
  can_use_multi_agent,
  can_use_context_actions,
  can_use_file_context
)
values
  ('free', 'Free', 300000, 20, 10, false, false, false),
  ('pro', 'Pro', 500000, 100, 30, true, true, true),
  ('business', 'Business', 800000, 300, 100, true, true, true),
  ('admin', 'Admin', 1000000, 9999, 9999, true, true, true)
on conflict (plan_key) do nothing;


-- 2. 사용자별 AI Assistant 설정
create table if not exists ai_assistant_user_settings (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,
  plan_key text not null default 'free'
    references ai_assistant_plan_limits(plan_key),

  default_folder_id uuid,
  last_conversation_id uuid,

  preferred_model_provider text default 'gemini',
  preferred_model text default 'gemini-3-flash-preview',

  is_enabled boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id)
);


-- 3. AI Assistant 폴더
create table if not exists ai_assistant_folders (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  description text,
  color text default '#6366f1',
  icon text default 'folder',

  sort_order int default 0,

  is_pinned boolean default false,
  is_deleted boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, name)
);


-- 4. AI Assistant 채팅창
create table if not exists ai_assistant_conversations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references ai_assistant_folders(id) on delete set null,

  title text not null default '새 채팅',
  description text,

  studio_type text default 'general',
  page_path text,

  plan_key text default 'free',
  max_chars_limit int default 300000,

  total_chars int default 0,
  conversation_count int default 0,
  message_count int default 0,

  messages jsonb default '[]'::jsonb,

  agents_used text[] default '{}',
  context_summary text,
  search_text text,

  is_closed boolean default false,
  is_pinned boolean default false,
  is_archived boolean default false,
  is_deleted boolean default false,

  closed_reason text,
  closed_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- 5. AI Assistant 실행 액션 기록
-- 예: 제목 적용, 메타설명 적용, 가사 교체, 썸네일 프롬프트 적용
create table if not exists ai_assistant_actions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references ai_assistant_conversations(id) on delete cascade,

  action_type text not null,
  action_label text,

  target_table text,
  target_id uuid,

  payload jsonb default '{}'::jsonb,

  status text default 'pending'
    check (status in ('pending', 'applied', 'failed', 'cancelled')),

  error_message text,

  created_at timestamptz default now(),
  applied_at timestamptz
);


-- 6. 멀티 에이전트 실행 로그
create table if not exists ai_assistant_agent_runs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid references ai_assistant_conversations(id) on delete cascade,

  agent_key text not null, -- router, writing, seo, music, research, thumbnail
  agent_name text,

  input_summary text,
  output_summary text,

  model_provider text,
  model_name text,

  prompt_tokens int default 0,
  completion_tokens int default 0,
  total_tokens int default 0,

  status text default 'success'
    check (status in ('success', 'failed')),

  error_message text,

  created_at timestamptz default now()
);


-- 7. 검색 성능용 인덱스
create index if not exists idx_ai_assistant_folders_user_id
on ai_assistant_folders(user_id);

create index if not exists idx_ai_assistant_conversations_user_id
on ai_assistant_conversations(user_id);

create index if not exists idx_ai_assistant_conversations_folder_id
on ai_assistant_conversations(folder_id);

create index if not exists idx_ai_assistant_conversations_updated_at
on ai_assistant_conversations(updated_at desc);

create index if not exists idx_ai_assistant_conversations_is_deleted
on ai_assistant_conversations(is_deleted);

create index if not exists idx_ai_assistant_actions_conversation_id
on ai_assistant_actions(conversation_id);

create index if not exists idx_ai_assistant_agent_runs_conversation_id
on ai_assistant_agent_runs(conversation_id);


-- 8. RLS 활성화
alter table ai_assistant_plan_limits enable row level security;
alter table ai_assistant_user_settings enable row level security;
alter table ai_assistant_folders enable row level security;
alter table ai_assistant_conversations enable row level security;
alter table ai_assistant_actions enable row level security;
alter table ai_assistant_agent_runs enable row level security;


-- 9. RLS 정책
-- plan limits는 로그인 유저가 읽기만 가능
create policy "Users can read ai assistant plan limits"
on ai_assistant_plan_limits
for select
to authenticated
using (true);


-- user settings
create policy "Users can read own ai assistant settings"
on ai_assistant_user_settings
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own ai assistant settings"
on ai_assistant_user_settings
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own ai assistant settings"
on ai_assistant_user_settings
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- folders
create policy "Users can read own ai assistant folders"
on ai_assistant_folders
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own ai assistant folders"
on ai_assistant_folders
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own ai assistant folders"
on ai_assistant_folders
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own ai assistant folders"
on ai_assistant_folders
for delete
to authenticated
using (auth.uid() = user_id);


-- conversations
create policy "Users can read own ai assistant conversations"
on ai_assistant_conversations
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own ai assistant conversations"
on ai_assistant_conversations
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own ai assistant conversations"
on ai_assistant_conversations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own ai assistant conversations"
on ai_assistant_conversations
for delete
to authenticated
using (auth.uid() = user_id);


-- actions
create policy "Users can read own ai assistant actions"
on ai_assistant_actions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own ai assistant actions"
on ai_assistant_actions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own ai assistant actions"
on ai_assistant_actions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- agent runs
create policy "Users can read own ai assistant agent runs"
on ai_assistant_agent_runs
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own ai assistant agent runs"
on ai_assistant_agent_runs
for insert
to authenticated
with check (auth.uid() = user_id);


-- 10. updated_at 자동 갱신 함수
create or replace function update_ai_assistant_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- 11. updated_at 트리거
drop trigger if exists trg_ai_assistant_plan_limits_updated_at on ai_assistant_plan_limits;
create trigger trg_ai_assistant_plan_limits_updated_at
before update on ai_assistant_plan_limits
for each row execute function update_ai_assistant_updated_at();

drop trigger if exists trg_ai_assistant_user_settings_updated_at on ai_assistant_user_settings;
create trigger trg_ai_assistant_user_settings_updated_at
before update on ai_assistant_user_settings
for each row execute function update_ai_assistant_updated_at();

drop trigger if exists trg_ai_assistant_folders_updated_at on ai_assistant_folders;
create trigger trg_ai_assistant_folders_updated_at
before update on ai_assistant_folders
for each row execute function update_ai_assistant_updated_at();

drop trigger if exists trg_ai_assistant_conversations_updated_at on ai_assistant_conversations;
create trigger trg_ai_assistant_conversations_updated_at
before update on ai_assistant_conversations
for each row execute function update_ai_assistant_updated_at();