import { useMemo, useState } from 'react';
import { Banknote, CalendarCheck, CreditCard, TrendingUp } from 'lucide-react';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { useLogements } from '../../hooks/useLogements';
import { useReservations } from '../../hooks/useReservations';
import { formatDateFr } from '../../utils/availability';
import { buildDailyReport, buildDayRange, reservationsInPeriod } from '../../utils/planning';

export default function Reports() {
  const { logements } = useLogements();
  const { reservations } = useReservations();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = today.slice(0, 8) + '01';
  const [dateDebut, setDateDebut] = useState(monthStart);
  const [dateFin, setDateFin] = useState(today);

  const { periodReservations, days, dailyRows, kpis } = useMemo(() => {
    const inPeriod = reservationsInPeriod(reservations, dateDebut, dateFin);
    const dayList = buildDayRange(dateDebut, dateFin);
    const daily = buildDailyReport(inPeriod, dayList);

    const active = inPeriod.filter((r) => r.statut_reservation !== 'annulee');
    const paidRevenue = active.reduce((total, r) => total + Number(r.montant_paye), 0);
    const expectedRevenue = active.reduce((total, r) => total + Number(r.montant_total), 0);
    const remaining = Math.max(0, expectedRevenue - paidRevenue);
    const nights = active.reduce((total, r) => total + Number(r.nombre_nuits), 0);
    const confirmed = active.filter((r) =>
      ['confirmee', 'en_cours', 'terminee'].includes(r.statut_reservation),
    );
    const demandes = active.filter((r) => r.statut_reservation === 'demande');
    const occupancyRate = logements.length && dayList.length
      ? Math.round((confirmed.length / (logements.length * dayList.length)) * 100)
      : 0;

    return {
      periodReservations: inPeriod,
      days: dayList,
      dailyRows: daily,
      kpis: { paidRevenue, remaining, nights, occupancyRate, expectedRevenue, demandes: demandes.length, confirmed: confirmed.length },
    };
  }, [reservations, dateDebut, dateFin, logements.length]);

  const paymentRows = useMemo(() => {
    const active = periodReservations.filter((r) => r.statut_reservation !== 'annulee');
    return [
      ['Espèces', 'espece'],
      ['Paiement mobile', 'mobile_money'],
      ['Virement', 'virement'],
      ['Carte', 'carte'],
    ].map(([label, method]) => ({
      label,
      count: active.filter((r) => r.methode_paiement === method).length,
      amount: active
        .filter((r) => r.methode_paiement === method)
        .reduce((total, r) => total + Number(r.montant_paye), 0),
    }));
  }, [periodReservations]);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Rapports"
        description="Chiffres réels sur la période : encaissements, occupation et détail jour par jour."
      />

      <div className="admin-card mb-6 grid gap-4 p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <label className="grid gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-brand-muted">Période du</span>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="form-input"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-widest text-brand-muted">Au</span>
          <input
            type="date"
            min={dateDebut}
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="form-input"
          />
        </label>
        <p className="text-sm text-brand-muted">
          {days.length} jour{days.length > 1 ? 's' : ''} · {periodReservations.length} réservation
          {periodReservations.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="CA encaissé"
          value={`${kpis.paidRevenue.toLocaleString('fr-FR')} FCFA`}
          icon={Banknote}
          tone="success"
        />
        <AdminStatCard
          label="Reste à encaisser"
          value={`${kpis.remaining.toLocaleString('fr-FR')} FCFA`}
          icon={CreditCard}
          tone="warning"
        />
        <AdminStatCard label="Nuitées" value={kpis.nights} icon={CalendarCheck} tone="info" />
        <AdminStatCard
          label="Réservations confirmées"
          value={kpis.confirmed}
          icon={TrendingUp}
          tone="danger"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="admin-card overflow-hidden">
          <div className="admin-panel-header">
            <h2 className="text-base font-semibold text-brand-dark">Détail jour par jour</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Réserv.</th>
                  <th>Demandes</th>
                  <th>Encaissé</th>
                </tr>
              </thead>
              <tbody>
                {dailyRows.map((row) => (
                  <tr key={row.day}>
                    <td className="font-medium">{formatDateFr(row.day)}</td>
                    <td>{row.confirmed}</td>
                    <td>{row.demandes}</td>
                    <td>{row.revenue.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card overflow-hidden">
          <div className="admin-panel-header">
            <h2 className="text-base font-semibold text-brand-dark">Paiements par méthode</h2>
          </div>
          <div className="divide-y divide-stone-100 px-5 sm:px-6">
            {paymentRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-brand-dark">{row.label}</p>
                  <p className="mt-1 text-sm text-brand-muted">{row.count} réservation(s)</p>
                </div>
                <p className="font-semibold text-brand-red">{row.amount.toLocaleString('fr-FR')} FCFA</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-card overflow-hidden">
        <div className="admin-panel-header">
          <h2 className="text-base font-semibold text-brand-dark">Réservations de la période</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Logement</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Nuits</th>
                <th>Statut</th>
                <th>Total</th>
                <th>Payé</th>
              </tr>
            </thead>
            <tbody>
              {periodReservations.length > 0 ? (
                periodReservations.map((reservation) => {
                  const logement = logements.find((l) => l.id === reservation.logement_id);
                  return (
                    <tr key={reservation.id}>
                      <td className="font-medium">{reservation.client_nom}</td>
                      <td>{logement?.nom ?? '—'}</td>
                      <td>{formatDateFr(reservation.date_arrivee)}</td>
                      <td>{formatDateFr(reservation.date_depart)}</td>
                      <td>{reservation.nombre_nuits}</td>
                      <td>{reservation.statut_reservation}</td>
                      <td>{Number(reservation.montant_total).toLocaleString('fr-FR')}</td>
                      <td>{Number(reservation.montant_paye).toLocaleString('fr-FR')}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-muted">
                    Aucune réservation sur cette période.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card mt-6 overflow-hidden">
        <div className="admin-panel-header">
          <h2 className="text-base font-semibold text-brand-dark">Par logement</h2>
        </div>
        <div className="divide-y divide-stone-100 px-5 sm:px-6">
          {logements.map((logement) => {
            const logementReservations = periodReservations.filter(
              (r) => r.logement_id === logement.id && r.statut_reservation !== 'annulee',
            );
            const total = logementReservations.reduce((sum, r) => sum + Number(r.montant_total), 0);
            const paid = logementReservations.reduce((sum, r) => sum + Number(r.montant_paye), 0);

            return (
              <div key={logement.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-brand-dark">{logement.nom}</p>
                  <p className="mt-1 text-sm text-brand-muted">
                    {logementReservations.length} réservation(s) · {paid.toLocaleString('fr-FR')} FCFA encaissés
                  </p>
                </div>
                <p className="font-semibold text-brand-red">{total.toLocaleString('fr-FR')} FCFA</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
