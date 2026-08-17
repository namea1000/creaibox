-- [CreaiBox 아키텍처 방법 B: 무한 캐시 + 온디맨드 Webhook 연동 셋업]
-- 이 쿼리를 Supabase 관리자 화면의 'SQL Editor'에 복사해서 실행(RUN)하세요.
--
-- 설명: writing_creaibox_posts 테이블에서 글이 작성/수정/삭제되어 
-- 발행 상태(published)에 변화가 생길 때마다 자동으로 Vercel Next.js의 
-- /api/revalidate-blog API를 찔러서 무한 캐시를 날려버립니다.

-- 1. HTTP 통신을 위한 pg_net 확장 모듈 활성화 (이미 활성화되어 있다면 무시됨)
create extension if not exists pg_net;

-- 2. Webhook을 쏴줄 데이터베이스 함수(Function) 생성
create or replace function public.webhook_revalidate_blog()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Vercel 라이브 도메인의 revalidate-blog API 호출 (POST)
  -- 만약 로컬 테스트 중이라면 'https://creaibox.com/api/revalidate-blog' 부분을 변경 필요.
  perform net.http_post(
    url := 'https://creaibox.com/api/revalidate-blog',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'brandId', coalesce(NEW.brand_id, OLD.brand_id),
      'slug', coalesce(NEW.slug, OLD.slug)
    )::jsonb
  );
  
  -- 데이터베이스 작업은 그대로 진행되도록 리턴
  return NEW;
end;
$$;

-- 3. 글이 저장(수정)될 때마다 위 함수를 발동시킬 센서(Trigger) 부착
-- 💡 기존에 같은 이름의 트리거가 있다면 삭제하고 다시 만듭니다.
drop trigger if exists on_post_status_change on public.writing_creaibox_posts;

create trigger on_post_status_change
after insert or update or delete
on public.writing_creaibox_posts
for each row
execute function public.webhook_revalidate_blog();

-- 완료! 이제 글이 수정될 때마다 자동으로 Vercel 캐시가 폭파됩니다.
