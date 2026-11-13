import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Search } from 'lucide-react';
import LogementActions from '../ui/LogementActions';
import { useAvailabilitySlots } from '../../hooks/useAvailabilitySlots';
import { useLogementsList } from '../../hooks/useLogementsList';
import type { Logement } from '../../types';
import {
  buildCatalogueSearchParams,
  formatDateFr,
  formatSearchPeriod,
  getLogementAvailability,
  type AvailabilityResult,
} from '../../utils/availability';
import { getLogementPhoto } from '../../utils/logementPhoto';

interface SearchResult {
  logement: Logement;
  availability?: AvailabilityResult;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function HeroSearchBar() {
  const navigate = useNavigate();
  const [arrivee, setArrivee] = useState('');
  const [depart, setDepart] = useState('');
  const [type, setType] = useState('Tous');
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { logements, isLoading: logementsLoading } = useLogementsList();
  const hasArrivalSearch = Boolean(arrivee);
  const { slots, isLoading: slotsLoading } = useAvailabilitySlots({
    enabled: hasArrivalSearch,
  });

  const types = useMemo(
    () => Array.from(new Set(logements.map((logement) => logement.type))),
    [logements],
  );

  const isSearching = logementsLoading || (hasSearched && hasArrivalSearch && slotsLoading);

  const results = useMemo<SearchResult[]>(() => {
    if (!hasSearched || (hasArrivalSearch && slotsLoading)) return [];

    return logements
      .filter((logement) => type === 'Tous' || logement.type === type)
      .map((logement) => ({
        logement,
        availability: hasArrivalSearch
          ? getLogementAvailability(logement, slots, arrivee, depart || undefined)
          : undefined,
      }))
      .sort((a, b) => {
        if (!hasArrivalSearch) {
          return a.logement.nom.localeCompare(b.logement.nom, 'fr');
        }
        const aAvailable = a.availability?.available ?? false;
        const bAvailable = b.availability?.available ?? false;
        if (aAvailable === bAvailable) {
          return a.logement.nom.localeCompare(b.logement.nom, 'fr');
        }
        return aAvailable ? -1 : 1;
      });
  }, [
    arrivee,
    depart,
    hasArrivalSearch,
    hasSearched,
    logements,
    slots,
    slotsLoading,
    type,
  ]);

  const validate = () => {
    if (depart && !arrivee) return 'Choisissez une date d\'arrivée.';
    if (arrivee && depart && depart <= arrivee) {
      return 'La date de départ doit être après la date d\'arrivée.';
    }
    return '';
  };

  const runSearch = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setHasSearched(false);
      return;
    }

    setError('');
    setHasSearched(true);
  };

  const goToCatalogue = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const params = buildCatalogueSearchParams({ type, arrivee, depart: depart || undefined });
    navigate(`/catalogue${params.toString() ? `?${params}` : ''}`);
  };

  const availableCount = results.filter((result) => result.availability?.available).length;

  return (
    <div className="rounded-xl bg-brand-gray/50 p-3 sm:p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          runSearch();
        }}
      >
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <div className="min-w-0">
            <label htmlFor="hero-arrivee" className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
              Arrivée
            </label>
            <input
              id="hero-arrivee"
              type="date"
              value={arrivee}
              min={todayIso()}
              onChange={(event) => {
                setArrivee(event.target.value);
                setHasSearched(false);
                setError('');
              }}
              className="form-input"
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="hero-depart" className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
              Départ <span className="normal-case tracking-normal text-brand-muted/70">(optionnel)</span>
            </label>
            <input
              id="hero-depart"
              type="date"
              value={depart}
              min={arrivee || todayIso()}
              onChange={(event) => {
                setDepart(event.target.value);
                setHasSearched(false);
                setError('');
              }}
              className="form-input"
            />
          </div>

          <div className="min-w-0 min-[480px]:col-span-2 lg:col-span-1">
            <label htmlFor="hero-type" className="mb-1.5 block text-[11px] uppercase tracking-widest text-brand-muted">
              Type
            </label>
            <select
              id="hero-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="form-input"
            >
              <option value="Tous">Tous</option>
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="btn-primary h-11 w-full min-[480px]:col-span-2 lg:col-span-1 lg:w-auto disabled:opacity-60"
          >
            <Search className="h-4 w-4" />
            {isSearching ? 'Chargement…' : 'Vérifier les disponibilités'}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-brand-red">
          {error}
        </p>
      )}

      {hasSearched && !error && !isSearching && (
        <div className="mt-4 rounded-xl border border-stone-200/80 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-brand-dark">
                {hasArrivalSearch
                  ? availableCount > 0
                    ? `${availableCount} logement${availableCount > 1 ? 's' : ''} disponible${availableCount > 1 ? 's' : ''}`
                    : 'Aucun logement disponible sur cette période'
                  : `${results.length} logement${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`}
              </p>
              {hasArrivalSearch && (
                <p className="mt-1 text-xs text-brand-muted">
                  {formatSearchPeriod(arrivee, depart || undefined)}
                  {type !== 'Tous' ? ` · ${type}` : ''}
                </p>
              )}
            </div>
            <button type="button" onClick={goToCatalogue} className="btn-ghost shrink-0 text-xs">
              Voir le catalogue
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {results.map(({ logement, availability }) => {
              const detailParams = buildCatalogueSearchParams({
                arrivee,
                depart: depart || undefined,
              });
              const detailUrl = `/logements/${logement.id}${detailParams.toString() ? `?${detailParams}` : ''}`;
              const showReserve = !hasArrivalSearch || availability?.available;

              return (
                <div
                  key={logement.id}
                  className="rounded-xl border border-stone-200/70 p-3 sm:p-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <img
                      src={getLogementPhoto(logement.photos, logement.id)}
                      alt={logement.nom}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-14 sm:w-14"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-brand-dark sm:truncate">{logement.nom}</p>
                      <p className="mt-0.5 text-xs text-brand-muted">
                        {logement.type} · {logement.prix.toLocaleString('fr-FR')} FCFA / nuit
                      </p>

                      {hasArrivalSearch && availability && (
                        <div className="mt-2">
                          {availability.available ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                              <CalendarCheck className="h-3 w-3" />
                              Disponible
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800">
                                {availability.reason ?? 'Indisponible'}
                              </span>
                              {availability.nextAvailableFrom && (
                                <p className="mt-1 text-[11px] leading-snug text-brand-muted">
                                  Disponible à partir du {formatDateFr(availability.nextAvailableFrom)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <LogementActions
                    className="mt-3 border-t border-stone-100 pt-3"
                    logementId={logement.id}
                    logementNom={logement.nom}
                    logementType={logement.type}
                    prixParNuit={logement.prix}
                    detailUrl={detailUrl}
                    arrivee={arrivee || undefined}
                    depart={depart || undefined}
                    showReserve={showReserve}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
