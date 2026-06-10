import { Link } from 'react-router-dom';
import type { Logement } from '../../hooks/useLocalStorageStore';

interface LogementCardProps {
  logement: Logement;
}

export default function LogementCard({ logement }: LogementCardProps) {
  const isUnavailable = logement.statut === 'occupe' || logement.statut === 'maintenance';
  const statusLabel = logement.statut === 'maintenance' ? 'En maintenance' : 'Occupé';
  const tags = logement.equipements ?? [];

  return (
    <div className="premium-card flex h-full flex-col bg-white group">
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <img
          src={logement.photos[0]}
          alt={logement.nom}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            isUnavailable ? 'brightness-50 grayscale-[20%]' : ''
          }`}
        />

        <div className="absolute right-3 top-3 z-10 flex max-w-[85%] flex-col items-end gap-2 sm:right-4 sm:top-4">
          {logement.statut === 'disponible' && (
            <span className="flex items-center gap-2 rounded-full bg-green-500 bg-opacity-90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:px-4 sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Disponible
            </span>
          )}
        </div>

        {isUnavailable && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="-rotate-45 flex w-[150%] justify-center shadow-2xl">
              <div className="w-full border-y-4 border-red-800 bg-brand-red bg-opacity-90 py-2 text-center text-lg font-black uppercase tracking-[0.18em] text-white sm:py-3 sm:text-2xl sm:tracking-[0.28em]">
                {statusLabel}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
        <div>
          <p className="mb-1 text-sm font-medium uppercase tracking-wider text-gray-500">
            {logement.type}
            {logement.surface ? ` - ${logement.surface} m²` : ''}
          </p>
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-brand-dark sm:text-xl">
            {logement.nom}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {logement.description}
          </p>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col">
            <span className="mb-0.5 text-xs font-medium text-gray-500">À partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-brand-red sm:text-2xl">
                {logement.prix.toLocaleString('fr-FR')}
              </span>
              <span className="text-sm font-bold text-brand-red">FCFA</span>
              <span className="ml-1 text-sm font-medium text-gray-400">/ nuit</span>
            </div>
          </div>

          {isUnavailable ? (
            <button
              className="w-full cursor-not-allowed rounded-xl bg-gray-100 px-5 py-2.5 font-semibold text-gray-400 sm:w-auto"
              disabled
            >
              Indisponible
            </button>
          ) : (
            <Link
              to={`/logements/${logement.id}`}
              className="w-full rounded-xl bg-brand-dark px-5 py-2.5 text-center font-semibold text-white transition-all duration-300 hover:bg-black hover:shadow-lg active:scale-95 sm:w-auto"
            >
              Voir détails
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
