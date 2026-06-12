import { getSiteUrl } from '../utils/siteUrl';

export const SITE = {
  name: 'LAS MORAS',
  tagline: "L'Art de Vivre Naturellement",
  legalName: 'Résidence LAS MORAS',
  locale: 'fr_CM',
  defaultTitle: "LAS MORAS — L'Art de Vivre Naturellement | Résidence meublée Yaoundé",
  defaultDescription:
    'Résidence d\'appartements meublés de standing à Yaoundé (Mendong). Location courte et longue durée, Wi-Fi, sécurité 24/7. LAS MORAS — L\'Art de Vivre Naturellement.',
  keywords:
    'résidence meublée Yaoundé, appartement meublé Yaoundé, location Mendong, LAS MORAS, hébergement Cameroun',
  ogImage: '/logo-lasmoras.jpeg',
  phone: '+237689888291',
  email: 'contactlasmoras@gmail.com',
  address: {
    street: 'Nkolzie, Mendong',
    city: 'Yaoundé',
    country: 'Cameroun',
  },
} as const;

export function absoluteUrl(path = '/') {
  const base = getSiteUrl() || 'https://www.residencelasmoras.com';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${normalized === '/' ? '' : normalized}`;
}

export function buildPageTitle(pageTitle: string) {
  if (pageTitle.includes('LAS MORAS')) return pageTitle;
  return `${pageTitle} | ${SITE.name}`;
}

export const PAGE_SEO = {
  home: {
    title: buildPageTitle('Résidence meublée à Yaoundé'),
    description:
      'Appartements et studios meublés de standing à Yaoundé. Réservez votre séjour à la Résidence LAS MORAS — confort, sécurité et assistance 7j/7.',
    path: '/',
  },
  catalogue: {
    title: buildPageTitle('Catalogue — Appartements meublés'),
    description:
      'Parcourez le catalogue LAS MORAS : appartements thématiques meublés à Yaoundé. Filtrez par dates, type de bien et budget.',
    path: '/catalogue',
  },
  galerie: {
    title: buildPageTitle('Galerie photos'),
    description:
      'Visitez la Résidence LAS MORAS en images : façades, intérieurs design et ambiance de nos logements meublés à Yaoundé.',
    path: '/galerie',
  },
  about: {
    title: buildPageTitle('À propos'),
    description:
      'LAS MORAS, résidence meublée à Mendong (Yaoundé). Six univers thématiques, services premium et accueil chaleureux.',
    path: '/a-propos',
  },
  contact: {
    title: buildPageTitle('Contact & réservation'),
    description:
      'Contactez LAS MORAS par WhatsApp, téléphone ou email. Nkolzie, Mendong — Yaoundé. Réponse rapide, 7 jours sur 7.',
    path: '/contact',
  },
  notFound: {
    title: buildPageTitle('Page introuvable'),
    description: 'La page demandée est introuvable sur le site de la Résidence LAS MORAS à Yaoundé.',
    path: '',
    noIndex: true,
  },
} as const;
