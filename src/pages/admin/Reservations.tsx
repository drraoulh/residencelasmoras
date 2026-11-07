import { Search, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
type Reservation = {
  id: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  date_arrivee: string;
  date_depart: string;
  statut_reservation: string;
  logements: { nom: string } | null;
};
export default function Reservations() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [rows, setRows] = useState<Reservation[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("reservations")
      .select("*, logements(nom)")
      .order("created_at", { ascending: false });
    if (error) setMessage("Impossible de charger les demandes.");
    else setRows(data ?? []);
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const update = async (id: string, statut: string) => {
    if (
      statut === "annulee" &&
      !window.confirm("Annuler cette demande de réservation ?")
    )
      return;
    setBusy(true);
    const { error } = await supabase!
      .from("reservations")
      .update({ statut_reservation: statut })
      .eq("id", id)
      .select("id")
      .single();
    setMessage(error ? "Modification impossible." : "Statut enregistré.");
    if (!error) await load();
    setBusy(false);
  };
  const filtered = rows.filter(
    (row) =>
      `${row.client_nom} ${row.logements?.nom ?? ""}`
        .toLocaleLowerCase("fr")
        .includes(query.toLocaleLowerCase("fr")) &&
      (filter === "all" || row.statut_reservation === filter),
  );
  return (
    <div className="admin-page space-y-6">
      <div>
        <p className="admin-eyebrow">LES SÉJOURS DE VOS CLIENTS</p>
        <h1>Demandes de réservation</h1>
      </div>
      <p className="admin-description">
        Le statut confirme le suivi de la demande. Vérifiez les dates avant de
        confirmer et mettez à jour la disponibilité du logement séparément.
      </p>
      {message && <p role="status">{message}</p>}
      <button className="btn-secondary" onClick={() => void load()}>
        <RefreshCw size={14} /> Actualiser
      </button>
      <div className="admin-filterbar">
        <label className="admin-search">
          <Search size={17} />
          <input
            aria-label="Rechercher une réservation"
            placeholder="Un client, un logement…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filtrer les réservations"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="demande">En attente</option>
          <option value="confirmee">Confirmées</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminées</option>
          <option value="annulee">Annulées</option>
        </select>
        <span className="admin-filter-count">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </span>
      </div>
      {filtered.map((r) => (
        <article
          className="panel flex flex-wrap gap-5 justify-between"
          key={r.id}
        >
          <div>
            <h2 className="font-bold">
              {r.client_nom} — {r.logements?.nom ?? "Logement supprimé"}
            </h2>
            <p>
              {r.date_arrivee} → {r.date_depart}
            </p>
            <a href={`mailto:${r.client_email}`}>{r.client_email}</a>
            <p>{r.client_telephone}</p>
          </div>
          <label>
            Statut
            <select
              disabled={busy}
              value={r.statut_reservation}
              onChange={(e) => void update(r.id, e.target.value)}
            >
              <option value="demande">En attente</option>
              <option value="confirmee">Confirmée</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
          </label>
        </article>
      ))}
      {rows.length > 0 && filtered.length === 0 && (
        <p className="panel">
          Aucune réservation ne correspond à votre recherche.
        </p>
      )}
      {!rows.length && !message && <p>Aucune demande.</p>}
    </div>
  );
}
