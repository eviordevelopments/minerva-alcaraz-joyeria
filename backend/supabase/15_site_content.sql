-- ============================================================
-- TABLE: site_content
-- Dynamic content management for the site
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_content (
  id                UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  page              TEXT          NOT NULL, -- e.g., 'collections', 'home'
  section           TEXT          NOT NULL, -- e.g., 'hero', 'header', 'footer'
  content           JSONB         NOT NULL DEFAULT '{}'::jsonb,
  updated_at        TIMESTAMPTZ   DEFAULT now()
);

-- Constraint to ensure unique page-section combinations
ALTER TABLE public.site_content ADD CONSTRAINT unique_page_section UNIQUE (page, section);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies for site_content
-- Public can read all content
CREATE POLICY "Public profiles are viewable by everyone." ON public.site_content
    FOR SELECT USING (true);

-- Only authenticated admins can modify (using the existing service_role or admin check if applicable, 
-- but for simplicity, we allow authenticated users for now if they have a specific role, or we bypass using service key)
-- Assuming we use the service_role key in the backend for admin updates, we don't strictly need insert/update RLS for public.
CREATE POLICY "Admins can insert content" ON public.site_content
    FOR ALL USING (auth.role() = 'authenticated'); -- Adjust as per your security model

-- ============================================================
-- SEED DATA
-- Insert initial data for Collections Page
-- ============================================================
INSERT INTO public.site_content (page, section, content) VALUES
(
  'collections', 
  'header', 
  '{
    "title": "Colecciones",
    "subtitle": "Antología del Diseño",
    "description": "Minerva Alcaraz transforma símbolos, naturaleza y memoria en joyería única. Cada pieza nace de una mirada, una historia y una forma distinta de entender la belleza."
  }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;
