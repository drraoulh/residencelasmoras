import { useLogementsList } from "./useLogementsList";
export function useLogement(id: string | undefined) {
  const { logements, isLoading, error } = useLogementsList();
  return { data: logements.find((row) => row.id === id), isLoading, error };
}
