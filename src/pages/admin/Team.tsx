import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/Auth";
import { supabase } from "../../lib/supabase";
type Member = { user_id: string; email: string; role: string };
export default function Team() {
  const { role, session } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState("manager");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    const { data, error } = await supabase!
      .from("team_members")
      .select("*")
      .order("email");
    if (error) setMessage("Impossible de charger l’équipe.");
    else setMembers(data ?? []);
  };
  useEffect(() => {
    if (role !== "admin" || !supabase) return;
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [role]);
  if (role !== "admin")
    return <p>Seul un administrateur peut gérer les accès.</p>;
  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase!.functions.invoke("manage-team", {
      body: { action: "create", email: email.trim(), password, role: newRole },
    });
    setBusy(false);
    if (error)
      setMessage(
        "Création impossible. Vérifiez les droits, l’adresse et la configuration du service.",
      );
    else {
      setEmail("");
      setPassword("");
      setMessage(
        "Compte créé. Communiquez ses identifiants à cette personne par un canal privé.",
      );
      await load();
    }
  };
  const revoke = async (member: Member) => {
    if (busy) return;
    if (!window.confirm(`Retirer l’accès de ${member.email} ?`)) return;
    setBusy(true);
    const { error } = await supabase!.functions.invoke("manage-team", {
      body: { action: "revoke", user_id: member.user_id },
    });
    setBusy(false);
    setMessage(error ? "Impossible de retirer cet accès." : "Accès retiré.");
    await load();
  };
  return (
    <div className="admin-page space-y-6">
      <div>
        <p className="admin-eyebrow">LA RÉSIDENCE SE GÈRE ENSEMBLE</p>
        <h1>Équipe et accès</h1>
      </div>
      <p className="admin-description">
        Les gestionnaires gèrent les logements et les réservations. Les
        administrateurs peuvent également ajouter ou retirer des membres.
      </p>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <form className="panel space-y-5" onSubmit={create}>
        <h2 className="text-xl font-bold">Ajouter une personne</h2>
        <label>
          Adresse e-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Mot de passe initial (12 caractères minimum)
          <input
            type="password"
            minLength={12}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Rôle
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="manager">Gestionnaire</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
        <button className="btn-primary" disabled={busy}>
          Créer le compte
        </button>
      </form>
      <div className="panel space-y-5">
        {members.map((m) => (
          <div
            key={m.user_id}
            className="flex flex-wrap justify-between gap-3 border-b border-gray-100 pb-4"
          >
            <div>
              <strong>{m.email}</strong>
              <p>{m.role === "admin" ? "Administrateur" : "Gestionnaire"}</p>
            </div>
            {m.user_id !== session?.user.id && (
              <button
                disabled={busy}
                className="text-red-700"
                onClick={() => void revoke(m)}
              >
                Retirer l’accès
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
