import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { AvailabilitySlot } from '../utils/availability';

export function useAvailabilitySlots() {
  const { data: slots = [], isLoading, error, isError } = useQuery({
    queryKey: ['availability-slots'],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from('reservations')
        .select('logement_id, date_arrivee, date_depart, statut_reservation')
        .in('statut_reservation', ['confirmee', 'en_cours']);

      if (queryError) throw queryError;
      return (data ?? []) as AvailabilitySlot[];
    },
    retry: 1,
    staleTime: 60_000,
  });

  return {
    slots,
    isLoading,
    error,
    hasLiveAvailability: !isError && slots.length >= 0,
  };
}
