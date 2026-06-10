import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import {
  countNights,
  type PaymentMethod,
  type PaymentStatus,
  rangesOverlap,
  type Reservation,
  type ReservationStatus,
  useLocalStorageStore,
} from '../../hooks/useLocalStorageStore';

const emptyForm = {
  logementId: '',
  clientNom: '',
  clientEmail: '',
  clientTelephone: '',
  dateArrivee: '',
  dateDepart: '',
  methodePaiement: 'mobile_money' as PaymentMethod,
  statutPaiement: 'non_paye' as PaymentStatus,
  statutReservation: 'demande' as ReservationStatus,
  montantPaye: '0',
  notes: '',
};

const reservationLabels: Record<ReservationStatus, string> = {
  demande: 'Demande',
  confirmee: 'Confirmée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  annulee: 'Annulée',
};

const paymentLabels: Record<PaymentMethod, string> = {
  espece: 'Espèces',
  mobile_money: 'Paiement mobile',
  virement: 'Virement',
  carte: 'Carte',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  non_paye: 'Non payé',
  acompte: 'Acompte',
  paye: 'Payé',
  rembourse: 'Remboursé',
};

function statusClass(status: ReservationStatus) {
  if (status === 'confirmee' || status === 'en_cours') return 'bg-green-50 text-green-700 ring-green-100';
  if (status === 'annulee') return 'bg-red-50 text-brand-red ring-red-100';
  if (status === 'terminee') return 'bg-gray-50 text-gray-700 ring-gray-100';
  return 'bg-orange-50 text-orange-700 ring-orange-100';
}

function isBlockingReservation(status: ReservationStatus) {
  return status === 'confirmee' || status === 'en_cours';
}

export default function ManageReservations() {
  const { logements, reservations, addReservation, updateReservation, deleteReservation } =
    useLocalStorageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'tous' | ReservationStatus>('tous');

  const selectedLogement = logements.find((logement) => logement.id === form.logementId);
  const nights = form.dateArrivee && form.dateDepart ? countNights(form.dateArrivee, form.dateDepart) : 1;
  const total = selectedLogement ? selectedLogement.prix * nights : 0;

  const conflict = useMemo(() => {
    if (!form.logementId || !form.dateArrivee || !form.dateDepart) return null;

    return reservations.find(
      (reservation) =>
        reservation.id !== editingReservation?.id &&
        reservation.logementId === form.logementId &&
        isBlockingReservation(reservation.statutReservation) &&
        rangesOverlap(
          form.dateArrivee,
          form.dateDepart,
          reservation.dateArrivee,
          reservation.dateDepart,
        ),
    );
  }, [editingReservation?.id, form.dateArrivee, form.dateDepart, form.logementId, reservations]);

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reservations
      .filter((reservation) => {
        const logement = logements.find((item) => item.id === reservation.logementId);
        const matchesSearch =
          !normalizedQuery ||
          reservation.clientNom.toLowerCase().includes(normalizedQuery) ||
          reservation.clientEmail.toLowerCase().includes(normalizedQuery) ||
          reservation.clientTelephone.toLowerCase().includes(normalizedQuery) ||
          logement?.nom.toLowerCase().includes(normalizedQuery);
        const matchesStatus =
          statusFilter === 'tous' || reservation.statutReservation === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
  }, [logements, query, reservations, statusFilter]);

  const openCreateModal = () => {
    setEditingReservation(null);
    setForm({ ...emptyForm, logementId: logements[0]?.id ?? '' });
    setIsModalOpen(true);
  };

  const openEditModal = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setForm({
      logementId: reservation.logementId,
      clientNom: reservation.clientNom,
      clientEmail: reservation.clientEmail,
      clientTelephone: reservation.clientTelephone,
      dateArrivee: reservation.dateArrivee,
      dateDepart: reservation.dateDepart,
      methodePaiement: reservation.methodePaiement,
      statutPaiement: reservation.statutPaiement,
      statutReservation: reservation.statutReservation,
      montantPaye: String(reservation.montantPaye),
      notes: reservation.notes ?? '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReservation(null);
    setForm(emptyForm);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLogement) return;

    const draft = {
      logementId: selectedLogement.id,
      clientNom: form.clientNom.trim(),
      clientEmail: form.clientEmail.trim(),
      clientTelephone: form.clientTelephone.trim(),
      dateArrivee: form.dateArrivee,
      dateDepart: form.dateDepart,
      nombreNuits: nights,
      montantTotal: total,
      montantPaye: Number(form.montantPaye),
      methodePaiement: form.methodePaiement,
      statutPaiement: form.statutPaiement,
      statutReservation: form.statutReservation,
      notes: form.notes.trim(),
    };

    if (editingReservation) updateReservation(editingReservation.id, draft);
    else addReservation(draft);

    closeModal();
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark">Réservations</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Historique clients, périodes, paiements et statuts de séjour.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red px-5 py-3 font-bold text-white shadow-sm transition hover:bg-red-700"
        >
          <Plus className="h-5 w-5" />
          Nouvelle réservation
        </button>
      </div>

      <div className="mb-6 grid gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher client, téléphone, email ou logement"
            className="h-11 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-gray-200 focus:bg-white focus:ring-2 focus:ring-brand-red"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'tous' | ReservationStatus)}
          className="h-11 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
        >
          <option value="tous">Tous les statuts</option>
          <option value="demande">Demandes</option>
          <option value="confirmee">Confirmées</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminées</option>
          <option value="annulee">Annulées</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Logement</th>
                <th className="px-6 py-4 font-bold">Période</th>
                <th className="px-6 py-4 font-bold">Paiement</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((reservation) => {
                const logement = logements.find((item) => item.id === reservation.logementId);
                return (
                  <tr key={reservation.id} className="align-top transition hover:bg-gray-50/80">
                    <td className="px-6 py-5">
                      <p className="font-bold text-brand-dark">{reservation.clientNom}</p>
                      <p className="mt-1 text-sm text-gray-500">{reservation.clientTelephone}</p>
                      <p className="text-sm text-gray-500">{reservation.clientEmail}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-800">{logement?.nom ?? 'Logement supprimé'}</p>
                      <p className="mt-1 text-sm text-gray-500">{logement?.type}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600">
                      <p>{new Date(reservation.dateArrivee).toLocaleDateString('fr-FR')} - {new Date(reservation.dateDepart).toLocaleDateString('fr-FR')}</p>
                      <p className="mt-1">{reservation.nombreNuits} nuit(s)</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-black text-brand-red">
                        {reservation.montantTotal.toLocaleString('fr-FR')} FCFA
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {paymentLabels[reservation.methodePaiement]} - {paymentStatusLabels[reservation.statutPaiement]}
                      </p>
                      <p className="text-sm text-gray-500">
                        Payé: {reservation.montantPaye.toLocaleString('fr-FR')} FCFA
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`rounded-lg px-3 py-1.5 text-xs font-bold ring-1 ${statusClass(reservation.statutReservation)}`}>
                        {reservationLabels[reservation.statutReservation]}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(reservation)}
                          className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          aria-label="Modifier la réservation"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteReservation(reservation.id)}
                          className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-brand-red"
                          aria-label="Supprimer la réservation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-extrabold text-brand-dark">
                {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
              </h2>
              <button type="button" onClick={closeModal} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-6">
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Logement
                <select
                  value={form.logementId}
                  onChange={(event) => setForm({ ...form, logementId: event.target.value })}
                  className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red"
                  required
                >
                  {logements.map((logement) => (
                    <option key={logement.id} value={logement.id}>
                      {logement.nom} - {logement.prix.toLocaleString('fr-FR')} FCFA / nuit
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-5 sm:grid-cols-3">
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Client
                  <input value={form.clientNom} onChange={(event) => setForm({ ...form, clientNom: event.target.value })} className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Email
                  <input type="email" value={form.clientEmail} onChange={(event) => setForm({ ...form, clientEmail: event.target.value })} className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Téléphone
                  <input value={form.clientTelephone} onChange={(event) => setForm({ ...form, clientTelephone: event.target.value })} className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Arrivée
                  <input type="date" value={form.dateArrivee} onChange={(event) => setForm({ ...form, dateArrivee: event.target.value })} className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Départ
                  <input type="date" min={form.dateArrivee} value={form.dateDepart} onChange={(event) => setForm({ ...form, dateDepart: event.target.value })} className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </label>
              </div>

              {conflict && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-brand-red ring-1 ring-red-100">
                  Conflit: ce logement est déjà réservé sur une partie de cette période.
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-4">
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Statut
                  <select value={form.statutReservation} onChange={(event) => setForm({ ...form, statutReservation: event.target.value as ReservationStatus })} className="h-12 rounded-lg bg-gray-50 px-3 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red">
                    <option value="demande">Demande</option>
                    <option value="confirmee">Confirmée</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Paiement
                  <select value={form.methodePaiement} onChange={(event) => setForm({ ...form, methodePaiement: event.target.value as PaymentMethod })} className="h-12 rounded-lg bg-gray-50 px-3 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red">
                    <option value="espece">Espèces</option>
                    <option value="mobile_money">Paiement mobile</option>
                    <option value="virement">Virement</option>
                    <option value="carte">Carte</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Statut paiement
                  <select value={form.statutPaiement} onChange={(event) => setForm({ ...form, statutPaiement: event.target.value as PaymentStatus })} className="h-12 rounded-lg bg-gray-50 px-3 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red">
                    <option value="non_paye">Non payé</option>
                    <option value="acompte">Acompte</option>
                    <option value="paye">Payé</option>
                    <option value="rembourse">Remboursé</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold text-gray-700">
                  Montant payé
                  <input type="number" min="0" value={form.montantPaye} onChange={(event) => setForm({ ...form, montantPaye: event.target.value })} className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" />
                </label>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 text-sm font-bold text-gray-700">
                Total estimé: {total.toLocaleString('fr-FR')} FCFA pour {nights} nuit(s)
              </div>

              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Notes
                <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={3} className="resize-none rounded-lg bg-gray-50 px-4 py-3 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" />
              </label>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={closeModal} className="rounded-lg border border-gray-200 px-5 py-3 font-bold text-gray-600">
                  Annuler
                </button>
                <button type="submit" className="rounded-lg bg-brand-red px-5 py-3 font-bold text-white hover:bg-red-700">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
