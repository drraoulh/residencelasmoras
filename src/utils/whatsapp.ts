import { formatDateFr } from './availability';

export const WHATSAPP_PHONE = '237689888291';

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_PHONE}`;

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

interface ReservationWhatsAppParams {
  logementNom: string;
  logementType?: string;
  prix?: number;
  arrivee?: string;
  depart?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  confirmUrl?: string;
  reservationRef?: string;
}

export function buildReservationWhatsAppMessage({
  logementNom,
  logementType,
  prix,
  arrivee,
  depart,
  prenom,
  nom,
  email,
  telephone,
  confirmUrl,
  reservationRef,
}: ReservationWhatsAppParams) {
  const lines = [
    'Bonjour LAS MORAS,',
    '',
    'Je souhaite réserver :',
    `• Appartement choisi : ${logementNom}`,
  ];

  if (logementType) lines.push(`• Type : ${logementType}`);
  if (prix) lines.push(`• Tarif : ${prix.toLocaleString('fr-FR')} FCFA / nuit`);
  if (arrivee) lines.push(`• Arrivée : ${formatDateFr(arrivee)}`);
  if (depart) lines.push(`• Départ : ${formatDateFr(depart)}`);
  if (!depart && arrivee) lines.push('• Départ : à préciser');

  const clientName = [prenom, nom].filter(Boolean).join(' ').trim();
  if (clientName || email || telephone) {
    lines.push('', 'Mes coordonnées :');
    if (clientName) lines.push(`• Nom : ${clientName}`);
    if (email) lines.push(`• Email : ${email}`);
    if (telephone) lines.push(`• Téléphone : ${telephone}`);
  }

  lines.push('', 'Merci de me confirmer la disponibilité.');

  if (confirmUrl && reservationRef) {
    lines.push(
      '',
      '——— Équipe LAS MORAS ———',
      `Réf. ${reservationRef}`,
      'Après accord WhatsApp, confirmer ici (code équipe requis) :',
      confirmUrl,
    );
  }

  return lines.join('\n');
}

export function buildReservationWhatsAppUrl(params: ReservationWhatsAppParams) {
  return buildWhatsAppUrl(buildReservationWhatsAppMessage(params));
}

export function openReservationWhatsApp(params: ReservationWhatsAppParams) {
  window.open(buildReservationWhatsAppUrl(params), '_blank', 'noopener,noreferrer');
}
