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
