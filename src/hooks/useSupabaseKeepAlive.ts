import { useEffect, useRef } from 'react';
import { pingSupabaseDatabase } from '../lib/supabaseKeepAlive';

/** Intervalle entre deux pings quand l'onglet est visible (4 min). */
const KEEP_ALIVE_INTERVAL_MS = 4 * 60_000;

/** Ping au retour sur l'onglet si masqué plus longtemps que ce délai (90 s). */
const RESUME_AFTER_HIDDEN_MS = 90_000;

/**
 * Envoie périodiquement une requête légère à Supabase pour limiter
 * la mise en veille / le cold start de la base (projet Supabase).
 *
 * Note : le plan gratuit Supabase se met en pause après ~7 jours sans
 * aucune requête API. Pour couvrir cette fenêtre, ajoutez un cron externe
 * (ex. cron-job.org) qui appelle votre site ou une Edge Function quotidiennement.
 */
export function useSupabaseKeepAlive() {
  const hiddenAtRef = useRef<number | null>(null);
  const lastPingRef = useRef(0);

  useEffect(() => {
    const ping = () => {
      lastPingRef.current = Date.now();
      void pingSupabaseDatabase().catch(() => {
        /* Échec réseau ou projet en pause — ignoré silencieusement */
      });
    };

    ping();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now();
        return;
      }

      const hiddenAt = hiddenAtRef.current;
      if (hiddenAt && Date.now() - hiddenAt >= RESUME_AFTER_HIDDEN_MS) {
        ping();
      }
      hiddenAtRef.current = null;
    };

    const onOnline = () => ping();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('online', onOnline);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastPingRef.current < KEEP_ALIVE_INTERVAL_MS - 5_000) return;
      ping();
    }, KEEP_ALIVE_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('online', onOnline);
      window.clearInterval(intervalId);
    };
  }, []);
}
