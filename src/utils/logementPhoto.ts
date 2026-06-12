import defaultPhoto from '../assets/residencelasmoras1.jpeg';
import { isPublicPhotoUrl } from './logementQueries';

export function getLogementPhoto(photos?: string[] | null, fallback = defaultPhoto) {
  const photo = photos?.find((item) => isPublicPhotoUrl(item));
  return photo || fallback;
}
