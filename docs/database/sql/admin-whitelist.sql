-- =====================================================
-- CreAibox Admin Whitelist DB Final
-- =====================================================

create table if not exists public.admin_whitelist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- 초기 슈퍼 어드민 이메일 등록
insert into public.admin_whitelist (email)
values 
  ('creaiboxofficial@gmail.com'),
  ('jenam7720@gmail.com'),
  ('namjjang7720@gmail.com'),
  ('admin@creaibox.com')
on conflict (email) do nothing;

-- RLS 활성화 (보안을 위해 일반 유저 접근 금지)
alter table public.admin_whitelist enable row level security;

-- 1. SELECT: 로그인한 사용자 본인의 이메일이 화이트리스트에 있는지 조회하는 것은 허용
drop policy if exists "Allow users to read their own whitelist status" on public.admin_whitelist;
create policy "Allow users to read their own whitelist status"
on public.admin_whitelist
for select
to authenticated
using (email = auth.jwt() ->> 'email');
