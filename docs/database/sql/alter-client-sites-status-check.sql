-- =========================================================================
-- client_sites status CHECK 제약조건 확장 (DRAFT, PUBLISHED 지원)
-- =========================================================================

-- 1. 기존 status 제약조건 제거 후 DRAFT, PUBLISHED 포함하여 재설정
ALTER TABLE public.client_sites DROP CONSTRAINT IF EXISTS client_sites_status_check;

ALTER TABLE public.client_sites 
ADD CONSTRAINT client_sites_status_check 
CHECK (status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'INACTIVE'));
