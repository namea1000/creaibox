-- Table Definition for YouTube Video AI Analysis Caching
CREATE TABLE IF NOT EXISTS public.youtube_video_analysis (
    video_id varchar(50) PRIMARY KEY,
    analysis_content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    video_metadata jsonb NULL, -- 비디오 메타데이터 (제목, 채널명, 조회수, 썸네일 등 통째 적재용)
    report_type varchar(50) DEFAULT 'trending' NOT NULL -- 리포트 구분 ('trending' | 'channel')
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.youtube_video_analysis ENABLE ROW LEVEL SECURITY;

-- Read Access Policy for Authenticated Users
CREATE POLICY "Allow read for authenticated users" ON public.youtube_video_analysis
    FOR SELECT TO authenticated USING (true);

-- DDL Migration Schema Update Script (Supabase SQL Editor 실행용)
-- =========================================================================
-- ALTER TABLE public.youtube_video_analysis ADD COLUMN IF NOT EXISTS video_metadata jsonb;
-- ALTER TABLE public.youtube_video_analysis ADD COLUMN IF NOT EXISTS report_type varchar(50) DEFAULT 'trending' NOT NULL;
