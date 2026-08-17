-- [CreaiBox Database DDL]
-- 연관 아키텍처: docs/arch/06_trend-and-marketing/youtube-trend-studio.md
-- 연관 실무 매뉴얼: docs/project/manual/06_trend-and-marketing/youtube-ai-trending-analysis-guide.md
-- 연관 DB 스키마: docs/database/youtube-trending-archive-schema.md
--
-- Table Definition for YouTube Trending Archive
CREATE TABLE IF NOT EXISTS public.youtube_trending_archive (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id varchar(10) NOT NULL,
    target_date date NOT NULL,
    videos_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_date_category UNIQUE (target_date, category_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.youtube_trending_archive ENABLE ROW LEVEL SECURITY;

-- Select Policy for Authenticated Users (Read-only for app users)
CREATE POLICY "Allow read for authenticated users" ON public.youtube_trending_archive
    FOR SELECT TO authenticated USING (true);
