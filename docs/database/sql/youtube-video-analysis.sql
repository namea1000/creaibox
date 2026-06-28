-- Table Definition for YouTube Video AI Analysis Caching
CREATE TABLE IF NOT EXISTS public.youtube_video_analysis (
    video_id varchar(50) PRIMARY KEY,
    analysis_content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.youtube_video_analysis ENABLE ROW LEVEL SECURITY;

-- Read Access Policy for Authenticated Users
CREATE POLICY "Allow read for authenticated users" ON public.youtube_video_analysis
    FOR SELECT TO authenticated USING (true);
