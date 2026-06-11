import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Reservation } from '../types';

type ReservationDraft = Omit<Reservation, 'id' | 'created_at'>;

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
      return (data ?? []) as Reservation[];
    },
    staleTime: 30_000,
    refetchInterval: 3 * 60_000,
    refetchIntervalInBackground: false,
  });

  const addReservation = useMutation({
    mutationFn: async (nouvelleReservation: ReservationDraft) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert(nouvelleReservation)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
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
      queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
    },
  });

  const deleteReservation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['availability-slots'] });
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
