import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import LogementCard from "../../components/properties/LogementCard";
import { useProperties } from "../../context/Properties";
import { Filter, Search } from "lucide-react";

export default function LogementsList() {
  const { logements, loading, error, refresh } = useProperties();
  const [params] = useSearchParams();
  const [filterType, setFilterType] = useState(params.get("type") ?? "Tous");
  const [maxBudget, setMaxBudget] = useState("");

  const filteredLogements = useMemo(() => {
    const budget = Number(maxBudget);

    return logements.filter((logement) => {
      const matchesType = filterType === "Tous" || logement.type === filterType;
      const matchesBudget = !maxBudget || logement.prix_nuit <= budget;

      return matchesType && matchesBudget;
    });
  }, [filterType, maxBudget, logements]);

  return (
    <div className="min-h-screen bg-brand-gray px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-10 sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
            Notre Catalogue de{" "}
            <span className="text-brand-red">Résidences</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:mx-0 sm:text-lg">
            Découvrez notre sélection exclusive d'appartements et studios haut
            de gamme à Yaoundé.
          </p>
        </div>

        {(params.get("arrivee") || params.get("depart")) && (
          <p className="notice mb-4">
            Dates souhaitées : {params.get("arrivee") || "à préciser"} →{" "}
            {params.get("depart") || "à préciser"}. La disponibilité sera
            confirmée par notre équipe.
          </p>
        )}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mb-10 sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-2 font-semibold text-brand-dark">
              <Filter className="h-5 w-5 text-brand-red" />
              <span>Filtres de recherche</span>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-[220px_220px]">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type de bien
                </label>
                <select
                  className="h-11 w-full rounded-xl bg-gray-50 px-4 text-sm font-medium outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="Tous">Tous les types</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Studio">Studio</option>
                  <option value="Villa">Villa</option>
                  <option value="Chambre">Chambre</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Budget max
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="ex: 100000"
                    className="h-11 w-full rounded-xl bg-gray-50 px-4 pl-10 text-sm font-medium outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-brand-red"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <p role="status">Chargement des logements…</p>
        ) : error ? (
          <div role="alert">
            {error} <button onClick={() => void refresh()}>Réessayer</button>
          </div>
        ) : filteredLogements.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredLogements.map((logement) => (
              <LogementCard key={logement.id} logement={logement} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-lg font-bold text-brand-dark">
              Aucun logement ne correspond à ces filtres.
            </p>
            <p className="mt-2 text-gray-600">
              Essayez un autre type de logement ou augmentez le budget.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
