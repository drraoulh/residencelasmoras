-- À exécuter dans Supabase SQL Editor (projet existant)
-- Permet de confirmer une réservation via le lien WhatsApp sans ouvrir l'admin

CREATE OR REPLACE FUNCTION public.confirm_reservation_by_token(
  p_reservation_id UUID,
  p_token TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.reservations
  SET statut_reservation = 'confirmee',
      notes = COALESCE(notes, '') || E'\nConfirmée via lien WhatsApp.'
  WHERE id = p_reservation_id
    AND statut_reservation = 'demande'
    AND notes LIKE '%confirm:' || p_token || '%';

  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.confirm_reservation_by_token(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.confirm_reservation_by_token(UUID, TEXT) TO authenticated;
