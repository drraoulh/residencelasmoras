/** URL publique du site (production). Utilisée pour les liens WhatsApp, auth Supabase, etc. */
export function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function getAuthCallbackUrl() {
  return `${getSiteUrl()}/auth/callback`;
}
