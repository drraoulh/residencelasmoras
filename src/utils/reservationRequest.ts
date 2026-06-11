import { supabase } from '../lib/supabaseClient';
import type { Logement } from '../types';
import {
  addDays,
  getEffectiveDepart,
  getLogementAvailability,
  getUnavailableMessage,
  type AvailabilitySlot,
} from './availability';
import { buildConfirmNotes, createConfirmToken } from './confirmReservation';
import { countNights } from './helpers';
import { todayIso } from './reservationLifecycle';

export class ReservationUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReservationUnavailableError';
  }
}

async function fetchAvailabilityForLogement(logementId: string) {
  const [{ data: logement, error: logementError }, { data: slots, error: slotsError }] =
    await Promise.all([
      supabase.from('logements').select('id, statut').eq('id', logementId).single(),
      supabase
        .from('reservations')
        .select('logement_id, date_arrivee, date_depart, statut_reservation')
        .eq('logement_id', logementId)
        .in('statut_reservation', ['confirmee', 'en_cours'])
        .gt('date_depart', todayIso()),
    ]);

  if (logementError) throw logementError;
  if (slotsError) throw slotsError;

  return {
    logement: logement as Pick<Logement, 'id' | 'statut'>,
    slots: (slots ?? []) as AvailabilitySlot[],
  };
}

export async function assertReservationAvailable(
  logementId: string,
  dateArrivee: string,
  dateDepart?: string,
  cached?: { logement: Pick<Logement, 'id' | 'statut'>; slots: AvailabilitySlot[] },
) {
  const { logement, slots } = cached ?? (await fetchAvailabilityForLogement(logementId));
  const availability = getLogementAvailability(
    logement as Logement,
    slots,
    dateArrivee,
    dateDepart,
  );

  if (!availability.available) {
    throw new ReservationUnavailableError(getUnavailableMessage(availability));
  }
}

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
  await assertReservationAvailable(input.logementId, input.dateArrivee, input.dateDepart);

  const effectiveDepart = getEffectiveDepart(input.dateArrivee, input.dateDepart);
  const nombreNuits = countNights(input.dateArrivee, effectiveDepart);
  const clientNom = [input.prenom.trim(), input.nom.trim()].filter(Boolean).join(' ');
  const confirmToken = createConfirmToken();
  const reservationId = crypto.randomUUID();

  // Pas de .select() après insert : le rôle anon peut insérer une « demande »
  // mais ne peut pas la relire (RLS), ce qui provoquait une erreur 401 en ligne.
  const { error } = await supabase.from('reservations').insert({
    id: reservationId,
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
  });

  if (error) throw error;
  return { id: reservationId, confirmToken };
}

export function defaultDepartFromArrivee(dateArrivee: string) {
  return addDays(dateArrivee, 1);
}
