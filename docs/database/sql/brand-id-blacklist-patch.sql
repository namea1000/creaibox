-- =====================================================
-- Brand ID Blacklist / Reserved Words Database Patch
-- =====================================================

-- 1. reserved_brand_ids 테이블에 category 컬럼 추가 및 제약조건 설정
ALTER TABLE public.reserved_brand_ids 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'SYSTEM';

-- category 값 범위 체크 제약조건 추가
ALTER TABLE public.reserved_brand_ids DROP CONSTRAINT IF EXISTS reserved_brand_ids_category_check;
ALTER TABLE public.reserved_brand_ids ADD CONSTRAINT reserved_brand_ids_category_check 
  CHECK (category IN (
    'SYSTEM', 'GOVERNMENT', 'MEDIA', 'FINANCE', 'COMPANY', 'IT_SERVICE', 
    'INFLUENCER', 'EDUCATION', 'GEOGRAPHY', 'COMMON_SERVICE', 'ADULT_GAMBLING', 'ABUSE',
    'TRADEMARK', 'PAYMENT_SECURITY', 'CRYPTO', 'HEALTHCARE', 'RELIGION_POLITICS',
    'MILITARY_SECURITY', 'INFRASTRUCTURE', 'DOMAIN_BRAND', 'PUBLIC_SERVICE',
    'HIGH_RISK_COMMERCE'
  ));


-- 2. 브랜드 ID 검증용 트리거 함수 정의
CREATE OR REPLACE FUNCTION public.check_brand_id_reservation()
RETURNS TRIGGER AS $$
DECLARE
  v_reserved_exists BOOLEAN;
  v_static_reserved TEXT[] := ARRAY[
    'admin', 'administrator', 'api', 'app', 'auth', 'blog', 'brand', 'creaibox',
    'dashboard', 'dev', 'developer', 'docs', 'help', 'home', 'local', 'localhost',
    'login', 'logout', 'main', 'mypage', 'oauth', 'root', 'setting', 'settings',
    'signup', 'signin', 'stage', 'static', 'studio', 'support', 'test', 'www'
  ];
BEGIN
  -- 1) 정적 예약어 체크 (Static Reserved Words)
  IF NEW.requested_brand_id = ANY(v_static_reserved) THEN
    RAISE EXCEPTION 'This Brand ID is a reserved system keyword. (SYSTEM)';
  END IF;

  -- 2) 동적 블랙리스트 테이블 체크 (Dynamic Reserved Words)
  IF NEW.requested_brand_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.reserved_brand_ids 
      WHERE brand_id = NEW.requested_brand_id
    ) INTO v_reserved_exists;

    IF v_reserved_exists THEN
      RAISE EXCEPTION 'This Brand ID is blacklisted or reserved by system policies.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. profiles 테이블에 트리거 적용
DROP TRIGGER IF EXISTS trg_check_brand_id_reservation ON public.profiles;
CREATE TRIGGER trg_check_brand_id_reservation
BEFORE INSERT OR UPDATE OF requested_brand_id
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_brand_id_reservation();
