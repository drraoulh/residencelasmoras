import type { Logement, Reservation, ReservationStatus } from '../types';
import { rangesOverlap } from './helpers';

export type AvailabilitySlot = Pick<
  Reservation,
  'logement_id' | 'date_arrivee' | 'date_depart' | 'statut_reservation'
>;

export interface AvailabilityResult {
  available: boolean;
  reason?: 'Maintenance' | 'Réservé' | 'Occupé' | 'Demande en attente';
  nextAvailableFrom?: string;
  blockingUntil?: string;
}

/** Bloque le calendrier public uniquement après confirmation (lien WhatsApp ou admin) */
export function isBlockingReservation(status: ReservationStatus) {
  return status === 'confirmee' || status === 'en_cours';
}

export function formatDateFr(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function addDays(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getBlockingSlotsForLogement(logementId: string, slots: AvailabilitySlot[]) {
  return slots
    .filter(
      (slot) =>
        slot.logement_id === logementId && isBlockingReservation(slot.statut_reservation),
    )
    .sort((a, b) => a.date_arrivee.localeCompare(b.date_arrivee));
}

export function formatSearchPeriod(dateArrivee: string, dateDepart?: string) {
  if (!dateDepart) return `À partir du ${formatDateFr(dateArrivee)}`;
  return `Du ${formatDateFr(dateArrivee)} au ${formatDateFr(dateDepart)}`;
}

export function getEffectiveDepart(dateArrivee: string, dateDepart?: string) {
  if (dateDepart && dateDepart > dateArrivee) return dateDepart;
  return addDays(dateArrivee, 1);
}

export function getLogementAvailability(
  logement: Logement,
  slots: AvailabilitySlot[],
  dateArrivee: string,
  dateDepart?: string,
): AvailabilityResult {
  if (logement.statut === 'maintenance') {
    return { available: false, reason: 'Maintenance' };
  }

  const effectiveDepart = getEffectiveDepart(dateArrivee, dateDepart);
  const blockingSlots = getBlockingSlotsForLogement(logement.id, slots);
  const conflict = blockingSlots.find((slot) =>
    rangesOverlap(dateArrivee, effectiveDepart, slot.date_arrivee, slot.date_depart),
  );

  if (!conflict) {
    if (logement.statut === 'occupe') {
      const nextFrom = getNextAvailableArrival(logement, slots, dateArrivee);
      if (nextFrom && nextFrom <= dateArrivee) {
        return { available: true };
      }
      return {
        available: false,
        reason: 'Occupé',
        nextAvailableFrom: nextFrom ?? undefined,
        blockingUntil: nextFrom ?? undefined,
      };
    }
    return { available: true };
  }

  return {
    available: false,
    reason: 'Réservé',
    nextAvailableFrom: conflict.date_depart,
    blockingUntil: conflict.date_depart,
  };
}

export function getNextAvailableArrival(
  logement: Logement,
  slots: AvailabilitySlot[],
  fromDate: string,
): string | null {
  if (logement.statut === 'maintenance') return null;

  let cursor = fromDate;
  const blockingSlots = getBlockingSlotsForLogement(logement.id, slots);

  for (let day = 0; day < 366; day += 1) {
    const conflict = blockingSlots.find((slot) =>
      rangesOverlap(cursor, addDays(cursor, 1), slot.date_arrivee, slot.date_depart),
    );

    if (!conflict) return cursor;

    const nextCursor = conflict.date_depart > cursor ? conflict.date_depart : addDays(cursor, 1);
    if (nextCursor === cursor) return addDays(cursor, 1);
    cursor = nextCursor;
  }

  return null;
}

export function buildCatalogueSearchParams({
  type,
  arrivee,
  depart,
}: {
  type?: string;
  arrivee?: string;
  depart?: string;
}) {
  const params = new URLSearchParams();
  if (type && type !== 'Tous') params.set('type', type);
  if (arrivee) params.set('arrivee', arrivee);
  if (depart) params.set('depart', depart);
  return params;
}
