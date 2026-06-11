-- Galerie photos — table, RLS, bucket Storage
-- Exécuter dans Supabase → SQL Editor

-- 1. Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Résidence', 'Intérieurs', 'Ambiance')),
  image_url TEXT NOT NULL,
  storage_path TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery visible publiquement" ON public.gallery_images;
CREATE POLICY "Gallery visible publiquement"
ON public.gallery_images FOR SELECT
USING (visible = true);

DROP POLICY IF EXISTS "Admins gerent la galerie" ON public.gallery_images;
CREATE POLICY "Admins gerent la galerie"
ON public.gallery_images FOR ALL
USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS gallery_images_sort_idx
ON public.gallery_images (sort_order ASC, created_at DESC);

-- 2. Bucket Storage (images uploadées)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Gallery storage public read" ON storage.objects;
CREATE POLICY "Gallery storage public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Gallery storage admin insert" ON storage.objects;
CREATE POLICY "Gallery storage admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Gallery storage admin update" ON storage.objects;
CREATE POLICY "Gallery storage admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Gallery storage admin delete" ON storage.objects;
CREATE POLICY "Gallery storage admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
