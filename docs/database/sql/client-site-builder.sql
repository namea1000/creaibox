-- =========================================================================
-- CreAIbox AI Homepage Builder & CMS Tables Setup
-- =========================================================================

-- 1. Client Sites Master Table
CREATE TABLE IF NOT EXISTS public.client_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id TEXT NOT NULL UNIQUE,
    custom_domain TEXT UNIQUE,
    template_id TEXT NOT NULL DEFAULT 'service_1',
    company_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    extra_configs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. Site Sections Table
CREATE TABLE IF NOT EXISTS public.site_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.client_sites(id) ON DELETE CASCADE,
    section_type TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    title TEXT,
    subtitle TEXT,
    content_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- 3. Site Posts Table (Notices, Bulletin Board Posts, & Consultation Inquiries)
CREATE TABLE IF NOT EXISTS public.site_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES public.client_sites(id) ON DELETE CASCADE,
    post_type TEXT NOT NULL CHECK (post_type IN ('notice', 'board', 'inquiry')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    views INTEGER NOT NULL DEFAULT 0,
    extra_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =========================================================================
-- Performance Optimization Indices
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_client_sites_brand_id ON public.client_sites (brand_id);
CREATE INDEX IF NOT EXISTS idx_client_sites_custom_domain ON public.client_sites (custom_domain);
CREATE INDEX IF NOT EXISTS idx_site_sections_site_id ON public.site_sections (site_id);
CREATE INDEX IF NOT EXISTS idx_site_posts_site_id ON public.site_posts (site_id);
CREATE INDEX IF NOT EXISTS idx_site_posts_type ON public.site_posts (post_type);

-- =========================================================================
-- Row Level Security (RLS) Configuration & Policies
-- =========================================================================

ALTER TABLE public.client_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_posts ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------------------
-- client_sites Policies
-- -------------------------------------------------------------------------

-- 1) Allow anyone to view active client sites (For public page rendering)
CREATE POLICY "Allow public SELECT on active sites" ON public.client_sites
    FOR SELECT
    USING (status = 'ACTIVE');

-- 2) Allow authenticated site owners to manage their site settings
CREATE POLICY "Allow owners ALL on their sites" ON public.client_sites
    FOR ALL
    TO authenticated
    USING (auth.uid() = profile_id)
    WITH CHECK (auth.uid() = profile_id);

-- -------------------------------------------------------------------------
-- site_sections Policies
-- -------------------------------------------------------------------------

-- 1) Allow anyone to view sections of active sites
CREATE POLICY "Allow public SELECT on active site sections" ON public.site_sections
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_sections.site_id AND client_sites.status = 'ACTIVE'
        )
    );

-- 2) Allow site owners to manage their site sections
CREATE POLICY "Allow owners ALL on their site sections" ON public.site_sections
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_sections.site_id AND client_sites.profile_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_sections.site_id AND client_sites.profile_id = auth.uid()
        )
    );

-- -------------------------------------------------------------------------
-- site_posts Policies
-- -------------------------------------------------------------------------

-- 1) Allow anyone to view public posts (notices & boards) of active sites
CREATE POLICY "Allow public SELECT on notice and board posts" ON public.site_posts
    FOR SELECT
    USING (
        post_type IN ('notice', 'board') AND
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_posts.site_id AND client_sites.status = 'ACTIVE'
        )
    );

-- 2) Allow anyone (including anonymous guest users) to submit inquiries
CREATE POLICY "Allow anyone INSERT on inquiries" ON public.site_posts
    FOR INSERT
    WITH CHECK (
        post_type = 'inquiry' AND
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_posts.site_id AND client_sites.status = 'ACTIVE'
        )
    );

-- 3) Allow site owners to manage all posts/inquiries on their site
CREATE POLICY "Allow owners ALL on their site posts" ON public.site_posts
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_posts.site_id AND client_sites.profile_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.client_sites
            WHERE client_sites.id = site_posts.site_id AND client_sites.profile_id = auth.uid()
        )
    );
