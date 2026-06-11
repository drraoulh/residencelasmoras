import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Reservation } from '../types';

export function useReservations() {
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, logements(nom)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[]; // To handle the join
    },
  });

  const addReservation = useMutation({
    mutationFn: async (nouvelleReservation: Omit<Reservation, 'id' | 'dateCreation'>) => {
      // Mapping from Reservation format to DB format
      const dbFormat = {
        logement_id: nouvelleReservation.logementId,
        client_nom: nouvelleReservation.clientNom,
        client_email: nouvelleReservation.clientEmail,
        client_telephone: nouvelleReservation.clientTelephone,
        date_arrivee: nouvelleReservation.dateArrivee,
        date_depart: nouvelleReservation.dateDepart,
        nombre_nuits: nouvelleReservation.nombreNuits,
        montant_total: nouvelleReservation.montantTotal,
        montant_paye: nouvelleReservation.montantPaye,
        methode_paiement: nouvelleReservation.methodePaiement,
        statut_paiement: nouvelleReservation.statutPaiement,
        statut_reservation: nouvelleReservation.statutReservation,
        notes: nouvelleReservation.notes,
      };

      const { data, error } = await supabase
        .from('reservations')
        .insert(dbFormat)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const updateReservation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });

  return {
    reservations,
    isLoading,
    error,
    addReservation,
    updateReservation,
    deleteReservation,
  };
}
