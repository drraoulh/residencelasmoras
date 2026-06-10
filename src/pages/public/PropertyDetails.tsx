import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Car, Coffee, MapPin, Shield, Tv, Wifi, Wind } from 'lucide-react';
import { countNights, useLocalStorageStore } from '../../hooks/useLocalStorageStore';

const defaultEquipements = [
  { name: 'Climatisation', icon: Wind },
  { name: 'Wi-Fi Fibre', icon: Wifi },
  { name: 'Parking securise', icon: Car },
  { name: 'Smart TV', icon: Tv },
  { name: 'Machine a cafe', icon: Coffee },
  { name: 'Gardien 24/7', icon: Shield },
];

const initialBookingForm = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  dateArrivee: '',
  dateDepart: '',
};

export default function PropertyDetails() {
  const { id } = useParams();
  const { logements, addReservation } = useLocalStorageStore();
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [sent, setSent] = useState(false);
  const property = logements.find((logement) => logement.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-brand-gray px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-brand-dark">Logement introuvable</h1>
        <Link to="/catalogue" className="mt-6 inline-flex rounded-lg bg-brand-red px-5 py-3 font-bold text-white">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const weeklyPrice = property.prix * 6;
  const monthlyPrice = property.prix * 25;

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nights = countNights(bookingForm.dateArrivee, bookingForm.dateDepart);

    addReservation({
      logementId: property.id,
      clientNom: `${bookingForm.prenom.trim()} ${bookingForm.nom.trim()}`.trim(),
      clientEmail: bookingForm.email.trim(),
      clientTelephone: bookingForm.telephone.trim(),
      dateArrivee: bookingForm.dateArrivee,
      dateDepart: bookingForm.dateDepart,
      nombreNuits: nights,
      montantTotal: property.prix * nights,
      montantPaye: 0,
      methodePaiement: 'mobile_money',
      statutPaiement: 'non_paye',
      statutReservation: 'demande',
      notes: 'Demande envoyee depuis le site public.',
    });
    setBookingForm(initialBookingForm);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-brand-gray pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            {property.nom}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600 sm:text-base">
            <MapPin className="h-5 w-5 text-brand-red" />
            <span>Yaounde, Cameroun</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm">{property.type}</span>
            {property.surface && (
              <span className="rounded-full bg-white px-3 py-1 text-sm">{property.surface} m²</span>
            )}
          </div>
        </div>

        <div className="mb-10 grid h-[320px] grid-cols-1 overflow-hidden rounded-lg shadow-sm sm:h-[420px] lg:h-[50vh] lg:min-h-[400px] lg:grid-cols-4 lg:gap-4">
          <div className="h-full lg:col-span-2">
            <img src={property.photos[0]} alt={property.nom} className="h-full w-full object-cover" />
          </div>
          <div className="hidden h-full grid-cols-2 gap-4 lg:col-span-2 lg:grid">
            {[property.photos[1], property.photos[2], property.photos[0], property.photos[0]].map(
              (photo, index) => (
                <img
                  key={`${photo}-${index}`}
                  src={photo ?? property.photos[0]}
                  alt={`Vue ${index + 2}`}
                  className="h-full w-full object-cover"
                />
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-brand-dark sm:text-2xl">
              A propos de ce logement
            </h2>
            <p className="mb-10 text-base leading-relaxed text-gray-600 sm:text-lg">
              {property.description}
            </p>

            <h3 className="mb-6 text-xl font-bold text-brand-dark sm:text-2xl">
              Ce que propose ce logement
            </h3>
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
              {(property.equipements?.length
                ? property.equipements.map((name) => ({ name, icon: Wifi }))
                : defaultEquipements
              ).map((eq) => (
                <div
                  key={eq.name}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 text-gray-700 shadow-sm"
                >
                  <eq.icon className="h-6 w-6 flex-shrink-0 text-brand-red" />
                  <span className="text-sm font-semibold">{eq.name}</span>
                </div>
              ))}
            </div>

            <h3 className="mb-6 text-xl font-bold text-brand-dark sm:text-2xl">
              Tarification detaillee
            </h3>
            <div className="flex flex-col items-center justify-around gap-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:gap-8 md:p-8">
              {[
                ['Par nuit', property.prix],
                ['Par semaine', weeklyPrice],
                ['Par mois', monthlyPrice],
              ].map(([label, price], index) => (
                <div key={label} className="flex w-full flex-col items-center gap-6 md:flex-row">
                  {index > 0 && <div className="hidden h-16 w-px bg-gray-200 md:block" />}
                  <div className="w-full text-center">
                    <p className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                      {label}
                    </p>
                    <p
                      className={`text-2xl font-extrabold sm:text-3xl ${
                        index === 0 ? 'text-brand-red' : 'text-brand-dark'
                      }`}
                    >
                      {Number(price).toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:p-8 lg:sticky lg:top-24">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <span className="text-2xl font-extrabold text-brand-red sm:text-3xl">
                  {property.prix.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="font-semibold text-gray-500"> / nuit</span>
              </div>

              <h3 className="mb-6 text-xl font-bold text-brand-dark">Demande de reservation</h3>
              {sent && (
                <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm font-bold text-green-700 ring-1 ring-green-100">
                  Demande envoyee. Elle apparait dans l espace administrateur.
                </div>
              )}
              <form onSubmit={handleBooking} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input value={bookingForm.prenom} onChange={(event) => setBookingForm({ ...bookingForm, prenom: event.target.value })} type="text" placeholder="Prenom" className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                  <input value={bookingForm.nom} onChange={(event) => setBookingForm({ ...bookingForm, nom: event.target.value })} type="text" placeholder="Nom" className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </div>
                <input value={bookingForm.email} onChange={(event) => setBookingForm({ ...bookingForm, email: event.target.value })} type="email" placeholder="Email" className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                <input value={bookingForm.telephone} onChange={(event) => setBookingForm({ ...bookingForm, telephone: event.target.value })} type="tel" placeholder="Telephone" className="h-12 rounded-lg bg-gray-50 px-4 font-medium outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input value={bookingForm.dateArrivee} onChange={(event) => setBookingForm({ ...bookingForm, dateArrivee: event.target.value })} type="date" className="h-12 rounded-lg bg-gray-50 px-4 font-medium text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                  <input value={bookingForm.dateDepart} min={bookingForm.dateArrivee} onChange={(event) => setBookingForm({ ...bookingForm, dateDepart: event.target.value })} type="date" className="h-12 rounded-lg bg-gray-50 px-4 font-medium text-gray-700 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-brand-red" required />
                </div>
                <button type="submit" className="mt-2 w-full rounded-lg bg-brand-red py-4 text-lg font-bold text-white transition hover:bg-red-700 hover:shadow-[0_8px_20px_rgba(213,0,0,0.3)] active:scale-95">
                  Demander une reservation
                </button>
                <p className="text-center text-xs font-medium text-gray-500">
                  Aucun montant ne vous sera debite pour le moment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
