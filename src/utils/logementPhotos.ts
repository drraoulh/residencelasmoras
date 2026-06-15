import type { Logement } from '../types';
import { supabase } from '../lib/supabaseClient';
import { isPublicPhotoUrl } from './logementQueries';
import {
  isDataUrl,
  logementHasEmbeddedPhotos,
  normalizeLogementPhotos,
  uploadLogementImage,
} from './logementStorage';

export { isDataUrl, logementHasEmbeddedPhotos, normalizeLogementPhotos, uploadLogementImage };

/** Variantes locales tant que la photo Storage n'est pas encore migrée. */
import fallback1 from '../assets/residencelasmoras1.jpeg';
import fallback2 from '../assets/residencelasmoras2.jpeg';
import fallback3 from '../assets/residencelasmoras3.jpeg';

const FALLBACK_PHOTOS = [fallback1, fallback2, fallback3];

export function pickLogementFallbackPhoto(seed?: string) {
  if (!seed) return FALLBACK_PHOTOS[0];
  const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FALLBACK_PHOTOS[hash % FALLBACK_PHOTOS.length];
}

export function getLogementPhoto(photos?: string[] | null, logementId?: string) {
  const photo = photos?.find((item) => isPublicPhotoUrl(item));
  return photo || pickLogementFallbackPhoto(logementId);
}

export async function repairAllLogementPhotos(
  logements: Logement[],
  onUpdate: (id: string, photos: string[]) => Promise<unknown>,
  onProgress?: (done: number, total: number) => void,
) {
  const targets = logements.filter((logement) => logementHasEmbeddedPhotos(logement.photos));
  let done = 0;

  for (const logement of targets) {
    const photos = await normalizeLogementPhotos(logement.photos, logement.id);
    await onUpdate(logement.id, photos);
    done += 1;
    onProgress?.(done, targets.length);
  }

  return { migrated: targets.length };
}

export async function repairSingleLogementPhotos(logement: Logement) {
  if (!logementHasEmbeddedPhotos(logement.photos)) {
    return logement.photos.filter(isPublicPhotoUrl);
  }

  const photos = await normalizeLogementPhotos(logement.photos, logement.id);
  const { error } = await supabase.from('logements').update({ photos }).eq('id', logement.id);
  if (error) throw error;
  return photos;
}
