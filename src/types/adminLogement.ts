export type LogementStatus = "disponible" | "occupe" | "libere_prochainement";

export interface Logement {
  id: string;
  nom: string;
  type: string;
  description?: string;
  surface: number;
  prix_nuit: number;
  statut_actuel: LogementStatus;
  date_liberation?: string;
  photos: string[];
  equipements: string[];
}

