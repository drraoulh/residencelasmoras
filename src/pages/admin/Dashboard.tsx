import { Banknote, Building2, CalendarCheck, Home, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocalStorageStore } from '../../hooks/useLocalStorageStore';

export default function Dashboard() {
  const { logements, messages, reservations } = useLocalStorageStore();

  const occupiedCount = logements.filter((logement) => logement.statut === 'occupe').length;
  const unreadMessages = messages.filter((message) => !message.lu).length;
  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.statutReservation === 'confirmee' || reservation.statutReservation === 'en_cours',
  );
  const paidRevenue = reservations
    .filter((reservation) => reservation.statutReservation !== 'annulee')
    .reduce((total, reservation) => total + reservation.montantPaye, 0);

  const upcomingArrivals = [...reservations]
    .filter((reservation) => reservation.statutReservation !== 'annulee')
    .sort((a, b) => a.dateArrivee.localeCompare(b.dateArrivee))
    .slice(0, 5);

  const kpis = [
    { label: 'Total logements', value: logements.length, icon: Home, color: 'bg-gray-50 text-brand-dark' },
    { label: 'Réservations actives', value: activeReservations.length, icon: CalendarCheck, color: 'bg-green-50 text-green-700' },
    { label: 'Logements occupés', value: occupiedCount, icon: Building2, color: 'bg-red-50 text-brand-red' },
    { label: 'Messages non lus', value: unreadMessages, icon: Inbox, color: 'bg-blue-50 text-blue-700' },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">Tableau de bord</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Vue rapide des logements, réservations, paiements et messages.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/reservations" className="rounded-lg bg-brand-red px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700">
            Nouvelle réservation
          </Link>
          <Link to="/admin/disponibilites" className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
            Voir disponibilités
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
                <p className="mt-1 text-3xl font-black text-brand-dark">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-700">
            <Banknote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Total encaissé</p>
            <p className="mt-1 text-3xl font-black text-brand-dark">
              {paidRevenue.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-5">
            <h2 className="text-xl font-extrabold text-brand-dark">Prochaines arrivées</h2>
            <Link to="/admin/reservations" className="text-sm font-bold text-brand-red">Gérer</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingArrivals.map((reservation) => {
              const logement = logements.find((item) => item.id === reservation.logementId);
              return (
                <div key={reservation.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-brand-dark">{reservation.clientNom}</p>
                      <p className="mt-1 text-sm text-gray-500">{logement?.nom} - {reservation.clientTelephone}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      {new Date(reservation.dateArrivee).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-5">
            <h2 className="text-xl font-extrabold text-brand-dark">Derniers messages</h2>
            <Link to="/admin/contacts" className="text-sm font-bold text-brand-red">Ouvrir</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-brand-dark">{message.sujet}</p>
                    <p className="mt-1 text-sm text-gray-500">{message.nom} - {message.email}</p>
                  </div>
                  {!message.lu && (
                    <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-brand-red">
                      Non lu
                    </span>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="px-6 py-8 text-center text-sm font-medium text-gray-500">Aucun message.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
