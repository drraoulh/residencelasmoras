import { useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Home, Loader2, Lock, XCircle } from 'lucide-react';
import BrandName from '../../components/ui/BrandName';
import { confirmReservationByToken } from '../../utils/confirmReservation';

type ConfirmState = 'pin' | 'loading' | 'success' | 'already' | 'invalid' | 'error';

const CONFIRM_PIN = import.meta.env.VITE_CONFIRM_PIN ?? '';

export default function ConfirmReservation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const queryClient = useQueryClient();
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [state, setState] = useState<ConfirmState>(() => {
    if (!id || !token) return 'invalid';
    if (!CONFIRM_PIN) return 'error';
    return 'pin';
  });

  const handleConfirm = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !token) return;

    setPinError('');
    if (pin.trim() !== CONFIRM_PIN) {
      setPinError('Code incorrect. Réservé à l\'équipe LAS MORAS.');
      return;
    }

    setState('loading');
    try {
      const confirmed = await confirmReservationByToken(id, token);
      if (confirmed) {
        await queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
        await queryClient.invalidateQueries({ queryKey: ['reservations'] });
        setState('success');
      } else {
        setState('already');
      }
    } catch {
      setState('error');
    }
  };

  const title =
    state === 'pin'
      ? 'Confirmation équipe'
      : state === 'loading'
        ? 'Confirmation en cours…'
        : state === 'success'
          ? 'Réservation confirmée'
          : state === 'already'
            ? 'Déjà confirmée'
            : state === 'invalid'
              ? 'Lien invalide'
              : 'Erreur de confirmation';

  const message =
    state === 'pin'
      ? 'Entrez le code équipe pour fermer les dates sur le site après accord WhatsApp.'
      : state === 'loading'
        ? 'Les disponibilités en ligne sont en cours de mise à jour.'
        : state === 'success'
          ? 'Les dates sont maintenant fermées sur le site.'
          : state === 'already'
            ? 'Cette réservation a déjà été confirmée ou le lien n\'est plus valide.'
            : state === 'invalid'
              ? 'Ce lien de confirmation est incomplet ou incorrect.'
              : 'Impossible de confirmer pour le moment. Réessayez ou confirmez depuis l\'administration.';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-gray px-4 py-16 text-center">
      <BrandName size="lg" className="mb-10" />

      <div className="admin-card w-full max-w-md p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-gray-100">
          {state === 'pin' && <Lock className="h-7 w-7 text-brand-red" />}
          {state === 'loading' && <Loader2 className="h-7 w-7 animate-spin text-brand-red" />}
          {(state === 'success' || state === 'already') && (
            <CheckCircle className="h-7 w-7 text-green-600" />
          )}
          {(state === 'invalid' || state === 'error') && (
            <XCircle className="h-7 w-7 text-brand-red" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-brand-dark">{title}</h1>
        <p className="mt-3 text-sm text-gray-600">{message}</p>

        {state === 'pin' && (
          <form onSubmit={handleConfirm} className="mt-6 text-left">
            <label className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
              Code équipe
            </label>
            <input
              className="form-input text-center text-lg tracking-[0.3em]"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              required
            />
            {pinError && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-brand-red">
                {pinError}
              </p>
            )}
            <button type="submit" className="btn-accent mt-4 w-full">
              Confirmer la réservation
            </button>
          </form>
        )}

        {state !== 'loading' && state !== 'pin' && (
          <Link to="/admin/reservations" className="btn-primary mt-8 w-full">
            Voir les réservations
          </Link>
        )}
      </div>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-brand-red"
      >
        <Home className="h-4 w-4" />
        Retour au site
      </Link>
    </main>
  );
}
