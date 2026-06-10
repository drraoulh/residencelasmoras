import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import LogementCard from '../../components/properties/LogementCard';
import { useLocalStorageStore } from '../../hooks/useLocalStorageStore';

export default function LogementsList() {
  const { logements } = useLocalStorageStore();
  const [filterType, setFilterType] = useState('Tous');
  const [maxBudget, setMaxBudget] = useState('');

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

  return (
    <div className="min-h-screen bg-brand-gray px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-10 sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Notre catalogue de <span className="text-brand-red">résidences</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:mx-0 sm:text-lg">
            Découvrez notre sélection d'appartements et studios haut de gamme à Yaoundé.
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:mb-10 sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-2 font-semibold text-brand-dark">
              <Filter className="h-5 w-5 text-brand-red" />
              <span>Filtres de recherche</span>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-[220px_220px]">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Type de bien</label>
                <select
                  className="h-11 w-full rounded-lg bg-gray-50 px-4 text-sm font-medium outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red"
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
                <label className="mb-2 block text-sm font-medium text-gray-700">Budget max</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="ex: 100000"
                    className="h-11 w-full rounded-lg bg-gray-50 px-4 pl-10 text-sm font-medium outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red"
                    value={maxBudget}
                    onChange={(event) => setMaxBudget(event.target.value)}
                  />
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredLogements.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredLogements.map((logement) => (
              <LogementCard key={logement.id} logement={logement} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white px-6 py-12 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-lg font-bold text-brand-dark">Aucun logement ne correspond à ces filtres.</p>
            <p className="mt-2 text-gray-600">Essayez un autre type de logement ou augmentez le budget.</p>
          </div>
        )}
      </div>
    </div>
  );
}
