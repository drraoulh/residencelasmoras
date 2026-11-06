import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, configurationError } from "../../lib/supabase";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setMessage(configurationError);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error)
      setMessage(
        "Connexion impossible. Vérifiez votre adresse et votre mot de passe.",
      );
    else navigate("/admin/dashboard");
  };
  return (
    <main className="min-h-screen bg-brand-gray flex items-center justify-center p-5">
      <section className="panel w-full max-w-md space-y-6">
        <Link to="/">← Retour au site</Link>
        <h1 className="text-3xl font-bold">Espace de gestion</h1>
        <p>Connectez-vous avec votre compte administrateur ou gestionnaire.</p>
        {message && <p role="alert">{message}</p>}
        <form onSubmit={submit} className="space-y-5">
          <label>
            Adresse e-mail
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button disabled={busy} className="btn-primary w-full">
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  );
}
