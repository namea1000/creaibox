-- =====================================================
-- Migration: Add Cookie Consent Column to Profiles Table
-- Date: 2026-07-06
-- =====================================================

-- 1. Add the cookie_consent column to public.profiles if it doesn't already exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cookie_consent BOOLEAN DEFAULT NULL;

-- 2. Add description comment for the new column
COMMENT ON COLUMN public.profiles.cookie_consent IS 'Stores whether the user consented to cookies (true = accepted, false = rejected, null = undecided)';
