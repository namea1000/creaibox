-- [CreaiBox 아키텍처 방법 B: 무한 캐시 + 온디맨드 Webhook 연동 셋업 (수정 완결본)]
-- 연관 아키텍처 명세서: docs/arch/01_core-and-infra/on-demand-revalidation-webhook-architecture.md
-- 연관 실무 매뉴얼: docs/project/manual/on-demand-revalidation-webhook-manual.md
--
-- 설명: writing_creaibox_posts 테이블에는 brand_id 컬럼 대신 user_id가 존재하므로,
-- profiles 테이블에서 user_id에 매핑된 brand_id를 안전하게 조회하여 Vercel /api/revalidate-blog를 호출합니다.

-- 1. HTTP 통신을 위한 pg_net 확장 모듈 활성화
create extension if not exists pg_net;

-- 2. Webhook을 쏴줄 데이터베이스 함수(Function) 생성
create or replace function public.webhook_revalidate_blog()
returns trigger
language plpgsql
security definer
as $$
declare
  v_brand_id text;
  v_slug text;
  v_user_id uuid;
begin
  -- 1. DELETE / INSERT / UPDATE 케이스별 안전한 slug 및 user_id 추출
  if TG_OP = 'DELETE' then
    v_slug := OLD.slug;
    v_user_id := OLD.user_id;
  else
    v_slug := NEW.slug;
    v_user_id := NEW.user_id;
  end if;

  -- 2. profiles 테이블에서 user_id에 매핑된 brand_id 조회
  if v_user_id is not null then
    select brand_id into v_brand_id
    from public.profiles
    where id = v_user_id;
  end if;

  -- 3. Vercel 라이브 도메인의 revalidate-blog API 호출 (POST)
  begin
    perform net.http_post(
      url := 'https://creaibox.com/api/revalidate-blog',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := json_build_object(
        'brandId', v_brand_id,
        'slug', v_slug
      )::jsonb
    );
  exception
    when others then
      -- pg_net 실패하더라도 원고 저장은 100% 정상 완료되도록 보호
      null;
  end;
  
  -- 데이터베이스 작업 정상 리턴
  if TG_OP = 'DELETE' then
    return OLD;
  else
    return NEW;
  end if;
end;
$$;

-- 3. 글이 저장(수정/삭제)될 때마다 위 함수를 발동시킬 센서(Trigger) 부착
drop trigger if exists on_post_status_change on public.writing_creaibox_posts;

create trigger on_post_status_change
after insert or update or delete
on public.writing_creaibox_posts
for each row
execute function public.webhook_revalidate_blog();
