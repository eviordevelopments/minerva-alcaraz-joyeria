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
