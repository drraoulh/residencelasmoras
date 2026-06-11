import { supabase } from '../lib/supabaseClient';

const BUCKET = 'gallery';

export async function uploadGalleryImage(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    image_url: data.publicUrl,
    storage_path: path,
  };
}

export async function deleteGalleryStorageFile(storagePath?: string | null) {
  if (!storagePath) return;

  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}

export function isManagedStoragePath(storagePath?: string | null) {
  return Boolean(storagePath?.trim());
}
