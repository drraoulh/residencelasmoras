import { Link } from 'react-router-dom';
import type { Logement } from '../../types';
import type { AvailabilityResult } from '../../utils/availability';
import { formatDateFr } from '../../utils/availability';
import LogementActions from '../ui/LogementActions';
import { getLogementPhoto } from '../../utils/logementPhoto';

interface LogementCardProps {
  logement: Logement;
  availability?: AvailabilityResult;
  arrivee?: string;
  depart?: string;
}

export default function LogementCard({
  logement,
  availability,
  arrivee,
  depart,
}: LogementCardProps) {
  const hasDateSearch = Boolean(arrivee);
  const isUnavailableByStatut =
    logement.statut === 'occupe' || logement.statut === 'maintenance';
  const statusLabel = logement.statut === 'maintenance' ? 'Maintenance' : 'Occupé';
  const tags = logement.equipements ?? [];

  const isAvailableForDates = availability?.available ?? !isUnavailableByStatut;

  const detailParams = new URLSearchParams();
  if (arrivee) detailParams.set('arrivee', arrivee);
  if (depart) detailParams.set('depart', depart);
  const detailUrl = `/logements/${logement.id}${detailParams.toString() ? `?${detailParams}` : ''}`;
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200/60 bg-white transition hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <Link to={detailUrl} className="relative block h-52 overflow-hidden sm:h-56">
        <img
          src={getLogementPhoto(logement.photos)}
          alt={logement.nom}
          width={448}
          height={224}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
            hasDateSearch
              ? !isAvailableForDates
                ? 'opacity-75'
                : ''
              : isUnavailableByStatut
                ? 'opacity-60 grayscale'
                : ''
          }`}
        />

        {hasDateSearch ? (
          isAvailableForDates ? (
            <span className="absolute left-3 top-3 rounded-full bg-green-50 px-3 py-1 text-[11px] font-medium text-green-700 ring-1 ring-green-100">
              Disponible
            </span>
          ) : (
            <span className="absolute right-3 top-3 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-100">
              {availability?.reason ?? 'Indisponible'}
            </span>
          )
        ) : (
          <>
            {logement.statut === 'disponible' && (
              <span className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-[11px] font-medium text-brand-dark">
                Disponible
              </span>
            )}
            {isUnavailableByStatut && (
              <span className="absolute right-3 top-3 rounded-full bg-stone-900/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {statusLabel}
              </span>
            )}
          </>
        )}
      </Link>

      <div className="p-5">
        <p className="text-[11px] uppercase tracking-widest text-brand-muted">
          {logement.type}
          {logement.surface ? ` · ${logement.surface} m²` : ''}
        </p>
        <Link to={detailUrl}>
          <h3 className="mt-1 text-lg font-medium text-brand-dark transition group-hover:text-brand-red">
            {logement.nom}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-brand-muted">
          {logement.description}
        </p>

        {hasDateSearch && !isAvailableForDates && availability?.nextAvailableFrom && (
          <p className="mt-3 rounded-xl bg-brand-gray px-3 py-2 text-xs text-brand-muted">
            Disponible à partir du {formatDateFr(availability.nextAvailableFrom)}
          </p>
        )}

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

        <div className="mt-5 border-t border-stone-100 pt-4">
          <p className="text-xl font-medium text-brand-dark">
            {logement.prix.toLocaleString('fr-FR')}
            <span className="ml-1 text-xs text-brand-muted">FCFA / nuit</span>
          </p>

          <LogementActions
            className="mt-3"
            logementId={logement.id}
            logementNom={logement.nom}
            logementType={logement.type}
            prixParNuit={logement.prix}
            detailUrl={detailUrl}
            arrivee={arrivee}
            depart={depart}
            showReserve={!hasDateSearch || isAvailableForDates}
          />
        </div>
      </div>
    </article>
  );
}
