-- Table Definition for Global System Settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    key varchar(100) PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Read Access Policy for Authenticated Users
CREATE POLICY "Allow read for authenticated users" ON public.system_settings
    FOR SELECT TO authenticated USING (true);

-- Initial default settings seed (Cron state is active by default)
INSERT INTO public.system_settings (key, value)
VALUES ('cron_trending_status', '{"active": true}')
ON CONFLICT (key) DO NOTHING;
