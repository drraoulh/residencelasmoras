import type { Logement } from '../types';

/** Colonnes légères — sans photos (souvent base64, plusieurs Mo). */
export const LOGEMENT_LIST_SELECT =
  'id, nom, type, prix, statut, equipements, surface, created_at';

export type LogementCatalogRow = {
  id: string;
  nom: string;
  type: string;
  prix: number;
  statut: Logement['statut'];
  equipements?: string[] | null;
  surface?: number | null;
  created_at?: string | null;
  cover_photo?: string | null;
};

export function isPublicPhotoUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('data:')) return false;
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  );
}

export function filterPublicPhotoUrls(photos?: string[] | null) {
  return (photos ?? []).filter(isPublicPhotoUrl);
}

export function mapCatalogRow(row: LogementCatalogRow): Logement {
  const cover = row.cover_photo && isPublicPhotoUrl(row.cover_photo) ? row.cover_photo : null;

  return {
    id: row.id,
    nom: row.nom,
    type: row.type,
    prix: Number(row.prix),
    statut: row.statut,
    equipements: row.equipements ?? [],
    surface: row.surface ?? undefined,
    created_at: row.created_at ?? undefined,
    description: '',
    photos: cover ? [cover] : [],
  };
}

export function mapLogementPublicRow(row: Logement): Logement {
  return {
    ...row,
    prix: Number(row.prix),
    photos: filterPublicPhotoUrls(row.photos),
  };
}
