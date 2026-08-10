-- ========================================================================================
-- Table: client_site_requests
-- Description: 기업 커스텀 웹사이트 1:1 제작 요청서 (관리자 관제탑 용)
-- ========================================================================================

CREATE TABLE IF NOT EXISTS public.client_site_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_nickname text NOT NULL,
  company_name text NOT NULL,
  category text NOT NULL,
  theme_color text,
  features jsonb DEFAULT '[]'::jsonb,
  ref_url text,
  detail text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- RLS (Row Level Security) 설정
ALTER TABLE public.client_site_requests ENABLE ROW LEVEL SECURITY;

-- 정책 1: 사용자는 자신이 작성한 요청서만 조회 가능
CREATE POLICY "Users can view their own requests"
  ON public.client_site_requests FOR SELECT
  USING (auth.uid() = user_id);

-- 정책 2: 사용자는 새로운 요청서를 등록 가능
CREATE POLICY "Users can insert their own requests"
  ON public.client_site_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 정책 3: 관리자는 모든 요청서 조회 및 수정 가능 (추후 admin_whitelist 테이블 조인 또는 별도 어드민 권한 체크)
CREATE POLICY "Admins can view and edit all requests"
  ON public.client_site_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_whitelist WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
