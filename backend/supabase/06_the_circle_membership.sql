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
  redemption_code TEXT     UNIQUE DEFAULT upper(encode(gen_random_bytes(6), 'hex')),
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
