import { Banknote, CalendarCheck, CreditCard, TrendingUp } from 'lucide-react';
import { useLogements } from '../../hooks/useLogements';
import { useReservations } from '../../hooks/useReservations';

export default function Reports() {
  const { logements } = useLogements();
  const { reservations } = useReservations();

  const activeReservations = reservations.filter(
    (reservation) => reservation.statut_reservation !== 'annulee',
  );
  const paidRevenue = activeReservations.reduce((total, reservation) => total + Number(reservation.montant_paye), 0);
  const expectedRevenue = activeReservations.reduce(
    (total, reservation) => total + Number(reservation.montant_total),
    0,
  );
  const remaining = Math.max(0, expectedRevenue - paidRevenue);
  const nights = activeReservations.reduce((total, reservation) => total + Number(reservation.nombre_nuits), 0);
  const blockingReservations = activeReservations.filter(
    (reservation) =>
      reservation.statut_reservation === 'confirmee' || reservation.statut_reservation === 'en_cours',
  );
  const occupancyRate = logements.length
    ? Math.round((blockingReservations.length / logements.length) * 100)
    : 0;

  const paymentRows = [
    ['Espèces', 'espece'],
    ['Paiement mobile', 'mobile_money'],
    ['Virement', 'virement'],
    ['Carte', 'carte'],
  ].map(([label, method]) => ({
    label,
    count: activeReservations.filter((reservation) => reservation.methode_paiement === method).length,
    amount: activeReservations
      .filter((reservation) => reservation.methode_paiement === method)
      .reduce((total, reservation) => total + Number(reservation.montant_paye), 0),
  }));

  const kpis = [
    {
      label: 'CA encaissé',
      value: `${paidRevenue.toLocaleString('fr-FR')} FCFA`,
      icon: Banknote,
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Reste à encaisser',
      value: `${remaining.toLocaleString('fr-FR')} FCFA`,
      icon: CreditCard,
      color: 'bg-orange-50 text-orange-700',
    },
    {
      label: 'Nuitées vendues',
      value: nights,
      icon: CalendarCheck,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Occupation actuelle',
      value: `${occupancyRate}%`,
      icon: TrendingUp,
      color: 'bg-red-50 text-brand-red',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">Rapports</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Synthèse locale des revenus, paiements et performances.
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
                <p className="mt-1 text-2xl font-black text-brand-dark">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-extrabold text-brand-dark">Paiements par méthode</h2>
          <div className="divide-y divide-gray-100">
            {paymentRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-bold text-brand-dark">{row.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{row.count} réservation(s)</p>
                </div>
                <p className="font-black text-brand-red">{row.amount.toLocaleString('fr-FR')} FCFA</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-extrabold text-brand-dark">Réservations par logement</h2>
          <div className="divide-y divide-gray-100">
            {logements.map((logement) => {
              const logementReservations = activeReservations.filter(
                (reservation) => reservation.logement_id === logement.id,
              );
              const total = logementReservations.reduce(
                (sum, reservation) => sum + Number(reservation.montant_total),
                0,
              );

              return (
                <div key={logement.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-bold text-brand-dark">{logement.nom}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {logementReservations.length} réservation(s)
                    </p>
                  </div>
                  <p className="font-black text-brand-red">{total.toLocaleString('fr-FR')} FCFA</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
