import type { Logement } from '../types';

const TYPE_ORDER = ['Studio', 'Appartement', 'Villa', 'Chambre'] as const;

function typeSortIndex(type: string): number {
  const idx = TYPE_ORDER.indexOf(type as (typeof TYPE_ORDER)[number]);
  return idx === -1 ? TYPE_ORDER.length : idx;
}

function logementCreatedAt(logement: Logement): number {
  const raw = logement.created_at ?? (logement as Logement & { dateCreation?: string }).dateCreation;
  return raw ? new Date(raw).getTime() : 0;
}

function compareLogementPriority(a: Logement, b: Logement): number {
  const statutScore = (statut: Logement['statut']) =>
    statut === 'disponible' ? 0 : statut === 'occupe' ? 1 : 2;
  const statutDiff = statutScore(a.statut) - statutScore(b.statut);
  if (statutDiff !== 0) return statutDiff;
  return logementCreatedAt(b) - logementCreatedAt(a);
}

/** One representative logement per type, preferring disponible units. */
export function pickFeaturedLogementsByType(logements: Logement[], limit = 3): Logement[] {
  const byType = new Map<string, Logement[]>();

  for (const logement of logements) {
    const type = logement.type.trim() || 'Autre';
    const list = byType.get(type) ?? [];
    list.push(logement);
    byType.set(type, list);
  }

  const sortedTypes = [...byType.keys()].sort(
    (a, b) => typeSortIndex(a) - typeSortIndex(b) || a.localeCompare(b, 'fr'),
  );

  const picked: Logement[] = [];
  for (const type of sortedTypes) {
    if (picked.length >= limit) break;
    const best = [...(byType.get(type) ?? [])].sort(compareLogementPriority)[0];
    if (best) picked.push(best);
  }

  return picked;
}
