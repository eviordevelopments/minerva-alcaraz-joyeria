-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 17: Add requires_shipping flag to products table
-- ============================================================

-- 1. Add requires_shipping column to products
-- Defaults to TRUE (all pieces charge standard shipping unless manually deactivated)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT TRUE;

-- 2. Add helpful documentation comment
COMMENT ON COLUMN public.products.requires_shipping IS 'Determina si la pieza requiere cobro y despacho de envío ($200 MXN o cortesía según monto) o si el envío está desactivado manualmente ($0 MXN para retiro en showroom o entrega digital).';

-- 3. Create index for fast lookups if filtering by requires_shipping
CREATE INDEX IF NOT EXISTS idx_products_requires_shipping ON public.products(requires_shipping);
