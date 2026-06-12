import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Logement } from '../types';

export function useLogement(id: string | undefined) {
  return useQuery({
    queryKey: ['logements', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('logements').select('*').eq('id', id!).single();
      if (error) throw error;
      return data as Logement;
    },
    enabled: Boolean(id),
    staleTime: 2 * 60_000,
  });
}
