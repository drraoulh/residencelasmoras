import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Filter, Search, X } from 'lucide-react';
import CtaBanner from '../../components/ui/CtaBanner';
import LogementCard from '../../components/properties/LogementCard';
import { useAvailabilitySlots } from '../../hooks/useAvailabilitySlots';
import { useLogements } from '../../hooks/useLogements';
import { formatSearchPeriod, getLogementAvailability } from '../../utils/availability';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function LogementsList() {
  const { logements } = useLogements();
  const { slots } = useAvailabilitySlots();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterType, setFilterType] = useState(searchParams.get('type') ?? 'Tous');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('budget') ?? '');
  const [dateArrivee, setDateArrivee] = useState(searchParams.get('arrivee') ?? '');
  const [dateDepart, setDateDepart] = useState(searchParams.get('depart') ?? '');

  useEffect(() => {
    setFilterType(searchParams.get('type') ?? 'Tous');
    setDateArrivee(searchParams.get('arrivee') ?? '');
    setDateDepart(searchParams.get('depart') ?? '');
  }, [searchParams]);

  const propertyTypes = useMemo(
    () => Array.from(new Set(logements.map((logement) => logement.type))),
    [logements],
  );

  const hasDateSearch = Boolean(
    dateArrivee && (!dateDepart || dateDepart > dateArrivee),
  );

  const filteredLogements = useMemo(() => {
    const budget = Number(maxBudget);

    const rows = logements
      .filter((logement) => {
        const matchesType = filterType === 'Tous' || logement.type === filterType;
        const matchesBudget = !maxBudget || logement.prix <= budget;
        return matchesType && matchesBudget;
      })
      .map((logement) => ({
        logement,
        availability: hasDateSearch
          ? getLogementAvailability(logement, slots, dateArrivee, dateDepart || undefined)
          : undefined,
      }));

    if (hasDateSearch) {
      return rows.sort((a, b) => {
        const aAvailable = a.availability?.available ?? false;
        const bAvailable = b.availability?.available ?? false;
        if (aAvailable === bAvailable) {
          return a.logement.nom.localeCompare(b.logement.nom, 'fr');
        }
        return aAvailable ? -1 : 1;
      });
    }

    return rows;
  }, [dateArrivee, dateDepart, filterType, hasDateSearch, logements, maxBudget, slots]);

  const availableCount = filteredLogements.filter((row) => row.availability?.available).length;

  const hasFilters =
    filterType !== 'Tous' || maxBudget !== '' || dateArrivee !== '' || dateDepart !== '';

  const applyDateSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (filterType !== 'Tous') params.set('type', filterType);
    else params.delete('type');
    if (maxBudget) params.set('budget', maxBudget);
    else params.delete('budget');
    if (dateArrivee) params.set('arrivee', dateArrivee);
    else params.delete('arrivee');
    if (dateDepart) params.set('depart', dateDepart);
    else params.delete('depart');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilterType('Tous');
    setMaxBudget('');
    setDateArrivee('');
    setDateDepart('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-brand-gray">
      <section className="bg-brand-dark px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="section-label mb-3 text-red-400">Catalogue</p>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Nos <span className="text-brand-red">résidences</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
            Découvrez notre sélection d'appartements et studios haut de gamme à Yaoundé.
          </p>
          {hasDateSearch && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <CalendarDays className="h-4 w-4 text-brand-red" />
              <span>{formatSearchPeriod(dateArrivee, dateDepart || undefined)}</span>
              <span className="text-white/70">
                · {availableCount} disponible{availableCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:mb-10">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 font-semibold text-brand-dark">
              <Filter className="h-5 w-5 text-brand-red" />
              <span>Filtres de recherche</span>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-2 inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                  Effacer
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Arrivée</label>
                <input
                  type="date"
                  className="form-input h-11 text-sm"
                  value={dateArrivee}
                  min={todayIso()}
                  onChange={(event) => setDateArrivee(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Départ <span className="font-normal text-gray-400">(optionnel)</span>
                </label>
                <input
                  type="date"
                  className="form-input h-11 text-sm"
                  value={dateDepart}
                  min={dateArrivee || todayIso()}
                  onChange={(event) => setDateDepart(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Type de bien</label>
                <select
                  className="form-input h-11 text-sm"
                  value={filterType}
                  onChange={(event) => setFilterType(event.target.value)}
                >
                  <option value="Tous">Tous les types</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Budget max (FCFA)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="ex: 100 000"
                    className="form-input h-11 pl-10 text-sm"
                    value={maxBudget}
                    onChange={(event) => setMaxBudget(event.target.value)}
                  />
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <button type="button" onClick={applyDateSearch} className="btn-primary">
                <CalendarDays className="h-4 w-4" />
                Vérifier les disponibilités
              </button>
            </div>
          </div>
        </div>

        <p className="mb-6 text-sm font-medium text-gray-500">
          {filteredLogements.length} logement{filteredLogements.length > 1 ? 's' : ''} trouvé
          {filteredLogements.length > 1 ? 's' : ''}
          {hasDateSearch &&
            ` · ${availableCount} disponible${availableCount > 1 ? 's' : ''} sur la période`}
        </p>

        {filteredLogements.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredLogements.map(({ logement, availability }) => (
              <LogementCard
                key={logement.id}
                logement={logement}
                availability={availability}
                arrivee={hasDateSearch ? dateArrivee : undefined}
                depart={hasDateSearch ? dateDepart : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-xl font-bold text-brand-dark">Aucun logement ne correspond à ces filtres.</p>
            <p className="mt-2 text-gray-600">Essayez d'autres dates, un autre type ou augmentez le budget.</p>
            <button type="button" onClick={clearFilters} className="btn-primary mt-6">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      <CtaBanner />
    </div>
  );
}
