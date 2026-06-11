import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { rangesOverlap } from '../../utils/helpers';
import { useLogements } from '../../hooks/useLogements';
import { useReservations } from '../../hooks/useReservations';

export default function Availability() {
  const { logements } = useLogements();
  const { reservations } = useReservations();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const [dateArrivee, setDateArrivee] = useState(today);
  const [dateDepart, setDateDepart] = useState(tomorrow);

  const rows = useMemo(
    () =>
      logements.map((logement) => {
        const blockingReservation = reservations.find(
          (reservation) =>
            reservation.logement_id === logement.id &&
            (reservation.statut_reservation === 'confirmee' ||
              reservation.statut_reservation === 'en_cours') &&
            rangesOverlap(dateArrivee, dateDepart, reservation.date_arrivee, reservation.date_depart),
        );

        const unavailable = logement.statut === 'maintenance' || Boolean(blockingReservation);

        return {
          logement,
          blockingReservation,
          available: !unavailable,
          reason: logement.statut === 'maintenance' ? 'Maintenance' : blockingReservation ? 'Réservé' : 'Libre',
        };
      }),
    [dateArrivee, dateDepart, logements, reservations],
  );

  const availableCount = rows.filter((row) => row.available).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">Disponibilités</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Vérifiez les logements libres pour une période donnée.
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-2 text-sm font-bold text-gray-700">
          Arrivée
          <input
            type="date"
            value={dateArrivee}
            onChange={(event) => setDateArrivee(event.target.value)}
            className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-gray-700">
          Départ
          <input
            type="date"
            min={dateArrivee}
            value={dateDepart}
            onChange={(event) => setDateDepart(event.target.value)}
            className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
          />
        </label>
        <div className="rounded-lg bg-green-50 px-5 py-3 text-sm font-black text-green-700 ring-1 ring-green-100">
          {availableCount} libre{availableCount > 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ logement, blockingReservation, available, reason }) => (
          <div key={logement.id} className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
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
                    {new Date(blockingReservation.date_arrivee).toLocaleDateString('fr-FR')} -{' '}
                    {new Date(blockingReservation.date_depart).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
