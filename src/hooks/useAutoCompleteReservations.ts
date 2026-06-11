import { useEffect, useRef } from 'react';
import { reservationsToAutoComplete } from '../utils/reservationLifecycle';
import { useReservations } from './useReservations';

/** Passe automatiquement en « terminée » les séjours dont la date de départ est passée. */
export function useAutoCompleteReservations() {
  const { reservations, updateReservation } = useReservations();
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const toComplete = reservationsToAutoComplete(reservations).filter(
      (reservation) => !processedRef.current.has(reservation.id),
    );

    if (toComplete.length === 0) return;

    toComplete.forEach((reservation) => {
      processedRef.current.add(reservation.id);
      updateReservation.mutate({
        id: reservation.id,
        updates: { statut_reservation: 'terminee' },
      });
    });
  }, [reservations, updateReservation]);
}
