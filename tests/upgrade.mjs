import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const db = new PGlite();
const load = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
await db.exec(load("./fixtures/existing-schema.sql"));
const admin = "00000000-0000-0000-0000-000000000001",
  manager = "00000000-0000-0000-0000-000000000002",
  outsider = "00000000-0000-0000-0000-000000000003";
await db.exec(
  `insert into auth.users values ('${admin}','h@lasmoras.com'),('${manager}','kamgafrank3545@gmail.com'),('${outsider}','other@example.com');`,
);
await db.exec(
  "insert into public.logements(nom,type,prix,surface,photos) values('Existant','Studio',10000,20,array['photo1.jpg','photo2.jpg'])",
);
const property = (await db.query("select * from public.logements")).rows[0];
await db.exec(
  `insert into public.reservations(logement_id,client_nom,client_email,client_telephone,date_arrivee,date_depart,nombre_nuits,montant_total,montant_paye,statut_reservation) values('${property.id}','Existing','old@example.com','123','2026-01-01','2026-01-03',2,20000,15000,'terminee')`,
);
await db.exec(
  load("../supabase/migrations/20261106073906_secure_existing_lasmoras.sql"),
);
assert.equal(
  (await db.query("select montant_paye from public.reservations")).rows[0]
    .montant_paye,
  "15000",
);
const as = async (role, id = "") =>
  db.exec(
    `reset role;set role ${role};select set_config('request.jwt.claim.sub','${id}',false)`,
  );
const denied = async (sql) => assert.rejects(db.exec(sql));
await as("anon");
await denied("select * from public.reservations");
assert.equal((await db.query("select * from public.logements")).rows.length, 1);
const request = `insert into public.reservations(logement_id,client_nom,client_email,client_telephone,date_arrivee,date_depart) values('${property.id}','Client','client@example.com','123',current_date+1,current_date+4)`;
await db.exec(request);
await denied(
  `insert into public.reservations(logement_id,client_nom,client_email,client_telephone,date_arrivee,date_depart,statut_reservation) values('${property.id}','X','x@y.z','123',current_date+1,current_date+2,'confirmee')`,
);
await as("authenticated", outsider);
assert.equal(
  (await db.query("select * from public.reservations")).rows.length,
  0,
);
await denied(
  "insert into public.logements(nom,type,prix) values('bad','Studio',1)",
);
await denied(
  "insert into storage.objects values(gen_random_uuid(),'logements')",
);
await as("authenticated", manager);
assert.equal(
  (await db.query("select * from public.reservations")).rows.length,
  2,
);
assert.equal(
  (await db.query("select * from public.team_members")).rows.length,
  1,
);
await denied("update public.team_members set role='admin'");
const fresh = (
  await db.query(
    "select nombre_nuits,montant_total,statut_reservation from public.reservations where client_nom='Client'",
  )
).rows[0];
assert.equal(fresh.nombre_nuits, 3);
assert.equal(fresh.montant_total, "30000");
assert.equal(fresh.statut_reservation, "demande");
await db.exec(
  `update public.logements set photos=array['photo2.jpg','photo1.jpg'] where id='${property.id}'`,
);
await as("anon");
assert.equal(
  (await db.query("select photos from public.logements")).rows[0].photos[0],
  "photo2.jpg",
);
await as("authenticated", admin);
assert.equal(
  (await db.query("select * from public.team_members")).rows.length,
  2,
);
await db.exec(`delete from public.logements where id='${property.id}'`);
assert.equal(
  (
    await db.query(
      "select * from public.reservations where logement_id is null",
    )
  ).rows.length,
  2,
);
assert.equal(
  (
    await db.query(
      "select public.confirm_reservation_by_token(gen_random_uuid(),'%') as ok",
    )
  ).rows[0].ok,
  false,
);
await db.exec("reset role");
await db.exec(`delete from public.team_members where user_id='${manager}'`);
await as("authenticated", manager);
assert.equal(
  (await db.query("select * from public.reservations")).rows.length,
  0,
);
await db.exec("reset role");
await db.exec(
  load("../supabase/migrations/20261113064920_restore_public_booking_flow.sql"),
);
await db.exec(
  "insert into public.logements(nom,type,prix,photos) values('WhatsApp Studio','Studio',12500,array['cover.jpg'])",
);
const bookingProperty = (
  await db.query("select id from public.logements where nom='WhatsApp Studio'")
).rows[0].id;
const makeRequest = `select public.create_reservation_request('${bookingProperty}','Voyageur','visitor@example.com','+237600000000',current_date+10,current_date+12) as request`;
await as("anon");
const firstRequest = (await db.query(makeRequest)).rows[0].request;
const secondRequest = (await db.query(makeRequest)).rows[0].request;
assert.match(firstRequest.confirmToken, /^[a-f0-9]{32}$/);
assert.equal(
  (await db.query("select * from public.get_availability_slots()")).rows.length,
  0,
);
await denied("select client_email from public.reservations");
await denied(
  `select public.confirm_reservation_by_token('${firstRequest.id}','${firstRequest.confirmToken}')`,
);
await denied(
  `select public.create_reservation_request('${bookingProperty}','X','invalid','1',current_date+10,current_date+12)`,
);
await as("authenticated", outsider);
assert.equal(
  (
    await db.query(
      `select public.confirm_reservation_by_token('${firstRequest.id}','${firstRequest.confirmToken}') as confirmed`,
    )
  ).rows[0].confirmed,
  false,
);
await as("authenticated", admin);
assert.equal(
  (
    await db.query(
      `select public.confirm_reservation_by_token('${firstRequest.id}','${firstRequest.confirmToken}') as confirmed`,
    )
  ).rows[0].confirmed,
  true,
);
assert.equal(
  (
    await db.query(
      `select montant_total from public.reservations where id='${firstRequest.id}'`,
    )
  ).rows[0].montant_total,
  "25000",
);
await denied(
  `select public.confirm_reservation_by_token('${secondRequest.id}','${secondRequest.confirmToken}')`,
);
await as("anon");
const slots = (await db.query("select * from public.get_availability_slots()"))
  .rows;
assert.equal(slots.length, 1);
assert.deepEqual(
  Object.keys(slots[0]).sort(),
  ["logement_id", "date_arrivee", "date_depart", "statut_reservation"].sort(),
);
await denied(makeRequest);
await db.close();
console.log(
  "PASS restored public booking: private availability projection, server prices and tokens, team-only confirmation, overlapping confirmations rejected",
);
