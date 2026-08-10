-- ─── MIGRACIÓN 13: Soporte para Materiales y Gemas Dinámicos ────────────────────
-- Fecha: 2026-07-30
-- Descripción: Explicación y verificación de la columna 'materials' en Supabase products.

-- 1. Verificación del tipo de columna:
-- En PostgreSQL / Supabase, la columna 'materials' de la tabla 'products' es de tipo TEXT[] (arreglo de textos).
-- Esto significa que Soporta CUALQUIER texto de material (ej. 'Ágata Azul', 'Titanio', 'Fósil Orthocera')
-- sin necesidad de modificar el esquema ni alterar tipos enum de la base de datos.

-- Consulta para verificar que la columna exista con valor por defecto:
ALTER TABLE products ADD COLUMN IF NOT EXISTS materials TEXT[] NOT NULL DEFAULT '{}';

-- 2. (Opcional) Ejemplo de consulta SQL para buscar productos por un nuevo material dinámico:
-- SELECT id, name, sku, materials FROM products WHERE 'Ágata Azul' = ANY(materials);
