import { useMemo } from "react";
import { useProperties } from "../context/Properties";
import type { Logement } from "../types";
export function useLogementsList(options?: { enabled?: boolean }) {
  const { logements: rows, loading, error } = useProperties();
  const logements = useMemo<Logement[]>(
    () =>
      rows.map((row) => ({
        id: row.id,
        nom: row.nom,
        type: row.type,
        prix: row.prix_nuit,
        statut: row.statut_actuel,
        description: row.description ?? "",
        photos: row.photos,
        equipements: row.equipements,
        surface: row.surface,
        date_liberation: row.date_liberation,
      })),
    [rows],
  );
  return {
    logements,
    isLoading: loading,
    error: error ? new Error(error) : null,
    isFetching: (options?.enabled ?? true) && loading,
  };
}
