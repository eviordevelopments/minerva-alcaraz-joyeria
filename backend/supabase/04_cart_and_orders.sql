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
