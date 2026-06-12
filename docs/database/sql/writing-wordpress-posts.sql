-- =====================================================
-- CreAibox Writing WordPress Posts DB Final
-- =====================================================

create table if not exists writing_wordpress_posts (
id uuid default gen_random_uuid() primary key,

user_email text not null,

title text not null,
content text not null,

status text default 'draft',

wp_post_id integer,
wp_site_url text,

categories text[],
tags text[],

featured_image_url text,

created_at timestamptz default now(),
updated_at timestamptz default now()
);

-- =====================================================
-- RLS
-- =====================================================

alter table writing_wordpress_posts
enable row level security;

drop policy if exists
"Individual users can view their own wordpress posts"
on writing_wordpress_posts;

create policy
"Individual users can view their own wordpress posts"
on writing_wordpress_posts
for select
using (
auth.jwt() ->> 'email' = user_email
);

drop policy if exists
"Individual users can insert their own wordpress posts"
on writing_wordpress_posts;

create policy
"Individual users can insert their own wordpress posts"
on writing_wordpress_posts
for insert
with check (
auth.role() = 'authenticated'
and (auth.jwt() ->> 'email') = user_email
);

drop policy if exists
"Individual users can update their own wordpress posts"
on writing_wordpress_posts;

create policy
"Individual users can update their own wordpress posts"
on writing_wordpress_posts
for update
using (
auth.jwt() ->> 'email' = user_email
);

drop policy if exists
"Individual users can delete their own wordpress posts"
on writing_wordpress_posts;

create policy
"Individual users can delete their own wordpress posts"
on writing_wordpress_posts
for delete
using (
auth.jwt() ->> 'email' = user_email
);

-- =====================================================
-- updated_at Trigger
-- =====================================================

create or replace function update_writing_wordpress_posts_updated_at()
returns trigger as $$
begin
new.updated_at = now();
return new;
end;
$$ language plpgsql;

drop trigger if exists
update_writing_wordpress_posts_modtime
on writing_wordpress_posts;

create trigger update_writing_wordpress_posts_modtime
before update on writing_wordpress_posts
for each row
execute procedure update_writing_wordpress_posts_updated_at();

-- =====================================================
-- Indexes
-- =====================================================

create index if not exists idx_wp_posts_user_email
on writing_wordpress_posts(user_email);

create index if not exists idx_wp_posts_status
on writing_wordpress_posts(status);

create index if not exists idx_wp_posts_created_at
on writing_wordpress_posts(created_at desc);
