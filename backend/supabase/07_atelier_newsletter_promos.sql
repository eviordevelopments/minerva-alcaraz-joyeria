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
  request_number      TEXT    UNIQUE NOT NULL DEFAULT 'ATL-' || upper(encode(gen_random_bytes(4), 'hex')),
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
  confirmation_token TEXT DEFAULT encode(gen_random_bytes(32), 'hex'),
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
