export type FaqCategory = 'Hébergement' | 'Services' | 'Réservation' | 'Pratique';

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

export const faqItems: FaqItem[] = [
  {
    category: 'Hébergement',
    question: 'Quels types de logements propose LAS MORAS ?',
    answer:
      'Nous proposons des studios, chambres et appartements meublés entièrement équipés. Chaque logement possède une identité propre, inspirée de destinations du monde — Cappadocia, Cancun, Galápagos et d\'autres univers thématiques.',
  },
  {
    category: 'Services',
    question: 'Quels services sont inclus dans la réservation ?',
    answer:
      'Wi-Fi fibre, IPTV, eau, climatisation, sécurité 24h/24 avec vidéosurveillance et parking sécurisé. Location de voitures disponible sur demande pour vos déplacements à Yaoundé (ville, aéroport, courses).',
  },
  {
    category: 'Pratique',
    question: 'Où se situe la résidence ?',
    answer:
      'LAS MORAS est au carrefour Nkolzie, Mendong, à Yaoundé — un quartier calme, bien desservi et facile d\'accès. Un lien Google Maps est disponible sur la page Contact pour préparer votre itinéraire.',
  },
  {
    category: 'Réservation',
    question: 'Comment réserver un séjour ?',
    answer:
      'Parcourez le catalogue en ligne, choisissez vos dates et envoyez une demande de réservation. Vous pouvez aussi nous contacter par WhatsApp au +237 6 89 88 82 91 ou via le formulaire Contact. Notre équipe vérifie les disponibilités et vous confirme rapidement.',
  },
  {
    category: 'Réservation',
    question: 'Quels sont les horaires d\'arrivée et de départ ?',
    answer:
      'L\'arrivée est généralement à partir de 14h et le départ avant 12h. Pour un early check-in ou un late check-out, contactez-nous à l\'avance : nous faisons notre possible pour accommoder votre planning.',
  },
  {
    category: 'Réservation',
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer:
      'Espèces, Mobile Money, virement bancaire et carte selon les cas. Un acompte peut être demandé pour confirmer la réservation. Le solde se règle selon les conditions communiquées par notre équipe lors de la confirmation.',
  },
  {
    category: 'Hébergement',
    question: 'Pourquoi choisir LAS MORAS ?',
    answer:
      'Le confort d\'un hôtel de standing avec l\'intimité d\'une résidence privée. Cadre sécurisé, logements décorés avec soin, connexion performante et accueil attentif 7j/7. Notre promesse : « L\'Art de Vivre Naturellement ».',
  },
];
