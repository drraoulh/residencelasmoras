import { supabase } from "../lib/supabaseClient";
import type { Logement } from "../types";
import {
  addDays,
  getEffectiveDepart,
  getLogementAvailability,
  getUnavailableMessage,
  type AvailabilitySlot,
} from "./availability";

export class ReservationUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReservationUnavailableError";
  }
}

async function fetchAvailabilityForLogement(logementId: string) {
  const [
    { data: logement, error: logementError },
    { data: slots, error: slotsError },
  ] = await Promise.all([
    supabase
      .from("logements")
      .select("id, statut")
      .eq("id", logementId)
      .single(),
    supabase.rpc("get_availability_slots"),
  ]);

  if (logementError) throw logementError;
  if (slotsError) throw slotsError;

  return {
    logement: logement as Pick<Logement, "id" | "statut">,
    slots: (slots ?? []) as AvailabilitySlot[],
  };
}

export async function assertReservationAvailable(
  logementId: string,
  dateArrivee: string,
  dateDepart?: string,
  cached?: {
    logement: Pick<Logement, "id" | "statut">;
    slots: AvailabilitySlot[];
  },
) {
  const { logement, slots } =
    cached ?? (await fetchAvailabilityForLogement(logementId));
  const availability = getLogementAvailability(
    logement as Logement,
    slots,
    dateArrivee,
    dateDepart,
  );

  if (!availability.available) {
    throw new ReservationUnavailableError(getUnavailableMessage(availability));
  }
}

export interface ReservationRequestInput {
  logementId: string;
  logementNom: string;
  prenom: string;
  nom: string;
  email?: string;
  telephone: string;
  dateArrivee: string;
  dateDepart?: string;
  prixParNuit: number;
}

export async function createReservationRequest(input: ReservationRequestInput) {
  await assertReservationAvailable(
    input.logementId,
    input.dateArrivee,
    input.dateDepart,
  );

  const effectiveDepart = getEffectiveDepart(
    input.dateArrivee,
    input.dateDepart,
  );
  const clientNom = [input.prenom.trim(), input.nom.trim()]
    .filter(Boolean)
    .join(" ");
  const { data, error } = await supabase.rpc("create_reservation_request", {
    p_logement_id: input.logementId,
    p_nom: clientNom,
    p_email: input.email?.trim() || "via-whatsapp@lasmoras.local",
    p_telephone: input.telephone.trim(),
    p_arrivee: input.dateArrivee,
    p_depart: effectiveDepart,
  });
  if (error) {
    if (error.code === "P0001")
      throw new ReservationUnavailableError(error.message);
    throw error;
  }
  return data as { id: string; confirmToken: string };
}

export function defaultDepartFromArrivee(dateArrivee: string) {
  return addDays(dateArrivee, 1);
}
