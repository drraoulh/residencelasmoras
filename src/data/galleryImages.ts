import type { GalleryImage } from '../types';
import { defaultGalleryImages, galleryCategories } from './defaultGalleryImages';
import { resolveGalleryImageUrl } from '../utils/galleryImageUrl';

export type { GalleryCategory } from './defaultGalleryImages';
export { defaultGalleryImages, galleryCategories };

/** @deprecated Utiliser useGallery() — conservé pour compatibilité imports existants */
export const galleryImages = defaultGalleryImages.map((img) => ({
  src: img.image_url,
  label: img.label,
  category: img.category,
}));

export function toGalleryViewModel(images: GalleryImage[]) {
  return images.map((img) => ({
    id: img.id,
    src: resolveGalleryImageUrl(img),
    label: img.label,
    category: img.category,
  }));
}
