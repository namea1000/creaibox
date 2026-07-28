-- 🚀 CreAibox 실시간 급상승 키워드 날짜별 1줄(Row) 통합 아카이빙 테이블 DDL
-- Supabase SQL Editor에서 실행하시면 날짜별 1줄 구조로 테이블이 생성됩니다.

DROP TABLE IF EXISTS public.keyword_trending_history;

CREATE TABLE public.keyword_trending_history (
    target_date date PRIMARY KEY,
    hourly_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS (Row Level Security) 읽기/쓰기 권한 부여
ALTER TABLE public.keyword_trending_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for keyword_trending_history" 
ON public.keyword_trending_history FOR SELECT USING (true);

CREATE POLICY "Allow service_role full access for keyword_trending_history" 
ON public.keyword_trending_history FOR ALL USING (true);
