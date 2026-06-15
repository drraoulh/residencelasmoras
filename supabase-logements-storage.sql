-- Bucket Storage pour les photos des logements (URLs publiques, pas de base64 en base)
-- Exécuter dans Supabase → SQL Editor

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logements',
  'logements',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Logements storage public read" ON storage.objects;
DROP POLICY IF EXISTS "Logements storage admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Logements storage admin update" ON storage.objects;
DROP POLICY IF EXISTS "Logements storage admin delete" ON storage.objects;

CREATE POLICY "Logements storage public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logements');

CREATE POLICY "Logements storage admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logements');

CREATE POLICY "Logements storage admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logements')
WITH CHECK (bucket_id = 'logements');

CREATE POLICY "Logements storage admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logements');
