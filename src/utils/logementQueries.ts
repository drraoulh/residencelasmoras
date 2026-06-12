import type { Logement } from '../types';

/** Colonnes suffisantes pour cartes, listes et recherche disponibilité. */
export const LOGEMENT_LIST_SELECT =
  'id, nom, type, prix, statut, photos, equipements, surface, created_at';

export function trimLogementPhotos(logement: Logement): Logement {
  const firstPhoto = logement.photos?.find((photo) => photo?.trim());
  return {
    ...logement,
    photos: firstPhoto ? [firstPhoto] : [],
    description: logement.description ?? '',
  };
}

export function trimLogementList(rows: Logement[]): Logement[] {
  return rows.map(trimLogementPhotos);
}
