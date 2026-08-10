-- ─── MIGRACIÓN 12: Agregar columna payment_link a la tabla products ────────────────
-- Fecha: 2026-07-30
-- Descripción: Agrega el campo opcional 'payment_link' para enlaces directos de pago (MercadoPago, Stripe, etc.)

ALTER TABLE products ADD COLUMN IF NOT EXISTS payment_link TEXT;

-- Comentario descriptivo
COMMENT ON COLUMN products.payment_link IS 'URL directa de pago (Stripe, MercadoPago, etc.) generada por la casa de orfebrería.';
