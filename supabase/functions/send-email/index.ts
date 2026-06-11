import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ContactRecord = {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  created_at?: string;
};

type ReservationRecord = {
  id: string;
  logement_id: string;
  client_nom: string;
  client_email: string;
  client_telephone: string;
  date_arrivee: string;
  date_depart: string;
  nombre_nuits: number;
  montant_total: number;
  statut_reservation?: string;
  notes?: string;
  created_at?: string;
};

type EmailJob =
  | { type: 'contact'; record: ContactRecord }
  | { type: 'reservation_request'; record: ReservationRecord }
  | { type: 'reservation_confirmed'; record: ReservationRecord };

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDateFr(isoDate: string) {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount);
}

function reservationRef(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function isClientEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return normalized.includes('@') && !normalized.endsWith('@lasmoras.local');
}

function emailLayout(params: {
  siteUrl: string;
  title: string;
  preheader: string;
  bodyHtml: string;
}) {
  const logoUrl = `${params.siteUrl.replace(/\/$/, '')}/logo-lasmoras.jpeg`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(params.title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Inter,Arial,sans-serif;color:#1a1a1a;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(params.preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 16px;text-align:center;background:#ffffff;">
              <img src="${logoUrl}" alt="LAS MORAS — L'Art de Vivre Naturellement" width="120" style="display:block;margin:0 auto 12px;max-width:120px;height:auto;border-radius:12px;" />
              <p style="margin:0;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#78716c;">Résidence meublée · Yaoundé</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;">
              ${params.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#fafaf9;border-top:1px solid #e7e5e4;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#78716c;">LAS MORAS — L'Art de Vivre Naturellement</p>
              <p style="margin:0;font-size:12px;color:#78716c;">Nkolzie, Mendong, Yaoundé · +237 6 89 88 82 91</p>
              <p style="margin:10px 0 0;font-size:12px;">
                <a href="${params.siteUrl}" style="color:#c41e1e;text-decoration:none;">www.residencelasmoras.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendBrevoEmail(params: {
  apiKey: string;
  senderName: string;
  senderEmail: string;
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent: string;
}) {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': params.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: params.senderName, email: params.senderEmail },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo ${response.status}: ${detail}`);
  }
}

function buildContactAdminEmail(record: ContactRecord, siteUrl: string) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#1a1a1a;">Nouveau message contact</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534e;">Un visiteur vient d'écrire via le formulaire du site.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;">
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;">Nom</td><td style="padding:14px 16px;font-size:14px;font-weight:600;color:#1a1a1a;">${escapeHtml(record.nom)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Email</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${escapeHtml(record.email)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Sujet</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${escapeHtml(record.sujet)}</td></tr>
    </table>
    <div style="margin-top:18px;padding:16px;border-radius:12px;background:#fff7f7;border:1px solid #fecaca;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#c41e1e;">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#44403c;white-space:pre-wrap;">${escapeHtml(record.message)}</p>
    </div>`;

  return emailLayout({
    siteUrl,
    title: 'Nouveau message contact',
    preheader: `${record.nom} — ${record.sujet}`,
    bodyHtml,
  });
}

function buildContactClientEmail(record: ContactRecord, siteUrl: string) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#1a1a1a;">Message bien reçu</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#57534e;">
      Bonjour ${escapeHtml(record.nom)},<br /><br />
      Merci pour votre message concernant <strong>${escapeHtml(record.sujet)}</strong>.
      Notre équipe vous répondra dans les plus brefs délais.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#57534e;">
      Pour une demande urgente, vous pouvez aussi nous écrire sur WhatsApp au
      <a href="https://wa.me/237689888291" style="color:#c41e1e;text-decoration:none;">+237 6 89 88 82 91</a>.
    </p>`;

  return emailLayout({
    siteUrl,
    title: 'Nous avons bien reçu votre message',
    preheader: 'LAS MORAS vous répondra rapidement.',
    bodyHtml,
  });
}

function buildReservationSummary(record: ReservationRecord, logementNom: string) {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:12px;">
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;">Référence</td><td style="padding:14px 16px;font-size:14px;font-weight:600;color:#1a1a1a;">${reservationRef(record.id)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Logement</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${escapeHtml(logementNom)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Client</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${escapeHtml(record.client_nom)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Téléphone</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${escapeHtml(record.client_telephone)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Arrivée</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${formatDateFr(record.date_arrivee)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Départ</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${formatDateFr(record.date_depart)}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Nuits</td><td style="padding:14px 16px;font-size:14px;color:#1a1a1a;border-top:1px solid #e7e5e4;">${record.nombre_nuits}</td></tr>
      <tr><td style="padding:14px 16px;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;">Montant</td><td style="padding:14px 16px;font-size:14px;font-weight:600;color:#c41e1e;border-top:1px solid #e7e5e4;">${formatMoney(record.montant_total)} FCFA</td></tr>
    </table>`;
}

function buildReservationRequestAdminEmail(
  record: ReservationRecord,
  logementNom: string,
  siteUrl: string,
) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#1a1a1a;">Nouvelle demande de réservation</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534e;">Une demande vient d'être enregistrée sur le site.</p>
    ${buildReservationSummary(record, logementNom)}`;

  return emailLayout({
    siteUrl,
    title: 'Nouvelle demande de réservation',
    preheader: `${record.client_nom} — ${logementNom}`,
    bodyHtml,
  });
}

function buildReservationRequestClientEmail(
  record: ReservationRecord,
  logementNom: string,
  siteUrl: string,
) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#1a1a1a;">Demande enregistrée</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#57534e;">
      Bonjour ${escapeHtml(record.client_nom)},<br /><br />
      Nous avons bien reçu votre demande de réservation pour <strong>${escapeHtml(logementNom)}</strong>.
      Notre équipe vous contactera rapidement pour confirmer les disponibilités.
    </p>
    ${buildReservationSummary(record, logementNom)}
    <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#57534e;">
      Besoin d'une réponse immédiate ?
      <a href="https://wa.me/237689888291" style="color:#c41e1e;text-decoration:none;">Contactez-nous sur WhatsApp</a>.
    </p>`;

  return emailLayout({
    siteUrl,
    title: 'Votre demande de réservation',
    preheader: `Demande reçue pour ${logementNom}`,
    bodyHtml,
  });
}

function buildReservationConfirmedClientEmail(
  record: ReservationRecord,
  logementNom: string,
  siteUrl: string,
) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#1a1a1a;">Réservation confirmée</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#57534e;">
      Bonjour ${escapeHtml(record.client_nom)},<br /><br />
      Votre séjour à <strong>${escapeHtml(logementNom)}</strong> est confirmé. Nous avons hâte de vous accueillir à LAS MORAS.
    </p>
    ${buildReservationSummary(record, logementNom)}
    <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:#57534e;">
      Pour toute question avant votre arrivée, répondez à cet email ou écrivez-nous sur WhatsApp.
    </p>`;

  return emailLayout({
    siteUrl,
    title: 'Votre réservation est confirmée',
    preheader: `Séjour confirmé du ${formatDateFr(record.date_arrivee)} au ${formatDateFr(record.date_depart)}`,
    bodyHtml,
  });
}

function buildReservationConfirmedAdminEmail(
  record: ReservationRecord,
  logementNom: string,
  siteUrl: string,
) {
  const bodyHtml = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#1a1a1a;">Réservation confirmée en ligne</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#57534e;">Les dates ont été fermées sur le site après confirmation équipe.</p>
    ${buildReservationSummary(record, logementNom)}`;

  return emailLayout({
    siteUrl,
    title: 'Réservation confirmée',
    preheader: `${record.client_nom} — ${logementNom}`,
    bodyHtml,
  });
}

async function getLogementNom(supabase: ReturnType<typeof createClient>, logementId: string) {
  const { data, error } = await supabase.from('logements').select('nom').eq('id', logementId).maybeSingle();
  if (error) throw error;
  return data?.nom ?? 'Logement LAS MORAS';
}

function authorizeRequest(req: Request) {
  const authHeader = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const webhookSecret = Deno.env.get('EMAIL_WEBHOOK_SECRET');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (webhookSecret && authHeader === webhookSecret) return true;
  if (serviceRoleKey && authHeader === serviceRoleKey) return true;
  return false;
}

async function handleJob(job: EmailJob) {
  const apiKey = Deno.env.get('BREVO_API_KEY');
  const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
  const senderName = Deno.env.get('BREVO_SENDER_NAME') ?? 'LAS MORAS';
  const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') ?? senderEmail;
  const siteUrl = Deno.env.get('SITE_URL') ?? 'https://www.residencelasmoras.com';

  if (!apiKey || !senderEmail) {
    throw new Error('Secrets Brevo manquants (BREVO_API_KEY, BREVO_SENDER_EMAIL).');
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const sent: string[] = [];

  if (job.type === 'contact') {
    const record = job.record;
    const adminHtml = buildContactAdminEmail(record, siteUrl);
    await sendBrevoEmail({
      apiKey,
      senderName,
      senderEmail,
      to: [{ email: adminEmail!, name: senderName }],
      subject: `[Contact] ${record.sujet} — ${record.nom}`,
      htmlContent: adminHtml,
      textContent: `Nouveau message de ${record.nom} (${record.email})\nSujet: ${record.sujet}\n\n${record.message}`,
    });
    sent.push('admin');

    if (isClientEmail(record.email)) {
      const clientHtml = buildContactClientEmail(record, siteUrl);
      await sendBrevoEmail({
        apiKey,
        senderName,
        senderEmail,
        to: [{ email: record.email, name: record.nom }],
        subject: 'Nous avons bien reçu votre message — LAS MORAS',
        htmlContent: clientHtml,
        textContent: `Bonjour ${record.nom}, nous avons bien reçu votre message. Notre équipe vous répondra rapidement.`,
      });
      sent.push('client');
    }

    return sent;
  }

  const logementNom = await getLogementNom(supabase, job.record.logement_id);
  const record = job.record;

  if (job.type === 'reservation_request') {
    const adminHtml = buildReservationRequestAdminEmail(record, logementNom, siteUrl);
    await sendBrevoEmail({
      apiKey,
      senderName,
      senderEmail,
      to: [{ email: adminEmail!, name: senderName }],
      subject: `[Réservation] Nouvelle demande — ${record.client_nom}`,
      htmlContent: adminHtml,
      textContent: `Nouvelle demande de ${record.client_nom} pour ${logementNom}.`,
    });
    sent.push('admin');

    if (isClientEmail(record.client_email)) {
      const clientHtml = buildReservationRequestClientEmail(record, logementNom, siteUrl);
      await sendBrevoEmail({
        apiKey,
        senderName,
        senderEmail,
        to: [{ email: record.client_email, name: record.client_nom }],
        subject: 'Demande de réservation reçue — LAS MORAS',
        htmlContent: clientHtml,
        textContent: `Bonjour ${record.client_nom}, votre demande pour ${logementNom} a bien été reçue.`,
      });
      sent.push('client');
    }

    return sent;
  }

  const adminHtml = buildReservationConfirmedAdminEmail(record, logementNom, siteUrl);
  await sendBrevoEmail({
    apiKey,
    senderName,
    senderEmail,
    to: [{ email: adminEmail!, name: senderName }],
    subject: `[Confirmée] ${record.client_nom} — ${logementNom}`,
    htmlContent: adminHtml,
    textContent: `Réservation confirmée pour ${record.client_nom} — ${logementNom}.`,
  });
  sent.push('admin');

  if (isClientEmail(record.client_email)) {
    const clientHtml = buildReservationConfirmedClientEmail(record, logementNom, siteUrl);
    await sendBrevoEmail({
      apiKey,
      senderName,
      senderEmail,
      to: [{ email: record.client_email, name: record.client_nom }],
      subject: 'Votre réservation est confirmée — LAS MORAS',
      htmlContent: clientHtml,
      textContent: `Bonjour ${record.client_nom}, votre réservation pour ${logementNom} est confirmée.`,
    });
    sent.push('client');
  }

  return sent;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!authorizeRequest(req)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const job = (await req.json()) as EmailJob;

    if (!job?.type || !job?.record) {
      return new Response(JSON.stringify({ error: 'Payload invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sent = await handleJob(job);

    return new Response(JSON.stringify({ ok: true, sent }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('send-email error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Erreur interne',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
