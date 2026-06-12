/** Images statiques servies depuis /public (non bundlées, cache longue durée). */
export const STATIC_IMAGES = {
  hero: '/images/hero-lcp.jpeg',
  logoUi: '/images/logo-ui.jpeg',
  galleryPreview: [
    { src: '/images/gallery-preview-1.jpeg', label: 'Salon lumineux', category: 'Intérieurs' },
    { src: '/images/gallery-preview-2.jpeg', label: 'Espace de vie', category: 'Intérieurs' },
  ],
} as const;
