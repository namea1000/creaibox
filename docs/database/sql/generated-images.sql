-- =====================================================
-- CreAibox Generated Images DB Final
-- =====================================================

-- =====================================================
-- Image Library
-- =====================================================

create table if not exists public.generated_images (
id uuid primary key default gen_random_uuid(),

user_id uuid references auth.users(id) on delete cascade,

prompt text not null,

image_url text not null,

style text,

aspect_ratio text,

provider text,

source_type text,
source_id text,

image_role text default 'generated',

is_primary boolean default false,

title text,
caption text,
description text,
alt_text text,

created_at timestamptz default now()
);

-- =====================================================
-- Indexes
-- =====================================================

create index if not exists generated_images_source_idx
on public.generated_images (
user_id,
source_type,
source_id,
image_role,
is_primary,
created_at desc
);

create unique index if not exists generated_images_one_primary_per_source_idx
on public.generated_images (
user_id,
source_type,
source_id,
image_role
)
where is_primary = true;

create index if not exists generated_images_user_id_idx
on public.generated_images(user_id);

create index if not exists generated_images_created_at_idx
on public.generated_images(created_at desc);

-- =====================================================
-- RLS
-- =====================================================

alter table public.generated_images
enable row level security;

create policy "Users can read own generated images"
on public.generated_images
for select
using (
auth.uid() = user_id
);

create policy "Anyone can read generated images"
on public.generated_images
for select
using (
true
);

create policy "Users can insert own generated images"
on public.generated_images
for insert
with check (
auth.uid() = user_id
);

create policy "Users can update own generated images"
on public.generated_images
for update
using (
auth.uid() = user_id
)
with check (
auth.uid() = user_id
);

create policy "Users can delete own generated images"
on public.generated_images
for delete
using (
auth.uid() = user_id
);

-- =====================================================
-- Storage Bucket Policies
-- =====================================================

create policy "Users can upload own generated images"
on storage.objects
for insert
to authenticated
with check (
bucket_id = 'generated-images'
and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view own generated images"
on storage.objects
for select
to authenticated
using (
bucket_id = 'generated-images'
and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Anyone can view generated images"
on storage.objects
for select
using (
bucket_id = 'generated-images'
);
