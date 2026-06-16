-- =====================================================
-- Brand Subdomain Blog System DB Migration
-- =====================================================

-- 1. Profiles Table Extensions
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS requested_brand_id TEXT,
ADD COLUMN IF NOT EXISTS brand_id_status TEXT DEFAULT 'NONE',
ADD COLUMN IF NOT EXISTS brand_id_rejection_reason TEXT;

-- Unique and Check constraints for Profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS requested_brand_id_unique;
ALTER TABLE public.profiles ADD CONSTRAINT requested_brand_id_unique UNIQUE (requested_brand_id);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS requested_brand_id_format;
ALTER TABLE public.profiles ADD CONSTRAINT requested_brand_id_format 
  CHECK (requested_brand_id IS NULL OR requested_brand_id ~ '^[a-z0-9]{2,15}$');

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS brand_id_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT brand_id_status_check 
  CHECK (brand_id_status IN ('NONE', 'PENDING', 'APPROVED', 'REJECTED'));


-- 2. Blog Categories Table Creation
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_category_slug UNIQUE (user_id, slug)
);

-- Enable RLS for Blog Categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow owner to manage categories" ON public.blog_categories;
CREATE POLICY "Allow owner to manage categories" ON public.blog_categories
  FOR ALL TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow public to read categories" ON public.blog_categories;
CREATE POLICY "Allow public to read categories" ON public.blog_categories
  FOR SELECT TO public USING (true);


-- 3. Reserved/Blacklisted Brand IDs Table Creation
CREATE TABLE IF NOT EXISTS public.reserved_brand_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id TEXT UNIQUE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Reserved Brand IDs
ALTER TABLE public.reserved_brand_ids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admins to manage reserved brand IDs" ON public.reserved_brand_ids;
CREATE POLICY "Allow admins to manage reserved brand IDs" ON public.reserved_brand_ids
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

DROP POLICY IF EXISTS "Allow public to read reserved brand IDs" ON public.reserved_brand_ids;
CREATE POLICY "Allow public to read reserved brand IDs" ON public.reserved_brand_ids
  FOR SELECT TO public USING (true);


-- 4. Writing Posts Table Extensions
ALTER TABLE public.writing_creaibox_posts
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL;

-- Remove unique constraint to prevent crashes on legacy duplicate data
ALTER TABLE public.writing_creaibox_posts DROP CONSTRAINT IF EXISTS unique_user_post_slug;

-- Create composite index for efficient queries on user-specific slugs
CREATE INDEX IF NOT EXISTS idx_unique_user_post_slug ON public.writing_creaibox_posts (user_id, slug);

-- Add public SELECT access policy for published posts to allow visitors to view articles
DROP POLICY IF EXISTS "Allow public select access on published posts" ON public.writing_creaibox_posts;
CREATE POLICY "Allow public select access on published posts" ON public.writing_creaibox_posts
  FOR SELECT TO public USING (status = 'published');


-- 5. RPC function to resolve custom domain to brand ID mapping
CREATE OR REPLACE FUNCTION public.get_brand_id_by_custom_domain(domain_name TEXT)
RETURNS TEXT AS $$
DECLARE
  v_brand_id TEXT;
  v_key TEXT;
  v_val TEXT;
  r RECORD;
BEGIN
  -- 1. Check primary custom_domain
  SELECT p.brand_id INTO v_brand_id
  FROM public.profiles p
  WHERE p.extra_configs->>'custom_domain' = domain_name
    AND p.extra_configs->>'custom_domain_status' = 'APPROVED'
  LIMIT 1;
  
  IF v_brand_id IS NOT NULL THEN
    RETURN v_brand_id;
  END IF;

  -- 2. Check key-specific custom domains
  FOR r IN 
    SELECT p.id, p.extra_configs 
    FROM public.profiles p 
    WHERE p.extra_configs IS NOT NULL
  LOOP
    FOR v_key, v_val IN SELECT * FROM jsonb_each_text(r.extra_configs) LOOP
      IF v_key LIKE 'custom_domain_%' 
         AND NOT (v_key LIKE 'custom_domain_status_%') 
         AND NOT (v_key LIKE 'custom_domain_rejection_reason_%')
         AND v_val = domain_name 
      THEN
        -- Extract brand ID from key, e.g. custom_domain_golfgosu -> golfgosu
        v_brand_id := substring(v_key from 15);
        -- Check if its status is APPROVED
        IF r.extra_configs->>( 'custom_domain_status_' || v_brand_id ) = 'APPROVED' THEN
          RETURN v_brand_id;
        END IF;
      END IF;
    END LOOP;
  END LOOP;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

