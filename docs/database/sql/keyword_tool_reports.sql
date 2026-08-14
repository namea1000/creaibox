-- CreaiBox 키워드 정밀 분석 리포트 (Option C: 1 키워드 = 1 Row 내 날짜별 시계열 히스토리 누적 보관)
CREATE TABLE IF NOT EXISTS public.keyword_tool_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL UNIQUE,
    total_search_volume BIGINT DEFAULT 0,
    rating_grade TEXT DEFAULT 'A',
    rating_status TEXT DEFAULT '쾌적',
    naver_json JSONB,
    google_json JSONB,
    result_json JSONB NOT NULL,
    history_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기존 컬럼 마이그레이션 (history_json, updated_at 내장)
ALTER TABLE public.keyword_tool_reports ADD COLUMN IF NOT EXISTS history_json JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.keyword_tool_reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.keyword_tool_reports DROP CONSTRAINT IF EXISTS keyword_provider_unique;
ALTER TABLE public.keyword_tool_reports DROP CONSTRAINT IF EXISTS keyword_unique;
ALTER TABLE public.keyword_tool_reports ADD CONSTRAINT keyword_unique UNIQUE (keyword);

-- 인덱스 및 RLS 권한 설정
CREATE INDEX IF NOT EXISTS idx_keyword_tool_reports_created_at ON public.keyword_tool_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_keyword_tool_reports_keyword ON public.keyword_tool_reports (keyword);

ALTER TABLE public.keyword_tool_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access for keyword_tool_reports" ON public.keyword_tool_reports;
DROP POLICY IF EXISTS "Allow service role full access for keyword_tool_reports" ON public.keyword_tool_reports;

CREATE POLICY "Allow public read access for keyword_tool_reports"
ON public.keyword_tool_reports FOR SELECT USING (true);

CREATE POLICY "Allow service role full access for keyword_tool_reports"
ON public.keyword_tool_reports FOR ALL USING (true);
