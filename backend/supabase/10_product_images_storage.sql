-- ============================================================
-- MINERVA ALCARAZ JOYERÍA
-- Migration: Product Images Storage Bucket
-- Run this in Supabase SQL Editor or Dashboard > Storage
-- ============================================================

-- 1. Create the product-images storage bucket (public)
--    This must be run by a superuser / service_role
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,                            -- publicly readable without auth
  10485760,                        -- 10 MB per file
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 10485760;

-- 2. RLS Policies for product-images bucket
-- Allow public reads (anyone can view product images)
CREATE POLICY "Public read access on product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow service_role to insert/update/delete (admin uploads go through API route)
CREATE POLICY "Service role can upload product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Service role can update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images');

CREATE POLICY "Service role can delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- ============================================================
-- VERIFICATION
-- After running, confirm bucket exists:
--   SELECT * FROM storage.buckets WHERE name = 'product-images';
-- ============================================================
