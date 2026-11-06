import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useProperties } from "../../context/Properties";
import { supabase } from "../../lib/supabase";
export default function PropertyDetails() {
  const { id } = useParams();
  const { logements, loading, error, refresh } = useProperties();
  const property = logements.find((l) => l.id === id);
  const [photo, setPhoto] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [arrival, setArrival] = useState("");
  if (loading)
    return (
      <p className="p-10" role="status">
        Chargement du logement…
      </p>
    );
  if (error)
    return (
      <div className="panel" role="alert">
        {error}
        <button onClick={() => void refresh()}>Réessayer</button>
      </div>
    );
  if (!property)
    return (
      <div className="panel">
        <h1>Ce logement n’est plus disponible.</h1>
        <Link to="/catalogue">Voir le catalogue</Link>
      </div>
    );
  const reserve = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase || !property || busy) return;
    const form = e.currentTarget;
    const values = new FormData(form);
    if (String(values.get("depart")) <= arrival) {
      setMessage("Le départ doit être postérieur à l’arrivée.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("reservations").insert({
      logement_id: property.id,
      client_nom: values.get("nom"),
      client_email: values.get("email"),
      client_telephone: values.get("telephone"),
      date_arrivee: arrival,
      date_depart: values.get("depart"),
    });
    setBusy(false);
    setMessage(
      error
        ? "Demande non envoyée. Réessayez ou contactez la résidence."
        : "Votre demande a été envoyée. Notre équipe vous contactera pour confirmer votre séjour.",
    );
    if (!error) {
      form.reset();
      setArrival("");
    }
  };
  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <Link to="/catalogue">← Retour au catalogue</Link>
      <h1 className="text-3xl font-bold">{property.nom}</h1>
      <p>
        {property.type}
        {property.surface > 0 ? ` · ${property.surface} m²` : ""} ·{" "}
        {property.statut_actuel === "occupe"
          ? "Occupé"
          : property.statut_actuel === "libere_prochainement"
            ? `Disponible à partir du ${property.date_liberation}`
            : "Disponible"}
      </p>
      <img
        src={property.photos[photo] ?? property.photos[0]}
        alt={property.nom}
        className="w-full h-80 sm:h-[480px] object-cover rounded-2xl"
      />
      <div className="flex gap-3 overflow-x-auto">
        {property.photos.map((src, index) => (
          <button
            key={src}
            onClick={() => setPhoto(index)}
            aria-label={`Voir la photo ${index + 1}`}
            aria-pressed={photo === index}
          >
            <img
              src={src}
              alt=""
              className="w-24 h-20 object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">À propos de ce logement</h2>
          <p className="whitespace-pre-line">{property.description}</p>
          <h2 className="text-2xl font-bold">Équipements</h2>
          <div className="flex flex-wrap gap-3">
            {property.equipements.map((eq) => (
              <span className="notice" key={eq}>
                {eq}
              </span>
            ))}
          </div>
        </section>
        <section className="panel space-y-5">
          <h2 className="text-2xl font-bold text-brand-red">
            {property.prix_nuit.toLocaleString("fr-FR")} FCFA / nuit
          </h2>
          <h3 className="font-bold">Demande de réservation</h3>
          {message && (
            <p role="status" className="notice">
              {message}
            </p>
          )}
          <form onSubmit={reserve} className="space-y-4">
            <fieldset
              disabled={busy || property.statut_actuel === "occupe"}
              className="space-y-4"
            >
              <label>
                Nom complet
                <input
                  name="nom"
                  required
                  maxLength={150}
                  autoComplete="name"
                />
              </label>
              <label>
                E-mail
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Téléphone
                <input
                  name="telephone"
                  type="tel"
                  autoComplete="tel"
                  required
                />
              </label>
              <label>
                Arrivée
                <input
                  type="date"
                  min={
                    property.statut_actuel === "libere_prochainement" &&
                    property.date_liberation &&
                    property.date_liberation >
                      new Date().toLocaleDateString("en-CA")
                      ? property.date_liberation
                      : new Date().toLocaleDateString("en-CA")
                  }
                  required
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                />
              </label>
              <label>
                Départ
                <input name="depart" type="date" min={arrival} required />
              </label>
              <button className="btn-primary w-full">
                {busy
                  ? "Envoi…"
                  : property.statut_actuel === "occupe"
                    ? "Indisponible"
                    : "Envoyer la demande"}
              </button>
            </fieldset>
            <p className="text-sm text-gray-500">
              La réservation sera effective après confirmation par notre équipe.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
