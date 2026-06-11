import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Car, Coffee, MapPin, Shield, Tv, Wifi, Wind } from 'lucide-react';
import { countNights } from '../../utils/helpers';
import { useLogements } from '../../hooks/useLogements';
import { useReservations } from '../../hooks/useReservations';
import { getAmenityIcon } from '../../utils/amenityIcons';

const defaultEquipements = [
  { name: 'Climatisation', icon: Wind },
  { name: 'Wi-Fi Fibre', icon: Wifi },
  { name: 'Parking sécurisé', icon: Car },
  { name: 'Smart TV', icon: Tv },
  { name: 'Machine à café', icon: Coffee },
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
  const { logements } = useLogements();
  const { addReservation } = useReservations();
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [sent, setSent] = useState(false);
  const property = logements.find((logement) => logement.id === id);

  if (!property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-gray px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-brand-dark">Logement introuvable</h1>
        <p className="mt-3 text-gray-600">Ce logement n'existe pas ou a été retiré du catalogue.</p>
        <Link to="/catalogue" className="btn-primary mt-6">
          Retour au catalogue
        </Link>
      </div>
    );
  }

  const weeklyPrice = property.prix * 6;
  const monthlyPrice = property.prix * 25;
  const isUnavailable = property.statut === 'occupe' || property.statut === 'maintenance';

  const galleryPhotos = property.photos.length >= 4
    ? property.photos.slice(0, 4)
    : property.photos;

  const equipements = property.equipements?.length
    ? property.equipements.map((name) => ({ name, icon: getAmenityIcon(name) }))
    : defaultEquipements;

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nights = countNights(bookingForm.dateArrivee, bookingForm.dateDepart);

    addReservation.mutate({
      logement_id: property.id,
      client_nom: `${bookingForm.prenom.trim()} ${bookingForm.nom.trim()}`.trim(),
      client_email: bookingForm.email.trim(),
      client_telephone: bookingForm.telephone.trim(),
      date_arrivee: bookingForm.dateArrivee,
      date_depart: bookingForm.dateDepart,
      nombre_nuits: nights,
      montant_total: property.prix * nights,
      montant_paye: 0,
      methode_paiement: 'mobile_money',
      statut_paiement: 'non_paye',
      statut_reservation: 'demande',
      notes: 'Demande envoyée depuis le site public.',
    });
    setBookingForm(initialBookingForm);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-brand-gray pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          to="/catalogue"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-brand-red"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au catalogue
        </Link>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-4xl">
            {property.nom}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600 sm:text-base">
            <MapPin className="h-5 w-5 text-brand-red" />
            <span>Yaoundé, Cameroun</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-gray-100">{property.type}</span>
            {property.surface && (
              <span className="rounded-full bg-white px-3 py-1 text-sm ring-1 ring-gray-100">
                {property.surface} m²
              </span>
            )}
            {property.statut === 'disponible' && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                Disponible
              </span>
            )}
          </div>
        </div>

        <div
          className={`mb-10 grid overflow-hidden rounded-2xl shadow-sm ${
            galleryPhotos.length >= 4
              ? 'h-[320px] grid-cols-1 sm:h-[420px] lg:h-[50vh] lg:min-h-[400px] lg:grid-cols-4 lg:gap-2'
              : 'grid-cols-1 gap-2 sm:grid-cols-2'
          }`}
        >
          {galleryPhotos.length >= 4 ? (
            <>
              <div className="h-full lg:col-span-2">
                <img
                  src={galleryPhotos[0]}
                  alt={property.nom}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden h-full grid-cols-2 gap-2 lg:col-span-2 lg:grid">
                {galleryPhotos.slice(1, 4).map((photo, index) => (
                  <img
                    key={`${photo}-${index}`}
                    src={photo}
                    alt={`Vue ${index + 2}`}
                    className="h-full w-full object-cover"
                  />
                ))}
              </div>
            </>
          ) : (
            galleryPhotos.map((photo, index) => (
              <img
                key={`${photo}-${index}`}
                src={photo}
                alt={`${property.nom} - vue ${index + 1}`}
                className="h-48 w-full object-cover sm:h-64"
              />
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-brand-dark sm:text-2xl">
              À propos de ce logement
            </h2>
            <p className="mb-10 text-base leading-relaxed text-gray-600 sm:text-lg">
              {property.description}
            </p>

            <h3 className="mb-6 text-xl font-bold text-brand-dark sm:text-2xl">
              Ce que propose ce logement
            </h3>
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
              {equipements.map((eq) => (
                <div
                  key={eq.name}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 text-gray-700 shadow-sm"
                >
                  <eq.icon className="h-6 w-6 flex-shrink-0 text-brand-red" />
                  <span className="text-sm font-semibold">{eq.name}</span>
                </div>
              ))}
            </div>

            <h3 className="mb-6 text-xl font-bold text-brand-dark sm:text-2xl">
              Tarification détaillée
            </h3>
            <div className="flex flex-col items-center justify-around gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:gap-8 md:p-8">
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
                      className={`text-2xl font-bold sm:text-3xl ${
                        index === 0 ? 'text-brand-red' : 'text-brand-dark'
                      }`}
                    >
                      {Number(price).toLocaleString('fr-FR')}{' '}
                      <span className="text-lg">FCFA</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] sm:p-8 lg:sticky lg:top-24">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <span className="text-2xl font-bold text-brand-red sm:text-3xl">
                  {property.prix.toLocaleString('fr-FR')} FCFA
                </span>
                <span className="font-semibold text-gray-500"> / nuit</span>
              </div>

              <h3 className="mb-6 text-xl font-bold text-brand-dark">Demande de réservation</h3>

              {isUnavailable && (
                <div className="mb-5 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 ring-1 ring-orange-100">
                  Ce logement est actuellement indisponible. Contactez-nous pour connaître les
                  prochaines dates libres.
                </div>
              )}

              {sent && (
                <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
                  Demande envoyée avec succès. Elle apparaît dans l'espace administrateur.
                </div>
              )}

              <form onSubmit={handleBooking} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    value={bookingForm.prenom}
                    onChange={(event) =>
                      setBookingForm({ ...bookingForm, prenom: event.target.value })
                    }
                    type="text"
                    placeholder="Prénom"
                    className="form-input"
                    required
                    disabled={isUnavailable}
                  />
                  <input
                    value={bookingForm.nom}
                    onChange={(event) =>
                      setBookingForm({ ...bookingForm, nom: event.target.value })
                    }
                    type="text"
                    placeholder="Nom"
                    className="form-input"
                    required
                    disabled={isUnavailable}
                  />
                </div>
                <input
                  value={bookingForm.email}
                  onChange={(event) =>
                    setBookingForm({ ...bookingForm, email: event.target.value })
                  }
                  type="email"
                  placeholder="Email"
                  className="form-input"
                  required
                  disabled={isUnavailable}
                />
                <input
                  value={bookingForm.telephone}
                  onChange={(event) =>
                    setBookingForm({ ...bookingForm, telephone: event.target.value })
                  }
                  type="tel"
                  placeholder="Téléphone"
                  className="form-input"
                  required
                  disabled={isUnavailable}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    value={bookingForm.dateArrivee}
                    onChange={(event) =>
                      setBookingForm({ ...bookingForm, dateArrivee: event.target.value })
                    }
                    type="date"
                    className="form-input"
                    required
                    disabled={isUnavailable}
                  />
                  <input
                    value={bookingForm.dateDepart}
                    min={bookingForm.dateArrivee}
                    onChange={(event) =>
                      setBookingForm({ ...bookingForm, dateDepart: event.target.value })
                    }
                    type="date"
                    className="form-input"
                    required
                    disabled={isUnavailable}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary mt-2 w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUnavailable}
                >
                  Demander une réservation
                </button>
                <p className="text-center text-xs font-medium text-gray-500">
                  Aucun montant ne vous sera débité pour le moment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
