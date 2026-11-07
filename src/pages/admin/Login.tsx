import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import logo from "../../assets/logo lasmoras.jpeg";
import residence from "../../assets/residencelasmoras1.jpeg";
import "../../admin.css";
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
    <main className="admin-login">
      <aside
        className="admin-login-visual"
        style={{
          backgroundImage: `linear-gradient(0deg, #111c2eea, #111c2e22),url(${residence})`,
        }}
      >
        <Link to="/" className="admin-brand">
          <img src={logo} alt="Résidence Las Moras" />
          <span>
            LAS MORAS<small>VOTRE SÉJOUR D’EXCEPTION</small>
          </span>
        </Link>
        <div>
          <p className="admin-eyebrow">L’ART DE BIEN ACCUEILLIR</p>
          <h2>
            Votre résidence.
            <br />
            Votre équipe.
            <br />
            Un seul espace.
          </h2>
          <p>
            Une gestion simple pour se concentrer sur l’essentiel : le confort
            de vos visiteurs.
          </p>
        </div>
        <small>Résidence Las Moras · Yaoundé, Cameroun</small>
      </aside>
      <section className="admin-login-main">
        <Link to="/" className="admin-login-back">
          <ArrowLeft size={14} />
          Retour au site
        </Link>
        <div className="admin-login-form">
          <span className="admin-login-icon">
            <ShieldCheck size={25} />
          </span>
          <p className="admin-eyebrow">BIENVENUE CHEZ VOUS</p>
          <h1>Espace de gestion</h1>
          <p className="admin-description">
            Connectez-vous pour prendre soin de votre résidence.
          </p>
          {message && (
            <p role="alert" className="notice">
              {message}
            </p>
          )}
          <form onSubmit={submit} className="space-y-5">
            <label>
              Adresse e-mail
              <input
                type="email"
                autoComplete="username"
                placeholder="vous@lasmoras.com"
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
                placeholder="Votre mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button disabled={busy} className="btn-primary w-full">
              {busy ? "Connexion…" : "Se connecter"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="admin-login-help">
            Besoin d’un accès ? Contactez l’administrateur de la résidence.
          </p>
        </div>
        <small>Un espace réservé à l’équipe Las Moras.</small>
      </section>
    </main>
  );
}
