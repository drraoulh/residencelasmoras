import { Link } from "react-router-dom";
import { useProperties } from "../../context/Properties";
export default function Dashboard() {
  const { logements, loading, error } = useProperties();
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Vue d’ensemble</h1>
      {loading && <p role="status">Chargement…</p>}
      {error && <p role="alert">{error}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          ["Total logements", logements.length],
          [
            "Disponibles",
            logements.filter((l) => l.statut_actuel === "disponible").length,
          ],
          [
            "Occupés",
            logements.filter((l) => l.statut_actuel === "occupe").length,
          ],
          [
            "Libérés prochainement",
            logements.filter((l) => l.statut_actuel === "libere_prochainement")
              .length,
          ],
        ].map(([label, count]) => (
          <div key={label} className="panel">
            <p>{label}</p>
            <strong className="text-4xl">
              {loading || error ? "—" : count}
            </strong>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <Link className="btn-primary" to="/admin/logements">
          Gérer les logements
        </Link>
        <Link className="btn-secondary" to="/admin/reservations">
          Consulter les demandes
        </Link>
      </div>
    </div>
  );
}
