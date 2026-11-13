import { defaultGalleryImages } from '../data/defaultGalleryImages';
import { supabase } from '../lib/supabaseClient';
import type { GalleryImage } from '../types';
import { getSiteUrl } from './siteUrl';

function isBrokenGalleryUrl(url: string) {
  return (
    url.includes('localhost') ||
    url.includes('127.0.0.1') ||
    url.includes('/src/assets/') ||
    url.startsWith('/assets/') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  );
}

function isSupabaseStorageUrl(url: string) {
  return url.includes('.supabase.co/storage/');
}

function fallbackByImage(image: Pick<GalleryImage, 'label' | 'sort_order'>) {
  return (
    defaultGalleryImages.find((item) => item.label === image.label) ??
    defaultGalleryImages.find((item) => item.sort_order === image.sort_order)
  );
}

/** URL affichable sur le site (corrige les liens dev/localhost en base). */
export function resolveGalleryImageUrl(
  image: Pick<GalleryImage, 'image_url' | 'label' | 'sort_order' | 'storage_path'>,
) {
  const storagePath = image.storage_path?.trim();
  if (storagePath) {
    const { data } = supabase.storage.from('gallery').getPublicUrl(storagePath);
    if (data.publicUrl) return data.publicUrl;
  }

  const url = image.image_url?.trim() ?? '';

  if (!url) {
    return fallbackByImage(image)?.image_url ?? '';
  }

  if (isSupabaseStorageUrl(url) && !isBrokenGalleryUrl(url)) {
    return url;
  }

  if (isBrokenGalleryUrl(url)) {
    return fallbackByImage(image)?.image_url ?? url;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/')) {
    const origin = getSiteUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
    return `${origin}${url}`;
  }

  return url;
}

export function galleryImageNeedsRepair(image: GalleryImage) {
  if (image.storage_path?.trim()) {
    return isBrokenGalleryUrl(image.image_url);
  }

  return isBrokenGalleryUrl(image.image_url) || !isSupabaseStorageUrl(image.image_url);
}
