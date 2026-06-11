-- Schema initial pour Residence Las Moras

-- 1. Table Logements
CREATE TABLE public.logements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nom TEXT NOT NULL,
    type TEXT NOT NULL,
    prix NUMERIC NOT NULL,
    description TEXT,
    statut TEXT DEFAULT 'disponible',
    photos TEXT[] DEFAULT '{}',
    surface INTEGER,
    equipements TEXT[] DEFAULT '{}'
);

-- 2. Table Reservations
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logement_id UUID REFERENCES public.logements(id) ON DELETE CASCADE,
    client_nom TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_telephone TEXT NOT NULL,
    date_arrivee DATE NOT NULL,
    date_depart DATE NOT NULL,
    nombre_nuits INTEGER NOT NULL,
    montant_total NUMERIC NOT NULL,
    montant_paye NUMERIC DEFAULT 0,
    methode_paiement TEXT,
    statut_paiement TEXT DEFAULT 'non_paye',
    statut_reservation TEXT DEFAULT 'demande',
    notes TEXT
);

-- 3. Table Contacts
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    sujet TEXT NOT NULL,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT false
);

-- 4. Row Level Security (RLS)
ALTER TABLE public.logements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Logements publics (catalogue)
CREATE POLICY "Logements visibles par tous"
ON public.logements FOR SELECT USING (true);

CREATE POLICY "Admins peuvent modifier les logements"
ON public.logements FOR ALL USING (auth.role() = 'authenticated');

-- Reservations
CREATE POLICY "Tout le monde peut creer une reservation"
ON public.reservations FOR INSERT WITH CHECK (true);

CREATE POLICY "Consultation publique des disponibilites"
ON public.reservations FOR SELECT
USING (statut_reservation IN ('confirmee', 'en_cours'));

CREATE POLICY "Admins gerent les reservations"
ON public.reservations FOR ALL USING (auth.role() = 'authenticated');

-- Contacts
CREATE POLICY "Tout le monde peut envoyer un message"
ON public.contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins gerent les messages"
ON public.contacts FOR ALL USING (auth.role() = 'authenticated');

-- Confirmation WhatsApp : lien securise sans connexion admin
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
