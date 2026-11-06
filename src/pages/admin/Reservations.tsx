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
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Demandes de réservation</h1>
      <p>
        Le statut confirme le suivi de la demande. Vérifiez les dates avant de
        confirmer et mettez à jour la disponibilité du logement séparément.
      </p>
      {message && <p role="status">{message}</p>}
      <button className="btn-secondary" onClick={() => void load()}>
        Actualiser
      </button>
      {rows.map((r) => (
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
      {!rows.length && !message && <p>Aucune demande.</p>}
    </div>
  );
}
