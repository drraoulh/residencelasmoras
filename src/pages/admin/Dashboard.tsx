import { Banknote, Building2, CalendarCheck, Home as HomeIcon, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminEmptyState from '../../components/admin/AdminEmptyState';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { useLogements } from '../../hooks/useLogements';
import { useMessages } from '../../hooks/useMessages';
import { useReservations } from '../../hooks/useReservations';
import { formatDateFr } from '../../utils/availability';

export default function Dashboard() {
  const { logements } = useLogements();
  const { messages } = useMessages();
  const { reservations } = useReservations();

  const occupiedCount = logements.filter((logement) => logement.statut === 'occupe').length;
  const availableCount = logements.filter((logement) => logement.statut === 'disponible').length;
  const unreadMessages = messages.filter((message) => !message.lu).length;
  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.statut_reservation === 'confirmee' || reservation.statut_reservation === 'en_cours',
  );
  const paidRevenue = reservations
    .filter((reservation) => reservation.statut_reservation !== 'annulee')
    .reduce((total, reservation) => total + Number(reservation.montant_paye), 0);

  const upcomingArrivals = [...reservations]
    .filter((reservation) => reservation.statut_reservation !== 'annulee')
    .sort((a, b) => new Date(a.date_arrivee).getTime() - new Date(b.date_arrivee).getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de la résidence : logements, réservations, revenus et messages."
        actions={
          <>
            <Link to="/admin/reservations" className="admin-btn-primary">
              Nouvelle réservation
            </Link>
            <Link to="/admin/disponibilites" className="admin-btn-secondary">
              Disponibilités
            </Link>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Logements" value={logements.length} icon={HomeIcon} />
        <AdminStatCard
          label="Disponibles"
          value={availableCount}
          icon={Building2}
          tone="success"
        />
        <AdminStatCard
          label="Réservations actives"
          value={activeReservations.length}
          icon={CalendarCheck}
          tone="info"
        />
        <AdminStatCard
          label="Messages non lus"
          value={unreadMessages}
          icon={Inbox}
          tone={unreadMessages > 0 ? 'danger' : 'default'}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <AdminStatCard
          label="Total encaissé"
          value={`${paidRevenue.toLocaleString('fr-FR')} FCFA`}
          icon={Banknote}
          tone="success"
        />
        <AdminStatCard
          label="Logements occupés"
          value={occupiedCount}
          icon={Building2}
          tone={occupiedCount > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="admin-card overflow-hidden">
          <div className="admin-panel-header">
            <h2 className="text-base font-semibold text-brand-dark">Prochaines arrivées</h2>
            <Link to="/admin/reservations" className="text-sm font-medium text-brand-red hover:underline">
              Gérer
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {upcomingArrivals.length > 0 ? (
              upcomingArrivals.map((reservation) => {
                const logement = logements.find((item) => item.id === reservation.logement_id);
                return (
                  <div key={reservation.id} className="px-5 py-4 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-brand-dark">{reservation.client_nom}</p>
                        <p className="mt-1 truncate text-sm text-brand-muted">
                          {logement?.nom ?? 'Logement'} · {reservation.client_telephone}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-brand-dark">
                        {formatDateFr(reservation.date_arrivee)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <AdminEmptyState message="Aucune arrivée planifiée." />
            )}
          </div>
        </section>

        <section className="admin-card overflow-hidden">
          <div className="admin-panel-header">
            <h2 className="text-base font-semibold text-brand-dark">Derniers messages</h2>
            <Link to="/admin/contacts" className="text-sm font-medium text-brand-red hover:underline">
              Ouvrir
            </Link>
          </div>
          <div className="divide-y divide-stone-100">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="px-5 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-brand-dark">{message.sujet}</p>
                    <p className="mt-1 truncate text-sm text-brand-muted">
                      {message.nom} · {message.email}
                    </p>
                  </div>
                  {!message.lu && (
                    <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-medium text-brand-red">
                      Non lu
                    </span>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <AdminEmptyState message="Aucun message pour le moment." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
