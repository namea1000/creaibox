-- =====================================================
-- CreAibox AI Generation Usage Logs Final
-- =====================================================

create table if not exists public.ai_generation_usage_logs (
id uuid default gen_random_uuid() primary key,

created_at timestamptz default now() not null,

user_id uuid
references auth.users(id)
on delete cascade,

user_email text,

provider_type text default 'ai',

provider text,

model text,

feature text,

status text default 'success',

usage_count int default 1,

error_message text,

raw_payload jsonb,

-- ===================================================
-- Studio Analytics
-- ===================================================

studio_type text,

feature_type text,

output_type text,

-- ===================================================
-- Generation Counts
-- ===================================================

image_count integer default 0,

song_count integer default 0,

video_count integer default 0,

-- ===================================================
-- Token Tracking
-- ===================================================

prompt_tokens integer default 0,

completion_tokens integer default 0,

total_tokens integer default 0,

-- ===================================================
-- Cost Tracking
-- ===================================================

estimated_cost numeric(12,6) default 0,

-- ===================================================
-- Billing
-- ===================================================

plan_key text default 'free',

key_source text default 'system',

-- ===================================================
-- Source Tracking
-- ===================================================

source_type text,

source_id uuid
);

alter table public.ai_generation_usage_logs
enable row level security;

create policy "users can read own usage logs"
on public.ai_generation_usage_logs
for select
using (
auth.uid() = user_id
);

create policy "users can insert own usage logs"
on public.ai_generation_usage_logs
for insert
with check (
auth.uid() = user_id
);

create index if not exists idx_ai_usage_user_created
on public.ai_generation_usage_logs(
user_id,
created_at desc
);

create index if not exists idx_ai_usage_provider_created
on public.ai_generation_usage_logs(
provider,
created_at desc
);

create index if not exists idx_ai_usage_studio_created
on public.ai_generation_usage_logs(
studio_type,
created_at desc
);

create index if not exists idx_ai_usage_feature_created
on public.ai_generation_usage_logs(
feature_type,
created_at desc
);

create index if not exists idx_ai_usage_source
on public.ai_generation_usage_logs(
source_type,
source_id
);

create index if not exists idx_ai_usage_plan_created
on public.ai_generation_usage_logs(
plan_key,
created_at desc
);
