import { useEffect, useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageCircle, X } from 'lucide-react';
import { buildConfirmUrl, buildReservationRef } from '../../utils/confirmReservation';
import { createReservationRequest } from '../../utils/reservationRequest';
import { openReservationWhatsApp } from '../../utils/whatsapp';

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
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [arrivee, setArrivee] = useState(initialArrivee);
  const [depart, setDepart] = useState(initialDepart);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setArrivee(initialArrivee);
      setDepart(initialDepart);
      setError('');
    }
  }, [open, initialArrivee, initialDepart]);

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

    setLoading(true);
    try {
      const result = await createReservationRequest({
        logementId,
        logementNom,
        prenom,
        nom,
        email,
        telephone,
        dateArrivee: arrivee,
        dateDepart: depart || undefined,
        prixParNuit,
      });

      await queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
      await queryClient.invalidateQueries({ queryKey: ['reservations'] });

      openReservationWhatsApp({
        logementNom,
        logementType,
        prix: prixParNuit,
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
    } catch {
      setError('Impossible d\'enregistrer la demande. Vérifiez la connexion ou contactez-nous par téléphone.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              {logementNom}
            </h2>
            <p className="mt-1 text-xs text-brand-muted">
              WhatsApp s'ouvrira avec votre demande. Après accord, l'équipe confirme via le lien inclus — les dates se ferment alors en ligne.
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

          <button type="submit" disabled={loading} className="btn-accent mt-2 w-full disabled:opacity-60">
            <MessageCircle className="h-4 w-4" />
            {loading ? 'Enregistrement…' : 'Enregistrer et ouvrir WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}
