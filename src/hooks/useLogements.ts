import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Logement } from '../types';

export function useLogements() {
  const queryClient = useQueryClient();

  const { data: logements = [], isLoading, error } = useQuery({
    queryKey: ['logements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Logement[];
    },
  });

  const addLogement = useMutation({
    mutationFn: async (nouveauLogement: Omit<Logement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('logements')
        .insert(nouveauLogement)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logements'] });
    },
  });

  const updateLogement = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Logement> }) => {
      const { data, error } = await supabase
        .from('logements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logements'] });
    },
  });

  const deleteLogement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('logements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logements'] });
    },
  });

  return {
    logements,
    isLoading,
    error,
    addLogement,
    updateLogement,
    deleteLogement,
  };
}
