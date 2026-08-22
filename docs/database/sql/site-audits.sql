-- ==============================================================================
-- CreaiBox AI 웹사이트 정밀 진단 보고서 (site_audits) 테이블 DDL
-- ==============================================================================

-- 1. Create site_audits Table
CREATE TABLE IF NOT EXISTS public.site_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_url TEXT NOT NULL,
    normalized_domain TEXT NOT NULL,
    title TEXT,
    description TEXT,
    detected_engine TEXT DEFAULT 'Custom / Unknown',
    is_frameset BOOLEAN DEFAULT FALSE,
    frame_src TEXT,
    has_ssl BOOLEAN DEFAULT TRUE,
    seo_score INTEGER DEFAULT 50,
    performance_score INTEGER DEFAULT 50,
    security_score INTEGER DEFAULT 50,
    overall_grade TEXT DEFAULT 'B',
    issues JSONB DEFAULT '[]'::jsonb,
    improvements JSONB DEFAULT '[]'::jsonb,
    comparison_table JSONB DEFAULT '[]'::jsonb,
    scan_report_snapshot JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_site_audits_user_id ON public.site_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_site_audits_normalized_domain ON public.site_audits(normalized_domain);
CREATE INDEX IF NOT EXISTS idx_site_audits_created_at ON public.site_audits(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.site_audits ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- A. Select: Users can view their own audit reports
CREATE POLICY "Users can view own site audit reports"
    ON public.site_audits
    FOR SELECT
    USING (auth.uid() = user_id);

-- B. Insert: Users can create audit reports
CREATE POLICY "Users can insert own site audit reports"
    ON public.site_audits
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- C. Delete: Users can delete own audit reports
CREATE POLICY "Users can delete own site audit reports"
    ON public.site_audits
    FOR DELETE
    USING (auth.uid() = user_id);

-- D. Service Role full access
CREATE POLICY "Service role full access to site_audits"
    ON public.site_audits
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
