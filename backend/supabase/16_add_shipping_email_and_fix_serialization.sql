-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Migration
-- File 16: Add shipping_email to orders & Fix inventario_serializado foreign key
-- ============================================================

-- 1. Ensure shipping_email exists on orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_email TEXT;

-- 2. Index for quick lookups by payment_reference and shipping_email
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference ON public.orders(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_email ON public.orders(shipping_email);

-- 3. Fix inventario_serializado foreign key to point to real products table
-- First drop existing foreign key to productos if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'inventario_serializado_producto_id_fkey'
    ) THEN
        ALTER TABLE public.inventario_serializado 
        DROP CONSTRAINT inventario_serializado_producto_id_fkey;
    END IF;
END $$;

-- Re-point foreign key to public.products(id)
ALTER TABLE public.inventario_serializado
ADD CONSTRAINT inventario_serializado_producto_id_fkey
FOREIGN KEY (producto_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- 4. Enable RLS and add public service role management
ALTER TABLE public.inventario_serializado ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages inventario_serializado" ON public.inventario_serializado;
CREATE POLICY "Service role manages inventario_serializado"
ON public.inventario_serializado FOR ALL
USING (auth.role() = 'service_role');
