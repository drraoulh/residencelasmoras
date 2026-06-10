import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Logement } from '../../hooks/useLocalStorageStore';

interface LogementCardProps {
  logement: Logement;
}

export default function LogementCard({ logement }: LogementCardProps) {
  const isUnavailable = logement.statut === 'occupe' || logement.statut === 'maintenance';
  const statusLabel = logement.statut === 'maintenance' ? 'Maintenance' : 'Occupé';
  const tags = logement.equipements ?? [];

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200/60 bg-white transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="relative h-52 overflow-hidden sm:h-56">
        <img
          src={logement.photos[0]}
          alt={logement.nom}
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
            isUnavailable ? 'opacity-60 grayscale' : ''
          }`}
        />

        {logement.statut === 'disponible' && (
          <span className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-[11px] font-medium text-brand-dark">
            Disponible
          </span>
        )}

        {isUnavailable && (
          <span className="absolute right-3 top-3 rounded-full bg-stone-900/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
            {statusLabel}
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-brand-muted">
          {logement.type}
          {logement.surface ? ` · ${logement.surface} m²` : ''}
        </p>
        <h3 className="mt-1 text-lg font-medium text-brand-dark">{logement.nom}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-muted">
          {logement.description}
        </p>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-stone-200/80 px-2.5 py-0.5 text-[11px] text-brand-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-end justify-between border-t border-stone-100 pt-4">
          <div>
            <p className="text-xl font-medium text-brand-dark">
              {logement.prix.toLocaleString('fr-FR')}
              <span className="ml-1 text-xs text-brand-muted">FCFA / nuit</span>
            </p>
          </div>

          {isUnavailable ? (
            <span className="text-xs text-brand-muted">Indisponible</span>
          ) : (
            <Link
              to={`/logements/${logement.id}`}
              className="flex items-center gap-1 text-sm text-brand-dark transition hover:gap-2"
            >
              Voir
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
