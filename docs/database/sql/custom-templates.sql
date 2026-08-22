-- ==============================================================================
-- CreaiBox 커스텀 템플릿 보관함 & 마켓플레이스 등록 (custom_templates) 테이블 DDL
-- ==============================================================================

-- 1. Create custom_templates Table
CREATE TABLE IF NOT EXISTS public.custom_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    template_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT DEFAULT '나만의 템플릿',
    description TEXT,
    thumbnail_url TEXT,
    source_brand_id TEXT,
    source_url TEXT,
    header_html TEXT,
    footer_html TEXT,
    sections_snapshot JSONB DEFAULT '[]'::jsonb,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Indexes for Fast Lookup
CREATE INDEX IF NOT EXISTS idx_custom_templates_user_id ON public.custom_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_templates_key ON public.custom_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_custom_templates_created_at ON public.custom_templates(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.custom_templates ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- A. Select: Users can view public templates or their own templates
CREATE POLICY "Users can view public or own custom templates"
    ON public.custom_templates
    FOR SELECT
    USING (is_public = true OR auth.uid() = user_id);

-- B. Insert: Users can insert own custom templates
CREATE POLICY "Users can insert own custom templates"
    ON public.custom_templates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- C. Update: Users can update own custom templates
CREATE POLICY "Users can update own custom templates"
    ON public.custom_templates
    FOR UPDATE
    USING (auth.uid() = user_id);

-- D. Delete: Users can delete own custom templates
CREATE POLICY "Users can delete own custom templates"
    ON public.custom_templates
    FOR DELETE
    USING (auth.uid() = user_id);

-- E. Service Role full access
CREATE POLICY "Service role full access to custom_templates"
    ON public.custom_templates
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');
