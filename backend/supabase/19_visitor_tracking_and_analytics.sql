-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 19: Visitor Tracking & Financial Analytics Support
-- ============================================================

-- 1. Ensure visitor logs section exists in site_content
INSERT INTO public.site_content (page, section, content, updated_at)
VALUES (
  'analytics',
  'visitor_logs',
  '{
    "visits": [],
    "total_pageviews": 0,
    "unique_devices": 0
  }'::jsonb,
  now()
)
ON CONFLICT (page, section) DO NOTHING;

-- 2. Index for orders financial queries
CREATE INDEX IF NOT EXISTS idx_orders_status_placed_at ON public.orders(status, placed_at);
CREATE INDEX IF NOT EXISTS idx_orders_total_cents ON public.orders(total_cents);
