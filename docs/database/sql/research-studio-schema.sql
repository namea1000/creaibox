-- ==================================================
-- CreAIbox Research Studio Schema
-- ==================================================
-- Purpose:
-- Research Studio is designed as a NotebookLM-style document analysis
-- and content generation workspace for CreAIbox.
--
-- Core flow:
-- Project -> Source -> Extraction -> Chat / Generated Content / Images
--
-- Storage bucket to create manually in Supabase Storage:
--   research-assets
-- Recommended bucket settings:
--   Public bucket: OFF
--   File size limit: 50MB
--   Allowed MIME types:
--     application/pdf
--     application/vnd.openxmlformats-officedocument.wordprocessingml.document
--     application/vnd.openxmlformats-officedocument.presentationml.presentation
--     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
--     text/csv
--     text/plain
--     image/jpeg
--     image/png
--     image/webp
-- ==================================================

-- Required extension for UUID generation.
create extension if not exists pgcrypto;

-- Optional extension for future vector search / RAG.
-- Enable this only if your Supabase project supports pgvector.
-- create extension if not exists vector;

-- ==================================================
-- 1. Research Projects
-- Project-level container, similar to NotebookLM Notebook.
-- ==================================================
create table if not exists public.research_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_nicename text,

  title text,
  description text,
  status text default 'active',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists research_projects_user_id_idx
  on public.research_projects(user_id);

create index if not exists research_projects_created_at_idx
  on public.research_projects(created_at desc);

-- ==================================================
-- 2. Research Sources
-- Original uploaded or linked source: PDF, DOCX, PPTX, URL, YouTube, text, image, etc.
-- Column names are aligned with the current Research Studio create/page.tsx.
-- ==================================================
create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),

  project_id uuid references public.research_projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,

  source_type text,
  title text,

  original_url text,

  file_url text,
  file_name text,
  file_size bigint,
  mime_type text,

  status text default 'pending',

  created_at timestamptz default now()
);

create index if not exists research_sources_project_id_idx
  on public.research_sources(project_id);

create index if not exists research_sources_user_id_idx
  on public.research_sources(user_id);

create index if not exists research_sources_source_type_idx
  on public.research_sources(source_type);

create index if not exists research_sources_created_at_idx
  on public.research_sources(created_at desc);

-- ==================================================
-- 3. Research Extractions
-- Extracted text, summary, metadata, and image URL list from a source.
-- ==================================================
create table if not exists public.research_extractions (
  id uuid primary key default gen_random_uuid(),

  source_id uuid references public.research_sources(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,

  extracted_title text,
  extracted_text text,
  summary text,

  meta jsonb default '{}'::jsonb,
  images jsonb default '[]'::jsonb,

  char_count integer default 0,
  word_count integer default 0,
  language text,

  created_at timestamptz default now()
);

create index if not exists research_extractions_source_id_idx
  on public.research_extractions(source_id);

create index if not exists research_extractions_user_id_idx
  on public.research_extractions(user_id);

create index if not exists research_extractions_created_at_idx
  on public.research_extractions(created_at desc);

-- ==================================================
-- 4. Research Images
-- Dedicated table for extracted and optimized images.
-- Images are expected to be stored in Supabase Storage as WebP.
-- Recommended path:
--   research-assets/{user_id}/{project_id}/{source_id}/images/001-og-image-{hash}.webp
-- ==================================================
create table if not exists public.research_images (
  id uuid primary key default gen_random_uuid(),

  project_id uuid references public.research_projects(id) on delete cascade,
  source_id uuid references public.research_sources(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,

  image_type text,
  original_url text,
  storage_path text,

  width integer,
  height integer,
  file_size bigint,

  created_at timestamptz default now()
);

create index if not exists research_images_project_id_idx
  on public.research_images(project_id);

create index if not exists research_images_source_id_idx
  on public.research_images(source_id);

create index if not exists research_images_user_id_idx
  on public.research_images(user_id);

create index if not exists research_images_created_at_idx
  on public.research_images(created_at desc);

-- ==================================================
-- 5. Research Chats
-- Project-level AI chat rooms.
-- ==================================================
create table if not exists public.research_chats (
  id uuid primary key default gen_random_uuid(),

  project_id uuid references public.research_projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,

  title text,

  created_at timestamptz default now()
);

create index if not exists research_chats_project_id_idx
  on public.research_chats(project_id);

create index if not exists research_chats_user_id_idx
  on public.research_chats(user_id);

create index if not exists research_chats_created_at_idx
  on public.research_chats(created_at desc);

-- ==================================================
-- 6. Research Chat Messages
-- Chat history for Research Studio.
-- ==================================================
create table if not exists public.research_chat_messages (
  id uuid primary key default gen_random_uuid(),

  chat_id uuid references public.research_chats(id) on delete cascade,

  role text,
  content text,
  source_refs jsonb default '[]'::jsonb,

  created_at timestamptz default now()
);

create index if not exists research_chat_messages_chat_id_idx
  on public.research_chat_messages(chat_id);

create index if not exists research_chat_messages_created_at_idx
  on public.research_chat_messages(created_at asc);

-- ==================================================
-- 7. Research Generated Contents
-- AI-generated outputs: blog post, SEO article, YouTube script, newsletter, prompt, etc.
-- ==================================================
create table if not exists public.research_generated_contents (
  id uuid primary key default gen_random_uuid(),

  project_id uuid references public.research_projects(id) on delete cascade,
  source_id uuid references public.research_sources(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,

  content_type text,
  title text,
  content text,
  meta jsonb default '{}'::jsonb,

  created_at timestamptz default now()
);

create index if not exists research_generated_contents_project_id_idx
  on public.research_generated_contents(project_id);

create index if not exists research_generated_contents_source_id_idx
  on public.research_generated_contents(source_id);

create index if not exists research_generated_contents_user_id_idx
  on public.research_generated_contents(user_id);

create index if not exists research_generated_contents_created_at_idx
  on public.research_generated_contents(created_at desc);

-- ==================================================
-- 8. Research Chunks
-- Future RAG table.
-- This version avoids vector dependency so it can run immediately.
-- Add embedding/vector column later after enabling pgvector.
-- ==================================================
create table if not exists public.research_chunks (
  id uuid primary key default gen_random_uuid(),

  project_id uuid references public.research_projects(id) on delete cascade,
  source_id uuid references public.research_sources(id) on delete cascade,
  extraction_id uuid references public.research_extractions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,

  chunk_index integer,
  content text,
  token_count integer,
  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now()
);

create index if not exists research_chunks_project_id_idx
  on public.research_chunks(project_id);

create index if not exists research_chunks_source_id_idx
  on public.research_chunks(source_id);

create index if not exists research_chunks_extraction_id_idx
  on public.research_chunks(extraction_id);

create index if not exists research_chunks_user_id_idx
  on public.research_chunks(user_id);

-- ==================================================
-- Updated_at trigger for research_projects
-- ==================================================
create or replace function public.set_research_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_research_projects_updated_at on public.research_projects;

create trigger set_research_projects_updated_at
before update on public.research_projects
for each row
execute function public.set_research_updated_at();

-- ==================================================
-- RLS Enable
-- ==================================================
alter table public.research_projects enable row level security;
alter table public.research_sources enable row level security;
alter table public.research_extractions enable row level security;
alter table public.research_images enable row level security;
alter table public.research_chats enable row level security;
alter table public.research_chat_messages enable row level security;
alter table public.research_generated_contents enable row level security;
alter table public.research_chunks enable row level security;

-- ==================================================
-- RLS Policies
-- Notes:
-- 1. Drop existing policies first so this file can be re-run safely.
-- 2. research_chat_messages is protected through its parent chat.
-- ==================================================

-- research_projects
drop policy if exists "research_projects_select_own" on public.research_projects;
drop policy if exists "research_projects_insert_own" on public.research_projects;
drop policy if exists "research_projects_update_own" on public.research_projects;
drop policy if exists "research_projects_delete_own" on public.research_projects;

create policy "research_projects_select_own"
on public.research_projects for select
to authenticated
using (auth.uid() = user_id);

create policy "research_projects_insert_own"
on public.research_projects for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_projects_update_own"
on public.research_projects for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_projects_delete_own"
on public.research_projects for delete
to authenticated
using (auth.uid() = user_id);

-- research_sources
drop policy if exists "research_sources_select_own" on public.research_sources;
drop policy if exists "research_sources_insert_own" on public.research_sources;
drop policy if exists "research_sources_update_own" on public.research_sources;
drop policy if exists "research_sources_delete_own" on public.research_sources;

create policy "research_sources_select_own"
on public.research_sources for select
to authenticated
using (auth.uid() = user_id);

create policy "research_sources_insert_own"
on public.research_sources for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_sources_update_own"
on public.research_sources for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_sources_delete_own"
on public.research_sources for delete
to authenticated
using (auth.uid() = user_id);

-- research_extractions
drop policy if exists "research_extractions_select_own" on public.research_extractions;
drop policy if exists "research_extractions_insert_own" on public.research_extractions;
drop policy if exists "research_extractions_update_own" on public.research_extractions;
drop policy if exists "research_extractions_delete_own" on public.research_extractions;

create policy "research_extractions_select_own"
on public.research_extractions for select
to authenticated
using (auth.uid() = user_id);

create policy "research_extractions_insert_own"
on public.research_extractions for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_extractions_update_own"
on public.research_extractions for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_extractions_delete_own"
on public.research_extractions for delete
to authenticated
using (auth.uid() = user_id);

-- research_images
drop policy if exists "research_images_select_own" on public.research_images;
drop policy if exists "research_images_insert_own" on public.research_images;
drop policy if exists "research_images_update_own" on public.research_images;
drop policy if exists "research_images_delete_own" on public.research_images;

create policy "research_images_select_own"
on public.research_images for select
to authenticated
using (auth.uid() = user_id);

create policy "research_images_insert_own"
on public.research_images for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_images_update_own"
on public.research_images for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_images_delete_own"
on public.research_images for delete
to authenticated
using (auth.uid() = user_id);

-- research_chats
drop policy if exists "research_chats_select_own" on public.research_chats;
drop policy if exists "research_chats_insert_own" on public.research_chats;
drop policy if exists "research_chats_update_own" on public.research_chats;
drop policy if exists "research_chats_delete_own" on public.research_chats;

create policy "research_chats_select_own"
on public.research_chats for select
to authenticated
using (auth.uid() = user_id);

create policy "research_chats_insert_own"
on public.research_chats for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_chats_update_own"
on public.research_chats for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_chats_delete_own"
on public.research_chats for delete
to authenticated
using (auth.uid() = user_id);

-- research_chat_messages
drop policy if exists "research_chat_messages_select_own" on public.research_chat_messages;
drop policy if exists "research_chat_messages_insert_own" on public.research_chat_messages;
drop policy if exists "research_chat_messages_update_own" on public.research_chat_messages;
drop policy if exists "research_chat_messages_delete_own" on public.research_chat_messages;

create policy "research_chat_messages_select_own"
on public.research_chat_messages for select
to authenticated
using (
  exists (
    select 1 from public.research_chats c
    where c.id = research_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

create policy "research_chat_messages_insert_own"
on public.research_chat_messages for insert
to authenticated
with check (
  exists (
    select 1 from public.research_chats c
    where c.id = research_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

create policy "research_chat_messages_update_own"
on public.research_chat_messages for update
to authenticated
using (
  exists (
    select 1 from public.research_chats c
    where c.id = research_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.research_chats c
    where c.id = research_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

create policy "research_chat_messages_delete_own"
on public.research_chat_messages for delete
to authenticated
using (
  exists (
    select 1 from public.research_chats c
    where c.id = research_chat_messages.chat_id
      and c.user_id = auth.uid()
  )
);

-- research_generated_contents
drop policy if exists "research_generated_contents_select_own" on public.research_generated_contents;
drop policy if exists "research_generated_contents_insert_own" on public.research_generated_contents;
drop policy if exists "research_generated_contents_update_own" on public.research_generated_contents;
drop policy if exists "research_generated_contents_delete_own" on public.research_generated_contents;

create policy "research_generated_contents_select_own"
on public.research_generated_contents for select
to authenticated
using (auth.uid() = user_id);

create policy "research_generated_contents_insert_own"
on public.research_generated_contents for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_generated_contents_update_own"
on public.research_generated_contents for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_generated_contents_delete_own"
on public.research_generated_contents for delete
to authenticated
using (auth.uid() = user_id);

-- research_chunks
drop policy if exists "research_chunks_select_own" on public.research_chunks;
drop policy if exists "research_chunks_insert_own" on public.research_chunks;
drop policy if exists "research_chunks_update_own" on public.research_chunks;
drop policy if exists "research_chunks_delete_own" on public.research_chunks;

create policy "research_chunks_select_own"
on public.research_chunks for select
to authenticated
using (auth.uid() = user_id);

create policy "research_chunks_insert_own"
on public.research_chunks for insert
to authenticated
with check (auth.uid() = user_id);

create policy "research_chunks_update_own"
on public.research_chunks for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "research_chunks_delete_own"
on public.research_chunks for delete
to authenticated
using (auth.uid() = user_id);

-- ==================================================
-- Storage policy notes
-- ==================================================
-- Create the bucket manually in Supabase Dashboard:
--   Bucket name: research-assets
--   Public: OFF
--
-- Recommended path convention:
--   {user_id}/{project_id}/{source_id}/original/{timestamp}-{filename}
--   {user_id}/{project_id}/{source_id}/images/001-og-image-{hash}.webp
--
-- Storage policies can be created from Supabase Dashboard.
-- A typical rule is to allow authenticated users to manage files only under
-- a path starting with their own auth.uid().
-- ==================================================
