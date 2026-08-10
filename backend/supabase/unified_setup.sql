-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 00: Extensions, Enums & Custom Types
-- ============================================================
-- Run this FIRST in Supabase SQL Editor

-- UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- pgcrypto for secure tokens
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- For full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- For unaccent search (spanish text)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- CUSTOM ENUM TYPES
-- ============================================================

-- Product categories
CREATE TYPE product_category AS ENUM (
  'Anillos',
  'Collares',
  'Pulseras',
  'Sets',
  'Edición Limitada',
  'Piezas Únicas',
  'Pendientes',
  'Broches'
);

-- Product collections (all current collections)
CREATE TYPE product_collection AS ENUM (
  'Amatista',
  'Chai',
  'Escencia',
  'Etérea',
  'Serpientes',
  'Floral',
  'Ecos de la Tierra',
  'Anillos de Piedras',
  'Diseños de Autor',
  'Piezas Únicas'
);

-- Currency
CREATE TYPE currency_code AS ENUM ('MXN', 'USD', 'EUR');

-- Gender
CREATE TYPE product_gender AS ENUM ('Hombre', 'Mujer', 'Unisex');

-- Order status lifecycle
CREATE TYPE order_status AS ENUM (
  'draft',          -- cart pending
  'pending',        -- placed, awaiting payment
  'paid',           -- payment confirmed
  'processing',     -- being prepared
  'shipped',        -- in transit
  'delivered',      -- completed
  'cancelled',      -- cancelled by user or admin
  'refunded'        -- refunded
);

-- Payment method
CREATE TYPE payment_method AS ENUM (
  'card',
  'oxxo',
  'transfer',
  'conekta',
  'whatsapp_manual'
);

-- Customization request status
CREATE TYPE customization_status AS ENUM (
  'pending_review',
  'in_design',
  'quoted',
  'approved',
  'in_production',
  'ready',
  'delivered',
  'cancelled'
);

-- Circle membership tier
CREATE TYPE circle_tier AS ENUM (
  'Observer',     -- just registered
  'Initiate',     -- 1st purchase
  'Devotee',      -- 3+ purchases or $10,000+ MXN
  'Keeper',       -- 6+ purchases or $25,000+ MXN
  'Eternal'       -- top tier, VIP
);

-- Album visibility
CREATE TYPE album_visibility AS ENUM ('private', 'shared_link', 'public');

-- Newsletter status
CREATE TYPE newsletter_status AS ENUM ('subscribed', 'unsubscribed', 'pending_confirmation');

-- Address type
CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');
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
    upper(substring(md5(random()::text), 1, 8))
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
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 02: Products & Collections Catalog
-- ============================================================
-- Run AFTER 01_profiles_and_auth.sql

-- ============================================================
-- TABLE: collections
-- Master list of collections / series
-- ============================================================
CREATE TABLE IF NOT EXISTS public.collections (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT          UNIQUE NOT NULL,
  name              TEXT          NOT NULL,
  collection_enum   product_collection,
  description       TEXT,
  manifesto         TEXT,         -- brand storytelling narrative
  narrative         TEXT,         -- short quote / card text
  image_url         TEXT,         -- hero image
  thumbnail_url     TEXT,
  theme_color       TEXT,         -- hex color for UI theming
  theme_background  TEXT DEFAULT 'bone', -- 'bone' | 'green' | 'gold' | 'silver'
  display_order     INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT TRUE,
  is_featured       BOOLEAN DEFAULT FALSE,
  is_circle_exclusive BOOLEAN DEFAULT FALSE,

  -- SEO
  seo_title         TEXT,
  seo_description   TEXT,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Collections are publicly readable
CREATE POLICY "Collections are viewable by everyone"
  ON public.collections FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin can manage collections"
  ON public.collections FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: products
-- Master product catalog with all metadata
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id                  UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku                 TEXT             UNIQUE NOT NULL,
  slug                TEXT             UNIQUE NOT NULL,
  name                TEXT             NOT NULL,
  description         TEXT,
  long_description    TEXT,            -- extended rich text
  significado         TEXT,            -- spiritual/symbolic meaning
  price_cents         INTEGER          NOT NULL,         -- in cents: 3800 MXN = 380000
  compare_at_price_cents INTEGER,                       -- original price if on sale
  currency            currency_code DEFAULT 'MXN',
  weight_grams        NUMERIC(8,2),
  dimensions_mm       JSONB,           -- {"length": 20, "width": 10, "height": 5}

  -- Classification
  category            product_category NOT NULL,
  collection_id       UUID             REFERENCES public.collections(id),
  collection_name     TEXT,            -- denormalized for queries

  -- Materials & Gemstones
  materials           TEXT[]           NOT NULL DEFAULT '{}',
  primary_material    TEXT,
  gemstones           JSONB,           -- [{"stone": "Amatista", "carat": 1.2, "origin": "Brasil"}]
  finish              TEXT,            -- 'Pulido', 'Envejecido', 'Mate'
  purity              TEXT,            -- '.925', '14k', '18k', '.950'

  -- Metadata
  gender              product_gender DEFAULT 'Unisex',
  style               TEXT,            -- 'Escultórico', 'Orgánico Brutalista', etc.
  occasions           TEXT[],          -- ['Gala', 'Ritual', 'Meditación']
  outfit_suggestions  TEXT[],          -- ['Seda Cruda', 'Lino Blanco']

  -- Flags
  is_active           BOOLEAN DEFAULT TRUE,
  is_featured         BOOLEAN DEFAULT FALSE,
  is_author_design    BOOLEAN DEFAULT FALSE,
  is_limited_edition  BOOLEAN DEFAULT FALSE,
  is_unique_piece     BOOLEAN DEFAULT FALSE,         -- pieza única (stock = 1)
  is_circle_exclusive BOOLEAN DEFAULT FALSE,         -- only for THE CIRCLE members
  is_customizable     BOOLEAN DEFAULT FALSE,         -- can be ordered custom
  is_new_arrival      BOOLEAN DEFAULT FALSE,

  -- Sizes available
  available_sizes     TEXT[],          -- ring sizes, bracelet sizes etc.
  size_guide_url      TEXT,

  -- Inventory
  stock               INTEGER NOT NULL DEFAULT 0,
  stock_reserved      INTEGER DEFAULT 0,   -- items in active carts/orders
  low_stock_threshold INTEGER DEFAULT 2,

  -- SEO
  seo_title           TEXT,
  seo_description     TEXT,
  seo_keywords        TEXT[],
  payment_link        TEXT,

  -- Cloudinary image references
  images              TEXT[]   NOT NULL DEFAULT '{}',   -- array of Cloudinary URLs
  primary_image       TEXT,    -- first/hero image

  -- Timestamps
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  published_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products publicly viewable (active ones only)
CREATE POLICY "Active products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Circle exclusive products: only visible to circle members
-- (handled at application level, but also enforced here via RLS)
CREATE POLICY "Admin can manage all products"
  ON public.products FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: product_images
-- Additional images beyond the JSONB array (for complex management)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID    NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url           TEXT    NOT NULL,
  cloudinary_id TEXT,
  alt_text      TEXT,
  sort_order    INTEGER DEFAULT 0,
  is_primary    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Product images are viewable by everyone"
  ON public.product_images FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage product images"
  ON public.product_images FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: product_variants
-- For size/color/material variants of the same product
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
  id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID    NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku_variant     TEXT    UNIQUE NOT NULL,
  name            TEXT    NOT NULL,     -- e.g. "Talla 7", "Plata", "Oro 14k"
  variant_type    TEXT,                 -- 'size', 'material', 'finish', 'color'
  variant_value   TEXT    NOT NULL,     -- the actual value
  price_modifier_cents INTEGER DEFAULT 0,  -- add/subtract from base price
  stock           INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variants viewable by everyone"
  ON public.product_variants FOR SELECT USING (TRUE);

CREATE POLICY "Admin can manage variants"
  ON public.product_variants FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- TRIGGERS: auto-update
-- ============================================================
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- INDEXES: Products
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_circle ON public.products(is_circle_exclusive);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price_cents);

-- Full-text search index on name + description
CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products
  USING gin(to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(significado, '')));

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);

-- ============================================================
-- SEED: Collections
-- ============================================================
INSERT INTO public.collections (slug, name, collection_enum, description, narrative, image_url, theme_background, is_featured, display_order)
VALUES
  ('amatista', 'Amatista', 'Amatista',
   'La colección que captura la esencia de la transmutación y la sabiduría interior.',
   'Donde la sabiduría se cristaliza en forma eterna.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280176/minerva_joyeria/products/amatista/Coleccio_n_1_4.jpg',
   'bone', TRUE, 1),

  ('chai', 'Chai', 'Chai',
   'Símbolo de vida y protección. El número 18 cincelado en metal noble.',
   'La vitalidad del metal enlazada en el ciclo infinito de la vida.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275627/minerva_joyeria/products/chai/CHAI-18.jpg',
   'green', TRUE, 2),

  ('escencia', 'Escencia', 'Escencia',
   'Milagritos contemporáneos. Arte votivo mexicano elevado a joyería de autor.',
   'El alma de México traducida en formas sagradas.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275673/minerva_joyeria/products/escencia/SMA_MINERVA-54.jpg',
   'gold', TRUE, 3),

  ('eterea', 'Etérea', 'Etérea',
   'Formas que desafían la gravedad. Líneas que parecen levitar en el tiempo.',
   'Formas que desafían la gravedad, capturando la esencia del viento.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-3.JPG',
   'silver', TRUE, 4),

  ('serpientes', 'Serpientes', 'Serpientes',
   'La serpiente como símbolo de renovación constante y dualidad universal.',
   'Renovación perpetua. La dualidad como totalidad.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg',
   'bone', FALSE, 5),

  ('floral', 'Floral', 'Floral',
   'La belleza efímera de la naturaleza inmortalizada en metal noble.',
   'La belleza efímera de la naturaleza inmortalizada en oro.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280270/minerva_joyeria/products/floral/Coleccio_n_3_3.jpg',
   'silver', TRUE, 6),

  ('ecos-de-la-tierra', 'Ecos de la Tierra', 'Ecos de la Tierra',
   'Inspirado en las fuerzas geológicas que forjaron nuestro planeta.',
   'La tierra siempre habla. Estas piezas son su eco.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO 1.jpg',
   'bone', FALSE, 7),

  ('anillos-de-piedras', 'Anillos de Piedras', 'Anillos de Piedras',
   'Cuarzo maestro, piedras en bruto. La naturaleza dicta la forma del metal.',
   'Donde la tierra susurra secretos de eternidad a través del cristal.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7.JPG',
   'bone', FALSE, 8),

  ('disenos-de-autor', 'Diseños de Autor', 'Diseños de Autor',
   'Piezas de edición limitada creadas con inspiración total de Minerva Alcaraz.',
   'La firma de una artista grabada en metal eterno.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-30.JPG',
   'gold', FALSE, 9),

  ('piezas-unicas', 'Piezas Únicas', 'Piezas Únicas',
   'Una sola pieza. Irrepetible. Tuya para siempre.',
   'La singularidad como lujo supremo.',
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg',
   'green', FALSE, 10)
ON CONFLICT (slug) DO NOTHING;
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 03: Product Seed Data — All Products
-- ============================================================
-- Run AFTER 02_products_and_collections.sql
-- This inserts all products from the frontend constants

-- ============================================================
-- SEED: All Products
-- ============================================================

-- Helper: get collection id by slug
-- We insert products with collection_id references

INSERT INTO public.products (
  sku, slug, name, description, significado, price_cents, currency,
  category, collection_name, materials, primary_material, purity, gender,
  is_featured, is_active, stock, images, primary_image
)
SELECT
  p.sku, p.slug, p.name, p.description, p.significado, p.price_cents,
  'MXN'::currency_code,
  p.category::product_category,
  p.collection_name, p.materials, p.primary_material, p.purity,
  'Unisex'::product_gender,
  p.is_featured, TRUE, p.stock, p.images, p.primary_image
FROM (
  VALUES

  -- ===================== AMATISTA =====================
  ('MA-AMA-001', 'anillo-amatista-de-luz', 'Anillo Amatista de Luz',
   'Una pieza que captura la esencia de la transmutación. Amatista tallada a mano con montura en plata .925 envejecida.',
   'La amatista es la piedra de la sabiduría y la transmutación, permitiendo que el portador conecte con su paz interior.',
   380000, 'Anillos', 'Amatista',
   ARRAY['Plata .925', 'Amatista Natural'],
   'Plata .925', '.925', TRUE, 5,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280176/minerva_joyeria/products/amatista/Coleccio_n_1_4.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280177/minerva_joyeria/products/amatista/Coleccio_n_1_5.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280174/minerva_joyeria/products/amatista/Coleccio_n_1_1.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280175/minerva_joyeria/products/amatista/Coleccio_n_1_2.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280176/minerva_joyeria/products/amatista/Coleccio_n_1_4.jpg'),

  -- ===================== CHAI =====================
  ('MA-CHA-001', 'medallon-chai-ancestral', 'Medallón Chai Ancestral',
   'Símbolo de vida y protección. Un medallón de gran formato con detalles cincelados a mano.',
   'El Chai representa el número 18, el valor numérico de la Vida. Portarlo es celebrar el flujo constante del ser.',
   520000, 'Collares', 'Chai',
   ARRAY['Plata .925', 'Baño de Oro 24k'],
   'Plata .925', '.925', TRUE, 3,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275655/minerva_joyeria/products/chai/CHAI.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275629/minerva_joyeria/products/chai/CHAI-2.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275631/minerva_joyeria/products/chai/CHAI-21.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275627/minerva_joyeria/products/chai/CHAI-18.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275655/minerva_joyeria/products/chai/CHAI.jpg'),

  ('MA-CHA-002', 'anillo-chai-fluidez', 'Anillo Chai Fluidez',
   'Anillo de banda ancha con grabados rítmicos que evocan el movimiento del agua y el tiempo.',
   'Representa la capacidad de adaptarse y fluir con los ciclos de la naturaleza.',
   290000, 'Anillos', 'Chai',
   ARRAY['Plata .925'],
   'Plata .925', '.925', FALSE, 8,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275646/minerva_joyeria/products/chai/CHAI-4.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275648/minerva_joyeria/products/chai/CHAI-5.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275649/minerva_joyeria/products/chai/CHAI-6.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275646/minerva_joyeria/products/chai/CHAI-4.jpg'),

  -- ===================== ESCENCIA =====================
  ('MA-ESC-001', 'medalla-corazon-sagrado', 'Medalla Corazón Sagrado',
   'Inspirada en los milagritos tradicionales mexicanos, esta pieza simboliza el amor incondicional y la devoción.',
   'El corazón es el centro de la esencia humana, el milagrito es la petición y el agradecimiento hecho arte.',
   450000, 'Collares', 'Escencia',
   ARRAY['Oro 14k', 'Rubíes'],
   'Oro 14k', '14k', TRUE, 2,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275673/minerva_joyeria/products/escencia/SMA_MINERVA-54.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778279752/minerva_joyeria/products/escencia/s5lcje72gpht7y1eh2nw.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275666/minerva_joyeria/products/escencia/Minerva_Joyeria_1_-10.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275673/minerva_joyeria/products/escencia/SMA_MINERVA-54.jpg'),

  ('MA-ESC-002', 'aretes-milagrito-gota', 'Aretes Milagrito Gota',
   'Pequeñas exvotos esculpidos en plata con detalles en oro, piezas cargadas de misticismo.',
   'Recordatorios constantes de los pequeños milagros cotidianos.',
   320000, 'Pendientes', 'Escencia',
   ARRAY['Plata .925', 'Detalles en Oro 14k'],
   'Plata .925', '.925', FALSE, 4,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275674/minerva_joyeria/products/escencia/SMA_MINERVA-59.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275675/minerva_joyeria/products/escencia/SMA_MINERVA-62.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275674/minerva_joyeria/products/escencia/SMA_MINERVA-59.jpg'),

  -- ===================== DISEÑOS DE AUTOR =====================
  ('MA-IND-001', 'aretes-semilla-de-mar', 'Aretes Semilla de Mar',
   'Diseño de autor inspirado en las formas orgánicas de las conchas marinas encontradas en las costas de Guerrero.',
   'La semilla como origen de la vida, protegida por el mar. Una pieza que celebra la fertilidad creativa.',
   850000, 'Pendientes', 'Diseños de Autor',
   ARRAY['Oro Amarillo 18k', 'Texturizado a mano'],
   'Oro Amarillo 18k', '18k', TRUE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-30.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-51.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-32.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-36.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-30.JPG'),

  -- ===================== PIEZAS ÚNICAS =====================
  ('MA-IND-002', 'anillo-perla-de-roca', 'Anillo Perla de Roca',
   'Pieza única. Una perla negra de gran formato montada sobre una estructura de plata que emula la roca volcánica.',
   'La belleza que nace del caos. La perla perfecta custodiada por la imperfección de la roca.',
   1200000, 'Piezas Únicas', 'Piezas Únicas',
   ARRAY['Plata Ley .950', 'Perla Negra de Tahití'],
   'Plata Ley .950', '.950', TRUE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/Minerva2-25.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/individuales/MINE-52.jpg'),

  -- ===================== ETÉREA =====================
  ('MA-ETE-001', 'set-vuelo-etereo', 'Set Vuelo Etéreo',
   'Conjunto de collar y aretes con líneas que parecen levitar. Representa la libertad y la ligereza del alma.',
   'Lo etéreo es aquello que pertenece al cielo. Estas piezas buscan elevar la vibración de quien las porta.',
   1890000, 'Sets', 'Etérea',
   ARRAY['Oro Blanco 14k', 'Zafiros Blancos'],
   'Oro Blanco 14k', '14k', TRUE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-2.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-6.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-10.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-11.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva2-2.JPG'),

  ('MA-ETE-002', 'pulsera-brisa', 'Pulsera Brisa',
   'Pulsera rígida de apertura invisible, con una textura que emula el paso del viento sobre la arena.',
   'Un recordatorio táctil de la impermanencia y la belleza de lo sutil.',
   950000, 'Pulseras', 'Etérea',
   ARRAY['Oro 14k'],
   'Oro 14k', '14k', FALSE, 3,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-15.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-16.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-17.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/eterea/Minerva%202-15.jpg'),

  -- ===================== SERPIENTES =====================
  ('MA-SER-001', 'anillo-serpiente-dualidad', 'Anillo Serpiente Dualidad',
   'Dos cabezas de serpiente que se encuentran en el centro, representando el equilibrio entre la luz y la sombra.',
   'La serpiente es renovación constante. La dualidad es la aceptación de nuestra totalidad.',
   720000, 'Anillos', 'Serpientes',
   ARRAY['Oro 14k', 'Ojos de Esmeralda'],
   'Oro 14k', '14k', TRUE, 2,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280294/minerva_joyeria/products/serpientes/DSCF5064.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-101_1.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778275754/minerva_joyeria/products/serpientes/SMA_MINERVA-100.jpg'),

  -- ===================== FLORAL =====================
  ('MA-FLO-001', 'anillo-dalia-ancestral', 'Anillo Dalia Ancestral',
   'Homenaje a la flor nacional de México. Pétalos esculpidos con una precisión que desafía al metal.',
   'La Dalia representa la dignidad y la fuerza escondida en la delicadeza.',
   580000, 'Anillos', 'Floral',
   ARRAY['Plata .925', 'Centro de Citrino'],
   'Plata .925', '.925', FALSE, 5,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280281/minerva_joyeria/products/floral/FLORES_1.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280269/minerva_joyeria/products/floral/Coleccio_n_3_1.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280282/minerva_joyeria/products/floral/FLORES_2.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1778280281/minerva_joyeria/products/floral/FLORES_1.jpg'),

  -- ===================== ECOS DE LA TIERRA =====================
  ('MA-ECO-001', 'anillo-tectonico', 'Anillo Tectónico',
   'Inspirado en el movimiento de las placas terrestres. Una pieza de gran volumen y presencia escultórica.',
   'La tierra siempre habla. Esta pieza es un eco de su fuerza primordial.',
   420000, 'Anillos', 'Ecos de la Tierra',
   ARRAY['Plata .950 Envejecida'],
   'Plata .950 Envejecida', '.950', FALSE, 4,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO%201.jpg',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4196%20(1).JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO%202.jpg'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/ANILLO%201.jpg'),

  ('MA-ECO-002', 'brazalete-estrato', 'Brazalete Estrato',
   'Brazalete abierto con texturas que emulan las capas de la tierra acumuladas a través de los eones.',
   'Nuestra historia está escrita en los estratos del tiempo. Portar esta pieza es portar memoria.',
   890000, 'Pulseras', 'Ecos de la Tierra',
   ARRAY['Plata Ley .950'],
   'Plata Ley .950', '.950', FALSE, 2,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4318.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4317.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/ecos-tierra/DSCF4318.JPG'),

  -- ===================== ANILLOS DE PIEDRAS =====================
  ('MA-PIE-001', 'anillo-ritual-de-cristal', 'Anillo Ritual de Cristal',
   'Anillo de gran formato con un cuarzo maestro en bruto. La piedra dicta la forma del metal.',
   'Una pieza para canalizar energía. El cristal es el guardián de la luz.',
   1150000, 'Piezas Únicas', 'Anillos de Piedras',
   ARRAY['Plata .925', 'Cuarzo Hialino'],
   'Plata .925', '.925', FALSE, 1,
   ARRAY[
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-4.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-7.JPG',
     'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-5.JPG'
   ],
   'https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto/v1/minerva_joyeria/products/anillos-piedras/SMA_MINERVA-4.JPG')

) AS p(
  sku, slug, name, description, significado, price_cents, category, collection_name,
  materials, primary_material, purity, is_featured, stock, images, primary_image
)
ON CONFLICT (sku) DO NOTHING;

-- ============================================================
-- UPDATE: Link products to collection IDs
-- ============================================================
UPDATE public.products p
SET collection_id = c.id
FROM public.collections c
WHERE p.collection_name = c.name;

-- Update unique piece flags
UPDATE public.products
SET is_unique_piece = TRUE, is_limited_edition = TRUE
WHERE category = 'Piezas Únicas' OR stock = 1;

-- Update author design flag
UPDATE public.products
SET is_author_design = TRUE
WHERE collection_name = 'Diseños de Autor';
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 04: Cart (Mi Bolsa) & Checkout
-- ============================================================
-- Run AFTER 03_seed_products.sql

-- ============================================================
-- TABLE: carts
-- One active cart per user (or guest session)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.carts (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id    TEXT,             -- for guest carts (browser fingerprint)
  currency      currency_code DEFAULT 'MXN',

  -- Totals (computed, stored for quick access)
  subtotal_cents      INTEGER DEFAULT 0,
  discount_cents      INTEGER DEFAULT 0,
  shipping_cents      INTEGER DEFAULT 0,
  tax_cents           INTEGER DEFAULT 0,
  total_cents         INTEGER DEFAULT 0,

  -- Promo / Circle codes
  promo_code          TEXT,
  promo_discount_pct  NUMERIC(5,2) DEFAULT 0,
  circle_discount_applied BOOLEAN DEFAULT FALSE,

  notes               TEXT,        -- customer notes for the order
  is_active           BOOLEAN DEFAULT TRUE,
  expires_at          TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON public.carts FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================
-- TABLE: cart_items
-- Individual line items in a cart
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id                UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id           UUID    NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id        UUID    NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  variant_id        UUID    REFERENCES public.product_variants(id),

  -- Snapshot of product at time of adding (price-lock)
  product_name      TEXT    NOT NULL,
  product_sku       TEXT    NOT NULL,
  product_image     TEXT,
  unit_price_cents  INTEGER NOT NULL,
  quantity          INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  subtotal_cents    INTEGER GENERATED ALWAYS AS (unit_price_cents * quantity) STORED,

  -- Customization notes for this item
  customization_notes TEXT,
  size_requested    TEXT,
  engraving_text    TEXT,

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart items"
  ON public.cart_items FOR ALL
  USING (
    cart_id IN (
      SELECT id FROM public.carts WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- ============================================================
-- FUNCTION: Recalculate cart totals
-- ============================================================
CREATE OR REPLACE FUNCTION public.recalculate_cart(p_cart_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subtotal INTEGER;
BEGIN
  SELECT COALESCE(SUM(subtotal_cents), 0)
  INTO v_subtotal
  FROM public.cart_items
  WHERE cart_id = p_cart_id;

  UPDATE public.carts
  SET
    subtotal_cents = v_subtotal,
    total_cents = v_subtotal - discount_cents + shipping_cents + tax_cents,
    updated_at = NOW()
  WHERE id = p_cart_id;
END;
$$;

-- Trigger recalculation when cart_items change
CREATE OR REPLACE FUNCTION public.trigger_cart_recalculate()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_cart(OLD.cart_id);
  ELSE
    PERFORM public.recalculate_cart(NEW.cart_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER cart_items_update_cart
  AFTER INSERT OR UPDATE OR DELETE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.trigger_cart_recalculate();

-- ============================================================
-- TABLE: orders
-- Confirmed purchases
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number          TEXT         UNIQUE NOT NULL,  -- "MA-2025-0001" human readable
  user_id               UUID         REFERENCES public.profiles(id),
  cart_id               UUID         REFERENCES public.carts(id),

  -- Status
  status                order_status DEFAULT 'pending',
  payment_method        payment_method,
  payment_reference     TEXT,         -- transaction ID from payment gateway
  payment_confirmed_at  TIMESTAMPTZ,

  -- Pricing snapshot
  subtotal_cents        INTEGER NOT NULL,
  discount_cents        INTEGER DEFAULT 0,
  shipping_cents        INTEGER DEFAULT 0,
  tax_cents             INTEGER DEFAULT 0,
  total_cents           INTEGER NOT NULL,
  currency              currency_code DEFAULT 'MXN',

  -- Circle discount
  circle_discount_pct   NUMERIC(5,2) DEFAULT 0,
  promo_code            TEXT,

  -- Shipping address (snapshot at time of order)
  shipping_name         TEXT,
  shipping_phone        TEXT,
  shipping_street       TEXT,
  shipping_exterior_num TEXT,
  shipping_interior_num TEXT,
  shipping_colonia      TEXT,
  shipping_municipality TEXT,
  shipping_city         TEXT,
  shipping_state        TEXT,
  shipping_postal_code  TEXT,
  shipping_country      TEXT DEFAULT 'México',

  -- Tracking
  tracking_number       TEXT,
  carrier               TEXT,
  estimated_delivery    DATE,
  delivered_at          TIMESTAMPTZ,

  -- Customer notes
  customer_notes        TEXT,
  admin_notes           TEXT,
  gift_message          TEXT,
  is_gift               BOOLEAN DEFAULT FALSE,

  -- Circle points earned
  points_earned         INTEGER DEFAULT 0,

  -- Timestamps
  placed_at             TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manages all orders"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: order_items
-- Line items of a confirmed order (snapshot)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id                    UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID     NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id            UUID     REFERENCES public.products(id),
  variant_id            UUID     REFERENCES public.product_variants(id),

  -- Frozen snapshot of the product at purchase time
  product_name          TEXT     NOT NULL,
  product_sku           TEXT     NOT NULL,
  product_image         TEXT,
  collection_name       TEXT,
  materials             TEXT[],
  unit_price_cents      INTEGER  NOT NULL,
  quantity              INTEGER  NOT NULL DEFAULT 1,
  subtotal_cents        INTEGER  NOT NULL,

  -- Customization
  customization_notes   TEXT,
  size_requested        TEXT,
  engraving_text        TEXT,

  -- Review tracking
  review_requested_at   TIMESTAMPTZ,
  review_submitted_at   TIMESTAMPTZ,

  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admin manages order items"
  ON public.order_items FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- FUNCTION: Generate order number
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'MA-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
END;
$$;

-- ============================================================
-- FUNCTION: Place order from cart
-- Called from the server to convert a cart into an order
-- ============================================================
CREATE OR REPLACE FUNCTION public.place_order(
  p_cart_id UUID,
  p_user_id UUID,
  p_address_id UUID,
  p_payment_method payment_method DEFAULT 'card',
  p_customer_notes TEXT DEFAULT NULL,
  p_gift_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_cart RECORD;
  v_address RECORD;
  v_order_number TEXT;
  v_points INTEGER;
BEGIN
  -- Fetch cart
  SELECT * INTO v_cart FROM public.carts WHERE id = p_cart_id AND user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Cart not found or does not belong to user';
  END IF;

  -- Fetch address
  SELECT * INTO v_address FROM public.addresses WHERE id = p_address_id AND user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Address not found or does not belong to user';
  END IF;

  -- Generate order number
  v_order_number := public.generate_order_number();

  -- Calculate Circle points (1 point per 100 MXN)
  v_points := v_cart.total_cents / 10000;

  -- Create the order
  INSERT INTO public.orders (
    order_number, user_id, cart_id, status, payment_method,
    subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents, currency,
    promo_code, circle_discount_pct,
    shipping_name, shipping_phone,
    shipping_street, shipping_exterior_num, shipping_interior_num,
    shipping_colonia, shipping_municipality, shipping_city,
    shipping_state, shipping_postal_code, shipping_country,
    customer_notes, gift_message, is_gift, points_earned
  )
  VALUES (
    v_order_number, p_user_id, p_cart_id, 'pending', p_payment_method,
    v_cart.subtotal_cents, v_cart.discount_cents, v_cart.shipping_cents,
    v_cart.tax_cents, v_cart.total_cents, v_cart.currency,
    v_cart.promo_code, v_cart.promo_discount_pct,
    v_address.recipient_name, v_address.phone,
    v_address.street, v_address.exterior_num, v_address.interior_num,
    v_address.colonia, v_address.municipality, v_address.city,
    v_address.state, v_address.postal_code, v_address.country,
    p_customer_notes, p_gift_message, p_gift_message IS NOT NULL,
    v_points
  )
  RETURNING id INTO v_order_id;

  -- Copy cart items to order items
  INSERT INTO public.order_items (
    order_id, product_id, variant_id,
    product_name, product_sku, product_image, collection_name, materials,
    unit_price_cents, quantity, subtotal_cents,
    customization_notes, size_requested, engraving_text
  )
  SELECT
    v_order_id, ci.product_id, ci.variant_id,
    ci.product_name, ci.product_sku, ci.product_image,
    p.collection_name, p.materials,
    ci.unit_price_cents, ci.quantity, ci.subtotal_cents,
    ci.customization_notes, ci.size_requested, ci.engraving_text
  FROM public.cart_items ci
  JOIN public.products p ON p.id = ci.product_id
  WHERE ci.cart_id = p_cart_id;

  -- Deactivate cart
  UPDATE public.carts SET is_active = FALSE WHERE id = p_cart_id;

  -- Award Circle points
  UPDATE public.profiles
  SET circle_points = circle_points + v_points
  WHERE id = p_user_id;

  RETURN v_order_id;
END;
$$;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_is_active ON public.carts(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================
-- TRIGGERS: auto-update
-- ============================================================
CREATE TRIGGER carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 05: Favorites, Albums & Wishlists (Mi Colección Personal)
-- ============================================================
-- Run AFTER 04_cart_and_orders.sql

-- ============================================================
-- TABLE: favorites
-- User's saved favorite products
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  UUID    NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  notes       TEXT,   -- personal note about why they love it
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public: friends can see public favorites if shared
CREATE POLICY "Shared favorites are readable by public"
  ON public.favorites FOR SELECT
  USING (TRUE); -- filtered at app level, enhanced below

-- ============================================================
-- TABLE: albums
-- Curated personal collections / lookbooks by the user
-- "Álbumes" - My personal style boards
-- ============================================================
CREATE TABLE IF NOT EXISTS public.albums (
  id              UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug            TEXT          NOT NULL,
  title           TEXT          NOT NULL,
  description     TEXT,
  cover_image_url TEXT,
  visibility      album_visibility DEFAULT 'private',
  share_token     TEXT          UNIQUE DEFAULT substring(md5(random()::text) || md5(random()::text), 1, 24),
  sort_order      INTEGER DEFAULT 0,
  is_default      BOOLEAN DEFAULT FALSE,  -- "Mi Wishlist" default album

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, slug)
);

ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own albums"
  ON public.albums FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public albums viewable by anyone"
  ON public.albums FOR SELECT
  USING (visibility = 'public' OR auth.uid() = user_id);

CREATE POLICY "Shared albums viewable by link"
  ON public.albums FOR SELECT
  USING (visibility IN ('public', 'shared_link') OR auth.uid() = user_id);

-- ============================================================
-- TABLE: album_items
-- Products added to albums
-- ============================================================
CREATE TABLE IF NOT EXISTS public.album_items (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id    UUID    NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  product_id  UUID    NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order  INTEGER DEFAULT 0,
  note        TEXT,
  added_at    TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(album_id, product_id)
);

ALTER TABLE public.album_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Album items follow album visibility"
  ON public.album_items FOR ALL
  USING (
    album_id IN (
      SELECT id FROM public.albums WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    album_id IN (
      SELECT id FROM public.albums WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public album items viewable"
  ON public.album_items FOR SELECT
  USING (
    album_id IN (
      SELECT id FROM public.albums WHERE visibility IN ('public', 'shared_link')
    )
  );

-- ============================================================
-- TRIGGER: Create default album on profile creation
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_default_album()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.albums (user_id, slug, title, description, is_default, visibility)
  VALUES (
    NEW.id,
    'mi-lista-de-deseos',
    'Mi Lista de Deseos',
    'Piezas que me han robado el aliento.',
    TRUE,
    'private'
  )
  ON CONFLICT (user_id, slug) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_album
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_default_album();

-- ============================================================
-- TABLE: recently_viewed
-- Product viewing history for personalization
-- ============================================================
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID    NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id  UUID    NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, product_id)
);

ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own history"
  ON public.recently_viewed FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABLE: product_reviews
-- Customer reviews for products they purchased
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id              UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID     NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id         UUID     NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_item_id   UUID     REFERENCES public.order_items(id),

  rating          INTEGER  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           TEXT,
  body            TEXT,
  images          TEXT[],  -- customer-uploaded photos

  is_verified_purchase BOOLEAN DEFAULT FALSE,
  is_approved     BOOLEAN DEFAULT FALSE,  -- moderated
  is_featured     BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, product_id, order_item_id)
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews viewable by everyone"
  ON public.product_reviews FOR SELECT
  USING (is_approved = TRUE);

CREATE POLICY "Users can create reviews for purchased products"
  ON public.product_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin manages all reviews"
  ON public.product_reviews FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_albums_user_id ON public.albums(user_id);
CREATE INDEX IF NOT EXISTS idx_albums_share_token ON public.albums(share_token);
CREATE INDEX IF NOT EXISTS idx_album_items_album_id ON public.album_items(album_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON public.recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at ON public.recently_viewed(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.product_reviews(rating);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 06: THE CIRCLE — Membership & Loyalty Program
-- ============================================================
-- Run AFTER 05_favorites_albums_reviews.sql

-- ============================================================
-- TABLE: circle_membership_history
-- Log of tier changes and milestone events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.circle_membership_history (
  id            UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type    TEXT     NOT NULL,  -- 'tier_upgrade', 'tier_downgrade', 'joined', 'points_added', 'milestone'
  from_tier     circle_tier,
  to_tier       circle_tier,
  points_delta  INTEGER DEFAULT 0,
  points_balance INTEGER,
  reason        TEXT,               -- e.g. "Compra MA-2025-0001"
  reference_id  UUID,               -- order_id, event_id, etc.
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.circle_membership_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own circle history"
  ON public.circle_membership_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manages circle history"
  ON public.circle_membership_history FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: circle_events
-- Exclusive events for THE CIRCLE members
-- ============================================================
CREATE TABLE IF NOT EXISTS public.circle_events (
  id              UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT     NOT NULL,
  description     TEXT,
  manifesto       TEXT,    -- brand storytelling for the event
  event_type      TEXT,    -- 'private_viewing', 'atelier_visit', 'trunk_show', 'virtual'
  location        TEXT,
  location_url    TEXT,    -- Google Maps or Zoom
  cover_image_url TEXT,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ,
  capacity        INTEGER,
  min_tier        circle_tier DEFAULT 'Observer',  -- minimum tier to see/attend
  is_active       BOOLEAN DEFAULT TRUE,
  is_featured     BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.circle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active events viewable by circle members"
  ON public.circle_events FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admin manages events"
  ON public.circle_events FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: circle_event_registrations
-- RSVP / attendance for THE CIRCLE events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.circle_event_registrations (
  id          UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id    UUID     NOT NULL REFERENCES public.circle_events(id) ON DELETE CASCADE,
  user_id     UUID     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'registered',  -- 'registered', 'confirmed', 'attended', 'cancelled'
  notes       TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, user_id)
);

ALTER TABLE public.circle_event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own event registrations"
  ON public.circle_event_registrations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABLE: circle_rewards
-- Redeemable rewards catalog
-- ============================================================
CREATE TABLE IF NOT EXISTS public.circle_rewards (
  id              UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT     NOT NULL,
  description     TEXT,
  reward_type     TEXT,    -- 'discount', 'free_shipping', 'exclusive_product', 'experience'
  points_cost     INTEGER  NOT NULL,
  discount_pct    NUMERIC(5,2),     -- if type = 'discount'
  min_tier        circle_tier DEFAULT 'Observer',
  is_active       BOOLEAN DEFAULT TRUE,
  stock           INTEGER,          -- NULL = unlimited
  expires_at      TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.circle_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active rewards viewable by members"
  ON public.circle_rewards FOR SELECT
  USING (is_active = TRUE);

-- ============================================================
-- TABLE: circle_reward_redemptions
-- History of redeemed rewards
-- ============================================================
CREATE TABLE IF NOT EXISTS public.circle_reward_redemptions (
  id              UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id       UUID     NOT NULL REFERENCES public.circle_rewards(id),
  points_spent    INTEGER  NOT NULL,
  redemption_code TEXT     UNIQUE DEFAULT upper(substring(md5(random()::text), 1, 12)),
  status          TEXT DEFAULT 'active',  -- 'active', 'used', 'expired'
  used_at         TIMESTAMPTZ,
  order_id        UUID     REFERENCES public.orders(id),
  redeemed_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.circle_reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own redemptions"
  ON public.circle_reward_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manages redemptions"
  ON public.circle_reward_redemptions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- FUNCTION: Update circle tier based on purchase history
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_circle_tier(p_user_id UUID)
RETURNS circle_tier
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_spent INTEGER;
  v_order_count INTEGER;
  v_new_tier    circle_tier;
  v_old_tier    circle_tier;
BEGIN
  -- Get purchase history
  SELECT
    COUNT(*),
    COALESCE(SUM(total_cents), 0)
  INTO v_order_count, v_total_spent
  FROM public.orders
  WHERE user_id = p_user_id AND status IN ('paid', 'processing', 'shipped', 'delivered');

  -- Determine new tier
  IF v_total_spent >= 250000000 OR v_order_count >= 20 THEN  -- $250,000+ MXN or 20+ orders
    v_new_tier := 'Eternal';
  ELSIF v_total_spent >= 2500000000 OR v_order_count >= 10 THEN  -- $25,000+ or 10+ orders
    v_new_tier := 'Keeper';
  ELSIF v_total_spent >= 1000000 OR v_order_count >= 3 THEN  -- $10,000+ or 3+ orders
    v_new_tier := 'Devotee';
  ELSIF v_order_count >= 1 THEN
    v_new_tier := 'Initiate';
  ELSE
    v_new_tier := 'Observer';
  END IF;

  -- Get current tier
  SELECT circle_tier INTO v_old_tier FROM public.profiles WHERE id = p_user_id;

  -- Update profile
  UPDATE public.profiles
  SET
    circle_tier = v_new_tier,
    is_circle_member = (v_new_tier != 'Observer'),
    circle_joined_at = CASE WHEN is_circle_member = FALSE AND v_new_tier != 'Observer'
                            THEN NOW() ELSE circle_joined_at END
  WHERE id = p_user_id;

  -- Log tier change if different
  IF v_new_tier != v_old_tier THEN
    INSERT INTO public.circle_membership_history (
      user_id, event_type, from_tier, to_tier,
      reason, points_balance
    )
    SELECT
      p_user_id,
      CASE WHEN v_new_tier > v_old_tier THEN 'tier_upgrade' ELSE 'tier_downgrade' END,
      v_old_tier, v_new_tier,
      'Actualización automática basada en historial de compras',
      circle_points
    FROM public.profiles WHERE id = p_user_id;
  END IF;

  RETURN v_new_tier;
END;
$$;

-- ============================================================
-- FUNCTION: Add Circle points and update tier
-- ============================================================
CREATE OR REPLACE FUNCTION public.award_circle_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE public.profiles
  SET circle_points = circle_points + p_points
  WHERE id = p_user_id
  RETURNING circle_points INTO v_new_balance;

  INSERT INTO public.circle_membership_history (
    user_id, event_type, points_delta, points_balance, reason, reference_id
  )
  VALUES (p_user_id, 'points_added', p_points, v_new_balance, p_reason, p_reference_id);

  -- Check for tier update
  PERFORM public.update_circle_tier(p_user_id);

  RETURN v_new_balance;
END;
$$;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_circle_history_user_id ON public.circle_membership_history(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_history_event_type ON public.circle_membership_history(event_type);
CREATE INDEX IF NOT EXISTS idx_circle_events_starts_at ON public.circle_events(starts_at);
CREATE INDEX IF NOT EXISTS idx_circle_registrations_user_id ON public.circle_event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_registrations_event_id ON public.circle_event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id ON public.circle_reward_redemptions(user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER circle_events_updated_at
  BEFORE UPDATE ON public.circle_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 07: Customization (Atelier) & Newsletter
-- ============================================================
-- Run AFTER 06_the_circle_membership.sql

-- ============================================================
-- TABLE: customization_requests
-- Bespoke / Atelier personalization requests
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customization_requests (
  id                  UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number      TEXT    UNIQUE NOT NULL DEFAULT 'ATL-' || upper(substring(md5(random()::text), 1, 8)),
  user_id             UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  base_product_id     UUID    REFERENCES public.products(id),

  -- Contact info (for guests without accounts)
  contact_name        TEXT    NOT NULL,
  contact_email       TEXT    NOT NULL,
  contact_phone       TEXT,
  contact_whatsapp    TEXT,

  -- Request details
  status              customization_status DEFAULT 'pending_review',
  request_type        TEXT,   -- 'personalization', 'bespoke', 'repair', 'resize', 'engraving'
  description         TEXT    NOT NULL,

  -- Piece details
  desired_material    TEXT,
  desired_stone       TEXT,
  desired_size        TEXT,
  engraving_text      TEXT,
  engraving_font      TEXT,
  occasion            TEXT,   -- e.g. "Boda", "Quinceañera"
  budget_cents        INTEGER,
  timeline_weeks      INTEGER,

  -- Reference images
  reference_images    TEXT[],

  -- Minerva's response
  minerva_notes       TEXT,
  quoted_price_cents  INTEGER,
  quote_expiry_at     TIMESTAMPTZ,
  approved_at         TIMESTAMPTZ,
  estimated_ready_at  DATE,
  actual_delivery_at  DATE,

  -- Linked order
  order_id            UUID    REFERENCES public.orders(id),

  -- Communication log
  communication_log   JSONB DEFAULT '[]',  -- [{role, message, timestamp}]

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customization_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own customization requests"
  ON public.customization_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create customization requests"
  ON public.customization_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin manages all customization requests"
  ON public.customization_requests FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: newsletter_subscriptions
-- Email marketing list with granular preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT    UNIQUE NOT NULL,
  user_id         UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  status          newsletter_status DEFAULT 'pending_confirmation',
  confirmation_token TEXT DEFAULT md5(random()::text) || md5(random()::text),
  confirmed_at    TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,

  -- Preferences
  topics          TEXT[],  -- ['nuevas colecciones', 'eventos', 'the circle', 'atelier']
  frequency       TEXT DEFAULT 'monthly',  -- 'weekly', 'monthly'
  first_name      TEXT,
  last_name       TEXT,

  -- Source tracking
  source          TEXT,   -- 'footer', 'popup', 'checkout', 'the_circle'
  utm_source      TEXT,
  utm_campaign    TEXT,

  -- Stats
  emails_sent     INTEGER DEFAULT 0,
  emails_opened   INTEGER DEFAULT 0,
  last_opened_at  TIMESTAMPTZ,
  last_clicked_at TIMESTAMPTZ,

  subscribed_at   TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Newsletter publicly insertable"
  ON public.newsletter_subscriptions FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users view own subscription"
  ON public.newsletter_subscriptions FOR SELECT
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admin manages newsletter"
  ON public.newsletter_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: contact_messages
-- General contact form submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT    NOT NULL,
  source      TEXT DEFAULT 'contact_form',  -- 'contact_form', 'whatsapp', 'atelier', 'circle'
  is_read     BOOLEAN DEFAULT FALSE,
  is_replied  BOOLEAN DEFAULT FALSE,
  replied_at  TIMESTAMPTZ,
  reply_notes TEXT,

  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Users view own messages"
  ON public.contact_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin manages contact messages"
  ON public.contact_messages FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: ai_concierge_sessions
-- Logs of AI Concierge conversations for personalization
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_concierge_sessions (
  id              UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_token   TEXT    NOT NULL,
  messages        JSONB DEFAULT '[]',  -- [{role, content, timestamp}]
  product_ids_shown TEXT[],           -- products the AI recommended
  resulting_cart_id UUID REFERENCES public.carts(id),
  resulting_order_id UUID REFERENCES public.orders(id),

  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_concierge_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own concierge sessions"
  ON public.ai_concierge_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages sessions"
  ON public.ai_concierge_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: promo_codes
-- Discount codes for promotions and THE CIRCLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id              UUID     PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            TEXT     UNIQUE NOT NULL,
  description     TEXT,
  discount_type   TEXT     NOT NULL,  -- 'percent', 'fixed'
  discount_value  NUMERIC(10,2) NOT NULL,
  min_order_cents INTEGER  DEFAULT 0,
  max_uses        INTEGER,            -- NULL = unlimited
  uses_count      INTEGER  DEFAULT 0,
  max_uses_per_user INTEGER DEFAULT 1,

  -- Targeting
  applicable_collections TEXT[],     -- NULL = all
  applicable_categories  TEXT[],
  min_circle_tier        circle_tier,

  -- Validity
  is_active       BOOLEAN  DEFAULT TRUE,
  starts_at       TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manages promo codes"
  ON public.promo_codes FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- TABLE: promo_code_uses
-- Track who used which promo code
-- ============================================================
CREATE TABLE IF NOT EXISTS public.promo_code_uses (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  promo_id    UUID    NOT NULL REFERENCES public.promo_codes(id),
  user_id     UUID    REFERENCES public.profiles(id),
  order_id    UUID    REFERENCES public.orders(id),
  discount_applied_cents INTEGER,
  used_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.promo_code_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manages promo uses"
  ON public.promo_code_uses FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_customization_requests_user_id ON public.customization_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_customization_requests_status ON public.customization_requests(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON public.newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER customization_requests_updated_at
  BEFORE UPDATE ON public.customization_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 08: Views, Functions & Analytics Helpers
-- ============================================================
-- Run AFTER 07_atelier_newsletter_promos.sql

-- ============================================================
-- VIEW: products_with_collection
-- Joins products with collection data
-- ============================================================
CREATE OR REPLACE VIEW public.v_products_with_collection AS
SELECT
  p.id,
  p.sku,
  p.slug,
  p.name,
  p.description,
  p.significado,
  p.price_cents,
  p.compare_at_price_cents,
  p.currency,
  p.category,
  p.collection_id,
  p.collection_name,
  c.slug AS collection_slug,
  c.theme_background AS collection_theme,
  c.image_url AS collection_image,
  p.materials,
  p.primary_material,
  p.purity,
  p.gender,
  p.occasions,
  p.style,
  p.is_featured,
  p.is_unique_piece,
  p.is_author_design,
  p.is_limited_edition,
  p.is_circle_exclusive,
  p.is_customizable,
  p.is_new_arrival,
  p.stock,
  p.stock_reserved,
  p.stock - p.stock_reserved AS stock_available,
  p.images,
  p.primary_image,
  p.available_sizes,
  p.seo_title,
  p.seo_description,
  p.created_at,
  p.updated_at
FROM public.products p
LEFT JOIN public.collections c ON c.id = p.collection_id
WHERE p.is_active = TRUE;

-- ============================================================
-- VIEW: v_user_dashboard
-- Aggregated user stats for the profile/dashboard
-- ============================================================
CREATE OR REPLACE VIEW public.v_user_dashboard AS
SELECT
  pr.id AS user_id,
  pr.email,
  pr.full_name,
  pr.display_name,
  pr.avatar_url,
  pr.circle_tier,
  pr.circle_points,
  pr.is_circle_member,
  pr.circle_joined_at,
  pr.circle_code,
  pr.newsletter_status,
  pr.preferred_collections,
  pr.ring_size,

  -- Order stats
  COALESCE(o.order_count, 0) AS total_orders,
  COALESCE(o.total_spent_cents, 0) AS total_spent_cents,

  -- Favorites count
  COALESCE(f.favorites_count, 0) AS favorites_count,

  -- Albums count
  COALESCE(al.albums_count, 0) AS albums_count,

  -- Customization requests
  COALESCE(cr.requests_count, 0) AS customization_requests_count,

  -- Addresses count
  COALESCE(addr.address_count, 0) AS address_count

FROM public.profiles pr

LEFT JOIN LATERAL (
  SELECT COUNT(*) AS order_count, SUM(total_cents) AS total_spent_cents
  FROM public.orders
  WHERE user_id = pr.id AND status NOT IN ('draft', 'cancelled')
) o ON TRUE

LEFT JOIN LATERAL (
  SELECT COUNT(*) AS favorites_count
  FROM public.favorites
  WHERE user_id = pr.id
) f ON TRUE

LEFT JOIN LATERAL (
  SELECT COUNT(*) AS albums_count
  FROM public.albums
  WHERE user_id = pr.id
) al ON TRUE

LEFT JOIN LATERAL (
  SELECT COUNT(*) AS requests_count
  FROM public.customization_requests
  WHERE user_id = pr.id
) cr ON TRUE

LEFT JOIN LATERAL (
  SELECT COUNT(*) AS address_count
  FROM public.addresses
  WHERE user_id = pr.id
) addr ON TRUE;

-- ============================================================
-- VIEW: v_order_history
-- Full order history with items for user-facing pages
-- ============================================================
CREATE OR REPLACE VIEW public.v_order_history AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.user_id,
  o.status,
  o.payment_method,
  o.subtotal_cents,
  o.discount_cents,
  o.shipping_cents,
  o.total_cents,
  o.currency,
  o.tracking_number,
  o.carrier,
  o.estimated_delivery,
  o.placed_at,
  o.delivered_at,
  o.is_gift,
  o.gift_message,
  o.points_earned,

  -- Shipping address
  o.shipping_name,
  o.shipping_city,
  o.shipping_state,

  -- Items as JSON array
  jsonb_agg(
    jsonb_build_object(
      'id', oi.id,
      'product_name', oi.product_name,
      'product_sku', oi.product_sku,
      'product_image', oi.product_image,
      'collection_name', oi.collection_name,
      'materials', oi.materials,
      'unit_price_cents', oi.unit_price_cents,
      'quantity', oi.quantity,
      'subtotal_cents', oi.subtotal_cents,
      'size_requested', oi.size_requested,
      'engraving_text', oi.engraving_text
    )
  ) AS items,

  COUNT(oi.id) AS item_count

FROM public.orders o
LEFT JOIN public.order_items oi ON oi.order_id = o.id
GROUP BY o.id;

-- ============================================================
-- VIEW: v_collection_stats
-- Collection-level analytics
-- ============================================================
CREATE OR REPLACE VIEW public.v_collection_stats AS
SELECT
  c.id,
  c.slug,
  c.name,
  c.is_featured,
  COUNT(p.id) AS product_count,
  SUM(p.stock) AS total_stock,
  MIN(p.price_cents) AS min_price_cents,
  MAX(p.price_cents) AS max_price_cents,
  COUNT(p.id) FILTER (WHERE p.is_featured) AS featured_products,
  COUNT(p.id) FILTER (WHERE p.is_unique_piece) AS unique_pieces
FROM public.collections c
LEFT JOIN public.products p ON p.collection_id = c.id AND p.is_active = TRUE
WHERE c.is_active = TRUE
GROUP BY c.id;

-- ============================================================
-- FUNCTION: Search products (full-text + filters)
-- ============================================================
CREATE OR REPLACE FUNCTION public.search_products(
  p_query TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_collection_slug TEXT DEFAULT NULL,
  p_min_price INTEGER DEFAULT NULL,
  p_max_price INTEGER DEFAULT NULL,
  p_material TEXT DEFAULT NULL,
  p_is_featured BOOLEAN DEFAULT NULL,
  p_is_circle_exclusive BOOLEAN DEFAULT FALSE,
  p_sort_by TEXT DEFAULT 'relevance',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  sku TEXT,
  slug TEXT,
  name TEXT,
  description TEXT,
  price_cents INTEGER,
  category product_category,
  collection_name TEXT,
  collection_slug TEXT,
  materials TEXT[],
  primary_image TEXT,
  images TEXT[],
  is_featured BOOLEAN,
  is_unique_piece BOOLEAN,
  is_circle_exclusive BOOLEAN,
  stock INTEGER,
  rank REAL
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.sku,
    p.slug,
    p.name,
    p.description,
    p.price_cents,
    p.category,
    p.collection_name,
    c.slug AS collection_slug,
    p.materials,
    p.primary_image,
    p.images,
    p.is_featured,
    p.is_unique_piece,
    p.is_circle_exclusive,
    p.stock,
    CASE WHEN p_query IS NOT NULL
      THEN ts_rank(
        to_tsvector('spanish', coalesce(p.name, '') || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.significado, '')),
        plainto_tsquery('spanish', p_query)
      )
      ELSE 1.0
    END AS rank
  FROM public.products p
  LEFT JOIN public.collections c ON c.id = p.collection_id
  WHERE
    p.is_active = TRUE
    AND (p_is_circle_exclusive = FALSE OR p.is_circle_exclusive = p_is_circle_exclusive)
    AND (p_query IS NULL OR
      to_tsvector('spanish', coalesce(p.name, '') || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.significado, ''))
      @@ plainto_tsquery('spanish', p_query)
    )
    AND (p_category IS NULL OR p.category::TEXT = p_category)
    AND (p_collection_slug IS NULL OR c.slug = p_collection_slug)
    AND (p_min_price IS NULL OR p.price_cents >= p_min_price)
    AND (p_max_price IS NULL OR p.price_cents <= p_max_price)
    AND (p_material IS NULL OR p_material = ANY(p.materials))
    AND (p_is_featured IS NULL OR p.is_featured = p_is_featured)
  ORDER BY
    CASE p_sort_by
      WHEN 'relevance' THEN -ts_rank(
        to_tsvector('spanish', coalesce(p.name, '') || ' ' || coalesce(p.description, '')),
        plainto_tsquery('spanish', coalesce(p_query, ''))
      )
      WHEN 'price_asc' THEN p.price_cents::FLOAT
      WHEN 'price_desc' THEN -p.price_cents::FLOAT
      WHEN 'newest' THEN EXTRACT(EPOCH FROM -p.published_at)
      WHEN 'featured' THEN CASE WHEN p.is_featured THEN 0 ELSE 1 END::FLOAT
      ELSE 0
    END
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- ============================================================
-- FUNCTION: Get personalized product recommendations
-- Based on user's purchase history and favorites
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 8
)
RETURNS TABLE (
  id UUID, slug TEXT, name TEXT, price_cents INTEGER,
  primary_image TEXT, collection_name TEXT, category product_category
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_preferred_collections TEXT[];
  v_preferred_materials TEXT[];
BEGIN
  -- Get user preferences
  SELECT preferred_collections, preferred_materials
  INTO v_preferred_collections, v_preferred_materials
  FROM public.profiles WHERE id = p_user_id;

  RETURN QUERY
  SELECT DISTINCT ON (p.id)
    p.id, p.slug, p.name, p.price_cents,
    p.primary_image, p.collection_name, p.category
  FROM public.products p
  WHERE
    p.is_active = TRUE
    AND p.stock > 0
    AND p.id NOT IN (
      -- Exclude already purchased
      SELECT DISTINCT oi.product_id FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE o.user_id = p_user_id AND o.status NOT IN ('cancelled', 'refunded')
    )
    AND (
      -- Prefer collections they like
      (v_preferred_collections IS NOT NULL AND p.collection_name = ANY(v_preferred_collections))
      OR
      -- Or materials they like
      (v_preferred_materials IS NOT NULL AND p.materials && v_preferred_materials)
      OR
      -- Or just featured products
      p.is_featured = TRUE
    )
  ORDER BY p.id, p.is_featured DESC, p.stock DESC
  LIMIT p_limit;
END;
$$;

-- ============================================================
-- FUNCTION: Track product view
-- ============================================================
CREATE OR REPLACE FUNCTION public.track_product_view(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_user_id IS NOT NULL THEN
    INSERT INTO public.recently_viewed (user_id, product_id, viewed_at)
    VALUES (p_user_id, p_product_id, NOW())
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET viewed_at = NOW();
  END IF;
END;
$$;

-- ============================================================
-- STORAGE BUCKETS CONFIG (Run in Supabase dashboard or via CLI)
-- ============================================================
-- NOTE: Execute these individually in Storage settings if needed
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('customer-uploads', 'customer-uploads', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true);

-- ============================================================
-- GRANT PERMISSIONS: Ensure anon role can read public data
-- ============================================================
GRANT SELECT ON public.v_products_with_collection TO anon, authenticated;
GRANT SELECT ON public.v_collection_stats TO anon, authenticated;
GRANT SELECT ON public.v_order_history TO authenticated;
GRANT SELECT ON public.v_user_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_products TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_product_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recommendations TO authenticated;
-- =====================================================================
-- 09_ERP_TABLES_AND_SHOWROOM.SQL
-- Minerva Alcaraz Joyería - ERP & Showroom System Migration
-- =====================================================================

-- 1. TIPOS ENUMERADOS ADICIONALES (Taxonomías Operativas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_joya') THEN
        CREATE TYPE tipo_joya AS ENUM (
            'Anillos', 'Collares', 'Pendientes', 'Piezas Únicas', 'Sets', 'Pulseras', 'Colecciones'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'coleccion_joya') THEN
        CREATE TYPE coleccion_joya AS ENUM (
            'Amatista', 'Chai', 'Escencia', 'Diseños de Autor', 'Piezas Únicas', 
            'Etérea', 'Serpientes', 'Floral', 'Ecos de la Tierra', 'Anillos de Piedras'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'material_joya') THEN
        CREATE TYPE material_joya AS ENUM (
            'Plata.925', 'Amatista Natural', 'Baño de Oro 24k', 'Oro 14k', 'Rubíes', 
            'Detalles en Oro 14k', 'Oro Amarillo 18k', 'Texturizado a mano', 'Plata Ley.950', 
            'Perla Negra de Tahití', 'Oro Blanco 14k', 'Zafiros Blancos', 'Ojos de Esmeralda', 
            'Centro de Citrino', 'Plata.950 Envejecida', 'Cuarzo Hialino'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'preferencia_joya') THEN
        CREATE TYPE preferencia_joya AS ENUM (
            'Piezas Únicas', 'Edición Limitada', 'Diseño de Autor'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_pedido') THEN
        CREATE TYPE status_pedido AS ENUM (
            'Recibido', 'En preparación', 'Elaboración', 'Enviando', 'Entregado', 'Devuelto'
        );
    END IF;
END
$$;

-- 2. TABLA MAESTRA DE PRODUCTOS (SI NO EXISTE)
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
    tipo tipo_joya NOT NULL,
    coleccion coleccion_joya NOT NULL,
    preferencia preferencia_joya NOT NULL,
    narrativa_emocional TEXT NOT NULL,
    detalles_tecnicos TEXT NOT NULL,
    caracteristicas_json JSONB DEFAULT '{"tallas": [], "colores": []}'::JSONB,
    sugeridos UUID[] DEFAULT '{}',
    disponible BOOLEAN DEFAULT TRUE,
    is_exclusive_circle BOOLEAN DEFAULT FALSE,
    seo_keywords VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. TABLA DE MATERIALES POR PRODUCTO
CREATE TABLE IF NOT EXISTS public.producto_materiales (
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    material material_joya NOT NULL,
    PRIMARY KEY (producto_id, material)
);

-- 4. TABLA DE IMÁGENES DE PRODUCTO
CREATE TABLE IF NOT EXISTS public.producto_imagenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    cloudinary_url TEXT NOT NULL,
    is_cover BOOLEAN DEFAULT FALSE,
    is_packaging BOOLEAN DEFAULT FALSE,
    hover_lifestyle_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. TABLA DE STOCK SERIALIZADO (Identificación Física Unívoca)
CREATE TABLE IF NOT EXISTS public.inventario_serializado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE RESTRICT,
    numero_serie_unico VARCHAR(100) UNIQUE NOT NULL, -- SKU-0001
    disponible BOOLEAN DEFAULT TRUE NOT NULL,
    ubicacion_fisica VARCHAR(100) DEFAULT 'Atelier Principal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. TABLA DE EVENTOS ANALÍTICOS (Métricas del Embudo)
CREATE TABLE IF NOT EXISTS public.eventos_analiticas (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tipo_evento VARCHAR(50) NOT NULL, -- 'vista_producto', 'add_to_cart', 'init_checkout', 'purchase'
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    metadatos JSONB DEFAULT '{}'::JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. TABLA DE SUSCRIPCIONES A NEWSLETTER
CREATE TABLE IF NOT EXISTS public.newsletter_suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. TABLA DE RECURSOS DE SHOWROOM (Salas o mesas físicas)
CREATE TABLE IF NOT EXISTS public.recursos_showroom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_recurso VARCHAR(100) NOT NULL, -- 'Mesa Principal de Diamantes', 'Cubículo Privado 1'
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. TABLA DE CITAS EN EL SHOWROOM (Planificador con prevención de solapamientos)
CREATE TABLE IF NOT EXISTS public.citas_showroom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recurso_id UUID REFERENCES public.recursos_showroom(id) ON DELETE RESTRICT,
    duracion_cita TSTZRANGE NOT NULL, -- Rango temporal de inicio y fin con zona horaria
    motivo_visita VARCHAR(255) NOT NULL,
    estatus_cita VARCHAR(50) DEFAULT 'Pendiente de confirmación', -- 'Confirmada', 'Completada', 'Cancelada'
    notas_asesor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. TABLA DE PEDIDOS PERSONALIZADOS DE CONCIERGE
CREATE TABLE IF NOT EXISTS public.pedidos_personalizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    sku_serializado VARCHAR(100) NOT NULL,
    monto_total DECIMAL(12, 2) NOT NULL,
    status_proceso status_pedido DEFAULT 'Recibido' NOT NULL,
    detalles_personalizacion JSONB NOT NULL, -- Talla, grabados, selección de gemas
    tiempo_estimado_entrega DATE,
    notas_artesano TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================================================================
-- INDEXACIÓN Y SOPORTE DE INDICES ESPACIALES (GIST)
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Eliminar restricción previa si existe para evitar duplicados
ALTER TABLE public.citas_showroom DROP CONSTRAINT IF EXISTS prevent_showroom_overlap;

-- Restricción de exclusión física temporal para evitar sobreventa de recursos en la misma hora
ALTER TABLE public.citas_showroom
ADD CONSTRAINT prevent_showroom_overlap
EXCLUDE USING gist (
    recurso_id WITH =,
    duracion_cita WITH &&
);

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_productos_sku ON public.productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_exclusive ON public.productos(is_exclusive_circle);
CREATE INDEX IF NOT EXISTS idx_inventario_serial_prod ON public.inventario_serializado(producto_id);
CREATE INDEX IF NOT EXISTS idx_citas_showroom_duracion ON public.citas_showroom USING GIST (duracion_cita);
CREATE INDEX IF NOT EXISTS idx_eventos_analiticas_tipo ON public.eventos_analiticas(tipo_evento, timestamp);

-- =====================================================================
-- CONFIGURACIÓN DE SEGURIDAD A NIVEL DE FILA (RLS)
-- =====================================================================
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_serializado ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas_showroom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recursos_showroom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_personalizados ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA PRODUCTOS
CREATE POLICY "Productos estándar visibles al público"
ON public.productos FOR SELECT
TO anon, authenticated
USING (is_exclusive_circle = FALSE);

CREATE POLICY "Catálogo exclusivo limitado a miembros The Circle"
ON public.productos FOR SELECT
TO authenticated
USING (
    is_exclusive_circle = TRUE 
    AND ( (SELECT auth.jwt() ->> 'membership') = 'the_circle' )
);

CREATE POLICY "Administradores poseen control total sobre productos"
ON public.productos FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );

-- POLÍTICAS PARA INVENTARIO SERIALIZADO
CREATE POLICY "Solo administradores ven inventario detallado"
ON public.inventario_serializado FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );

-- POLÍTICAS PARA CITAS SHOWROOM
CREATE POLICY "Clientes ven sus propias citas"
ON public.citas_showroom FOR SELECT
TO authenticated
USING ( cliente_id = auth.uid() );

CREATE POLICY "Clientes agendan sus propias citas"
ON public.citas_showroom FOR INSERT
TO authenticated
WITH CHECK ( cliente_id = auth.uid() );

CREATE POLICY "Administradores controlan todas las citas"
ON public.citas_showroom FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );

-- POLÍTICAS PARA PEDIDOS PERSONALIZADOS
CREATE POLICY "Clientes ven sus pedidos personalizados"
ON public.pedidos_personalizados FOR SELECT
TO authenticated
USING ( cliente_id = auth.uid() );

CREATE POLICY "Administradores controlan pedidos de concierge"
ON public.pedidos_personalizados FOR ALL
TO authenticated
USING ( (SELECT auth.jwt() ->> 'user_role') = 'admin' );
