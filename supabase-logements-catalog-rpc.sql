-- Catalogue public léger : exclut les photos base64 (souvent plusieurs Mo par logement).
-- À exécuter dans le SQL Editor Supabase.

CREATE OR REPLACE FUNCTION public.get_logements_catalog()
RETURNS TABLE (
  id UUID,
  nom TEXT,
  type TEXT,
  prix NUMERIC,
  statut TEXT,
  equipements TEXT[],
  surface INTEGER,
  created_at TIMESTAMPTZ,
  cover_photo TEXT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    l.id,
    l.nom,
    l.type,
    l.prix,
    l.statut,
    l.equipements,
    l.surface,
    l.created_at,
    (
      SELECT p
      FROM unnest(l.photos) AS p
      WHERE p IS NOT NULL
        AND btrim(p) <> ''
        AND length(p) < 8192
        AND p NOT LIKE 'data:%'
        AND (
          p LIKE 'http://%'
          OR p LIKE 'https://%'
          OR p LIKE '/%'
          OR p LIKE '%/storage/v1/object/public/%'
        )
      LIMIT 1
    ) AS cover_photo
  FROM public.logements l
  ORDER BY l.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_logement_public(p_id UUID)
RETURNS TABLE (
  id UUID,
  nom TEXT,
  type TEXT,
  prix NUMERIC,
  description TEXT,
  statut TEXT,
  equipements TEXT[],
  surface INTEGER,
  created_at TIMESTAMPTZ,
  photos TEXT[]
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    l.id,
    l.nom,
    l.type,
    l.prix,
    l.description,
    l.statut,
    l.equipements,
    l.surface,
    l.created_at,
    COALESCE(
      (
        SELECT array_agg(p ORDER BY ord)
        FROM (
          SELECT p, row_number() OVER () AS ord
          FROM unnest(l.photos) AS p
          WHERE p IS NOT NULL
            AND btrim(p) <> ''
            AND length(p) < 8192
            AND p NOT LIKE 'data:%'
            AND (
              p LIKE 'http://%'
              OR p LIKE 'https://%'
              OR p LIKE '/%'
              OR p LIKE '%/storage/v1/object/public/%'
            )
          LIMIT 12
        ) filtered
      ),
      ARRAY[]::TEXT[]
    ) AS photos
  FROM public.logements l
  WHERE l.id = p_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_logements_catalog() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_logement_public(UUID) TO anon, authenticated;
