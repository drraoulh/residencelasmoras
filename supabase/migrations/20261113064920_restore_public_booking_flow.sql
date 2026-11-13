-- Restore public availability without exposing reservation IDs or client information.
create function private.get_availability_slots()
returns table(logement_id uuid,date_arrivee date,date_depart date,statut_reservation text)
language sql stable security definer set search_path='' as $$
 select r.logement_id,r.date_arrivee,r.date_depart,r.statut_reservation
 from public.reservations r
 where r.logement_id is not null and r.statut_reservation in ('confirmee','en_cours') and r.date_depart>current_date;
$$;
revoke all on function private.get_availability_slots() from public;
grant execute on function private.get_availability_slots() to anon,authenticated,service_role;
create function public.get_availability_slots()
returns table(logement_id uuid,date_arrivee date,date_depart date,statut_reservation text)
language sql stable security invoker set search_path='' as $$ select * from private.get_availability_slots(); $$;
revoke all on function public.get_availability_slots() from public;
grant execute on function public.get_availability_slots() to anon,authenticated,service_role;

-- A narrow public write endpoint: validate the request, compute prices via the existing
-- trigger, generate a random confirmation token and return only the new reference.
create function private.create_reservation_request(p_logement_id uuid,p_nom text,p_email text,p_telephone text,p_arrivee date,p_depart date)
returns jsonb language plpgsql security definer set search_path='' as $$
declare l public.logements%rowtype; reservation_id uuid; token text;
begin
 if p_arrivee is null or p_depart is null or p_arrivee<current_date or p_depart<=p_arrivee
 or p_nom is null or length(trim(p_nom)) not between 1 and 150
 or p_email is null or length(p_email) not between 3 and 254 or position('@' in p_email)<2
 or p_telephone is null or length(trim(p_telephone)) not between 1 and 50
 then raise exception 'Veuillez vérifier vos coordonnées et les dates du séjour.' using errcode='22023'; end if;
 select * into l from public.logements where id=p_logement_id for update;
 if not found or l.prix is null or l.prix<=0 then raise exception 'Logement introuvable.'; end if;
 if l.statut not in ('disponible','occupe','libere_prochainement')
 or (l.statut='libere_prochainement' and (l.date_liberation is null or p_arrivee<l.date_liberation))
 or (l.statut='occupe' and not exists(select 1 from public.reservations r where r.logement_id=l.id and r.statut_reservation in ('confirmee','en_cours') and r.date_depart>current_date))
 or exists(select 1 from public.reservations r where r.logement_id=l.id and r.statut_reservation in ('confirmee','en_cours') and r.date_arrivee<p_depart and r.date_depart>p_arrivee)
 then raise exception 'Ce logement n’est pas disponible pour ces dates.'; end if;
 token:=replace(gen_random_uuid()::text,'-','');
 insert into public.reservations(logement_id,client_nom,client_email,client_telephone,date_arrivee,date_depart,notes)
 values(l.id,trim(p_nom),trim(p_email),trim(p_telephone),p_arrivee,p_depart,'Demande en ligne — '||l.nom||' — confirm:'||token)
 returning id into reservation_id;
 return jsonb_build_object('id',reservation_id,'confirmToken',token);
end $$;
revoke all on function private.create_reservation_request(uuid,text,text,text,date,date) from public;
grant execute on function private.create_reservation_request(uuid,text,text,text,date,date) to anon,authenticated,service_role;
create function public.create_reservation_request(p_logement_id uuid,p_nom text,p_email text,p_telephone text,p_arrivee date,p_depart date)
returns jsonb language sql security invoker set search_path='' as $$
 select private.create_reservation_request(p_logement_id,p_nom,p_email,p_telephone,p_arrivee,p_depart);
$$;
revoke all on function public.create_reservation_request(uuid,text,text,text,date,date) from public;
grant execute on function public.create_reservation_request(uuid,text,text,text,date,date) to anon,authenticated,service_role;

-- Confirmation is an authenticated team action, not a PIN embedded in frontend JS.
create or replace function public.confirm_reservation_by_token(p_reservation_id uuid,p_token text)
returns boolean language plpgsql security invoker set search_path='' as $$
begin
 if not private.is_team_member() or p_token is null or length(p_token)<16 or length(p_token)>128 or p_token !~ '^[a-zA-Z0-9_-]+$' then return false; end if;
 update public.reservations set statut_reservation='confirmee'
 where id=p_reservation_id and statut_reservation='demande'
 and notes ~ ('(^|[^a-zA-Z0-9_-])confirm:'||p_token||'($|[^a-zA-Z0-9_-])');
 return found;
end $$;
revoke all on function public.confirm_reservation_by_token(uuid,text) from public,anon;
grant execute on function public.confirm_reservation_by_token(uuid,text) to authenticated;

create function private.check_reservation_confirmation() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
 if new.statut_reservation in ('confirmee','en_cours') and old.statut_reservation is distinct from new.statut_reservation then
  if new.logement_id is null then raise exception 'Le logement de cette réservation a été supprimé.'; end if;
  perform 1 from public.logements where id=new.logement_id for update;
  if exists(select 1 from public.reservations r where r.logement_id=new.logement_id and r.id<>new.id and r.statut_reservation in ('confirmee','en_cours') and r.date_arrivee<new.date_depart and r.date_depart>new.date_arrivee)
  then raise exception 'Ces dates sont déjà réservées pour ce logement.'; end if;
 end if;
 return new;
end $$;
revoke all on function private.check_reservation_confirmation() from public;
create trigger check_reservation_confirmation before update of statut_reservation on public.reservations
for each row execute function private.check_reservation_confirmation();
notify pgrst,'reload schema';
