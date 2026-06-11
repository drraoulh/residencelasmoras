import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { defaultGalleryImages } from '../data/galleryImages';
import type { GalleryImage, GalleryImageDraft } from '../types';
import { deleteGalleryStorageFile } from '../utils/galleryStorage';

async function fetchGalleryImages(includeHidden: boolean) {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (!includeHidden) {
    query = query.eq('visible', true);
  }

  const { data, error } = await query;

  if (error) {
    if (error.code === '42P01') return null;
    throw error;
  }

  return (data ?? []) as GalleryImage[];
}

function resolveGalleryImages(rows: GalleryImage[] | null, includeHidden: boolean) {
  if (!rows || rows.length === 0) {
    const fallback = includeHidden
      ? defaultGalleryImages
      : defaultGalleryImages.filter((img) => img.visible !== false);
    return { images: fallback, fromDatabase: false };
  }

  return { images: rows, fromDatabase: true };
}

export function useGallery(options?: { includeHidden?: boolean }) {
  const includeHidden = options?.includeHidden ?? false;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['gallery', includeHidden ? 'admin' : 'public'],
    queryFn: () => fetchGalleryImages(includeHidden),
    staleTime: 60_000,
    refetchInterval: 5 * 60_000,
    refetchIntervalInBackground: false,
  });

  const resolved = resolveGalleryImages(data ?? null, includeHidden);

  const addGalleryImage = useMutation({
    mutationFn: async (draft: GalleryImageDraft) => {
      const { data: row, error } = await supabase
        .from('gallery_images')
        .insert({
          label: draft.label.trim(),
          category: draft.category,
          image_url: draft.image_url,
          storage_path: draft.storage_path ?? null,
          sort_order: draft.sort_order ?? 0,
          visible: draft.visible ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return row as GalleryImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const updateGalleryImage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GalleryImageDraft> }) => {
      const { data: row, error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return row as GalleryImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const deleteGalleryImage = useMutation({
    mutationFn: async (image: Pick<GalleryImage, 'id' | 'storage_path'>) => {
      if (!image.id.startsWith('default-')) {
        await deleteGalleryStorageFile(image.storage_path);

        const { error } = await supabase.from('gallery_images').delete().eq('id', image.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  return {
    galleryImages: resolved.images,
    fromDatabase: resolved.fromDatabase,
    isLoading,
    error,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
  };
}
