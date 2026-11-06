import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Logement } from "../components/properties/LogementCard";
import { supabase, configurationError } from "../lib/supabase";
import { fromLogementRow } from "../lib/logements";
const Context = createContext<{
  logements: Logement[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
}>({ logements: [], loading: true, error: "", refresh: async () => {} });
export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState(supabase ? "" : configurationError);
  const refresh = useCallback(async () => {
    if (!supabase) {
      setError(configurationError);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("logements")
      .select("*")
      .order("created_at", { ascending: false });
    setError(error ? "Impossible de charger les logements. Réessayez." : "");
    if (!error) setLogements((data ?? []).map(fromLogementRow));
    setLoading(false);
  }, []);
  useEffect(() => {
    const initial = window.setTimeout(() => {
      void refresh();
    }, 0);
    const update = () => {
      void refresh();
    };
    window.addEventListener("focus", update);
    const timer = window.setInterval(update, 30000);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("focus", update);
      window.clearInterval(timer);
    };
  }, [refresh]);
  return (
    <Context.Provider value={{ logements, loading, error, refresh }}>
      {children}
    </Context.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useProperties = () => useContext(Context);
