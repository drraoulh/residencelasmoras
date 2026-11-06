import { useState } from "react";
import type { FormEvent } from "react";
import type {
  Logement,
  LogementStatus,
} from "../../components/properties/LogementCard";
import { useProperties } from "../../context/Properties";
import { supabase } from "../../lib/supabase";
import { toLogementRow } from "../../lib/logements";
const blank: Logement = {
  id: "",
  nom: "",
  type: "Appartement",
  surface: 1,
  prix_nuit: 1,
  statut_actuel: "disponible",
  photos: [],
  equipements: [],
  description: "",
};
export default function ManageLogements() {
  const { logements, loading, error, refresh } = useProperties();
  const [draft, setDraft] = useState<Logement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [equipment, setEquipment] = useState("");
  const open = (value: Logement) => {
    setDraft({ ...value, photos: [...value.photos] });
    setEquipment(value.equipements.join(", "));
    setMessage("");
  };
  const upload = async (files: FileList | null) => {
    if (!files || !draft || !supabase) return;
    setBusy(true);
    setMessage("");
    const photos: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 5 * 1024 * 1024
        )
          throw new Error(
            "Choisissez des images JPEG, PNG ou WebP de 5 Mo maximum.",
          );
      }
      for (const file of Array.from(files)) {
        const path = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
        const { error } = await supabase.storage
          .from("logements")
          .upload(path, file, { contentType: file.type });
        if (error) throw error;
        photos.push(
          supabase.storage.from("logements").getPublicUrl(path).data.publicUrl,
        );
      }
    } catch {
      setMessage(
        "Importation interrompue. Vérifiez le format (JPEG, PNG, WebP), la taille (5 Mo max) et les permissions de stockage.",
      );
    } finally {
      setDraft((current) =>
        current
          ? { ...current, photos: [...current.photos, ...photos] }
          : current,
      );
      setBusy(false);
    }
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft || !supabase || busy) return;
    if (!draft.photos.length) {
      setMessage("Ajoutez au moins une photo.");
      return;
    }
    setBusy(true);
    setMessage("");
    const { id, ...values } = draft;
    const payload = toLogementRow({
      ...values,
      equipements: [
        ...new Set(
          equipment
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        ),
      ],
    });
    const result = id
      ? await supabase
          .from("logements")
          .update(payload)
          .eq("id", id)
          .select("id")
          .single()
      : await supabase.from("logements").insert(payload).select("id").single();
    if (result.error)
      setMessage(
        "Enregistrement impossible. Vérifiez votre connexion et vos droits.",
      );
    else {
      setDraft(null);
      setMessage("Logement enregistré. Il est visible sur le site.");
      await refresh();
    }
    setBusy(false);
  };
  const remove = async (logement: Logement) => {
    if (
      !supabase ||
      busy ||
      !window.confirm(
        `Supprimer définitivement « ${logement.nom} » ? Il disparaîtra du site. Cette action est irréversible.`,
      )
    )
      return;
    setBusy(true);
    const { error } = await supabase
      .from("logements")
      .delete()
      .eq("id", logement.id)
      .select("id")
      .single();
    setMessage(
      error
        ? "Suppression impossible. Le logement a été conservé."
        : "Logement supprimé.",
    );
    if (!error) await refresh();
    setBusy(false);
  };
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-3xl font-bold">Gestion des logements</h1>
        <button
          className="btn-primary"
          onClick={() => open(blank)}
          disabled={busy}
        >
          Ajouter un logement
        </button>
      </div>
      <p>
        La première photo est l’image principale affichée sur l’accueil, le
        catalogue et la fiche du logement.
      </p>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      {error && (
        <p role="alert">
          {error} <button onClick={() => void refresh()}>Réessayer</button>
        </p>
      )}
      {draft && (
        <section className="panel" aria-labelledby="editor-title">
          <h2 id="editor-title" className="text-2xl font-bold mb-6">
            {draft.id ? "Modifier le logement" : "Nouveau logement"}
          </h2>
          <form onSubmit={save} className="space-y-5">
            <fieldset disabled={busy} className="grid sm:grid-cols-2 gap-5">
              <label>
                Nom
                <input
                  required
                  maxLength={150}
                  value={draft.nom}
                  onChange={(e) => setDraft({ ...draft, nom: e.target.value })}
                />
              </label>
              <label>
                Type
                <select
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                >
                  {["Appartement", "Studio", "Villa", "Chambre"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                Surface (m²)
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={draft.surface}
                  onChange={(e) =>
                    setDraft({ ...draft, surface: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Prix par nuit (FCFA)
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={draft.prix_nuit}
                  onChange={(e) =>
                    setDraft({ ...draft, prix_nuit: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Disponibilité
                <select
                  value={draft.statut_actuel}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      statut_actuel: e.target.value as LogementStatus,
                    })
                  }
                >
                  <option value="disponible">Disponible</option>
                  <option value="occupe">Occupé</option>
                  <option value="libere_prochainement">
                    Libéré prochainement
                  </option>
                </select>
              </label>
              {draft.statut_actuel === "libere_prochainement" && (
                <label>
                  Date de libération
                  <input
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    required
                    value={draft.date_liberation ?? ""}
                    onChange={(e) =>
                      setDraft({ ...draft, date_liberation: e.target.value })
                    }
                  />
                </label>
              )}
              <label className="sm:col-span-2">
                Description
                <textarea
                  rows={4}
                  required
                  value={draft.description ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                />
              </label>
              <label className="sm:col-span-2">
                Équipements (séparés par des virgules)
                <input
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                />
              </label>
              <label>
                Ajouter des photos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    void upload(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </fieldset>
            <div className="flex flex-wrap gap-4">
              {draft.photos.map((photo, index) => (
                <div key={photo} className="w-40 space-y-2">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="h-28 w-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    className="text-sm underline"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        photos: [
                          photo,
                          ...draft.photos.filter((p) => p !== photo),
                        ],
                      })
                    }
                  >
                    {index === 0
                      ? "Photo principale"
                      : "Définir comme principale"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    className="block text-red-700"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        photos: draft.photos.filter((p) => p !== photo),
                      })
                    }
                  >
                    Retirer la photo
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button disabled={busy} className="btn-primary">
                {busy ? "Traitement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                disabled={busy}
                className="btn-secondary"
                onClick={() => {
                  if (
                    window.confirm(
                      "Fermer le formulaire et abandonner les modifications non enregistrées ?",
                    )
                  )
                    setDraft(null);
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </section>
      )}
      {loading ? (
        <p role="status">Chargement…</p>
      ) : (
        <div className="grid gap-4">
          {logements.map((log) => (
            <article
              key={log.id}
              className="panel flex flex-wrap items-center gap-5"
            >
              <img
                src={log.photos[0]}
                alt={log.nom}
                className="w-28 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="font-bold text-xl">{log.nom}</h2>
                <p>
                  {log.type} · {log.surface} m² ·{" "}
                  {log.prix_nuit.toLocaleString("fr-FR")} FCFA / nuit
                </p>
                <p>
                  {
                    {
                      disponible: "Disponible",
                      occupe: "Occupé",
                      libere_prochainement: "Libéré prochainement",
                    }[log.statut_actuel]
                  }
                </p>
              </div>
              <button
                disabled={busy}
                className="btn-secondary"
                onClick={() => open(log)}
              >
                Modifier
              </button>
              <button
                disabled={busy}
                className="text-red-700 font-bold"
                onClick={() => void remove(log)}
              >
                Supprimer
              </button>
            </article>
          ))}
          {!error && logements.length === 0 && (
            <p>Aucun logement. Ajoutez votre premier logement.</p>
          )}
        </div>
      )}
    </div>
  );
}
