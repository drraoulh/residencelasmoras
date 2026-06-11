import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import PlanningGrid from '../../components/admin/PlanningGrid';
import { useLogements } from '../../hooks/useLogements';
import { useReservations } from '../../hooks/useReservations';
import { addDays, formatDateFr } from '../../utils/availability';
import {
  buildPeriodMatrix,
  reservationsInPeriod,
  summarizePeriodMatrix,
} from '../../utils/planning';
import { rangesOverlap } from '../../utils/helpers';
import { isReservationStillBlocking, isStayEnded } from '../../utils/reservationLifecycle';

type ViewMode = 'planning' | 'liste';

export default function Availability() {
  const { logements } = useLogements();
  const { reservations } = useReservations();
  const today = new Date().toISOString().slice(0, 10);
  const defaultEnd = addDays(today, 13);
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState(defaultEnd);
  const [viewMode, setViewMode] = useState<ViewMode>('planning');

  const periodEndExclusive = addDays(dateFin, 1);

  const { days, rows, summary, periodReservations } = useMemo(() => {
    const matrix = buildPeriodMatrix(logements, reservations, dateDebut, dateFin);
    const stats = summarizePeriodMatrix(matrix.rows);
    const inPeriod = reservationsInPeriod(reservations, dateDebut, dateFin);
    return {
      days: matrix.days,
      rows: matrix.rows,
      summary: stats,
      periodReservations: inPeriod,
    };
  }, [logements, reservations, dateDebut, dateFin]);

  const listRows = useMemo(
    () =>
      logements.map((logement) => {
        const blockingReservation = periodReservations.find(
          (reservation) =>
            reservation.logement_id === logement.id &&
            !isStayEnded(reservation.date_depart) &&
            (reservation.statut_reservation === 'demande' || isReservationStillBlocking(reservation)) &&
            rangesOverlap(dateDebut, periodEndExclusive, reservation.date_arrivee, reservation.date_depart),
        );

        const unavailable = logement.statut === 'maintenance' || Boolean(blockingReservation);

        return {
          logement,
          blockingReservation,
          available: !unavailable,
          reason: logement.statut === 'maintenance'
            ? 'Maintenance'
            : blockingReservation
              ? blockingReservation.statut_reservation === 'demande'
                ? 'Demande en attente'
                : 'Réservé'
              : 'Libre',
        };
      }),
    [dateDebut, logements, periodEndExclusive, periodReservations],
  );

  const availableCount = listRows.filter((row) => row.available).length;

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Planning & disponibilités"
        description="Vue jour par jour : réservé, demande en attente ou libre sur la période choisie."
      />

      <div className="admin-card mb-6 grid gap-4 p-5 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
        <label className="grid gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-brand-muted">Du</span>
          <input
            type="date"
            value={dateDebut}
            onChange={(event) => setDateDebut(event.target.value)}
            className="form-input"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-brand-muted">Au</span>
          <input
            type="date"
            min={dateDebut}
            value={dateFin}
            onChange={(event) => setDateFin(event.target.value)}
            className="form-input"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('planning')}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              viewMode === 'planning' ? 'bg-red-50 text-brand-red' : 'bg-white text-brand-muted ring-1 ring-stone-200'
            }`}
          >
            Par jour
          </button>
          <button
            type="button"
            onClick={() => setViewMode('liste')}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              viewMode === 'liste' ? 'bg-red-50 text-brand-red' : 'bg-white text-brand-muted ring-1 ring-stone-200'
            }`}
          >
            Liste
          </button>
        </div>
        <div className="flex h-11 items-center justify-center rounded-xl bg-green-50 px-5 text-sm font-semibold text-green-700">
          {availableCount} libre{availableCount > 1 ? 's' : ''} sur la période
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminStatCard label="Jours analysés" value={days.length} icon={CalendarDays} tone="info" />
        <AdminStatCard label="Nuitées réservées" value={summary.reserved} icon={CheckCircle} tone="success" />
        <AdminStatCard label="Demandes en attente" value={summary.demandes} icon={CalendarDays} tone="warning" />
        <AdminStatCard label="Taux d'occupation" value={`${summary.occupancyRate}%`} icon={XCircle} tone="danger" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-brand-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-green-50 ring-1 ring-green-100" /> Libre
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-50 ring-1 ring-red-100" /> Réservé
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-50 ring-1 ring-amber-100" /> Demande
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-stone-200 ring-1 ring-stone-300" /> Maintenance
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-stone-100 ring-1 ring-stone-200" /> Terminé
        </span>
      </div>

      {viewMode === 'planning' ? (
        <PlanningGrid days={days} rows={rows} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listRows.map(({ logement, blockingReservation, available, reason }) => (
            <div key={logement.id} className="admin-card overflow-hidden">
              <img src={logement.photos[0]} alt={logement.nom} className="h-44 w-full object-cover" />
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-brand-dark">{logement.nom}</h2>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {logement.type} - {logement.prix.toLocaleString('fr-FR')} FCFA / nuit
                    </p>
                  </div>
                  {available ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-brand-red" />
                  )}
                </div>

                <div
                  className={`mb-4 rounded-lg px-3 py-2 text-sm font-bold ${
                    available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-brand-red'
                  }`}
                >
                  {reason}
                </div>

                {blockingReservation && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    <div className="mb-1 flex items-center gap-2 font-bold text-gray-800">
                      <CalendarDays className="h-4 w-4" />
                      Réservation existante
                    </div>
                    <p>{blockingReservation.client_nom}</p>
                    <p>
                      {formatDateFr(blockingReservation.date_arrivee)} —{' '}
                      {formatDateFr(blockingReservation.date_depart)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {periodReservations.length > 0 && (
        <section className="admin-card mt-6 overflow-hidden">
          <div className="admin-panel-header">
            <h2 className="text-base font-semibold text-brand-dark">
              Réservations sur la période ({periodReservations.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Logement</th>
                  <th>Arrivée</th>
                  <th>Départ</th>
                  <th>Statut</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {periodReservations.map((reservation) => {
                  const logement = logements.find((item) => item.id === reservation.logement_id);
                  return (
                    <tr key={reservation.id}>
                      <td className="font-medium">{reservation.client_nom}</td>
                      <td>{logement?.nom ?? '—'}</td>
                      <td>{formatDateFr(reservation.date_arrivee)}</td>
                      <td>{formatDateFr(reservation.date_depart)}</td>
                      <td>{reservation.statut_reservation}</td>
                      <td>{Number(reservation.montant_total).toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
