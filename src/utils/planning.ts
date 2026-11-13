import type { Logement, Reservation, ReservationStatus } from '../types';
import { addDays, getLogementAvailability, type AvailabilitySlot } from './availability';
import { rangesOverlap } from './helpers';
import { todayIso } from './reservationLifecycle';

export type DayCellStatus = 'libre' | 'reserve' | 'demande' | 'maintenance' | 'occupe' | 'terminee';

const ACTIVE_RESERVATION_STATUSES: ReservationStatus[] = ['demande', 'confirmee', 'en_cours'];

export const dayStatusLabels: Record<DayCellStatus, string> = {
  libre: 'Libre',
  reserve: 'Réservé',
  demande: 'Demande',
  maintenance: 'Maintenance',
  occupe: 'Occupé',
  terminee: 'Terminé',
};

export function buildDayRange(start: string, endInclusive: string, maxDays = 45) {
  const days: string[] = [];
  let cursor = start;

  while (cursor <= endInclusive && days.length < maxDays) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}

export function reservationCoversDay(reservation: Pick<Reservation, 'date_arrivee' | 'date_depart'>, day: string) {
  return rangesOverlap(day, addDays(day, 1), reservation.date_arrivee, reservation.date_depart);
}

export function getReservationOnDay(
  logementId: string,
  day: string,
  reservations: Pick<Reservation, 'logement_id' | 'date_arrivee' | 'date_depart' | 'statut_reservation' | 'client_nom' | 'id'>[],
) {
  const today = todayIso();

  return reservations.find((reservation) => {
    if (reservation.logement_id !== logementId) return false;
    if (reservation.statut_reservation === 'annulee') return false;
    if (!reservationCoversDay(reservation, day)) return false;

    if (day >= today) {
      if (!ACTIVE_RESERVATION_STATUSES.includes(reservation.statut_reservation)) return false;
      if (reservation.date_depart <= day) return false;
    }

    return true;
  });
}

export function getDayCellStatus(
  logement: Logement,
  day: string,
  reservations: Pick<Reservation, 'logement_id' | 'date_arrivee' | 'date_depart' | 'statut_reservation' | 'client_nom' | 'id'>[],
): { status: DayCellStatus; reservation?: (typeof reservations)[number] } {
  if (logement.statut === 'maintenance') {
    return { status: 'maintenance' };
  }

  const reservation = getReservationOnDay(logement.id, day, reservations);
  if (reservation) {
    if (reservation.statut_reservation === 'demande') {
      return { status: 'demande', reservation };
    }
    if (reservation.statut_reservation === 'terminee') {
      return { status: 'terminee', reservation };
    }
    return { status: 'reserve', reservation };
  }

  if (logement.statut === 'occupe') {
    return { status: 'occupe' };
  }

  return { status: 'libre' };
}

export interface PeriodMatrixRow {
  logement: Logement;
  cells: Array<{
    day: string;
    status: DayCellStatus;
    reservation?: Pick<Reservation, 'id' | 'client_nom' | 'statut_reservation' | 'date_arrivee' | 'date_depart'>;
  }>;
}

export function buildPeriodMatrix(
  logements: Logement[],
  reservations: Reservation[],
  start: string,
  endInclusive: string,
): { days: string[]; rows: PeriodMatrixRow[] } {
  const days = buildDayRange(start, endInclusive);
  const rows = logements.map((logement) => ({
    logement,
    cells: days.map((day) => {
      const { status, reservation } = getDayCellStatus(logement, day, reservations);
      return { day, status, reservation };
    }),
  }));

  return { days, rows };
}

export function summarizePeriodMatrix(rows: PeriodMatrixRow[]) {
  const totalCells = rows.reduce((sum, row) => sum + row.cells.length, 0);
  const reserved = rows.reduce(
    (sum, row) => sum + row.cells.filter((cell) => cell.status === 'reserve').length,
    0,
  );
  const demandes = rows.reduce(
    (sum, row) => sum + row.cells.filter((cell) => cell.status === 'demande').length,
    0,
  );
  const libres = rows.reduce(
    (sum, row) => sum + row.cells.filter((cell) => cell.status === 'libre').length,
    0,
  );
  const occupancyRate = totalCells ? Math.round((reserved / totalCells) * 100) : 0;

  return { totalCells, reserved, demandes, libres, occupancyRate };
}

export function reservationsInPeriod(reservations: Reservation[], start: string, endInclusive: string) {
  const periodEnd = addDays(endInclusive, 1);
  return reservations.filter(
    (reservation) =>
      reservation.statut_reservation !== 'annulee' &&
      rangesOverlap(start, periodEnd, reservation.date_arrivee, reservation.date_depart),
  );
}

export function buildDailyReport(
  reservations: Reservation[],
  days: string[],
) {
  return days.map((day) => {
    const dayReservations = reservations.filter(
      (reservation) =>
        reservation.statut_reservation !== 'annulee' &&
        reservationCoversDay(reservation, day),
    );
    const confirmed = dayReservations.filter((r) =>
      ['confirmee', 'en_cours'].includes(r.statut_reservation),
    );
    const demandes = dayReservations.filter((r) => r.statut_reservation === 'demande');

    return {
      day,
      total: dayReservations.length,
      confirmed: confirmed.length,
      demandes: demandes.length,
      revenue: confirmed.reduce((sum, r) => sum + Number(r.montant_paye), 0),
      expected: dayReservations.reduce((sum, r) => sum + Number(r.montant_total), 0),
    };
  });
}

export function findAvailableLogements(
  logements: Logement[],
  slots: AvailabilitySlot[],
  arrivee: string,
  depart?: string,
  excludeLogementId?: string,
) {
  return logements.filter((logement) => {
    if (excludeLogementId && logement.id === excludeLogementId) return false;
    return getLogementAvailability(logement, slots, arrivee, depart).available;
  });
}
