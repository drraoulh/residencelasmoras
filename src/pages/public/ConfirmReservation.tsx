import { useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle,
  Home,
  Loader2,
  Lock,
  MessageCircle,
  XCircle,
} from "lucide-react";
import BrandName from "../../components/ui/BrandName";
import { useAuth } from "../../context/Auth";
import { confirmReservationByToken } from "../../utils/confirmReservation";
import { WHATSAPP_LINK } from "../../utils/whatsapp";
export default function ConfirmReservation() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { session, role, loading } = useAuth();
  const queryClient = useQueryClient();
  const [state, setState] = useState<
    "ready" | "loading" | "success" | "already" | "error"
  >("ready");
  const valid =
    !!id &&
    /^[0-9a-f-]{36}$/i.test(id) &&
    /^[a-zA-Z0-9_-]{16,128}$/.test(token);
  const authenticated = !!session && !!role;
  const redirect = encodeURIComponent(`/confirmer/${id}?token=${token}`);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid || !authenticated || state === "loading") return;
    setState("loading");
    try {
      const result = await confirmReservationByToken(id!, token);
      setState(result ? "success" : "already");
      await queryClient.invalidateQueries({ queryKey: ["availability-slots"] });
      await queryClient.invalidateQueries({ queryKey: ["reservations"] });
    } catch {
      setState("error");
    }
  };
  const title = !valid
    ? "Lien invalide"
    : loading
      ? "Vérification de votre accès…"
      : !authenticated
        ? "Confirmation réservée à l’équipe"
        : state === "success"
          ? "Réservation confirmée"
          : state === "already"
            ? "Lien déjà utilisé ou expiré"
            : state === "error"
              ? "Confirmation impossible"
              : "Confirmer la réservation";
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-gray px-4 py-16 text-center">
      <BrandName size="lg" className="mb-10" />
      <section className="admin-card w-full max-w-md p-8">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white ring-1 ring-gray-100">
          {loading || state === "loading" ? (
            <Loader2 className="h-7 w-7 animate-spin text-brand-red" />
          ) : state === "success" ? (
            <CheckCircle className="h-7 w-7 text-green-600" />
          ) : !valid || state === "error" ? (
            <XCircle className="h-7 w-7 text-brand-red" />
          ) : (
            <Lock className="h-7 w-7 text-brand-red" />
          )}
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-brand-muted">
          {state === "success"
            ? "Les dates sont maintenant bloquées dans le calendrier."
            : state === "error"
              ? "Vérifiez la disponibilité du logement dans l’administration avant de réessayer."
              : !valid
                ? "Ce lien est incomplet ou incorrect."
                : !authenticated
                  ? "Connectez-vous avec votre compte administrateur ou gestionnaire pour confirmer le séjour après accord avec le client."
                  : "Vérifiez votre accord avec le client avant de confirmer définitivement le séjour."}
        </p>
        {valid && !loading && !authenticated && (
          <Link
            to={`/admin/login?redirect=${redirect}`}
            className="btn-accent mt-6"
          >
            Se connecter pour confirmer
            <ArrowRight size={16} />
          </Link>
        )}
        {valid && authenticated && (state === "ready" || state === "error") && (
          <form onSubmit={submit} className="mt-6">
            <button className="btn-accent">Confirmer la réservation</button>
          </form>
        )}
        <div className="mt-6 grid gap-3">
          <Link className="btn-ghost" to="/catalogue">
            Voir les logements
          </Link>
          <a
            className="btn-ghost"
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
            Contacter la résidence
          </a>
        </div>
      </section>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 text-sm text-brand-muted"
      >
        <Home size={16} />
        Retour au site
      </Link>
    </main>
  );
}
