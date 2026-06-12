import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Logement } from '../types';
import {
  LOGEMENT_LIST_SELECT,
  type LogementCatalogRow,
  mapCatalogRow,
} from '../utils/logementQueries';

async function fetchLogementsCatalog(): Promise<Logement[]> {
  const { data, error } = await supabase.rpc('get_logements_catalog');

  if (!error && data) {
    return (data as LogementCatalogRow[]).map(mapCatalogRow);
  }

  // Fallback si la RPC n'est pas encore déployée sur Supabase
  const { data: rows, error: queryError } = await supabase
    .from('logements')
    .select(LOGEMENT_LIST_SELECT)
    .order('created_at', { ascending: false });

  if (queryError) throw queryError;
  return (rows as LogementCatalogRow[]).map((row) => mapCatalogRow({ ...row, cover_photo: null }));
}

export function useLogementsList(options?: { enabled?: boolean }) {
  const { data: logements = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['logements', 'list'],
    queryFn: fetchLogementsCatalog,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    refetchInterval: 5 * 60_000,
    refetchIntervalInBackground: false,
  });

  return { logements, isLoading, error, isFetching };
}
