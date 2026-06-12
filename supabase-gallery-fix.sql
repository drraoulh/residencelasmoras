-- Correctif galerie admin — à exécuter dans Supabase SQL Editor
-- (après supabase-gallery.sql si pas encore fait)

-- 1. Table (au cas où)
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

-- 2. Droits explicites (souvent oubliés)
GRANT SELECT ON public.gallery_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;

-- 3. RLS — politiques séparées (plus fiable que FOR ALL)
DROP POLICY IF EXISTS "Gallery visible publiquement" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins gerent la galerie" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery public select visible" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery admin select all" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery admin insert" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery admin update" ON public.gallery_images;
DROP POLICY IF EXISTS "Gallery admin delete" ON public.gallery_images;

-- Visiteurs : photos visibles uniquement
CREATE POLICY "Gallery public select visible"
ON public.gallery_images FOR SELECT
TO anon
USING (visible = true);

-- Admin connecté : voit tout (y compris masqué)
CREATE POLICY "Gallery admin select all"
ON public.gallery_images FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Gallery admin insert"
ON public.gallery_images FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Gallery admin update"
ON public.gallery_images FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Gallery admin delete"
ON public.gallery_images FOR DELETE
TO authenticated
USING (true);

CREATE INDEX IF NOT EXISTS gallery_images_sort_idx
ON public.gallery_images (sort_order ASC, created_at DESC);

-- 4. Bucket Storage
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

-- 5. Storage RLS
DROP POLICY IF EXISTS "Gallery storage public read" ON storage.objects;
DROP POLICY IF EXISTS "Gallery storage admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Gallery storage admin update" ON storage.objects;
DROP POLICY IF EXISTS "Gallery storage admin delete" ON storage.objects;

CREATE POLICY "Gallery storage public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');

CREATE POLICY "Gallery storage admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Gallery storage admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery')
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Gallery storage admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
