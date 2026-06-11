import { supabase } from '../lib/supabaseClient';

export function createConfirmToken() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 24);
}

export function buildConfirmNotes(logementNom: string, confirmToken: string) {
  return `Demande en ligne — ${logementNom} — confirm:${confirmToken}`;
}

export function buildConfirmUrl(reservationId: string, token: string) {
  return `${window.location.origin}/confirmer/${reservationId}?token=${encodeURIComponent(token)}`;
}

export function buildReservationRef(reservationId: string) {
  return reservationId.slice(0, 8).toUpperCase();
}

export async function confirmReservationByToken(reservationId: string, token: string) {
  const { data, error } = await supabase.rpc('confirm_reservation_by_token', {
    p_reservation_id: reservationId,
    p_token: token,
  });
  if (error) throw error;
  return Boolean(data);
}
