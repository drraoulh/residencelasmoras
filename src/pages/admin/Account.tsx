import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/Auth";
export default function Account() {
  const { session } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;
    if (password !== confirmation) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error)
        setMessage(
          "Modification impossible. Reconnectez-vous et réessayez avec un mot de passe différent.",
        );
      else {
        setPassword("");
        setConfirmation("");
        setMessage("Votre mot de passe a été modifié.");
      }
    } catch {
      setMessage("Le service est indisponible. Réessayez.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="panel max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Mon compte</h1>
      <p>{session?.user.email}</p>
      <p>
        Après votre première connexion, remplacez le mot de passe transmis par
        l’administrateur.
      </p>
      {message && (
        <p role="status" className="notice">
          {message}
        </p>
      )}
      <form onSubmit={save} className="space-y-5">
        <label>
          Nouveau mot de passe
          <input
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          Confirmer le mot de passe
          <input
            type="password"
            autoComplete="new-password"
            minLength={12}
            required
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </label>
        <button className="btn-primary" disabled={busy}>
          {busy ? "Enregistrement…" : "Changer mon mot de passe"}
        </button>
      </form>
    </section>
  );
}
