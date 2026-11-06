import type { Logement } from "../components/properties/LogementCard";
export type LogementRow = {
  id: string;
  nom: string;
  type: string;
  prix: number;
  statut: Logement["statut_actuel"] | null;
  surface: number | null;
  description: string | null;
  photos: string[] | null;
  equipements: string[] | null;
  date_liberation?: string | null;
};
export function fromLogementRow(row: LogementRow): Logement {
  return {
    id: row.id,
    nom: row.nom,
    type: row.type,
    prix_nuit: Number(row.prix),
    statut_actuel: row.statut ?? "disponible",
    surface: Number(row.surface ?? 0),
    description: row.description ?? "",
    photos: (row.photos ?? []).filter(Boolean),
    equipements: row.equipements ?? [],
    date_liberation: row.date_liberation ?? undefined,
  };
}
export function toLogementRow(value: Omit<Logement, "id">) {
  return {
    nom: value.nom.trim(),
    type: value.type,
    prix: value.prix_nuit,
    statut: value.statut_actuel,
    surface: value.surface,
    description: value.description ?? "",
    photos: value.photos,
    equipements: value.equipements,
    date_liberation:
      value.statut_actuel === "libere_prochainement"
        ? value.date_liberation
        : null,
  };
}
