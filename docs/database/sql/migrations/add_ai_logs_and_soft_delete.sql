-- 1. Add status column to site_sections for Soft Delete
ALTER TABLE public.site_sections
ADD COLUMN IF NOT EXISTS status text DEFAULT 'ACTIVE';

-- 2. Create ai_generation_logs table
CREATE TABLE IF NOT EXISTS public.ai_generation_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id uuid REFERENCES public.client_sites(id) ON DELETE CASCADE,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_prompt text NOT NULL,
    ai_response jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Enable RLS on the new table
ALTER TABLE public.ai_generation_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for ai_generation_logs
-- Only the owner of the site can view or insert their logs
CREATE POLICY "Users can insert their own AI logs"
ON public.ai_generation_logs
FOR INSERT
WITH CHECK (
  auth.uid() = profile_id
);

CREATE POLICY "Users can view their own AI logs"
ON public.ai_generation_logs
FOR SELECT
USING (
  auth.uid() = profile_id
);

-- (Optional) If admins need to view all logs, an admin policy would go here.
