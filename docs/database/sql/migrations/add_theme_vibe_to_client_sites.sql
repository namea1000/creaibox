-- Add theme_vibe column to client_sites table
-- This stores the user's selected design vibe (e.g., 'modern_clean', 'warm_auto')

ALTER TABLE public.client_sites 
ADD COLUMN IF NOT EXISTS theme_vibe TEXT;
