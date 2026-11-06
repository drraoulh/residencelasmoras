import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
const Context = createContext<{
  session: Session | null;
  role: string | null;
  loading: boolean;
}>({ session: null, role: null, loading: true });
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let version = 0;
    const update = async (next: Session | null) => {
      const current = ++version;
      setLoading(true);
      const result = next
        ? await supabase!
            .from("team_members")
            .select("role")
            .eq("user_id", next.user.id)
            .maybeSingle()
        : null;
      if (active && current === version) {
        setSession(next);
        setRole(result?.data?.role ?? null);
        setLoading(false);
      }
    };
    void supabase.auth.getSession().then(({ data }) => update(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      window.setTimeout(() => {
        void update(next);
      }, 0);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return (
    <Context.Provider value={{ session, role, loading }}>
      {children}
    </Context.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Context);
