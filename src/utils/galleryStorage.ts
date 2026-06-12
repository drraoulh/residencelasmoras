import { supabase } from '../lib/supabaseClient';

const BUCKET = 'gallery';

export async function uploadGalleryImage(file: File) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    throw new Error('Session admin expirée. Reconnectez-vous puis réessayez.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  });

  if (error) {
    if (error.message.includes('Bucket not found')) {
      throw new Error('Bucket Storage « gallery » introuvable. Exécutez supabase-gallery-fix.sql.');
    }
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    image_url: data.publicUrl,
    storage_path: path,
  };
}

export async function deleteGalleryStorageFile(storagePath?: string | null) {
  if (!storagePath?.trim()) return;

  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}

export async function uploadGalleryImageFromUrl(sourceUrl: string, label: string) {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Impossible de lire l'image « ${label} ».`);
  }

  const blob = await response.blob();
  const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpeg';
  const safeLabel = label.replace(/[^\w\-]+/g, '-').slice(0, 40);
  const file = new File([blob], `${safeLabel}.${ext}`, { type: blob.type || 'image/jpeg' });

  return uploadGalleryImage(file);
}
