-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 14: ERP Accounts & Profiles
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'erp_location') THEN
        CREATE TYPE erp_location AS ENUM ('San Miguel', 'ONLINE');
    END IF;
END
$$;

-- ============================================================
-- TABLE: erp_accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.erp_accounts (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT UNIQUE NOT NULL,
  location          erp_location NOT NULL DEFAULT 'ONLINE',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.erp_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own erp account"
  ON public.erp_accounts FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own erp account"
  ON public.erp_accounts FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role or auth user can insert account"
  ON public.erp_accounts FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- TABLE: erp_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.erp_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id        UUID NOT NULL REFERENCES public.erp_accounts(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  role              TEXT NOT NULL,
  avatar_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.erp_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own account profiles"
  ON public.erp_profiles FOR SELECT
  USING (auth.uid() = account_id);

CREATE POLICY "Users can insert profiles for own account"
  ON public.erp_profiles FOR INSERT
  WITH CHECK (auth.uid() = account_id);

CREATE POLICY "Users can update profiles for own account"
  ON public.erp_profiles FOR UPDATE
  USING (auth.uid() = account_id);

CREATE POLICY "Users can delete profiles for own account"
  ON public.erp_profiles FOR DELETE
  USING (auth.uid() = account_id);

-- ============================================================
-- STORAGE: erp_avatars
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('erp_avatars', 'erp_avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage (Authenticated users can upload, public can read)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'erp_avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'erp_avatars' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update their avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'erp_avatars' AND auth.role() = 'authenticated');
