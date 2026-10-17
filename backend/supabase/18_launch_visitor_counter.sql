-- ============================================================
-- MINERVA ALCARAZ JOYERÍA — Supabase Schema
-- File 18: Launch Visitor Counter & Celebration Setup
-- ============================================================
-- Fecha de lanzamiento programado: Viernes 16 de Octubre de 2026 a las 5:00 PM CST (17:00:00-06:00)

-- 1. Asegurar registro inicial en site_content para el evento de inauguración
INSERT INTO public.site_content (page, section, content, updated_at)
VALUES (
  'launch',
  'counter',
  '{
    "launch_date": "2026-10-16T17:00:00-06:00",
    "total_visitors": 1,
    "event_name": "Lanzamiento Minerva Alcaraz Joyería"
  }'::jsonb,
  now()
)
ON CONFLICT (page, section) DO NOTHING;

-- 2. Tabla opcional de alta concurrencia para registro analítico de visitantes inaugurales
CREATE TABLE IF NOT EXISTS public.launch_visitors (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_uuid      TEXT          NOT NULL UNIQUE,
  visitor_number    BIGINT        NOT NULL,
  ip_address        TEXT,
  user_agent        TEXT,
  created_at        TIMESTAMPTZ   DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.launch_visitors ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública para consultar el contador
CREATE POLICY "Public read launch visitors count"
  ON public.launch_visitors
  FOR SELECT
  USING (true);

-- Política de inserción para servicio
CREATE POLICY "Service role insert launch visitors"
  ON public.launch_visitors
  FOR ALL
  USING (auth.role() = 'service_role');
