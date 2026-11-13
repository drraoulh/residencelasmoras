import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { AvailabilitySlot } from '../utils/availability';
import { filterActiveBlockingSlots } from '../utils/reservationLifecycle';

export function useAvailabilitySlots(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  const { data: slots = [], isLoading, error, isError } = useQuery({
    queryKey: ['availability-slots'],
    enabled,
    queryFn: async () => {
      const { data, error: queryError } = await supabase.rpc('get_availability_slots');

      if (queryError) throw queryError;
      return filterActiveBlockingSlots((data ?? []) as AvailabilitySlot[]);
    },
    retry: 2,
    staleTime: 2 * 60_000,
    gcTime: 15 * 60_000,
    refetchInterval: 2 * 60_000,
    refetchIntervalInBackground: false,
  });

  return {
    slots,
    isLoading,
    error,
    hasLiveAvailability: !isError && slots.length >= 0,
  };
}
