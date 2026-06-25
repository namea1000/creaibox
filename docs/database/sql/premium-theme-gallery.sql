-- =========================================================================
-- MIGRATION: 15대 카테고리 홈페이지 제작용 프리미엄 테마 갤러리 개설 및 다운로드 통제
-- DESCRIPTION: free_assets 테이블에 공식 테마 전용 식별 및 비즈니스 등급 제한 컬럼 추가
-- DATE: 2026-06-24
-- =========================================================================

-- 1. 무료 공유 에셋 테이블에 프리미엄 테마 전용 필드 추가
ALTER TABLE free_assets ADD COLUMN IF NOT EXISTS is_official_theme_asset BOOLEAN DEFAULT FALSE;
ALTER TABLE free_assets ADD COLUMN IF NOT EXISTS theme_category VARCHAR(50) DEFAULT NULL;
ALTER TABLE free_assets ADD COLUMN IF NOT EXISTS is_business_only BOOLEAN DEFAULT FALSE;

-- 2. 스토어 및 검색 성능 최적화를 위한 복합 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_free_assets_theme_filter 
ON free_assets(is_official_theme_asset, theme_category, is_business_only);

-- 3. RLS(Row Level Security) 정책 검증
-- Supabase에서 기본적으로 SELECT 정책이 ALL_USERS로 열려있으므로, 모든 회원이 이미지 카드는 조회할 수 있습니다.
-- 실제 다운로드 제어는 API 및 클라이언트 단에서 membership_level을 기반으로 격리 검증하므로, 
-- DB 커넥션 병목이나 RLS 오류 없이 신속하고 유연한 비즈니스 권한 제어가 가능합니다.
