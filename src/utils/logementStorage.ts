import { supabase } from '../lib/supabaseClient';
import { isPublicPhotoUrl } from './logementQueries';

const BUCKET = 'logements';

function storagePath(logementId: string, filename: string) {
  const safeId = logementId.replace(/[^\w-]/g, '');
  return `${safeId}/${filename}`;
}

export function isDataUrl(value: string) {
  return value.trim().startsWith('data:');
}

export async function uploadLogementImage(file: File, logementId: string) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('Session admin expirée. Reconnectez-vous puis réessayez.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = storagePath(logementId, `${Date.now()}-${crypto.randomUUID()}.${ext}`);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  });

  if (error) {
    if (error.message.includes('Bucket not found')) {
      throw new Error('Bucket Storage « logements » introuvable. Exécutez supabase-logements-storage.sql.');
    }
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadLogementImageFromDataUrl(dataUrl: string, logementId: string, index: number) {
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error(`Impossible de lire la photo ${index + 1}.`);
  }

  const blob = await response.blob();
  const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpeg';
  const file = new File([blob], `photo-${index + 1}.${ext}`, { type: blob.type || 'image/jpeg' });

  return uploadLogementImage(file, logementId);
}

/** Convertit les data URLs en URLs Storage publiques. */
export async function normalizeLogementPhotos(photos: string[], logementId: string) {
  const normalized: string[] = [];

  for (let index = 0; index < photos.length; index += 1) {
    const photo = photos[index]?.trim();
    if (!photo) continue;

    if (isDataUrl(photo)) {
      normalized.push(await uploadLogementImageFromDataUrl(photo, logementId, index));
      continue;
    }

    if (isPublicPhotoUrl(photo)) {
      normalized.push(photo);
    }
  }

  return normalized;
}

export function logementHasEmbeddedPhotos(photos?: string[] | null) {
  return (photos ?? []).some(isDataUrl);
}
