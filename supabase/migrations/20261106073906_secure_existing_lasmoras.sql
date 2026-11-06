-- Upgrade the existing Las Moras schema without renaming columns or deleting data.
create table public.team_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 email text not null,
 role text not null check (role in ('admin','manager'))
);
alter table public.team_members enable row level security;
revoke all on public.team_members from anon, authenticated;
grant select on public.team_members to authenticated;
grant all on public.team_members to service_role;
create schema if not exists private;
create function private.is_team_member() returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from public.team_members where user_id = auth.uid());
$$;
create function private.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select auth.uid() is not null and exists(select 1 from public.team_members where user_id = auth.uid() and role = 'admin');
$$;
revoke all on function private.is_team_member() from public;
revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_team_member() to anon, authenticated;
grant execute on function private.is_admin() to authenticated;
create policy team_read on public.team_members for select to authenticated using (user_id = (select auth.uid()) or (select private.is_admin()));
-- Preserve the two existing operators' access. The residence account owns team administration.
insert into public.team_members(user_id,email,role)
select id,email,case when lower(email)='h@lasmoras.com' then 'admin' else 'manager' end
from auth.users where lower(email) in ('h@lasmoras.com','kamgafrank3545@gmail.com');
alter table public.logements add column if not exists date_liberation date;
-- Remove permissive policies on the app tables before installing membership checks.
do $$ declare policy_record record; begin
 for policy_record in select schemaname,tablename,policyname from pg_policies
 where schemaname='public' and tablename in ('logements','reservations','contacts','gallery_images') loop
 execute format('drop policy %I on %I.%I',policy_record.policyname,policy_record.schemaname,policy_record.tablename);
 end loop;
end $$;
alter table public.logements enable row level security;
create policy logements_read on public.logements for select to anon,authenticated using (true);
create policy logements_insert on public.logements for insert to authenticated with check ((select private.is_team_member()));
create policy logements_update on public.logements for update to authenticated using ((select private.is_team_member())) with check ((select private.is_team_member()));
create policy logements_delete on public.logements for delete to authenticated using ((select private.is_team_member()));
revoke all on public.logements from anon,authenticated;
grant select on public.logements to anon,authenticated;
grant insert,update,delete on public.logements to authenticated;
-- Retain reservation and payment history when an operator deletes a property.
alter table public.reservations drop constraint reservations_logement_id_fkey;
alter table public.reservations add constraint reservations_logement_id_fkey foreign key(logement_id) references public.logements(id) on delete set null;
alter table public.reservations enable row level security;
revoke all on public.reservations from anon,authenticated;
grant select on public.reservations to authenticated;
grant insert (logement_id,client_nom,client_email,client_telephone,date_arrivee,date_depart) on public.reservations to anon,authenticated;
grant update (statut_reservation) on public.reservations to authenticated;
create policy reservations_read on public.reservations for select to authenticated using ((select private.is_team_member()));
create policy reservations_update on public.reservations for update to authenticated using ((select private.is_team_member())) with check ((select private.is_team_member()));
create policy reservations_insert on public.reservations for insert to anon,authenticated with check (
 statut_reservation='demande' and date_arrivee>=current_date and date_depart>date_arrivee
 and length(trim(client_nom)) between 1 and 150 and length(client_email) between 3 and 254
 and position('@' in client_email)>1 and length(client_telephone) between 1 and 50
 and exists(select 1 from public.logements l where l.id=logement_id and (l.statut='disponible' or (l.statut='libere_prochainement' and date_arrivee>=l.date_liberation)))
);
-- Compute trusted amounts and nights for new public requests. Never accept client pricing.
create function private.prepare_reservation() returns trigger language plpgsql security invoker set search_path = '' as $$
declare nightly_price numeric; begin
 select l.prix into nightly_price from public.logements l where l.id=new.logement_id;
 if nightly_price is null or nightly_price<=0 or new.date_depart<=new.date_arrivee then
 raise exception 'Invalid property or dates' using errcode='23514'; end if;
 new.nombre_nuits:=new.date_depart-new.date_arrivee;
 new.montant_total:=nightly_price*new.nombre_nuits;
 new.montant_paye:=0;
 new.statut_paiement:='non_paye';
 new.statut_reservation:='demande';
 return new;
end $$;
revoke all on function private.prepare_reservation() from public;
create trigger prepare_reservation before insert on public.reservations for each row execute function private.prepare_reservation();
create index if not exists reservations_logement_id_idx on public.reservations(logement_id);
-- Existing contact and gallery pages retain their public reads/inserts as appropriate.
alter table public.contacts enable row level security;
create policy contacts_insert on public.contacts for insert to anon,authenticated with check (
 length(trim(nom)) between 1 and 150 and length(email) between 3 and 254 and position('@' in email)>1
 and length(trim(sujet)) between 1 and 250 and length(trim(message)) between 1 and 10000 and coalesce(lu,false)=false
);
create policy contacts_team on public.contacts for all to authenticated using ((select private.is_team_member())) with check ((select private.is_team_member()));
revoke all on public.contacts from anon,authenticated;
grant insert(nom,email,sujet,message) on public.contacts to anon,authenticated;
grant select,update,delete on public.contacts to authenticated;
alter table public.gallery_images enable row level security;
create policy gallery_read on public.gallery_images for select to anon,authenticated using (visible=true or (select private.is_team_member()));
create policy gallery_team on public.gallery_images for all to authenticated using ((select private.is_team_member())) with check ((select private.is_team_member()));
-- Restrict existing upload policies; keep bucket configuration and public photos unchanged.
alter policy "Gallery storage admin insert" on storage.objects with check (bucket_id='gallery' and (select private.is_team_member()));
alter policy "Gallery storage admin update" on storage.objects using (bucket_id='gallery' and (select private.is_team_member())) with check (bucket_id='gallery' and (select private.is_team_member()));
alter policy "Gallery storage admin delete" on storage.objects using (bucket_id='gallery' and (select private.is_team_member()));
alter policy "Logements storage admin insert" on storage.objects with check (bucket_id='logements' and (select private.is_team_member()));
alter policy "Logements storage admin update" on storage.objects using (bucket_id='logements' and (select private.is_team_member())) with check (bucket_id='logements' and (select private.is_team_member()));
alter policy "Logements storage admin delete" on storage.objects using (bucket_id='logements' and (select private.is_team_member()));
-- Trigger helpers must not be callable as public RPC endpoints. Triggers still execute.
revoke execute on function public.invoke_send_email(jsonb) from public,anon,authenticated;
revoke execute on function public.trigger_send_email_contact() from public,anon,authenticated;
revoke execute on function public.trigger_send_email_reservation_insert() from public,anon,authenticated;
revoke execute on function public.trigger_send_email_reservation_confirmed() from public,anon,authenticated;
-- Close the wildcard-token bypass while preserving existing confirmation links.
create or replace function public.confirm_reservation_by_token(p_reservation_id uuid,p_token text)
returns boolean language plpgsql security definer set search_path='' as $$
begin
 if p_token is null or length(p_token)<16 or length(p_token)>128 or p_token !~ '^[a-zA-Z0-9_-]+$' then return false; end if;
 update public.reservations set statut_reservation='confirmee', notes=coalesce(notes,'')||E'\nConfirmée via lien WhatsApp.'
 where id=p_reservation_id and statut_reservation='demande'
 and notes ~ ('(^|[^a-zA-Z0-9_-])confirm:'||p_token||'($|[^a-zA-Z0-9_-])');
 return found;
end $$;
-- This endpoint deliberately remains callable with a secret, exact-match token.
notify pgrst,'reload schema';
