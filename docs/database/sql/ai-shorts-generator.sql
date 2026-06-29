-- =====================================================
-- CreAibox AI Shorts Generator DB Schema
-- =====================================================

create table if not exists public.ai_shorts_projects (
  id uuid primary key default gen_random_uuid(),
  
  user_id uuid references auth.users(id) on delete cascade,
  
  title text not null,
  description text,
  script text,
  category text not null,
  keyword text,
  bg_music text,
  
  -- JSON array storing details of each generated video segment
  segments jsonb not null,
  
  -- Public Supabase Storage URL to the rendered video file
  video_url text,
  
  created_at timestamptz default now()
);

-- =====================================================
-- Indexes
-- =====================================================

create index if not exists ai_shorts_projects_user_idx
on public.ai_shorts_projects (
  user_id,
  created_at desc
);

-- =====================================================
-- RLS (Row Level Security) Policies
-- =====================================================

alter table public.ai_shorts_projects enable row level security;

create policy "Users can view their own AI shorts projects"
  on public.ai_shorts_projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own AI shorts projects"
  on public.ai_shorts_projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own AI shorts projects"
  on public.ai_shorts_projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own AI shorts projects"
  on public.ai_shorts_projects for delete
  using (auth.uid() = user_id);
