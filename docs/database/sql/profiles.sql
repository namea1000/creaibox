-- =====================================================
-- CreAibox Profiles DB Final
-- =====================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  email text,

  nickname text unique,
  brand_id text unique,

  avatar_url text,

  role text default 'FREE',
  status text default 'ACTIVE',

  membership_level text default 'free',
  total_points int default 0,

  blog_title text,
  blog_description text,

  naver_blog_id text,
  tistory_blog_id text,
  youtube_channel_id text,
  insta_user_id text,

  api_openai_key text,
  api_gemini_key text,
  api_claude_key text,
  api_stability_key text,
  api_suno_key text,
  api_runway_key text,

  wp_blog_url text,
  wp_user_id text,
  wp_app_password text,

  work_stats jsonb default '{"writing":0,"visual":0,"music":0,"video":0}'::jsonb,
  extra_configs jsonb default '{}'::jsonb,
  admin_memo text,

  last_login_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint brand_id_format
    check (brand_id is null or brand_id ~ '^[a-z0-9]{2,15}$'),

  constraint nickname_format
    check (nickname is null or nickname ~ '^[가-힣a-zA-Z0-9]{2,10}$')
);

-- =====================================================
-- Updated At Trigger
-- =====================================================

create or replace function public.update_profiles_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_profiles_updated_at();

-- =====================================================
-- New User Profile Generator
-- =====================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_name text;
  final_nickname text;
  final_brand_id text;
  done boolean;
begin

  base_name :=
    lower(
      regexp_replace(
        split_part(new.email, '@', 1),
        '[^a-z0-9]',
        '',
        'g'
      )
    );

  if length(base_name) < 2 then
    base_name := base_name || 'id';
  end if;

  done := false;

  while not done loop

    final_brand_id :=
      substring(base_name, 1, 11)
      || floor(random() * 9000 + 1000)::text;

    final_nickname :=
      substring(
        regexp_replace(
          split_part(new.email, '@', 1),
          '[^가-힣a-zA-Z0-9]',
          '',
          'g'
        ),
        1,
        6
      )
      || floor(random() * 9000 + 1000)::text;

    if not exists (
      select 1
      from public.profiles
      where brand_id = final_brand_id
         or nickname = final_nickname
    ) then
      done := true;
    end if;

  end loop;

  insert into public.profiles (
    id,
    email,
    nickname,
    brand_id,
    avatar_url,
    membership_level,
    role,
    status,
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    final_nickname,
    final_brand_id,
    new.raw_user_meta_data->>'avatar_url',
    'free',
    'FREE',
    'ACTIVE',
    now(),
    now()
  );

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =====================================================
-- Existing User Migration
-- =====================================================

do $$
declare
  r record;
  base_name text;
  final_nickname text;
  final_brand_id text;
begin

  for r in (
    select id, email
    from auth.users
  )
  loop

    base_name :=
      lower(
        regexp_replace(
          split_part(r.email, '@', 1),
          '[^a-z0-9]',
          '',
          'g'
        )
      );

    if length(base_name) < 2 then
      base_name := base_name || 'id';
    end if;

    final_nickname :=
      substring(split_part(r.email, '@', 1), 1, 6)
      || floor(random() * 9000 + 1000)::text;

    final_brand_id :=
      substring(base_name, 1, 11)
      || floor(random() * 9000 + 1000)::text;

    insert into public.profiles (
      id,
      email,
      nickname,
      brand_id,
      membership_level,
      role,
      status,
      updated_at
    )
    values (
      r.id,
      r.email,
      final_nickname,
      final_brand_id,
      'free',
      'FREE',
      'ACTIVE',
      now()
    )
    on conflict (id)
    do update
    set
      nickname =
        coalesce(public.profiles.nickname, excluded.nickname),
      brand_id =
        coalesce(public.profiles.brand_id, excluded.brand_id),
      email =
        coalesce(public.profiles.email, excluded.email),
      updated_at = now();

  end loop;

end $$;

-- =====================================================
-- RLS
-- =====================================================

alter table public.profiles enable row level security;

drop policy if exists "Allow individual read access"
on public.profiles;

create policy "Allow individual read access"
on public.profiles
for select
to authenticated
using (auth.role() = 'authenticated');