import { Link } from 'react-router-dom';
import { ArrowRight, CalendarX, Home, MessageCircle, X } from 'lucide-react';
import type { Logement } from '../../types';
import { getLogementPhoto } from '../../utils/logementPhoto';
import { buildCatalogueSearchParams, formatSearchPeriod } from '../../utils/availability';

interface UnavailableAlternativesModalProps {
  open: boolean;
  onClose: () => void;
  arrivee: string;
  depart?: string;
  currentLogementNom?: string;
  alternatives: Logement[];
  onChangeDates: () => void;
  onReserveAlternative: (logement: Logement) => void;
}

export default function UnavailableAlternativesModal({
  open,
  onClose,
  arrivee,
  depart,
  currentLogementNom,
  alternatives,
  onChangeDates,
  onReserveAlternative,
}: UnavailableAlternativesModalProps) {
  if (!open) return null;

  const catalogueUrl = `/catalogue?${buildCatalogueSearchParams({ arrivee, depart }).toString()}`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="admin-card max-h-[90vh] w-full max-w-lg overflow-y-auto p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <CalendarX className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-brand-dark">Dates indisponibles</h2>
              <p className="mt-1 text-sm text-brand-muted">
                {currentLogementNom
                  ? `${currentLogementNom} n'est pas libre`
                  : 'Ce logement n\'est pas libre'}{' '}
                pour {formatSearchPeriod(arrivee, depart)}.
              </p>
            </div>
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

        {alternatives.length > 0 ? (
          <>
            <p className="mb-3 text-sm font-medium text-brand-dark">
              Logements disponibles aux mêmes dates :
            </p>
            <ul className="space-y-2">
              {alternatives.map((logement) => (
                <li
                  key={logement.id}
                  className="flex items-center gap-3 rounded-xl border border-stone-200/80 bg-white p-3"
                >
                  <img
                    src={getLogementPhoto(logement.photos, logement.id)}
                    alt={logement.nom}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-brand-dark">{logement.nom}</p>
                    <p className="text-xs text-brand-muted">
                      {logement.type} · {logement.prix.toLocaleString('fr-FR')} FCFA / nuit
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onReserveAlternative(logement)}
                    className="btn-accent shrink-0 !px-3 !py-2 text-xs"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Réserver
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="rounded-xl bg-brand-gray px-4 py-4 text-sm text-brand-muted">
            <Home className="mb-2 h-5 w-5 text-brand-red" />
            Aucun autre logement n'est libre sur cette période. Essayez d'autres dates.
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onChangeDates} className="btn-secondary flex-1">
            Changer mes dates
          </button>
          <Link to={catalogueUrl} onClick={onClose} className="btn-ghost flex-1 justify-center">
            Voir le catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
