-- Optionnel : si vous voulez que le rôle public puisse relire les demandes après insert.
-- Le correctif applicatif (ID généré côté client) rend ce script non obligatoire.

DROP POLICY IF EXISTS "Consultation publique des disponibilites" ON public.reservations;

CREATE POLICY "Consultation publique des disponibilites"
ON public.reservations FOR SELECT
USING (statut_reservation IN ('confirmee', 'en_cours'));

-- Les demandes WhatsApp restent visibles uniquement dans l'admin (authentifié).
