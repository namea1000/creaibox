-- ==============================================================================
-- [CreaiBox] 원페이지 스크롤 모드 옵션 추가 (client_sites 테이블)
-- ==============================================================================
-- 기존 사이트를 원페이지(모든 서브페이지 섹션 랜딩 페이지 출력)로 볼 수 있게 하는 플래그
ALTER TABLE client_sites
ADD COLUMN is_onepage_scroll BOOLEAN DEFAULT false;

COMMENT ON COLUMN client_sites.is_onepage_scroll IS '메인 랜딩페이지에 서브페이지 전체 전개 여부 (One-page scroll 모드)';
