import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, X } from 'lucide-react';
import CtaBanner from '../../components/ui/CtaBanner';
import LogementCard from '../../components/properties/LogementCard';
import { useLocalStorageStore } from '../../hooks/useLocalStorageStore';

export default function LogementsList() {
  const { logements } = useLocalStorageStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterType, setFilterType] = useState(searchParams.get('type') ?? 'Tous');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('budget') ?? '');

  const propertyTypes = useMemo(
    () => Array.from(new Set(logements.map((logement) => logement.type))),
    [logements],
  );

  const filteredLogements = useMemo(() => {
    const budget = Number(maxBudget);

    return logements.filter((logement) => {
      const matchesType = filterType === 'Tous' || logement.type === filterType;
      const matchesBudget = !maxBudget || logement.prix <= budget;

      return matchesType && matchesBudget;
    });
  }, [filterType, logements, maxBudget]);

  const hasFilters = filterType !== 'Tous' || maxBudget !== '';

  const clearFilters = () => {
    setFilterType('Tous');
    setMaxBudget('');
    setSearchParams({});
  };

  const arrivee = searchParams.get('arrivee');
  const depart = searchParams.get('depart');

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
          {(arrivee || depart) && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <span>
                {arrivee && `Arrivée : ${arrivee}`}
                {arrivee && depart && ' — '}
                {depart && `Départ : ${depart}`}
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:mb-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-[220px_220px]">
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
          </div>
        </div>

        <p className="mb-6 text-sm font-medium text-gray-500">
          {filteredLogements.length} logement{filteredLogements.length > 1 ? 's' : ''} trouvé
          {filteredLogements.length > 1 ? 's' : ''}
        </p>

        {filteredLogements.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredLogements.map((logement) => (
              <LogementCard key={logement.id} logement={logement} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-xl font-bold text-brand-dark">Aucun logement ne correspond à ces filtres.</p>
            <p className="mt-2 text-gray-600">Essayez un autre type de logement ou augmentez le budget.</p>
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
