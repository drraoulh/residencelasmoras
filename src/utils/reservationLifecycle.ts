import type { Reservation, ReservationStatus } from '../types';
import { isBlockingReservation, type AvailabilitySlot } from './availability';

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Le séjour est terminé : la date de départ est passée ou est aujourd'hui (libération le jour du départ). */
export function isStayEnded(dateDepart: string, referenceDate = todayIso()) {
  return dateDepart <= referenceDate;
}

export function shouldAutoCompleteReservation(
  status: ReservationStatus,
  dateDepart: string,
  referenceDate = todayIso(),
) {
  return (status === 'confirmee' || status === 'en_cours') && isStayEnded(dateDepart, referenceDate);
}

/** Bloque encore le calendrier public : confirmée/en cours et départ pas encore passé. */
export function isReservationStillBlocking(
  reservation: Pick<Reservation, 'statut_reservation' | 'date_depart'>,
  referenceDate = todayIso(),
) {
  return (
    isBlockingReservation(reservation.statut_reservation) &&
    !isStayEnded(reservation.date_depart, referenceDate)
  );
}

export function filterActiveBlockingSlots<T extends AvailabilitySlot>(
  slots: T[],
  referenceDate = todayIso(),
) {
  return slots.filter((slot) => isReservationStillBlocking(slot, referenceDate));
}

export function reservationsToAutoComplete(
  reservations: Pick<Reservation, 'id' | 'statut_reservation' | 'date_depart'>[],
  referenceDate = todayIso(),
) {
  return reservations.filter((reservation) =>
    shouldAutoCompleteReservation(reservation.statut_reservation, reservation.date_depart, referenceDate),
  );
}
