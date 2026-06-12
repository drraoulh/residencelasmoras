import { SITE, absoluteUrl } from '../../config/seo';

export function buildLodgingBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: SITE.legalName,
    alternateName: SITE.name,
    description: SITE.defaultDescription,
    url: absoluteUrl('/'),
    image: absoluteUrl(SITE.ogImage),
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressCountry: SITE.address.country,
    },
    priceRange: '$$',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking sécurisé', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Climatisation', value: true },
    ],
  };
}
