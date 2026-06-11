import { supabase } from '../lib/supabaseClient';
import { addDays, getEffectiveDepart } from './availability';
import { buildConfirmNotes, createConfirmToken } from './confirmReservation';
import { countNights } from './helpers';

export interface ReservationRequestInput {
  logementId: string;
  logementNom: string;
  prenom: string;
  nom: string;
  email?: string;
  telephone: string;
  dateArrivee: string;
  dateDepart?: string;
  prixParNuit: number;
}

export async function createReservationRequest(input: ReservationRequestInput) {
  const effectiveDepart = getEffectiveDepart(input.dateArrivee, input.dateDepart);
  const nombreNuits = countNights(input.dateArrivee, effectiveDepart);
  const clientNom = [input.prenom.trim(), input.nom.trim()].filter(Boolean).join(' ');
  const confirmToken = createConfirmToken();

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      logement_id: input.logementId,
      client_nom: clientNom,
      client_email: input.email?.trim() || 'via-whatsapp@lasmoras.local',
      client_telephone: input.telephone.trim(),
      date_arrivee: input.dateArrivee,
      date_depart: effectiveDepart,
      nombre_nuits: nombreNuits,
      montant_total: input.prixParNuit * nombreNuits,
      montant_paye: 0,
      methode_paiement: 'mobile_money',
      statut_paiement: 'non_paye',
      statut_reservation: 'demande',
      notes: buildConfirmNotes(input.logementNom, confirmToken),
    })
    .select('id')
    .single();

  if (error) throw error;
  return { ...data, confirmToken };
}

export function defaultDepartFromArrivee(dateArrivee: string) {
  return addDays(dateArrivee, 1);
}
