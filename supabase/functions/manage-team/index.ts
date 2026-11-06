import { createClient } from 'npm:@supabase/supabase-js@2.108.1';
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' };
Deno.serve(async req => {
 const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
 if (req.method === 'OPTIONS') return new Response('ok', { headers });
 if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });
 try {
  const token = req.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!token) return reply(401, { error: 'Authentication required' });
  const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return reply(401, { error: 'Invalid session' });
  const { data: member } = await client.from('team_members').select('role').eq('user_id', user.id).single();
  if (member?.role !== 'admin') return reply(403, { error: 'Administrator required' });
  const body = await req.json();
  if (body.action === 'create') {
   if (!['manager','admin'].includes(body.role) || typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || typeof body.password !== 'string' || body.password.length < 12) return reply(400, { error: 'Invalid fields' });
   const { data, error } = await client.auth.admin.createUser({ email: body.email, password: body.password, email_confirm: true });
   if (error || !data.user) return reply(400, { error: 'Account creation failed' });
   const { error: insertError } = await client.from('team_members').insert({ user_id: data.user.id, email: body.email, role: body.role });
   if (insertError) { await client.auth.admin.deleteUser(data.user.id); return reply(500, { error: 'Membership creation failed' }); }
   return reply(200, { success: true });
  }
  if (body.action === 'revoke') {
   if (typeof body.user_id !== 'string' || body.user_id === user.id) return reply(400, { error: 'Cannot revoke yourself' });
   const { data, error } = await client.from('team_members').delete().eq('user_id', body.user_id).select('user_id').single();
   if (error || !data) return reply(400, { error: 'Access removal failed' });
   return reply(200, { success: true });
  }
  return reply(400, { error: 'Unknown action' });
 } catch { return reply(500, { error: 'Request failed' }); }
});
