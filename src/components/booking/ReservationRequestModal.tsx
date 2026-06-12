import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Sparkles, X } from 'lucide-react';
import { useAvailabilitySlots } from '../../hooks/useAvailabilitySlots';
import { useLogementsList } from '../../hooks/useLogementsList';
import { buildConfirmUrl, buildReservationRef } from '../../utils/confirmReservation';
import {
  getLogementAvailability,
  getUnavailableMessage,
} from '../../utils/availability';
import { findAvailableLogements } from '../../utils/planning';
import {
  createReservationRequest,
  ReservationUnavailableError,
} from '../../utils/reservationRequest';
import { openReservationWhatsApp } from '../../utils/whatsapp';
import UnavailableAlternativesModal from './UnavailableAlternativesModal';

interface ReservationRequestModalProps {
  open: boolean;
  onClose: () => void;
  logementId: string;
  logementNom: string;
  logementType: string;
  prixParNuit: number;
  arrivee?: string;
  depart?: string;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReservationRequestModal({
  open,
  onClose,
  logementId,
  logementNom,
  logementType,
  prixParNuit,
  arrivee: initialArrivee = '',
  depart: initialDepart = '',
}: ReservationRequestModalProps) {
  const queryClient = useQueryClient();
  const arriveeRef = useRef<HTMLInputElement>(null);

  const [activeLogement, setActiveLogement] = useState({
    id: logementId,
    nom: logementNom,
    type: logementType,
    prix: prixParNuit,
  });
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [arrivee, setArrivee] = useState(initialArrivee);
  const [depart, setDepart] = useState(initialDepart);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const { logements } = useLogementsList({ enabled: open });
  const { slots } = useAvailabilitySlots({ enabled: open && Boolean(arrivee) });

  const logement = logements.find((item) => item.id === activeLogement.id);

  useEffect(() => {
    if (open) {
      setActiveLogement({ id: logementId, nom: logementNom, type: logementType, prix: prixParNuit });
      setArrivee(initialArrivee);
      setDepart(initialDepart);
      setError('');
      setShowAlternatives(false);
    }
  }, [open, logementId, logementNom, logementType, prixParNuit, initialArrivee, initialDepart]);

  const availability = useMemo(() => {
    if (!logement || !arrivee) return null;
    if (depart && depart <= arrivee) return null;
    return getLogementAvailability(logement, slots, arrivee, depart || undefined);
  }, [logement, slots, arrivee, depart]);

  const alternatives = useMemo(() => {
    if (!arrivee || availability?.available) return [];
    return findAvailableLogements(logements, slots, arrivee, depart || undefined, activeLogement.id);
  }, [activeLogement.id, arrivee, availability?.available, depart, logements, slots]);

  const datesUnavailable = availability ? !availability.available : false;

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!arrivee) {
      setError('Choisissez une date d\'arrivée.');
      return;
    }
    if (depart && depart <= arrivee) {
      setError('La date de départ doit être après l\'arrivée.');
      return;
    }
    if (!logement) {
      setError('Logement introuvable.');
      return;
    }

    const liveAvailability = getLogementAvailability(logement, slots, arrivee, depart || undefined);
    if (!liveAvailability.available) {
      setError(getUnavailableMessage(liveAvailability));
      setShowAlternatives(true);
      return;
    }

    setLoading(true);
    try {
      const result = await createReservationRequest({
        logementId: activeLogement.id,
        logementNom: activeLogement.nom,
        prenom,
        nom,
        email,
        telephone,
        dateArrivee: arrivee,
        dateDepart: depart || undefined,
        prixParNuit: activeLogement.prix,
      });

      await queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
      await queryClient.invalidateQueries({ queryKey: ['reservations'] });

      openReservationWhatsApp({
        logementNom: activeLogement.nom,
        logementType: activeLogement.type,
        prix: activeLogement.prix,
        arrivee,
        depart: depart || undefined,
        prenom,
        nom,
        email,
        telephone,
        confirmUrl: buildConfirmUrl(result.id, result.confirmToken),
        reservationRef: buildReservationRef(result.id),
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof ReservationUnavailableError
          ? err.message
          : 'Impossible d\'enregistrer la demande. Vérifiez la connexion ou contactez-nous par téléphone.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-modal-title"
      >
        <div
          className="admin-card max-h-[90vh] w-full max-w-md overflow-y-auto p-5 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="section-label">Réservation</p>
              <h2 id="reservation-modal-title" className="mt-1 text-lg font-semibold text-brand-dark">
                {activeLogement.nom}
              </h2>
              <p className="mt-1 text-xs text-brand-muted">
                WhatsApp s'ouvrira avec votre demande. Après accord, l'équipe confirme via le lien inclus.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-brand-gray"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {availability?.available && arrivee && (
            <p className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Ces dates sont disponibles.
            </p>
          )}

          {datesUnavailable && availability && (
            <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
              <p>{getUnavailableMessage(availability)}</p>
              <button
                type="button"
                onClick={() => setShowAlternatives(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                Voir ce qui est disponible
              </button>
            </div>
          )}

          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-brand-red">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">Prénom</label>
                <input className="form-input" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">Nom</label>
                <input className="form-input" value={nom} onChange={(e) => setNom(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">Téléphone</label>
              <input className="form-input" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">Email (optionnel)</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">Arrivée</label>
                <input
                  ref={arriveeRef}
                  className="form-input"
                  type="date"
                  min={todayIso()}
                  value={arrivee}
                  onChange={(e) => setArrivee(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
                  Départ <span className="normal-case tracking-normal text-brand-muted/70">(opt.)</span>
                </label>
                <input
                  className="form-input"
                  type="date"
                  min={arrivee || todayIso()}
                  value={depart}
                  onChange={(e) => setDepart(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || datesUnavailable || !arrivee}
              className="btn-accent mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              <MessageCircle className="h-4 w-4" />
              {loading ? 'Enregistrement…' : 'Enregistrer et ouvrir WhatsApp'}
            </button>
          </form>
        </div>
      </div>

      <UnavailableAlternativesModal
        open={showAlternatives}
        onClose={() => setShowAlternatives(false)}
        arrivee={arrivee}
        depart={depart || undefined}
        currentLogementNom={activeLogement.nom}
        alternatives={alternatives}
        onChangeDates={() => {
          setShowAlternatives(false);
          arriveeRef.current?.focus();
        }}
        onReserveAlternative={(alternative) => {
          setActiveLogement({
            id: alternative.id,
            nom: alternative.nom,
            type: alternative.type,
            prix: alternative.prix,
          });
          setShowAlternatives(false);
          setError('');
        }}
      />
    </>
  );
}
