import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
type Message = {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  lu: boolean;
  created_at: string;
};
export default function Messages() {
  const [rows, setRows] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    setError(error ? "Impossible de charger les messages." : "");
    if (!error) setRows(data ?? []);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  const mark = async (row: Message) => {
    if (!supabase || busy) return;
    setBusy(true);
    const { error } = await supabase
      .from("contacts")
      .update({ lu: !row.lu })
      .eq("id", row.id)
      .select("id")
      .single();
    setBusy(false);
    if (error) setError("Impossible de modifier ce message.");
    else await load();
  };
  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Messages des visiteurs</h1>
      {error && <p role="alert">{error}</p>}
      <button className="btn-secondary" onClick={() => void load()}>
        Actualiser
      </button>
      {loading ? (
        <p role="status">Chargement…</p>
      ) : rows.length === 0 && !error ? (
        <p>Aucun message.</p>
      ) : (
        rows.map((row) => (
          <article className="panel space-y-4" key={row.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{row.sujet}</h2>
                <p>
                  {row.nom} ·{" "}
                  <a className="underline" href={`mailto:${row.email}`}>
                    {row.email}
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(row.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
              <button
                disabled={busy}
                className="btn-secondary"
                onClick={() => void mark(row)}
              >
                {row.lu ? "Marquer non lu" : "Marquer comme lu"}
              </button>
            </div>
            <p className="whitespace-pre-wrap break-words">{row.message}</p>
          </article>
        ))
      )}
    </section>
  );
}
