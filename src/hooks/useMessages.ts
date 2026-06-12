import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ContactMessage } from '../types';

export function useMessages() {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const addMessage = useMutation({
    mutationFn: async (nouveauMessage: Omit<ContactMessage, 'id' | 'created_at' | 'lu'>) => {
      const { error } = await supabase
        .from('contacts')
        .insert({ ...nouveauMessage, lu: false });
      if (error) throw error;
      return nouveauMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const markMessageAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contacts')
        .update({ lu: true })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const markAllMessagesAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('contacts')
        .update({ lu: true })
        .eq('lu', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const deleteReadMessages = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('contacts').delete().eq('lu', true);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  return {
    messages,
    isLoading,
    error,
    addMessage,
    markMessageAsRead,
    markAllMessagesAsRead,
    deleteMessage,
    deleteReadMessages,
  };
}
