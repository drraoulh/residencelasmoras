import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/Auth";
import type { Reservation } from "../types";
export function useReservations() {
  const { role } = useAuth();
  const {
    data: reservations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reservations"],
    enabled: !!role,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*, logements(nom)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Reservation[];
    },
  });
  return { reservations, isLoading, error };
}
