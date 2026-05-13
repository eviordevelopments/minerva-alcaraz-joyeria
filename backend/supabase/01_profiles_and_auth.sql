-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 01: Profiles & Authentication
-- ============================================================
-- Run AFTER 00_extensions_and_types.sql

-- ============================================================
-- TABLE: profiles
-- Extends Supabase Auth (auth.users) with brand-specific fields
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT         UNIQUE NOT NULL,
  full_name         TEXT,
  display_name      TEXT,          -- optional public-facing nickname
  phone             TEXT,
  phone_whatsapp    TEXT,          -- WhatsApp number if different
  avatar_url        TEXT,
  date_of_birth     DATE,
  gender            product_gender,
  nationality       TEXT,
  preferred_lang    TEXT DEFAULT 'es',

  -- Circle Membership
  is_circle_member  BOOLEAN DEFAULT FALSE,
  circle_tier       circle_tier DEFAULT 'Observer',
  circle_joined_at  TIMESTAMPTZ,
  circle_points     INTEGER DEFAULT 0,    -- loyalty points
  circle_code       TEXT UNIQUE,          -- referral / membership code

  -- Personalization preferences
  preferred_collections  TEXT[],          -- e.g. ['Chai', 'Etérea']
  preferred_materials    TEXT[],          -- e.g. ['Oro 14k', 'Plata .925']
  ring_size              TEXT,            -- e.g. "7", "7.5"
  bracelet_size          TEXT,
  necklace_length        TEXT,

  -- Newsletter
  newsletter_status  newsletter_status DEFAULT 'pending_confirmation',
  newsletter_topics  TEXT[],             -- e.g. ['nuevas colecciones', 'eventos']

  -- Metadata
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at       TIMESTAMPTZ DEFAULT NOW(),
  notes_admin        TEXT,               -- internal admin notes
  is_active          BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow insert during registration (via trigger below)
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: addresses
-- Multiple addresses per user (shipping / billing)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.addresses (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID         NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_type    address_type DEFAULT 'shipping',
  is_default      BOOLEAN DEFAULT FALSE,

  -- Contact at address
  recipient_name  TEXT NOT NULL,
  phone           TEXT,

  -- Mexican address format
  street          TEXT NOT NULL,
  exterior_num    TEXT NOT NULL,
  interior_num    TEXT,
  colonia         TEXT NOT NULL,
  municipality    TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  postal_code     TEXT NOT NULL,
  country         TEXT DEFAULT 'México',

  -- Delivery notes
  delivery_notes  TEXT,
  between_streets TEXT,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own addresses"
  ON public.addresses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, circle_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    upper(substring(encode(gen_random_bytes(4), 'hex'), 1, 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop if exists, then create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: update updated_at automatically
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- INDEX: Profiles
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_circle_tier ON public.profiles(circle_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_is_circle ON public.profiles(is_circle_member);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
