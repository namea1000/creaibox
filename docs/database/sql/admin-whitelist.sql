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
