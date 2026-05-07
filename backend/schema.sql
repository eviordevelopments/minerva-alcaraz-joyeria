-- Minerva Alcaraz Joyería: Production Database Schema
-- Focus: Collections, Unique Pieces, and THE CIRCLE Membership

-- 1. Collections (Manifiestos Artísticos)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  manifesto TEXT, -- Poetic narrative
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products (Unique Pieces)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_cents INTEGER NOT NULL, -- Stored in cents for precision
  material TEXT, -- Oro 24k, Plata .925, etc.
  weight_grams NUMERIC,
  gemstone_origin TEXT,
  stock INTEGER DEFAULT 1, -- Usually 1 for unique pieces
  metadata JSONB DEFAULT '{}', -- Technical details (carats, cuts)
  is_exclusive_circle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. The Circle Members (Profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  membership_level TEXT DEFAULT 'GUEST', -- GUEST, CIRCLE, LEGACY
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Audit Log (Heritage Preservation)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Security Sentinel)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Read policies: Everyone can see collections and non-exclusive products
CREATE POLICY "Public collections are viewable by everyone" ON collections FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (NOT is_exclusive_circle);

-- Circle policy: Only members can see exclusive products
CREATE POLICY "Circle products viewable by members" ON products FOR SELECT 
  USING (is_exclusive_circle AND (SELECT membership_level FROM profiles WHERE id = auth.uid()) IN ('CIRCLE', 'LEGACY'));
