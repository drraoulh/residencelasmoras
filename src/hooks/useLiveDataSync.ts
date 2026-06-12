import { useEffect } from 'react';
import { liveQueryKeys, queryClient } from '../lib/queryClient';
import { pingSupabaseDatabase } from '../lib/supabaseKeepAlive';
import { supabase } from '../lib/supabaseClient';

const REFETCH_INTERVAL_MS = 3 * 60_000;

function refreshLiveData() {
  liveQueryKeys.forEach((queryKey) => {
    queryClient.invalidateQueries({ queryKey });
  });
}

/** Rafraîchit les données React Query après inactivité ou reconnexion. */
export function useLiveDataSync() {
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;
      await supabase.auth.getSession();
      await pingSupabaseDatabase().catch(() => undefined);
      refreshLiveData();
    };

    const onOnline = () => {
      void supabase.auth.getSession();
      refreshLiveData();
    };

    const onFocus = () => {
      void onVisible();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onOnline);
    window.addEventListener('focus', onFocus);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshLiveData();
      }
    }, REFETCH_INTERVAL_MS);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('focus', onFocus);
      window.clearInterval(intervalId);
    };
  }, []);
}
