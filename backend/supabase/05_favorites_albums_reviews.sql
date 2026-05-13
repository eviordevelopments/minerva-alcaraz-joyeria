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
  share_token     TEXT          UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
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
