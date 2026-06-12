-- =====================================================
-- CreAibox Workspace Notes System DB Final
-- =====================================================

-- =====================================================
-- Global Widget State
-- =====================================================

create table if not exists public.studio_widgets (
id uuid primary key default gen_random_uuid(),

user_id uuid not null references auth.users(id) on delete cascade,

widget_type text not null default 'cre_note',

title text default 'Cre Note',

content text default '',

metadata jsonb default '{}'::jsonb,

position jsonb default '{"side":"right","width":420}'::jsonb,

is_pinned boolean default true,
is_open boolean default false,

created_at timestamptz default now(),
updated_at timestamptz default now()
);

-- =====================================================
-- Note Folders
-- =====================================================

create table if not exists public.cre_note_folders (
id uuid primary key default gen_random_uuid(),

user_id uuid not null references auth.users(id) on delete cascade,

name text not null default '기본',

color text default '#10b981',
icon text default 'folder',

sort_order integer default 0,

is_archived boolean default false,

created_at timestamptz default now(),
updated_at timestamptz default now()
);

-- =====================================================
-- Notes
-- =====================================================

create table if not exists public.cre_notes (
id uuid primary key default gen_random_uuid(),

user_id uuid not null references auth.users(id) on delete cascade,

folder_id uuid references public.cre_note_folders(id)
on delete set null,

title text not null default '제목 없음',

content text default '',
excerpt text default '',

note_type text default 'text',

source_app text default 'studio',

is_favorite boolean default false,
is_pinned boolean default false,

is_archived boolean default false,
is_deleted boolean default false,

sort_order integer default 0,

metadata jsonb default '{}'::jsonb,

created_at timestamptz default now(),
updated_at timestamptz default now()
);

-- =====================================================
-- Tags
-- =====================================================

create table if not exists public.cre_note_tags (
id uuid primary key default gen_random_uuid(),

user_id uuid not null references auth.users(id) on delete cascade,

name text not null,

color text default '#64748b',

created_at timestamptz default now()
);

-- =====================================================
-- Note Tag Links
-- =====================================================

create table if not exists public.cre_note_tag_links (
id uuid primary key default gen_random_uuid(),

user_id uuid not null references auth.users(id) on delete cascade,

note_id uuid not null
references public.cre_notes(id)
on delete cascade,

tag_id uuid not null
references public.cre_note_tags(id)
on delete cascade,

created_at timestamptz default now(),

unique(note_id, tag_id)
);

-- =====================================================
-- Indexes
-- =====================================================

create index if not exists studio_widgets_user_id_idx
on public.studio_widgets(user_id);

create index if not exists studio_widgets_type_idx
on public.studio_widgets(widget_type);

create index if not exists cre_note_folders_user_id_idx
on public.cre_note_folders(user_id);

create index if not exists cre_notes_user_id_idx
on public.cre_notes(user_id);

create index if not exists cre_notes_folder_id_idx
on public.cre_notes(folder_id);

create index if not exists cre_notes_updated_at_idx
on public.cre_notes(updated_at desc);

create index if not exists cre_notes_favorite_idx
on public.cre_notes(user_id, is_favorite);

create index if not exists cre_notes_deleted_idx
on public.cre_notes(user_id, is_deleted);

create index if not exists cre_note_tags_user_id_idx
on public.cre_note_tags(user_id);

create index if not exists cre_note_tag_links_note_id_idx
on public.cre_note_tag_links(note_id);

create index if not exists cre_note_tag_links_tag_id_idx
on public.cre_note_tag_links(tag_id);

-- =====================================================
-- RLS
-- =====================================================

alter table public.studio_widgets enable row level security;
alter table public.cre_note_folders enable row level security;
alter table public.cre_notes enable row level security;
alter table public.cre_note_tags enable row level security;
alter table public.cre_note_tag_links enable row level security;

create policy "Users can manage own studio widgets"
on public.studio_widgets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own note folders"
on public.cre_note_folders
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own notes"
on public.cre_notes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own note tags"
on public.cre_note_tags
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own note tag links"
on public.cre_note_tag_links
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
