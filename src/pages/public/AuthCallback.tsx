import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Laisse Supabase lire le token dans l'URL (#access_token=…)
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      const hash = window.location.hash;
      const isInvite = hash.includes('type=invite');
      const isRecovery = hash.includes('type=recovery');

      if (session && (isInvite || isRecovery)) {
        navigate('/admin/login?setup=password', { replace: true });
        return;
      }

      navigate(session ? '/admin/dashboard' : '/admin/login', { replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-gray">
      <Loader2 className="h-8 w-8 animate-spin text-brand-red" />
      <p className="text-sm text-brand-muted">Connexion en cours…</p>
    </main>
  );
}
