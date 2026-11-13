import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { defaultGalleryImages } from '../data/defaultGalleryImages';
import type { GalleryImage, GalleryImageDraft } from '../types';
import { deleteGalleryStorageFile, uploadGalleryImageFromUrl } from '../utils/galleryStorage';
import { galleryImageNeedsRepair, resolveGalleryImageUrl } from '../utils/galleryImageUrl';

export type GalleryLoadState = 'ready' | 'empty' | 'missing_table' | 'error';

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
    if (error.code === '42P01' || error.message.includes('gallery_images')) {
      return { status: 'missing_table' as const, rows: [] as GalleryImage[] };
    }
    throw error;
  }

  return {
    status: (data?.length ? 'ready' : 'empty') as GalleryLoadState,
    rows: (data ?? []) as GalleryImage[],
  };
}

function resolveGalleryImages(
  result: { status: GalleryLoadState; rows: GalleryImage[] } | undefined,
  includeHidden: boolean,
) {
  if (!result) {
    return { images: includeHidden ? [] : defaultGalleryImages, loadState: 'error' as GalleryLoadState };
  }

  if (result.status === 'missing_table') {
    return {
      images: includeHidden ? [] : defaultGalleryImages,
      loadState: 'missing_table' as GalleryLoadState,
    };
  }

  if (result.status === 'empty') {
    return {
      images: includeHidden
        ? defaultGalleryImages
        : defaultGalleryImages.filter((img) => img.visible !== false),
      loadState: 'empty' as GalleryLoadState,
    };
  }

  return { images: result.rows, loadState: 'ready' as GalleryLoadState };
}

function formatSupabaseError(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: string }).message);
  }
  return 'Erreur inconnue';
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

  const resolved = resolveGalleryImages(data, includeHidden);
  const canManage = includeHidden && resolved.loadState !== 'missing_table';

  const addGalleryImage = useMutation({
    mutationFn: async (draft: GalleryImageDraft) => {
      const id = crypto.randomUUID();

      const { error } = await supabase.from('gallery_images').insert({
        id,
        label: draft.label.trim(),
        category: draft.category,
        image_url: draft.image_url,
        storage_path: draft.storage_path ?? null,
        sort_order: draft.sort_order ?? 0,
        visible: draft.visible ?? true,
      });

      if (error) throw error;

      return {
        id,
        label: draft.label.trim(),
        category: draft.category,
        image_url: draft.image_url,
        storage_path: draft.storage_path ?? null,
        sort_order: draft.sort_order ?? 0,
        visible: draft.visible ?? true,
      } satisfies GalleryImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const updateGalleryImage = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<GalleryImageDraft> }) => {
      const { error } = await supabase.from('gallery_images').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const deleteGalleryImage = useMutation({
    mutationFn: async (image: Pick<GalleryImage, 'id' | 'storage_path'>) => {
      await deleteGalleryStorageFile(image.storage_path);

      const { error } = await supabase.from('gallery_images').delete().eq('id', image.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const importDefaultGallery = useMutation({
    mutationFn: async () => {
      const { count, error: countError } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      if (count && count > 0) return;

      const rows = [];

      for (const img of defaultGalleryImages) {
        const sourceUrl = resolveGalleryImageUrl(img);
        const uploaded = await uploadGalleryImageFromUrl(sourceUrl, img.label);

        rows.push({
          id: crypto.randomUUID(),
          label: img.label,
          category: img.category,
          image_url: uploaded.image_url,
          storage_path: uploaded.storage_path,
          sort_order: img.sort_order ?? 0,
          visible: img.visible !== false,
        });
      }

      const { error } = await supabase.from('gallery_images').insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  const repairGalleryImages = useMutation({
    mutationFn: async () => {
      const { data: rows, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      for (const row of (rows ?? []) as GalleryImage[]) {
        if (!galleryImageNeedsRepair(row)) continue;

        const fallback =
          defaultGalleryImages.find((item) => item.label === row.label) ??
          defaultGalleryImages.find((item) => item.sort_order === row.sort_order);

        const sourceUrl = resolveGalleryImageUrl(fallback ?? row);
        const uploaded = await uploadGalleryImageFromUrl(sourceUrl, row.label);

        if (row.storage_path) {
          await deleteGalleryStorageFile(row.storage_path);
        }

        const { error: updateError } = await supabase
          .from('gallery_images')
          .update({
            image_url: uploaded.image_url,
            storage_path: uploaded.storage_path,
          })
          .eq('id', row.id);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });

  return {
    galleryImages: resolved.images,
    loadState: resolved.loadState,
    canManage,
    isLoading,
    error,
    addGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    importDefaultGallery,
    repairGalleryImages,
    formatSupabaseError,
  };
}
