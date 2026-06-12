import defaultPhoto from '../assets/residencelasmoras1.jpeg';

export function getLogementPhoto(photos?: string[] | null, fallback = defaultPhoto) {
  const photo = photos?.find((item) => item?.trim());
  return photo || fallback;
}
