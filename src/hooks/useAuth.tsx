import { useAuth as useCurrentAuth } from "../context/Auth";
export function useAuth() {
  const { session, role, loading } = useCurrentAuth();
  return {
    session,
    user: session?.user ?? null,
    isLoading: loading,
    isAuthenticated: !!session && !!role,
    role,
  };
}
