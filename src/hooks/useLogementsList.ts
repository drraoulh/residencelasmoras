import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Logement } from '../types';
import { LOGEMENT_LIST_SELECT, trimLogementList } from '../utils/logementQueries';

export function useLogementsList(options?: { enabled?: boolean }) {
  const { data: logements = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['logements', 'list'],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from('logements')
        .select(LOGEMENT_LIST_SELECT)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;
      return trimLogementList((data ?? []) as Logement[]);
    },
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchIntervalInBackground: false,
  });

  return { logements, isLoading, error, isFetching };
}
