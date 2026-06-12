import { supabase } from '../lib/supabaseClient';

/** Requête minimale autorisée en anon — réveille Postgres sans charger de données. */
export async function pingSupabaseDatabase() {
  const { error } = await supabase.from('logements').select('id', { head: true, count: 'exact' });
  if (error) throw error;
}
