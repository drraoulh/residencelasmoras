import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Logement } from '../types';
import { LOGEMENT_LIST_SELECT, mapLogementPublicRow } from '../utils/logementQueries';

async function fetchLogementPublic(id: string): Promise<Logement> {
  const { data, error } = await supabase.rpc('get_logement_public', { p_id: id });

  if (!error && data?.[0]) {
    return mapLogementPublicRow(data[0] as Logement);
  }

  // Fallback sans colonne photos (évite le téléchargement base64)
  const { data: row, error: queryError } = await supabase
    .from('logements')
    .select(`${LOGEMENT_LIST_SELECT}, description`)
    .eq('id', id)
    .single();

  if (queryError) throw queryError;
  return mapLogementPublicRow({ ...(row as Logement), photos: [] });
}

export function useLogement(id: string | undefined) {
  return useQuery({
    queryKey: ['logements', 'detail', id],
    queryFn: () => fetchLogementPublic(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
