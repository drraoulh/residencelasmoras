import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Car, Coffee, MapPin, Shield, Sparkles, Tv, Wifi, Wind } from 'lucide-react';
import UnavailableAlternativesModal from '../../components/booking/UnavailableAlternativesModal';
import { useAvailabilitySlots } from '../../hooks/useAvailabilitySlots';
import { useLogement } from '../../hooks/useLogement';
import { useLogementsList } from '../../hooks/useLogementsList';
import { findAvailableLogements } from '../../utils/planning';
import {
  formatSearchPeriod,
  getLogementAvailability,
  getUnavailableMessage,
} from '../../utils/availability';
import { ReservationUnavailableError } from '../../utils/reservationRequest';
import { buildConfirmUrl, buildReservationRef } from '../../utils/confirmReservation';
import { createReservationRequest } from '../../utils/reservationRequest';
import { openReservationWhatsApp } from '../../utils/whatsapp';
import { getAmenityIcon } from '../../utils/amenityIcons';
import { usePageMeta } from '../../hooks/usePageMeta';
import { buildPageTitle, absoluteUrl, SITE } from '../../config/seo';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: property, isLoading: propertyLoading } = useLogement(id);
  const queryClient = useQueryClient();
  const arriveeInputRef = useRef<HTMLInputElement>(null);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showAlternatives, setShowAlternatives] = useState(false);

  const urlArrivee = searchParams.get('arrivee') ?? '';
  const urlDepart = searchParams.get('depart') ?? '';
  const needsAvailability = Boolean(urlArrivee || bookingForm.dateArrivee);
  const { logements: logementsList } = useLogementsList({ enabled: needsAvailability || showAlternatives });
  const { slots } = useAvailabilitySlots({ enabled: needsAvailability });

  const propertyJsonLd = useMemo(() => {
    if (!property) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'Accommodation',
      name: property.nom,
      description: property.description,
      url: absoluteUrl(`/logements/${property.id}`),
      floorSize: property.surface
        ? { '@type': 'QuantitativeValue', value: property.surface, unitCode: 'MTK' }
        : undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE.address.city,
        addressCountry: SITE.address.country,
      },
      offers: {
        '@type': 'Offer',
        price: property.prix,
        priceCurrency: 'XAF',
        availability: property.statut === 'disponible' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    };
  }, [property]);

  usePageMeta({
    title: property
      ? buildPageTitle(`${property.nom} — location meublée`)
      : buildPageTitle('Logement'),
    description: property
      ? `${property.type} meublé à Yaoundé — ${property.prix.toLocaleString('fr-FR')} FCFA/nuit. ${property.description.slice(0, 120)}…`
      : 'Fiche logement de la Résidence LAS MORAS à Yaoundé.',
    path: property ? `/logements/${property.id}` : undefined,
    jsonLd: propertyJsonLd,
  });

  useEffect(() => {
    if (urlArrivee || urlDepart) {
      setBookingForm((current) => ({
        ...current,
        dateArrivee: urlArrivee || current.dateArrivee,
        dateDepart: urlDepart || current.dateDepart,
      }));
    }
  }, [urlArrivee, urlDepart]);

  const bookingAvailability = useMemo(() => {
    if (!property) return null;
    const arrivee = bookingForm.dateArrivee || urlArrivee;
    const depart = bookingForm.dateDepart || urlDepart;
    if (!arrivee) return null;
    if (depart && depart <= arrivee) return null;
    return getLogementAvailability(property, slots, arrivee, depart || undefined);
  }, [
    property,
    slots,
    bookingForm.dateArrivee,
    bookingForm.dateDepart,
    urlArrivee,
    urlDepart,
  ]);

  const alternatives = useMemo(() => {
    const arrivee = bookingForm.dateArrivee || urlArrivee;
    const depart = bookingForm.dateDepart || urlDepart;
    if (!property || !arrivee || bookingAvailability?.available) return [];
    return findAvailableLogements(logementsList, slots, arrivee, depart || undefined, property.id);
  }, [
    bookingAvailability?.available,
    bookingForm.dateArrivee,
    bookingForm.dateDepart,
    logementsList,
    property,
    slots,
    urlArrivee,
    urlDepart,
  ]);

  if (propertyLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-brand-gray px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
        <p className="mt-3 text-sm text-brand-muted">Chargement du logement…</p>
      </div>
    );
  }

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
  const isUnavailableByStatut = property.statut === 'occupe' || property.statut === 'maintenance';
  const arrivee = bookingForm.dateArrivee || urlArrivee;
  const depart = bookingForm.dateDepart || urlDepart;
  const hasBookingDates = Boolean(arrivee);
  const hasInvalidDates = Boolean(arrivee && depart && depart <= arrivee);
  const isUnavailable = hasInvalidDates
    ? true
    : bookingAvailability
      ? !bookingAvailability.available
      : hasBookingDates
        ? false
        : isUnavailableByStatut;

  const galleryPhotos = property.photos.length >= 4
    ? property.photos.slice(0, 4)
    : property.photos;

  const equipements = property.equipements?.length
    ? property.equipements.map((name) => ({ name, icon: getAmenityIcon(name) }))
    : defaultEquipements;

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');

    if (!bookingForm.dateArrivee) return;
    if (bookingForm.dateDepart && bookingForm.dateDepart <= bookingForm.dateArrivee) return;

    const liveAvailability = getLogementAvailability(
      property,
      slots,
      bookingForm.dateArrivee,
      bookingForm.dateDepart || undefined,
    );
    if (!liveAvailability.available) {
      setSubmitError(getUnavailableMessage(liveAvailability));
      setShowAlternatives(true);
      return;
    }

    setSubmitting(true);
    try {
      const result = await createReservationRequest({
        logementId: property.id,
        logementNom: property.nom,
        prenom: bookingForm.prenom.trim(),
        nom: bookingForm.nom.trim(),
        email: bookingForm.email.trim(),
        telephone: bookingForm.telephone.trim(),
        dateArrivee: bookingForm.dateArrivee,
        dateDepart: bookingForm.dateDepart || undefined,
        prixParNuit: property.prix,
      });

      await queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
      await queryClient.invalidateQueries({ queryKey: ['reservations'] });

      openReservationWhatsApp({
        logementNom: property.nom,
        logementType: property.type,
        prix: property.prix,
        arrivee: bookingForm.dateArrivee,
        depart: bookingForm.dateDepart || undefined,
        prenom: bookingForm.prenom.trim(),
        nom: bookingForm.nom.trim(),
        email: bookingForm.email.trim(),
        telephone: bookingForm.telephone.trim(),
        confirmUrl: buildConfirmUrl(result.id, result.confirmToken),
        reservationRef: buildReservationRef(result.id),
      });
      setSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof ReservationUnavailableError
          ? err.message
          : 'Enregistrement impossible. Réessayez ou contactez-nous par téléphone.',
      );
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="page-detail-title">{property.nom}</h1>
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

        <div className="mb-10">
          {galleryPhotos.length >= 4 ? (
            <>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory lg:hidden">
                {galleryPhotos.map((photo, index) => (
                  <img
                    key={`${photo}-mobile-${index}`}
                    src={photo}
                    alt={`${property.nom} — vue ${index + 1}`}
                    className="h-56 w-[85vw] max-w-md shrink-0 snap-center rounded-2xl object-cover sm:h-72"
                  />
                ))}
              </div>
              <div className="hidden h-[50vh] min-h-[400px] grid-cols-4 gap-2 overflow-hidden rounded-2xl shadow-sm lg:grid">
                <div className="col-span-2 h-full">
                  <img
                    src={galleryPhotos[0]}
                    alt={property.nom}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="col-span-2 grid h-full grid-cols-2 gap-2">
                  {galleryPhotos.slice(1, 4).map((photo, index) => (
                    <img
                      key={`${photo}-desktop-${index}`}
                      src={photo}
                      alt={`${property.nom} — vue ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl shadow-sm sm:grid-cols-2">
              {galleryPhotos.map((photo, index) => (
                <img
                  key={`${photo}-${index}`}
                  src={photo}
                  alt={`${property.nom} — vue ${index + 1}`}
                  className="h-48 w-full object-cover sm:h-64"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="section-title mb-4">À propos de ce logement</h2>
            <p className="mb-10 text-base leading-relaxed text-gray-600 sm:text-lg">
              {property.description}
            </p>

            <h3 className="subsection-title mb-6">
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

            <h3 className="subsection-title mb-6">Tarification détaillée</h3>
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

              <h2 className="subsection-title mb-6">Demande de réservation</h2>

              {bookingAvailability?.available && hasBookingDates && (
                <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
                  Disponible —{' '}
                  {formatSearchPeriod(
                    bookingForm.dateArrivee || urlArrivee,
                    bookingForm.dateDepart || urlDepart || undefined,
                  )}
                  .
                </div>
              )}

              {hasInvalidDates && (
                <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-brand-red ring-1 ring-red-100">
                  La date de départ doit être postérieure à la date d&apos;arrivée.
                </div>
              )}

              {isUnavailable && !hasInvalidDates && (
                <div className="mb-5 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 ring-1 ring-orange-100">
                  <p>
                    {bookingAvailability
                      ? getUnavailableMessage(bookingAvailability)
                      : 'Ce logement est actuellement indisponible. Contactez-nous pour connaître les prochaines dates libres.'}
                  </p>
                  {bookingAvailability && (
                    <button
                      type="button"
                      onClick={() => setShowAlternatives(true)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
                    >
                      <Sparkles className="h-4 w-4" />
                      Voir les logements disponibles
                    </button>
                  )}
                </div>
              )}

              {submitError && (
                <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-brand-red ring-1 ring-red-100">
                  {submitError}
                </div>
              )}

              {sent && (
                <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
                  Demande enregistrée en ligne. Envoyez le message WhatsApp pour confirmer avec l'équipe.
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
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">Arrivée</label>
                    <input
                      ref={arriveeInputRef}
                      value={bookingForm.dateArrivee}
                      onChange={(event) =>
                        setBookingForm({ ...bookingForm, dateArrivee: event.target.value })
                      }
                      type="date"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">
                      Départ <span className="font-normal text-gray-400">(optionnel)</span>
                    </label>
                    <input
                      value={bookingForm.dateDepart}
                      min={bookingForm.dateArrivee}
                      onChange={(event) =>
                        setBookingForm({ ...bookingForm, dateDepart: event.target.value })
                      }
                      type="date"
                      className="form-input"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-accent mt-2 w-full py-4 text-lg disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUnavailable || submitting || !bookingForm.dateArrivee || hasInvalidDates}
                >
                  {submitting ? 'Enregistrement…' : 'Enregistrer et ouvrir WhatsApp'}
                </button>
                <p className="text-center text-xs font-medium text-gray-500">
                  Aucun montant ne vous sera débité pour le moment.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <UnavailableAlternativesModal
        open={showAlternatives}
        onClose={() => setShowAlternatives(false)}
        arrivee={bookingForm.dateArrivee || urlArrivee}
        depart={bookingForm.dateDepart || urlDepart || undefined}
        currentLogementNom={property.nom}
        alternatives={alternatives}
        onChangeDates={() => {
          setShowAlternatives(false);
          arriveeInputRef.current?.focus();
        }}
        onReserveAlternative={(alternative) => {
          const params = new URLSearchParams();
          const arrivee = bookingForm.dateArrivee || urlArrivee;
          const depart = bookingForm.dateDepart || urlDepart;
          if (arrivee) params.set('arrivee', arrivee);
          if (depart) params.set('depart', depart);
          navigate(`/logements/${alternative.id}?${params.toString()}`);
        }}
      />
    </div>
  );
}
